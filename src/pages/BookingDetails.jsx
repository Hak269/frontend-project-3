import { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import '../styles/BookingDetails.css';
import { createBooking, deleteBooking } from "../services/bookingService";

const BookingDetails = () => {
  const location = useLocation();

  const selectedFlight = location.state?.flight;
  const travellers = location.state?.travellers || { adult: 1, child: 0 };
  const [openIndex, setOpenIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [bookingIds, setBookingIds] = useState([]);

  const [savedPassengers, setSavedPassengers] = useState([
    "Clarice",
    "Fatima",
    "Noor",
    "Tayla",
  ]);

  const [booking, setBooking] = useState({
    passengerName: "",
    cabinClass: "",
    mealPreference: "",
    flight: null,
    date: "",
    isRoundTrip: false,
    returnDate: ""
  });

  const [passengers, setPassengers] = useState([]);
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/flights")
      .then(res => res.json())
      .then(data => setFlights(data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    if (selectedFlight) {
      setBooking(prev => ({
        ...prev,
        flight: selectedFlight
      }));
    }
  }, [selectedFlight]);

  useEffect(() => {
    const list = [];

    const adults = Number(travellers.adult || 1);
    const children = Number(travellers.child || 0);

    for (let i = 0; i < adults; i++) {
      list.push({ type: "Adult", name: "" });
    }

    for (let i = 0; i < children; i++) {
      list.push({ type: "Child", name: "" });
    }

    setPassengers(list);
  }, [travellers.adult, travellers.child]);

  const togglePassenger = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handlePassengerChange = (index, value) => {
    const updated = [...passengers];
    updated[index].name = value;
    setPassengers(updated);
  };

  const handleMainPassengerChange = (e) => {
    const value = e.target.value;

    setBooking(prev => ({
      ...prev,
      passengerName: value
    }));

    if (passengers.length > 0) {
      const updated = [...passengers];
      updated[0].name = value;
      setPassengers(updated);
    }
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;

    if (name === "flight") {
      const selectedFlight = flights.find(
        f => String(f._id) === String(value)
      );

      setBooking(prev => ({
        ...prev,
        flight: selectedFlight || null
      }));
    } else if (name === "isRoundTrip") {
      setBooking(prev => ({
        ...prev,
        isRoundTrip: checked,
        returnDate: checked ? prev.returnDate : ""
      }));
    } else {
      setBooking(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleUpdate = async () => {
    const createdBookings = [];

    for (const passenger of passengers) {
      const newBooking = await createBooking({
        passengerName: passenger.name,
        flight: booking.flight._id,
        seat: "A1",
        cabinClass: booking.cabinClass,
        price: totalPrice / passengers.length,
        mealPreference: booking.mealPreference,
        isRoundTrip: booking.isRoundTrip,
        returnDate: booking.returnDate || null
      });

      createdBookings.push(newBooking);
    }

    setBookingIds(createdBookings.map(b => b._id));

    setSavedPassengers(prev => [
      ...new Set([
        ...prev,
        booking.passengerName,
        ...passengers.map(p => p.name)
      ].filter(name => name.trim() !== ""))
    ]);

    alert("Booking saved");
  };

  const handleDelete = async () => {
    for (const id of bookingIds) {
      await deleteBooking(id);
    }

    setBookingIds([]);

    setBooking({
      passengerName: "",
      cabinClass: "",
      mealPreference: "",
      flight: null,
      date: "",
      isRoundTrip: false,
      returnDate: ""
    });

    setPassengers([]);
    setOpenIndex(null);
    setIsEditing(false);

    alert("Booking deleted from database");
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const adultCount = Number(travellers.adult || 1);
  const childCount = Number(travellers.child || 0);
  const basePrice = Number(booking.flight?.price || 0);

  const oneWayPrice =
    adultCount * basePrice +
    childCount * Math.max(basePrice - 100, 0);

  const totalPrice = booking.isRoundTrip ? oneWayPrice * 2 : oneWayPrice;

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
            <span>Price per Adult: ${basePrice}</span>
            <span>Round Trip: {booking.isRoundTrip ? "Yes" : "No"}</span>
          </div>
        </div>
      )}

      <div className="booking-card">

        <div className="input-group">
          <label>Passenger Name</label>
          <input
            list="main-passenger-list"
            name="passengerName"
            value={booking.passengerName}
            onChange={handleMainPassengerChange}
            className="pill-input light-blue"
            placeholder="Select or type passenger name"
            disabled={!isEditing}
          />

          <datalist id="main-passenger-list">
            {savedPassengers.map((name, index) => (
              <option key={index} value={name} />
            ))}
          </datalist>
        </div>

        <div className="form-grid">

          <div className="input-group">
            <label>Flight :</label>
            <select
              name="flight"
              value={booking.flight?._id || ""}
              onChange={handleChange}
              className="pill-input"
              disabled={!isEditing}
            >
              <option value="">Select Flight</option>
              {flights.map(flight => (
                <option key={flight._id} value={flight._id}>
                  {flight.airLine} ({flight.departure} → {flight.destination}) - ${flight.price}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Class </label>
            <select
              name="cabinClass"
              value={booking.cabinClass}
              onChange={handleChange}
              className="pill-input"
              disabled={!isEditing}
            >
              <option value="">Select Class</option>
              <option value="EconomyClass">Economy</option>
              <option value="BusinessClass">Business</option>
              <option value="FirstClass">First</option>
            </select>
          </div>

          <div className="input-group">
            <label>Meal Preference </label>
            <select
              name="mealPreference"
              value={booking.mealPreference}
              onChange={handleChange}
              className="pill-input"
              disabled={!isEditing}
            >
              <option value="">Select Meal</option>
              <option value="ChickenMeal">Chicken</option>
              <option value="BeefMeal">Beef</option>
              <option value="VegetarianMeal">Vegetarian</option>
              <option value="Snacks">Snacks</option>
            </select>
          </div>

          <div className="input-group">
            <label>Flight Date </label>
            <input
              type="date"
              name="date"
              value={booking.date}
              onChange={handleChange}
              className="pill-input"
              disabled={!isEditing}
            />
          </div>

          <div className="input-group">
            <label>Round Trip</label>
            <input
              type="checkbox"
              name="isRoundTrip"
              checked={booking.isRoundTrip}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          {booking.isRoundTrip && (
            <div className="input-group">
              <label>Return Date</label>
              <input
                type="date"
                name="returnDate"
                value={booking.returnDate}
                onChange={handleChange}
                className="pill-input"
                disabled={!isEditing}
              />
            </div>
          )}

        </div>

        <div style={{ marginTop: "15px", fontWeight: "bold", color: 'black' }}>
          {adultCount} Adults , {childCount} Children
        </div>

        <div style={{ marginTop: "20px" }}>
          <label style={{ fontWeight: "bold" }}>Passengers</label>

          {passengers.map((p, index) => (
            <div key={index}>
              <div onClick={() => togglePassenger(index)}>
                Passenger {index + 1} ({p.type}) {p.name && `- ${p.name}`}
              </div>

              {openIndex === index && (
                <input
                  value={p.name}
                  onChange={(e) =>
                    handlePassengerChange(index, e.target.value)
                  }
                  disabled={!isEditing}
                />
              )}
            </div>
          ))}
        </div>

        <div className="card-footer">

          <div className="price-tag">
            Total Price :
            <span className="price-box">
              ${totalPrice}
            </span>
          </div>

          {!isEditing ? (
            <button className="btn edit" onClick={() => setIsEditing(true)}>
              Edit Booking
            </button>
          ) : (
            <>
              <button
                className="btn confirm"
                onClick={() => {
                  handleUpdate();
                  setIsEditing(false);
                }}
              >
                Confirm Changes
              </button>

              <button
                className="btn delete"
                onClick={handleDelete}
              >
                Delete
              </button>

              <button
                className="btn delete"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </>
          )}

        </div>

      </div>
    </div>
  );
};

export default BookingDetails;