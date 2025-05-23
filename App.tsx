import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { supabase } from './lib/supabase'
import AuthNavigator from './/navigation/AuthNavigator'
import AppNavigator from './/navigation/AppNavigator'
import { ActivityIndicator, View } from 'react-native'
import { Session } from '@supabase/supabase-js'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
const [password, setPassword] = useState('')


  useEffect(() => {
    // Use auth state change listener as the single source of truth
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', session)
      setSession(session)
      setLoading(false)
    })

    // On first load, manually get session to trigger the above
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <NavigationContainer>
      {session ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  )
}
