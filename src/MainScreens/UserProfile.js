import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../Firebase/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const UserProfile = () => {
  const navigation = useNavigation();

  const [isEditable, setIsEditable] = useState(false);
  const [loading, setLoading] = useState(true);

  const [uid, setUid] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'No logged-in user found.');
        navigation.navigate('Login');
        return;
      }

      setUid(user.uid);
      setEmail(user.email);

      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setName(data.name || '');
          setAddress(data.address || '');
          setPhone(data.phone || '');
        } else {
          setName('');
          setAddress('');
          setPhone('');
        }
      } catch (error) {
        Alert.alert('Error', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSaveProfile = async () => {
    if (!name.trim() || !phone.trim() || !address.trim()) {
      Alert.alert('Oops!', 'Please complete all fields before saving.');
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'No logged-in user found.');
        navigation.navigate('Login');
        return;
      }
      const userRef = doc(db, 'users', user.uid);
      await setDoc(
        userRef,
        {
          uid: user.uid,
          email: user.email,
          name: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
        },
        { merge: true }
      );
      Alert.alert('Awesome!', 'Your profile has been updated.');
      setIsEditable(false);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#ff6f00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Feather name="arrow-left" size={26} color="#fff" />
      </TouchableOpacity>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>CRVE Profile</Text>
        <Text style={styles.subtitle}>Your personal details</Text>
      </View>

      <View style={styles.uidContainer}>
        <Text style={styles.uidLabel}>User ID</Text>
        <Text style={styles.uidValue}>{uid}</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={[styles.input, !isEditable && styles.inputDisabled]}
          placeholder="Enter your full name"
          value={name}
          onChangeText={setName}
          editable={isEditable}
          placeholderTextColor="#c4c4c4"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={[styles.input, styles.inputDisabled]}
          placeholder="Your email"
          value={email}
          editable={false}
          placeholderTextColor="#c4c4c4"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Delivery Address</Text>
        <TextInput
          style={[styles.input, !isEditable && styles.inputDisabled]}
          placeholder="Where should we deliver?"
          value={address}
          onChangeText={setAddress}
          editable={isEditable}
          placeholderTextColor="#c4c4c4"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={[styles.input, !isEditable && styles.inputDisabled]}
          placeholder="Your contact number"
          value={phone}
          onChangeText={setPhone}
          editable={isEditable}
          keyboardType="phone-pad"
          placeholderTextColor="#c4c4c4"
        />
      </View>

      <TouchableOpacity
        style={[styles.button, isEditable ? styles.buttonSave : styles.buttonEdit]}
        onPress={() => {
          if (isEditable) {
            handleSaveProfile();
          } else {
            setIsEditable(true);
          }
        }}
        activeOpacity={0.9}
      >
        <Text style={styles.buttonText}>{isEditable ? 'Save Changes' : 'Edit Profile'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7F0', // soft cream background for warmth
    paddingHorizontal: 30,
    paddingTop: 60,
  },

  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#FF6F00', // signature CRVE orange
    padding: 12,
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#FF6F00',
    shadowOpacity: 0.6,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    zIndex: 10,
  },

  titleContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },

  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#D1495B', // deep warm red for brand identity
    letterSpacing: 1.3,
  },

  subtitle: {
    fontSize: 16,
    color: '#6B4226', // earthy brown tone
    marginTop: 6,
  },

  uidContainer: {
    marginBottom: 25,
    backgroundColor: '#FFE3D8',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },

  uidLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#A56A48',
    letterSpacing: 0.8,
  },

  uidValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B4226',
    marginTop: 2,
  },

  inputGroup: {
    marginBottom: 22,
  },

  label: {
    fontSize: 14,
    color: '#7A5C43',
    marginBottom: 6,
    fontWeight: '600',
  },

  input: {
    backgroundColor: '#FFF1E6',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#5A3E36',
    fontWeight: '500',
    shadowColor: '#D1495B',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },

  inputDisabled: {
    color: '#AFAFAF',
    backgroundColor: '#FFE7D3',
  },

  button: {
    marginTop: 30,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#D1495B',
    shadowOpacity: 0.5,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 7 },
  },

  buttonEdit: {
    backgroundColor: '#D1495B', // strong brand red
  },

  buttonSave: {
    backgroundColor: '#6B4226', // earthy dark brown
  },

  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF7F0', // cream color text
    letterSpacing: 1,
  },
});

export default UserProfile;
