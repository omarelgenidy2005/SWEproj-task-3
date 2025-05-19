import {useState} from 'react';
import api from '../../api/api';
import {toast} from 'react-toastify';


const BookTicketForm = ({eventId, pricePerTicket, availableTickets})=>{
    const [quantity, setQuantity] = useState(1);

    const bookingHandler = async () =>{
        if(quantity > availableTickets){
            toast.error("Sorry, not enough tickets available");
            return;
        }

        try {
            await api.post("/bookings",{eventId, quantity});
            toast.success("Booking successful");
        } catch (error) {
            toast.error(error.response?.data?.msg || "Booking failed.");
        }
    };

  return (
  <div className="booking-form">
    <h2>Book Tickets</h2>

    <div className="form-group">
      <label htmlFor="quantity">Quantity:</label>
      <input
        type="number"
        id="quantity"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        min="1"
        max={availableTickets}
      />
    </div>

    <div className="total-price">
      Total Price: ${ (pricePerTicket * quantity).toFixed(2) }
    </div>

    <button
      onClick={bookingHandler}
      className="btn btn-primary"
      disabled={quantity < 1 || quantity > availableTickets}
    >
      Book Now
    </button>
  </div>
);
  
}

export default BookTicketForm;
