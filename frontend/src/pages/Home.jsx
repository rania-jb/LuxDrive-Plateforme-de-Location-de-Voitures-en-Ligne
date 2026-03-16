import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import car from "../assets/car.png";
import car3 from "../assets/car3.png";
import user1 from "../assets/user1.jpg";
import user2 from "../assets/user2.jpg";
import user3 from "../assets/user3.jpg";
import OpinionCard from "../components/OpinionCard";
import CarsSection from "../components/CarsSection";

const LOCATIONS = [
  "Tunis", "Ariana", "Ben Arous", "Manouba", "Nabeul",
  "Zaghouan", "Bizerte", "Béja", "Jendouba", "Kef", "Siliana",
  "Sousse", "Monastir", "Mahdia", "Sfax", "Kairouan", "Kasserine",
  "Sidi Bouzid", "Gabès", "Mednine", "Tataouine", "Gafsa", "Tozeur", "Kébili",
];

const Home = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

  const [location,  setLocation]  = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate,   setEndDate]   = useState("");
  const [error,     setError]     = useState("");

  const handleSearch = () => {
    if (!location)  { setError("Please select a pickup location"); return; }
    if (!startDate) { setError("Please select a pick-up date");    return; }
    if (!endDate)   { setError("Please select a return date");     return; }
    setError("");

    // Redirige vers /cars avec les filtres en query params
    const params = new URLSearchParams({
      location,
      startDate,
      endDate,
    });
    navigate(`/cars?${params.toString()}`);
  };

  return (
    <div className="home">
      {/* ── HERO ── */}
      <section className="hero" data-aos="fade-up">
        <div className="hero-content">
          <div className="hero-badge">✦ Premium Car Rental Platform</div>
          <h1>
            Drive Your <span>Dream Car</span>
            <br />
            Any Day, Anywhere
          </h1>
          <p className="hero-sub">
            Luxury vehicles, seamless booking, unforgettable journeys.
          </p>

          <div className="search-container">
            <div className="search-field">
              <label>Pickup Location</label>
              <select
                value={location}
                onChange={(e) => { setLocation(e.target.value); setError(""); }}
              >
                <option value="">Select city</option>
                {LOCATIONS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            <div className="search-divider" />

            <div className="search-field">
              <label>Pick-up Date</label>
              <input
                type="date"
                min={today}
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  if (endDate && e.target.value >= endDate) setEndDate("");
                  setError("");
                }}
              />
            </div>

            <div className="search-divider" />

            <div className="search-field">
              <label>Return Date</label>
              <input
                type="date"
                min={startDate || today}
                value={endDate}
                disabled={!startDate}
                onChange={(e) => { setEndDate(e.target.value); setError(""); }}
              />
            </div>

            <button className="search-btn" onClick={handleSearch}>
              Search Cars
            </button>
          </div>

          {error && <p className="search-error">⚠ {error}</p>}

        </div>

        <img src={car} alt="luxury car" className="hero-car" />
      </section>

      <CarsSection />

      {/* ── PROMO ── */}
      <section className="promo-section" data-aos="fade-up">
        <div className="promo-card">
          <div className="promo-left" data-aos="fade-right">
            <img src={car3} alt="luxury car" />
          </div>
          <div className="promo-right">
            <h3>Dreaming of driving a luxury car ? Make it a reality .</h3>
            <p>
              Drive your journey with confidence — choose from our wide range of
              reliable and affordable vehicles. Book today and experience
              comfort, safety, and unbeatable service every mile of the way.
            </p>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="testimonials-section" data-aos="fade-up">
        <div className="section-header">
          <span className="section-label">Reviews</span>
          <h2>What Our Customers Say</h2>
        </div>
        <p className="subtitle">
          Thousands of happy drivers. See why they keep coming back to LuxDrive.
        </p>
        <div className="testimonials-grid">
          <OpinionCard image={user1} name="Sarah Johnson"  role="Business Traveler" text="Amazing service and premium cars! The booking was instant and the vehicle was immaculate." rating={5} />
          <OpinionCard image={user2} name="Michael Smith"  role="Weekend Explorer"  text="Smooth booking and top quality experience. I've rented 3 times now and it keeps getting better." rating={4} />
          <OpinionCard image={user3} name="Emma Wilson"    role="Luxury Traveler"   text="Highly recommended for luxury travel. The Mercedes I rented was absolutely spotless." rating={5} />
        </div>
      </section>
    </div>
  );
};

export default Home;