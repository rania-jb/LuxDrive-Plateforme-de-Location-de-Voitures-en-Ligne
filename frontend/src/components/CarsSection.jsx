import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCars } from '../Redux/actions';
import CarCard from './CarCard';
import { useNavigate } from 'react-router-dom';
import './CarsSection.css';

const CarsSection = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { cars, loading } = useSelector((s) => s.cars); 

  useEffect(() => {
    dispatch(fetchCars());
  }, [dispatch]); 

  const displayCars = cars.slice(0, 6); // Show only first 6 cars on homepage

  return (
    <section className="cars-section"  data-aos="fade-up">
      <div className="cars-section-header">
        <div className="cars-section-label">OUR FLEET</div>
        <h2>Choose Your <span>Perfect Ride</span></h2>
        <p>Hand-picked premium vehicles for every occasion</p>
      </div>
       
      {loading ? (
        <div className="cars-loading">
          {[1,2,3].map(i => <div key={i} className="car-skeleton" />)}
        </div>
      ) : (
        <>
          <div className="cars-grid">
            {displayCars.map((car, i) => (
              <CarCard key={car._id} car={car} index={i} />
            ))}
          </div>

          {cars.length > 6 && (
            <div className="cars-section-footer">
              <button className="see-all-btn" onClick={() => navigate('/cars')}>
                See All {cars.length} Cars →
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default CarsSection;