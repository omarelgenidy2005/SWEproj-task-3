import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getAllEvents } from "../api/api"; // Updated import path
import "./Home.css";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await getAllEvents();
      const approvedEvents = response.data.filter(
        (event) => event.status === "approved"
      );
      setEvents(approvedEvents);
    } catch (err) {
      setError("Failed to fetch events. Please try again later.");
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [location]);

  return (
    <div className="home-container">
      {/* Top navigation bar */}
      <nav className="top-nav">
        <div className="nav-content">
          <Link to="/login" className="login-button">Log in</Link>
        </div>
      </nav>

      {/* Main welcome section */}
      <div className="welcome-section">
        <div className="welcome-card">
          <h1>Welcome to Mate7gez</h1>
          <p>Discover and book events easily — anytime, anywhere.</p>
        </div>
      </div>

      {/* Get started button */}
      <div className="get-started-container">
        <Link to="/register" className="get-started-button">Get Started</Link>
      </div>

      {/* Events list */}
      <div className="events-container">
        {loading && <div className="loading-message">Loading events...</div>}
        {error && <div className="error-message">{error}</div>}
        {!loading && !error && events.length === 0 && (
          <div className="no-events-message">No events available.</div>
        )}

        {events.map((event) => (
          <Link to={`/events/${event._id}`} key={event._id} className="event-card">
            <div className="event-header">
              <h3>{event.title}</h3>
              <span className="event-time">
                {new Date(event.date).toLocaleDateString()}
              </span>
            </div>
            <div className="event-details">
              {event.timeSlots && event.timeSlots.map((time, index) => (
                <span key={index} className="time-slot">
                  {new Date(`1970-01-01T${time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              ))}
              {event.duration && <span className="event-meta">{event.duration}</span>}
              {event.responseTime && <span className="event-meta">{event.responseTime}</span>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;