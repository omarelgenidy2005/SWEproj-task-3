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
    setLoading(true);
    try {
      const response = await getAllEvents();
      console.log("Fetched events:", response.data);

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

  if (loading) return <div className="loading-message">Loading events...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (events.length === 0) return <div className="no-events-message">No events available.</div>;

  return (
    <div style={{ padding: "40px" }}>
      <h2 style={{ color: "#fff", marginBottom: "20px" }}>Available Events</h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        {events.map((event) => {
          console.log("Event being rendered:", event);
          return <EventCard key={event._id} event={event} />;
        })}
      </div>
    </div>
  );
};

export default EventList;
