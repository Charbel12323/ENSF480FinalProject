import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Stripe initialization
const stripePromise = loadStripe("pk_test_51QQgDtDUKjAvOoW4QgoceBCEioyzYzcQ4Flmoe0AssDWfpdNOJrDjhCNhRSrQeapUmQrckPSrVmFYCiDkTRLNSHH00n5Czacfp"); // Replace with your Stripe Publishable Key

const PaymentForm = ({ totalCost, selectedSeats, onBookingConfirmed, userId }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handlePayment = async () => {
    try {
      // Step 1: Create Payment Intent
      const { data } = await axios.post("http://localhost:8080/api/payments/create-payment-intent", {
        amount: totalCost * 100, // Convert dollars to cents
        currency: "usd",
        userId: userId, // Pass the logged-in user ID
      });

      console.log("Client Secret Received:", data.clientSecret);

      // Step 2: Confirm Payment
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        console.error("Payment Error:", result.error.message);
        alert(`Payment failed: ${result.error.message}`);
      } else if (result.paymentIntent.status === "succeeded") {
        // Step 3: Confirm Booking
        await axios.post("http://localhost:8080/api/payments/confirm-booking", {
          userId: userId, // Logged-in user ID
          seatIds: selectedSeats,
        });
        onBookingConfirmed();
        alert("Payment successful! Booking confirmed.");
      }
    } catch (error) {
      console.error("Error during payment:", error);
      alert("An error occurred during payment. Please try again.");
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <CardElement
        className="p-4 bg-white rounded-md"
        options={{
          style: {
            base: {
              color: "#32325d",
              fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
              fontSmoothing: "antialiased",
              fontSize: "16px",
              "::placeholder": {
                color: "#aab7c4",
              },
            },
            invalid: {
              color: "#fa755a",
              iconColor: "#fa755a",
            },
          },
          hidePostalCode: false, // Ensure postal code field is included
        }}
      />
      <button
        className={`mt-4 w-full py-2 text-white rounded-lg font-bold ${totalCost > 0 ? "bg-yellow-500 hover:bg-yellow-600" : "bg-gray-500 cursor-not-allowed"
          }`}
        onClick={handlePayment}
        disabled={!stripe || totalCost <= 0}
      >
        Pay ${totalCost.toFixed(2)}
      </button>
    </div>
  );
};

const CinemaSeatMap = () => {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [userId] = useState(1); // Replace with the actual logged-in user's ID
  const navigate = useNavigate();

  const seatPrice = 12; // Price per seat

  // Fetch seats from the backend
  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const { data } = await axios.get("http://localhost:8080/api/seats/1"); // Replace 1 with your showtime ID
        setSeats(data);
      } catch (error) {
        console.error("Error fetching seats:", error);
      }
    };

    fetchSeats();
  }, []);

  // Toggle seat selection
  const toggleSeat = (seatId, isReserved) => {
    if (isReserved) {
      alert("This seat is already reserved.");
      return;
    }
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId]
    );
  };

  const totalCost = selectedSeats.length * seatPrice;

  return (
    <Elements stripe={stripePromise}>
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <button className="mb-4 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg" onClick={() => navigate("/")}>
          Back to Main
        </button>

        <div className="flex gap-8">
          {/* Seat Map */}
          <div className="flex-grow">
            <div className="w-full bg-gray-700 text-center py-2 rounded-lg mb-4">SCREEN</div>
            <div className="grid grid-cols-8 gap-2">
              {seats.map((seat) => (
                <button
                  key={seat.seatId}
                  className={`w-8 h-8 rounded-lg ${selectedSeats.includes(seat.seatId)
                    ? "bg-blue-500"
                    : seat.isReserved
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-green-500"
                    }`}
                  onClick={() => toggleSeat(seat.seatId, seat.isReserved)}
                />
              ))}
            </div>
          </div>

          {/* Payment Section */}
          <div className="w-1/4">
            <h3 className="text-xl font-semibold text-yellow-400 mb-4">Your Selection</h3>
            <div className="text-gray-300 mb-4">
              {selectedSeats.length > 0 ? (
                <ul>
                  {selectedSeats.map((seatId) => (
                    <li key={seatId}>Seat ID: {seatId}</li>
                  ))}
                </ul>
              ) : (
                <p>No seats selected</p>
              )}
            </div>
            <p className="text-lg font-semibold text-yellow-300">Total: ${totalCost.toFixed(2)}</p>

            {/* Payment Form */}
            <PaymentForm
              totalCost={totalCost}
              selectedSeats={selectedSeats}
              userId={userId}
              onBookingConfirmed={() => setSelectedSeats([])}
            />
          </div>
        </div>
      </div>
    </Elements>
  );
};

export default CinemaSeatMap;
