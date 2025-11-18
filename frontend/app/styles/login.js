// login.js (styles)
import { StyleSheet, Dimensions } from "react-native";
const { height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: "transparent",
  },

  container: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  // Header
  centerTop: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 90,
    height: 90,
    resizeMode: "contain",
  },
  appTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1976D2",
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },

  // Form
  formCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    minHeight: 280,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },

  input: {
    flex: 1,
    height: 45,
    fontSize: 15,
    color: "#333",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  inputFocused: {
    borderColor: "#1976D2",
    backgroundColor: "#eef6ff",
  },

  primaryButton: {
    backgroundColor: "#1976D2",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },

  footerPaws: {
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  footerImage: {
    width: "100%",
    height: height * 0.15,
    resizeMode: "contain",
  },
});
