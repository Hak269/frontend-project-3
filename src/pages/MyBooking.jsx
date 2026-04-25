import { useState, useEffect } from "react"
import axios from "axios"
import {  Link } from "react-router"

function MyBooking({ user }) {

  const [bookings, setBookings] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({
    passengerName:'',
    cabinClass:'',
    mealPreference:''
  })

  async function getAllBookings(){
    try{
      const token = localStorage.getItem('token')
      const allBookings = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/bookings`, {headers:{Authorization:`Bearer ${token}`}});
          
      const myData = allBookings.data.filter((b)=> b.bookedBy?._id === user?._id);
      setBookings(myData);
    }
    catch(err){
      console.log(err)
    }
  }
 
  async function deleteBooking(id) {
    try{
       const token = localStorage.getItem('token')
       await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/bookings/${id}`, {headers:{Authorization:`Bearer ${token}`}});
       getAllBookings();
    
    }
    catch(err){
      console.log(err)
    }
  }

  function updateBooking(booking){
    setIsEditing(booking._id)
    setFormData({
      passengerName: booking.passengerName,
      cabinClass: booking.cabinClass,
      mealPreference: booking.mealPreference
    })
  }
  function handleChange(event) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  async function handleUpdateSubmit(event, id) {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/bookings/${id}`, formData, { headers: { Authorization: `Bearer ${token}` }});
      setIsEditing(null);
      getAllBookings();
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(()=>{
    getAllBookings();
  },[])


  return (
    <>
        <h1>My Bookings</h1>

        {bookings.map((onebooking)=>{
          return <div key={onebooking._id}>

            {isEditing === onebooking._id ? (
              <form onSubmit={(event)=> handleUpdateSubmit(event, onebooking._id)}>
                <label htmlFor="passengerName">Passenger Name:</label>
                <input type="text" name="passengerName" value={formData.passengerName} onChange={handleChange} />

                <label htmlFor="cabinClass">CabinClass:</label>
                <select name="cabinClass" id="cabinClass" value={formData.cabinClass} onChange={handleChange}>
                  <option value="EconomyClass">Economy</option>
                  <option value="BusinessClass">Business</option>
                  <option value="FirstClass">FirstClass</option>
                </select>

                <label htmlFor="mealPreference">MealPreference:</label>
                <select name="mealPreference" value={formData.mealPreference} onChange={handleChange}>
                  <option value="ChickenMeal">Chicken</option>
                  <option value="BeefMeal">Beef</option>
                  <option value="VegetarianMeal">Vegetarian</option>
                </select>
                <button>Save Changes</button>
                <button onClick={()=> setIsEditing(null)}>Cancel</button>
              </form>
            ) : ( 
            <>
            <p>passenger: <b>{onebooking.passengerName}</b></p>
            <p>Airline: <b>{onebooking.flight?.airLine}</b></p>
            <p>Class: {onebooking.cabinClass}</p>

            {user?._id === (onebooking.bookedBy?._id || onebooking.bookedBy) ?  (<>
            
            <button onClick={()=> deleteBooking(onebooking._id)}>Delete</button>
            <button onClick={()=> updateBooking(onebooking)}>Edit</button>
            </>):<></>}
             </>
            )}
           

          </div>
        })}
        {bookings.length === 0 && <h2>No Bookings Available</h2>}
    </>
  )
}

export default MyBooking