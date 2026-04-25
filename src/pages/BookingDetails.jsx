import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookingDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedFlight = location.state?.flight || null;
  const travellers = location.state?.travellers || { adults: 1 };

  const [booking, setBooking] = useState({
    passengerName: "",
    cabinClass: "EconomyClass",
    mealPreference: "VegetarianMeal",
    flight: selectedFlight,
    seat: "",
    isDirectFlight: true,
    isRoundTrip: false,
    returnDate: ""
  });

  const [flights, setFlights] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/flights")
      .then(res => res.json())
      .then(data => setFlights(data))
      .catch(err => console.log(err));

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userInfo = JSON.parse(atob(token.split('.')[1])).payload;
        setUser(userInfo);
      } catch (err) {
        console.log("Invalid token");
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "flight") {
      const selected = flights.find(f => String(f._id) === String(value));
      setBooking(prev => ({ ...prev, flight: selected || null }));
    } else if (name === "isDirectFlight" || name === "isRoundTrip") {
      setBooking(prev => ({ ...prev, [name]: value === "true" }));
    } else {
      setBooking(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    if (!booking.flight) return alert("Please select a flight");
    if (!booking.passengerName) return alert("Please enter passenger name");
    if (!booking.seat) return alert("Please enter seat number");
    if (!user) { alert("Please login first"); navigate('/sign-in'); return; }

    setIsSubmitting(true);
    const token = localStorage.getItem('token');

    const bookingData = {
      passengerName: booking.passengerName,
      flight: booking.flight._id,
      seat: booking.seat,
      cabinClass: booking.cabinClass,
      price: booking.flight.price,
      bookedBy: user._id,
      mealPreference: booking.mealPreference,
      isRoundTrip: booking.isRoundTrip,
      returnDate: booking.isRoundTrip ? booking.returnDate : null
    };

    try {
      await axios.post("http://localhost:3000/bookings/create", bookingData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Booking created successfully!");
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.err || "Failed to create booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <h1 style={styles.pageTitle}>flight / booking details</h1>
        <div style={styles.passengerBox}>
          <span style={styles.passengerLabel}>Passenger Name</span>
          <div style={styles.passengerInput}>
            <input
              name="passengerName"
              value={booking.passengerName}
              onChange={handleChange}
              placeholder="Full name"
              style={styles.nameInput}
            />
          </div>
        </div>
      </div>

      {booking.flight && (
        <div style={styles.flightBadge}>
          <span style={styles.flightAirline}>{booking.flight.airLine}</span>
          <span>{booking.flight.departure} ✈ {booking.flight.destination}</span>
          <span>Arrival: {booking.flight.arrival}</span>
          <span style={styles.flightPrice}>${booking.flight.price}</span>
        </div>
      )}

      <div style={styles.card}>
        <div style={styles.grid}>
          <div style={styles.leftCol}>
            <div style={styles.field}>
              <label style={styles.label}>Class :</label>
              <select name="cabinClass" value={booking.cabinClass} onChange={handleChange} style={styles.select}>
                <option value="EconomyClass">Economy Class</option>
                <option value="BusinessClass">Business Class</option>
                <option value="FirstClass">First Class</option>
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Meal Preference :</label>
              <select name="mealPreference" value={booking.mealPreference} onChange={handleChange} style={styles.select}>
                <option value="VegetarianMeal">Vegetarian Meal</option>
                <option value="ChickenMeal">Chicken Meal</option>
                <option value="BeefMeal">Beef Meal</option>
                <option value="Snacks">Snacks</option>
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Seat Number :</label>
              <input
                name="seat"
                value={booking.seat}
                onChange={handleChange}
                placeholder="e.g., 12A"
                style={styles.select}
              />
            </div>
          </div>

          <div style={styles.rightCol}>
            <div style={styles.rightField}>
              <span style={styles.rightLabel}>Is Direct Flight</span>
              <select name="isDirectFlight" value={booking.isDirectFlight} onChange={handleChange} style={styles.rightSelect}>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            <div style={styles.rightField}>
              <span style={styles.rightLabel}>Trip Type</span>
              <select name="isRoundTrip" value={booking.isRoundTrip} onChange={handleChange} style={styles.rightSelect}>
                <option value="false">One Way</option>
                <option value="true">Round Trip</option>
              </select>
            </div>

            {booking.isRoundTrip && (
              <div style={styles.rightField}>
                <span style={styles.rightLabel}>Return Date</span>
                <input
                  type="date"
                  name="returnDate"
                  value={booking.returnDate}
                  onChange={handleChange}
                  style={styles.rightSelect}
                />
              </div>
            )}

            <div style={styles.totalPrice}>
              <span>Total Price :</span>
              <span style={styles.priceBox}>
                ${(booking.flight?.price || 0) * (travellers.adults || 1)} $
              </span>
            </div>
          </div>
        </div>

        <div style={styles.buttons}>
          <button style={styles.deleteBtn} onClick={() => navigate(-1)}>Back</button>
          <button style={styles.confirmBtn} onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    padding: '30px 40px',
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: 'Arial, sans-serif'
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  pageTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1a1a2e'
  },
  passengerBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '6px'
  },
  passengerLabel: {
    fontSize: '0.9rem',
    color: '#64748b',
    fontWeight: 'bold'
  },
  passengerInput: {
    backgroundColor: '#dbeafe',
    borderRadius: '30px',
    padding: '10px 20px',
    minWidth: '220px'
  },
  nameInput: {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    fontSize: '1rem',
    width: '100%',
    color: '#1a1a2e'
  },
  flightBadge: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    padding: '12px 20px',
    borderRadius: '12px',
    marginBottom: '20px',
    color: '#1e40af',
    fontSize: '0.95rem'
  },
  flightAirline: {
    fontWeight: 'bold',
    fontSize: '1rem'
  },
  flightPrice: {
    marginLeft: 'auto',
    fontWeight: 'bold',
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '4px 14px',
    borderRadius: '20px'
  },
  card: {
    backgroundColor: '#e8edf2',
    borderRadius: '20px',
    padding: '30px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '30px',
    marginBottom: '30px'
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  rightCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontWeight: 'bold',
    fontSize: '1rem',
    color: '#1a1a2e'
  },
  select: {
    padding: '12px 16px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#d1d9e0',
    fontSize: '0.95rem',
    outline: 'none',
    cursor: 'pointer'
  },
  rightField: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#d1d9e0',
    borderRadius: '10px',
    padding: '12px 16px'
  },
  rightLabel: {
    fontWeight: 'bold',
    fontSize: '1rem',
    color: '#1a1a2e'
  },
  rightSelect: {
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: '0.95rem',
    outline: 'none',
    cursor: 'pointer',
    color: '#1a1a2e'
  },
  totalPrice: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '12px',
    marginTop: '10px',
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#1a1a2e'
  },
  priceBox: {
    backgroundColor: '#1d4ed8',
    color: 'white',
    padding: '6px 18px',
    borderRadius: '20px',
    fontWeight: 'bold'
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '15px'
  },
  deleteBtn: {
    flex: 1,
    padding: '14px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  confirmBtn: {
    flex: 1,
    padding: '14px',
    backgroundColor: '#1d4ed8',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};

export default BookingDetails;