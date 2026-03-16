const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    category: {
      type: String,
      enum: ["Sedan", "SUV", "Van", "Sport", "Convertible"],
      required: true,
    },
    transmission: {
      type: String,
      enum: ["Automatic", "Manual", "Semi-Automatic"],
      required: true,
    },
    fuelType: {
      type: String,
      enum: ["Gas", "Diesel", "Petrol", "Electric", "Hybrid"],
      required: true,
    },
    seatingCapacity: { type: Number, required: true },
    dailyPrice: { type: Number, required: true },
    location: {
      type: String,
      enum: [
        "Tunis",
        "Ariana",
        "Ben Arous",
        "Manouba",
        "Nabeul",
        "Zaghouan",
        "Bizerte",
        "Béja",
        "Jendouba",
        "Kef",
        "Siliana",
        "Sousse",
        "Monastir",
        "Mahdia",
        "Sfax",
        "Kairouan",
        "Kasserine",
        "Sidi Bouzid",
        "Gabès",
        "Mednine",
        "Tataouine",
        "Gafsa",
        "Tozeur",
        "Kébili",
      ],
      required: true,
    },
    description: { type: String, default: "" },
    image: { type: String },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Car", carSchema);
