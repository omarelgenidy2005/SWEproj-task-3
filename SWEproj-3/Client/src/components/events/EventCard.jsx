import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaMapMarkerAlt, FaTag, FaTicketAlt } from 'react-icons/fa';
import './EventCard.css';

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (!event || !event._id || typeof event._id !== "string") {
      console.warn("Invalid event object or ID:", event);
      return;
    }
    navigate(`/events/${event._id}`);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return null;
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return null;
    }
  };

  const formatPrice = (price) => {
    if (typeof price !== 'number') return null;
    return `${price.toLocaleString()} EGP`;
  };

  return (
    <div className="event-card-outer" style={styles.cardOuter} onClick={handleCardClick}>
      <div className="event-card-inner" style={styles.cardInner}>
        <div style={styles.imageContainer}>
          <img 
            src={event?.Image || '/default-event-image.jpg'} 
            alt={event?.title || 'Event'}
            style={styles.image}
            onError={(e) => {
              e.target.src = '/default-event-image.jpg';
            }}
          />
          {event?.ticketpricing !== undefined && formatPrice(event.ticketpricing) && (
            <div style={styles.priceTag}>
              {formatPrice(event.ticketpricing)}
            </div>
          )}
        </div>
        <div style={styles.contentContainer}>
          <h3 style={styles.title}>{event?.title || "Untitled Event"}</h3>
          
          <div style={styles.details}>
            {event?.Date && formatDate(event.Date) && (
              <div style={styles.detailItem}>
                <FaCalendarAlt style={styles.icon} />
                <span style={styles.detailText}>{formatDate(event.Date)}</span>
              </div>
            )}
            {event?.location && (
              <div style={styles.detailItem}>
                <FaMapMarkerAlt style={styles.icon} />
                <span style={styles.detailText}>{event.location}</span>
              </div>
            )}
            {event?.category && (
              <div style={styles.detailItem}>
                <FaTag style={styles.icon} />
                <span style={styles.detailText}>{event.category}</span>
              </div>
            )}
          </div>

          <div style={styles.ticketInfo}>
            <div style={styles.ticketCount}>
              <FaTicketAlt style={styles.icon} />
              <span style={styles.ticketText}>
                {event?.availableTickets || 0} Tickets Available
              </span>
            </div>
            <div style={styles.ticketStatus}>
              <span style={{
                ...styles.statusBadge,
                backgroundColor: event?.availableTickets > 0 ? '#e8fff7' : '#ffe8e8',
                color: event?.availableTickets > 0 ? '#1FCBB5' : '#dc3545',
              }}>
                {event?.availableTickets > 0 ? 'Available' : 'Sold Out'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  cardOuter: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '2px',
    cursor: 'pointer',
    border: '1px solid #1FCBB5',
    transition: 'all 0.3s ease',
  },
  cardInner: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  },
  imageContainer: {
    width: '100%',
    height: '120px',
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  priceTag: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    backgroundColor: '#1FCBB5',
    color: '#ffffff',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: '600',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  contentContainer: {
    padding: '16px',
  },
  title: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1e1e1e',
    marginBottom: '12px',
    fontFamily: 'Inter, sans-serif',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    lineHeight: '1.3',
    height: '2.8em',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '16px',
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  icon: {
    color: '#1FCBB5',
    fontSize: '0.9rem',
    flexShrink: 0,
  },
  detailText: {
    color: '#4A4A4A',
    fontSize: '0.85rem',
    fontWeight: '400',
  },
  ticketInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '12px',
    padding: '8px',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
  },
  ticketCount: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  ticketText: {
    color: '#4A4A4A',
    fontSize: '0.85rem',
    fontWeight: '500',
  },
  statusBadge: {
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '500',
  },
};

export default EventCard;
