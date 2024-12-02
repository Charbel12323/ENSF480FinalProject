import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

const PaymentForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  // Destructure location state with isRegistration
  const {
    totalCost = 0,
    selectedSeats = [],
    showtimeId,
    userId,
    guestEmail,
    isRegistration = false
  } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [saveCard, setSaveCard] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/users/me", {
          withCredentials: true,
        });
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        if (!isRegistration && !guestEmail) {
          setPaymentError("Unable to retrieve user information. Please log in again.");
          navigate("/login");
        }
      }
    };

    if (!isRegistration && !guestEmail) {
      fetchCurrentUser();
    }
  }, [isRegistration, guestEmail, navigate]);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setPaymentError("");
    setLoading(true);

    let transactionId = null;

    try {
      if (!elements || !stripe) {
        throw new Error("Stripe has not yet loaded. Please try again later.");
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card details are missing. Please try again.");
      }

      const userInfo = isRegistration ? location.state : {
        email: guestEmail || currentUser?.email,
        name: currentUser?.name || 'Guest User'
      };

      if (!userInfo?.name || !userInfo?.email) {
        throw new Error("User information is missing. Please ensure all fields are filled.");
      }

      // Validate showtime and seats for ticket purchases
      if (!isRegistration) {
        if (!showtimeId) {
          throw new Error("Showtime information is missing. Please try selecting your seats again.");
        }
        if (!selectedSeats || selectedSeats.length === 0) {
          throw new Error("No seats selected. Please select your seats.");
        }
      }

      if (!isRegistration) {
        try {
          const transactionResponse = await axios.post(
            "http://localhost:8080/api/transaction/create",
            {
              userId: userId,
              totalAmount: totalCost,
              currency: "usd",
              transactionStatus: "pending",
            },
            { withCredentials: true }
          );
          transactionId = transactionResponse.data.transactionId;
        } catch (error) {
          console.error("Transaction creation error:", error);
          throw new Error("Failed to initialize transaction. Please try again.");
        }
      }

      // Prepare payment intent data
      const paymentIntentData = isRegistration ? {
        amount: Math.round(totalCost * 100),
        currency: "usd",
        name: userInfo.name,
        email: userInfo.email,
        password: userInfo.password
      } : {
        amount: Math.round(totalCost * 100),
        currency: "usd",
        name: userInfo.name,
        email: userInfo.email,
        seatIds: selectedSeats.map(id => parseInt(id)),
        showtimeId: parseInt(showtimeId),
        userId: parseInt(userId)
      };

      console.log("Payment Intent Request Data:", paymentIntentData);

      // Create payment intent
      const paymentIntentResponse = await axios.post(
        isRegistration
          ? "http://localhost:8080/api/payments/create-registration-payment-intent"
          : "http://localhost:8080/api/payments/create-payment-intent",
        paymentIntentData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const { clientSecret } = paymentIntentResponse.data;

      // Confirm card payment
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            email: userInfo.email,
            name: userInfo.name,
          },
        },
      });

      if (paymentResult.error) {
        throw paymentResult.error;
      }

      if (paymentResult.paymentIntent.status === "succeeded") {
        if (isRegistration) {
          // Registration flow
          try {
            await axios.post(
              "http://localhost:8080/api/payments/confirm-registration",
              {
                name: userInfo.name,
                email: userInfo.email,
                password: userInfo.password,
              },
              { withCredentials: true }
            );
            navigate("/login");
          } catch (registrationError) {
            console.error("Registration Error:", registrationError);
            throw new Error("Payment successful but registration failed. Please contact support.");
          }
        } else {
          // **Update Transaction Status to "success"**
          if (transactionId) {
            try {
              await axios.put(
                `http://localhost:8080/api/transaction/${transactionId}/status`,
                {
                  status: "success",
                  paymentId: null, // Optionally include payment ID
                },
                { withCredentials: true }
              );
            } catch (updateError) {
              console.error("Error updating transaction status:", updateError);
            }
          }

          try {
            // Book seats
            await axios.post(
              "http://localhost:8080/api/seats/book",
              {
                seatIds: selectedSeats,
                userId: userId,
                email: userInfo.email,
              },
              { withCredentials: true }
            );

            // Send confirmation email
            await axios.post(
              "http://localhost:8080/api/payments/send-confirmation-email",
              {
                email: userInfo.email,
                name: userInfo.name,
                seatCount: selectedSeats.length,
              },
              {
                withCredentials: true,
                headers: {
                  "Content-Type": "application/json"
                }
              }
            );

            navigate("/");
          } catch (error) {
            console.error("Post-payment Error:", error);
            navigate("/MoviePage", {
              state: {
                emailError: "Payment successful, but there was an issue with the confirmation. Please contact support.",
              },
            });
          }
        }
      }
    } catch (error) {
      // Update transaction status to "failed" if payment failed
      if (transactionId) {
        try {
          await axios.put(
            `http://localhost:8080/api/transaction/${transactionId}/status`,
            {
              status: "failed",
              paymentId: null,
            },
            { withCredentials: true }
          );
        } catch (updateError) {
          console.error("Error updating transaction status:", updateError);
        }
      }

      console.error("Payment Error:", error);
      setPaymentError(error.message || "An error occurred while processing your payment");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md bg-gray-800 rounded-lg p-6 shadow-md">
        <h2 className="text-2xl font-bold text-yellow-400 mb-6">Payment Details</h2>
        {paymentError && (
          <div className="mb-4 p-3 bg-red-600 rounded-md text-white">{paymentError}</div>
        )}
        <form onSubmit={handlePaymentSubmit}>
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Card Details:</label>
            <div className="p-3 bg-white rounded-md">
              <CardElement />
            </div>
          </div>
          {!isRegistration && !guestEmail && (
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={saveCard}
                  onChange={(e) => setSaveCard(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-gray-300">Save card for future purchases</span>
              </label>
            </div>
          )}
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