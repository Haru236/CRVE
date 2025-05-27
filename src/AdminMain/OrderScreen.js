import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';

export default function OrdersScreen() {
  // Example data for orders (replace with actual data later)
  const [orders, setOrders] = useState([
    {
      id: '1',
      customer: 'John Doe',
      status: 'Pending',
      items: ['Chicken Biryani', 'Veg Pulao'],
    },
    {
      id: '2',
      customer: 'Jane Smith',
      status: 'Preparing',
      items: ['Paneer Butter Masala', 'Butter Naan'],
    },
    {
      id: '3',
      customer: 'Alice Brown',
      status: 'Delivered',
      items: ['Chicken Biryani'],
    },
  ]);

  
  const handleUpdateStatus = (orderId, currentStatus) => {
    const statusOrder = {
      'Pending': 'Preparing',
      'Preparing': 'Out for Delivery',
      'Out for Delivery': 'Delivered',
      'Delivered': 'Delivered', 
    };
    
    const newStatus = statusOrder[currentStatus];

    if (!newStatus) return;

    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    Alert.alert('Order Status Updated', `Order status changed to ${newStatus}`);
  };

  // Render each order item
  const renderOrder = ({ item }) => (
    <View style={styles.orderRow}>
      <Text style={styles.orderText}>Customer: {item.customer}</Text>
      <Text style={styles.orderText}>Items: {item.items.join(', ')}</Text>
      <Text style={[styles.orderText, { fontWeight: 'bold' }]}>Status: {item.status}</Text>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleUpdateStatus(item.id, item.status)}
      >
        <Text style={styles.buttonText}>Update Status</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Orders List</Text>

      {/* List of orders */}
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrder}
        style={styles.orderList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  orderList: {
    marginTop: 16,
  },
  orderRow: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
    borderRadius: 8,
  },
  orderText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 6,
  },
  button: {
    backgroundColor: '#3b82f6',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
});
