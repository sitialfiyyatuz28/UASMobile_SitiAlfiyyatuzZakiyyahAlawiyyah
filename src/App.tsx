import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface Card {
  id: number;
  title: string;
  image: string;
}

interface TabTwoScreenProps {
  addCard: (newCard: Card) => void;
}

const TabTwoScreen = ({ addCard }: TabTwoScreenProps) => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');

  const handleAddCard = () => {
    if (title && image) {
      const newCard = { id: Date.now(), title, image };
      addCard(newCard);
      setTitle('');
      setImage('');
      Alert.alert("Success", "Destinasi ditambahkan!");
    } else {
      Alert.alert("Error", "Pastikan semua input terisi!");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Destinasi"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="URL Gambar"
        value={image}
        onChangeText={setImage}
      />
      <TouchableOpacity onPress={handleAddCard} style={styles.addButton}>
        <ThemedText>Tambah Destinasi</ThemedText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default TabTwoScreen;
