import styles from '../styles/HomeScreenStyle'
import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Button,
  FlatList,
  Alert,
  TextInput,
} from 'react-native'
import { supabase } from '../lib/supabase'
import { CompositeScreenProps } from '@react-navigation/native'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { TabParamList, RootStackParamList } from '../navigation/AppNavigator' // adjust the import path
import { fetchUserDisplayName } from '../lib/user'
import { useIsFocused } from '@react-navigation/native'; // Import the hook for focus


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
  const incompleteTasks = tasks.filter(task => !task.is_completed)

  useEffect(() => {
    const loadData = async () => {
      await fetchUserDisplayName()
      await fetchTasks()
    }
  
    loadData()
  }, [])
  
  const isFocused = useIsFocused(); // Hook to detect if screen is focused

  // Use another useEffect to trigger refresh when HomeScreen is focused
  useEffect(() => {
    if (isFocused) {
      fetchTasks(); // Trigger the fetch whenever screen comes into focus
    }
  }, [isFocused]); // 
  const fetchUserDisplayName = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
  
    const { data, error } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single()
  
    if (error) {
      Alert.alert('Error fetching user display name', error.message)
    } else {
      setDisplayName(data?.full_name)
    }
  }
  

  const fetchTasks = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)

    if (error) {
      Alert.alert('Error fetching tasks', error.message)
    } else {
      setTasks(data)
    }

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

      if (error) {
        Alert.alert('Error updating task', error.message)
      } else {
        resetForm()
        fetchTasks()
      }
    } else {
      const { error } = await supabase.from('tasks').insert([
        {
          user_id: user.id,
          task_name: taskName,
          task_details: taskDetails,
          is_completed: false,
        },
      ])

      if (error) {
        Alert.alert('Error adding task', error.message)
      } else {
        resetForm()
        fetchTasks()
      }
    }
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
  }

  const confirmDeleteTask = (id: string) => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => handleDeleteTask(id),
      },
    ])
  }

  const handleDeleteTask = async (id: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id)
    if (error) {
      Alert.alert('Delete Error', error.message)
    } else {
      fetchTasks()
    }
  }

  const handleToggleComplete = async (task: Task) => {
    const { error } = await supabase
      .from('tasks')
      .update({ is_completed: !task.is_completed })
      .eq('id', task.id)

    if (error) {
      Alert.alert('Error updating status', error.message)
    } else {
      fetchTasks()
    }
  }

  const renderTask = ({ item }: { item: Task }) => (
    <View style={styles.taskContainer}>
      <Text style={styles.taskName}>{item.task_name}</Text>
      <Text style={styles.taskDetails}>{item.task_details}</Text>
      <Text>Status: {item.is_completed ? 'Completed' : 'Pending'}</Text>

      <View style={styles.buttonRow}>
        <Button
          title={item.is_completed ? 'Mark as Pending' : 'Mark as Complete'}
          onPress={() => handleToggleComplete(item)}
        />
        <Button title="Edit" onPress={() => handleEditTask(item)} />
        <Button
          title="Delete"
          color="red"
          onPress={() => confirmDeleteTask(item.id)}
        />
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {displayName || 'User'}!</Text>
      <View style={styles.form}>
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
        <Button
          title={editingTaskId ? 'Save Changes' : 'Add Task'}
          onPress={handleAddOrUpdateTask}
        />
        {editingTaskId && (
          <Button title="Cancel Edit" color="gray" onPress={resetForm} />
        )}
      </View>

      {loading ? (
        <Text>Loading tasks...</Text>
      ) : (
        <FlatList
          data={incompleteTasks}
          renderItem={renderTask}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  )
}
