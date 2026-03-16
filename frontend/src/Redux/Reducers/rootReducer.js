import { combineReducers } from 'redux';
import authReducer        from './authReducer';
import carReducer         from './carReducer';
import reservationReducer from './reservationReducer';

const rootReducer = combineReducers({
    
  auth:         authReducer,
  cars:         carReducer,
  reservations: reservationReducer,

});

export default rootReducer;