// styles/RegisterScreenStyles.ts
import { StyleSheet } from 'react-native'

const RegisterScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f2f5",
        paddingHorizontal: 25,
      },
      image: {
        width: 200,  // Adjust the width
        height: 200, // Adjust the height
        marginBottom: 20, // Space between image and text
        resizeMode: "contain",
      },
      title: {
        fontSize: 30,
        fontWeight: "700",
        color: "#222",
        marginBottom: 25,
        letterSpacing: 0.8,
      },
      input: {
        width: "100%",
        height: 50,
        backgroundColor: "#fff",
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        marginBottom: 15,
        borderWidth: 1.5,
        borderColor: "#ccc",
      },
      button: {
        backgroundColor: "darkblue",
        width: "100%",
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 25,
        marginTop: 10,
      },
      buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        letterSpacing: 0.5,
      },
      signupContainer: {
        flexDirection: "row",
        marginTop: 20,
      },
      signupText: {
        fontSize: 14,
        color: "#555",
      },
      signupLink: {
        fontSize: 14,
        color: "#007bff",
        fontWeight: "bold",
        marginLeft: 5,
      },
  })

  export default RegisterScreenStyles