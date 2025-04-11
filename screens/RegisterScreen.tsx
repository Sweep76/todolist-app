// screens/RegisterScreen.tsx
import styles from '../styles/RegisterScreenStyle'
import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native'
import { supabase } from '../lib/supabase'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/AppNavigator'

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>

export default function RegisterScreen({ navigation }: Props) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        navigation.navigate('Login')
      }
    }

    checkUser()
  }, [navigation])

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword || !fullName) {
      Alert.alert('Missing fields', 'Please fill out all fields.')
      return
    }

    if (password !== confirmPassword) {
      Alert.alert('Password mismatch', 'Passwords do not match.')
      return
    }

    setLoading(true)

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (signUpError) {
      setLoading(false)
      Alert.alert('Signup Error', signUpError.message)
      return
    }

    const user = signUpData.user

    if (user) {
      // Insert into profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: user.id, full_name: fullName }])

      setLoading(false)

      if (profileError) {
        Alert.alert('Profile Error', profileError.message)
        return
      }

      Alert.alert('Success', 'Account created!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Login'),
        },
      ])
    } else {
      setLoading(false)
      Alert.alert('Error', 'User not found after sign up.')
    }
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/signup-logo.png')}
        style={styles.image}
      />
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        placeholder="Full Name"
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
      />
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
      <TextInput
        placeholder="Confirm Password"
        style={styles.input}
        value={confirmPassword}
        secureTextEntry
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>{loading ? 'Signing up...' : 'Sign Up'}</Text>
      </TouchableOpacity>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.signupLink}> Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
