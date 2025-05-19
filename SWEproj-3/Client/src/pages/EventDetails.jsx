import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";
import BookTicketForm from "../components/Booking/BookTicketForm";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        console.log("Fetched event: ", res.data);
        setEvent(res.data);
      } catch (error) {
        console.error("Failed to fetch event", error);
      }
    };
    fetchEvent();
  }, [id]);

  if (!event) return <p>Loading event...</p>;

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>{event.title}</h1>
      <p><strong>Date:</strong> {new Date(event.Date).toLocaleDateString()}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p><strong>Price:</strong> EGP {event.ticketpricing}</p>
      <p><strong>Total Tickets:</strong> {event.availableTickets}</p>

      {event.availableTickets > 0 ? (
        <BookTicketForm
          eventId={event._id}
          pricePerTicket={event.ticketpricing}
          availableTickets={event.availableTickets}
        />
      ) : (
        <p style={{ color: "red" }}>Sold Out</p>
      )}
    </div>
  );
};

export default EventDetails;
