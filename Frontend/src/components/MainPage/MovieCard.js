import React from "react";
import { useNavigate } from "react-router-dom";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  if (!movie) {
    return null; // or display a placeholder
  }

  const showtimes = movie.showtimes || [];

  // Group showtimes by theatre name
  const theatreMap = showtimes.reduce((map, showtime) => {
    const key = showtime.theatreName;
    if (!map[key]) {
      map[key] = [];
    }
    map[key].push(showtime);
    return map;
  }, {});

  // Handle navigation to seat selection page
// Handle navigation to seat selection page
const handleShowtimeClick = (movie, theatre, showtime) => {
    navigate("/SeatSelection", {
      state: {
        movie, // Pass the entire movie object
        theatre, // Pass the theatre name
        showtime, // Pass the showtime
      },
    });
  };
  

  return (
    <div className="bg-gray-800 text-white rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105">
      {/* Movie Poster */}
      <img
        src={`http://localhost:8080/${movie.imagePath}`}
        alt={movie.title}
        className="w-full h-56 object-cover"
      />

      {/* Movie Details */}
      <div className="p-6">
        <h2 className="text-2xl font-bold text-yellow-400">{movie.title}</h2>
        <p className="text-gray-400 mt-3 text-sm">{movie.description}</p>

        {/* Display Showtimes */}
        {showtimes.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-yellow-300">Showtimes:</h3>
            {Object.entries(theatreMap).map(([theatreName, showtimes]) => (
              <div key={theatreName} className="mt-2">
                {/* Theatre Name */}
                <p className="font-bold text-yellow-200">{theatreName}</p>
                {/* Showtime Buttons */}
                <div className="flex flex-wrap mt-2">
                  {showtimes.map((showtime, index) => (
                    <button
                      key={index}
                      className="bg-yellow-500 text-black px-4 py-2 rounded-lg mr-2 mb-2"
                      onClick={() =>
                        handleShowtimeClick(movie, theatreName, showtime)
                        }
                    >
                      {new Date(showtime.showtime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View Details Button */}
        <button className="mt-6 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black px-5 py-2 rounded-lg font-bold transition-all duration-300">
          View Details
        </button>
      </div>
    </div>
  );
};

export default MovieCard;
