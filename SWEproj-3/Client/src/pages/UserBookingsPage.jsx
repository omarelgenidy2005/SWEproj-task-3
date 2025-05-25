import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/common/NavBar";

const UserBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/v1/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/v1/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Booking canceled!");
      fetchBookings(); // Refresh after cancel
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <>
      <NavBar />
      <div style={styles.container}>
        <h1>Your Bookings</h1>

        {loading ? (
          <p>Loading...</p>
        ) : bookings.length === 0 ? (
          <p>You have no bookings yet.</p>
        ) : (
          <ul style={styles.list}>
            {bookings.map((booking) => (
              <li key={booking._id} style={styles.card}>
                <h2>{booking.event?.title}</h2>
                <p>
                  <strong>Tickets:</strong> {booking.ticketsBooked}
                </p>
                <p>
                  <strong>Total Price:</strong> EGP {booking.totalPrice}
                </p>
                <p>
                  <strong>Status:</strong> {booking.status}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(booking.event?.Date).toLocaleDateString()}
                </p>
                {booking.status === "confirmed" && (
                  <button
                    style={styles.cancelBtn}
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
    </>
  );
};

const styles = {
  container: {
    maxWidth: "700px",
    margin: "5rem auto 2rem auto",
    padding: "2rem",
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: "1rem",
    marginBottom: "1rem",
    borderRadius: "8px",
  },
  cancelBtn: {
    backgroundColor: "#e53e3e",
    color: "#fff",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "0.5rem",
  },
};

export default UserBookingsPage;
