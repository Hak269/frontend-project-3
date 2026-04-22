import React from 'react'
import './Homepage.css'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";

function Homepage() {

    const [flights, setFlights] = useState([]) 
    const navigate = useNavigate();

    async function getAllFlights(){
        try{
            const allFlights = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/flights`)
            setFlights(allFlights.data)
            console.log(allFlights)
        }
        catch(err){
            console.log(err)
        }
    }


    function handleSearch() {
      const filteredFlights = flights.filter(flight => {
        return flight.departure && flight.arrival && flight.airport && flight.destination;
      });

      navigate("/results", { state: { flights: filteredFlights } });
    }

    useEffect(()=>{
        getAllFlights()
    },[])
    

  const today = new Date().toISOString().split("T")[0];

  return (
    <div>
      <h1>Find Your Next Flight</h1>
      <div id='search-widget'>
        <div id='search-inner-widget'>
          <strong>Travellers</strong>
          <label htmlFor="adult">Adult</label>
          <input type="number" name="adult" id="adult" min={0} defaultValue={0}/>
          <label htmlFor="child">Child</label>
          <input type="number" name="child" id="child"  min={0} defaultValue={0}/>
        </div>
        <div id='from-to'>
          <div className='from-to-child'>
            <label htmlFor="from">From</label>
            <select name="from" id="from">
              {flights
                .filter((f, idx, arr) =>
                  arr.findIndex(item => item.airport === f.airport) === idx
                )
                .map(oneflight => (
                  <option key={oneflight._id} value={oneflight._id}>
                    {oneflight.airport}
                  </option>
                ))}
            </select>
          </div>
          <div className='from-to-child'>
            <label htmlFor="destination">Destination</label>
            <select name="destination" id="destination">
              {flights
                .filter((f, idx, arr) =>
                  arr.findIndex(item => item.airport === f.airport) === idx
                )
                .map(oneflight => (
                  <option key={oneflight._id} value={oneflight._id}>
                    {oneflight.airport}
                  </option>
              ))}
            </select>
          </div>
        </div>
        <div id='dep-arr'>
          <div className='dep-arr-child'>
            <label htmlFor="departure">Departure</label>
            <input type="date" name="departure" id="departure" min={today} />
          </div>
          <div className='dep-arr-child'>
            <label htmlFor="arrival">Arrival</label>
            <input type="date" name="arrival" id="arrival" min={today} />
          </div>
        </div>
        <button type="button" onClick={handleSearch}>Search Flights</button>
      </div>
    </div>
  )
}

export default Homepage