import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchMyReservations, cancelReservation } from "../Redux/actions";
import { FiCalendar, FiX, FiArrowRight, FiClock } from "react-icons/fi";
import { RiCarLine } from "react-icons/ri";
import { HiOutlineLocationMarker } from "react-icons/hi";
import "./MyReservations.css";

const MyReservations = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { myReservations, loading } = useSelector((s) => s.reservations);
  const [cancelConfirm, setCancelConfirm] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchMyReservations());
  }, [dispatch]);

  const filtered = myReservations.filter(
    (r) => filter === "all" || r.status === filter,
  );

  const handleCancel = async (id) => {
    await dispatch(cancelReservation(id));
    setCancelConfirm(null);
  };

  const statusConfig = {
    pending: {
      label: "Pending",
      color: "#d97706",
      bg: "rgba(245,158,11,0.1)",
      border: "rgba(245,158,11,0.2)",
    },
    confirmed: {
      label: "Confirmed",
      color: "#16a34a",
      bg: "rgba(46,199,138,0.1)",
      border: "rgba(46,199,138,0.25)",
    },
    cancelled: {
      label: "Cancelled",
      color: "#dc2626",
      bg: "rgba(239,68,68,0.08)",
      border: "rgba(239,68,68,0.2)",
    },
    completed: {
      label: "Completed",
      color: "#73e546",
      bg: "rgba(70, 229, 97, 0.08)",
      border: "rgba(107, 229, 70, 0.2)",
    },
  };

  return (
    <div className="myres-page">
      <div className="myres-container">
        {/* Header */}
        <div className="myres-header">
          <div>
            <span className="myres-label">MY ACCOUNT</span>
            <h1>My Reservations</h1>
            <p>{myReservations.length} total bookings</p>
          </div>
          <button
            className="myres-browse-btn"
            onClick={() => navigate("/cars")}
          >
            <RiCarLine size={15} /> Browse Cars
          </button>
        </div>

        {/* Filter tabs */}
        <div className="myres-tabs">
          {["all", "pending", "confirmed", "cancelled", "completed"].map(
            (tab) => (
              <button
                key={tab}
                className={`myres-tab ${filter === tab ? "active" : ""}`}
                onClick={() => setFilter(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                <span className="myres-tab-count">
                  {tab === "all"
                    ? myReservations.length
                    : myReservations.filter((r) => r.status === tab).length}
                </span>
              </button>
            ),
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="myres-list">
            {[1, 2, 3].map((i) => (
              <div key={i} className="myres-skeleton" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="myres-empty">
            <div className="myres-empty-icon">
              <FiClock size={40} />
            </div>
            <h3>No {filter !== "all" ? filter : ""} reservations</h3>
            <p>
              {filter === "all"
                ? "You haven't made any reservations yet."
                : `No ${filter} reservations found.`}
            </p>
            {filter === "all" && (
              <button
                className="myres-empty-btn"
                onClick={() => navigate("/cars")}
              >
                Book a Car
              </button>
            )}
          </div>
        ) : (
          <div className="myres-list">
            {filtered.map((res) => {
              const sc = statusConfig[res.status] || statusConfig.pending;
              return (
                <div key={res._id} className="myres-card">
                  {/* Car image */}
                  <div className="myres-car-img">
                    <img
                      src={res.car?.image || "/car-placeholder.png"}
                      alt={`${res.car?.brand} ${res.car?.model}`}
                    />
                  </div>

                  {/* Info */}
                  <div className="myres-info">
                    <div className="myres-car-name">
                      <h3>
                        {res.car?.brand} {res.car?.model}
                      </h3>
                      <span
                        className="myres-status"
                        style={{
                          color: sc.color,
                          background: sc.bg,
                          border: `1px solid ${sc.border}`,
                        }}
                      >
                        {sc.label}
                      </span>
                    </div>

                    <div className="myres-dates">
                      <div className="myres-date">
                        <FiCalendar size={12} />
                        <span>
                          {new Date(res.startDate).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <FiArrowRight size={13} className="myres-arrow" />
                      <div className="myres-date">
                        <FiCalendar size={12} />
                        <span>
                          {new Date(res.endDate).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <span className="myres-days">
                        {res.days} day{res.days > 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="myres-location">
                      <HiOutlineLocationMarker size={13} />
                      {res.car.location}
                    </div>
                  </div>

                  {/* Price + Actions */}
                  <div className="myres-right">
                    <div className="myres-price">
                      <span>{res.totalPrice}</span>
                      <small>TND</small>
                    </div>

                    <div className="myres-actions">
                      <button
                        className="myres-view-btn"
                        onClick={() => navigate(`/cars/${res.car?._id}`)}
                      >
                        View Car
                      </button>
                      {res.status === "pending" && (
                        <button
                          className="myres-cancel-btn"
                          onClick={() => setCancelConfirm(res._id)}
                        >
                          <FiX size={13} /> Cancel
                        </button>
                      )}
                    </div>

                    <p className="myres-booked-on">
                      Booked {new Date(res.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {cancelConfirm && (
        <div
          className="myres-modal-overlay"
          onClick={() => setCancelConfirm(null)}
        >
          <div className="myres-modal" onClick={(e) => e.stopPropagation()}>
            <div className="myres-modal-icon">
              <FiX size={24} />
            </div>
            <h3>Cancel Reservation?</h3>
            <p>Are you sure you want to cancel this booking?</p>
            <div className="myres-modal-btns">
              <button
                className="myres-modal-keep"
                onClick={() => setCancelConfirm(null)}
              >
                Keep it
              </button>
              <button
                className="myres-modal-confirm"
                onClick={() => handleCancel(cancelConfirm)}
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReservations;
