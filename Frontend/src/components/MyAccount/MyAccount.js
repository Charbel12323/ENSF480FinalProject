import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Account = () => {
    const { userId } = useParams(); // Get userId from the URL
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/tickets/${userId}`, {
                    withCredentials: true,
                });
                setTickets(response.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch tickets. Please try again.");
                setLoading(false);
            }
        };

        fetchTickets();
    }, [userId]);

    if (loading) {
        return <div className="text-center mt-10 text-lg text-gray-400">Loading tickets...</div>;
    }

    if (error) {
        return <div className="text-center mt-10 text-red-500">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white py-10">
            <div className="max-w-4xl mx-auto">
                {/* Go Back Button */}
                <button
                    onClick={() => navigate('/MoviePage')} // Navigate back to the previous page
                    className="mb-6 py-2 px-4 bg-yellow-500 text-black font-bold rounded-lg shadow-md hover:bg-yellow-600 transition duration-300"
                >
                    Go Back
                </button>

                <h1 className="text-4xl font-bold text-center mb-8">Your Tickets</h1>
                {tickets.length === 0 ? (
                    <p className="text-center text-gray-400">No tickets found.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {tickets.map((ticket) => (
                            <div
                                key={ticket.ticketId}
                                className="bg-gray-800 rounded-lg p-6 shadow-md flex flex-col justify-between"
                            >
                                <div>
                                    <p className="mb-2">
                                        <strong>Ticket ID:</strong> {ticket.ticketId}
                                    </p>
                                    <p className="mb-2">
                                        <strong>Showtime ID:</strong> {ticket.showtimeId}
                                    </p>
                                    <p className="mb-2">
                                        <strong>Seat ID:</strong> {ticket.seatId}
                                    </p>
                                    <p className="mb-2">
                                        <strong>Purchase Date:</strong>{" "}
                                        {new Date(ticket.purchaseDate).toLocaleString()}
                                    </p>
                                    <p>
                                        <strong>Redeemed:</strong> {ticket.isRedeemed ? "Yes" : "No"}
                                    </p>
                                </div>
                                <button
                                    className="mt-4 py-2 px-4 bg-yellow-500 text-black font-bold rounded-lg shadow-md hover:bg-yellow-600 transition duration-300"
                                    onClick={() => alert("Refund functionality coming soon!")}
                                >
                                    Request Refund
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Account;
