import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons' // or any icon lib you prefer

import HomeScreen from '../screens/HomeScreen'
import EditTaskScreen from '../screens/EditTaskScreen'
import CompletedScreen from '../screens/CompletedScreen'
import ProfileScreen from '../screens/ProfileScreen'

// Task type (shared with HomeScreen)
export type Task = {
  id: string
  task_name: string
  task_details: string | null
  is_completed: boolean
}
export type TabParamList = {
  Home: undefined
  Completed: undefined
  Profile: undefined
}
// Define root stack (auth + tabs)
export type RootStackParamList = {
  Login: undefined
  Register: undefined
  MainTabs: undefined
  Completed: undefined
  EditTask: { task: Task }
}

const RootStack = createNativeStackNavigator<RootStackParamList>()
const Tab = createBottomTabNavigator<TabParamList>()

// Tab navigator containing the screens that should show tabs
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home'

          if (route.name === 'Home') iconName = 'home'
          if (route.name === 'Completed') iconName = 'clipboard'
          if (route.name === 'Profile') iconName = 'person'
          

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Completed" component={CompletedScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}


export default function AppNavigator() {
  return (
    <RootStack.Navigator initialRouteName="MainTabs" screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="MainTabs" component={MainTabs} />
      <RootStack.Screen name="EditTask" component={EditTaskScreen} />
    </RootStack.Navigator>
  )
}

