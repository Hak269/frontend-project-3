import  {useLocation, useParams} from 'react-router';
import { Link } from "react-router";

function SearchFlights(){
    const {state} = useLocation();
    const {airport, destination} = useParams();
    const flights = state?.flights || [];
   

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
