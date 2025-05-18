import React from "react";
import { useNavigate } from "react-router-dom";

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/events/${event._id}`);
  };

  return (
    <div className="event-card" onClick={handleClick} style={cardStyle}>
      <h3>{event.title}</h3>
      <p><strong>Date:</strong> {new Date(event.Date).toLocaleDateString()}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p><strong>Price:</strong> ${event.ticketpricing}</p>
      <p><strong>Status:</strong> {event.availableTickets > 0 ? "Available" : "Sold Out"}</p>
    </div>
  );
};

// Simple inline styles (feel free to replace with CSS)
const cardStyle = {
  border: "1px solid #ccc",
  borderRadius: "8px",
  padding: "1rem",
  margin: "0.5rem",
  cursor: "pointer",
  backgroundColor: "#f9f9f9",
};

export default EventCard;
