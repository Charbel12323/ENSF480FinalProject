import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

const PaymentForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const { totalCost, isRegistration, seatCount, selectedSeats } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [savePaymentInfo, setSavePaymentInfo] = useState(false);
  const [savedPaymentMethods, setSavedPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!isRegistration) {
        try {
          const response = await axios.get("http://localhost:8080/api/users/me", {
            withCredentials: true
          });
          setCurrentUser(response.data);
          
          // Fetch saved payment methods
          const paymentsResponse = await axios.get(
            `http://localhost:8080/api/payments/${response.data.id}`,
            { withCredentials: true }
          );
          setSavedPaymentMethods(paymentsResponse.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setPaymentError("Unable to retrieve user information. Please log in again.");
          navigate("/login");
        }
      }
    };

    fetchData();
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

    const userInfo = isRegistration ? location.state : currentUser;
    if (!userInfo?.name || !userInfo?.email) {
      setPaymentError("User information is missing. Please ensure you are logged in.");
      setLoading(false);
      return;
    }

    try {
      if (selectedPaymentMethod) {
        // Use existing payment method
        await axios.post(
          "http://localhost:8080/api/payments/use",
          { paymentMethodId: selectedPaymentMethod },
          { withCredentials: true }
        );
      } else {
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          setPaymentError("Card details are missing. Please try again.");
          setLoading(false);
          return;
        }

        // Create payment intent
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
          { withCredentials: true }
        );

        const { clientSecret } = paymentIntentResponse.data;

        // Confirm payment
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
          throw new Error(paymentResult.error.message);
        }

        // Save payment method if requested
        if (!isRegistration && savePaymentInfo) {
          const card = paymentResult.paymentIntent.payment_method.card;
          await axios.post(
            "http://localhost:8080/api/payments/save",
            {
              userId: currentUser.id,
              paymentMethodId: paymentResult.paymentIntent.payment_method,
              cardLastFourDigits: card.last4,
              expirationDate: `${card.exp_year}-${String(card.exp_month).padStart(2, '0')}-01`
            },
            { withCredentials: true }
          );
        }
      }

      // Handle post-payment actions
      if (isRegistration) {
        await handleRegistrationSuccess(userInfo);
      } else {
        await handleTicketPurchaseSuccess(userInfo);
      }

    } catch (error) {
      handlePaymentError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrationSuccess = async (userInfo) => {
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
    } catch (error) {
      throw new Error("Payment successful but registration failed. Please contact support.");
    }
  };

  const handleTicketPurchaseSuccess = async (userInfo) => {
    try {
      await axios.post(
        "http://localhost:8080/api/seats/book",
        {
          seatIds: selectedSeats,
          userId: currentUser.id,
          email: userInfo.email
        },
        { withCredentials: true }
      );

      await axios.post(
        "http://localhost:8080/api/payments/send-confirmation-email",
        {
          email: userInfo.email,
          name: userInfo.name,
          seatCount: selectedSeats.length || seatCount || 1
        },
        { 
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' }
        }
      );

      navigate("/confirmation");
    } catch (error) {
      if (error.response?.status === 500) {
        navigate("/confirmation", {
          state: { emailError: "Payment and seat reservation successful, but confirmation email could not be sent." }
        });
      } else {
        throw new Error("An error occurred after payment. Please contact support.");
      }
    }
  };

  const handlePaymentError = (error) => {
    const errorMessage = error.response?.data?.message || error.message || 
      "An error occurred while processing your payment";
    setPaymentError(errorMessage);
    console.error("Payment Error:", error);
  };

  return (
    <div className="flex items-center justify-center bg-gray-900 py-8 px-4">
      <div className="w-full max-w-lg bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-yellow-400 mb-6 text-center">Payment Details</h2>
        
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
          {!isRegistration && savedPaymentMethods.length > 0 && (
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Saved Payment Methods:</label>
              <select
                className="w-full p-3 rounded-md bg-gray-700 text-white"
                value={selectedPaymentMethod || ""}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              >
                <option value="">Use a new card</option>
                {savedPaymentMethods.map((method) => (
                  <option key={method.paymentId} value={method.paymentId}>
                    **** **** **** {method.cardLastFourDigits} (Expires: {method.expirationDate})
                  </option>
                ))}
              </select>
            </div>
          )}

          {!selectedPaymentMethod && (
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Card Details:</label>
              <div className="p-3 bg-white rounded-md">
                <CardElement options={{ hidePostalCode: true }} />
              </div>
            </div>
          )}

          {!isRegistration && !selectedPaymentMethod && (
            <div className="mb-4">
              <label className="flex items-center text-gray-300">
                <input
                  type="checkbox"
                  checked={savePaymentInfo}
                  onChange={(e) => setSavePaymentInfo(e.target.checked)}
                  className="mr-2"
                />
                Save card for future payments
              </label>
            </div>
          )}

          <button
            type="submit"
            className={`w-full py-3 rounded-lg text-white font-bold transition duration-300 ease-in-out ${
              loading || (!isRegistration && !currentUser)
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