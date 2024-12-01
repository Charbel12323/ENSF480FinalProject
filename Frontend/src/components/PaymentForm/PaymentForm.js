import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

const PaymentForm = ({ totalCost, selectedSeats, userId, isRegisteredUser, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const { totalCost, isRegistration, seatCount, selectedSeats } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [savedPaymentMethods, setSavedPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [savePaymentInfo, setSavePaymentInfo] = useState(false);
  const [transactionId, setTransactionId] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/users/me", {
          withCredentials: true
        });
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        if (!isRegistration) {
          setPaymentError("Unable to retrieve user information. Please log in again.");
          navigate("/login");
        }
      }
    };

    if (!isRegistration) {
      fetchCurrentUser();
    }
  }, [isRegistration, navigate]);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setPaymentError("");
    setLoading(true);

    if (!elements || !stripe) {
      setPaymentError("Stripe has not yet loaded. Please try again later.");
      setLoading(false);
      return;
    }

    const userInfo = isRegistration
      ? location.state
      : currentUser;

    if (!userInfo?.name || !userInfo?.email) {
      setPaymentError("User information is missing. Please ensure you are logged in.");
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
        isRegistration
          ? "http://localhost:8080/api/payments/create-registration-payment-intent"
          : "http://localhost:8080/api/payments/create-payment-intent",
        {
          amount: Math.round(totalCost * 100),
          currency: "usd",
          name: userInfo.name,
          email: userInfo.email,
          password: isRegistration ? userInfo.password : undefined,
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
            email: userInfo.email,
            name: userInfo.name,
          },
        },
      });

      if (paymentResult.error) {
        setPaymentError(paymentResult.error.message);
        setLoading(false);
      } else if (paymentResult.paymentIntent.status === "succeeded") {
        console.log("Payment succeeded!");

        if (isRegistration) {
          try {
            await axios.post("http://localhost:8080/api/payments/confirm-registration", {
              name: userInfo.name,
              email: userInfo.email,
              password: userInfo.password,
            }, {
              withCredentials: true
            });
            navigate("/login");
          } catch (registrationError) {
            console.error("Registration Error:", registrationError);
            setPaymentError("Payment successful but registration failed. Please contact support.");
          }
        } else {
          try {
            // Book seats first
            await axios.post("http://localhost:8080/api/seats/book", {
              seatIds: selectedSeats,
              userId: currentUser.id,
              email: userInfo.email
            }, {
              withCredentials: true
            });

            // Send confirmation email
            await axios.post(
              "http://localhost:8080/api/payments/send-confirmation-email",
              {
                email: userInfo.email,
                name: userInfo.name,
                seatCount: selectedSeats.length || seatCount || 1
              },
              {
                withCredentials: true,
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            );

            navigate("/confirmation");
          } catch (error) {
            console.error("Error:", error);
            if (error.response?.status === 500) {
              navigate("/confirmation", {
                state: {
                  emailError: "Payment and seat reservation successful, but confirmation email could not be sent."
                }
              });
            } else {
              setPaymentError("An error occurred after payment. Please contact support.");
            }
          }
        }
      }
    } catch (error) {
      setPaymentError(error.message);
      if (transactionId) {
        await axios.put(
          `http://localhost:8080/api/transaction/${transactionId}/status`,
          {
            status: "failed",
            paymentId: null
          }
        );
      }
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
        {!isRegistration && !currentUser && (
          <div className="mb-4 p-3 bg-yellow-600 rounded-md text-white">
            Loading user information...
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
            className={`w-full py-2 rounded-lg text-white font-bold ${loading || (!isRegistration && !currentUser)
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-600"
              }`}
            disabled={loading || (!isRegistration && !currentUser)}
          >
            {loading ? "Processing..." : `Pay $${totalCost}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;