const Event = require("../Models/eventsModel");

const eventController = {
  //  Get all approved events (Public)
  getAllEvents: async (req, res) => {
    try {
      const events = await Event.find({ status: "approved" })
        .populate("organizer", "name email");
      
      res.status(200).json(events);
    } catch (error) {
      console.error("GET ALL EVENTS ERROR:", error);
      res.status(500).json({ message: error.message });
    }
  },
  

  getAllEventsForAdmin: async (req, res) => {
    try {
      // Check if the user role is System Admin
      if ( req.user.role !== "System Admin") {
        return res.status(403).json({ msg: "Only System Admins can view all events" });
      }
  
      // Fetch all events regardless of their status
      const events = await Event.find()
        .populate("organizer", "name email");
  
      res.status(200).json(events);
    } catch (error) {
      console.error("GET ALL EVENTS (System Admin) ERROR:", error);
      res.status(500).json({ message: error.message });
    }
  },
  

 // Get single event (Public)
// Updated Public Version
getEventById: async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("organizer", "name email");

    if (!event) return res.status(404).json({ msg: "Event not found" });

   res.status(200).json(event);

  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ message: "Server error" });
  }
},

  //  Create event (Organizer only)
  createEvent: async (req, res) => {
    try {
      if (req.user.role !== "Organizer") {
        return res.status(403).json({ msg: "Only organizers can create events" });
      }

      const newEvent = await Event.create({
        ...req.body,
        organizer: req.user.id,
        status: "pending" 
      });

      res.status(201).json(newEvent);
    } catch (error) {
      console.error("CREATE EVENT ERROR:", error);
      res.status(500).json({ message: error.message });
    }
  },

  //  Update event (Organizer or System Admin)
  updateEvent: async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) return res.status(404).json({ msg: "Event not found" });

      // Authorization check
      if (req.user.role !== "System Admin" && req.user.id !== event.organizer.toString()) {
        return res.status(403).json({ msg: "Not authorized to update this event" });
      }

      if (req.user.role === "organizer") {
        const { date, location, tickets, description } = req.body;
        const updates = {};
        if (date) updates.date = date;
        if (location) updates.location = location;
        if (tickets) updates.tickets = tickets;
        if (description) updates.description = description;

        const updatedEvent = await Event.findByIdAndUpdate(
          req.params.id,
          updates,
          { new: true }
        );
        return res.status(200).json(updatedEvent);
      }

      const updatedEvent = await Event.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      res.status(200).json(updatedEvent);
    } catch (error) {
      console.error("UPDATE EVENT ERROR:", error);
      res.status(500).json({ message: error.message });
    }
  },

// Delete event (Organizer or System Admin)
deleteEvent: async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }

    const isOrganizer = event.organizer.toString() === req.user.id;
    const isAdmin = req.user.role && req.user.role.toLowerCase() === "system admin";

    if (!isAdmin && !isOrganizer) {
      return res.status(403).json({ msg: "Not authorized to delete this event" });
    }

    await event.deleteOne();
    res.status(200).json({ msg: "Event deleted successfully" });
  } catch (error) {
    console.error("DELETE EVENT ERROR:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
},



  getEventAnalytics: async (req, res) => {
    try {
      if (req.user.role !== "organizer") {
        return res.status(403).json({ msg: "Only organizers can view analytics" });
      }

      const events = await Event.find({ organizer: req.user.id })
        .select("title tickets ticketsBooked status");

      const analytics = events.map(event => ({
        eventId: event._id,
        title: event.title,
        status: event.status,
        bookingPercentage: Math.round((event.ticketsBooked / event.tickets) * 100),
        ticketsAvailable: event.tickets - event.ticketsBooked
      }));

      res.status(200).json(analytics);
    } catch (error) {
      console.error("ANALYTICS ERROR:", error);
      res.status(500).json({ message: error.message });
    }
  },

  updateEventStatus: async (req, res) => {
    try {
      if (req.user.role !== "System Admin") {
        return res.status(403).json({ msg: "Only System Admins can change event status" });
      }

      const { status } = req.body;
      if (!["approved", "pending", "declined"].includes(status)) {
        return res.status(400).json({ msg: "Invalid status value" });
      }

      const updatedEvent = await Event.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

      res.status(200).json(updatedEvent);
    } catch (error) {
      console.error("STATUS UPDATE ERROR:", error);
      res.status(500).json({ message: error.message });
    }
  } ,
  getOrganizerEvents: async (req, res) => {
    try {
      // Get all events where the organizer is the currently logged-in user
      const events = await Event.find({ organizer: req.user.id });
  
      res.status(200).json(events);
    } catch (error) {
      console.error("Error fetching organizer's events:", error);
      res.status(500).json({ message: "Server error" });
    }
  },


  getEventAnalytics: async (req, res) => {
    try {
      // Ensure only organizers access this
      if (req.user.role !== "Organizer") {
        return res.status(403).json({ message: "Access denied. Organizers only." });
      }
  
      const events = await Event.find({ organizer: req.user.id })
        .select("title status ticketsBooked availableTickets");
  
      const analytics = events.map(event => {
        const totalTickets = event.ticketsBooked + event.availableTickets;
        const bookingPercentage = totalTickets > 0 
          ? Math.round((event.ticketsBooked / totalTickets) * 100)
          : 0;
  
        return {
          eventId: event._id,
          title: event.title,
          status: event.status,
          ticketsBooked: event.ticketsBooked,
          availableTickets: event.availableTickets,
          bookingPercentage: bookingPercentage
        };
      });
  
      res.status(200).json(analytics);
    } catch (error) {
      console.error("Error generating analytics:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
  
  
};






module.exports = eventController;