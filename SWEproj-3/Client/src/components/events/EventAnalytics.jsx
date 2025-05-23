import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getEventById } from '../../api/api';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import './EventAnalytics.css';

const EventAnalytics = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await getEventById(id);
        setEvent(response.data);
      } catch (err) {
        setError('Failed to load event data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) return <p style={{ color: 'white' }}>Loading analytics...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!event) return <p style={{ color: 'white' }}>No event found.</p>;

  const data = [
    {
      name: 'Booked',
      Booked: event.ticketsBooked || 0,
    },
    {
      name: 'Available',
      Available: event.availableTickets || 0,
    }
  ];

  return (
    <div className="analytics-container">
      <h2>Ticket Analytics for "{event.title}"</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Booked" stroke="#8884d8" strokeWidth={3} />
          <Line type="monotone" dataKey="Available" stroke="#82ca9d" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EventAnalytics;
