import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login, clearAuthError } from "../Redux/actions.js";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import { RiCarLine } from "react-icons/ri";
import "./Login.css";


//admin@gmail.com - admin123456
const Login = () => {
  const [email,    setEmail]    = useState(""); 
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  useEffect(() => {
    return () => dispatch(clearAuthError());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(email, password, navigate));
  };

  return (
  <div className="login-page">

    {/* Blobs */}
    <div className="login-bg">
      <div className="login-bg-circle c1" />
      <div className="login-bg-circle c2" />
      <div className="login-bg-circle c3" />
    </div>

    {/* Floating cars */}
    <div className="login-cars">
      <div className="login-car car-1">
        <span className="login-car-emoji">🚗</span>
        <div className="login-car-info">
          <p>Tesla Model S</p>
          <span>280 TND/day</span>
        </div>
      </div>
      <div className="login-car car-2">
        <span className="login-car-emoji">🏎️</span>
        <div className="login-car-info">
          <p>Porsche 911</p>
          <span>450 TND/day</span>
        </div>
      </div>
      <div className="login-car car-3">
        <span className="login-car-emoji">🚙</span>
        <div className="login-car-info">
          <p>BMW X5</p>
          <span>320 TND/day</span>
        </div>
      </div>
      <div className="login-car car-4">
        <span className="login-car-emoji">🚕</span>
        <div className="login-car-info">
          <p>Mercedes GLE</p>
          <span>380 TND/day</span>
        </div>
      </div>
      <div className="login-car car-5">
        <span className="login-car-emoji">🚓</span>
        <div className="login-car-info">
          <p>Audi A6</p>
          <span>290 TND/day</span>
        </div>
      </div>
      <div className="login-car car-6">
        <span className="login-car-emoji">🏁</span>
        <div className="login-car-info">
          <p>Ferrari Roma</p>
          <span>900 TND/day</span>
        </div>
      </div>
    </div>

      {/* Card */}
      <div className="login-card">

        {/* Top brand */}
        <div className="login-brand">
          <div className="login-brand-icon">
            <RiCarLine size={18} />
          </div>
          <span>LuxDrive</span>
        </div>

        {/* Header */}
        <div className="login-header">
          <div className="login-header-tag">Welcome back 👋</div>
          <h1>Drive the car<br /><span>of your dreams.</span></h1>
          <p>Sign in to continue your journey with LuxDrive</p>
        </div>

        {/* Error */}
        {error && (
          <div className="login-error">
            <span>⚠</span> {error}
          </div>
        )}

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit}>

          <div className="login-field">
            <label>Email Address</label>
            <div className="login-input-wrap">
              <FiMail size={15} className="login-input-icon" />
              <input
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="login-field">
            <label>Password</label>
            <div className="login-input-wrap">
              <FiLock size={15} className="login-input-icon" />
              <input
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="login-eye"
                onClick={() => setShowPw((p) => !p)} 
              >
                {showPw ? <FiEyeOff size={15} /> : <FiEye size={15} />}
              </button>
            </div>
          </div>

          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? (
              <span className="login-spinner" />
            ) : (
              <>Sign In <FiArrowRight size={16} /></>
            )}
          </button>

        </form>

        {/* Divider */}
        <div className="login-divider">
          <span />
          <p>Don't have an account?</p>
          <span />
        </div>

        <Link to="/register" className="login-register-link">
          Create a free account
        </Link>

        <Link to="/" className="login-back">
          ← Back to home
        </Link>

      </div>

    </div>
  );
};

export default Login;