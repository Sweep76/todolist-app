import styles from '../styles/HomeScreenStyle'
import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  Alert,
  TextInput,
} from 'react-native'
import { supabase } from '../lib/supabase'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/AppNavigator'

type Task = {
  id: string
  task_name: string
  task_details: string | null
  is_completed: boolean
}

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>

export default function HomeScreen({ navigation }: Props) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  const [taskName, setTaskName] = useState('')
  const [taskDetails, setTaskDetails] = useState('')
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
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

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      Alert.alert('Logout error', error.message)
    } else {
      navigation.replace('Login')
    }
  }

  const handleAddOrUpdateTask = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
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

  const renderTask = ({ item }: { item: Task }) => (
    <View style={styles.taskContainer}>
      <Text style={styles.taskName}>{item.task_name}</Text>
      <Text style={styles.taskDetails}>{item.task_details}</Text>
      <Text>Status: {item.is_completed ? 'Completed' : 'Pending'}</Text>

      <View style={styles.buttonRow}>
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
      <Text style={styles.title}>Your Tasks</Text>
      <Button title="Log Out" onPress={handleLogout} />

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
          data={tasks}
          renderItem={renderTask}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  )
}

