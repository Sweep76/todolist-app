import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import completedStyles from "../styles/completedStyles"
import { supabase } from "../lib/supabase"
import { useIsFocused } from "@react-navigation/native" // Import useIsFocused

const styles = completedStyles

type Task = {
  id: string
  task_name: string
  task_details: string | null
  is_completed: boolean
}

export default function CompletedScreen({ navigation }: any) {
  const [completedTasks, setCompletedTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [editedTask, setEditedTask] = useState<Task | null>(null)
  const [editedName, setEditedName] = useState("")
  const [editedDetails, setEditedDetails] = useState("")

  const isFocused = useIsFocused() // Hook to detect if screen is focused

  // Fetch completed tasks when screen is focused
  useEffect(() => {
    if (isFocused) {
      fetchCompletedTasks() // Trigger the fetch whenever screen comes into focus
    }
  }, [isFocused])

  const fetchCompletedTasks = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_completed", true)

    if (error) {
      Alert.alert("Error fetching completed tasks", error.message)
    } else {
      setCompletedTasks(data)
    }

    setLoading(false)
  }

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id)
    if (error) {
      Alert.alert("Delete Error", error.message)
    } else {
      fetchCompletedTasks()
    }
  }

  const markAsPending = async (task: Task) => {
    const { error } = await supabase
      .from("tasks")
      .update({ is_completed: false })
      .eq("id", task.id)

    if (error) {
      Alert.alert("Update Error", error.message)
    } else {
      fetchCompletedTasks() // Directly refresh the list
    }
  }

  const openEditModal = (task: Task) => {
    setEditedTask(task)
    setEditedName(task.task_name)
    setEditedDetails(task.task_details || "")
    setModalVisible(true)
  }

  const saveEdit = async () => {
    if (!editedTask) return

    const { error } = await supabase
      .from("tasks")
      .update({
        task_name: editedName,
        task_details: editedDetails,
      })
      .eq("id", editedTask.id)

    if (error) {
      Alert.alert("Update Error", error.message)
    } else {
      setModalVisible(false)
      fetchCompletedTasks()
    }
  }

  const handleUndoComplete = async (task: Task) => {
    const { error } = await supabase
      .from("tasks")
      .update({ is_completed: false }) // Set task to incomplete
      .eq("id", task.id)
  
    if (error) {
      Alert.alert('Error undoing task completion', error.message);
    } else {
      fetchCompletedTasks(); // Re-fetch tasks on completion change
    }
  };

  const renderTask = ({ item }: { item: Task }) => (
    <View style={styles.taskItem}>
      <TouchableOpacity
        onPress={() => openEditModal(item)}
        style={{ flex: 1 }}
      >
        <Text style={styles.completedText}>{item.task_name}</Text>
        {item.task_details && (
          <Text style={styles.taskDetails}>{item.task_details}</Text>
        )}
      </TouchableOpacity>
      <View style={styles.taskButtons}>
        <TouchableOpacity onPress={() => markAsPending(item)} style={styles.buttonWithText}>
          <Ionicons name="arrow-undo-outline" size={24} color="blue" />
          <Text style={styles.buttonText}>Undo</Text> 
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteTask(item.id)} style={styles.buttonWithText}>
          <Ionicons name="trash-outline" size={24} color="red" />
          <Text style={styles.buttonText}>Delete</Text> 
        </TouchableOpacity>
</View>

    </View>
  )

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading completed tasks...</Text>
      ) : completedTasks.length === 0 ? (
        <Text style={styles.emptyText}>No completed tasks yet.</Text>
      ) : (
        <FlatList
          data={completedTasks}
          keyExtractor={(item) => item.id}
          renderItem={renderTask}
        />
      )}

      {/* Edit Task Modal */}
      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Task</Text>
            <TextInput
              style={styles.input}
              value={editedName}
              onChangeText={setEditedName}
              placeholder="Task Name"
            />
            <TextInput
              style={styles.input}
              value={editedDetails}
              onChangeText={setEditedDetails}
              placeholder="Task Details"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveEdit}>
                <Text style={styles.saveButton}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}
