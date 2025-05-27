import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Entypo from '@expo/vector-icons/Entypo';

const Headerbar = () => {
  return (
   <View style={styles.container}>
         <TouchableOpacity style={{flexDirection:'row'}}>
         <Entypo name="location" size={28} color="black"  style={{paddingVertical:6}}/>
            <View style={{paddingHorizontal:5}}>

            
            
            <View>
                <Text style={{paddingRight:3,fontSize:16,fontWeight:'700%'}}>Location</Text>
            </View>
        
         <Text>Kohima</Text>
         </View>
          </TouchableOpacity>
        </View>
  )
}

export default Headerbar

const styles = StyleSheet.create({
    container:{
        flexDirection:'row',
        alignItems: 'center',
        marginTop: 35,
        borderBottomWidth:1,
        borderColor:'grey',
        justifyContent:"space-between",
        height: 50,
        backgroundColor:'white',
        paddingHorizontal:20,
        paddingVertical:10,
       
    }
})