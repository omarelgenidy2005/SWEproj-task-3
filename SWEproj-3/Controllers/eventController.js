const Event = require("../Models/eventsModel");

const eventController = {
  getAllEvents: async (req, res) => {
    try {
      const events = await Event.find({ status: "approved" }).populate("organizer", "name email");
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getAllEventsForAdmin: async (req, res) => {
    try {
      const events = await Event.find().populate("organizer", "name email");
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getEventById: async (req, res) => {
    try {
      const event = await Event.findById(req.params.id).populate("organizer", "name email");
      if (!event) return res.status(404).json({ msg: "Event not found" });
      res.status(200).json(event);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },

  createEvent: async (req, res) => {
    try {
      const newEvent = await Event.create({ ...req.body, organizer: req.user.id, status: "pending" });
      res.status(201).json(newEvent);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateEvent: async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) return res.status(404).json({ msg: "Event not found" });
      if (event.organizer.toString() !== req.user.id && req.user.role !== "System Admin") {
        return res.status(403).json({ msg: "Unauthorized" });
      }
      const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.status(200).json(updated);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteEvent: async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) return res.status(404).json({ msg: "Event not found" });
      if (event.organizer.toString() !== req.user.id && req.user.role !== "System Admin") {
        return res.status(403).json({ msg: "Unauthorized" });
      }
      await event.deleteOne();
      res.status(200).json({ msg: "Event deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getOrganizerEvents: async (req, res) => {
    try {
      const events = await Event.find({ organizer: req.user.id });
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },

  getEventAnalytics: async (req, res) => {
    try {
      const events = await Event.find({ organizer: req.user.id }).select("title status ticketsBooked availableTickets");
      const analytics = events.map(event => {
        const total = event.ticketsBooked + event.availableTickets;
        return {
          eventId: event._id,
          title: event.title,
          status: event.status,
          ticketsBooked: event.ticketsBooked,
          availableTickets: event.availableTickets,
          bookingPercentage: total > 0 ? Math.round((event.ticketsBooked / total) * 100) : 0
        };
      });
      res.status(200).json(analytics);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateEventStatus: async (req, res) => {
    try {
      const { status } = req.body;
      if (!["approved", "pending", "declined"].includes(status)) {
        return res.status(400).json({ msg: "Invalid status" });
      }
      const updated = await Event.findByIdAndUpdate(req.params.id, { status }, { new: true });
      res.status(200).json(updated);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = eventController;
