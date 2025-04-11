// screens/EditTaskScreen.tsx
import React, { useState } from 'react'
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/AppNavigator'
import { supabase } from '../lib/supabase'

type Props = NativeStackScreenProps<RootStackParamList, 'EditTask'>

export default function EditTaskScreen({ route, navigation }: Props) {
  const { task } = route.params
  const [taskName, setTaskName] = useState(task.task_name)
  const [taskDetails, setTaskDetails] = useState(task.task_details || '')

  const handleUpdate = async () => {
    if (!taskName) {
      Alert.alert('Validation', 'Task name is required.')
      return
    }

    const { error } = await supabase
      .from('tasks')
      .update({
        task_name: taskName,
        task_details: taskDetails,
      })
      .eq('id', task.id)

    if (error) {
      Alert.alert('Update failed', error.message)
    } else {
      Alert.alert('Success', 'Task updated successfully.')
      navigation.goBack()
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Task</Text>
      <TextInput
        style={styles.input}
        placeholder="Task Name"
        value={taskName}
        onChangeText={setTaskName}
      />
      <TextInput
        style={styles.input}
        placeholder="Task Details"
        value={taskDetails}
        onChangeText={setTaskDetails}
      />
      <Button title="Save Changes" onPress={handleUpdate} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
})
