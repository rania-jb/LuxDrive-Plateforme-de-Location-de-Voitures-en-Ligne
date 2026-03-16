import "./OpinionCard.css";
import { FaStar, FaRegStar } from "react-icons/fa";

const OpinionCard = ({ image, name, role, text, rating }) => { 
  return (
    <div className="opinion-card">

      {/* Stars at top */}
      <div className="stars">
        {[...Array(5)].map((_, index) =>
          index < rating ? (
            <FaStar key={index} />
          ) : (
            <FaRegStar key={index} />
          )
        )}
      </div>

      {/* Quote */}
      <p>"{text}"</p>

      {/* Author row at bottom */}
      <div className="opinion-author">
        <img src={image} alt={name} />
        <div>
          <h4>{name}</h4>
          <span className="author-role">{role}</span>
        </div>
      </div>

    </div>
  );
};

export default OpinionCard;
