import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCars, deleteCar, updateCar } from "../../Redux/actions";
import AdminSidebar from "../../components/AdminSidebar";
import {
  FiSearch,
  FiX,
  FiPlus,
  FiTrash2,
  FiSave,
  FiEdit3,
  FiUpload,
} from "react-icons/fi";
import { RiCarLine } from "react-icons/ri";
import { MdOutlineLocalGasStation } from "react-icons/md";
import { TbManualGearbox } from "react-icons/tb";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { BsToggleOn, BsToggleOff } from "react-icons/bs";
import "./AdminCars.css";

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

const AdminCars = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cars, loading } = useSelector((s) => s.cars);

  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editImage, setEditImage] = useState(null);
  const [editPreview, setEditPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchCars());
  }, [dispatch]);

  const categories = ["All", ...new Set(cars.map((c) => c.category))]; // Get unique categories from cars

  const filtered = cars.filter((car) => {
    const matchSearch = `${car.brand} ${car.model} ${car.location}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchCat = filterCat === "All" || car.category === filterCat;
    return matchSearch && matchCat;
  });

  // ── TOGGLE AVAILABILITY ──
  const handleToggle = async (car) => {
    const formData = new FormData();
    formData.append("isAvailable", !car.isAvailable);
    await dispatch(updateCar(car._id, formData));
  };

  // ── EDIT ──
  const startEdit = (car) => {
    setEditingId(car._id);
    setEditForm({
      brand: car.brand,
      model: car.model,
      year: car.year,
      category: car.category,
      transmission: car.transmission,
      fuelType: car.fuelType,
      seatingCapacity: car.seatingCapacity,
      dailyPrice: car.dailyPrice,
      location: car.location,
      description: car.description || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
    setEditImage(null);
    setEditPreview(null);
  };

  const handleEditImage = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (!file) return; // No file selected 
    setEditImage(file); 
    setEditPreview(URL.createObjectURL(file)); 
  };

  const handleSave = async (id) => {
    setSaving(true);
    const formData = new FormData();
    Object.entries(editForm).forEach(([k, v]) => formData.append(k, v));
    if (editImage) formData.append("image", editImage);
    await dispatch(updateCar(id, formData));
    setSaving(false);
    setEditingId(null);
    setEditImage(null);
    setEditPreview(null);
  };

  // ── DELETE ──
  const handleDelete = async (id) => {
    await dispatch(deleteCar(id));
    setDeleteConfirm(null);
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        {/* Header */}
        <div className="ac-header">
          <div>
            <h1>Manage Cars</h1>
            <p>{cars.length} vehicles in the fleet</p>
          </div>
          <button
            className="ac-add-btn"
            onClick={() => navigate("/admin/cars/new")}
          >
            <FiPlus size={15} /> Add New Car
          </button>
        </div>

        {/* Toolbar */}
        <div className="ac-toolbar">
          <div className="ac-search">
            <FiSearch size={14} />
            <input
              placeholder="Search brand, model, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch("")}>
                <FiX size={12} />
              </button>
            )}
          </div>
          <div className="ac-cats">
            {categories.map((c) => (
              <button
                key={c}
                className={`ac-chip ${filterCat === c ? "active" : ""}`}
                onClick={() => setFilterCat(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <p className="ac-count">
          <strong>{filtered.length}</strong> / {cars.length} cars
        </p>

        {/* Cars list */}
        {loading ? (
          <div className="ac-list">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="ac-skeleton" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="ac-empty">
            <RiCarLine size={52} />
            <h3>No cars found</h3>
            <p>Try adjusting your search</p>
          </div>
        ) : (
          <div className="ac-list">
            {filtered.map((car) => (
              <div
                key={car._id}
                className={`ac-row ${editingId === car._id ? "editing" : ""}`}
              >
                {editingId === car._id ? (
                  /* ── EDIT MODE ── */
                  <div className="ac-edit-panel">
                    <div className="ac-edit-top">
                      {/* Image editable */}
                      <div className="ac-edit-img-wrap">
                        <img
                          src={
                            editPreview || car.image || "/car-placeholder.png"
                          }
                          alt=""
                          className="ac-edit-img"
                        />
                        <label className="ac-edit-img-overlay">
                          <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={handleEditImage}
                            style={{ display: "none" }}
                          />
                          <FiUpload size={16} />
                          <span>Change</span>
                        </label>
                        {editPreview && (
                          <button
                            type="button"
                            className="ac-edit-img-remove"
                            onClick={() => {
                              setEditImage(null);
                              setEditPreview(null);
                            }}
                          >
                            <FiX size={12} />
                          </button>
                        )}
                      </div>

                      <div className="ac-edit-fields">
                        <div className="ac-edit-row">
                          <div className="ac-edit-field">
                            <label>Brand</label>
                            <input
                              value={editForm.brand}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  brand: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="ac-edit-field">
                            <label>Model</label>
                            <input
                              value={editForm.model}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  model: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="ac-edit-field">
                            <label>Year</label>
                            <input
                              type="number"
                              value={editForm.year}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  year: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="ac-edit-field">
                            <label>Price (TND/day)</label>
                            <input
                              type="number"
                              value={editForm.dailyPrice}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  dailyPrice: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="ac-edit-field">
                            <label>Seats</label>
                            <input
                              type="number"
                              value={editForm.seatingCapacity}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  seatingCapacity: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>

                        <div className="ac-edit-row">
                          <div className="ac-edit-field">
                            <label>Category</label>
                            <select
                              value={editForm.category}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  category: e.target.value,
                                })
                              }
                            >
                              {CATEGORIES.map((c) => (
                                <option key={c}>{c}</option>
                              ))}
                            </select>
                          </div>
                          <div className="ac-edit-field">
                            <label>Transmission</label>
                            <select
                              value={editForm.transmission}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  transmission: e.target.value,
                                })
                              }
                            >
                              {TRANSMISSIONS.map((t) => (
                                <option key={t}>{t}</option>
                              ))}
                            </select>
                          </div>
                          <div className="ac-edit-field">
                            <label>Fuel Type</label>
                            <select
                              value={editForm.fuelType}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  fuelType: e.target.value,
                                })
                              }
                            >
                              {FUEL_TYPES.map((f) => (
                                <option key={f}>{f}</option>
                              ))}
                            </select>
                          </div>
                          <div className="ac-edit-field">
                            <label>Location</label>
                            <select
                              value={editForm.location}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  location: e.target.value,
                                })
                              }
                            >
                              {LOCATIONS.map((l) => (
                                <option key={l}>{l}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="ac-edit-field full">
                          <label>Description</label>
                          <textarea
                            rows={2}
                            value={editForm.description}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                description: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="ac-edit-actions">
                      <button className="ac-cancel-edit" onClick={cancelEdit}>
                        <FiX size={14} /> Cancel
                      </button>
                      <button
                        className="ac-save-btn"
                        onClick={() => handleSave(car._id)}
                        disabled={saving}
                      >
                        <FiSave size={14} />{" "}
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ── VIEW MODE ── */
                  <>
                    <div className="ac-row-left">
                      <div className="ac-row-img-wrap">
                        <img src={car.image || "/car-placeholder.png"} alt="" />
                      </div>
                      <div className="ac-row-info">
                        <div className="ac-row-title">
                          <h3>
                            {car.brand} {car.model}
                          </h3>
                          <span className="ac-row-year">{car.year}</span>
                          <span className="ac-row-cat">{car.category}</span>
                        </div>
                        <div className="ac-row-tags">
                          <span>
                            <TbManualGearbox size={12} /> {car.transmission}
                          </span>
                          <span>
                            <MdOutlineLocalGasStation size={12} />{" "}
                            {car.fuelType}
                          </span>
                          <span>
                            <HiOutlineLocationMarker size={12} /> {car.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="ac-row-right">
                      <div className="ac-row-price">
                        <span>{car.dailyPrice}</span>
                        <small>TND/day</small>
                      </div>

                      <button
                        className={`ac-toggle ${car.isAvailable ? "on" : "off"}`}
                        onClick={() => handleToggle(car)}
                      >
                        {car.isAvailable ? (
                          <>
                            <BsToggleOn size={26} /> Available
                          </>
                        ) : (
                          <>
                            <BsToggleOff size={26} /> Unavailable
                          </>
                        )}
                      </button>

                      <div className="ac-row-actions">
                        <button
                          className="ac-btn-edit"
                          onClick={() => startEdit(car)}
                        >
                          <FiEdit3 size={14} /> Edit
                        </button>
                        <button
                          className="ac-btn-delete"
                          onClick={() => setDeleteConfirm(car._id)}
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Delete Modal */}
      {deleteConfirm && (
        <div
          className="ac-modal-overlay"
          onClick={() => setDeleteConfirm(null)}
        >
          <div className="ac-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ac-modal-icon">
              <FiTrash2 size={26} />
            </div>
            <h3>Delete this car?</h3>
            <p>This action cannot be undone.</p>
            <div className="ac-modal-btns">
              <button
                className="ac-modal-cancel"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="ac-modal-confirm"
                onClick={() => handleDelete(deleteConfirm)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCars;
