import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyEvents, deleteEvent } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@mui/material';
import { toast } from 'react-toastify';
import './MyEventsPage.css';

const MyEventsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

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
    if (!window.confirm("Confirm delete?")) return;
    try {
      await deleteEvent(id);
      setEvents(events.filter(e => e._id !== id));
      toast.success("Event deleted");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleAnalytics = (id) => navigate(`/my-events/${id}/analytics`);

  if (loading) return <p>Loading your events...</p>;

  return (
    <div className="my-events-container">
      <h2>Your Events</h2>
      {events.length === 0 ? (
        <h3>No events yet.</h3>
      ) : (
        <div className="my-events-list">
          {events.map(e => (
            <div key={e._id} className="my-event-card">
              <h3>{e.title}</h3>
              <p><strong>Date:</strong> {new Date(e.Date).toLocaleDateString()}</p>
              <p><strong>Location:</strong> {e.location}</p>
              <div className="action-buttons">
                <Button onClick={() => handleEdit(e._id)} variant="outlined">Edit</Button>
                <Button onClick={() => handleDelete(e._id)} variant="outlined" color="error">Delete</Button>
                <Button onClick={() => handleAnalytics(e._id)} variant="outlined" color="secondary">Analytics</Button> {/* ✅ NEW */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEventsPage;
