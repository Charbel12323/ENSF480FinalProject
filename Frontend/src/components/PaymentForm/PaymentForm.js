import React, { useState, useEffect } from "react";
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
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/users/me", {
          withCredentials: true
        });
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        setPaymentError("Unable to retrieve user information. Please log in again.");
        navigate("/login");
      }
    };

    fetchCurrentUser();
  }, [navigate]);

  const handleSeatReservation = async () => {
    try {
      await axios.post("http://localhost:8080/api/seats/book", {
        seatIds: selectedSeats,
        userId: userId,
        email: guestEmail || currentUser?.email
      }, {
        withCredentials: true
      });
    } catch (error) {
      throw new Error("Failed to reserve seats after payment");
    }
  };

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

    if (!cardElement) {
      setPaymentError("Card details are missing. Please try again.");
      setLoading(false);
      return;
    }

    try {
      const paymentIntentResponse = await axios.post(
        "http://localhost:8080/api/payments/create-payment-intent",
        {
          amount: Math.round(totalCost * 100),
          currency: "usd",
          email: guestEmail || currentUser?.email,
        },
        {
          withCredentials: true
        }
      );

      const { clientSecret } = paymentIntentResponse.data;

      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            email: guestEmail || currentUser?.email,
            name: currentUser?.name,
          },
        },
      });

      if (paymentResult.error) {
        setPaymentError(paymentResult.error.message);
      } else if (paymentResult.paymentIntent.status === "succeeded") {
        console.log("Payment succeeded!");

        // Reserve seats after successful payment
        await handleSeatReservation();

        try {
          await axios.post("http://localhost:8080/api/payments/send-confirmation-email", {
            email: guestEmail || currentUser?.email,
            name: currentUser?.name,
            seatCount: selectedSeats.length
          }, {
            withCredentials: true
          });
          navigate("/confirmation");
        } catch (emailError) {
          console.error("Email Error:", emailError);
          navigate("/confirmation", {
            state: { emailError: "Payment successful but confirmation email could not be sent." }
          });
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message ||
        error.message ||
        "An error occurred while processing your payment";
      setPaymentError(errorMessage);
      console.error("Payment Error:", error);
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
            className={`w-full py-2 rounded-lg text-white font-bold ${loading ? "bg-gray-600 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600"
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