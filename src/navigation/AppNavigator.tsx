import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import ProductListScreen from '../screens/ProductListScreen';
import CartScreen from '../screens/CartScreen';
import UserDetailsScreen from '../screens/UserDetailsScreen';
import LargeListScreen from '../screens/LargeListScreen';
import OfflineDataScreen from '../screens/OfflineDataScreen';
import TokenStorageScreen from '../screens/TokenStorageScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Products') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'LargeList') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'OfflineData') {
            iconName = focused ? 'cloud' : 'cloud-outline';
          } else {
            iconName = focused ? 'key' : 'key-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: '#000',
          borderTopColor: '#333',
        },
      })}
    >
      <Tab.Screen 
        name="Products" 
        component={ProductListScreen} 
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Cart" 
        component={CartScreen} 
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="LargeList" 
        component={LargeListScreen} 
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="OfflineData" 
        component={OfflineDataScreen} 
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="TokenStorage" 
        component={TokenStorageScreen} 
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer
      linking={{
        prefixes: ['myapp://'],
        config: {
          screens: {
            MainTabs: 'main',
            UserDetails: 'user/:id',
          },
        },
      }}
    >
      <Stack.Navigator>
        <Stack.Screen 
          name="MainTabs" 
          component={MainTabs} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="UserDetails" 
          component={UserDetailsScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
