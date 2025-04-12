import { supabase } from './supabase'
import { Alert } from 'react-native'

export const fetchUserDisplayName = async (): Promise<string | null> => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  if (error) {
    Alert.alert('Error fetching user display name', error.message)
    return null
  }

  return data?.full_name ?? null
}