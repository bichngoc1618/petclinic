// styles/PetListOwner.js
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#EAF6FF" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: { fontSize: 22, fontWeight: "700", color: "#0d47a1" },

  petCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    alignItems: "center",
  },
  petImage: { width: 80, height: 80, borderRadius: 40, marginRight: 12 },
  petImagePlaceholder: {
    backgroundColor: "#DFF0FF",
    justifyContent: "center",
    alignItems: "center",
  },

  petInfoContainer: { flex: 1 },
  petName: { fontSize: 18, fontWeight: "800", color: "#0d47a1" },
  petInfo: { fontSize: 13, color: "#4a5568", marginTop: 4 },

  actionButtons: { flexDirection: "row" },
  iconButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: "transparent",
  },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContent: {
    width: "88%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
  },

  // ------------------ Chi tiết thú cưng ------------------
  detailContent: {
    width: "90%",
    backgroundColor: "#f7faff",
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
    backgroundColor: "#e0f0ff",
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0d47a1",
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
    color: "#0d47a1",
    fontWeight: "700",
  },

  saveButton: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },
  cancelButton: {
    backgroundColor: "#E0E6EA",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
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
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  genderButtonSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
    color: "#fff",
  },
});
