import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Alert,
  TextInput,
  FlatList,
  Modal,
  TouchableOpacity,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../lib/supabase'
import { useIsFocused } from '@react-navigation/native'
import { CompositeScreenProps } from '@react-navigation/native'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { TabParamList, RootStackParamList } from '../navigation/AppNavigator'
import styles from '../styles/HomeScreenStyle'
import { BackHandler, ToastAndroid, Platform } from 'react-native'


type Task = {
  id: string
  task_name: string
  task_details: string | null
  is_completed: boolean
}

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>

export default function HomeScreen({ navigation }: Props) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [taskName, setTaskName] = useState('')
  const [taskDetails, setTaskDetails] = useState('')
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [displayName, setDisplayName] = useState<string | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const isFocused = useIsFocused()
  const incompleteTasks = tasks.filter(task => !task.is_completed)

  useEffect(() => {
    const loadData = async () => {
      await fetchUserDisplayName()
      await fetchTasks()
    }
    loadData()
  }, [])

  
  useEffect(() => {
    let backPressedOnce = false;
  
    const onBackPress = () => {
      // If on the home screen, prompt the user to press back again to exit
      if (navigation.canGoBack()) {
        navigation.goBack();
        return true; // Prevent default back behavior
      }
  
      if (backPressedOnce) {
        BackHandler.exitApp();
        return true;
      }
  
      backPressedOnce = true;
      ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
  
      setTimeout(() => {
        backPressedOnce = false;
      }, 2000);
  
      return true;
    };
  
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
    }
  
    return () => {
      if (Platform.OS === 'android') {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      }
    };
  }, [navigation]);

  useEffect(() => {
    if (isFocused) fetchTasks()
  }, [isFocused])

  const fetchUserDisplayName = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data, error } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single()
    if (error) Alert.alert('Error fetching user name', error.message)
    else setDisplayName(data?.full_name)
  }

  const fetchTasks = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
    if (error) Alert.alert('Error fetching tasks', error.message)
    else setTasks(data)
    setLoading(false)
  }

  const handleAddOrUpdateTask = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    if (!taskName.trim()) {
      Alert.alert('Missing fields', 'Please enter a task name.')
      return
    }

    if (editingTaskId) {
      const { error } = await supabase
        .from('tasks')
        .update({ task_name: taskName, task_details: taskDetails })
        .eq('id', editingTaskId)
      if (error) Alert.alert('Update error', error.message)
    } else {
      const { error } = await supabase.from('tasks').insert([{
        user_id: user.id,
        task_name: taskName,
        task_details: taskDetails,
        is_completed: false,
      }])
      if (error) Alert.alert('Add error', error.message)
    }
    resetForm()
    fetchTasks()
    setModalVisible(false)
  }

  const resetForm = () => {
    setTaskName('')
    setTaskDetails('')
    setEditingTaskId(null)
  }

  const handleEditTask = (task: Task) => {
    setTaskName(task.task_name)
    setTaskDetails(task.task_details || '')
    setEditingTaskId(task.id)
    setModalVisible(true)
  }

  const confirmDeleteTask = (id: string) => {
    Alert.alert('Delete Task', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => handleDeleteTask(id) },
    ])
  }

  const handleDeleteTask = async (id: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id)
    if (error) Alert.alert('Delete Error', error.message)
    else fetchTasks()
  }

  const handleToggleComplete = async (task: Task) => {
    const { error } = await supabase
      .from('tasks')
      .update({ is_completed: !task.is_completed })
      .eq('id', task.id)
    if (error) Alert.alert('Status error', error.message)
    else fetchTasks()
  }

  const renderTask = ({ item }: { item: Task }) => (
    <View style={styles.taskContainer}>
      <View style={{ flex: 1 }}>
        <Text style={styles.taskName}>{item.task_name}</Text>
        <Text style={styles.taskDetails}>{item.task_details}</Text>
        <Text>Status: {item.is_completed ? '✅ Completed' : '⌛ Pending'}</Text>
      </View>
      <View style={styles.iconGroup}>
      <TouchableOpacity onPress={() => confirmDeleteTask(item.id)}>
          <Ionicons name="trash-outline" size={24} color="red" />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => handleEditTask(item)}>
          <Ionicons name="create-outline" size={24} color="blue" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleToggleComplete(item)}>
          <Ionicons
            name={item.is_completed ? 'arrow-undo' : 'checkbox-outline'}
            size={24}
            color="green"
          />
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {displayName || 'User'}!</Text>

      {loading ? (
        <Text>Loading tasks...</Text>
      ) : (
        <FlatList
          data={incompleteTasks}
          renderItem={renderTask}
          keyExtractor={(item) => item.id}
        />
      )}

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          resetForm()
          setModalVisible(false)
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingTaskId ? 'Edit Task' : 'New Task'}
            </Text>
            <TextInput
              placeholder="Task Name"
              style={styles.input}
              value={taskName}
              onChangeText={setTaskName}
            />
            <TextInput
              placeholder="Task Details"
              style={styles.input}
              value={taskDetails}
              onChangeText={setTaskDetails}
            />
            <View style={styles.modalButtonGroup}>
              <TouchableOpacity style={styles.confirmButton} onPress={handleAddOrUpdateTask}>
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  resetForm()
                  setModalVisible(false)
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>
    </View>
  )
}
