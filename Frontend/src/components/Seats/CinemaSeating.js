import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const CinemaSeatMap = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seats, setSeats] = useState([]);
  const [isGuest, setIsGuest] = useState(false);
  const [userId, setUserId] = useState(0);
  const [guestEmail, setGuestEmail] = useState("");
  const [email, setEmail] = useState("");
  const [bookingError, setBookingError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { movie, theatre, showtime } = location.state || {};

  const seatPrice = 12;

  useEffect(() => {
    const fetchSeatsAndUser = async () => {
      try {
        const showid = showtime.showtimeId;

        const seatResponse = await axios.get(
          `http://localhost:8080/api/seats/${showid}`
        );
        setSeats(seatResponse.data);

        const userResponse = await axios.get(
          "http://localhost:8080/api/users/me"
        );
        setIsGuest(userResponse.data.guest);
        setUserId(userResponse.data.id);
        setEmail(userResponse.data.email);
      } catch (error) {
        console.error("Error fetching seats or user data:", error);
      }
    };

    fetchSeatsAndUser();
  }, [showtime]);

  const toggleSeat = (seatId, isReservedForRegisteredUsers, seatUserId) => {
    if (seatUserId !== undefined && seatUserId !== null && seatUserId !== 0) {
      console.warn("Cannot select booked seats!");
      return;
    }

    if (isReservedForRegisteredUsers && isGuest) {
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

  const handleProceedToPayment = () => {
    setBookingError("");

    if (isGuest && !guestEmail) {
      setBookingError("Please provide an email address to proceed.");
      return;
    }

    navigate("/payment", {
      state: {
        selectedSeats,
        totalCost,
        userId: userId,
        guestEmail: isGuest ? guestEmail : email,
        showtimeId: showtime?.showtimeId,
      },
    });
  };

  const columns = [
    { colNum: 1, label: "A" },
    { colNum: 2, label: "B" },
    undefined,
    { colNum: 3, label: "C" },
    { colNum: 4, label: "D" },
    undefined,
    { colNum: 5, label: "E" },
    { colNum: 6, label: "F" },
  ];






  return (
    <div className="min-h-screen bg-gray-900 text-white flex p-8 gap-6">
      {/* Left Panel */}
      <div className="flex flex-col w-1/4">
        <button
          className="mb-4 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg"
          onClick={() => navigate("/")}
        >
          Back to Main
        </button>
        <div className="bg-gray-800 rounded-lg p-6 shadow-md">
          <img
            src={`http://localhost:8080${movie.imagePath}`}
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

      {/* Center Panel */}
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="w-full bg-gray-700 text-center py-2 rounded-lg mb-4 shadow-md">
          <span className="text-lg font-semibold text-gray-300">SCREEN</span>
        </div>
        <div className="grid grid-cols-[auto_repeat(2,2rem)_1rem_repeat(2,2rem)_1rem_repeat(2,2rem)_auto] gap-2">
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

          {[1, 2, 3, 4, 5].map((rowNumber) => (
            <React.Fragment key={rowNumber}>
              <div className="text-center text-gray-400 font-medium">
                {rowNumber}
              </div>
              {columns.map((col, index) => {
                if (!col) return <div key={`gap-${index}`} className="w-4"></div>;

                const seatColumnNumber = col.colNum;
                const rowLetter = String.fromCharCode(64 + rowNumber);
                const seat = seats.find(
                  (s) =>
                    s.rowNum === rowLetter &&
                    s.columnNumber === seatColumnNumber
                );

                if (!seat) return <div key={`empty-${index}`} className="w-8 h-8"></div>;

                const isSeatSelected = selectedSeats.includes(seat.seatId);
                const isSeatBooked = seat.userId !== undefined && seat.userId !== null && seat.userId !== 0;
                const isSeatReservedForRegisteredUsers = seat.isReserved;

                return (
                  <motion.button
                    key={seat.seatId}
                    className={`w-8 h-8 rounded-lg ${isSeatBooked || (isSeatReservedForRegisteredUsers && isGuest)
                      ? "bg-gray-700 cursor-not-allowed"
                      : isSeatSelected
                        ? "bg-blue-500"
                        : isSeatReservedForRegisteredUsers
                          ? "bg-green-500"
                          : "bg-white"
                      }`}
                    disabled={isSeatBooked || (isSeatReservedForRegisteredUsers && isGuest)}
                    onClick={() =>
                      toggleSeat(seat.seatId, isSeatReservedForRegisteredUsers, seat.userId)
                    }
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  />
                );
              })}
              <div></div>
            </React.Fragment>
          ))}
        </div>
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
            <span className="text-gray-300">Unavailable (Booked)</span>
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
        {isGuest && (
          <div className="mb-4">
            <label htmlFor="guestEmail" className="block text-gray-300 mb-2">
              Enter your email:
            </label>
            <input
              type="email"
              id="guestEmail"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              className="w-full p-2 rounded-lg text-black"
            />
          </div>
        )}
        {bookingError && <p className="text-red-500 mb-4">{bookingError}</p>}
        <p className="text-lg font-semibold text-yellow-300">
          Total: ${totalCost}
        </p>
        <button
          className={`mt-6 w-full py-2 rounded-lg text-white font-bold ${selectedSeats.length > 0
            ? "bg-yellow-500 hover:bg-yellow-600"
            : "bg-gray-600 cursor-not-allowed"
            }`}
          onClick={handleProceedToPayment}
          disabled={selectedSeats.length === 0}
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );

}
export default CinemaSeatMap;
