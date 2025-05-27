import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { auth } from './src/Firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import AppNav from './src/Navigation/AppNav';
import 'setimmediate';
import { CartProvider } from './src/context/CartContext'; // adjust the path if needed


export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Update user state
    });
    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  return (
  <CartProvider>
    <View style={styles.container}>
      <AppNav user={user} />
    </View>
  </CartProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});