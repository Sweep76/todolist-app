import React, {useEffect, useState } from "react";
import { Alert,View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";  
import { RootStackParamList } from "../navigation/AppNavigator";
import profileStyles from "../styles/profileStyles";
import { supabase } from '../lib/supabase'
import { fetchUserDisplayName } from '../lib/user'


const ProfileScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [displayName, setDisplayName] = useState<string | null>(null)

  const handleSignOut = () => {
    navigation.replace("Login");
  };

  useEffect(() => {
    const loadDisplayName = async () => {
      const name = await fetchUserDisplayName()
      if (name) setDisplayName(name)
    }
    loadDisplayName()
  }, [])

  // const handleSample = () => {
  //   navigation.replace("SampleScreen");
  // };
const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      Alert.alert('Logout error', error.message)
    } else {
      navigation.replace('Login')
    }
  }
  return (
    <View style={profileStyles.container}>
      {/* Profile Icon */}
      <Ionicons name="person-circle-outline" size={100} color="#007bff" />

      {displayName ? (
        <Text style={profileStyles.username}>{displayName}</Text>
      ) : (
        <ActivityIndicator size="small" color="#0000ff" /> // Show loading spinner if displayName is not available
      )}

      <TouchableOpacity style={profileStyles.signOutButton} onPress={handleLogout}>
        <Text style={profileStyles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity style={profileStyles.signOutButton} onPress={handleSample}>
        <Text style={profileStyles.signOutText}>Sample</Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default ProfileScreen;
