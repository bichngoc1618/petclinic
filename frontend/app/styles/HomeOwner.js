import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e3f2fd",
    padding: 16,
  },

  /* Header */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1976D2",
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
    backgroundColor: "#64b5f6",
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
  /* Banner */
  bannerContainer: {
    height: 200,
    backgroundColor: "#dcedfcff",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 16,
    overflow: "visible",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
    position: "relative",
  },

  bannerImage: {
    width: 260,
    height: 260,
    position: "absolute",
    top: -90,
    left: "50%",
    marginLeft: -130, // trừ 1/2 width để căn giữa
    zIndex: 2,
    resizeMode: "contain",
    transform: [{ rotate: "-5deg" }],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },

  bannerTextBox: {
    alignItems: "center",
    zIndex: 3,
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

  bookButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },

  bookButtonText: {
    color: "#0d47a1",
    fontWeight: "700",
    fontSize: 14,
  },

  /* Stats Cards */
  stats: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    paddingVertical: 12,
    borderRadius: 18,
    marginBottom: 16,
    alignItems: "center",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  cardIcon: { fontSize: 22, marginBottom: 6, color: "#1976D2" },
  cardNumber: { fontSize: 22, fontWeight: "800", color: "#1976D2" },
  cardLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1976D2",
    marginTop: 4,
  },

  /* Appointments */
  /* Appointments - Updated */
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1976D2",
    marginBottom: 12,
  },
  appointmentCard: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 20,
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
    fontSize: 17,
    color: "#0d47a1",
  },

  appointmentType: {
    color: "#1976D2",
    fontSize: 14,
    marginTop: 2,
  },

  appointmentDate: {
    color: "#555",
    fontSize: 13,
    marginTop: 2,
  },

  appointmentNote: {
    fontSize: 13,
    color: "#777",
    marginTop: 4,
    fontStyle: "italic",
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

  /* Services */
  servicesContainer: {
    marginVertical: 20,
  },
  servicesTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1976D2",
    marginBottom: 12,
  },
  servicesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  serviceCard: {
    width: "30%",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  serviceLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#083e90",
    textAlign: "center",
    marginTop: 6,
  },

  /* Empty State */
  emptyCardContainer: {
    width: "100%",
    backgroundColor: "#bfdff8ff",
    borderRadius: 16,
    marginBottom: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 6,
  },
  emptyCardText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1976D2",
    marginBottom: 12,
    textAlign: "center",
  },
  emptyCardButton: {
    backgroundColor: "#64b5f6",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  emptyCardButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});
