import React, { useEffect, useState } from "react";
import axios from "axios";

const UserTickets = ({ userId }) => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/tickets/${userId}`);
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
        return <div className="text-center mt-10 text-gray-400">Loading tickets...</div>;
    }

    if (error) {
        return <div className="text-center mt-10 text-red-500">{error}</div>;
    }

    return (
        <div className="bg-gray-900 text-white min-h-screen py-10 px-4">
            <h1 className="text-4xl font-bold text-center text-yellow-400 mb-8">Your Tickets</h1>
            {tickets.length === 0 ? (
                <p className="text-center text-gray-400">No tickets found.</p>
            ) : (
                <ul className="space-y-4 max-w-2xl mx-auto">
                    {tickets.map((ticket) => (
                        <li key={ticket.ticketId} className="bg-gray-800 p-4 rounded-lg shadow-lg">
                            <p><strong>Ticket ID:</strong> {ticket.ticketId}</p>
                            <p><strong>Showtime ID:</strong> {ticket.showtimeId}</p>
                            <p><strong>Seat ID:</strong> {ticket.seatId}</p>
                            <p><strong>Purchase Date:</strong> {new Date(ticket.purchaseDate).toLocaleString()}</p>
                            <p><strong>Redeemed:</strong> {ticket.isRedeemed ? "Yes" : "No"}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UserTickets;
