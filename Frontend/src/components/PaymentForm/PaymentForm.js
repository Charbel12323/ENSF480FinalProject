import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

const PaymentForm = ({ totalCost, selectedSeats, userId, isRegisteredUser, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [savedPaymentMethods, setSavedPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [savePaymentInfo, setSavePaymentInfo] = useState(false);
  const [transactionId, setTransactionId] = useState(null);

  useEffect(() => {
    if (isRegisteredUser) {
      fetchSavedPaymentMethods();
    }
  }, [userId, isRegisteredUser]);

  const fetchSavedPaymentMethods = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/payment/${userId}`);
      console.log("Fetched payment methods:", response.data);
      setSavedPaymentMethods(response.data);
    } catch (error) {
      console.error("Error fetching saved payment methods:", error);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    console.log("Starting payment submission...");
    console.log("Current state:", {
      userId,
      totalCost,
      isRegisteredUser,
      savePaymentInfo,
      selectedPaymentMethod
    });
    
    setPaymentError("");
    setLoading(true);

    try {
      // Step 1: Create initial transaction
      console.log("Creating initial transaction...");
      const transactionResponse = await axios.post(
        "http://localhost:8080/api/transaction/create",
        {
          userId,
          totalAmount: totalCost,
          currency: "USD",
          transactionStatus: "pending"
        }
      );
      console.log("Transaction created:", transactionResponse.data);
      
      const createdTransactionId = transactionResponse.data.transactionId;
      setTransactionId(createdTransactionId);

      let finalPaymentId;

      if (selectedPaymentMethod) {
        console.log("Using existing payment method:", selectedPaymentMethod);
        finalPaymentId = parseInt(selectedPaymentMethod);
      } else {
        // Create payment intent for new card
        console.log("Creating payment intent...");
        const paymentIntentResponse = await axios.post(
          "http://localhost:8080/api/payment/create-payment-intent",
          {
            amount: totalCost * 100,
            currency: "usd"
          }
        );
        console.log("Payment intent created:", paymentIntentResponse.data);

        const cardElement = elements.getElement(CardElement);
        console.log("Confirming card payment...");
        const paymentResult = await stripe.confirmCardPayment(
          paymentIntentResponse.data.clientSecret,
          {
            payment_method: {
              card: cardElement,
              billing_details: {
                email: "example@example.com" // Replace with actual user email
              }
            }
          }
        );
        console.log("Payment result:", paymentResult);

        if (paymentResult.error) {
          throw new Error(paymentResult.error.message);
        }

        if (isRegisteredUser && savePaymentInfo) {
          console.log("Saving new payment method...");
          try {
            const card = paymentResult.paymentIntent.payment_method.card;
            const savePaymentResponse = await axios.post(
              "http://localhost:8080/api/payment/save",
              {
                userId,
                paymentMethodId: paymentResult.paymentIntent.payment_method.id,
                cardLastFourDigits: card.last4,
                expirationDate: `${card.exp_year}-${String(card.exp_month).padStart(2, '0')}-01`
              }
            );
            console.log("Payment method saved:", savePaymentResponse.data);
            finalPaymentId = savePaymentResponse.data.paymentId;
          } catch (saveError) {
            console.error("Error saving payment method:", saveError);
            throw new Error("Failed to save payment method: " + saveError.message);
          }
        }
      }

      // Update transaction status
      console.log("Updating transaction status...");
      await axios.put(
        `http://localhost:8080/api/transaction/${createdTransactionId}/status`,
        {
          status: "success",
          paymentId: finalPaymentId
        }
      );
      console.log("Transaction updated successfully");

      setPaymentSuccess(true);
      onPaymentSuccess(createdTransactionId);
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentError(error.message);
      
      if (transactionId) {
        try {
          console.log("Updating transaction status to failed...");
          await axios.put(
            `http://localhost:8080/api/transaction/${transactionId}/status`,
            {
              status: "failed",
              paymentId: null
            }
          );
        } catch (updateError) {
          console.error("Error updating transaction status:", updateError);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  console.log("Rendering PaymentForm with state:", {
    isRegisteredUser,
    savedPaymentMethods,
    selectedPaymentMethod,
    savePaymentInfo
  });

  return (
    <form onSubmit={handlePaymentSubmit} className="mt-6">
      {isRegisteredUser && savedPaymentMethods.length > 0 && (
        <div className="mb-6">
          <label className="block text-gray-300 mb-2">Saved Payment Methods:</label>
          <select
            className="w-full p-3 rounded-md bg-gray-700 text-white"
            value={selectedPaymentMethod || ""}
            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
          >
            <option value="">Use a new card</option>
            {savedPaymentMethods.map((method) => (
              <option key={method.paymentId} value={method.paymentId}>
                **** **** **** {method.cardLastFourDigits} 
                (Expires: {method.expirationDate})
              </option>
            ))}
          </select>
        </div>
      )}

      {!selectedPaymentMethod && (
        <div className="mb-6">
          <label className="block text-gray-300 mb-2">Card Details:</label>
          <div className="p-3 bg-white rounded-md">
            <CardElement />
          </div>
        </div>
      )}

      {isRegisteredUser && !selectedPaymentMethod && (
        <div className="mb-6">
          <label className="block text-gray-300 mb-2">
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
        disabled={loading}
        className={`w-full py-3 rounded-lg text-white font-semibold ${
          loading
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-yellow-500 hover:bg-yellow-600"
        }`}
      >
        {loading ? "Processing..." : `Pay $${totalCost}`}
      </button>

      {paymentError && (
        <div className="mt-4 p-3 bg-red-600 text-white rounded-md">
          {paymentError}
        </div>
      )}

      {paymentSuccess && (
        <div className="mt-4 p-3 bg-green-600 text-white rounded-md">
          Payment successful!
        </div>
      )}
    </form>
  );
};

export default PaymentForm;