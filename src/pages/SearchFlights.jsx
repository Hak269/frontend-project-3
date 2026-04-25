import  {useLocation, useParams} from 'react-router';
import { useNavigate } from "react-router-dom";

function SearchFlights({user}){
    const {state} = useLocation();
    const flights = state?.flights || [];
    const travellers = state?.travellers || {};
    const navigate = useNavigate();

    function handleSelectFlight(oneFlight) {
        console.log(user)
        if (!user) {
            alert("Please login first!");
        }
        else
        {
            navigate(`/booking`, { state: { flight: oneFlight, travellers } });

        }
    }

    return(
        <>
        <h1>Flights</h1>
        {flights.map((oneFlight)=>{
   return <div key={oneFlight._id}>
                <h2>{oneFlight.airLine}</h2>

                <p>Departure Time: <b>{oneFlight.departure}</b></p>
                <p>Arrival Time: <b>{oneFlight.arrival}</b></p>

                <p>Price: ${oneFlight.price}</p>
                <button type="button" onClick={() => handleSelectFlight(oneFlight)}>
                    Select Flight
                </button>
            </div>

        })}
           {flights.length===0 &&  <h2>No Flights available for this Route </h2> }
        </>
    )
}

export default SearchFlights
