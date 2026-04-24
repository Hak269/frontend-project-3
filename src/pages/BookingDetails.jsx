import { useState, useEffect } from 'react';
import '../styles/BookingDetails.css';

const BookingDetails = () => {
  const [booking, setBooking] = useState({
    passengerName: "",
    cabinClass: "",
    mealPreference: "",
    flight: null,
    date: ""
  });

  const [flights, setFlights] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/flights")
      .then(res => res.json())
      .then(data => setFlights(data))
      .catch(err => console.log(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "flight") {
      const selectedFlight = flights.find(
        f => String(f._id) === String(value)
      );

      setBooking(prev => ({
        ...prev,
        flight: selectedFlight || null
      }));
    } else {
      setBooking(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleUpdate = () => {
    alert("Booking updated");
  };

  return (
    <div className="page-wrapper">

      <h1 className="main-title">Booking Details</h1>

      {booking.flight && (
        <div className="flight-widget">
          <h2>{booking.flight.airLine}</h2>

          <div className="flight-row">
            <span>{booking.flight.departure}</span>
            <span>→</span>
            <span>{booking.flight.destination}</span>
          </div>

          <div className="flight-info">
            <span>Arrival: {booking.flight.arrival}</span>
            <span>Price: ${booking.flight.price}</span>
          </div>
        </div>
      )}

      <div className="booking-card">

        <div className="input-group">
          <label>Passenger Name</label>
          <input
            name="passengerName"
            value={booking.passengerName}
            onChange={handleChange}
            className="pill-input light-blue"
          />
        </div>

        <div className="form-grid">

          <div className="input-group">
            <label>Flight :</label>
            <select
              name="flight"
              value={booking.flight?._id || ""}
              onChange={handleChange}
              className="pill-input"
            >
              <option value="">Select Flight</option>
              {flights.map(flight => (
                <option key={flight._id} value={flight._id}>
                  {flight.airLine} ({flight.departure} → {flight.destination})
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Class :</label>
            <select
              name="cabinClass"
              value={booking.cabinClass}
              onChange={handleChange}
              className="pill-input"
            >
              <option value="">Select Class</option>
              <option value="EconomyClass">Economy</option>
              <option value="BusinessClass">Business</option>
              <option value="FirstClass">First</option>
            </select>
          </div>

          <div className="input-group">
            <label>Meal Preference :</label>
            <select
              name="mealPreference"
              value={booking.mealPreference}
              onChange={handleChange}
              className="pill-input"
            >
              <option value="">Select Meal</option>
              <option value="ChickenMeal">Chicken</option>
              <option value="BeefMeal">Beef</option>
              <option value="VegetarianMeal">Vegetarian</option>
            </select>
          </div>

          <div className="input-group">
            <label>Flight Date :</label>
            <input
              type="date"
              name="date"
              value={booking.date}
              onChange={handleChange}
              className="pill-input"
            />
          </div>

        </div>

        <div className="card-footer">

          <div className="price-tag">
            Total Price :
            <span className="price-box">
              ${booking.flight?.price || 0}
            </span>
          </div>

          <button className="btn edit" onClick={handleUpdate}>
            Edit Booking
          </button>

        </div>

      </div>
    </div>
  );
};

export default BookingDetails;