import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getEventById } from '../../api/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell
} from 'recharts';
import NavBar from '../common/NavBar';
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

  if (loading) return (
    <>
      <NavBar />
      <div className="analytics-page">
        <div className="analytics-layout">
          <div className="left-section">
            <div className="pattern-overlay"></div>
            <div className="content-wrapper">
              <h1>Event Analytics</h1>
              <p className="tagline">Track your event performance</p>
            </div>
          </div>
          <div className="right-section">
            <div className="loading">Loading analytics...</div>
          </div>
        </div>
      </div>
    </>
  );

  if (error) return (
    <>
      <NavBar />
      <div className="analytics-page">
        <div className="analytics-layout">
          <div className="left-section">
            <div className="pattern-overlay"></div>
            <div className="content-wrapper">
              <h1>Event Analytics</h1>
              <p className="tagline">Track your event performance</p>
            </div>
          </div>
          <div className="right-section">
            <div className="error">{error}</div>
          </div>
        </div>
      </div>
    </>
  );

  if (!event) return (
    <>
      <NavBar />
      <div className="analytics-page">
        <div className="analytics-layout">
          <div className="left-section">
            <div className="pattern-overlay"></div>
            <div className="content-wrapper">
              <h1>Event Analytics</h1>
              <p className="tagline">Track your event performance</p>
            </div>
          </div>
          <div className="right-section">
            <div className="error">No event found.</div>
          </div>
        </div>
      </div>
    </>
  );

  const ticketData = [
    {
      name: 'Booked',
      value: event.ticketsBooked || 0,
    },
    {
      name: 'Available',
      value: event.availableTickets || 0,
    }
  ];

  const COLORS = ['#1FCBB5', '#6366f1'];

  return (
    <>
      <NavBar />
      <div className="analytics-page">
        <div className="analytics-layout">
          <div className="left-section">
            <div className="pattern-overlay"></div>
            <div className="content-wrapper">
              <h1>Event Analytics</h1>
              <p className="tagline">Track your event performance</p>
            </div>
          </div>
          <div className="right-section">
            <div className="analytics-container">
              <div className="event-header">
                <h2>{event.title}</h2>
                <p className="event-subtitle">Ticket Distribution Analysis</p>
              </div>
              
              <div className="charts-grid">
                <div className="chart-card">
                  <h3>Ticket Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={ticketData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" stroke="#4a5568" />
                      <YAxis stroke="#4a5568" allowDecimals={false} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="value" fill="#1FCBB5" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-card">
                  <h3>Ticket Allocation</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={ticketData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {ticketData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventAnalytics;
