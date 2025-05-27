import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Image,
  Text,
  Alert,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { Ionicons } from '@expo/vector-icons';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../Firebase/firebase';

const AddItemScreen = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [size, setSize] = useState('');
  const [vegNonVeg, setVegNonVeg] = useState('veg');
  const [image, setImage] = useState(null);
  const [available, setAvailable] = useState(true);

  const [restaurantName, setRestaurantName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurantName = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        Alert.alert('Error', 'User not authenticated.');
        return;
      }

      try {
        const userDocRef = doc(db, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          Alert.alert('Error', 'User profile not found.');
          return;
        }

        const userData = userDocSnap.data();

        if (!userData.restaurantName) {
          Alert.alert('Error', 'No restaurant name linked to this user.');
          return;
        }

        setRestaurantName(userData.restaurantName);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching restaurant name:', error);
        Alert.alert('Error', 'Failed to fetch restaurant name.');
      }
    };

    fetchRestaurantName();
  }, []);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
        const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
        if (!galleryStatus.granted || !cameraStatus.granted) {
          Alert.alert('Permission Denied', 'Please grant permissions to access gallery and camera.');
        }
      }
    })();
  }, []);

  const handleChooseImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        base64: true,
        quality: 0.7,
      });

      if (!result.canceled) {
        setImage('data:image/jpeg;base64,' + result.assets[0].base64);
      }
    } catch {
      Alert.alert('Error', 'Failed to pick image.');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        base64: true,
        quality: 0.7,
      });

      if (!result.canceled) {
        setImage('data:image/jpeg;base64,' + result.assets[0].base64);
      }
    } catch {
      Alert.alert('Error', 'Failed to take photo.');
    }
  };

  const handleAddItem = async () => {
    if (!name.trim() || !price.trim() || !category.trim() || !image) {
      Alert.alert('Error', 'Please fill all fields and select an image.');
      return;
    }

    if (category.trim().toLowerCase() === 'pizza' && !size.trim()) {
      Alert.alert('Error', 'Please enter a size for pizza.');
      return;
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
      Alert.alert('Error', 'Price must be a valid number.');
      return;
    }

    if (!restaurantName) {
      Alert.alert('Error', 'Restaurant name missing.');
      return;
    }

    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        Alert.alert('Error', 'User not authenticated.');
        return;
      }

      const itemsRef = collection(db, 'restaurants', restaurantName, 'items');

      await addDoc(itemsRef, {
        name: name.trim(),
        price: parsedPrice,
        category: category.trim(),
        size: size.trim() || null,
        vegNonVeg,
        available,
        imageBase64: image,
        restaurantName: restaurantName.trim(),
        createdAt: new Date().toISOString(),
        uid: userId,
      });

      Alert.alert('Success', 'Item added successfully!');

      // Reset form fields
      setName('');
      setPrice('');
      setCategory('');
      setSize('');
      setVegNonVeg('veg');
      setImage(null);
      setAvailable(true);
    } catch (error) {
      console.error('Error adding item:', error);
      Alert.alert('Error', 'Failed to add item.');
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Restaurant: {restaurantName}</Text>

      <Text style={styles.label}>Item Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter item name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Price (₹)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter price"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <Text style={styles.label}>Category</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter category (e.g. pizza, burger)"
        value={category}
        onChangeText={setCategory}
      />

      {category.trim().toLowerCase() === 'pizza' && (
        <>
          <Text style={styles.label}>Size</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter size (e.g. small, medium, large)"
            value={size}
            onChangeText={setSize}
          />
        </>
      )}

      <Text style={styles.label}>Type</Text>
      <View style={styles.radioContainer}>
        <TouchableOpacity onPress={() => setVegNonVeg('veg')} style={styles.radioButton}>
          <Ionicons
            name={vegNonVeg === 'veg' ? 'radio-button-on' : 'radio-button-off'}
            size={24}
            color={vegNonVeg === 'veg' ? 'green' : 'gray'}
          />
          <Text style={styles.radioLabel}>Veg</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setVegNonVeg('nonveg')} style={styles.radioButton}>
          <Ionicons
            name={vegNonVeg === 'nonveg' ? 'radio-button-on' : 'radio-button-off'}
            size={24}
            color={vegNonVeg === 'nonveg' ? 'red' : 'gray'}
          />
          <Text style={styles.radioLabel}>Non-Veg</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Availability</Text>
      <TouchableOpacity
        style={[
          styles.availabilityButton,
          available ? styles.available : styles.notAvailable,
        ]}
        onPress={() => setAvailable(!available)}
      >
        <Text style={styles.availabilityText}>{available ? 'Available' : 'Not Available'}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Item Image</Text>
      <View style={styles.imageButtonsContainer}>
        <TouchableOpacity style={styles.imageButton} onPress={handleChooseImage}>
          <Text style={styles.imageButtonText}>Choose from Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.imageButton} onPress={handleTakePhoto}>
          <Text style={styles.imageButtonText}>Take Photo</Text>
        </TouchableOpacity>
      </View>

      {image && (
        <Image source={{ uri: image }} style={styles.imagePreview} />
      )}

      <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
        <Text style={styles.addButtonText}>Add Item</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 5,
  },
  radioContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioLabel: {
    marginLeft: 5,
    fontSize: 16,
  },
  availabilityButton: {
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  available: {
    backgroundColor: '#4caf50',
  },
  notAvailable: {
    backgroundColor: '#f44336',
  },
  availabilityText: {
    color: '#fff',
    fontWeight: '600',
  },
  imageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  imageButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  imageButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginTop: 15,
    borderRadius: 6,
  },
  addButton: {
    marginTop: 25,
    backgroundColor: '#28a745',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default AddItemScreen;
