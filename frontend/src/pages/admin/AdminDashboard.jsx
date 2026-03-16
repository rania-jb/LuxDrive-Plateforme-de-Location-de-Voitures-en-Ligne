import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchCars, fetchAllReservations } from "../../Redux/actions";
import {
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
} from "react-icons/fi";
import { RiCarLine } from "react-icons/ri";
import "./AdminDashboard.css";
import Sidebar from "../../components/AdminSidebar";

// ── DASHBOARD ──
const AdminDashboard = () => {
  const dispatch = useDispatch();

  const { cars } = useSelector((s) => s.cars);
  const { allReservations } = useSelector((s) => s.reservations);

  useEffect(() => {
    dispatch(fetchCars());
    dispatch(fetchAllReservations());
  }, [dispatch]);

  const totalCars = cars.length;
  const totalReservations = allReservations.length;

  const pendingRes = allReservations.filter(
    (r) => r.status === "pending",
  ).length;

  const confirmedRes = allReservations.filter(
    (r) => r.status === "confirmed",
  ).length;

  const totalRevenue = allReservations
    .filter((r) => r.status === "confirmed" || r.status === "completed")
    .reduce((sum, r) => sum + (r.totalPrice || 0), 0);  

  const now = new Date();
  const monthlyRevenue = allReservations
    .filter((r) => {
      const d = new Date(r.createdAt);
      return (
        (r.status === "confirmed" || r.status === "completed") &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, r) => sum + (r.totalPrice || 0), 0);

  const stats = [
    {
      label: "Total Cars",
      value: totalCars,
      icon: <RiCarLine size={22} />,
      color: "#16d9f3",
      bg: "#f0f4ff",
    },
    {
      label: "Total Bookings",
      value: totalReservations,
      icon: <FiCalendar size={22} />,
      color: "#b65b05",
      bg: "#fff8f0",
    },
    {
      label: "Pending",
      value: pendingRes,
      icon: <FiClock size={22} />,
      color: "#f8d824",
      bg: "#fffbeb",
    },
    {
      label: "Confirmed",
      value: confirmedRes,
      icon: <FiCheckCircle size={22} />,
      color: "#2ec78a",
      bg: "#f0fff8",
    },
  ];

  const recentBookings = [...allReservations]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) 
    .slice(0, 6);

  function statusClass(s) {
  switch (s) {
    case "confirmed": return "badge-confirmed";
    case "pending": return "badge-pending";
    case "cancelled": return "badge-cancelled";
    case "completed": return "badge-completed";
    default: return "badge-pending";
  }
}

  return (
    <div className="admin-layout">
      <Sidebar />

      <main className="admin-main">
        {/* Header */}
        <div className="dash-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>
              Monitor overall platform performance including total cars,
              bookings, revenue, and recent activities
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="dash-stats">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="dash-stat-card"
              style={{
                "--c": s.color,
                "--bg": s.bg,
                animationDelay: `${i * 0.07}s`,
              }}
            >
              <div>
                <p className="dash-stat-label">{s.label}</p>
                <p className="dash-stat-value">{s.value}</p>
              </div>
              <div className="dash-stat-icon" style={{ color: s.color }}>
                {s.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom grid */}
        <div className="dash-bottom">
          {/* Recent bookings */}
          <div className="dash-card">
            <div className="dash-card-head">
              <h2>Recent Bookings</h2>
              <p>Latest customer bookings</p>
              <Link to="/admin/reservations" className="see-all-link">
                See all →
              </Link>
            </div>

            {recentBookings.length === 0 ? (
              <div className="dash-empty">No bookings yet</div>
            ) : (
              <div className="dash-table-wrap">
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Car</th>
                      <th>Dates</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((r) => (
                      <tr key={r._id}>
                        <td>
                          <div className="dash-user">
                            <div className="dash-avatar">
                              {r.user?.firstname?.charAt(0).toUpperCase() ||
                                "?"}
                            </div>
                            <span>
                              {r.user?.firstname} {r.user?.lastname}
                            </span>
                          </div>
                        </td>
                        <td className="dash-car-name">
                          {r.car?.brand} {r.car?.model}
                        </td>
                        <td className="dash-dates">
                          {new Date(r.startDate).toLocaleDateString()} →{" "}
                          {new Date(r.endDate).toLocaleDateString()}
                        </td>
                        <td>
                          <strong>{r.totalPrice} TND</strong>
                        </td>
                        <td>
                          <span
                            className={`dash-badge ${statusClass(r.status)}`}
                          >
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Revenue card */}
          <div className="dash-card revenue-card">
            <div className="dash-card-head">
              <h2>Monthly Revenue</h2>
              <p>Revenue for current month</p>
            </div>

            <div className="revenue-amount">
              {monthlyRevenue.toLocaleString()}
              <span>TND</span>
            </div>

            <div className="revenue-stats">
              <div className="rev-stat">
                <span>{totalRevenue.toLocaleString()}</span>
                <label>Total Revenue</label>
              </div>
              <div className="rev-divider" />
              <div className="rev-stat">
                <span>{confirmedRes}</span>
                <label>Confirmed</label>
              </div>
            </div>

            <Link to="/admin/reservations" className="revenue-link">
              <FiTrendingUp size={14} /> View all bookings
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
