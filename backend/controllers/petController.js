const Pet = require("../models/pet");
const fs = require("fs");
const path = require("path");

// Thêm thú cưng
exports.addPet = async (req, res) => {
  try {
    const { owner, name, species, breed, age, gender } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!owner || !name || !species || !age)
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });

    const pet = new Pet({ owner, name, species, breed, age, gender, image });
    await pet.save();
    res.status(201).json(pet);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Lấy tất cả thú cưng
exports.getAllPets = async (req, res) => {
  try {
    const pets = await Pet.find().populate("owner", "name email");
    res.status(200).json(pets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy thú cưng theo ownerId
exports.getPetsByOwner = async (req, res) => {
  try {
    const ownerId = req.params.ownerId;
    const pets = await Pet.find({ owner: ownerId });
    res.status(200).json(pets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Lấy chi tiết 1 thú cưng
exports.getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet)
      return res.status(404).json({ message: "Không tìm thấy thú cưng" });
    res.status(200).json(pet);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Cập nhật thú cưng
exports.updatePet = async (req, res) => {
  try {
    const petId = req.params.id;
    const pet = await Pet.findById(petId);
    if (!pet)
      return res.status(404).json({ message: "Không tìm thấy thú cưng" });

    const { name, species, breed, age, gender } = req.body;
    if (name) pet.name = name;
    if (species) pet.species = species;
    if (breed) pet.breed = breed;
    if (age) pet.age = age;
    if (gender) pet.gender = gender;

    // Xử lý ảnh mới
    if (req.file) {
      if (pet.image) {
        const oldPath = path.join(__dirname, "../uploads", pet.image);
        try {
          await fs.promises.unlink(oldPath);
        } catch (err) {
          console.log("Xoá ảnh cũ thất bại:", err);
        }
      }
      pet.image = req.file.filename;
    }

    await pet.save();
    res.status(200).json(pet);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Xoá thú cưng
exports.deletePet = async (req, res) => {
  try {
    const petId = req.params.id;
    const pet = await Pet.findById(petId);
    if (!pet)
      return res.status(404).json({ message: "Không tìm thấy thú cưng" });

    // Xoá ảnh nếu có
    if (pet.image) {
      const filePath = path.join(__dirname, "../uploads", pet.image);
      try {
        await fs.promises.unlink(filePath);
      } catch (err) {
        console.log("Xoá ảnh thất bại:", err);
      }
    }

    await pet.deleteOne();
    res.status(200).json({ message: "Đã xoá thú cưng" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
