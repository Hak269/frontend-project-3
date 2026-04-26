import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { fetchAllFlights } from "../../services/flightServices"

function AllFlights() {
    const [flights, setFlights] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

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

    if (loading) return <div style={styles.center}>Loading flights...</div>
    if (error) return <div style={styles.center}>Error: {error}</div>

    return (
        <div style={styles.page}>
            <h1 style={styles.title}>All Flights</h1>
            <div style={styles.grid}>
                {flights.map((oneFlight) => (
                    <div key={oneFlight._id} style={styles.card}>
                        <div style={styles.cardHeader}>
                            <span style={styles.airline}>{oneFlight.airLine}</span>
                            <span style={styles.price}>${oneFlight.price}</span>
                        </div>

                        <div style={styles.route}>
                            <div style={styles.city}>
                                <span style={styles.cityLabel}>FROM</span>
                                <span style={styles.cityName}>{oneFlight.departure}</span>
                            </div>
                            <span style={styles.arrow}>✈</span>
                            <div style={styles.city}>
                                <span style={styles.cityLabel}>TO</span>
                                <span style={styles.cityName}>{oneFlight.destination}</span>
                            </div>
                        </div>

                        <div style={styles.info}>
                            <span>🕐 Arrival: {oneFlight.arrival}</span>
                            <span>💺 Seats: {oneFlight.availableseats?.length || 0}</span>
                        </div>

                        <button
                            style={styles.bookBtn}
                            onClick={() => navigate('/booking', {
                                state: {
                                    flight: oneFlight,
                                    travellers: { adults: 1 }
                                }
                            })}
                        >
                            Book Now
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

const styles = {
    page: {
        padding: '30px',
        backgroundColor: '#f0f4f8',
        minHeight: '100vh'
    },
    title: {
        textAlign: 'center',
        fontSize: '2rem',
        marginBottom: '30px',
        color: '#1a1a2e'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        transition: 'transform 0.2s',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    airline: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        color: '#1a1a2e'
    },
    price: {
        backgroundColor: '#3b82f6',
        color: 'white',
        padding: '4px 12px',
        borderRadius: '20px',
        fontWeight: 'bold'
    },
    route: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: '10px',
        padding: '12px'
    },
    city: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px'
    },
    cityLabel: {
        fontSize: '0.7rem',
        color: '#94a3b8',
        fontWeight: 'bold'
    },
    cityName: {
        fontSize: '1.1rem',
        fontWeight: 'bold',
        color: '#1a1a2e'
    },
    arrow: {
        fontSize: '1.5rem',
        color: '#3b82f6'
    },
    info: {
        display: 'flex',
        justifyContent: 'space-between',
        color: '#64748b',
        fontSize: '0.9rem'
    },
    bookBtn: {
        backgroundColor: '#1d4ed8',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        padding: '12px',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginTop: 'auto'
    },
    center: {
        textAlign: 'center',
        padding: '50px',
        fontSize: '1.2rem'
    }
}

export default AllFlights