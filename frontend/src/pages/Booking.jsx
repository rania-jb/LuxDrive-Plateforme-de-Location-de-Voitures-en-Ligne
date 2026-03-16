import { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createReservation } from "../Redux/actions";
import {
  FiCalendar,
  FiArrowRight,
  FiCheck,
  FiAlertTriangle,
} from "react-icons/fi";
import { RiCarLine } from "react-icons/ri";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { TbManualGearbox } from "react-icons/tb";
import { MdOutlineLocalGasStation } from "react-icons/md";
import "./Booking.css";

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((s) => s.auth);
  const { cars } = useSelector((s) => s.cars);
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [bookingError, setBookingError] = useState("");

  const car = cars.find((c) => c._id === id);
  const { startDate, endDate, totalPrice, days } = location.state || {};

  // Redirige l'admin
  useEffect(() => {
    if (user?.role === "admin") navigate("/admin/dashboard");
    if (!startDate || !car) navigate("/cars");
  }, [user, navigate, startDate, car]);

  const handleConfirm = async () => {
    setLoading(true);
    setBookingError(""); // reset erreur
    try {
      await dispatch(
        createReservation({
          carId: id,
          startDate,
          endDate,
          totalPrice,
          days,
        }),
      );
      setConfirmed(true);
    } catch (err) {
      // Affiche le message d'erreur du backend 
      setBookingError(
        err.response?.data?.message || "Reservation failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!car || !startDate) return null;

  if (confirmed)
    return (
      <div className="booking-page">
        <div className="booking-success">
          <div className="success-circle">
            <FiCheck size={40} />
          </div>
          <h2>Booking Confirmed!</h2>
          <p>
            Your reservation for{" "}
            <strong>
              {car.brand} {car.model}
            </strong>{" "}
            has been submitted.
          </p>
          <p className="success-sub">
            We'll contact you shortly to finalize your booking.
          </p>
          <div className="success-actions">
            <button
              onClick={() => navigate("/my-reservations")}
              className="success-btn-primary"
            >
              View My Reservations
            </button>
            <button
              onClick={() => navigate("/cars")}
              className="success-btn-secondary"
            >
              Browse More Cars
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="booking-page">
      <div className="booking-container">
        <div className="booking-header">
          <button className="booking-back" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <div>
            <h1>Confirm Booking</h1>
            <p>Review your reservation details</p>
          </div>
        </div>

        <div className="booking-grid">
          {/* ── LEFT ── */}
          <div className="booking-left">
            <div className="booking-car-card">
              <div className="booking-car-img">
                <img
                  src={car.image || "/car-placeholder.png"}
                  alt={`${car.brand} ${car.model}`}
                />
              </div>
              <div className="booking-car-info">
                <span className="booking-car-cat">{car.category}</span>
                <h2>
                  {car.brand} <span>{car.model}</span>
                </h2>
                <p className="booking-car-year">{car.year}</p>
                <div className="booking-car-specs">
                  <span>
                    <TbManualGearbox size={13} /> {car.transmission}
                  </span>
                  <span>
                    <MdOutlineLocalGasStation size={13} /> {car.fuelType}
                  </span>
                  <span>
                    <HiOutlineLocationMarker size={13} /> {car.location}
                  </span>
                </div>
              </div>
            </div>

            <div className="booking-dates-card">
              <h3>
                <FiCalendar size={15} /> Rental Period
              </h3>
              <div className="booking-dates-row">
                <div className="booking-date-box">
                  <label>Pick-up</label>
                  <span>
                    {new Date(startDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="booking-dates-arrow">
                  <FiArrowRight size={18} />
                </div>
                <div className="booking-date-box">
                  <label>Return</label>
                  <span>
                    {new Date(endDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
              <div className="booking-duration">
                <RiCarLine size={14} />
                {days} day{days > 1 ? "s" : ""} rental
              </div>
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="booking-right">
            <div className="booking-summary-card">
              <h3>Price Summary</h3>

              <div className="summary-rows">
                <div className="summary-row">
                  <span>Daily rate</span>
                  <span>{car.dailyPrice} TND</span>
                </div>
                <div className="summary-row">
                  <span>Duration</span>
                  <span>
                    {days} day{days > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="summary-divider" />
                <div className="summary-row total">
                  <span>Total</span>
                  <span>{totalPrice} TND</span>
                </div>
              </div>

              <div className="booking-renter">
                <h4>Renter Information</h4>
                <div className="renter-info-row">
                  <span>Name</span>
                  <span>
                    {user?.firstname} {user?.lastname}
                  </span>
                </div>
                <div className="renter-info-row">
                  <span>Email</span>
                  <span>{user?.email}</span>
                </div>
                {user?.phone && (
                  <div className="renter-info-row">
                    <span>Phone</span>
                    <span>{user?.phone}</span>
                  </div>
                )}
              </div>

              {/* ── Erreur chevauchement ── */}
              {bookingError && (
                <div className="booking-error">
                  <FiAlertTriangle size={15} />
                  {bookingError}
                  <button
                    className="booking-error-back"
                    onClick={() => navigate(-1)}
                  >
                    Change dates
                  </button>
                </div>
              )}

              <button
                className="booking-confirm-btn"
                onClick={handleConfirm}
                disabled={loading || !!bookingError}
              >
                {loading
                  ? "Processing..."
                  : `Confirm Booking — ${totalPrice} TND`}
              </button>

              <p className="booking-note">
                Your reservation will be pending until confirmed by our team.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
