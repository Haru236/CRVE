import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  Button,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db, auth } from '../Firebase/firebase';
import {
  collection,
  query,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';

const MenuListScreen = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // For editing modal
  const [modalVisible, setModalVisible] = useState(false);
  const [editItem, setEditItem] = useState(null); // holds current item data being edited
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      Alert.alert('Error', 'User not authenticated.');
      return;
    }

    const fetchRestaurantNameAndSubscribe = async () => {
      try {
        const userDocRef = doc(db, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          Alert.alert('Error', 'User profile not found.');
          return;
        }

        const userData = userDocSnap.data();
        const restaurantName = userData.restaurantName;

        if (!restaurantName) {
          Alert.alert('Error', 'No restaurant name linked to this user.');
          return;
        }

        const itemsRef = collection(db, 'restaurants', restaurantName, 'items');
        const unsubscribe = onSnapshot(
          itemsRef,
          (querySnapshot) => {
            const list = [];
            querySnapshot.forEach((doc) => {
              list.push({ id: doc.id, ...doc.data() });
            });
            setItems(list);
            setLoading(false);
          },
          (error) => {
            console.error('Error fetching items:', error);
            Alert.alert('Error', 'Failed to fetch items.');
            setLoading(false);
          }
        );

        return unsubscribe;
      } catch (error) {
        console.error('Error:', error);
        Alert.alert('Error', 'Something went wrong.');
        setLoading(false);
      }
    };

    const unsubscribePromise = fetchRestaurantNameAndSubscribe();

    return () => {
      unsubscribePromise?.then((unsub) => {
        if (unsub) unsub();
      });
    };
  }, []);

  const toggleAvailability = async (itemId, currentAvailability) => {
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

      const restaurantName = userDocSnap.data().restaurantName;
      if (!restaurantName) {
        Alert.alert('Error', 'No restaurant name linked to this user.');
        return;
      }

      const itemDocRef = doc(db, 'restaurants', restaurantName, 'items', itemId);

      await updateDoc(itemDocRef, {
        available: !currentAvailability,
      });
    } catch (error) {
      console.error('Error toggling availability:', error);
      Alert.alert('Error', 'Failed to update availability.');
    }
  };

  const deleteItem = (itemId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const userId = auth.currentUser?.uid;
              if (!userId) {
                Alert.alert('Error', 'User not authenticated.');
                return;
              }

              const userDocRef = doc(db, 'users', userId);
              const userDocSnap = await getDoc(userDocRef);

              if (!userDocSnap.exists()) {
                Alert.alert('Error', 'User profile not found.');
                return;
              }

              const restaurantName = userDocSnap.data().restaurantName;
              if (!restaurantName) {
                Alert.alert('Error', 'No restaurant name linked to this user.');
                return;
              }

              const itemDocRef = doc(db, 'restaurants', restaurantName, 'items', itemId);
              await deleteDoc(itemDocRef);
            } catch (error) {
              console.error('Error deleting item:', error);
              Alert.alert('Error', 'Failed to delete item.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Open edit modal and load item data
  const openEditModal = (item) => {
    setEditItem({ ...item }); // clone the item for editing
    setModalVisible(true);
  };

  // Save changes to Firestore
  const saveChanges = async () => {
    if (!editItem) return;

    const { id, name, price, category, size, vegNonVeg, available, imageBase64 } = editItem;

    if (!name || !price || !category) {
      Alert.alert('Validation Error', 'Name, price, and category are required.');
      return;
    }

    setSaving(true);

    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        Alert.alert('Error', 'User not authenticated.');
        setSaving(false);
        return;
      }

      const userDocRef = doc(db, 'users', userId);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        Alert.alert('Error', 'User profile not found.');
        setSaving(false);
        return;
      }

      const restaurantName = userDocSnap.data().restaurantName;
      if (!restaurantName) {
        Alert.alert('Error', 'No restaurant name linked to this user.');
        setSaving(false);
        return;
      }

      const itemDocRef = doc(db, 'restaurants', restaurantName, 'items', id);

      await updateDoc(itemDocRef, {
        name,
        price: parseFloat(price),
        category,
        size: size || '',
        vegNonVeg: vegNonVeg || 'veg',
        available: available ?? true,
        imageBase64: imageBase64 || '',
      });

      Alert.alert('Success', 'Changes saved successfully!');
      setModalVisible(false);
    } catch (error) {
      console.error('Error saving changes:', error);
      Alert.alert('Error', 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  // Updated image picker from gallery
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow access to your media library.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const base64 = result.assets?.[0]?.base64;
      if (base64) {
        const uri = `data:image/jpeg;base64,${base64}`;
        setEditItem((prev) => ({ ...prev, imageBase64: uri }));
      }
    }
  };

  // Updated image picker from camera
  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow access to your camera.');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const base64 = result.assets?.[0]?.base64;
      if (base64) {
        const uri = `data:image/jpeg;base64,${base64}`;
        setEditItem((prev) => ({ ...prev, imageBase64: uri }));
      }
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      {item.imageBase64 ? (
        <Image source={{ uri: item.imageBase64 }} style={styles.itemImage} />
      ) : (
        <View
          style={[
            styles.itemImage,
            { justifyContent: 'center', alignItems: 'center', backgroundColor: '#ccc' },
          ]}
        >
          <Text>No Image</Text>
        </View>
      )}
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text>Price: ₹{item.price}</Text>
        <Text>Category: {item.category}</Text>
        <Text>Size: {item.size}</Text>
        <Text>Type: {item.vegNonVeg}</Text>
        <Text>Status: {item.available ? 'Available' : 'Not Available'}</Text>

        <View style={styles.actionsRow}>
          <TouchableOpacity onPress={() => toggleAvailability(item.id, item.available)}>
            <Ionicons
              name={item.available ? 'eye' : 'eye-off'}
              size={24}
              color={item.available ? 'green' : 'red'}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => openEditModal(item)} style={{ marginLeft: 16 }}>
            <Ionicons name="pencil" size={24} color="blue" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => deleteItem(item.id)} style={{ marginLeft: 16 }}>
            <Ionicons name="trash" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#666" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerText}>YOUR MENU</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 16 }}
      />

      {/* Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Item</Text>

            <TextInput
              style={styles.input}
              placeholder="Name"
              value={editItem?.name}
              onChangeText={(text) => setEditItem((prev) => ({ ...prev, name: text }))}
            />

            <TextInput
              style={styles.input}
              placeholder="Price"
              keyboardType="numeric"
              value={editItem?.price?.toString()}
              onChangeText={(text) => setEditItem((prev) => ({ ...prev, price: text }))}
            />

            <TextInput
              style={styles.input}
              placeholder="Category"
              value={editItem?.category}
              onChangeText={(text) => setEditItem((prev) => ({ ...prev, category: text }))}
            />

            <TextInput
              style={styles.input}
              placeholder="Size"
              value={editItem?.size}
              onChangeText={(text) => setEditItem((prev) => ({ ...prev, size: text }))}
            />

            <TextInput
              style={styles.input}
              placeholder="Type (veg/non-veg)"
              value={editItem?.vegNonVeg}
              onChangeText={(text) => setEditItem((prev) => ({ ...prev, vegNonVeg: text }))}
            />

            {editItem?.imageBase64 ? (
              <Image
                source={{ uri: editItem.imageBase64 }}
                style={{ width: 120, height: 120, marginVertical: 10, borderRadius: 8 }}
              />
            ) : (
              <Text style={{ marginVertical: 10 }}>No Image Selected</Text>
            )}

            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 }}>
              <Button title="Pick from Gallery" onPress={pickImage} />
              <Button title="Open Camera" onPress={openCamera} />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <Button title="Save" onPress={saveChanges} disabled={saving} />
              <Button
                title="Cancel"
                color="red"
                onPress={() => setModalVisible(false)}
                disabled={saving}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MenuListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 12,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    elevation: 2,
    padding: 8,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    alignSelf: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
  },
});
