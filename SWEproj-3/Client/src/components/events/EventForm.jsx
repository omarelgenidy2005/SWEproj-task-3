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
    date: null,
    location: '',
    ticketCount: '',
    price: '',
    description: ''
  });

  // Redirect if not logged in as Organizer
  useEffect(() => {
    if (!user || user.role !== 'Organizer') {
      toast.error('You must be logged in as an organizer');
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch event data if in edit mode
  useEffect(() => {
    const fetchEventData = async () => {
      if (editMode && id) {
        try {
          setLoading(true);
          const response = await getEventById(id);
          const data = response.data;

          setFormData({
            title: data.title || '',
            date: data.date ? new Date(data.date) : null,
            location: data.location || '',
            ticketCount: data.ticketCount?.toString() || '',
            price: data.price?.toString() || '',
            description: data.description || ''
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
    if (!formData.date) errors.date = 'Date is required';
    if (!formData.location) errors.location = 'Location is required';
    if (!formData.ticketCount || Number(formData.ticketCount) <= 0)
      errors.ticketCount = 'Must have at least 1 ticket';
    if (formData.price === '' || Number(formData.price) < 0)
      errors.price = 'Price cannot be negative';
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
        title: formData.title,
        date: formData.date ? formData.date.toISOString() : null,
        location: formData.location,
        ticketCount: Number(formData.ticketCount),
        price: Number(formData.price),
        description: formData.description,
        organizer: user._id,
        status: 'approved'
      };

      if (editMode && id) {
        const res = await updateEvent(id, formattedData);
        toast.success('Event updated successfully');
        console.log("✅ Updated Event:", res.data);
        navigate(`/events/${id}`);
      } else {
        const res = await createEvent(formattedData);
        toast.success('Event created successfully');
        console.log("✅ Created Event:", res.data);
        navigate(`/events/${res.data._id}`); // 👈 Redirect to event details
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

  if (loading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="event-form-container">
      <h2>{editMode ? 'Edit Event' : 'Create New Event'}</h2>
      <form onSubmit={handleSubmit} className="event-form">
        <TextField
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={!!formErrors.title}
          helperText={formErrors.title}
          required
          fullWidth
          margin="normal"
        />

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Event Date"
            value={formData.date}
            onChange={(newValue) => setFormData({ ...formData, date: newValue })}
            slotProps={{
              textField: {
                fullWidth: true,
                margin: 'normal',
                required: true,
                error: !!formErrors.date,
                helperText: formErrors.date
              }
            }}
          />
        </LocalizationProvider>

        <TextField
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          error={!!formErrors.location}
          helperText={formErrors.location}
          required
          fullWidth
          margin="normal"
        />

        <TextField
          label="Ticket Count"
          name="ticketCount"
          type="number"
          value={formData.ticketCount}
          onChange={handleChange}
          error={!!formErrors.ticketCount}
          helperText={formErrors.ticketCount}
          required
          fullWidth
          margin="normal"
          inputProps={{ min: 1 }}
        />

        <TextField
          label="Price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          error={!!formErrors.price}
          helperText={formErrors.price}
          required
          fullWidth
          margin="normal"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>
          }}
          inputProps={{ min: 0, step: "0.01" }}
        />

        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={4}
          fullWidth
          margin="normal"
        />

        <Button
          type="submit"
          className="submit-button"
          disabled={loading}
        >
          {loading ? 'Saving...' : (editMode ? 'Update Event' : 'Create Event')}
        </Button>
      </form>
    </div>
  );
};

export default EventForm;
