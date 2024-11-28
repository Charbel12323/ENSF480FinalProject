import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
const SignUpLoginPage = ({ onContinueAsGuest }) => {
    const navigate = useNavigate(); // Hook for navigation
    const [isSignUp, setIsSignUp] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isSignUp) {
                const response = await axios.post("http://localhost:8080/api/users/register", formData);
                setMessage("Registration successful!");
                setIsSignUp(false); // Automatically switch to login after registration
            } else {
                const response = await axios.post("http://localhost:8080/api/users/login", {
                    email: formData.email,
                    password: formData.password,
                });
                if (response.data === "Login successful") {
                    navigate("/MoviePage"); // Redirect guests to BrowseMovies
                } else {
                    setMessage(response.data); // Show error message
                }
            }
        } catch (error) {
            setMessage("An error occurred. Please try again.");
        }
    };

    const handleGuest = async () => {
        try {
            const response = await axios.post("http://localhost:8080/api/users/guest");
            onContinueAsGuest(response.data);
            navigate("/MoviePage"); // Redirect guests to BrowseMovies
        } catch (error) {
            setMessage("An error occurred. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
            <h1 className="text-3xl font-bold mb-8">{isSignUp ? "Sign Up" : "Login"}</h1>
            <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded shadow-lg w-96">
                {isSignUp && (
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
                )}
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
                    {isSignUp ? "Sign Up" : "Login"}
                </button>
                <div
                    className="mt-4 text-sm text-blue-400 cursor-pointer"
                    onClick={() => setIsSignUp(!isSignUp)}
                >
                    {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
                </div>
            </form>
            <div className="mt-6">
                <Link to="/MoviePage">

                    <button
                        onClick={handleGuest}
                        className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded font-bold"
                    >
                        Continue as Guest
                    </button>



                </Link>

            </div>
            {message && <p className="mt-4 text-red-400">{message}</p>}
        </div>
    );
};

export default SignUpLoginPage;
