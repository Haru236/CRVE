// import { StyleSheet, Text, View } from 'react-native';
// import React from 'react';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { NavigationContainer } from '@react-navigation/native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Entypo from '@expo/vector-icons/Entypo';
// import OrdersScreen from '../AdminMain/OrderScreen';
// import AdminHomePage from '../AdminMain/Adminhomepage';
// import AddItemScreen from '../AdminMain/AddItemScreen';
// import MenuListScreen from '../AdminMain/MenuListScreen';
// import AdminSettingsScreen from '../AdminMain/AdminSettingScreen';

// const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();

// const HomeStack = () => (
//   <Stack.Navigator>
//     <Stack.Screen name="Adminhomescreen" component={AdminHomePage} options={{ headerShown: false }} />
//     <Stack.Screen name="OrderScreen" component={OrdersScreen} options={{ headerShown: false }} />
//   </Stack.Navigator>
// );

// const TabNavigator = () => (
//   <Tab.Navigator
//     initialRouteName="AdminHome"
//     screenOptions={({ route }) => ({
//       tabBarStyle: styles.tabBar,
//       tabBarIcon: ({ color, size }) => {
//         let iconName;
//         if (route.name === 'AdminHome') iconName = 'home';
//         else if (route.name === 'Orders') iconName = 'clipboard';
//         else if (route.name === 'Menu') iconName = 'menu';
//         else if (route.name === 'Item') iconName = 'plus';

//         return <Entypo name={iconName} size={size} color={color} />;
//       },
//       tabBarLabelStyle: styles.tabBarLabel,
//     })}
//   >
//     <Tab.Screen name="AdminHome" component={AdminHomePage} options={{ headerShown: false }} />
//     <Tab.Screen name="Menu" component={MenuListScreen} options={{ headerShown: false }} />
//     <Tab.Screen name="Orders" component={OrdersScreen} options={{ headerShown: false }} />
//     <Tab.Screen name="Item" component={AddItemScreen} options={{ headerShown: false }} />
//   </Tab.Navigator>
// );

// const AppStack = () => {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator screenOptions={{ headerShown: false }}>
//         {/* Tab Navigator as Main */}
//         <Stack.Screen name="MainTabs" component={TabNavigator} />
//         {/* AdminSettingsScreen now accessible only through navigation */}
//         <Stack.Screen name="AdminSettingScreen" component={AdminSettingsScreen} options={{ headerShown: false }} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default AppStack;

// const styles = StyleSheet.create({
//   tabBar: {
//     height: 55,
//     backgroundColor: 'white',
//     borderTopWidth: 1,
//     borderColor: 'grey',
//   },
//   tabBarLabel: {
//     paddingBottom: 5,
//   },
// });
