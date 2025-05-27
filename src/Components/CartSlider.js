import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const CartSlider = ({navigation}) => {
  return (
    <View style={styles.container}>
        <Text style={styles.cartouthead}>
            Today's Special
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>

      
   <TouchableOpacity style={styles.cart} onPress={() =>navigation.navigate('ProductScreen')}>
    <View>
         <Image source={require('../Images/OIP (1).jpg')}style={styles.cartimage}/>
         </View>

         <View style={styles.cartin1}>
            <Text style={styles.cartin1txt}>Pizza</Text>

    <View style={styles.cartin2}>
        <Text style={styles.cartin2txt1}>    Fast Food</Text>
        <Text  style={styles.cartin2txt2}>Price-
            <Text style={{textDecorationLine:'line-through'}}>100rs </Text>

            <Text>90rs</Text>
        </Text>
        <Text  style={styles.cartin2txt3}>VEG</Text>
    </View>
    </View>
   </TouchableOpacity>

   <TouchableOpacity style={styles.cart}>
    <View>
         <Image source={require('../Images/OIP (2).jpg')}style={styles.cartimage}/>
         </View>

         <View style={styles.cartin1}>
            <Text style={styles.cartin1txt}>Pizza</Text>

    <View style={styles.cartin2}>
        <Text style={styles.cartin2txt1}>    Fast Food</Text>
        <Text  style={styles.cartin2txt2}>Price-
            <Text style={{textDecorationLine:'line-through'}}>220rs </Text>

            <Text>90rs</Text>
        </Text>
        <Text  style={styles.cartin2txt3}>VEG</Text>
    </View>
    </View>
   </TouchableOpacity>

   <TouchableOpacity style={styles.cart}>
    <View>
         <Image source={require('../Images/596343.jpg')}style={styles.cartimage}/>
         </View>

         <View style={styles.cartin1}>
            <Text style={styles.cartin1txt}>Pizza</Text>

    <View style={styles.cartin2}>
        <Text style={styles.cartin2txt1}>    Fast Food</Text>
        <Text  style={styles.cartin2txt2}>Price-
            <Text style={{textDecorationLine:'line-through'}}>300rs </Text>

            <Text>90rs</Text>
        </Text>
        <Text  style={styles.cartin2txt3}>VEG</Text>
    </View>
    </View>
   </TouchableOpacity>
   </ScrollView>

    </View>
  )
}

export default CartSlider

const styles = StyleSheet.create({
    container:{
        marginVertical:10
    },
    cartimage:{
        width:'100%',
        height:150,
        borderTopLeftRadius:17,
        borderTopRightRadius:17
    },
   cartouthead:{
    fontSize:20,
    fontWeight:'600',
    marginHorizontal:10,
    paddingLeft:5
   } ,
   cart:{
    width:300,
    height:200,
    marginLeft:10,
    marginTop:10,
    borderRadius:28,
    borderWidth:1,
    borderColor:'grey'
   },
   cartin1:{
    // backgroundColor:'green',
    marginHorizontal:3,
    marginTop:3
   },
   cartin1txt:{
    fontSize:16,
    marginHorizontal:5,
    fontWeight:'600'
   },
   cartin2:{
    flexDirection:'row',
    alignItems:'center',
    marginHorizontal:2

   },
   cartin2txt1:{
    fontSize:12,
    marginRight:10,
    fontWeight:'500'
   },
   cartin2txt3:{
    height:20,
    borderRadius:10,
    backgroundColor:'green',
    fontSize:15,
    fontWeight:'500',
    color:'white',
    textAlign:'center',
    justifyContent:'center',
    paddingHorizontal:7

   }
})