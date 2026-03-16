import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { fetchCars } from "../Redux/actions";
import API from "../services/api";
import CarCard from "../components/CarCard";
import { FiSearch, FiX, FiSliders } from "react-icons/fi";
import { MdOutlineLocalGasStation } from "react-icons/md";
import { TbManualGearbox, TbCategory } from "react-icons/tb";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { BsSortDown } from "react-icons/bs";
import "./Cars.css";

const CATEGORIES = ["All", "Sedan", "SUV", "Van", "Sport", "Convertible"];
const TRANSMISSIONS = ["All", "Automatic", "Manual", "Semi-Automatic"];
const FUEL_TYPES = ["All", "Gas", "Diesel", "Petrol", "Electric", "Hybrid"];
const LOCATIONS = [
  "All",
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

const Cars = () => {
  const dispatch = useDispatch();
  const routerLocation = useLocation(); 
  const { cars, loading } = useSelector((s) => s.cars);

  // ── Query params depuis Home ──
  const params = new URLSearchParams(routerLocation.search);
  const paramLoc = params.get("location") || "All";
  const paramStart = params.get("startDate") || "";
  const paramEnd = params.get("endDate") || "";

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [transmission, setTransmission] = useState("All");
  const [fuelType, setFuelType] = useState("All");
  const [location, setLocation] = useState(paramLoc);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [filterStart, setFilterStart] = useState(paramStart);
  const [filterEnd, setFilterEnd] = useState(paramEnd);
  const [bookedCarIds, setBookedCarIds] = useState([]);

  // ── Fetch cars avec filtres ──
  useEffect(() => {
    const filters = {};
    if (category !== "All") filters.category = category;
    if (transmission !== "All") filters.transmission = transmission;
    if (fuelType !== "All") filters.fuelType = fuelType;
    if (location !== "All") filters.location = location;
    if (maxPrice < 1000) filters.maxPrice = maxPrice;
    filters.sortBy = sortBy;
    dispatch(fetchCars(filters));
  }, [category, transmission, fuelType, location, maxPrice, sortBy, dispatch]);

  // ── Fetch voitures réservées sur la période ──
  useEffect(() => {
    if (filterStart && filterEnd) {
      API.get(
        `/reservations/booked-cars?startDate=${filterStart}&endDate=${filterEnd}`,
      )
        .then((res) => setBookedCarIds(res.data))
        .catch(() => setBookedCarIds([]));
    } else {
      setBookedCarIds([]);
    }
  }, [filterStart, filterEnd]);

  // ── Filtre final ──
  const filteredCars = cars
    .filter((car) => 
      search 
        ? `${car.brand} ${car.model}`
            .toLowerCase()
            .includes(search.toLowerCase())
        : true,
    )
    .filter((car) => !bookedCarIds.includes(car._id)); 

  const activeFiltersCount = [
    category !== "All",
    transmission !== "All",
    fuelType !== "All",
    location !== "All",
    maxPrice < 1000,
    filterStart !== "",
    filterEnd !== "",
  ].filter(Boolean).length;

  const resetFilters = () => {
    setCategory("All");
    setTransmission("All");
    setFuelType("All");
    setLocation("All");
    setMaxPrice(1000);
    setSearch("");
    setSortBy("newest");
    setFilterStart("");
    setFilterEnd("");
    setBookedCarIds([]); 
  };

  const today = new Date().toISOString().split("T")[0]; 

  return (
    <div className="cars-page"> 
      {/* ── HERO ── */}
      <div className="cars-hero">
        <div className="cars-hero-bg" />
        <div className="cars-hero-content">
          <span className="cars-hero-label">OUR FLEET</span>
          <h1>
            Find Your <em>Perfect</em> Ride
          </h1>
          <p>{cars.length} premium vehicles available across Tunisia</p>

          <div className="cars-search-bar">
            <FiSearch size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search by brand or model..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="search-clear" onClick={() => setSearch("")}>
                <FiX size={14} />
              </button>
            )}
          </div>

          {/* Dates actives depuis Home */}
          {filterStart && filterEnd && (
            <div className="active-date-filter">
              🗓 Available from{" "}
              <strong>
                {new Date(filterStart).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </strong>
              {" → "}
              <strong>
                {new Date(filterEnd).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </strong>
              <button
                onClick={() => {
                  setFilterStart("");
                  setFilterEnd("");
                }}
              >
                <FiX size={12} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="cars-main">
        {/* ── TOOLBAR ── */}
        <div className="cars-toolbar">
          <div className="toolbar-left">
            <span className="results-count">
              <strong>{filteredCars.length}</strong> cars found
            </span>
            <button
              className={`filter-toggle-btn ${showFilters ? "active" : ""}`}
              onClick={() => setShowFilters((p) => !p)}
            >
              <FiSliders size={14} /> Filters
              {activeFiltersCount > 0 && (
                <span className="filter-badge">{activeFiltersCount}</span>
              )}
            </button>
            {activeFiltersCount > 0 && (
              <button className="reset-btn" onClick={resetFilters}>
                <FiX size={13} /> Reset
              </button>
            )}
          </div>

          <div className="toolbar-right">
            <BsSortDown size={15} className="sort-icon" />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest first</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
          </div>
        </div>

        {/* ── FILTERS PANEL ── */}
        {showFilters && (
          <div className="filters-panel">
            <div className="filter-group">
              <label>
                <TbCategory size={14} /> Category
              </label>
              <div className="filter-chips">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    className={`chip ${category === c ? "active" : ""}`}
                    onClick={() => setCategory(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label>
                <TbManualGearbox size={14} /> Transmission
              </label>
              <div className="filter-chips">
                {TRANSMISSIONS.map((t) => (
                  <button
                    key={t}
                    className={`chip ${transmission === t ? "active" : ""}`}
                    onClick={() => setTransmission(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label>
                <MdOutlineLocalGasStation size={14} /> Fuel Type
              </label>
              <div className="filter-chips">
                {FUEL_TYPES.map((f) => (
                  <button
                    key={f}
                    className={`chip ${fuelType === f ? "active" : ""}`}
                    onClick={() => setFuelType(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label>
                <HiOutlineLocationMarker size={14} /> Location
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="location-select"
              >
                {LOCATIONS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>
                Max Price: <strong>{maxPrice} TND/day</strong>
              </label>
              <input
                type="range"
                min={50}
                max={1000}
                step={50}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="price-range"
              />
              <div className="range-labels">
                <span>50 TND</span>
                <span>1000 TND</span>
              </div>
            </div>

            {/* Filtre dates dans le panel */}
            <div className="filter-group">
              <label>📅 Availability Period</label>
              <div className="date-filter-row">
                <div className="date-filter-field">
                  <span>From</span>
                  <input
                    type="date"
                    min={today}
                    value={filterStart}
                    onChange={(e) => {
                      setFilterStart(e.target.value);
                      if (filterEnd && e.target.value >= filterEnd)
                        setFilterEnd("");
                    }}
                  />
                </div>
                <div className="date-filter-field">
                  <span>To</span>
                  <input
                    type="date"
                    min={filterStart || today}
                    value={filterEnd}
                    disabled={!filterStart}
                    onChange={(e) => setFilterEnd(e.target.value)}
                  />
                </div>
                {(filterStart || filterEnd) && (
                  <button
                    className="date-clear-btn"
                    onClick={() => {
                      setFilterStart("");
                      setFilterEnd("");
                    }}
                  >
                    <FiX size={13} />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── GRID ── */}
        {loading ? (
          <div className="cars-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="car-skeleton"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="cars-empty">
            <div className="empty-icon">
              <FiSearch size={48} />
            </div>
            <h3>No cars found</h3>
            <p>Try adjusting your filters or search term</p>
            <button className="reset-btn-lg" onClick={resetFilters}>
              <FiX size={14} /> Reset Filters
            </button>
          </div>
        ) : (
          <div className="cars-grid">
            {filteredCars.map((car, i) => (
              <CarCard key={car._id} car={car} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cars;
