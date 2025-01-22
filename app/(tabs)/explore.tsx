import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Mendefinisikan tipe Task
interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const TravelToDoList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskText, setTaskText] = useState<string>('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Menambahkan task baru
  const handleAddTask = () => {
    if (taskText.trim()) {
      const newTask: Task = {
        id: Date.now(),
        text: taskText,
        completed: false,
      };
      setTasks([...tasks, newTask]);
      setTaskText('');
    } else {
      Alert.alert('Error', 'Please enter a task');
    }
  };

  // Memperbarui task
  const handleUpdateTask = () => {
    if (editingTask && taskText.trim()) {
      const updatedTasks = tasks.map((task) =>
        task.id === editingTask.id
          ? { ...task, text: taskText }
          : task
      );
      setTasks(updatedTasks);
      setTaskText('');
      setEditingTask(null);
    } else {
      Alert.alert('Error', 'Please enter a task to update');
    }
  };

  // Menghapus task dengan konfirmasi
  const handleDeleteTask = (taskId: number) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            const updatedTasks = tasks.filter((task) => task.id !== taskId);
            setTasks(updatedTasks);
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Menandai task sebagai selesai/tidak selesai
  const handleToggleCompletion = (task: Task) => {
    const updatedTasks = tasks.map((t) =>
      t.id === task.id ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Travel To-Do List</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your task"
        value={taskText}
        onChangeText={setTaskText}
      />

      <View style={styles.buttonContainer}>
        {editingTask ? (
          <TouchableOpacity style={styles.updateButton} onPress={handleUpdateTask}>
            <Text style={styles.buttonText}>Update Task</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
            <Text style={styles.buttonText}>Add Task</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.taskItem, item.completed && styles.completedTask]}>
            <TouchableOpacity onPress={() => handleToggleCompletion(item)} style={styles.taskTextContainer}>
              <Text style={[styles.taskText, item.completed && styles.completedText]}>
                {item.text}
              </Text>
            </TouchableOpacity>

            <View style={styles.actionsContainer}>
              <TouchableOpacity onPress={() => { setTaskText(item.text); setEditingTask(item); }}>
                <MaterialIcons name="edit" size={24} color="#FF9800" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
                <MaterialIcons name="delete" size={24} color="#F44336" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f3f3f3',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#3a3a3a',
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 15,
    marginBottom: 15,
    fontSize: 18,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  updateButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,  // Menambah jarak teks dengan batas card
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 12,
    elevation: 3,  // Menambahkan shadow untuk efek kartu
  },
  taskTextContainer: {
    flex: 1,
  },
  taskText: {
    fontSize: 18,
    color: '#333',
  },
  completedTask: {
    backgroundColor: '#e0e0e0',  // Ubah warna latar belakang jika selesai
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 15,
  },
});

export default TravelToDoList;
