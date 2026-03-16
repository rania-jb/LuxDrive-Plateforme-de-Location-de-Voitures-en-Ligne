import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createCar } from "../../Redux/actions";
import AdminSidebar from "../../components/AdminSidebar";
import { RiCarLine } from "react-icons/ri";
import { FiUpload, FiX } from "react-icons/fi";
import "./AdminAddCar.css";

const CATEGORIES = ["Sedan", "SUV", "Van", "Sport", "Convertible", "Truck"];
const TRANSMISSIONS = ["Automatic", "Manual", "Semi-Automatic"];
const FUEL_TYPES = ["Petrol", "Diesel", "Electric", "Hybrid", "Gas"];
const LOCATIONS = [
  "Tunis",
  "Ariana",
  "Ben Arous",
  "Manouba",
  "Nabeul",
  "Zaghouan",
  "Bizerte",
  "Béja",
  "Jendouba",
  "Kef",
  "Siliana",
  "Sousse",
  "Monastir",
  "Mahdia",
  "Sfax",
  "Kairouan",
  "Kasserine",
  "Sidi Bouzid",
  "Gabès",
  "Mednine",
  "Tataouine",
  "Gafsa",
  "Tozeur",
  "Kébili",
];

const AdminAddCar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});

  const { loading } = useSelector((s) => s.cars);

  const [form, setForm] = useState({
    brand: "",
    model: "",
    year: "",
    category: "",
    transmission: "",
    fuelType: "",
    seatingCapacity: "",
    dailyPrice: "",
    location: "",
    description: "",
    isAvailable: true,
  });

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file)); // create preview URL
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
  };

  const validate = () => {
    const e = {};
    if (!form.brand) e.brand = "Required";
    if (!form.model) e.model = "Required";
    if (!form.year) e.year = "Required";
    if (!form.category) e.category = "Required";
    if (!form.transmission) e.transmission = "Required";
    if (!form.fuelType) e.fuelType = "Required";
    if (!form.seatingCapacity) e.seatingCapacity = "Required";
    if (!form.dailyPrice) e.dailyPrice = "Required";
    if (!form.location) e.location = "Required";
    if (!image) e.image = "Please upload an image";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, val)); // append all form fields
    formData.append("image", image);

    try {
      await dispatch(createCar(formData));
      navigate("/admin/cars");
    } catch (err) {
      // error handled in action
      console.error(err);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <div className="addcar-header">
          <div>
            <h1>Add New Car</h1>
            <p>Fill in the details to add a new vehicle to the fleet</p>
          </div>
          <button
            className="addcar-cancel-btn"
            onClick={() => navigate("/admin/cars")}
          >
            ← Back to Cars
          </button>
        </div>

        <form onSubmit={handleSubmit} className="addcar-form">
          <div className="addcar-grid">
            {/* ── LEFT ── */}
            <div className="addcar-left">
              {/* Image upload */}
              <div className="addcar-section">
                <h2>
                  <FiUpload size={16} /> Car Image
                </h2>

                {preview ? (
                  <div className="image-preview-wrap">
                    <img
                      src={preview}
                      alt="preview"
                      className="image-preview"
                    />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={removeImage}
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="image-upload-area">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImage}
                      style={{ display: "none" }}
                    />
                    <div className="upload-placeholder">
                      <div className="upload-icon">
                        <RiCarLine size={36} />
                      </div>
                      <p>Click to upload car image</p>
                      <span>JPG, PNG, WEBP — max 5MB</span>
                    </div>
                  </label>
                )}
                {errors.image && (
                  <span className="field-error">{errors.image}</span>
                )}
              </div>

              {/* Description */}
              <div className="addcar-section">
                <h2>Description</h2>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe the car, features, condition..."
                  rows={5}
                  className="addcar-textarea"
                />
              </div>

              {/* Availability */}
              <div className="addcar-section">
                <h2>Availability</h2>
                <label className="toggle-wrap">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={form.isAvailable}
                    onChange={handleChange}
                  />
                  <div className="toggle" />
                  <span>
                    {form.isAvailable
                      ? "Available for booking"
                      : "Not available"}
                  </span>
                </label>
              </div>
            </div>

            {/* ── RIGHT ── */}
            <div className="addcar-right">
              {/* Basic Info */}
              <div className="addcar-section">
                <h2>
                  <RiCarLine size={16} /> Basic Information
                </h2>

                <div className="addcar-row">
                  <div className="addcar-field">
                    <label>Brand *</label>
                    <input
                      name="brand"
                      value={form.brand}
                      onChange={handleChange}
                      placeholder="e.g. Toyota"
                      className={errors.brand ? "error" : ""}
                    />
                    {errors.brand && (
                      <span className="field-error">{errors.brand}</span>
                    )}
                  </div>
                  <div className="addcar-field">
                    <label>Model *</label>
                    <input
                      name="model"
                      value={form.model}
                      onChange={handleChange}
                      placeholder="e.g. Corolla"
                      className={errors.model ? "error" : ""}
                    />
                    {errors.model && (
                      <span className="field-error">{errors.model}</span>
                    )}
                  </div>
                </div>

                <div className="addcar-row">
                  <div className="addcar-field">
                    <label>Year *</label>
                    <input
                      type="number"
                      name="year"
                      value={form.year}
                      onChange={handleChange}
                      placeholder="e.g. 2023"
                      min="1990"
                      max="2026"
                      className={errors.year ? "error" : ""}
                    />
                    {errors.year && (
                      <span className="field-error">{errors.year}</span>
                    )}
                  </div>
                  <div className="addcar-field">
                    <label>Daily Price (TND) *</label>
                    <input
                      type="number"
                      name="dailyPrice"
                      value={form.dailyPrice}
                      onChange={handleChange}
                      placeholder="e.g. 150"
                      min="1"
                      className={errors.dailyPrice ? "error" : ""}
                    />
                    {errors.dailyPrice && (
                      <span className="field-error">{errors.dailyPrice}</span>
                    )}
                  </div>
                </div>

                <div className="addcar-field">
                  <label>Seating Capacity *</label>
                  <input
                    type="number"
                    name="seatingCapacity"
                    value={form.seatingCapacity}
                    onChange={handleChange}
                    placeholder="e.g. 5"
                    min="1"
                    max="20"
                    className={errors.seatingCapacity ? "error" : ""}
                  />
                  {errors.seatingCapacity && (
                    <span className="field-error">
                      {errors.seatingCapacity}
                    </span>
                  )}
                </div>
              </div>

              {/* Specs */}
              <div className="addcar-section">
                <h2>Specifications</h2>

                <div className="addcar-field">
                  <label>Category *</label>
                  <div className="addcar-chips">
                    {CATEGORIES.map((c) => (
                      <button
                        key={c}
                        type="button"
                        className={`addcar-chip ${form.category === c ? "active" : ""}`}
                        onClick={() => {
                          setForm({ ...form, category: c });
                          setErrors({ ...errors, category: "" });
                        }}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                  {errors.category && (
                    <span className="field-error">{errors.category}</span>
                  )}
                </div>

                <div className="addcar-field">
                  <label>Transmission *</label>
                  <div className="addcar-chips">
                    {TRANSMISSIONS.map((t) => (
                      <button
                        key={t}
                        type="button"
                        className={`addcar-chip ${form.transmission === t ? "active" : ""}`}
                        onClick={() => {
                          setForm({ ...form, transmission: t });
                          setErrors({ ...errors, transmission: "" });
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  {errors.transmission && (
                    <span className="field-error">{errors.transmission}</span>
                  )}
                </div>

                <div className="addcar-field">
                  <label>Fuel Type *</label>
                  <div className="addcar-chips">
                    {FUEL_TYPES.map((f) => (
                      <button
                        key={f}
                        type="button"
                        className={`addcar-chip ${form.fuelType === f ? "active" : ""}`}
                        onClick={() => {
                          setForm({ ...form, fuelType: f });
                          setErrors({ ...errors, fuelType: "" });
                        }}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                  {errors.fuelType && (
                    <span className="field-error">{errors.fuelType}</span>
                  )}
                </div>

                <div className="addcar-field">
                  <label>Location *</label>
                  <select
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className={errors.location ? "error" : ""}
                  >
                    <option value="">Select governorate</option>
                    {LOCATIONS.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                  {errors.location && (
                    <span className="field-error">{errors.location}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="addcar-footer">
            <button
              type="button"
              className="addcar-cancel"
              onClick={() => navigate("/admin/cars")}
            >
              Cancel
            </button>
            <button type="submit" className="addcar-submit" disabled={loading}>
              {loading ? "Adding Car..." : "+ Add Car"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AdminAddCar;
