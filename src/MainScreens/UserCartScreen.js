import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import { useCart } from '../context/CartContext';

const UserCartScreen = () => {
  const { cartItems, updateCartItem, removeItemsByRestaurant } = useCart();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const groupedItems = cartItems.reduce((acc, item) => {
    if (!acc[item.restaurantName]) acc[item.restaurantName] = [];
    acc[item.restaurantName].push(item);
    return acc;
  }, {});

  const getImageUri = (base64Str) => {
    if (!base64Str) return null;
    if (base64Str.startsWith('data:image')) return base64Str;
    return `data:image/jpeg;base64,${base64Str}`;
  };

  const handleQuantityChange = (item, newQty) => {
    const updatedItem = { ...item, qty: newQty, totalPrice: newQty * item.pricePerUnit };
    updateCartItem(item, updatedItem);
  };

  const handleVegChange = (item, isVeg) => {
    const updatedItem = { ...item, veg: isVeg };
    updateCartItem(item, updatedItem);
  };

  const handleSizeChange = (item, newSize) => {
    const updatedItem = { ...item, size: newSize };
    updateCartItem(item, updatedItem);
  };

  const handlePaymentOption = (option) => {
    Alert.alert('Order Placed', `Your order from ${selectedRestaurant} is placed using ${option}.`, [
      { text: 'OK' },
    ]);
    removeItemsByRestaurant(selectedRestaurant);
    setSelectedRestaurant(null);
    setShowPaymentModal(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={Object.entries(groupedItems)}
        keyExtractor={([restaurant], index) => restaurant + index}
        renderItem={({ item }) => {
          const [restaurant, items] = item;
          return (
            <View style={styles.restaurantSection}>
              <View style={styles.restaurantTitleBox}>
                <Text style={styles.restaurantTitle}>RESTAURANT: {restaurant}</Text>
              </View>
              {items.map((item, index) => (
                <View key={index} style={styles.card}>
                  {item.imageBase64 ? (
                    <Image source={{ uri: getImageUri(item.imageBase64) }} style={styles.image} />
                  ) : (
                    <View style={[styles.image, styles.imagePlaceholder]}>
                      <Text>No Image</Text>
                    </View>
                  )}
                  <View style={styles.info}>
                    <Text style={styles.name}>{item.name}</Text>

                    <View style={styles.editRow}>
                      <Text style={styles.detail}>Veg:</Text>
                      <TouchableOpacity onPress={() => handleVegChange(item, true)}>
                        <Text style={[styles.option, item.veg && styles.activeOption]}>Yes</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleVegChange(item, false)}>
                        <Text style={[styles.option, !item.veg && styles.activeOption]}>No</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.editRow}>
                      <Text style={styles.detail}>Size:</Text>
                      {['Small', 'Medium', 'Large'].map((size) => (
                        <TouchableOpacity key={size} onPress={() => handleSizeChange(item, size)}>
                          <Text style={[styles.option, item.size === size && styles.activeOption]}>{size}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <View style={styles.editRow}>
                      <Text style={styles.detail}>Qty:</Text>
                      {[1, 2, 3, 4, 5].map((q) => (
                        <TouchableOpacity key={q} onPress={() => handleQuantityChange(item, q)}>
                          <Text style={[styles.option, item.qty === q && styles.activeOption]}>{q}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <Text style={styles.detail}>₹{item.pricePerUnit} per item</Text>
                    <Text style={styles.total}>Total: ₹{item.totalPrice}</Text>
                  </View>
                </View>
              ))}

              {/* Action Buttons for this restaurant */}
              <View style={styles.restaurantActions}>
                <TouchableOpacity
                  style={styles.orderBtn}
                  onPress={() => {
                    setSelectedRestaurant(restaurant);
                    setShowPaymentModal(true);
                  }}
                >
                  <Text style={styles.orderBtnText}>Order Now</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.clearBtn}
                  onPress={() =>
                    Alert.alert('Confirm', 'Remove all items from this restaurant?', [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Remove',
                        onPress: () => removeItemsByRestaurant(restaurant),
                      },
                    ])
                  }
                >
                  <Text style={styles.clearBtnText}>Remove from Cart</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>🛒 Your cart is empty</Text>
          </View>
        }
      />

      {/* Payment Modal */}
      <Modal
        visible={showPaymentModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Select Payment Method</Text>

            <Pressable style={styles.paymentOption} onPress={() => handlePaymentOption('Cash on Delivery')}>
              <Text>Cash on Delivery</Text>
            </Pressable>
            <Pressable style={styles.paymentOption} onPress={() => handlePaymentOption('UPI')}>
              <Text>UPI</Text>
            </Pressable>
            <Pressable style={styles.paymentOption} onPress={() => handlePaymentOption('Card')}>
              <Text>Credit/Debit Card</Text>
            </Pressable>

            <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  restaurantSection: { marginBottom: 20, paddingHorizontal: 10 },
  restaurantTitleBox: {
    backgroundColor: '#ffeaa7',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  restaurantTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3436',
  },
  card: {
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: '#f1f2f6',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  image: { width: 80, height: 80, borderRadius: 8, marginRight: 10 },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dfe6e9',
  },
  info: { flex: 1 },
  name: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  detail: { fontSize: 14, color: '#555', marginRight: 6 },
  total: { fontWeight: 'bold', marginTop: 5 },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  option: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginHorizontal: 4,
    backgroundColor: '#dfe6e9',
    borderRadius: 4,
  },
  activeOption: {
    backgroundColor: '#74b9ff',
    color: '#fff',
    fontWeight: 'bold',
  },
  restaurantActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  orderBtn: {
    backgroundColor: '#28a745',
    flex: 1,
    padding: 10,
    borderRadius: 8,
    marginRight: 5,
  },
  orderBtnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  clearBtn: {
    backgroundColor: '#ff4757',
    flex: 1,
    padding: 10,
    borderRadius: 8,
    marginLeft: 5,
  },
  clearBtnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { fontSize: 16, color: '#888' },

  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  paymentOption: {
    padding: 12,
    backgroundColor: '#ecf0f1',
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalCancel: { color: 'red', marginTop: 10 },
});

export default UserCartScreen;
