import React from "react";
import { useNavigate } from "react-router-dom";

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!event._id || event._id.includes("<")) {
      console.warn("Invalid event ID:", event._id);
      return;
    }

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

const cardStyle = {
  border: "1px solid #ccc",
  borderRadius: "8px",
  padding: "1rem",
  margin: "0.5rem",
  cursor: "pointer",
  backgroundColor: "#f9f9f9",
};

export default EventCard;
