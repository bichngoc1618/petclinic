import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e3f2fd",
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e3f2fd",
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  card: {
    flex: 1,
    backgroundColor: "#bbdefb",
    padding: 20,
    borderRadius: 16,
    marginHorizontal: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cardLabel: {
    fontSize: 16,
    color: "#1a237e",
    fontWeight: "600",
  },
  cardValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0d47a1",
    marginTop: 5,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a237e",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  chart: {
    borderRadius: 16,
  },
  chartConfig: {
    backgroundGradientFrom: "#bbdefb",
    backgroundGradientTo: "#90caf9",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(26, 35, 126, ${opacity})`,
    labelColor: () => "#1a237e",
    style: {
      borderRadius: 16,
    },
  },
});
