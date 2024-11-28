import React, { useEffect, useState } from "react";
import axios from "axios";

const MoviesList = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/movies");
                setMovies(response.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch movies. Please try again.");
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    if (loading) {
        return <div className="text-center mt-10 text-lg text-gray-400">Loading movies...</div>;
    }

    if (error) {
        return <div className="text-center mt-10 text-red-500">{error}</div>;
    }

    return (
        <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-black min-h-screen py-10 text-white">
            <h1 className="text-center text-4xl md:text-6xl font-extrabold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-pink-500 to-red-500 drop-shadow-lg">
                Movies List
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-6 max-w-7xl mx-auto">
                {movies.map((movie, index) => (
                    <div
                        key={movie.movieId}
                        className={`bg-gray-800 text-white rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 animate-fadeIn delay-${index * 200}`}
                    >
                        <img
                            src={`http://localhost:8080/${movie.imagePath}`}
                            alt={movie.title}
                            className="w-full h-56 object-cover"
                        />
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-yellow-400">{movie.title}</h2>
                            <p className="text-gray-400 mt-3 text-sm">{movie.description}</p>
                            <button className="mt-6 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-gray-900 px-5 py-2 rounded-lg font-bold transition-all duration-300">
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MoviesList;
