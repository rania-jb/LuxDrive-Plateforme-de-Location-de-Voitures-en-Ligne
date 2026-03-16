import {
  CREATE_RESERVATION_REQUEST,
  CREATE_RESERVATION_SUCCESS,
  CREATE_RESERVATION_FAIL,
  FETCH_MY_RESERVATIONS_REQUEST,
  FETCH_MY_RESERVATIONS_SUCCESS,
  FETCH_MY_RESERVATIONS_FAIL,
  FETCH_ALL_RESERVATIONS_REQUEST,
  FETCH_ALL_RESERVATIONS_SUCCESS,
  FETCH_ALL_RESERVATIONS_FAIL,
  CANCEL_RESERVATION_SUCCESS,
  UPDATE_RESERVATION_STATUS,
} from "../actionTypes";

const init = {
  myReservations: [],
  allReservations: [],
  loading: false,
  error: null,
};

const reservationReducer = (state = init, action) => {
  switch (action.type) {
    case CREATE_RESERVATION_REQUEST:
    case FETCH_MY_RESERVATIONS_REQUEST:
    case FETCH_ALL_RESERVATIONS_REQUEST:
      return { ...state, loading: true, error: null };

    case CREATE_RESERVATION_SUCCESS:
      return {
        ...state,
        loading: false,
        myReservations: [action.payload, ...state.myReservations],
      };

    case FETCH_MY_RESERVATIONS_SUCCESS:
      return { ...state, loading: false, myReservations: action.payload };

    case FETCH_ALL_RESERVATIONS_SUCCESS:
      return { ...state, loading: false, allReservations: action.payload };

    case CANCEL_RESERVATION_SUCCESS:
      
      return {
        ...state,
        // On met à jour le statut dans la liste de l'utilisateur pour refléter l'annulation
        myReservations: state.myReservations.map(
          (r) => (r._id === action.payload ? { ...r, status: "cancelled" } : r), 
        ),
        // On met à jour le statut dans la liste de l'admin pour garder la cohérence
        allReservations: state.allReservations.map(
          (r) => (r._id === action.payload ? { ...r, status: "cancelled" } : r), 
        ),
      };
      
      case UPDATE_RESERVATION_STATUS:
      return {
        ...state,
        allReservations: state.allReservations.map(
          (r) => (r._id === action.payload._id ? action.payload : r), // On met à jour la réservation modifiée dans la liste de toutes les réservations
        ),
        
      };

    case CREATE_RESERVATION_FAIL:
    case FETCH_MY_RESERVATIONS_FAIL:
    case FETCH_ALL_RESERVATIONS_FAIL:
      return { ...state, loading: false, error: action.payload };

    
    default:
      return state;
  }
};

export default reservationReducer;
