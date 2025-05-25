import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get('/api/v1/bookings', {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setBookings(res.data);
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <p>Loading your bookings...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Your Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <ul>
          {bookings.map((b) => (
            <li key={b._id}>
              Event: {b.event?.title || "Unknown"} — Quantity: {b.ticketsBooked} — Total: {b.ticketsBooked * b.event?.ticketpricing} EGP
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserBookingsPage;
