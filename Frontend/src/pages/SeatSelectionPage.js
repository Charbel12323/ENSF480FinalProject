import React from "react";
import { useLocation } from "react-router-dom";
import CinemaSeatMap from "../components/Seats/CinemaSeating";

const SeatSelectionPage = () => {
  const location = useLocation();
  const { movie, theatre, showtime } = location.state || {};
  console.log(showtime);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Ensure all required data is available */}
      {movie && theatre && showtime ? (
        <CinemaSeatMap
          movie={movie}
          theatre={theatre}
          showtime={showtime}
        />
      ) : (
        <div className="flex justify-center items-center h-screen text-center">
          <p className="text-gray-500 text-lg">
            Missing movie, theatre, or showtime details. Please go back and try
            again.
          </p>
        </div>
      )}
    </div>
  );
};

export default SeatSelectionPage;
