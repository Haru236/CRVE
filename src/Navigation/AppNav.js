import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AppStack from './AppStack'
import AuthStack from './AuthStack'
import AdminNav from './AdminNav'

const AppNav = () => {
  return (
    <>
    <AppStack/>
    {/* <AuthStack/> */}
    {/* <AdminNav/> */}
    </>
  )
}

export default AppNav

const styles = StyleSheet.create({})