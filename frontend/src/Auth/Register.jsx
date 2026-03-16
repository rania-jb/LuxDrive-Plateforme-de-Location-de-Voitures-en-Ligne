import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { register, clearAuthError } from "../Redux/actions.js";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiCheck,
} from "react-icons/fi";
import { RiCarLine } from "react-icons/ri";
import "./Register.css";


const Register = () => {
  
  const PERKS = [
  { icon: <FiCheck size={12} />, text: "Instant booking confirmation" },
  { icon: <FiCheck size={12} />, text: "No hidden fees" },
  { icon: <FiCheck size={12} />, text: "24/7 customer support" },
  { icon: <FiCheck size={12} />, text: "Fully insured vehicles" },
];

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPw, setShowPw] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);  

  useEffect(() => {
    return () => dispatch(clearAuthError()); 
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value }); 
    // Clear password error when user modifies password fields
    if (e.target.name === "confirmPassword") setPasswordError(""); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    dispatch(register(form, navigate)); 
  };

  const getStrength = () => {
    const pw = form.password;
    if (!pw) return null;
    if (pw.length < 6) return { label: "Weak", color: "#ef4444", width: "25%" };
    if (pw.length < 8) return { label: "Fair", color: "#f59e0b", width: "55%" };
    if (pw.match(/[A-Z]/) && pw.match(/[0-9]/))
      return { label: "Strong", color: "#10b981", width: "100%" };
    return { label: "Good", color: "#4f46e5", width: "75%" };
  };
  const strength = getStrength();

  return (
    <div className="reg-page">
      {/* ── BG ── */}
      <div className="reg-bg">
        <div className="reg-blob b1" />
        <div className="reg-blob b2" />
        <div className="reg-blob b3" />
      </div>

      {/* ── FLOATING CARS ── */}
      <div className="reg-cars">
        <div className="reg-car rc-1">
          <span>🚗</span>
          <div>
            <p>Tesla Model S</p>
            <span>280 TND/day</span>
          </div>
        </div>
        <div className="reg-car rc-2">
          <span>🏎️</span>
          <div>
            <p>Porsche 911</p>
            <span>450 TND/day</span>
          </div>
        </div>
        <div className="reg-car rc-3">
          <span>🚙</span>
          <div>
            <p>BMW X5</p>
            <span>320 TND/day</span>
          </div>
        </div>
        <div className="reg-car rc-4">
          <span>🚕</span>
          <div>
            <p>Mercedes GLE</p>
            <span>380 TND/day</span>
          </div>
        </div>
      </div>

      {/* ── CARD ── */}
      <div className="reg-card">
        {/* Brand */}
        <div className="reg-brand">
          <div className="reg-brand-icon">
            <RiCarLine size={18} />
          </div>
          <span>LuxDrive</span>
        </div>

        {/* Header */}
        <div className="reg-header">
          <div className="reg-header-tag">New here? 🎉</div>
          <h1>
            Join thousands of
            <br />
            <span>happy drivers.</span>
          </h1>
          <p>Create your account and book your first car in minutes.</p>
        </div>

        {/* Perks */}
        <div className="reg-perks">
          {PERKS.map((p, i) => (
            <div key={i} className="reg-perk">
              <span className="reg-perk-icon">{p.icon}</span>
              {p.text}
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="reg-error">
            <span>⚠</span> {error}
          </div>
        )}

        {/* Form */}
        <form className="reg-form" onSubmit={handleSubmit}>
          {/* Row 1 */}
          <div className="reg-row">
            <div className="reg-field">
              <label>First Name</label>
              <div className="reg-input-wrap">
                <FiUser size={15} className="reg-icon" />
                <input
                  name="firstname"
                  placeholder="John"
                  value={form.firstname}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="reg-field">
              <label>Last Name</label>
              <div className="reg-input-wrap">
                <FiUser size={15} className="reg-icon" />
                <input
                  name="lastname"
                  placeholder="Doe"
                  value={form.lastname}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="reg-row">
            <div className="reg-field">
              <label>Email Address</label>
              <div className="reg-input-wrap">
                <FiMail size={15} className="reg-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="john@email.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="reg-field">
              <label>
                Phone <span className="reg-optional">(optional)</span>
              </label>
              <div className="reg-input-wrap">
                <FiPhone size={15} className="reg-icon" />
                <input
                  type="tel"
                  name="phone"
                  placeholder="+216 XX XXX XXX"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="reg-field">
            <label>Password</label>
            <div className="reg-input-wrap">
              <FiLock size={15} className="reg-icon" />
              <input
                type={showPw ? "text" : "password"}
                name="password"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
              />
              <button
                type="button"
                className="reg-eye"
                onClick={() => setShowPw((p) => !p)}
              >
                {showPw ? <FiEyeOff size={15} /> : <FiEye size={15} />}
              </button>
            </div>
            {strength && (
              <div className="reg-strength">
                <div className="reg-strength-track">
                  <div
                    className="reg-strength-fill"
                    style={{
                      width: strength.width,
                      background: strength.color,
                    }}
                  />
                </div>
                <span style={{ color: strength.color }}>{strength.label}</span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="reg-field">
            <label>Confirm Password</label>
            <div className="reg-input-wrap">
              <FiLock size={15} className="reg-icon" />
              <input
                type={showPw ? "text" : "password"}
                name="confirmPassword"
                placeholder="Repeat your password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
              {form.confirmPassword &&
                form.password === form.confirmPassword && (
                  <span className="reg-match-ok">
                    <FiCheck size={14} />
                  </span>
                )}
            </div>
            {passwordError && (
              <span className="reg-field-error">{passwordError}</span>
            )}
          </div>

          <button type="submit" className="reg-submit" disabled={loading}>
            {loading ? (
              <span className="reg-spinner" />
            ) : (
              <>
                Create Account <FiArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="reg-divider">
          <span />
          <p>Already have an account?</p>
          <span />
        </div>

        <Link to="/login" className="reg-login-link">
          Sign in to your account
        </Link>

        <Link to="/" className="reg-back">
          ← Back to home
        </Link>
      </div>
    </div>
  );
};

export default Register;
