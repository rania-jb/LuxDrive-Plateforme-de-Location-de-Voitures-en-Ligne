const express = require("express");
const route = express.Router();
const { auth, isAdmin } = require("../Middleware/auth");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const Car = require("../Models/Car");

// ── GET ALL ── public
route.get("/", async (req, res) => {
  try {
    const {
      category,
      transmission,
      fuelType,
      location,
      minPrice,
      maxPrice,
      sortBy,
    } = req.query;

    const filter = {};
    if (category && category !== "All") filter.category = category;
    if (transmission && transmission !== "All")
      filter.transmission = transmission;
    if (fuelType && fuelType !== "All") filter.fuelType = fuelType;
    if (location && location !== "All") filter.location = location;
    
    if (minPrice || maxPrice) {
      filter.dailyPrice = {};
      if (minPrice) filter.dailyPrice.$gte = Number(minPrice); 
      if (maxPrice) filter.dailyPrice.$lte = Number(maxPrice);
    }

    let sortOption = { createdAt: -1 }; 
    if (sortBy === "price-asc") sortOption = { dailyPrice: 1 };
    if (sortBy === "price-desc") sortOption = { dailyPrice: -1 };

    const cars = await Car.find(filter).sort(sortOption);
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET BY ID ── public
route.get("/:id", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json(car);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── CREATE ──

// ── CLOUDINARY CONFIG ──
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// ── MULTER + CLOUDINARY STORAGE ──
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "car-rental/cars",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "avif"],
    transformation: [
      { width: 1280, height: 720, crop: "fill", quality: "auto" },
    ],
    public_id: `car-${Date.now()}`,
  }),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

route.post("/", auth, isAdmin, upload.single("image"), async (req, res) => {
  try {
    const {
      brand,
      model,
      year,
      category,
      transmission,
      fuelType,
      seatingCapacity,
      dailyPrice,
      location,
      description,
      isAvailable,
    } = req.body;

    const car = await Car.create({
      brand,
      model,
      year: Number(year),
      category,
      transmission,
      fuelType,
      seatingCapacity: Number(seatingCapacity),
      dailyPrice: Number(dailyPrice),
      location,
      description,
      isAvailable: isAvailable === "true",
      image: req.file ? req.file.path : "",
    });

    res.status(201).json(car);
  } catch (err) {
    console.error("CREATE CAR ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

// ── UPDATE ── admin
route.put("/:id", auth, isAdmin, upload.single("image"), async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });

    const fields = [
      "brand",
      "model",
      "year",
      "category",
      "transmission",
      "fuelType",
      "seatingCapacity",
      "dailyPrice",
      "location",
      "description",
      "isAvailable",
    ];

    fields.forEach((f) => {
      if (req.body[f] !== undefined) car[f] = req.body[f]; // Update only provided fields
    });

    if (req.file) {
      // Supprimer l'ancienne image Cloudinary
      if (car.image && car.image.includes("cloudinary")) {
        const publicId = car.image.split("/").slice(-2).join("/").split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }

      // Ajouter la nouvelle image
      car.image = req.file.path;
    }

    const updated = await car.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE ── admin
route.delete("/:id", auth, isAdmin, async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    if (car.image && car.image.includes("cloudinary")) {
      const publicId = car.image.split("/").slice(-2).join("/").split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }
    res.json({ message: "Car deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = route;
