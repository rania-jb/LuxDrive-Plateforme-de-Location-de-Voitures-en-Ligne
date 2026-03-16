import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchCarById } from "../Redux/actions";
import API from "../services/api";
import { FiArrowLeft, FiCalendar, FiArrowRight } from "react-icons/fi";
import { TbManualGearbox } from "react-icons/tb";
import {
  MdOutlineLocalGasStation,
  MdOutlineAirlineSeatReclineNormal,
} from "react-icons/md";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { BsTag, BsCalendar3 } from "react-icons/bs";
import { RiCarLine, RiLockLine } from "react-icons/ri";
import "./CarDetail.css";

const SPECS = (car) => [
  {
    icon: <TbManualGearbox color="#d97706" size={20} />,
    label: "Transmission",
    value: car.transmission,
  },
  {
    icon: <MdOutlineLocalGasStation color="#06d911" size={20} />,
    label: "Fuel Type",
    value: car.fuelType,
  },
  {
    icon: <MdOutlineAirlineSeatReclineNormal color="#d906b6" size={20} />,
    label: "Seats",
    value: `${car.seatingCapacity} persons`,
  },
  {
    icon: <BsTag size={18} color="#46059b" />,
    label: "Category",
    value: car.category,
  },
  {
    icon: <HiOutlineLocationMarker size={20} color="#11dfbc" />,
    label: "Location",
    value: car.location,
  },
  {
    icon: <BsCalendar3 size={17} color="#d90618" />,
    label: "Year",
    value: car.year,
  },
];

const CarDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedCar: car, loading } = useSelector((s) => s.cars);
  const { user } = useSelector((s) => s.auth);
  const isAdmin = user?.role === "admin";
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [bookedPeriods, setBookedPeriods] = useState([]);

  const today = new Date().toISOString().split("T")[0];

  const calcDays = () => {
    if (!startDate || !endDate) return 0;
    return Math.ceil(
      (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24),
    );
  };

  const days = calcDays();
  const totalPrice = days > 0 ? days * car?.dailyPrice : 0;

  useEffect(() => {
    dispatch(fetchCarById(id));
  }, [id, dispatch]);

  // Fetch les périodes réservées
  useEffect(() => {
    if (car?._id) {
      API.get(`/reservations/booked-periods/${car._id}`)
        .then((res) => setBookedPeriods(res.data))
        .catch(() => {});
    }
  }, [car?._id]);

  // Vérifie si les dates choisies chevauchent une période réservée
  const hasConflict = () => {
    if (!startDate || !endDate) return false;
    return bookedPeriods.some(
      (p) =>
        new Date(startDate) <= new Date(p.endDate) &&
        new Date(endDate) >= new Date(p.startDate),
    );
  };

  const conflict = hasConflict();

  const handleBook = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role === "admin") return;
    if (!startDate || !endDate) return;
    if (conflict) return;
    navigate(`/booking/${car._id}`, {
      state: { startDate, endDate, totalPrice, days },
    });
  };

  if (loading)
    return (
      <div className="detail-loading">
        <div className="detail-skeleton" />
      </div>
    );

  if (!car) return null;

  return (
    <div className="car-detail-page">
      <div className="car-detail-container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FiArrowLeft size={15} /> Back
        </button>

        <div className="car-detail-grid">
          {/* ── LEFT ── */}
          <div className="car-detail-left">
            <div className="detail-image-card">
              <div
                className={`detail-badge ${car.isAvailable ? "available" : "unavailable"}`}
              >
                <span />
                {car.isAvailable ? "Available" : "Unavailable"}
              </div>
              <img
                src={car.image || "/car-placeholder.png"}
                alt={`${car.brand} ${car.model}`}
              />
            </div>

            <div className="detail-specs">
              {SPECS(car).map((spec) => (
                <div key={spec.label} className="spec-item">
                  <span className="spec-icon">{spec.icon}</span>
                  <div>
                    <p className="spec-label">{spec.label}</p>
                    <p className="spec-value">{spec.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="car-detail-right">
            <div className="detail-category-tag">{car.category}</div>
            <h1>
              {car.brand} <span>{car.model}</span>
            </h1>
            <p className="detail-year">{car.year}</p>

            {car.description && (
              <p className="detail-description">{car.description}</p>
            )}

            <div className="price-per-day">
              <span className="price-amount">{car.dailyPrice}</span>
              <span className="price-unit">TND / day</span>
            </div>

            {/* ── BOOKING CARD ── */}
            <div className="booking-card">
              <h3>
                <FiCalendar size={15} /> Select Your Dates
              </h3>

              {/* Admin notice */}
              {isAdmin && (
                <div className="admin-notice">
                  <RiLockLine size={14} />
                  Admins cannot make reservations
                </div>
              )}

              {/* Périodes déjà réservées */}
              {bookedPeriods.length > 0 && !isAdmin && (
                <div className="booked-periods-wrap">
                  <p className="booked-periods-title">🔒 Already booked:</p>
                  <div className="booked-periods-list">
                    {bookedPeriods.map((p, i) => (
                      <div key={i} className={`booked-period-tag ${p.status}`}>
                        {p.status === "confirmed" ? "🔒" : "⏳"}
                        {new Date(p.startDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                        {" → "}
                        {new Date(p.endDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                        <span className="period-status-label">
                          {p.status === "confirmed" ? "Confirmed" : "Pending"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="dates-row">
                <div className="date-field">
                  <label>Pick-up Date</label>
                  <input
                    type="date"
                    value={startDate}
                    min={today}
                    disabled={isAdmin}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      if (endDate && e.target.value >= endDate) setEndDate("");
                    }}
                  />
                </div>
                <div className="dates-arrow">
                  <FiArrowRight size={16} />
                </div>
                <div className="date-field">
                  <label>Return Date</label>
                  <input
                    type="date"
                    value={endDate}
                    min={startDate || today}
                    onChange={(e) => setEndDate(e.target.value)}
                    disabled={!startDate || isAdmin}
                  />
                </div>
              </div>

              {/* Conflit de dates */}
              {conflict && (
                <div className="dates-conflict">
                  ⚠️ These dates overlap a confirmed booking. Please choose
                  different dates.
                </div>
              )}

              {days > 0 && !isAdmin && !conflict && (
                <div className="price-breakdown">
                  <div className="price-row">
                    <span>
                      {car.dailyPrice} TND × {days} day{days > 1 ? "s" : ""}
                    </span>
                    <span>{totalPrice} TND</span>
                  </div>
                  <div className="price-divider" />
                  <div className="price-row total">
                    <span>Total</span>
                    <span>{totalPrice} TND</span>
                  </div>
                </div>
              )}

              {/* CTA */}
              {car.isAvailable ? (
                <>
                  <button
                    className="book-btn"
                    onClick={handleBook}
                    disabled={
                      isAdmin || !startDate || !endDate || days <= 0 || conflict
                    }
                  >
                    {isAdmin ? (
                      <>
                        <RiLockLine size={16} /> Admins cannot book
                      </>
                    ) : !user ? (
                      <>
                        <RiLockLine size={16} /> Login to Reserve
                      </>
                    ) : conflict ? (
                      <>
                        <RiLockLine size={16} /> Dates not available
                      </>
                    ) : !startDate || !endDate ? (
                      <>
                        <FiCalendar size={15} /> Select dates to continue
                      </>
                    ) : (
                      <>
                        <RiCarLine size={16} /> Reserve for {totalPrice} TND
                      </>
                    )}
                  </button>

                  {!user && (
                    <p className="login-notice">
                      You need to{" "}
                      <span onClick={() => navigate("/login")}>sign in</span> to
                      make a reservation.
                    </p>
                  )}
                </>
              ) : (
                <button className="book-btn unavailable-btn" disabled>
                  <RiLockLine size={16} /> Not Available
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetail;
