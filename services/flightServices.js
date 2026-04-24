import axios from "axios";

const baseUrl = import.meta.env.VITE_BACKEND_URL

async function fetchAllFlights() {
    try {
        console.log(`${baseUrl}flights`)
        const res = await axios.get(`${baseUrl}/flights`)
        return res.data
    } catch (err) {
        console.log(err)
        return []
    }
}

export { fetchAllFlights }