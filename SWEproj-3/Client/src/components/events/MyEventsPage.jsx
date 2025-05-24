import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyEvents, deleteEvent } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import { FaCalendarAlt, FaMapMarkerAlt, FaTag, FaEdit, FaTrash, FaChartLine, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { toast } from 'react-toastify';
import NavBar from '../common/NavBar';
import './MyEventsPage.css';

const MyEventsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const eventsGridRef = useRef(null);

  useEffect(() => {
    if (!user || user.role !== 'Organizer') {
      toast.error('Access denied');
      navigate('/');
      return;
    }

    const fetchEvents = async () => {
      try {
        const res = await getMyEvents();
        setEvents(res.data);
      } catch (err) {
        toast.error('Could not load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user, navigate]);

  const handleEdit = (id) => navigate(`/my-events/${id}/edit`);
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await deleteEvent(id);
      setEvents(events.filter(e => e._id !== id));
      toast.success("Event deleted successfully");
    } catch (err) {
      toast.error("Failed to delete event");
    }
  };

  const handleAnalytics = (id) => navigate(`/my-events/${id}/analytics`);

  const scrollEvents = (direction) => {
    if (eventsGridRef.current) {
      const scrollAmount = 330; // card width (300px) + gap (30px)
      const currentScroll = eventsGridRef.current.scrollLeft;
      const newScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      eventsGridRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      });
    }
  };

  if (loading) return (
    <>
      <NavBar />
      <div className="my-events-page">
        <div className="my-events-layout">
          <div className="left-section">
            <div className="pattern-overlay"></div>
            <div className="content-wrapper">
              <h1>Your Events</h1>
              <p className="tagline">Manage your events with ease</p>
            </div>
          </div>
          <div className="right-section">
            <div className="events-container">
              <div className="loading">Loading your events...</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <NavBar />
      <div className="my-events-page">
        <div className="my-events-layout">
          <div className="left-section">
            <div className="pattern-overlay"></div>
            <div className="content-wrapper">
              <h1>Your Events</h1>
              <p className="tagline">Manage your events with ease</p>
            </div>
          </div>
          <div className="right-section">
            <div className="events-container">
              {events.length === 0 ? (
                <div className="no-events">You haven't created any events yet.</div>
              ) : (
                <div className="events-wrapper">
                  <button 
                    className="nav-arrow nav-arrow-left" 
                    onClick={() => scrollEvents('left')}
                    aria-label="Previous events"
                  >
                    <FaChevronLeft />
                  </button>
                  <div className="events-grid" ref={eventsGridRef}>
                    {events.map(event => (
                      <div key={event._id} className="event-card">
                        <h3 className="event-title">{event.title}</h3>
                        <div className="event-info">
                          <div className="info-item">
                            <FaCalendarAlt className="info-icon" />
                            <span>{new Date(event.Date).toLocaleDateString()}</span>
                          </div>
                          <div className="info-item">
                            <FaMapMarkerAlt className="info-icon" />
                            <span>{event.location}</span>
                          </div>
                          <div className="info-item">
                            <FaTag className="info-icon" />
                            <span>{event.category}</span>
                          </div>
                        </div>
                        <div className="action-buttons">
                          <button 
                            className="action-button" 
                            onClick={() => handleEdit(event._id)}
                          >
                            <FaEdit /> Edit
                          </button>
                          <button 
                            className="action-button delete" 
                            onClick={() => handleDelete(event._id)}
                          >
                            <FaTrash /> Delete
                          </button>
                          <button 
                            className="action-button analytics" 
                            onClick={() => handleAnalytics(event._id)}
                          >
                            <FaChartLine /> Analytics
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button 
                    className="nav-arrow nav-arrow-right" 
                    onClick={() => scrollEvents('right')}
                    aria-label="Next events"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyEventsPage;
