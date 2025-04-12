import { StyleSheet } from "react-native";

const completedStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  taskItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  completedText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  taskButtons: {
    flexDirection: 'row', // Align buttons horizontally
    justifyContent: 'space-between', // Space the buttons apart
    alignItems: 'center', // Vertically center the icons
    width: 100, // Adjust width based on your design requirements
    paddingHorizontal: 15, // Optional: Add horizontal padding
  },
  buttonWithText: {
    flexDirection: 'column', // Stack icon and text vertically
    alignItems: 'center', // Center the icon and text horizontally
  },
  buttonText: {
    marginTop: 4, // Add some space between the icon and text
    fontSize: 12, // Adjust the font size
    color: 'gray', // Color for the text
  },
  emptyText: {
    textAlign: "center",
    fontSize: 18,
    color: "gray",
    marginTop: 50,
  },
  // Modal Styling
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    borderColor: "#007bff",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    fontSize: 16,
    color: "red",
    fontWeight: "bold",
    padding: 10,
  },
  saveButton: {
    fontSize: 16,
    color: "#007bff",
    fontWeight: "bold",
    padding: 10,
  },
  taskDetails: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
    marginBottom: 5,
  },
  
});

export default completedStyles;
