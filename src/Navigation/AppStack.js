import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Alert } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';

import { auth } from '../Firebase/firebase'; // your firebase config
import { onAuthStateChanged, signOut } from 'firebase/auth';

// User Screens
import HomeScreen from '../MainScreens/HomeScreen';
import ProductScreen from '../MainScreens/ProductScreen';
import UserCartScreen from '../MainScreens/UserCartScreen';
import TrackOrderScreen from '../MainScreens/TrackOrderScreen';
import UserProfile from '../MainScreens/UserProfile';
import AccountAndSettings from '../MainScreens/AccountAndSettings';

// Login/Signup Screens
import LoginScreen from '../LoginSignupScreen/LoginScreen';
import SignupNextScreen from '../LoginSignupScreen/SignupNextScreen';
import SignupScreen from '../LoginSignupScreen/SignupScreen';

// Admin Screens
import AdminSignUpScreen from '../AdminScreen/AdminSignup';
import AdminLoginScreen from '../AdminScreen/AdminLogin';
import OrdersScreen from '../AdminMain/OrderScreen';
import AdminHomePage from '../AdminMain/Adminhomepage';
import AddItemScreen from '../AdminMain/AddItemScreen';
import MenuListScreen from '../AdminMain/MenuListScreen';
import AdminSettingsScreen from '../AdminMain/AdminSettingScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// AdminHome Stack to include header with settings icon
const AdminHomeWithHeader = ({ navigation }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AdminHomePage"
        component={AdminHomePage}
        options={{
          title: 'Admin Home',
          headerRight: () => (
            <Ionicons
              name="settings-outline"
              size={24}
              style={{ marginRight: 15 }}
              onPress={() => navigation.navigate('AdminSettingScreen')}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

// HomeStack for User
const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
    <Stack.Screen name="ProductScreen" component={ProductScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const UserTabNavigator = ({ user, onRequireLogin }) => (
  <Tab.Navigator
    initialRouteName="Home"
    screenOptions={({ route }) => ({
      tabBarStyle: styles.tabBar,
      tabBarIcon: ({ color, size }) => {
        let iconName;
        if (route.name === 'Home') iconName = 'home';
        else if (route.name === 'Settings') iconName = 'settings';
        else if (route.name === 'UserCart') iconName = 'cart';
        else if (route.name === 'TrackOrders') iconName = 'map';

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarLabelStyle: styles.tabBarLabel,
    })}
  >
    {/* Pass user and onRequireLogin callback to screens that need to check auth */}
    <Tab.Screen name="UserCart">
      {(props) => (
        <UserCartScreen
          {...props}
          user={user}
          onRequireLogin={onRequireLogin}
        />
      )}
    </Tab.Screen>
    <Tab.Screen name="Home" component={HomeStack} options={{ headerShown: false }} />
    <Tab.Screen name="TrackOrders">
      {(props) => (
        <TrackOrderScreen
          {...props}
          user={user}
          onRequireLogin={onRequireLogin}
        />
        
      )}
    </Tab.Screen>
    <Tab.Screen name="Settings" component={AccountAndSettings} options={{ headerShown: false }} />
  </Tab.Navigator>
);

// AdminStack
const AdminStack = () => (
  <Tab.Navigator
    initialRouteName="AdminHome"
    screenOptions={({ route }) => ({
      tabBarStyle: styles.tabBar,
      tabBarIcon: ({ color, size }) => {
        let iconName;
        if (route.name === 'AdminHome') iconName = 'home';
        else if (route.name === 'Orders') iconName = 'clipboard';
        else if (route.name === 'Menu') iconName = 'menu';
        else if (route.name === 'Item') iconName = 'plus';

        return <Entypo name={iconName} size={size} color={color} />;
      },
      tabBarLabelStyle: styles.tabBarLabel,
    })}
  >
    <Tab.Screen name="AdminHome" component={AdminHomeWithHeader} options={{ headerShown: false }} />
    <Tab.Screen name="Menu" component={MenuListScreen} options={{ headerShown: false }} />
    <Tab.Screen name="Orders" component={OrdersScreen} options={{ headerShown: false }} />
    <Tab.Screen name="Item" component={AddItemScreen} options={{ headerShown: false }} />
  </Tab.Navigator>
);

// Main App Stack (Handling Login, Signup, and Tab Navigation)
const AppStack = () => {
  const [user, setUser] = useState(null); // Firebase user object or null
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for Firebase auth state changes (user or admin)
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // You could check user role here if you have roles in Firebase
      } else {
        setUser(null);
        setAdminLoggedIn(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Function to prompt login when user tries protected actions
  // You can customize this to navigate to Login screen or show modal
  const onRequireLogin = () => {
    Alert.alert(
      "Login Required",
      "You need to login/signup to continue.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Login",
          onPress: () => {
            navigationRef.current?.navigate('Login');
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Always show User UI on launch (browse menus, etc.) */}
        <Stack.Screen name="MainTabs">
          {(props) => <UserTabNavigator {...props} user={user} onRequireLogin={onRequireLogin} />}
        </Stack.Screen>
 <Stack.Screen name="UserProfile" component={UserProfile} />
        {/* Admin Screens */}
        <Stack.Screen name="AdminTabs">
          {() => (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="AdminTabScreens" component={AdminStack} />
              <Stack.Screen name="AdminSettingScreen" component={AdminSettingsScreen} />
            </Stack.Navigator>
          )}
        </Stack.Screen>

        {/* Admin Login and Signup */}
        <Stack.Screen name="AdminLogin">
          {(props) => (
            <AdminLoginScreen
              {...props}
              onAdminLogin={() => setAdminLoggedIn(true)}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="AdminSignUp" component={AdminSignUpScreen} />

        {/* User Login and Signup Screens */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignupScreen} />
        <Stack.Screen name="SignUpNext" component={SignupNextScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppStack;

const styles = StyleSheet.create({
  tabBar: {
    height: 55,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: 'grey',
  },
  tabBarLabel: {
    paddingBottom: 5,
  },
});  