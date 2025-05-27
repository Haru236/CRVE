import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Swiper from 'react-native-swiper'
import AntDesign from '@expo/vector-icons/AntDesign';

const OfferSlider = () => {
  return (
    <View style={styles.container}>
      <Swiper
      autoplay={true}
      autoplayTimeout={3}
      showsButtons={true}
      // removeClippedSubviews={false}
      dotColor='white'
      activeDotColor='white'
      nextButton={<AntDesign name="right" size={40} color="white" />}
     prevButton={<AntDesign name="left" size={40} color="white" />}
     
      >
        <View style={styles.slide}>
          <Image source={require('../Images/template-preview-1.jpg')}style={styles.image}/>
        </View>
        <View style={styles.slide}>
          <Image source={require('../Images/pizzaba.webp')}style={styles.image}/>
        </View>
        <View style={styles.slide}>
          <Image source={require('../Images/OIP.jpg')}style={styles.image}/>
        </View>

      </Swiper>
    </View>
  )
}

export default OfferSlider

const styles = StyleSheet.create({
    container: {
      width: '100%',
      height: 190, 
      borderTopRightRadius: 25,
      borderBottomRightRadius: 25,
      borderTopLeftRadius:25,
      borderBottomLeftRadius:25,
      overflow: 'hidden',
      // backgroundColor: 'green',
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
      alignSelf:'center'
      // resizeMode:'contain'
    },
    slide:{
      width:'100%',
      height:'100%',
      justifyContent:'center',
      alignContent:'center'
    
    }
  });
  