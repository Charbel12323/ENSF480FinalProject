// PaymentPage.js
import React from "react";
import PaymentForm from "../components/PaymentForm/PaymentForm";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

// Load your Stripe publishable key
const stripePromise = loadStripe("pk_test_51QQgDtDUKjAvOoW4QgoceBCEioyzYzcQ4Flmoe0AssDWfpdNOJrDjhCNhRSrQeapUmQrckPSrVmFYCiDkTRLNSHH00n5Czacfp"); // Replace with your actual publishable key

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
