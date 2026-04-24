import React from 'react'
import './Homepage.css'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";

function Homepage() {

    const [flights, setFlights] = useState([]) 
    const navigate = useNavigate();

    const [from, setFrom] = useState("");
    const [destination, setDestination] = useState("");
    const [departure, setDeparture] = useState("");
    const [adult, setAdult] = useState(0);
    const [child, setChild] = useState(0);


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
      
      const filteredFlights = flights.filter(flight =>
        flight.airport === from &&
        flight.destination === destination &&
        flight.departure.slice(0, 10) === departure
      );

      console.log(flights[0].departure)
      console.log(departure)
      
      
      const travellers = {
        child: child,
        adult: adult
      }

      console.log(filteredFlights)
      console.log(travellers)

      navigate("/results", { state: { flights: filteredFlights, travellers: travellers } });
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
          <input type="number" name="adult" id="adult" min={0} value={adult} onChange={e => setAdult(e.target.value)}/>
          <label htmlFor="child">Child</label>
          <input type="number" name="child" id="child"  min={0} value={child} onChange={e => setChild(e.target.value)}/>
        </div>
        <div id='from-to'>
          <div className='from-to-child'>
            <label htmlFor="from">From</label>
            <select id="from" value={from} onChange={e => setFrom(e.target.value)}>
              <option value="" disabled>Select departure airport</option>
              {flights.filter((f, idx, arr) =>
                  arr.findIndex(item => item.airport === f.airport) === idx
                )
                .map(oneflight => (
                  <option key={oneflight._id} value={oneflight.airport}>
                    {oneflight.airport}
                  </option>
                ))}
            </select>
          </div>
          <div className='from-to-child'>
            <label htmlFor="destination">Destination</label>
            <select id="destination" value={destination} onChange={e => setDestination(e.target.value)}>
              <option value="" disabled>Select destination</option>
              {flights.filter((f, idx, arr) =>
                  arr.findIndex(item => item.airport === f.airport) === idx
                )
                .map(oneflight => (
                  <option key={oneflight._id} value={oneflight.airport}>
                    {oneflight.airport}
                  </option>
              ))}
            </select>
          </div>
        </div>
        <div id='dep-arr'>
          <div className='dep-arr-child'>
            <label htmlFor="departure">Departure</label>
            <input type="date" id="departure" min={today} value={departure} onChange={e => setDeparture(e.target.value)} />          
          </div>
        </div>
        <button type="button" onClick={handleSearch}   disabled={!from || !destination || !departure} >Search Flights</button>
      </div>
    </div>
  )
}

export default Homepage