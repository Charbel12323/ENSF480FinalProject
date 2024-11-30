import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

const PaymentForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const { selectedSeats, totalCost, userId, guestEmail } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Handle Payment Submission
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setPaymentError("");
    setLoading(true);

    if (!elements || !stripe) {
      setPaymentError("Stripe has not yet loaded. Please try again later.");
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      // Create payment intent on the backend
      const paymentIntentResponse = await axios.post(
        "http://localhost:8080/api/payments/create-payment-intent",
        {
          amount: totalCost * 100, // Convert to cents
          currency: "usd",
        }
      );

      const { clientSecret } = paymentIntentResponse.data;

      // Confirm the payment
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            email: guestEmail || "registered_user@example.com", // For guests or registered users
          },
        },
      });

      if (paymentResult.error) {
        setPaymentError(paymentResult.error.message);
        setLoading(false);
      } else {
        if (paymentResult.paymentIntent.status === "succeeded") {
          // Book the seats after payment success
          console.log("Booking payload:", {
            seatIds: selectedSeats,
            userId,
            email: guestEmail || null,
          });

          await axios.post("http://localhost:8080/api/seats/book", {
            seatIds: selectedSeats,
            userId,
            email: guestEmail || null,
          });

          setPaymentSuccess(true);
          navigate("/confirmation", {
            state: {
              selectedSeats,
              totalCost,
              userId,
              guestEmail,
            },
          });
        }
      }
    } catch (error) {
      setPaymentError("An error occurred while processing your payment. Please try again.");
      console.error("Payment error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md bg-gray-800 rounded-lg p-6 shadow-md">
        <h2 className="text-2xl font-bold text-yellow-400 mb-6">Payment Details</h2>
        {paymentError && (
          <div className="mb-4 p-3 bg-red-600 rounded-md text-white">
            {paymentError}
          </div>
        )}
        <form onSubmit={handlePaymentSubmit}>
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Card Details:</label>
            <div className="p-3 bg-white rounded-md">
              <CardElement />
            </div>
          </div>
          <button
            type="submit"
            className={`w-full py-2 rounded-lg text-white font-bold ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-600"
            }`}
            disabled={loading}
          >
            {loading ? "Processing..." : `Pay $${totalCost}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
