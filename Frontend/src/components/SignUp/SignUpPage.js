import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [guestEmail, setGuestEmail] = useState("");
    const [showGuestEmailInput, setShowGuestEmailInput] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignUpSubmit = async (e) => {
        e.preventDefault();

        // Redirect to payment page for $20 registration fee
        navigate("/payment", {
            state: {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                totalCost: 20,
                isRegistration: true, // Indicate this is a registration payment
            },
        });
    };

    const handleGuestEmailSubmit = async () => {
        try {
            const response = await axios.post("http://localhost:8080/api/users/guest", {
                email: guestEmail,
            });

            if (response.status === 200) {
                navigate("/MoviePage");
            } else {
                setMessage("An error occurred. Please try again.");
            }
        } catch (error) {
            setMessage("An error occurred. Please check your input and try again.");
        }
    };

    const handleLoginRedirect = () => {
        navigate("/login");
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
            <h1 className="text-3xl font-bold mb-8">Sign Up</h1>
            <form onSubmit={handleSignUpSubmit} className="bg-gray-800 p-8 rounded shadow-lg w-96">
                <div className="mb-4">
                    <label className="block text-sm mb-2">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded bg-gray-700 text-white"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm mb-2">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded bg-gray-700 text-white"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm mb-2">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded bg-gray-700 text-white"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-2 px-4 rounded font-bold"
                >
                    Sign Up & Pay $20
                </button>
            </form>
            <div
                className="mt-4 text-sm text-blue-400 cursor-pointer"
                onClick={handleLoginRedirect}
            >
                Already have an account? Login
            </div>

            <div className="mt-6">
                {!showGuestEmailInput ? (
                    <button
                        onClick={() => setShowGuestEmailInput(true)}
                        className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded font-bold"
                    >
                        Continue as Guest
                    </button>
                ) : (
                    <div className="mt-4">
                        <input
                            type="email"
                            value={guestEmail}
                            onChange={(e) => setGuestEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full px-4 py-2 rounded bg-gray-700 text-white mb-4"
                            required
                        />
                        <button
                            onClick={handleGuestEmailSubmit}
                            className="bg-yellow-500 hover:bg-yellow-600 text-black py-2 px-4 rounded font-bold"
                        >
                            Submit Email
                        </button>
                    </div>
                )}
            </div>
            {message && <p className="mt-4 text-red-400">{message}</p>}
        </div>
    );
};

export default SignUpPage;