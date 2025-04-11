// components/AddTask.tsx
import React, { useState } from 'react'
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native'
import { supabase } from '../lib/supabase'

interface AddTaskProps {
  onTaskAdded: () => void // Callback to refresh tasks
}

const AddTask: React.FC<AddTaskProps> = ({ onTaskAdded }) => {
  const [taskName, setTaskName] = useState('')
  const [taskDetails, setTaskDetails] = useState('')

  const handleAddTask = async () => {
    if (!taskName) {
      Alert.alert('Missing fields', 'Please enter a task name.')
      return
    }

    // Await the getUser call to retrieve user data
    const { data: user, error: userError } = await supabase.auth.getUser()

    if (userError) {
      Alert.alert('Error fetching user', userError.message)
      return
    }

    if (!user) {
      Alert.alert('No user found', 'Please log in to add tasks.')
      return
    }

    const { error } = await supabase.from('tasks').insert([
      {
        user_id: user.user.id, // Correctly access the user ID
        task_name: taskName,
        task_details: taskDetails,
        is_completed: false,
      },
    ])

    if (error) {
      Alert.alert('Error adding task', error.message)
    } else {
      setTaskName('')
      setTaskDetails('')
      onTaskAdded() // Notify the Home Screen to refresh tasks
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Task</Text>
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
      <Button title="Add Task" onPress={handleAddTask} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
})

export default AddTask
