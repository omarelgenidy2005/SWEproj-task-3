import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getAllEvents } from "../../api/api";
import EventCard from "./EventCard";
import NavBar from '../common/NavBar';
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

  if (loading) return (
    <>
      <NavBar />
      <div className="loading-message" style={styles.message}>Loading events...</div>
    </>
  );
  
  if (error) return (
    <>
      <NavBar />
      <div className="error-message" style={styles.message}>{error}</div>
    </>
  );
  
  if (events.length === 0) return (
    <>
      <NavBar />
      <div className="no-events-message" style={styles.message}>No events available.</div>
    </>
  );

  return (
    <>
      <NavBar />
      <div style={styles.pageContainer}>
        <div style={styles.contentWrapper}>
          <div style={styles.titleContainer}>
            <h2 style={styles.title}>Available Events</h2>
          </div>
          <div style={styles.eventsGrid}>
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

const styles = {
  pageContainer: {
    backgroundColor: '#ffffff',
    minHeight: '100vh',
    width: '100%',
    margin: 0,
    padding: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflowX: 'hidden',
    paddingTop: '60px', // Added to account for navbar
  },
  contentWrapper: {
    width: '100%',
    height: '100%',
    paddingTop: '20px',
  },
  titleContainer: {
    textAlign: 'center',
    marginBottom: '30px',
    width: '100%',
  },
  title: {
    color: '#1FCBB5',
    fontSize: '2.5rem',
    fontWeight: '600',
    margin: 0,
    fontFamily: 'Inter, sans-serif',
    position: 'relative',
    display: 'inline-block',
  },
  eventsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
    width: '100%',
    maxWidth: '1800px',
    margin: '0 auto',
    padding: '0 30px',
  },
  message: {
    position: 'absolute',
    top: '60px', // Added to account for navbar
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    fontSize: '1.2rem',
    color: '#4A4A4A',
  },
};

export default EventList;
