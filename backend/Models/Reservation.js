const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    car: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    days:        { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled","completed"],
      default: "pending",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Reservation", reservationSchema);
