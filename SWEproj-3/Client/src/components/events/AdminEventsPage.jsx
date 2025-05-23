import React, { useEffect, useState } from 'react';
import { getAllEventsForAdmin, updateEventStatus } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button, Select, MenuItem } from '@mui/material';
import './AdminEventsPage.css';

const AdminEventsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (user === null) return; // Wait for user to load

    if (!user || user.role !== 'System Admin') {
      navigate('/');
      return;
    }

    fetchEvents(); // Fetch events once user is validated
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

  if (user === null) return <p style={{ color: 'white' }}>Loading...</p>;

  return (
    <div className="admin-events-container">
      <h2>All Events</h2>

      <Select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{ marginBottom: '1rem', color: 'white', backgroundColor: '#333' }}
      >
        <MenuItem value="all">All</MenuItem>
        <MenuItem value="approved">Approved</MenuItem>
        <MenuItem value="pending">Pending</MenuItem>
        <MenuItem value="declined">Declined</MenuItem>
      </Select>

      {filteredEvents.length === 0 ? (
        <p style={{ color: 'white' }}>No events available.</p>
      ) : (
        <div className="admin-event-list">
          {filteredEvents.map(event => (
            <div key={event._id} className="admin-event-card">
              <h3>{event.title}</h3>
              <p><strong>Status:</strong> {event.status}</p>
              <p><strong>Date:</strong> {new Date(event.Date).toLocaleDateString()}</p>
              <p><strong>Location:</strong> {event.location}</p>

              <div className="status-buttons">
                <Button
                  onClick={() => handleStatusChange(event._id, 'approved')}
                  color="success"
                  variant="outlined"
                >
                  Approve
                </Button>
                <Button
                  onClick={() => handleStatusChange(event._id, 'declined')}
                  color="error"
                  variant="outlined"
                >
                  Decline
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminEventsPage;
