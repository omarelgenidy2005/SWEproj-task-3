import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createEvent, updateEvent, getEventById } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './EventForm.css';

const EventForm = ({ editMode = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [formErrors, setFormErrors] = useState({});

  const [formData, setFormData] = useState({
    title: '',
    Date: null,
    location: '',
    availableTickets: '',
    ticketpricing: '',
    category: '',
    description: '',
    Image: ''
  });

  useEffect(() => {
    if (!user || user.role !== 'Organizer') {
      toast.error('You must be logged in as an organizer');
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchEventData = async () => {
      if (editMode && id) {
        try {
          setLoading(true);
          const response = await getEventById(id);
          const data = response.data;

          setFormData({
            title: data.title || '',
            Date: data.Date ? new Date(data.Date) : null,
            location: data.location || '',
            availableTickets: data.availableTickets?.toString() || '',
            ticketpricing: data.ticketpricing?.toString() || '',
            category: data.category || '',
            description: data.description || '',
            Image: data.Image || ''
          });
        } catch (err) {
          toast.error('Failed to load event data');
          console.error('Error loading event:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [id, editMode]);

  const validateForm = () => {
    const errors = {};
    if (!formData.title) errors.title = 'Title is required';
    if (!formData.Date) errors.Date = 'Date is required';
    if (!formData.location) errors.location = 'Location is required';
    if (!formData.availableTickets || Number(formData.availableTickets) <= 0)
      errors.availableTickets = 'Must have at least 1 ticket';
    if (!formData.ticketpricing || Number(formData.ticketpricing) < 0)
      errors.ticketpricing = 'Price cannot be negative';
    if (!formData.category) errors.category = 'Category is required';
    if (!formData.Image) errors.Image = 'Image URL is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error('Please fix form errors');
      return;
    }

    try {
      setLoading(true);
      const formattedData = {
        ...formData,
        Date: formData.Date.toISOString(),
        availableTickets: Number(formData.availableTickets),
        ticketpricing: Number(formData.ticketpricing),
        organizer: user._id,
        status: 'pending'
      };

      if (editMode && id) {
        await updateEvent(id, formattedData);
        toast.success('Event updated successfully');
        navigate(`/events/${id}`);
      } else {
        const res = await createEvent(formattedData);
        toast.success('Event created successfully');
        navigate(`/events/${res.data._id}`);
      }
    } catch (err) {
      console.error('Error saving event:', err);
      toast.error(err.response?.data?.message || 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (e) => {
    const date = new Date(e.target.value);
    setFormData(prev => ({
      ...prev,
      Date: date
    }));
  };

  return (
    <div className="page-container">
      <div className="form-layout">
        <div className="left-section">
          <div className="pattern-overlay"></div>
          <div className="content-wrapper">
            <h1>{editMode ? 'Edit Event' : 'Create New Event'}</h1>
            <p className="tagline">Share your amazing event with the world</p>
          </div>
        </div>
        <div className="right-section">
          <div className="event-form-container">
            <form onSubmit={handleSubmit} className="event-form">
              <div className="form-group">
                <label>Event Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={formErrors.title ? 'error' : ''}
                  placeholder="Enter event title"
                />
                {formErrors.title && <span className="error-message">{formErrors.title}</span>}
              </div>

              <div className="form-group">
                <label>Event Date</label>
                <input
                  type="datetime-local"
                  name="Date"
                  value={formData.Date ? formData.Date.toISOString().slice(0, 16) : ''}
                  onChange={handleDateChange}
                  className={formErrors.Date ? 'error' : ''}
                />
                {formErrors.Date && <span className="error-message">{formErrors.Date}</span>}
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={formErrors.location ? 'error' : ''}
                  placeholder="Enter event location"
                />
                {formErrors.location && <span className="error-message">{formErrors.location}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Available Tickets</label>
                  <input
                    type="number"
                    name="availableTickets"
                    value={formData.availableTickets}
                    onChange={handleChange}
                    className={formErrors.availableTickets ? 'error' : ''}
                    min="1"
                    placeholder="Number of tickets"
                  />
                  {formErrors.availableTickets && <span className="error-message">{formErrors.availableTickets}</span>}
                </div>

                <div className="form-group">
                  <label>Ticket Price (EGP)</label>
                  <input
                    type="number"
                    name="ticketpricing"
                    value={formData.ticketpricing}
                    onChange={handleChange}
                    className={formErrors.ticketpricing ? 'error' : ''}
                    min="0"
                    step="0.01"
                    placeholder="Enter ticket price"
                  />
                  {formErrors.ticketpricing && <span className="error-message">{formErrors.ticketpricing}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={formErrors.category ? 'error' : ''}
                >
                  <option value="">Select a category</option>
                  <option value="Music">Music</option>
                  <option value="Sports">Sports</option>
                  <option value="Arts">Arts</option>
                  <option value="Technology">Technology</option>
                  <option value="Food">Food</option>
                  <option value="Business">Business</option>
                  <option value="Education">Education</option>
                  <option value="Other">Other</option>
                </select>
                {formErrors.category && <span className="error-message">{formErrors.category}</span>}
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  name="Image"
                  value={formData.Image}
                  onChange={handleChange}
                  className={formErrors.Image ? 'error' : ''}
                  placeholder="Enter image URL"
                />
                {formErrors.Image && <span className="error-message">{formErrors.Image}</span>}
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Enter event description"
                />
              </div>

              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? 'Saving...' : (editMode ? 'Update Event' : 'Create Event')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventForm;
