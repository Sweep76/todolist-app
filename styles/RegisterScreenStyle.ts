// styles/RegisterScreenStyles.ts
import { StyleSheet } from 'react-native'

const RegisterScreenStyles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      justifyContent: 'center',
    },
    title: {
      fontSize: 24,
      marginBottom: 24,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 12,
      borderRadius: 8,
      marginBottom: 12,
    },
    link: {
      marginTop: 20,
      textAlign: 'center',
      color: 'blue',
      textDecorationLine: 'underline',
    },
  })

  export default RegisterScreenStyles