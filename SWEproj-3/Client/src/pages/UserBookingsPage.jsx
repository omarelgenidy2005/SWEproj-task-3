import {useEffect,useState} from "react";
import api from "../api/api";
import {toast} from "react-toastify";

const UserBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchBookings = async () => {
        try {
            const res = await api.get("/bookings");
            console.log("Fetched bookings: ", res.data);
            setBookings(res.data);
        } catch (error) {
            console.error("Failed to fetch bookings", error);
            tooast.error("Failed to fetch bookings");
        } finally {
            setLoading(false);
        }
        };
        fetchBookings();
    }, []);
    
    if (loading) return <p>Loading bookings...</p>;
    
    return (
        <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
        <h1>Your Bookings</h1>
        {bookings.length === 0 ? (
            <p>No bookings found.</p>
        ) : (
            <ul>
            {bookings.map((booking) => (
                <li key={booking._id}>
                <h2>{booking.event.title}</h2>
                <p><strong>Date:</strong> {new Date(booking.event.Date).toLocaleDateString()}</p>
                <p><strong>Location:</strong> {booking.event.location}</p>
                <p><strong>Price:</strong> EGP {booking.event.ticketpricing}</p>
                <p><strong>Total Tickets:</strong> {booking.tickets}</p>
                </li>
            ))}
            </ul>
        )}
        </div>
    );
    }
    export default UserBookingsPage;
