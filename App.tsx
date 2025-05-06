// App.tsx
import AppNavigator from './navigation/AppNavigator'
import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { supabase } from './lib/supabase'
import AuthNavigator from './navigation/AuthNavigator'
import { View, ActivityIndicator } from 'react-native'
import { Session } from '@supabase/supabase-js' // ✅ Import Session type

export default function App() {
  const [session, setSession] = useState<Session | null>(null) // ✅ Correctly typed
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setLoading(false)
    }

    checkSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
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
