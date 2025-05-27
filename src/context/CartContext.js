import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, collection, doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Initialize Firestore & Auth outside component
const firestore = getFirestore();
const auth = getAuth();

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const user = auth.currentUser; // Assumes user is logged in and auth state stable

  // Load cart from Firestore + AsyncStorage on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        if (!user) {
          // If no user, fallback to AsyncStorage only
          const storedCart = await AsyncStorage.getItem('user_cart');
          if (storedCart !== null) {
            setCartItems(JSON.parse(storedCart));
          }
          return;
        }

        // Load from Firestore
        const userCartDocRef = doc(firestore, 'userCarts', user.uid);
        const userCartDoc = await getDoc(userCartDocRef);
        if (userCartDoc.exists()) {
          const data = userCartDoc.data();
          if (data.items) {
            setCartItems(data.items);
            // Sync to AsyncStorage
            await AsyncStorage.setItem('user_cart', JSON.stringify(data.items));
          } else {
            setCartItems([]);
            await AsyncStorage.removeItem('user_cart');
          }
        } else {
          // No Firestore cart found - check AsyncStorage fallback
          const storedCart = await AsyncStorage.getItem('user_cart');
          if (storedCart !== null) {
            const parsedCart = JSON.parse(storedCart);
            setCartItems(parsedCart);
            // Save to Firestore for consistency
            await setDoc(userCartDocRef, { items: parsedCart });
          }
        }
      } catch (error) {
        console.error('Failed to load cart:', error);
      }
    };
    loadCart();
  }, [user]);

  // Save cart to Firestore + AsyncStorage whenever it changes
  useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem('user_cart', JSON.stringify(cartItems));
        if (user) {
          const userCartDocRef = doc(firestore, 'userCarts', user.uid);
          await setDoc(userCartDocRef, { items: cartItems });
        }
      } catch (error) {
        console.error('Failed to save cart:', error);
      }
    };
    saveCart();
  }, [cartItems, user]);

  // Add item with overlap restriction logic
  const addToCart = async (item) => {
    // Restrict: only allow items from one restaurant at a time
    if (cartItems.length > 0) {
      const currentRestaurant = cartItems[0].restaurantName;
      if (item.restaurantName !== currentRestaurant) {
        alert(`You can only order from one restaurant at a time. Clear your cart to add items from ${item.restaurantName}`);
        return;
      }
    }

    // Check if exact same item (id + size + veg) exists
    const existingIndex = cartItems.findIndex(
      cartItem =>
        cartItem.id === item.id &&
        cartItem.size === item.size &&
        cartItem.veg === item.veg
    );

    if (existingIndex !== -1) {
      // Update quantity & total price
      const updatedItems = [...cartItems];
      const existingItem = updatedItems[existingIndex];
      existingItem.qty += item.qty;
      existingItem.totalPrice = existingItem.qty * existingItem.pricePerUnit;
      setCartItems(updatedItems);
    } else {
      // Add new item
      setCartItems([...cartItems, item]);
    }
  };

  // Update an existing item
  const updateCartItem = (oldItem, updatedItem) => {
    const index = cartItems.findIndex(
      cartItem =>
        cartItem.id === oldItem.id &&
        cartItem.size === oldItem.size &&
        cartItem.veg === oldItem.veg
    );
    if (index !== -1) {
      const updatedItems = [...cartItems];
      // To avoid duplication in case size/veg changed, merge if necessary
      // But for simplicity, let's replace index with updatedItem:
      updatedItems[index] = {
        ...updatedItem,
        totalPrice: updatedItem.qty * updatedItem.pricePerUnit,
      };
      setCartItems(updatedItems);
    }
  };

  // Remove an item by index
  const removeFromCart = (index) => {
    const newCart = [...cartItems];
    newCart.splice(index, 1);
    setCartItems(newCart);
  };

  // Remove all items from a particular restaurant
  const removeItemsByRestaurant = (restaurantName) => {
    const filteredCart = cartItems.filter(item => item.restaurantName !== restaurantName);
    setCartItems(filteredCart);
  };

  // Clear entire cart
  const clearCart = async () => {
    setCartItems([]);
    try {
      await AsyncStorage.removeItem('user_cart');
      if (user) {
        const userCartDocRef = doc(firestore, 'userCarts', user.uid);
        await setDoc(userCartDocRef, { items: [] });
      }
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      updateCartItem,
      removeFromCart,
      removeItemsByRestaurant,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
