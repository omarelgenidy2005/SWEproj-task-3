import React, { useEffect, useState } from 'react';
import { getAllEventsForAdmin, updateEventStatus } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaTag, FaClock } from 'react-icons/fa';
import NavBar from '../common/NavBar';

const AdminEventsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (user === null) return;

    if (!user || user.role !== 'System Admin') {
      navigate('/');
      return;
    }

    fetchEvents();
  }, [user, navigate]);

  const fetchEvents = async () => {
    try {
      const res = await getAllEventsForAdmin();
      setEvents(res.data);
    } catch (err) {
      console.error('Failed to load events:', err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateEventStatus(id, newStatus);
      setEvents(prev =>
        prev.map(e => (e._id === id ? { ...e, status: newStatus } : e))
      );
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const filteredEvents = filter === 'all'
    ? events
    : events.filter(e => e.status === filter);

  if (user === null) return <p style={styles.loading}>Loading...</p>;

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#1FCBB5';
      case 'declined': return '#dc3545';
      default: return '#ffc107';
    }
  };

  return (
    <>
      <NavBar />
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.leftSection}>
            <div style={styles.patternOverlay}></div>
            <div style={styles.decorativeShape}>
              <div style={styles.logo}>
                <span style={styles.logoText}>mate</span>
                <span style={styles.logoNumber}>7</span>
                <span style={styles.logoText}>gez</span>
              </div>
              <p style={styles.tagline}>Event Management Dashboard</p>
            </div>
          </div>
          <div style={styles.rightSection}>
            <div style={styles.contentContainer}>
              <div style={styles.header}>
                <h2 style={styles.title}>Event Management</h2>
                <div style={styles.filterContainer}>
                  <select 
                    value={filter} 
                    onChange={(e) => setFilter(e.target.value)}
                    style={styles.select}
                  >
                    <option value="all">All Events</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="declined">Declined</option>
                  </select>
                </div>
              </div>

              {filteredEvents.length === 0 ? (
                <p style={styles.noEvents}>No events available.</p>
              ) : (
                <div style={styles.eventList}>
                  {filteredEvents.map(event => (
                    <div key={event._id} style={styles.eventCard}>
                      <div style={styles.eventHeader}>
                        <h3 style={styles.eventTitle}>{event.title}</h3>
                        <span style={{
                          ...styles.statusBadge,
                          backgroundColor: getStatusColor(event.status) + '20',
                          color: getStatusColor(event.status)
                        }}>
                          {event.status}
                        </span>
                      </div>
                      
                      <div style={styles.eventDetails}>
                        <div style={styles.detailRow}>
                          <FaCalendarAlt style={styles.icon} />
                          <span>{new Date(event.Date).toLocaleDateString()}</span>
                        </div>
                        <div style={styles.detailRow}>
                          <FaClock style={styles.icon} />
                          <span>{new Date(event.Date).toLocaleTimeString()}</span>
                        </div>
                        <div style={styles.detailRow}>
                          <FaMapMarkerAlt style={styles.icon} />
                          <span>{event.location}</span>
                        </div>
                        <div style={styles.detailRow}>
                          <FaTag style={styles.icon} />
                          <span>{event.category}</span>
                        </div>
                      </div>

                      <div style={styles.buttonGroup}>
                        <button
                          onClick={() => handleStatusChange(event._id, 'approved')}
                          style={{
                            ...styles.button,
                            backgroundColor: '#1FCBB5',
                            opacity: event.status === 'approved' ? 0.6 : 1
                          }}
                          disabled={event.status === 'approved'}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusChange(event._id, 'declined')}
                          style={{
                            ...styles.button,
                            backgroundColor: '#dc3545',
                            opacity: event.status === 'declined' ? 0.6 : 1
                          }}
                          disabled={event.status === 'declined'}
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'center',
    overflow: 'hidden',
    paddingTop: '60px',
  },
  container: {
    display: 'flex',
    width: '100%',
    backgroundColor: '#ffffff',
  },
  leftSection: {
    flex: '0.3',
    backgroundColor: '#1FCBB5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    position: 'relative',
    overflow: 'hidden',
  },
  patternOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    background: `
      linear-gradient(45deg, transparent 45%, #fff 45%, #fff 55%, transparent 55%),
      linear-gradient(-45deg, transparent 45%, #fff 45%, #fff 55%, transparent 55%),
      linear-gradient(135deg, transparent 45%, #fff 45%, #fff 55%, transparent 55%),
      linear-gradient(-135deg, transparent 45%, #fff 45%, #fff 55%, transparent 55%)
    `,
    backgroundSize: '40px 40px',
    backgroundPosition: '0 0, 20px 0, 0 20px, 20px 20px',
    transform: 'rotate(15deg) scale(2)',
    pointerEvents: 'none',
  },
  decorativeShape: {
    textAlign: 'center',
    color: '#ffffff',
    position: 'relative',
    zIndex: 1,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '3rem',
    fontWeight: '600',
    marginBottom: '20px',
    letterSpacing: '-0.02em',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  logoText: {
    color: '#4A4A4A',
    textTransform: 'lowercase',
    fontWeight: '600',
  },
  logoNumber: {
    color: '#ffffff',
    margin: '0 1px',
    fontWeight: '600',
  },
  tagline: {
    fontSize: '1.2rem',
    opacity: '1',
    color: '#ffffff',
    fontWeight: '500',
    textShadow: '0 1px 2px rgba(0,0,0,0.1)',
    lineHeight: '1.4',
  },
  rightSection: {
    flex: '0.7',
    padding: '40px',
    backgroundColor: '#f8fafc',
    overflowY: 'auto',
    height: '100vh',
  },
  contentContainer: {
    maxWidth: '1000px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  title: {
    fontSize: '2rem',
    color: '#1e1e1e',
    margin: 0,
    fontWeight: '600',
  },
  filterContainer: {
    minWidth: '200px',
  },
  select: {
    width: '100%',
    padding: '12px',
    fontSize: '1rem',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    color: '#1e1e1e',
    cursor: 'pointer',
    outline: 'none',
  },
  eventList: {
    display: 'grid',
    gap: '20px',
  },
  eventCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    border: '1px solid #e2e8f0',
  },
  eventHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  eventTitle: {
    fontSize: '1.25rem',
    color: '#1e1e1e',
    margin: 0,
    fontWeight: '600',
  },
  statusBadge: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.875rem',
    fontWeight: '500',
  },
  eventDetails: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '15px',
    marginBottom: '20px',
  },
  detailRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#4a5568',
    fontSize: '0.9375rem',
  },
  icon: {
    color: '#1FCBB5',
    fontSize: '1rem',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
  },
  button: {
    flex: 1,
    padding: '10px',
    border: 'none',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '0.9375rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  loading: {
    color: '#1FCBB5',
    textAlign: 'center',
    padding: '20px',
    fontSize: '1rem',
  },
  noEvents: {
    textAlign: 'center',
    color: '#4a5568',
    fontSize: '1rem',
    padding: '40px',
  },
};

export default AdminEventsPage;
