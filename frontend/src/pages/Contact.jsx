import "./Contact.css";
import { useState } from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaPaperPlane } from "react-icons/fa";
import API from "../services/api";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault()
  try {
    await API.post('/contact', formData)
    setSent(true)
  } catch (err) {
    console.error(err)
  }
}

  return (
    <div className="contact-page">

      {/* ── HERO ── */}
      <section className="contact-hero" data-aos="fade-up">
        <div className="contact-hero-badge">Get in Touch</div>
        <h1>We'd Love to <span className="gradient-text">Hear From You</span></h1>
        <p>Have a question about a reservation or need help choosing the right car? Our team is ready to assist.</p>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section className="contact-main">

        {/* INFO CARDS */}
        <div className="contact-info" data-aos="fade-right">

          <div className="info-card">
            <div className="info-icon">
              <FaPhone />
            </div>
            <div className="info-content">
              <h4>Call Us</h4>
              <p>+216 71 000 000</p>
              <p>+216 55 000 000</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">
              <FaEnvelope />
            </div>
            <div className="info-content">
              <h4>Email Us</h4>
              <p>support@luxdrive.tn</p>
              <p>booking@luxdrive.tn</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">
              <FaMapMarkerAlt />
            </div>
            <div className="info-content">
              <h4>Visit Us</h4>
              <p>Avenue Habib Bourguiba</p>
              <p>Tunis, Tunisia</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">
              <FaClock />
            </div>
            <div className="info-content">
              <h4>Working Hours</h4>
              <p>Mon – Fri : 08:00 – 20:00</p>
              <p>Sat – Sun : 09:00 – 17:00</p>
            </div>
          </div>

        </div>

        {/* FORM */}
        <div className="contact-form-wrapper" data-aos="fade-left">
          <div className="form-header">
            <h2>Send a Message</h2>
            <p>We'll get back to you within 24 hours.</p>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>

            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="john@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Subject</label>
              <input
                type="text"
                name="subject"
                placeholder="How can we help?"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea
                name="message"
                rows="5"
                placeholder="Tell us more about your request..."
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className={`submit-btn ${sent ? "sent" : ""}`}>
              {sent ? (
                <>✓ Message Sent!</>
              ) : (
                <><FaPaperPlane /> Send Message</>
              )}
            </button>

          </form>
        </div>

      </section>

      {/* ── MAP ── */}
      <section className="contact-map" data-aos="fade-up">
        <iframe
          title="LuxDrive Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3193.0!2d10.1815!3d36.8065!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDQ4JzIzLjQiTiAxMMKwMTAnNTMuNCJF!5e0!3m2!1sen!2stn!4v1600000000000"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>

    </div>
  );
};

export default Contact;