import { useState, useEffect } from "react";
import axios from "axios";
import { Link, Route, useParams } from "react-router";

function SearchFlights(){
    const [flights, setFlights ] = useState([]);
    const {airport, destination} = useParams();

    async function getSearchFlights() {
       try{
        const allSearchFlights = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/flights/${airport}/${destination}`) 
        setFlights(allSearchFlights.data);
       }
       catch(err){
        console.log(err)
       }
    }

    useEffect(()=>{
        getSearchFlights()
    },[airport,destination])


    return(
        <>
        <h1>Flights from {airport} To {destination}</h1>
        {flights.map((oneFlight)=>{
   return <div key={oneFlight._id}>
                <h2>{oneFlight.airLine}</h2>

                <p>Departure Time: <b>{oneFlight.departure}</b></p>
                <p>Arrival Time: <b>{oneFlight.arrival}</b></p>

                <p>Price: ${oneFlight.price}</p>
                <Link to={`/flights/${oneFlight._id}`} >Select Flight</Link>    
            </div>

        })}
           {flights.length===0 &&  <h2>No Flights available for this Route </h2> }
        </>
    )
}

export default SearchFlights
