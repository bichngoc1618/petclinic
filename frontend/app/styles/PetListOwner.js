// styles/PetListOwner.js
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  /* Container */
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#ecf7ffff",
  },

  /* Header */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2c3e50",
  },

  /* Pet Card */
  petCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    alignItems: "center",
  },
  petImage: { width: 80, height: 80, borderRadius: 40, marginRight: 12 },
  petImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#d0e4f9",
    justifyContent: "center",
    alignItems: "center",
  },

  petInfoContainer: { flex: 1 },
  petName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2c3e50",
  },
  petInfo: { fontSize: 14, color: "#4a5568", marginTop: 4 },

  actionButtons: { flexDirection: "row" },
  iconButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: "transparent",
  },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContent: {
    width: "88%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },

  /* Pet Detail */
  detailContent: {
    width: "90%",
    backgroundColor: "#eaf6ff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  detailImage: {
    width: 160,
    height: 160,
    borderRadius: 80,
    marginBottom: 16,
    backgroundColor: "#d0e4f9",
    borderWidth: 2,
    borderColor: "#3498db",
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#2c3e50",
    marginBottom: 8,
    textAlign: "center",
  },
  detailText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 6,
    textAlign: "center",
  },

  infoRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  infoLabel: {
    fontSize: 15,
    color: "#4a5568",
    fontWeight: "600",
  },
  infoValue: {
    fontSize: 15,
    color: "#3498db",
    fontWeight: "700",
  },

  saveButton: {
    backgroundColor: "#3498db",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },
  cancelButton: {
    backgroundColor: "#e0e6ea",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    backgroundColor: "#fff",
  },

  genderButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#cfe9ff",
    alignItems: "center",
    marginRight: 8,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  genderButtonSelected: {
    backgroundColor: "#3498db",
    borderColor: "#3498db",
  },
  genderButtonTextSelected: {
    color: "#fff",
    fontWeight: "700",
  },
});
