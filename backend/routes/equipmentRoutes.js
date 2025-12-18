const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();
const filePath = path.join(__dirname, "../data/equipment.json");

const readData = () => {
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
};

const writeData = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// GET all equipment
router.get("/", (req, res) => {
  res.json(readData());
});

// ADD equipment
router.post("/", (req, res) => {
  const equipments = readData();
  const newEquipment = { id: uuidv4(), ...req.body };
  equipments.push(newEquipment);
  writeData(equipments);
  res.status(201).json(newEquipment);
});

// UPDATE equipment
router.put("/:id", (req, res) => {
  let equipments = readData();
  equipments = equipments.map(eq =>
    eq.id === req.params.id ? { ...eq, ...req.body } : eq
  );
  writeData(equipments);
  res.json({ message: "Updated successfully" });
});

// DELETE equipment
router.delete("/:id", (req, res) => {
  const equipments = readData().filter(eq => eq.id !== req.params.id);
  writeData(equipments);
  res.json({ message: "Deleted successfully" });
});

module.exports = router;
