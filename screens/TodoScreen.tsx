import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, TextInput, Modal, Button, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../styles/ToDoScreenStyles";

interface Task {
  id: number;
  title: string;
  details: string;
  completed: boolean;
}

export default function ToDoScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDetails, setTaskDetails] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDetails, setEditDetails] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    saveTasks();
  }, [tasks]);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem("tasks");
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error("Failed to load tasks:", error);
    }
  };

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (error) {
      console.error("Failed to save tasks:", error);
    }
  };

  const addTask = () => {
    if (taskTitle.trim() === "" || taskDetails.trim() === "") return;
    const newTask: Task = { id: Date.now(), title: taskTitle, details: taskDetails, completed: false };
    setTasks([...tasks, newTask]);
    setTaskTitle("");
    setTaskDetails("");
    setModalVisible(false);
  };

  const deleteTask = (id: number) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this task?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => setTasks(tasks.filter((task) => task.id !== id)), style: "destructive" },
      ]
    );
  };

  const completeTask = (id: number) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  const startEditing = (task: Task) => {
    setEditTask(task);
    setEditTitle(task.title);
    setEditDetails(task.details);
    setEditModalVisible(true);
  };

  const saveEdit = () => {
    if (editTask) {
      setTasks(
        tasks.map((task) =>
          task.id === editTask.id ? { ...task, title: editTitle, details: editDetails } : task
        )
      );
    }
    setEditModalVisible(false);
    setEditTask(null);
  };

  const toggleExpandTask = (id: number) => {
    setExpandedTasks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.taskItem}
            onPress={() => startEditing(item)} // Trigger edit on container tap
          >
            <View style={styles.taskHeader}>
              <Text style={item.completed ? styles.completedText : styles.taskTitle}>
                {item.title}
              </Text>
              <View style={styles.taskButtons}>
                <TouchableOpacity onPress={() => deleteTask(item.id)}>
                  <Ionicons name="trash-outline" size={27} color="red" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => completeTask(item.id)}>
                  <Ionicons name="checkbox-outline" size={27} color="green" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => toggleExpandTask(item.id)}>
                  <Ionicons
                    name={expandedTasks[item.id] ? "chevron-up-outline" : "chevron-down-outline"}
                    size={27}
                    color="black"
                  />
                </TouchableOpacity>
              </View>
            </View>
            {expandedTasks[item.id] && <Text style={styles.taskDetails}>{item.details}</Text>}
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      {/* Add Task Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Task</Text>
            <TextInput style={styles.modalInput} placeholder="Task Title" value={taskTitle} onChangeText={setTaskTitle} />
            <TextInput
              style={[styles.modalInput, { height: 250, textAlignVertical: "top" }]}
              placeholder="Task Details"
              value={taskDetails}
              onChangeText={setTaskDetails}
              multiline
              numberOfLines={13}
            />
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
              <Button title="Add Task" onPress={addTask} color="darkblue" />
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Task Modal */}
      <Modal visible={editModalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Task</Text>
            <TextInput style={styles.modalInput} value={editTitle} onChangeText={setEditTitle} placeholder="Edit Title" />
            <TextInput
              style={[styles.modalInput, { height: 250, textAlignVertical: "top" }]}
              value={editDetails}
              onChangeText={setEditDetails}
              placeholder="Edit Details"
              multiline
              numberOfLines={13} // no of lines displayed
            />
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setEditModalVisible(false)} color="red" />
              <Button title="Save" onPress={saveEdit} color="darkblue" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
