import { useState, useEffect } from "react"
import { Link } from "react-router"
import { fetchAllFlights } from "../../services/flightServices"

function AllFlights() {
    const [flights, setFlights] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    async function getAllFlights() {
        try {
            setLoading(true)
            const allFlights = await fetchAllFlights()
            setFlights(allFlights || [])
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAllFlights()
    }, [])

    if (loading) return <div>Loading flights...</div>
    if (error) return <div>Error: {error}</div>

    return (
        <div>
            <h1>All Flights</h1>
            {flights.map((oneFlight) => (
                <div key={oneFlight._id}>
                    <h2>Flight Number: {oneFlight.flightNumber}</h2>
                    <h2>Airline: {oneFlight.airLine}</h2>
                    <p>From: {oneFlight.departure} → To: {oneFlight.destination}</p>
                    <p>Arrival: {oneFlight.arrival}</p>
                    <p>Price: ${oneFlight.price}</p>
                    <p>Available Seats: {oneFlight.availableseats?.length || 0}</p>
                    <Link to={`/flights/${oneFlight._id}`}>See Details</Link>
                    <hr />
                </div>
            ))}
        </div>
    )
}

export default AllFlights