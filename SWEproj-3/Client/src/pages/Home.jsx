import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaTag, FaTicketAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { getAllEvents } from '../api/api';
import './Home.css';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const eventsGridRef = useRef(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await getAllEvents();
        setEvents(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading events:', err);
        setError('Unable to load events. Please try again later.');
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const handleGetStarted = () => {
    navigate('/register');
  };

  const scrollEvents = (direction) => {
    if (eventsGridRef.current) {
      const scrollAmount = 207.5; // card width (200px) + gap (7.5px)
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

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const formatPrice = (price) => {
    if (!price) return null;
    return `${price} EGP`;
  };

  if (loading) {
    return (
      <div className="home">
        <nav className="navbar">
          <div className="logo">
            <span className="logo-text">mate</span>
            <span className="logo-number">7</span>
            <span className="logo-text">gez</span>
          </div>
          <button className="login-btn" onClick={() => navigate('/login')}>Login</button>
        </nav>
        <div className="loading">Loading events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home">
        <nav className="navbar">
          <div className="logo">
            <span className="logo-text">mate</span>
            <span className="logo-number">7</span>
            <span className="logo-text">gez</span>
          </div>
          <button className="login-btn" onClick={() => navigate('/login')}>Login</button>
        </nav>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="home">
      <nav className="navbar">
        <div className="logo">
          <span className="logo-text">mate</span>
          <span className="logo-number">7</span>
          <span className="logo-text">gez</span>
        </div>
        <button className="login-btn" onClick={() => navigate('/login')}>Login</button>
      </nav>

      <div className="welcome-section">
        <div className="welcome-container">
          <h1>
            <span className="logo-text">mate</span>
            <span className="logo-number">7</span>
            <span className="logo-text">gez</span>
          </h1>
          <p>Discover and book events easily — anytime, anywhere.</p>
          <button className="get-started-btn" onClick={handleGetStarted}>
            Get Started
          </button>
        </div>
      </div>

      <div className="events-section">
        <h2>Available Events</h2>
        {events.length === 0 ? (
          <div className="no-events">No events available at the moment.</div>
        ) : (
          <div className="events-container">
            <button 
              className="nav-arrow nav-arrow-left" 
              onClick={() => scrollEvents('left')}
              aria-label="Previous events"
            >
              <FaChevronLeft />
            </button>
            <div className="events-grid" ref={eventsGridRef}>
              {events.map((event) => (
                <div 
                  key={event._id} 
                  className="event-card"
                  onClick={() => navigate(`/events/${event._id}`)}
                >
                  <div className="event-image">
                    <img 
                      src={event.image || '/default-event-image.jpg'} 
                      alt={event.title}
                      onError={(e) => {
                        e.target.src = '/default-event-image.jpg';
                      }}
                    />
                  </div>
                  <div className="event-info">
                    <h3>{event.title}</h3>
                    <div className="event-details">
                      {formatDate(event.date) && (
                        <p>
                          <FaCalendarAlt />
                          <span>{formatDate(event.date)}</span>
                        </p>
                      )}
                      {event.location && (
                        <p>
                          <FaMapMarkerAlt />
                          <span>{event.location}</span>
                        </p>
                      )}
                      {event.category && (
                        <p>
                          <FaTag />
                          <span>{event.category}</span>
                        </p>
                      )}
                      {event.status && (
                        <p>
                          <FaTicketAlt />
                          <span className={`status ${event.status.toLowerCase()}`}>
                            {event.status}
                          </span>
                        </p>
                      )}
                    </div>
                    {formatPrice(event.price) && (
                      <div className="event-price">
                        {formatPrice(event.price)}
                      </div>
                    )}
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
  );
};

export default Home; 