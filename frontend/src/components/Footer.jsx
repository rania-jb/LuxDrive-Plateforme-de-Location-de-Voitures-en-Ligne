import "./Footer.css";
import { Link } from "react-router-dom";
import { FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">

        {/* Brand */}
        <div className="footer-brand">
          <span className="logo-text">LuxDrive</span>
          <p>Premium car rental experience. Drive in style, arrive in comfort — wherever the road takes you.</p>
        </div>

        {/* Navigation */}
        <div className="footer-col">
          <h4>Navigate</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/cars">Browse Cars</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Services */}
        <div className="footer-col">
          <h4>Services</h4>
          <ul>
            <li><Link to="/luxury">Luxury Rentals</Link></li>
            <li><Link to="/long-term">Long-Term Hire</Link></li>
            <li><Link to="/airport">Airport Pickup</Link></li>
            <li><Link to="/list-car">List Your Car</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div className="footer-col">
          <h4>Support</h4>
          <ul>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/terms-of-service">Terms of Service</Link></li>
            <li><Link to="/help-center">Help Center</Link></li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} LuxDrive. All rights reserved.</p>

        <div className="footer-socials">
          <Link to="#" aria-label="Instagram"><FaInstagram /></Link>
          <Link to="#" aria-label="Twitter"><FaTwitter /></Link>
          <Link to="#" aria-label="LinkedIn"><FaLinkedin /></Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
