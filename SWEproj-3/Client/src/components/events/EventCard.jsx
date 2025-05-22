import React from "react";
import { useNavigate } from "react-router-dom";

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (!event || !event._id || typeof event._id !== "string") {
      console.warn("Invalid event object or ID:", event);
      return;
    }
    navigate(`/events/${event._id}`);
  };

  const formatDate = (date) => {
    try {
      return new Date(date).toLocaleDateString();
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="event-card" onClick={handleCardClick} style={cardStyle}>
      <h3>{event?.title || "Untitled Event"}</h3>
      <p><strong>Date:</strong> {event?.date ? formatDate(event.date) : "N/A"}</p>
      <p><strong>Location:</strong> {event?.location || "Unknown"}</p>
      <p><strong>Price:</strong> {typeof event?.price === "number" ? `$${event.price}` : "N/A"}</p>
      <p><strong>Status:</strong> {event?.ticketCount > 0 ? "Available" : "Sold Out"}</p>
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
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
};

export default EventCard;
