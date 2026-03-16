import * as types from "../actionTypes";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: false,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.LOGIN_REQUEST:
    case types.REGISTER_REQUEST:
    case types.UPDATE_PROFILE_REQUEST:
      return { ...state, loading: true, error: null };

    case types.LOGIN_SUCCESS:
    case types.UPDATE_PROFILE_SUCCESS:
      return { ...state, loading: false, user: action.payload, error: null };

    case types.REGISTER_SUCCESS:
      return { ...state, loading: false, error: null };

    case types.LOGIN_FAIL:
    case types.REGISTER_FAIL:
    case types.UPDATE_PROFILE_FAIL:
      return { ...state, loading: false, error: action.payload };

    case types.LOGOUT:
      return { ...state, user: null, error: null , loading: false  };

    case types.CLEAR_AUTH_ERROR:
      return { ...state, error: null };

    default:
      return state;
  }
};

export default authReducer;
