import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { TbManualGearbox } from 'react-icons/tb';
import { MdOutlineLocalGasStation } from 'react-icons/md';
import { MdOutlineAirlineSeatReclineNormal } from 'react-icons/md';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { FiArrowRight } from 'react-icons/fi';
import { RiCarLine } from 'react-icons/ri';
import './CarCard.css';

const CARD_COLORS = [
  { bg: '#fff0f6', accent: '#ff6b9d', light: '#ffe0ef' },
  { bg: '#f0f4ff', accent: '#6b8fff', light: '#dde6ff' },
  { bg: '#f0fff8', accent: '#2ec78a', light: '#d0f5e8' },
  { bg: '#fff8f0', accent: '#ff9f43', light: '#ffe8cc' },
  { bg: '#f5f0ff', accent: '#a855f7', light: '#ead5ff' },
  { bg: '#f0faff', accent: '#22b8e0', light: '#cceeff' },
];


const CarCard = ({ car, index = 0 }) => {
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth); 
  const color    = CARD_COLORS[index % CARD_COLORS.length]; // Cycle through colors based on index

  return (
    <div
      className="car-card"
      style={{ '--card-bg': color.bg, '--card-accent': color.accent, '--card-light': color.light }}
      onClick={() => navigate(`/cars/${car._id}`)}
    >
      {/* Badge */}
      <div className={`availability-badge ${car.isAvailable ? 'available' : 'unavailable'}`}>
        <span className="badge-dot" />
        {car.isAvailable ? 'Available' : 'Unavailable'}
      </div>

      {/* Image */}
      <div className="car-card-image-wrap">
        <img
          src={car.image ? `${car.image}` : '/car-placeholder.png'}
          alt={`${car.brand} ${car.model}`}
          className="car-card-img"
        />
      </div>

      {/* Body */}
      <div className="car-card-body">
        <div className="car-card-title-row">
          <div>
            <h3>{car.brand} <span>{car.model}</span></h3>
            <p className="car-year">{car.year}</p>
          </div>
          <div className="car-price">
            <span>{car.dailyPrice}</span>
            <small>TND/day</small>
          </div>
        </div>

        <div className="car-card-tags">
          <span className="car-tag">
            <TbManualGearbox size={13} style={{ color: color.accent }} />
            {car.transmission}
          </span>
          <span className="car-tag">
            <MdOutlineLocalGasStation size={13} style={{ color: color.accent }} />
            {car.fuelType}
          </span>
          <span className="car-tag">
            <MdOutlineAirlineSeatReclineNormal size={13} style={{ color: color.accent }} />
            {car.seatingCapacity}
          </span>
          <span className="car-tag">
            <HiOutlineLocationMarker size={13} style={{ color: color.accent }} />
            {car.location}
          </span>
        </div>

        <button
          className="car-card-btn"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/cars/${car._id}`);
          }}
        >
          <RiCarLine size={15} />
          {user ? 'View & Book' : 'View Details'}
          <FiArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default CarCard;