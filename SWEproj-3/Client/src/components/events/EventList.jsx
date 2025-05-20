import React, { useEffect, useState } from "react";
import { getAllEvents } from "../../api/api";
import EventCard from "./EventCard";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getAllEvents();
        const approvedEvents = response.data.filter(
          (event) => event.status === "approved"
        );
        setEvents(approvedEvents);
      } catch (err) {
        setError("Failed to fetch events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>{error}</p>;
  if (events.length === 0) return <p>No events available.</p>;

  return (
  <div style={{ padding: "40px" }}>
    <h2 style={{ color: "#fff", marginBottom: "20px" }}>Available Events</h2>
    <div style={{
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "20px",
    }}>
      {events.map((event) => {
        console.log("Event being rendered:", event);
        return <EventCard key={event._id} event={event} />;
      })}
    </div>
  </div>
);

};

export default EventList;
