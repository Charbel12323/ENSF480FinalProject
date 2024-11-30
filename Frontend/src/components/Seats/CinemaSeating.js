import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

const stripePromise = loadStripe("pk_test_51QQgDtDUKjAvOoW4QgoceBCEioyzYzcQ4Flmoe0AssDWfpdNOJrDjhCNhRSrQeapUmQrckPSrVmFYCiDkTRLNSHH00n5Czacfp"); // Replace with your Stripe Publishable Key

const PaymentForm = ({ totalCost, selectedSeats, userId, onBookingConfirmed }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handlePayment = async () => {
    try {
      // Step 1: Create Payment Intent
      const { data } = await axios.post("http://localhost:8080/api/payments/create-payment-intent", {
        amount: totalCost * 100, // Convert dollars to cents
        currency: "usd",
        userId: userId,
      });

      console.log("Client Secret Received:", data.clientSecret);

      // Step 2: Confirm Payment
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        alert(`Payment failed: ${result.error.message}`);
      } else if (result.paymentIntent.status === "succeeded") {
        // Step 3: Confirm Booking
        try {
          await axios.post("http://localhost:8080/api/payments/confirm-booking", {
            userId: userId,
            seatIds: selectedSeats,
          });
          alert("Payment successful! Booking confirmed.");
          onBookingConfirmed();
        } catch (error) {
          console.error("Booking Error:", error.response?.data || error.message);
          alert(error.response?.data || "An error occurred while confirming the booking.");
        }
      }
    } catch (error) {
      console.error("Payment Error:", error);
      alert("An error occurred during payment. Please try again.");
    }
  };

  return (
    <div>
      <CardElement />
      <button
        onClick={handlePayment}
        disabled={!stripe || totalCost <= 0}
      >
        Pay ${totalCost.toFixed(2)}
      </button>
    </div>
  );
};

const CinemaSeating = () => {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [userId] = useState(1); // Replace with actual user ID

  useEffect(() => {
    const fetchSeats = async () => {
      const { data } = await axios.get("http://localhost:8080/api/seats/1"); // Replace 1 with your showtime ID
      setSeats(data);
    };

    fetchSeats();
  }, []);

  const totalCost = selectedSeats.length * 12;

  return (
    <Elements stripe={stripePromise}>
      <div>
        {/* Render seat map */}
        <PaymentForm
          totalCost={totalCost}
          selectedSeats={selectedSeats}
          userId={userId}
          onBookingConfirmed={() => setSelectedSeats([])}
        />
      </div>
    </Elements>
  );
};

export default CinemaSeating;
