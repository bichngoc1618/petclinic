const Pet = require("../models/pet");

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

exports.getAllPets = async (req, res) => {
  try {
    const pets = await Pet.find().populate("owner", "name email");
    res.status(200).json(pets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
