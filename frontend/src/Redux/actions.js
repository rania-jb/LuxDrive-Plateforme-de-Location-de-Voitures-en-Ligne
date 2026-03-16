import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_REQUEST,
  REGISTER_FAIL,
  LOGOUT,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAIL,
  CLEAR_AUTH_ERROR,
  REGISTER_SUCCESS,
  FETCH_CAR_REQUEST,
  FETCH_CAR_SUCCESS,
  FETCH_CAR_FAIL,
  FETCH_CARS_REQUEST,
  FETCH_CARS_SUCCESS,
  FETCH_CARS_FAIL,
  UPDATE_CAR_FAIL,
  UPDATE_CAR_REQUEST,
  FETCH_ALL_RESERVATIONS_REQUEST,
  FETCH_ALL_RESERVATIONS_SUCCESS,
  FETCH_ALL_RESERVATIONS_FAIL,
  CREATE_CAR_REQUEST,
  CREATE_CAR_SUCCESS,
  CREATE_CAR_FAIL,
  UPDATE_CAR_SUCCESS,
  DELETE_CAR_SUCCESS,
  CREATE_RESERVATION_REQUEST,
  CREATE_RESERVATION_SUCCESS,
  CREATE_RESERVATION_FAIL,
  FETCH_MY_RESERVATIONS_REQUEST,
  FETCH_MY_RESERVATIONS_SUCCESS,
  FETCH_MY_RESERVATIONS_FAIL,
  CANCEL_RESERVATION_SUCCESS,
  UPDATE_RESERVATION_STATUS,
} from "./actionTypes";
import { toast } from "react-toastify";
import API from "../services/api";

// ── AUTH ACTIONS ──
export const register = (form, navigate) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });

  try {
    await API.post("/register", form);

    dispatch({ type: REGISTER_SUCCESS });

    toast.success("Registration successful ! Please log in.");
    navigate("/login");
  } catch (err) {
    dispatch({
      type: REGISTER_FAIL,
      payload: err.response?.data?.message || "Registration failed",
    });
  }
};

export const login = (email, password, navigate) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });

  try {
    const loginUser = await API.post("/login", { email, password });
    localStorage.setItem("token", loginUser.data.token);
    localStorage.setItem("user", JSON.stringify(loginUser.data.user));

    dispatch({ type: LOGIN_SUCCESS, payload: loginUser.data.user }); // Store user data in Redux state

    toast.success("Login successful !");
    if (loginUser.data.user.role === "user") {
      navigate("/");
    } else {
      navigate("/admin/dashboard");
    }
  } catch (err) {
    dispatch({
      type: LOGIN_FAIL,
      payload: err.response?.data?.message || "Login failed",
    });
  }
};

export const logout = (navigate) => (dispatch) => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  dispatch({ type: LOGOUT });
  toast.info("Logged out");
  navigate("/");
};

export const updateProfile = (form) => async (dispatch) => {
  dispatch({ type: UPDATE_PROFILE_REQUEST });
  try {
    const res = await API.put("/profile", form);
    localStorage.setItem("token", res.data.token); // Update token
    localStorage.setItem("user", JSON.stringify(res.data)); // Update user data in localStorage
    dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: res.data });
  } catch (err) {
    dispatch({
      type: UPDATE_PROFILE_FAIL,
      payload: err.response?.data?.message || "Update failed",
    });
  }
};

export const uploadAvatar = (file) => async (dispatch) => {
  try {
    const formData = new FormData();
    formData.append("avatar", file);

    const res = await API.put("/profile/avatar", formData);

    const currentUser = JSON.parse(localStorage.getItem("user")); // Get current user data
    const updatedUser = { ...currentUser, avatar: res.data.avatar }; // Update avatar in user data
    localStorage.setItem("user", JSON.stringify(updatedUser)); // Update localStorage with new avatar
    dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: updatedUser });
    toast.success("Avatar updated!");
  } catch (err) {
    console.error("Avatar error:", err.response?.data);
    toast.error(err.response?.data?.message || "Failed to upload avatar");
  }
};

// ── CAR ACTIONS ──

export const fetchCarById = (id) => async (dispatch) => {
  dispatch({ type: FETCH_CAR_REQUEST });
  try {
    const res = await API.get(`/cars/${id}`);
    dispatch({ type: FETCH_CAR_SUCCESS, payload: res.data });
  } catch (err) {
    dispatch({ type: FETCH_CAR_FAIL, payload: err.response?.data?.message });
  }
};

export const fetchCars =
  (filters = {}) =>
  async (dispatch) => {
    dispatch({ type: FETCH_CARS_REQUEST });
    try {
      const res = await API.get("/cars", { params: filters });
      dispatch({ type: FETCH_CARS_SUCCESS, payload: res.data });
    } catch (err) {
      dispatch({
        type: FETCH_CARS_FAIL,
        payload: err.response?.data?.message || "Failed to fetch cars",
      });
    }
  };

export const createCar = (formData) => async (dispatch) => {
  dispatch({ type: CREATE_CAR_REQUEST });
  try {
    const res = await API.post("/cars", formData);
    dispatch({ type: CREATE_CAR_SUCCESS, payload: res.data });
    toast.success("Car added successfully!");
  } catch (err) {
    dispatch({
      type: CREATE_CAR_FAIL,
      payload: err.response?.data?.message || "Failed to add car",
    });
  }
};

export const updateCar = (id, formData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_CAR_REQUEST });
    const res = await API.put(`/cars/${id}`, formData);
    dispatch({ type: UPDATE_CAR_SUCCESS, payload: res.data });
    toast.success("Car updated!");
  } catch (err) {
    dispatch({
      type: UPDATE_CAR_FAIL,
      payload: err.response?.data?.message || "Failed to update car",
    });
  }
};

export const deleteCar = (id) => async (dispatch) => {
  try {
    await API.delete(`/cars/${id}`);
    dispatch({ type: DELETE_CAR_SUCCESS, payload: id });
    toast.success("Car deleted!");
  } catch (err) {
    toast.error("Failed to delete car");
  }
};

// Reservation actions
export const createReservation = (data) => async (dispatch) => {
  dispatch({ type: CREATE_RESERVATION_REQUEST });
  try {
    const res = await API.post("/reservations", data);
    dispatch({ type: CREATE_RESERVATION_SUCCESS, payload: res.data });
    toast.success("Reservation confirmed!");
  } catch (err) {
    dispatch({
      type: CREATE_RESERVATION_FAIL,
      payload: err.response?.data?.message,
    });
  }
};

export const fetchAllReservations = () => async (dispatch) => {
  dispatch({ type: FETCH_ALL_RESERVATIONS_REQUEST });
  try {
    const res = await API.get("/reservations");
    dispatch({ type: FETCH_ALL_RESERVATIONS_SUCCESS, payload: res.data });
  } catch (err) {
    dispatch({
      type: FETCH_ALL_RESERVATIONS_FAIL,
      payload: err.response?.data?.message,
    });
  }
};

export const updateReservationStatus = (id, status) => async (dispatch) => {
  try {
    const res = await API.put(`/reservations/${id}/status`, { status });
    dispatch({ type: UPDATE_RESERVATION_STATUS, payload: res.data });
    toast.success(`Reservation ${status}!`);
  } catch (err) {
    toast.error("Failed to update status");
  }
};



export const fetchMyReservations = () => async (dispatch) => {
  dispatch({ type: FETCH_MY_RESERVATIONS_REQUEST });
  try {
    const res = await API.get("/reservations/my");
    dispatch({ type: FETCH_MY_RESERVATIONS_SUCCESS, payload: res.data });
  } catch (err) {
    dispatch({
      type: FETCH_MY_RESERVATIONS_FAIL,
      payload: err.response?.data?.message,
    });
  }
};

export const cancelReservation = (id) => async (dispatch) => {
  try {
    await API.delete(`/reservations/${id}`);
    dispatch({ type: CANCEL_RESERVATION_SUCCESS, payload: id });
    toast.success("Reservation cancelled");
  } catch (err) {
    toast.error(err.response?.data?.message || "Cannot cancel reservation");
  }
};

export const clearAuthError = () => ({ type: CLEAR_AUTH_ERROR });
