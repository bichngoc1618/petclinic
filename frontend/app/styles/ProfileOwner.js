import { StyleSheet, Platform, Dimensions } from "react-native";
const { height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e3f2fd", // pastel xanh nhẹ
    padding: 20,
    alignItems: "center", // canh giữa toàn bộ nội dung
  },
  avatar: {
    width: 260, // to hơn
    height: 260,
    borderRadius: 80,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#90caf9",
    backgroundColor: "#bbdefb",
  },
  avatarPlaceholder: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#90caf9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  nameText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a237e",
    textAlign: "center",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 16,
    color: "#3f51b5",
    textAlign: "center",
    marginBottom: 12,
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    fontSize: 16,
    color: "#1a237e",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#e3f2fd",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    alignItems: "center", // canh giữa nội dung modal
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    width: "100%",
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#f8bbd0", // pastel hồng
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 10,
    alignItems: "center",
  },
  cancelBtnText: {
    color: "#880e4f",
    fontWeight: "700",
    fontSize: 16,
  },
  saveBtn: {
    flex: 1,
    backgroundColor: "#90caf9", // pastel xanh
    paddingVertical: 12,
    borderRadius: 12,
    marginLeft: 10,
    alignItems: "center",
  },
  saveBtnText: {
    color: "#1a237e",
    fontWeight: "700",
    fontSize: 16,
  },
  headerBtn: {
    marginRight: 10,
    paddingVertical: 5,
    paddingHorizontal: 12,
    backgroundColor: "#90caf9",
    borderRadius: 12,
  },
  headerBtnText: {
    color: "#1a237e",
    fontWeight: "700",
    fontSize: 16,
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
