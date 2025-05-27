import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const Categories = () => {
  return (
    <View style={styles.container}>
      <Text styles={styles.head}>Categories</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity style={[styles.box,{backgroundColor:'#ddfbd3'}]}>
        <Image source={require('../Images/burger-icon-free-png.png')}style={styles.image}/>

            <Text style={styles.text}>Burger</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.box,{backgroundColor:'#f5e5ff'}]}>
        <Image source={require('../Images/image_processing20210620-16386-11ps0y6.png')}style={styles.image}/>

            <Text style={styles.text}>Drinks</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.box,{backgroundColor:'#e5f1ff'}]}>
        <Image source={require('../Images/Pizza-icon.png')}style={styles.image}/>

            <Text style={styles.text}>Pizza</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.box,{backgroundColor:'#ebfde5'}]}>
        <Image source={require('../Images/3361969.png')}style={styles.image}/>

            <Text style={styles.text}>Fried rice</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

export default Categories

const styles = StyleSheet.create({
    container:{
        width:'100%',
        // backgroundColor:'green',
        borderRadius:'10',

    },
    head:{
        fontSize:20,
        fontWeight:'600',
        margin:10,
        paddingBottom:5,
        paddingLeft:5

    },
    image:{
        width:20,
        height:20
    },
    box:{
        // backgroundColor:'red',
        flexDirection:'row',
        marginHorizontal:10,
        marginBlock:10,
        padding:10,
        borderRadius:20,
        alignItems:'center',
        justifyContent:'center',
        elevation:2
    },
    text:{
        marginLeft:5,


    }
})