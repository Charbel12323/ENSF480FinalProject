import React, { useEffect, useState } from "react";
import axios from "axios";

const MoviesList = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch movies data from the backend
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
        return <div className="text-center mt-10 text-lg">Loading movies...</div>;
    }

    if (error) {
        return <div className="text-center mt-10 text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-10">
            <h1 className="text-4xl font-bold text-center mb-10">Movies List</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {movies.map((movie) => (
                    <div
                        key={movie.movieId}
                        className="bg-white rounded-lg shadow-lg overflow-hidden"
                    >
                        <img
                            src={`http://localhost:8080/${movie.imagePath}`}
                            alt={movie.title}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <h2 className="text-2xl font-bold">{movie.title}</h2>
                            <p className="text-gray-600 mt-2">{movie.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MoviesList;
