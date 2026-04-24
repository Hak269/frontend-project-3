import axios from 'axios';

const API_URL = 'http://localhost:3000/bookings'; 



export const getBookingDetails = async (id) =>{
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const updateBooking = async (id, bookingData) =>{
  const response = await axios.put(`${API_URL}/${id}`, bookingData);
  return response.data;
};

export const deleteBooking = async (id) =>{
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};