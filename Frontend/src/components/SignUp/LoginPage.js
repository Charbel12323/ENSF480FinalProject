import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8080/api/users/login", {
                email: formData.email,
                password: formData.password,
            });

            if (response.data === "Login successful") {
                navigate("/MoviePage");
            } else {
                setMessage(response.data);
            }
        } catch (error) {
            setMessage("An error occurred. Please try again.");
        }
    };

    const handleSignUpRedirect = () => {
        navigate("/signup");
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
            <h1 className="text-3xl font-bold mb-8">Login</h1>
            <form onSubmit={handleLoginSubmit} className="bg-gray-800 p-8 rounded shadow-lg w-96">
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
                    Login
                </button>
            </form>
            <div
                className="mt-4 text-sm text-blue-400 cursor-pointer"
                onClick={handleSignUpRedirect}
            >
                Don't have an account? Sign Up
            </div>
        </div>
    );
};

export default LoginPage;