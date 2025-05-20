import { useEffect, useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";

const UserBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get("/bookings");
        setBookings(res.data);
      } catch (error) {
        console.error("Failed to fetch bookings", error);
        toast.error("Failed to fetch bookings"); // ✅ FIXED typo
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
              <p><strong>Price:</strong> EGP {booking.totalPrice}</p>
              <p><strong>Tickets:</strong> {booking.ticketsBooked}</p>
              <p><strong>Status:</strong> {booking.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserBookingsPage;
