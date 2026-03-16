const express = require("express");
const route = express.Router();
const Reservation = require("../Models/Reservation");
const Car = require("../Models/Car");
const { auth, isAdmin } = require("../Middleware/auth");

// ── GET périodes réservées d'une voiture (public) ──
route.get("/booked-periods/:carId", async (req, res) => {
  try {
    const periods = await Reservation.find({
      car: req.params.carId,
      status: { $in: ["confirmed", "pending"] },
      endDate: { $gte: new Date() },
    }).select("startDate endDate");
    res.json(periods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET mes réservations (user) ──
route.get("/my", auth, async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user.id })
      .populate("car")
      .sort({ createdAt: -1 });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET toutes les réservations (admin) ──
route.get("/", auth, isAdmin, async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("user", "firstname lastname email")
      .populate("car", "brand model image dailyPrice")
      .sort({ createdAt: -1 });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST créer une réservation (user) ──
route.post("/", auth, async (req, res) => {
  try {
    const { carId, startDate, endDate, totalPrice, days } = req.body;

    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ message: "Car not found" });
    if (!car.isAvailable)
      return res.status(400).json({ message: "Car is out of service" });

    const conflict = await Reservation.findOne({
      car: carId,
      status: "confirmed",
      startDate: { $lte: new Date(endDate) },
      endDate: { $gte: new Date(startDate) },
    });

    if (conflict) {
      return res.status(400).json({
        message: `Already booked from ${new Date(
          conflict.startDate,
        ).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })} 
            to ${new Date(conflict.endDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
            })}`,
      });
    }

    const reservation = await Reservation.create({
      user: req.user.id,
      car: carId,
      startDate,
      endDate,
      totalPrice,
      days,
    });

    const populated = await reservation.populate(["user", "car"]);
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PUT update status (admin) ──
route.put("/:id/status", auth, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: "Not found" });

    reservation.status = status;
    await reservation.save();

    // Vérifie si la voiture est occupée EN CE MOMENT
    const now = new Date();
    const activeNow = await Reservation.findOne({
      car: reservation.car,
      status: "confirmed",
      startDate: { $lte: now }, // La réservation a commencé
      endDate: { $gte: now }, // La réservation n'est pas encore terminée 
    });

    // isAvailable = false seulement si une résa est active maintenant
    await Car.findByIdAndUpdate(reservation.car, {
      isAvailable: !activeNow,
    });

    const updated = await Reservation.findById(req.params.id)
      .populate("user", "firstname lastname email")
      .populate("car", "brand model image dailyPrice");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE annuler (user) ──
route.delete("/:id", auth, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation)
      return res.status(404).json({ message: "Not found" });

    if (reservation.user.toString() !== req.user.id) 
      return res.status(403).json({ message: "Not authorized" });

    const now = new Date();
    const start = new Date(reservation.startDate);

    const diffHours = (start - now) / (1000 * 60 * 60); // Convertit la différence en heures

    if (diffHours < 24) {
      return res.status(400).json({
        message: "Cannot cancel less than 24h before reservation"
      });
    }

    reservation.status = "cancelled";
    await reservation.save();

    res.json({ message: "Reservation cancelled" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET voitures déjà réservées sur une période — public

route.get("/booked-cars", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate)
      return res
        .status(400)
        .json({ message: "startDate and endDate required" });

    // Trouve toutes les réservations qui chevauchent la période
    const reservations = await Reservation.find({
      status: { $in: ["confirmed", "pending"] },
      startDate: { $lte: new Date(endDate) },
      endDate: { $gte: new Date(startDate) },
    }).select("car");

    // Retourne les IDs des voitures réservées
    const bookedCarIds = [
      ...new Set(reservations.map((r) => r.car.toString())),
    ];

    res.json(bookedCarIds);
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = route;
