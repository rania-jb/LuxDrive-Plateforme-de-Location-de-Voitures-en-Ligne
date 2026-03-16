import { Routes, Route, useLocation, BrowserRouter } from "react-router-dom";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Cars from "./pages/Cars";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import Profile from "./pages/Profile";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/ProtectedRoute";
import CarDetail from "./pages/CarDetail";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import AdminAddCar from "./pages/admin/AdminAddCar";
import AdminCars from "./pages/admin/AdminCars";
import Booking from "./pages/Booking";
import MyReservations from "./pages/MyReservations";
import UserRoute from "./components/UserRoute";
import AdminReservations from "./pages/admin/AdminReservations";

const Layout = ({ children }) => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const location = useLocation(); // Get current path

  const isAuthPage = ["/login", "/register"].includes(location.pathname); // Check if current path is login or register
  return (
    <>
      {!isAuthPage && <Navbar />}
      {children}
      {!isAuthPage && <Footer />}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cars/:id" element={<CarDetail />} />
          <Route
            path="/booking/:id"
            element={
              <UserRoute>
                <Booking />
              </UserRoute>
            }
          />
          <Route
            path="/my-reservations"
            element={
              <UserRoute>
                <MyReservations />
              </UserRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/cars/new"
            element={
              <AdminRoute>
                <AdminAddCar />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/cars"
            element={
              <AdminRoute>
                <AdminCars />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/reservations"
            element={
              <AdminRoute>
                <AdminReservations />
              </AdminRoute>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
