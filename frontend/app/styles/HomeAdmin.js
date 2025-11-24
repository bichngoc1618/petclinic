import { StyleSheet } from "react-native";

export default StyleSheet.create({
  /* Container */
  container: {
    flex: 1,
    backgroundColor: "#ecf7ffff",
    padding: 16,
  },

  /* Header */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2c3e50",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginLeft: 10,
  },
  defaultAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  avatarInitial: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },

  /* Banner */
  bannerContainer: {
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    zIndex: -10,
    marginVertical: 20,
  },
  bannerCard: {
    width: "100%",
    height: 160,
    borderRadius: 20,
    backgroundColor: "#dcedfc",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  bannerTextBox: {
    position: "absolute",
    bottom: 20,
    alignItems: "center",
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#083e90",
    marginBottom: 6,
    textAlign: "center",
  },
  bannerSlogan: {
    fontSize: 14,
    color: "#0d47a1",
    marginBottom: 12,
    textAlign: "center",
  },
  petImage: {
    width: 300,
    height: 300,
    position: "absolute",
    bottom: 0,
    left: "50%",
    top: -164,
    marginLeft: -150,
    zIndex: -3,
  },

  /* Stats Cards */
  stats: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  card: {
    width: "48%",
    paddingVertical: 14,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: "center",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 5,
  },
  cardIcon: {
    fontSize: 22,
    marginBottom: 6,
    color: "#3498db",
  },
  cardNumber: {
    fontSize: 22,
    fontWeight: "800",
    color: "#2c3e50",
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2c3e50",
    marginTop: 4,
  },

  /* Search + Filter */
  searchFilterContainer: { marginVertical: 12 },
  searchInput: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 8,
  },
  filterButtons: { flexDirection: "row", marginBottom: 10 },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  filterButtonActive: { backgroundColor: "#3498db", borderColor: "#3498db" },
  filterButtonText: { fontSize: 12, color: "#333" },
  filterButtonTextActive: { color: "#fff" },

  /* Appointments */
  appointmentCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  appointmentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  appointmentPet: {
    fontWeight: "700",
    fontSize: 16,
    color: "#2c3e50",
  },
  appointmentType: {
    color: "#3498db",
    fontSize: 14,
    marginTop: 2,
  },
  appointmentDate: {
    color: "#555",
    fontSize: 13,
    marginTop: 2,
  },
  status: {
    fontWeight: "700",
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    color: "#fff",
    textAlign: "center",
  },
  statusCompleted: { backgroundColor: "#4caf50" },
  statusTreating: { backgroundColor: "#2196f3" },
  statusWaiting: { backgroundColor: "#ff9800" },
  statusCancelled: { backgroundColor: "#f44336" },

  /* Titles */
  servicesTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: 12,
  },
});
