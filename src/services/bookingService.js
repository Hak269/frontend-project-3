import axios from "axios";

const API_URL = "http://localhost:3000/bookings";

const getTokenConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getBookingDetails = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createBooking = async (bookingData) => {
  const response = await axios.post(
    `${API_URL}/create`,
    bookingData,
    getTokenConfig()
  );
  return response.data;
};

export const updateBooking = async (id, bookingData) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    bookingData,
    getTokenConfig()
  );
  return response.data;
};

export const deleteBooking = async (id) => {
  const response = await axios.delete(
    `${API_URL}/${id}`,
    getTokenConfig()
  );
  return response.data;
};