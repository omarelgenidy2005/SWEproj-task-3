const Booking = require("../Models/bookingModel");
const Event = require("../Models/eventsModel");

const bookingController = {

    createBooking: async (req, res) => {
        try {
            const {eventId, ticketsBooked} = req.body;
            const allEvents = await Event.find();
            console.log("EVENTS IN DB:", allEvents);
            
            const event = await Event.findById(eventId);
            if (!event) {
                return res.status(404).json({ message: "Event not found" });
            }
            if (event.availableTickets < ticketsBooked) {
                return res.status(400).json({ message: "Not enough tickets available" });
            }

        const totalPrice = event.ticketpricing * ticketsBooked;

        const booking = await Booking.create({
            user: req.user.id,
            event: eventId,
            ticketsBooked,
            totalPrice,
            status: "confirmed",
        });
        event.availableTickets = event.availableTickets - ticketsBooked;
        await event.save();
    

        res.status(201).json({ message: "Booking created successfully", booking });
    } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).json({ message: "Internal server error" });
    }
},

    getBookingById: async(req, res) => {
       

        try {
            const booking = await Booking.findById(req.params.id).populate("event").populate("user", "name email");
            console.log("booking.user._id:", booking.user._id.toString());
            console.log("req.user.id:", req.user.id);
            if(!booking) {
                return res.status(404).json({message: "Booking not found"});
            }
            if(booking.user._id.toString() !== req.user.id.toString()) {
                return res.status(403).json({message: "You are not authorized to view this booking"});
            }
            res.status(200).json({message: "Booking retrieved successfully", booking});
        } catch (error) {
            console.error("Error retrieving booking:", error);
            res.status(500).json({message: "server error"});
        }
    },
    
    cancelBooking: async (req, res) => {
        try {
            const booking = await Booking.findById(req.params.id);
            if(!booking) return res.status(404).json({message: "Booking not found"});

            if(booking.user.toString()!== req.user.id.toString()){
                return res.status(403).json({message: "you are not authorized to cancel the booking selected"});
            }
            const event = await Event.findById(booking.event);
            if(event) {
                event.availableTickets = event.availableTickets + booking.ticketsBooked;
                await event.save();
            }
            booking.status = "canceled";
            await booking.save();
            res.status(200).json({message: "Booking canceled successfully", booking});

        }
        catch (error) {
            console.error("Error canceling booking:", error);
            res.status(500).json({message: "server error"});
        }



    },

    getUserBookings: async (req, res) => {
        try {
          const bookings = await Booking.find({ user: req.user.id })
            .populate("event", "title Date location ticketpricing status");
      
          res.status(200).json(bookings);
        } catch (error) {
          console.error("Error fetching user bookings:", error);
          res.status(500).json({ message: "Server error" });
        }
      }
      
};

module.exports = bookingController;