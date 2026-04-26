import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './pages/Homepage';
import SignUp from './pages/Signup';
import SignIn from './pages/SignIn';
import Navbar from './components/Navbar';
import AllFlights from './pages/AllFlights';
import SearchFlights from './pages/SearchFlights';
import BookingDetails from './pages/BookingDetails';
import MyBooking from './pages/MyBooking';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const userInfo = JSON.parse(atob(token.split('.')[1])).payload;
        setUser(userInfo);
      } catch (err) {
        localStorage.removeItem('token');
        setUser(null);
      }
    }
  }, []);

  return (
    <div>
      <Navbar user={user} setUser={setUser} />

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/sign-up" element={!user ? <SignUp /> : <Navigate to='/'/>} />
        <Route path="/sign-in" element={!user ? <SignIn setUser={setUser} /> : <Navigate to='/'/>} />
        <Route path="/dashboard" element={user ? <Homepage user={user} /> : <Navigate to='/sign-in'/>} />
        <Route path='/flights' element={<AllFlights/>} />

       


        <Route
          path="/booking"
          element={<BookingDetails user={user} />}
        />

        <Route
          path="/filteredFlights"
          element={<SearchFlights user={user} />}
        />
       <Route 
            path="/my-bookings" 
            element={user ? <MyBooking user={user} /> : <Navigate to="/sign-in" />} 
/> 
      </Routes>
    </div>
  );
}

export default App;