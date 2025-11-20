import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4ff",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#4A90E2",
    marginBottom: 12,
  },

  // Filter bar
  filterBar: {
    flexDirection: "row",
    height: 40,
    marginBottom: 12,
  },
  dayButton: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 16,
    backgroundColor: "#e6e6e6",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  dayButtonActive: {
    backgroundColor: "#6C63FF",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
  },
  dayNumberActive: {
    color: "#fff",
  },

  timelineCard: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  timeLabel: {
    width: 60,
    fontSize: 12,
    color: "#888",
    fontWeight: "600",
  },
  timelineContent: {
    flex: 1,
    backgroundColor: "#4A90E2",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    justifyContent: "center",
  },
  timelineTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "90%",
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
    color: "#4A90E2",
  },
  modalLabel: {
    fontSize: 16,
    marginTop: 10,
    color: "#333",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
});
