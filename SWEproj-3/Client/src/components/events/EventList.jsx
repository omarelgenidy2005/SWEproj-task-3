import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getAllEvents } from "../../api/api";
import EventCard from "./EventCard";
import "./EventList.css";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();

  const fetchEvents = async () => {
    setLoading(true); // reset loading state every time we refetch
    try {
      const response = await getAllEvents();

      // Optional: log to debug backend results
      console.log("Fetched events:", response.data);

      // ✅ Filter only approved events
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
    fetchEvents(); // runs whenever we navigate to this route
  }, [location]);

  if (loading) return <div className="loading-message">Loading events...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (events.length === 0) return <div className="no-events-message">No events available.</div>;

  return (
    <div className="event-list">
      <h2 className="event-list-title">Available Events</h2>
      <div className="event-grid">
        {events.map((event) => (
          <EventCard key={event._id} event={event} showEdit={false} />
        ))}
      </div>
    </div>
  );
};

export default EventList;
