import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEventById } from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import "./EventDetails.css";
import { FaCalendarAlt, FaMapMarkerAlt, FaTag, FaTicketAlt, FaInfoCircle } from "react-icons/fa";

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
        console.error("Error fetching event:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return "N/A";
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;
  if (error) return <div className="error-container">{error}</div>;
  if (!event) return null;

  return (
    <div className="event-details-container">
      <div className="event-hero">
        <img src={event.Image || "/placeholder.jpg"} alt={event.title} className="hero-image" />
        <div className="hero-overlay">
          <h1 className="event-title">{event.title || "Untitled Event"}</h1>
          <div className="event-meta">
            <span className="meta-item">
              <FaCalendarAlt className="meta-icon" />
              {formatDate(event.Date)}
            </span>
            <span className="meta-item">
              <FaMapMarkerAlt className="meta-icon" />
              {event.location || "N/A"}
            </span>
          </div>
        </div>
      </div>

      <div className="event-content">
        <div className="event-main">
          <div className="event-description">
            <h3 className="section-title">
              <FaInfoCircle className="section-icon" />
              About This Event
            </h3>
            <p>{event.description || "No description provided."}</p>
          </div>
        </div>

        <div className="event-sidebar">
          <div className="ticket-box">
            <div className="price-section">
              <span className="price-label">Price</span>
              <span className="price-amount">
                {event.ticketpricing !== undefined && event.ticketpricing !== null
                  ? `$${parseFloat(event.ticketpricing).toFixed(2)}`
                  : "N/A"}
              </span>
              <span className="price-currency">USD</span>
            </div>

            <div className="ticket-info">
              <div className="info-row">
                <FaTicketAlt className="info-icon" />
                <span>
                  {event.availableTickets !== undefined
                    ? `${event.availableTickets} ticket${event.availableTickets !== 1 ? 's' : ''}`
                    : "N/A"}
                </span>
              </div>
              <div className="info-row">
                <FaTag className="info-icon" />
                <span>{event.category || "N/A"}</span>
              </div>
            </div>

            {user?.role === "customer" && (
              <button className="primary-button">
                Book Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
