// PaymentPage.js
import React from "react";
import PaymentForm from "../components/PaymentForm/PaymentForm";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

// Load your Stripe publishable key
const stripePromise = loadStripe("pk_test_51QQRjDETUpam9OLqr39S30hoYdMdAOZbTzE6pKneELkmRkPTYnekieYMxV4CQAslt3fEW8Czw2eLv87LAYIdpDNn00jv1QAWI5"); // Replace with your actual publishable key

const PaymentPage = () => {
  return (
    <div>
      <Elements stripe={stripePromise}>
        <PaymentForm />
      </Elements>
    </div>
  );
};

export default PaymentPage;
