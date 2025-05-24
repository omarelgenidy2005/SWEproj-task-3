import { useEffect, useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";

const UserBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
      toast.error(error.response?.data?.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");
     await api.delete(`/bookings/${bookingId}`, {
  headers: { Authorization: `Bearer ${token}` },
});
      toast.success("Booking canceled successfully!");
      fetchBookings(); // Refresh bookings
    } catch (error) {
      console.error("Cancel failed", error);
      toast.error(error.response?.data?.message || "Cancel failed");
    }
  };

  useEffect(() => {
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
            <li key={booking._id} style={{ marginBottom: "2rem" }}>
              <h2>{booking.event.title}</h2>
              <p><strong>Date:</strong> {new Date(booking.event.Date).toLocaleDateString()}</p>
              <p><strong>Location:</strong> {booking.event.location}</p>
              <p><strong>Price:</strong> EGP {booking.totalPrice}</p>
              <p><strong>Tickets:</strong> {booking.ticketsBooked}</p>
              <p><strong>Status:</strong> {booking.status}</p>

              {booking.status !== "canceled" && (
                <button
                  style={{ marginTop: "0.5rem", backgroundColor: "red", color: "white" }}
                  onClick={() => handleCancel(booking._id)}
                >
                  Cancel Booking
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserBookingsPage;
