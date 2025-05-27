import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth, db } from '../Firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';

const AdminLoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (email === '' || password === '') {
      Alert.alert('Error', 'Please fill out all fields');
      console.log('Validation failed: Missing required fields', { email, password });
      return;
    }

    try {
      console.log('Starting admin login process', { email });

      // Verify Firebase instances
      console.log('Firebase auth instance:', auth ? 'Initialized' : 'Undefined');
      console.log('Firestore instance:', db ? 'Initialized' : 'Undefined');

      // Sign in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Firebase Auth success: User signed in', { uid: user.uid, email: user.email });

      // Check if user is an admin
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      console.log('Firestore: Document fetch result', {
        exists: userDoc.exists(),
        data: userDoc.exists() ? userDoc.data() : null,
      });

      if (userDoc.exists() && userDoc.data().isAdmin) {
        Alert.alert('Login Success', 'Welcome to Admin Panel');
        navigation.replace('AdminTabs');
      } else {
        console.log('Admin check failed: Not an admin or document missing', {
          exists: userDoc.exists(),
          isAdmin: userDoc.exists() ? userDoc.data().isAdmin : null,
        });
        Alert.alert('Login Failed', 'This account is not an admin');
        await auth.signOut();
      }
    } catch (error) {
      console.error('Login error:', {
        code: error.code,
        message: error.message,
        stack: error.stack,
      });
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Admin Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('AdminSignUp')}>
        <Text style={styles.linkText}>Don't have an admin account? Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>User Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  input: {
    width: '100%',
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  linkText: {
    color: '#3b82f6',
    fontSize: 14,
    marginTop: 10,
  },
});

export default AdminLoginScreen;