import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const ProductScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <StatusBar backgroundColor={'#FF6F00'} barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.closeButtonText}>Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.productDetailsContainer}>
        <View style={styles.productImageContainer}>
          <Image source={require('../Images/OIP (1).jpg')} style={styles.cartimage} />
        </View>

        <View style={styles.productInfoContainer}>
          <View style={styles.productInfoTop}>
            <Text style={styles.productName}>Delicious Veg Pizza</Text>
            <Text style={styles.productPrice}>₹100</Text>
          </View>

          <View style={styles.productDescriptionContainer}>
            <Text style={styles.aboutItemHeading}>Description</Text>
            <Text style={styles.itemDescription}>Our Veg Pizza is made with fresh, organic ingredients, topped with creamy cheese and spicy herbs. A delightful taste for all pizza lovers!</Text>
            <Text style={styles.vegTag}>Veg</Text>
          </View>

          <View style={styles.restaurantInfoContainer}>
            <Text style={styles.restaurantNameHeading}>Restaurant</Text>
            <Text style={styles.restaurantName}>Meow Core Cafe</Text>
          </View>
        </View>

        <View style={styles.buyButtonContainer}>
          <TouchableOpacity style={styles.buyButton}>
            <Text style={styles.buyButtonText}>Order Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

export default ProductScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    width: '100%',
    height: '100%',
  },
  header: {
    backgroundColor: '#FF6F00',
    paddingVertical: 20,
    paddingHorizontal: 15,
    height: 60,
    marginTop: 50,
    alignItems: 'flex-start',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  productDetailsContainer: {
    backgroundColor: '#F9F9F9',
  },
  productImageContainer: {
    width: '100%',
    height: 250,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  cartimage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  productInfoContainer: {
    backgroundColor: '#F1F1F1',
    padding: 25,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    position: 'relative',
    top: -30,
    borderRadius: 20,
  },
  productInfoTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  productName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2D2D2D',
    width: 220,
  },
  productPrice: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FF6F00',
  },
  productDescriptionContainer: {
    backgroundColor: '#FFF',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 20,
    marginTop: 10,
    elevation: 3,
  },
  aboutItemHeading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  itemDescription: {
    fontSize: 16,
    paddingTop: 12,
    color: '#666',
    lineHeight: 22,
  },
  vegTag: {
    backgroundColor: '#4CAF50',
    color: 'white',
    fontSize: 18,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 15,
  },
  restaurantInfoContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 20,
    marginVertical: 15,
    elevation: 3,
  },
  restaurantNameHeading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
    marginVertical: 10,
  },
  buyButtonContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    flexDirection: 'row',
  },
  buyButton: {
    width: '90%',
    height: 55,
    backgroundColor: '#FF6F00',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    marginTop: 25,
  },
  buyButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
  },
})
