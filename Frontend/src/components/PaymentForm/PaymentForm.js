import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

const PaymentForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const { totalCost, selectedSeats, userId, guestEmail } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [savePaymentInfo, setSavePaymentInfo] = useState(false);
  const [savedPaymentMethods, setSavedPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [transactionId, setTransactionId] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/users/me", {
          withCredentials: true
        });
        setCurrentUser(response.data);

        if (!response.data.guest) {
          const paymentsResponse = await axios.get(
            `http://localhost:8080/api/payment/${response.data.id}`,
            { withCredentials: true }
          );
          setSavedPaymentMethods(paymentsResponse.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setPaymentError("");
    setLoading(true);

    try {
      // Step 1: Create transaction
      console.log("Creating transaction...");
      const transactionResponse = await axios.post(
        "http://localhost:8080/api/transaction/create",
        {
          userId: currentUser?.id || userId,
          totalAmount: totalCost,
          currency: "USD",
          transactionStatus: "pending"
        },
        { withCredentials: true }
      );
      
      const createdTransactionId = transactionResponse.data.transactionId;
      setTransactionId(createdTransactionId);
      console.log("Transaction created:", createdTransactionId);

      // Step 2: Handle payment
      console.log("Processing payment...");
      const paymentIntentResponse = await axios.post(
        "http://localhost:8080/api/payments/create-payment-intent",
        {
          amount: Math.round(totalCost * 100),
          currency: "usd"
        },
        { withCredentials: true }
      );

      const { clientSecret } = paymentIntentResponse.data;
      const cardElement = elements.getElement(CardElement);
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            email: guestEmail || currentUser?.email,
            name: currentUser?.name || 'Guest',
          },
        },
      });

      if (paymentResult.error) {
        throw new Error(paymentResult.error.message);
      }

      // Step 3: Save payment method if requested
      let finalPaymentId = null;
      // Inside handlePaymentSubmit after successful payment confirmation
      if (!currentUser?.guest && savePaymentInfo) {
        console.log("Saving payment method...");
        const paymentMethod = paymentResult.paymentIntent.payment_method;
        // Get card details from Stripe response
        const cardDetails = await stripe.retrievePaymentMethod(paymentMethod);
        
        const savePaymentResponse = await axios.post(
          "http://localhost:8080/api/payments/save",
          {
            userId: currentUser.id,
            paymentMethodId: paymentMethod,
            cardLastFourDigits: cardDetails.card.last4,
            expirationDate: `${cardDetails.card.exp_year}-${String(cardDetails.card.exp_month).padStart(2, '0')}-01`
          },
          { withCredentials: true }
        );
        finalPaymentId = savePaymentResponse.data.paymentId;
        console.log("Payment method saved:", finalPaymentId);
      }

      // Step 4: Update transaction status
      console.log("Updating transaction...");
      await axios.put(
        `http://localhost:8080/api/transaction/${createdTransactionId}/status`,
        {
          status: "success",
          paymentId: finalPaymentId
        },
        { withCredentials: true }
      );

      // Step 5: Book seats
      console.log("Booking seats...");
      await axios.post(
        "http://localhost:8080/api/seats/book",
        {
          seatIds: selectedSeats,
          userId: currentUser?.id || userId,
          email: guestEmail || currentUser?.email
        },
        { withCredentials: true }
      );

      // Step 6: Send confirmation email
      console.log("Sending confirmation email...");
      await axios.post(
        "http://localhost:8080/api/payment/send-confirmation-email",
        {
          email: guestEmail || currentUser?.email,
          name: currentUser?.name || 'Guest',
          seatCount: selectedSeats.length
        },
        { withCredentials: true }
      );

      navigate("/confirmation");
    } catch (error) {
      console.error("Payment Error:", error);
      setPaymentError(error.message);
      
      if (transactionId) {
        try {
          await axios.put(
            `http://localhost:8080/api/transaction/${transactionId}/status`,
            {
              status: "failed",
              paymentId: null
            },
            { withCredentials: true }
          );
        } catch (updateError) {
          console.error("Error updating transaction status:", updateError);
        }
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

        <form onSubmit={handlePaymentSubmit}>
          {!currentUser?.guest && savedPaymentMethods.length > 0 && (
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

          {!currentUser?.guest && !selectedPaymentMethod && (
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
              loading ? "bg-gray-600 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600"
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
