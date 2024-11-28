import React from "react";

const MovieCard = ({ movie }) => {
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

    return (
        <div className="bg-gray-800 text-white rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105">
            <img
                src={`http://localhost:8080/${movie.imagePath}`}
                alt={movie.title}
                className="w-full h-56 object-cover"
            />
            <div className="p-6">
                <h2 className="text-2xl font-bold text-yellow-400">{movie.title}</h2>
                <p className="text-gray-400 mt-3 text-sm">{movie.description}</p>

                {/* Display Showtimes */}
                {showtimes.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold text-yellow-300">Showtimes:</h3>
                        {Object.entries(theatreMap).map(([theatreName, showtimes]) => (
                            <div key={theatreName} className="mt-2">
                                <p className="font-bold text-yellow-200">{theatreName}</p>
                                <div className="flex flex-wrap mt-2">
                                    {showtimes.map((showtime) => (
                                        <button
                                            key={showtime.showtimeId}
                                            className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 m-1 rounded-md font-semibold transition-all duration-200"
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

                <button className="mt-6 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black px-5 py-2 rounded-lg font-bold transition-all duration-300">
                    View Details
                </button>
            </div>
        </div>
    );
};

export default MovieCard;
