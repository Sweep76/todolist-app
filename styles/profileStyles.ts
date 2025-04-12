import { StyleSheet } from "react-native";

const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    padding: 20,
  },
  profileIcon: {
    marginBottom: 10,
    backgroundColor: "white",
    borderRadius: 60,
    padding: 15,
  },
  username: {
    fontSize: 24,
    fontWeight: "600",
    color: "#222",
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  signOutButton: {
    backgroundColor: "#ff4757",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    shadowColor: "#ff6b81",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginTop: 20,
    width: "75%",
  },
  signOutText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Arial",
    letterSpacing: 1,
    textAlign: "center",
  },
});

export default profileStyles;
