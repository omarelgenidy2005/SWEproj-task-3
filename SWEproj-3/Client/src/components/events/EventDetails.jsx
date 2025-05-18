import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEventById } from "../../api/api";
import { useAuth } from "../../context/AuthContext";

const EventDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await getEventById(id);
        setEvent(response.data);
      } catch (err) {
        setError("Event not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) return <p>Loading event details...</p>;
  if (error) return <p>{error}</p>;
  if (!event) return null;

  return (
    <div className="event-details" style={detailStyle}>
      <h2>{event.title}</h2>
      <img
        src={event.Image}
        alt={event.title}
        style={{ width: "100%", maxWidth: "500px", borderRadius: "10px" }}
      />
      <p><strong>Date:</strong> {new Date(event.Date).toLocaleDateString()}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p><strong>Category:</strong> {event.category}</p>
      <p><strong>Price:</strong> ${event.ticketpricing}</p>
      <p><strong>Description:</strong> {event.description}</p>
      <p><strong>Available Tickets:</strong> {event.availableTickets}</p>

      {user?.role === "customer" && (
        <div style={{ marginTop: "1rem" }}>
          {/* Placeholder for booking form (will be implemented in part e) */}
          <button disabled>Booking Coming Soon</button>
        </div>
      )}
    </div>
  );
};

const detailStyle = {
  padding: "1rem",
  maxWidth: "700px",
  margin: "auto",
  backgroundColor: "#fff",
  borderRadius: "8px",
  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
};

export default EventDetails;
