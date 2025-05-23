import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  TextField,
  Button,
  InputAdornment
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
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
        status: 'approved'
      };

      if (editMode && id) {
        const res = await updateEvent(id, formattedData);
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

  return (
    <div className="event-form-container">
      <h2>{editMode ? 'Edit Event' : 'Create New Event'}</h2>
      <form onSubmit={handleSubmit} className="event-form">
        <TextField label="Title" name="title" value={formData.title} onChange={handleChange} error={!!formErrors.title} helperText={formErrors.title} required fullWidth margin="normal" />

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Event Date"
            value={formData.Date}
            onChange={(newValue) => setFormData({ ...formData, Date: newValue })}
            slotProps={{
              textField: {
                fullWidth: true,
                margin: 'normal',
                required: true,
                error: !!formErrors.Date,
                helperText: formErrors.Date
              }
            }}
          />
        </LocalizationProvider>

        <TextField label="Location" name="location" value={formData.location} onChange={handleChange} error={!!formErrors.location} helperText={formErrors.location} required fullWidth margin="normal" />
        <TextField label="Category" name="category" value={formData.category} onChange={handleChange} error={!!formErrors.category} helperText={formErrors.category} required fullWidth margin="normal" />
        <TextField label="Image URL" name="Image" value={formData.Image} onChange={handleChange} error={!!formErrors.Image} helperText={formErrors.Image} required fullWidth margin="normal" />

        <TextField label="Available Tickets" name="availableTickets" type="number" value={formData.availableTickets} onChange={handleChange} error={!!formErrors.availableTickets} helperText={formErrors.availableTickets} required fullWidth margin="normal" inputProps={{ min: 1 }} />

        <TextField label="Ticket Price" name="ticketpricing" type="number" value={formData.ticketpricing} onChange={handleChange} error={!!formErrors.ticketpricing} helperText={formErrors.ticketpricing} required fullWidth margin="normal" InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} inputProps={{ min: 0, step: "0.01" }} />

        <TextField label="Description" name="description" value={formData.description} onChange={handleChange} multiline rows={4} fullWidth margin="normal" />

        <Button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Saving...' : (editMode ? 'Update Event' : 'Create Event')}
        </Button>
      </form>
    </div>
  );
};

export default EventForm;
