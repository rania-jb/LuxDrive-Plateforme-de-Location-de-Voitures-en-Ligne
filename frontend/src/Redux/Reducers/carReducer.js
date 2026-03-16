import * as types from '../actionTypes';

const initialState = {
  cars:       [],
  selectedCar: null,
  loading:    false,
  error:      null,
};

const carReducer = (state = initialState, action) => {
  switch (action.type) {

    case types.FETCH_CARS_REQUEST:
    case types.FETCH_CAR_REQUEST:
    case types.CREATE_CAR_REQUEST:
    case types.UPDATE_CAR_REQUEST:
      return { ...state, loading: true, error: null };

    case types.FETCH_CARS_SUCCESS:
      return { ...state, loading: false, cars: action.payload };

    case types.FETCH_CAR_SUCCESS:
      return { ...state, loading: false, selectedCar: action.payload };

    case types.CREATE_CAR_SUCCESS:
      return { ...state, loading: false, cars: [...state.cars, action.payload] };

    case types.UPDATE_CAR_SUCCESS:
      return {
        ...state,
        loading: false,
        cars: state.cars.map(c => c._id === action.payload._id ? action.payload : c),
      };

    case types.DELETE_CAR_SUCCESS:
      return {
        ...state,
        cars: state.cars.filter(c => c._id !== action.payload),
      };

    case types.FETCH_CARS_FAIL:
    case types.FETCH_CAR_FAIL:
    case types.CREATE_CAR_FAIL:
    case types.UPDATE_CAR_FAIL:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default carReducer;