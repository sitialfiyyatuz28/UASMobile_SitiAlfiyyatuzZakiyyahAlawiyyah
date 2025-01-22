import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, Alert } from "react-native";
import { responsiveWidth, responsiveHeight, responsiveFontSize } from "react-native-responsive-dimensions";
import LottieView from "lottie-react-native";
import Icon from "@expo/vector-icons/Ionicons";
import { auth } from "../firebaseConfig"; // Impor auth yang sudah diinisialisasi dari firebaseConfig
import { createUserWithEmailAndPassword } from "firebase/auth"; // Impor metode untuk registrasi

// Definisikan tipe untuk objek Card
interface Card {
  id: number;
  title: string;
  image: string;
}

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  // Form inputs for adding a new card
  const [newTitle, setNewTitle] = useState("");
  const [newImage, setNewImage] = useState("");

  // Fungsi untuk validasi email
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleRegister = () => {
    if (username && password) {
      if (!isValidEmail(username)) {
        Alert.alert("Error", "Format email tidak valid.");
        return;
      }

      createUserWithEmailAndPassword(auth, username, password)
        .then((userCredential) => {
          Alert.alert("Registrasi Berhasil", "Akun Anda telah dibuat.");
          setIsRegistering(false);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;

          if (errorCode === "auth/email-already-in-use") {
            Alert.alert("Registrasi Gagal", "Email sudah terdaftar.");
          } else if (errorCode === "auth/invalid-email") {
            Alert.alert("Registrasi Gagal", "Email tidak valid.");
          } else {
            Alert.alert("Registrasi Gagal", errorMessage);
          }
        });
    } else {
      Alert.alert("Error", "Mohon isi email dan password.");
    }
  };

  const handleLogin = () => {
    if (username === "alfi@gmail.com" && password === "alfi") {
      setIsLoggedIn(true);
      Alert.alert("Login Berhasil", "Selamat datang di aplikasi Travelin!");
    } else {
      Alert.alert("Login Gagal", "Username atau password salah. Coba lagi.");
    }
  };

  const handleCardClick = (card: Card): void => {
    // Konfirmasi penghapusan
    Alert.alert(
      "Hapus Destinasi",
      `Apakah Anda yakin ingin menghapus Destinasi ${card.title}?`,
      [
        {
          text: "Batal",
          style: "cancel",
        },
        {
          text: "Hapus",
          onPress: () => handleDeleteCard(card.id),
        },
      ],
      { cancelable: false }
    );
  };

  const handleDeleteCard = (cardId: number) => {
    // Menghapus kartu berdasarkan id
    setCards((prevCards) => prevCards.filter((card) => card.id !== cardId));
    Alert.alert("Destinasi Dihapus", "Destinasi telah berhasil dihapus.");
  };

  const handleAddCard = () => {
    if (!newTitle || !newImage) {
      Alert.alert("Error", "Mohon isi judul dan URL gambar.");
      return;
    }

    // Menambahkan kartu baru
    const newCard: Card = {
      id: Date.now(), // Menggunakan timestamp sebagai ID unik
      title: newTitle,
      image: newImage,
    };

    setCards((prevCards) => [...prevCards, newCard]);

    // Reset input fields setelah menambah kartu
    setNewTitle("");
    setNewImage("");
    Alert.alert("Destinasi Ditambahkan", "Destinasi baru telah berhasil ditambahkan.");
  };

  const handleUpdateCard = (cardId: number) => {
    const card = cards.find((c) => c.id === cardId);
    if (!card) return;

    // Prompt untuk memperbarui judul dan gambar
    Alert.prompt(
      "Update Destinasi",
      "Masukkan Destinasi baru dan URL gambar baru",
      [
        {
          text: "Batal",
          style: "cancel",
        },
        {
          text: "Update",
          onPress: (newTitle) => {
            if (!newTitle) return;
            setCards((prevCards) =>
              prevCards.map((c) =>
                c.id === cardId ? { ...c, title: newTitle, image: card.image } : c
              )
            );
          },
        },
      ],
      "plain-text",
      card.title // Default value
    );
  };

  // Inisialisasi state cards
  const [cards, setCards] = useState<Card[]>([
    { id: 1, title: "Bromo", image: "https://assets.puzzlefactory.pl/puzzle/428/843/original.jpg" },
    { id: 2, title: "Rinjani", image: "https://tse4.mm.bing.net/th?id=OIP.53V6owO3E-c6oxeppjzWOwHaE7&pid=Api&P=0&h=220" },
    { id: 3, title: "Kawah Ijen", image: "https://tse3.mm.bing.net/th?id=OIP.76OvlMHR_VdM0jfZXicl-gHaEo&pid=Api&P=0&h=220" },
  ]);

  if (!isLoggedIn) {
    return (
      <View style={styles.loginContainer}>
        <Image
          source={require("../../assets/images/logo.png")} // Ganti dengan path logo Anda
          style={styles.logo}
        />
        <LottieView
          source={require("../../assets/travel-animation.json")}
          autoPlay
          loop
          style={styles.animation}
        />
        <Text style={styles.loginTitle}>
          {isRegistering ? "Registrasi ke Travelin" : "Login ke Travelin"}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity
          style={styles.loginButton}
          onPress={isRegistering ? handleRegister : handleLogin}
        >
          <Text style={styles.loginButtonText}>
            {isRegistering ? "Daftar" : "Login"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setIsRegistering(!isRegistering)}
          style={styles.toggleButton}
        >
          <Text style={styles.toggleButtonText}>
            {isRegistering ? "Sudah punya akun? Login" : "Belum punya akun? Daftar"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Destinasi Populer</Text>
        <Icon name="airplane" size={30} color="#fff" />
      </View>

      {/* Form untuk menambahkan kartu */}
      <View style={styles.addCardForm}>
        <TextInput
          style={styles.input}
          placeholder="Judul Destinasi"
          value={newTitle}
          onChangeText={setNewTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="URL Gambar"
          value={newImage}
          onChangeText={setNewImage}
        />
        <TouchableOpacity
          style={styles.addCardButton}
          onPress={handleAddCard}
        >
          <Text style={styles.addCardButtonText}>Tambah Destinasi</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {cards.map((card: Card) => (
          <View key={card.id} style={styles.card}>
            <TouchableOpacity
              onPress={() => handleCardClick(card)}
            >
              <Image source={{ uri: card.image }} style={styles.cardImage} />
              <Text style={styles.cardTitle}>{card.title}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.updateButton}
              onPress={() => handleUpdateCard(card.id)}
            >
              <Text style={styles.updateButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f7",
  },
  loginContainer: {
    flex: 1,
    justifyContent: "center", // Pusatkan elemen secara vertikal
    alignItems: "center", // Pusatkan elemen secara horizontal
    backgroundColor: "#fff",
    padding: responsiveWidth(5), // Tambahkan padding untuk ruang ekstra di sisi layar
  },
  animation: {
    width: responsiveWidth(60),
    height: responsiveHeight(30),
    marginBottom: responsiveHeight(3),
  },
  loginTitle: {
    fontSize: responsiveFontSize(3),
    fontWeight: "bold",
    marginBottom: responsiveHeight(3),
    color: "#007bff", // Warna teks lebih menarik
  },
  input: {
    width: responsiveWidth(85), // Sedikit lebih lebar agar nyaman
    height: responsiveHeight(6),
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15, // Padding horizontal untuk lebih luas
    marginBottom: responsiveHeight(2),
    fontSize: responsiveFontSize(2), // Font yang sesuai
  },
  loginButton: {
    backgroundColor: "#007bff",
    width: responsiveWidth(85), // Lebar tombol sama seperti input
    paddingVertical: responsiveHeight(1.5),
    borderRadius: 8,
    alignItems: "center",
    marginTop: responsiveHeight(1), // Sedikit ruang antara tombol
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: responsiveFontSize(2), // Font lebih besar
  },
  toggleButton: {
    marginTop: responsiveHeight(2),
  },
  toggleButtonText: {
    color: "#007bff",
    textDecorationLine: "underline",
    fontSize: responsiveFontSize(1.8), // Font sedikit lebih kecil
  },
  header: {
    backgroundColor: "#007bff",
    paddingVertical: responsiveHeight(2),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: responsiveWidth(5),
  },
  headerTitle: {
    color: "#fff",
    fontSize: responsiveFontSize(3),
    fontWeight: "bold",
  },
  addCardForm: {
    padding: responsiveWidth(8),
    marginBottom: responsiveHeight(3),
  },
  addCardButton: {
    backgroundColor: "#28a745",
    paddingVertical: responsiveHeight(1.5),
    paddingHorizontal: responsiveWidth(5),
    borderRadius: 8,
    marginTop: responsiveHeight(2),
  },
  addCardButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  content: {
    padding: responsiveWidth(5),
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: responsiveHeight(2),
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardImage: {
    width: "100%",
    height: responsiveHeight(20),
  },
  cardTitle: {
    padding: responsiveHeight(1.5),
    fontSize: responsiveFontSize(2),
    fontWeight: "bold",
    textAlign: "center",
  },
  updateButton: {
    backgroundColor: "#ffcc00",
    paddingVertical: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(4),
    borderRadius: 5,
    marginTop: responsiveHeight(1),
    marginBottom: responsiveHeight(1),
    alignItems: "center",
  },
  updateButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  logo: {
    width: responsiveWidth(70), // Lebar 70% dari layar
    height: responsiveHeight(0), // Tinggi 30% dari layar
    resizeMode: "contain", // Memastikan proporsi logo tetap
    marginBottom: responsiveHeight(0), // Jarak antara logo dan animasi
    alignSelf: "center", // Pusatkan logo secara horizontal
  },
  
});

export default App;
