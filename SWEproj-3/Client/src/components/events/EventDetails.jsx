import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEventById } from "../../api/api";
import { FaCalendarAlt, FaMapMarkerAlt, FaTag, FaTicketAlt, FaClock } from "react-icons/fa";
import "./EventDetails.css";
import NavBar from '../common/NavBar';
import BookTicketForm from "../bookings/BookTicketForm"; // ✅ path depends on your structure


const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await getEventById(id);
        setEvent(response.data);
      } catch (err) {
        setError("Failed to load event details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return null;
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return null;
    }
  };

  const formatPrice = (price) => {
    if (typeof price !== 'number') return 'N/A';
    return `${price.toLocaleString()} EGP`;
  };

  if (loading) return <div className="loading-message">Loading event details...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!event) return <div className="no-event-message">Event not found.</div>;

  return (
    <>
      <NavBar />
      <div className="event-details-container">
        <div className="event-left-section">
          <div className="event-hero">
            <img 
              src={event.Image || "/default-event-image.jpg"} 
              alt={event.title} 
              className="hero-image" 
            />
            <div className="hero-overlay">
              <h1 className="event-title">{event.title}</h1>
              <div className="event-meta">
                <span className="meta-item">
                  <FaCalendarAlt className="meta-icon" />
                  {formatDate(event.Date)}
                </span>
                <span className="meta-item">
                  <FaMapMarkerAlt className="meta-icon" />
                  {event.location}
                </span>
                <span className="meta-item">
                  <FaTag className="meta-icon" />
                  {event.category}
                </span>
              </div>
            </div>
          </div>
          <div className="event-description">
            <h3>About This Event</h3>
            <p>{event.description}</p>
          </div>
        </div>

        <div className="event-content">
          <div className="ticket-container">
            <div className="ticket-box">
              <div className="price-section">
                <span className="price-label">Ticket Price</span>
                <span className="price-amount">{formatPrice(event.ticketpricing)}</span>
                <span className="price-currency">per ticket</span>
              </div>

              <div className="ticket-info">
                <div className="info-row">
                  <FaTicketAlt className="info-icon" />
                  <span>
                    {event.availableTickets} {event.availableTickets === 1 ? 'ticket' : 'tickets'} available
                  </span>
                </div>
                <div className="info-row">
                  <FaTag className="info-icon" />
                  <span>{event.category}</span>
                </div>
                <div className="info-row">
                  <FaClock className="info-icon" />
                  <span>{formatDate(event.Date)}</span>
                </div>
                <div className="info-row">
                  <FaMapMarkerAlt className="info-icon" />
                  <span>{event.location}</span>
                </div>
              </div>

              {event.availableTickets > 0 ? (
  <BookTicketForm 
    eventId={event._id}
    pricePerTicket={event.ticketpricing}
    availableTickets={event.availableTickets}
  />
) : (
  <button className="primary-button" disabled>Sold Out</button>
)}

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventDetails;
