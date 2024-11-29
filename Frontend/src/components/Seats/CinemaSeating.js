import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const CinemaSeatMap = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seats, setSeats] = useState([]);
  const [isGuest, setIsGuest] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { movie, theatre, showtime } = location.state || {};

  const seatPrice = 12;

  // Fetch seats and user information
  useEffect(() => {
    const fetchSeatsAndUser = async () => {
      try {
        // Fetch seats for the selected showtime
        const seatResponse = await axios.get(
          `http://localhost:8080/api/seats/${showtime.showtimeId}`
        );
        setSeats(seatResponse.data);

        // Fetch user data to check if they are a guest
        const userResponse = await axios.get(
          "http://localhost:8080/api/users/me"
        );
        setIsGuest(userResponse.data.guest);

        console.log("User isGuest:", userResponse.data.guest);
      } catch (error) {
        console.error("Error fetching seats or user data:", error);
      }
    };

    fetchSeatsAndUser();
  }, [showtime]);

  // Toggle seat selection
  const toggleSeat = (seatId, isReserved) => {
    if (isReserved && isGuest) {
      // Guests cannot select reserved seats
      console.warn("Guests cannot select reserved seats!");
      return;
    }

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId]
    );
  };

  const totalCost = selectedSeats.length * seatPrice;

  const columns = [
    { colNum: 1, label: "A" },
    { colNum: 2, label: "B" },
    undefined, // Gap
    { colNum: 3, label: "C" },
    { colNum: 4, label: "D" },
    undefined, // Gap
    { colNum: 5, label: "E" },
    { colNum: 6, label: "F" },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex p-8 gap-6">
      {/* Left Panel */}
      <div className="flex flex-col w-1/4">
        {/* Back to Main Button */}
        <button
          className="mb-4 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg"
          onClick={() => navigate("/")}
        >
          Back to Main
        </button>

        {/* Movie Details Card */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-md">
          <img
            src={`http://localhost:8080/${movie.imagePath}`}
            alt={movie.title}
            className="w-full h-auto object-contain rounded-md mb-4"
          />
          <h2 className="text-2xl font-bold text-yellow-400 mb-2">
            {movie.title}
          </h2>
          <p className="text-sm text-gray-300 mb-2">{theatre}</p>
          <p className="text-sm text-gray-400">
            Date:{" "}
            {new Date(showtime.showtime).toLocaleDateString([], {
              dateStyle: "medium",
            })}
          </p>
          <p className="text-sm text-gray-400">
            Time:{" "}
            {new Date(showtime.showtime).toLocaleTimeString([], {
              timeStyle: "short",
            })}
          </p>
        </div>
      </div>

      {/* Center Panel: Seat Map */}
      <div className="flex-grow flex flex-col items-center justify-center">
        {/* Screen */}
        <div className="w-full bg-gray-700 text-center py-2 rounded-lg mb-4 shadow-md">
          <span className="text-lg font-semibold text-gray-300">SCREEN</span>
        </div>

        {/* Seat Map */}
        <div className="grid grid-cols-[auto_repeat(2,2rem)_1rem_repeat(2,2rem)_1rem_repeat(2,2rem)_auto] gap-2">
          {/* Column Labels */}
          <div></div>
          {columns.map((col, index) =>
            col ? (
              <div
                key={`col-${col.colNum}`}
                className="text-center text-gray-400 font-medium"
              >
                {col.label}
              </div>
            ) : (
              <div key={`col-gap-${index}`} className="w-4"></div>
            )
          )}
          <div></div>

          {/* Seat Rows */}
          {[1, 2, 3, 4, 5].map((rowNumber) => (
            <React.Fragment key={rowNumber}>
              {/* Row Labels */}
              <div className="text-center text-gray-400 font-medium">
                {rowNumber}
              </div>

              {/* Seat Buttons */}
              {columns.map((col, index) => {
                if (!col) {
                  // Gap in the middle
                  return <div key={`gap-${index}`} className="w-4"></div>;
                }

                const seatColumnNumber = col.colNum;
                const rowLetter = String.fromCharCode(64 + rowNumber); // 1 -> 'A'

                const seat = seats.find(
                  (s) =>
                    s.rowNum === rowLetter &&
                    s.columnNumber === seatColumnNumber
                );

                if (!seat)
                  return (
                    <div key={`empty-${index}`} className="w-8 h-8"></div>
                  );

                const isSeatReserved = seat.reserved;
                const isSeatSelected = selectedSeats.includes(seat.seatId);

                return (
                  <motion.button
                    key={seat.seatId}
                    className={`w-8 h-8 rounded-lg ${
                      isSeatSelected
                        ? "bg-blue-500"
                        : isSeatReserved
                        ? isGuest
                          ? "bg-gray-700 cursor-not-allowed"
                          : "bg-green-500"
                        : "bg-white"
                    }`}
                    disabled={isSeatReserved && isGuest}
                    onClick={() => toggleSeat(seat.seatId, seat.reserved)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  />
                );
              })}

              <div></div>
            </React.Fragment>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 flex justify-center space-x-6">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-white border border-gray-500 mr-2"></div>
            <span className="text-gray-300">Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 mr-2"></div>
            <span className="text-gray-300">Selected</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 mr-2"></div>
            <span className="text-gray-300">Reserved (Members)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-700 mr-2"></div>
            <span className="text-gray-300">Unavailable</span>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-1/4 bg-gray-800 rounded-lg p-6 shadow-md">
        <h3 className="text-xl font-semibold text-yellow-400 mb-4">
          Your Selection
        </h3>
        <div className="text-gray-300 mb-4">
          {selectedSeats.length > 0 ? (
            <ul className="space-y-2">
              {selectedSeats.map((seatId) => {
                const seat = seats.find((s) => s.seatId === seatId);
                if (seat) {
                  const rowNumber = seat.rowNum.charCodeAt(0) - 64;
                  const columnLabel = String.fromCharCode(
                    64 + seat.columnNumber
                  );
                  return (
                    <li key={seatId}>
                      {`Row ${rowNumber} - Seat ${columnLabel}`}
                    </li>
                  );
                } else {
                  return null;
                }
              })}
            </ul>
          ) : (
            <p>No seats selected</p>
          )}
        </div>
        <p className="text-lg font-semibold text-yellow-300">
          Total: ${totalCost}
        </p>
        <button
          className={`mt-6 w-full py-2 rounded-lg text-white font-bold ${
            selectedSeats.length > 0
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-gray-600 cursor-not-allowed"
          }`}
          disabled={selectedSeats.length === 0}
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default CinemaSeatMap;
