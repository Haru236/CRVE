import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

//  user screens
import LoginScreen from '../LoginSignupScreen/LoginScreen';
import SignupScreen from '../LoginSignupScreen/SignupScreen';
import SignupNextScreen from '../LoginSignupScreen/SignupNextScreen';

// Admin screens
import AdminLogin from '../AdminScreen/AdminLogin';
import AdminSignUp from '../AdminScreen/AdminSignup';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }}>
        {/* User Authentication Screens */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignupScreen} />
        <Stack.Screen name="SignUpNext" component={SignupNextScreen} />

        {/* Admin Authentication Screens */}
        <Stack.Screen name="AdminLogin" component={AdminLogin} />
        <Stack.Screen name="AdminSignup" component={AdminSignUp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AuthStack;

const styles = StyleSheet.create({});
