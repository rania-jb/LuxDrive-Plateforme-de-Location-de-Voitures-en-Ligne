import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile, uploadAvatar } from "../Redux/actions";
import "./Profile.css";

const Profile = () => {
  const dispatch = useDispatch();
  const [pwError, setPwError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const fileRef = useRef(); // For avatar file input
  const { user, loading } = useSelector((s) => s.auth);

  const [form, setForm] = useState({
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    phone: user?.phone || "",
    password: "",
    confirmPassword: "",
  });
  

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "confirmPassword") setPwError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.confirmPassword) {
      setPwError("Passwords do not match");
      return;
    }

    const data = {
      firstname: form.firstname,
      lastname: form.lastname,
      phone: form.phone,
    };
    if (form.password) data.password = form.password;

    dispatch(updateProfile(data));
    setEditMode(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) dispatch(uploadAvatar(file));
  };

  const avatarSrc = user?.avatar ? `${user.avatar}` : null;

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* ── SIDEBAR ── */}
        <div className="profile-sidebar">
          {/* Avatar */}
          <div className="avatar-wrap" onClick={() => fileRef.current.click()}>
            {avatarSrc ? (
              <img src={avatarSrc} alt="avatar" className="avatar-img" />
            ) : (
              <div className="avatar-placeholder">
                {user?.firstname?.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="avatar-overlay">
              <span>📷</span>
            </div>
            <input
              type="file"
              ref={fileRef}
              style={{ display: "none" }} 
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </div>

          <h3>
            {user?.firstname} {user?.lastname}
          </h3>
          <p className="sidebar-email">{user?.email}</p>
          <span className={`role-badge ${user?.role}`}>{user?.role}</span>
        </div>

        {/* ── FORM ── */}
        <div className="profile-form-card">
          <div className="profile-form-header">
            <div>
              <h2>Personal Information</h2>
              <p>Manage your account details</p>
            </div>
            <button
              className={`edit-toggle-btn ${editMode ? "cancel" : ""}`}
              onClick={() => setEditMode((p) => !p)}
            >
              {editMode ? "✕ Cancel" : "✏️ Edit"}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="profile-row">
              <div className="profile-field">
                <label>First Name</label>
                <input
                  name="firstname"
                  value={form.firstname}
                  onChange={handleChange}
                  disabled={!editMode}
                  required
                />
              </div>
              <div className="profile-field">
                <label>Last Name</label>
                <input
                  name="lastname"
                  value={form.lastname}
                  onChange={handleChange}
                  disabled={!editMode}
                  required
                />
              </div>
            </div>

            <div className="profile-field">
              <label>Email Address</label>
              <input value={user?.email} disabled />
            </div>

            <div className="profile-field">
              <label>Phone Number</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                disabled={!editMode}
                placeholder="+216 XX XXX XXX"
              />
            </div>

            {editMode && (
              <>
                <div className="profile-divider">
                  <span>Change Password (optional)</span>
                </div>

                <div className="profile-row">
                  <div className="profile-field">
                    <label>New Password</label>
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Leave blank to keep current"
                      minLength={6}
                    />
                  </div>
                  <div className="profile-field">
                    <label>Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repeat new password"
                    />
                  </div>
                </div>
                {pwError && <span className="field-error">{pwError}</span>}

                <button type="submit" className="save-btn" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
