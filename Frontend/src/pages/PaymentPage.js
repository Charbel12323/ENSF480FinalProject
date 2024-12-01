import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "../components/PaymentForm/PaymentForm";

// Initialize Stripe
const stripePromise = loadStripe("pk_test_51QQRjDETUpam9OLqr39S30hoYdMdAOZbTzE6pKneELkmRkPTYnekieYMxV4CQAslt3fEW8Czw2eLv87LAYIdpDNn00jv1QAWI5");

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract data passed via state (e.g., from previous page)
  const { selectedSeats, totalCost, userId, isRegisteredUser } = location.state || {};

  // Handle navigation after payment success
  const handlePaymentSuccess = (transactionId) => {
    navigate("/confirmation", {
      state: { transactionId, selectedSeats, totalCost },
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">Payment Page</h1>
      <div className="bg-gray-800 w-full max-w-md p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Selected Seats</h2>
        <ul className="list-disc ml-6 text-gray-300 mb-4">
          {selectedSeats && selectedSeats.map((seat, index) => (
            <li key={index}>{seat}</li>
          ))}
        </ul>
        <h3 className="text-xl font-bold text-gray-300 mb-4">
          Total Cost: <span className="text-yellow-400">${totalCost}</span>
        </h3>
        {/* Wrap PaymentForm with the Elements provider */}
        <Elements stripe={stripePromise}>
          <PaymentForm
            totalCost={totalCost}
            selectedSeats={selectedSeats}
            userId={userId}
            isRegisteredUser={isRegisteredUser}
            onPaymentSuccess={handlePaymentSuccess}
          />
        </Elements>
      </div>
    </div>
  );
};

export default PaymentPage;
