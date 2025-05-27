import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const TrackOrderScreen = () => {
  return (
   <View style={styles.container}>
    <View style={styles.header}>
      <TouchableOpacity>
        <Text style={styles.closeButton}>Close</Text>
      </TouchableOpacity>
    </View>

    <ScrollView>
      <Text style={styles.mainHeading}>My Orders</Text>
      <View style={styles.mainContainer}>
        <Text style={styles.orderId}>Order Id : 454qw8e4w</Text>
        <Text style={styles.orderTime}>Time : 2:10PM</Text>

        <View style={styles.orderItemContainer}>
          <Image source={require('../Images/OIP (1).jpg')} style={styles.cartImage} />
          <View style={styles.orderItemDetails}>
            <Text style={styles.orderItemName}>Pizza</Text>
            <Text style={styles.itemPrice}>120rs</Text>
            <Text style={styles.itemQuantity}>Qty: 1 unit</Text>
          </View>
        </View>

        <View style={styles.orderItemContainer}>
          <Image source={require('../Images/OIP (1).jpg')} style={styles.cartImage} />
          <View style={styles.orderItemDetails}>
            <Text style={styles.orderItemName}>Noodles</Text>
            <Text style={styles.itemPrice}>60rs</Text>
            <Text style={styles.itemQuantity}>Qty: 1 unit</Text>
          </View>
        </View>

        <View style={styles.orderItemContainer}>
          <Image source={require('../Images/OIP (1).jpg')} style={styles.cartImage} />
          <View style={styles.orderItemDetails}>
            <Text style={styles.orderItemName}>Pizza with no tomato</Text>
            <Text style={styles.itemPrice}>300rs</Text>
            <Text style={styles.itemQuantity}>Qty: 1 unit</Text>
          </View>
        </View>

        <Text style={styles.orderTotal}>Total: 480rs</Text>
      </View>
    </ScrollView>
  </View>
  )
}

export default TrackOrderScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  header: {
    backgroundColor: '#ff5722',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  closeButton: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  mainHeading: {
    fontSize: 22,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontWeight: '600',
    color: '#333',
  },
  mainContainer: {
    marginBottom: 10,
    marginHorizontal: 15,
    elevation: 5,
    backgroundColor: 'white',
    paddingVertical: 15,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  orderId: {
    fontSize: 16,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    color: '#444',
    paddingVertical: 8,
  },
  orderTime: {
    paddingHorizontal: 6,
    paddingVertical: 5,
    fontSize: 14,
    color: '#666',
  },
  orderItemContainer: {
    backgroundColor: '#ffffff',
    marginVertical: 8,
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  cartImage: {
    width: 90,
    height: 80,
    borderRadius: 20,
  },
  orderItemDetails: {
    flex: 1,
    paddingLeft: 15,
    justifyContent: 'center',
  },
  orderItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#777',
  },
  orderTotal: {
    fontSize: 18,
    paddingVertical: 10,
    textAlign: 'right',
    fontWeight: '700',
    color: '#333',
    marginRight: 20,
  },
})
