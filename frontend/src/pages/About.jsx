import "./About.css";
import car1 from "../assets/car2.png";
import { FaCar, FaShieldAlt, FaClock, FaStar } from "react-icons/fa";

const About = () => {
  return (
    <div className="about-page">

      {/* ── HERO ── */}
      <section className="about-hero" data-aos="fade-up">
        <span className="section-label">Our Story</span>
        <h1>Driving the Future of<br /><span>Luxury Rentals</span></h1>
        <p>
          Redefining car rentals with seamless booking, premium vehicles,
          and an experience built around you.
        </p>
      </section>

      {/* ── MISSION ── */}
      <section className="about-mission" data-aos="fade-up">
        <div className="mission-text">
          <span className="section-label">Our Mission</span>
          <h2>Built for Drivers<br />Who Demand More</h2>
          <p>
            At LuxDrive, we believe every journey should feel extraordinary.
            Our platform connects drivers with premium vehicles in just a few clicks,
            ensuring security, flexibility, and complete comfort at every step.
          </p>
          <div className="mission-points">
            <div className="mission-point">Verified, fully-insured premium vehicles</div>
            <div className="mission-point">Instant availability & real-time pricing</div>
            <div className="mission-point">24/7 customer support in Tunisia</div>
            <div className="mission-point">Flexible pickup & drop-off locations</div>
          </div>
        </div>

        <div className="mission-image" data-aos="fade-left">
          <img src={car1} alt="luxury car" />
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="about-features" data-aos="fade-up">
        <h2>Why Thousands Choose LuxDrive</h2>

        <div className="features-grid">

          <div className="feature-card" data-aos="fade-up" data-aos-delay="0">
            <div className="feature-icon-wrap">
              <FaCar className="icon" />
            </div>
            <h3>Premium Vehicles</h3>
            <p>Wide range of high-end, regularly serviced luxury cars for every occasion.</p>
          </div>

          <div className="feature-card" data-aos="fade-up" data-aos-delay="80">
            <div className="feature-icon-wrap">
              <FaShieldAlt className="icon" />
            </div>
            <h3>Secure Booking</h3>
            <p>Encrypted payments, verified listings, and full insurance coverage included.</p>
          </div>

          <div className="feature-card" data-aos="fade-up" data-aos-delay="160">
            <div className="feature-icon-wrap">
              <FaClock className="icon" />
            </div>
            <h3>Flexible Rentals</h3>
            <p>Daily, weekly, or monthly — choose the rental schedule that fits your life.</p>
          </div>

          <div className="feature-card" data-aos="fade-up" data-aos-delay="240">
            <div className="feature-icon-wrap">
              <FaStar className="icon" />
            </div>
            <h3>Top-Rated Service</h3>
            <p>4.9/5 average rating from over 1,200 verified customers across Tunisia.</p>
          </div>

        </div>
      </section>

      {/* ── STATS ── */}
      <section className="about-stats" data-aos="fade-up">
        <div className="stat">
          <h3>500+</h3>
          <p>Luxury Cars</p>
        </div>
        <div className="stat">
          <h3>1,200+</h3>
          <p>Happy Clients</p>
        </div>
        <div className="stat">
          <h3>15+</h3>
          <p>Cities Covered</p>
        </div>
        <div className="stat">
          <h3>4.9</h3>
          <p>Average Rating</p>
        </div>
      </section>

    </div>
  );
};

export default About;
