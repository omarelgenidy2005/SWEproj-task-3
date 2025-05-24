import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { toast } from "react-toastify";

const BookTicketForm = ({ eventId, pricePerTicket, availableTickets }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleBooking = async () => {
    if (quantity > availableTickets) {
      toast.error("Not enough tickets available");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to book tickets");
        setLoading(false);
        return;
      }

      const res = await api.post(
        "/bookings",
        {
          eventId,
          ticketsBooked: quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Booking API response:", res.data);
      toast.success("Booking successful!");

      // Optional: Reset quantity or redirect
      setQuantity(1);
      setTimeout(() => {
        navigate("/bookings");
      }, 1500); // Redirect after 1.5 seconds

    } catch (error) {
      console.error("Booking failed", error);
      toast.error(error.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "1rem" }}>
      <label htmlFor="quantity">Tickets:</label>
      <input
        id="quantity"
        type="number"
        value={quantity}
        min="1"
        max={availableTickets}
        onChange={(e) => setQuantity(Number(e.target.value))}
        style={{ marginLeft: "1rem", width: "60px" }}
      />
      <p>Total Price: <strong>EGP {quantity * pricePerTicket}</strong></p>
      <button onClick={handleBooking} disabled={loading}>
        {loading ? "Booking..." : "Book Now"}
      </button>
    </div>
  );
};

export default BookTicketForm;
