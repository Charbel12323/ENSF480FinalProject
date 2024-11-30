import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";

// Initialize Stripe with the Publishable Key
const stripePromise = loadStripe("pk_test_51QQgDtDUKjAvOoW4QgoceBCEioyzYzcQ4Flmoe0AssDWfpdNOJrDjhCNhRSrQeapUmQrckPSrVmFYCiDkTRLNSHH00n5Czacfp");

const PaymentFormComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const { selectedSeats, totalCost, userId, userEmail } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");

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
      // Create PaymentIntent on the backend
      const paymentIntentResponse = await axios.post(
        "http://localhost:8080/api/payments/create-payment-intent",
        {
          amount: totalCost * 100, // Convert to cents
          currency: "usd",
        }
      );

      const { clientSecret } = paymentIntentResponse.data;
      console.log("Received clientSecret:", clientSecret);

      // Confirm the payment
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            email: userEmail, // Use user's email from location.state
          },
        },
      });

      if (paymentResult.error) {
        setPaymentError(paymentResult.error.message);
        console.error("Payment Error:", paymentResult.error.message);
        setLoading(false);
      } else if (paymentResult.paymentIntent.status === "succeeded") {
        console.log("Payment successful:", paymentResult.paymentIntent);

        // Book the seats
        await axios.post("http://localhost:8080/api/seats/book", {
          seatIds: selectedSeats,
          userId,
          email: userEmail,
        });

        navigate("/confirmation", {
          state: {
            selectedSeats,
            totalCost,
            userId,
            userEmail,
          },
        });
      }
    } catch (error) {
      setPaymentError("An error occurred while processing your payment. Please try again.");
      console.error("Payment error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Payment Details</h2>
      {paymentError && <p style={{ color: "red" }}>{paymentError}</p>}
      <form onSubmit={handlePaymentSubmit}>
        <label>Card Details:</label>
        <CardElement />
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : `Pay $${totalCost}`}
        </button>
      </form>
    </div>
  );
};

// Wrap the component with Elements to provide the Stripe context
const PaymentForm = () => (
  <Elements stripe={stripePromise}>
    <PaymentFormComponent />
  </Elements>
);

export default PaymentForm;
