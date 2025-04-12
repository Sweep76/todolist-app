// screens/LoginScreen.tsx
import React, { useState } from 'react'
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native'
import { supabase } from '../lib/supabase'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/AppNavigator'
import styles from '../styles/LoginScreenStyle' 

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing fields', 'Please fill out all fields.')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      Alert.alert('Login Error', error.message)
    } else {
      Alert.alert('Success', 'Logged in successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.replace('MainTabs'), // Navigate to Home after successful login
        },
      ])
    }
  }

  return (
    <View style={styles.container}>
     {/* Add the Image */}
     <Image source={require("../assets/images/login-background.png")} style={styles.image} />
     <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.description}>You got things to do</Text>

      <TextInput
        placeholder="Email Address"
        style={styles.input}
        value={email}
        autoCapitalize="none"
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
    
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.signupbutton} onPress={() => navigation.navigate("Register")}>
            <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
    </View>
  )
}


