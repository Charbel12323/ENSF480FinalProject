import React, { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "../MainPage/MovieCard";

const MoviesList = () => {
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [visibleMovies, setVisibleMovies] = useState(6); // Show 12 movies initially

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/movies");
                const moviesData = response.data;
                setMovies(moviesData);
                setFilteredMovies(moviesData); // Initially, filtered movies include all movies
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch movies. Please try again.");
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = movies.filter((movie) =>
            movie.title.toLowerCase().includes(query)
        );
        setFilteredMovies(filtered);
        setVisibleMovies(12); // Reset visible movies to 12 when searching
    };

    const showMoreMovies = () => {
        setVisibleMovies((prevVisible) => prevVisible + 12); // Show 12 more movies on each click
    };

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

            {/* Search Bar */}
            <div className="text-center mb-8">
                <input
                    type="text"
                    placeholder="Search for a movie..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="px-4 py-2 w-80 rounded-lg text-black border-2 border-gray-400 focus:border-yellow-500 outline-none transition-all duration-300"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-6 max-w-7xl mx-auto">
                {filteredMovies.slice(0, visibleMovies).map((movie) => (
                    <MovieCard key={movie.movieId} movie={movie} />
                ))}
            </div>

            {visibleMovies < filteredMovies.length && (
                <div className="text-center mt-10">
                    <button
                        onClick={showMoreMovies}
                        className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 rounded-lg font-bold shadow-lg transition-all duration-300 hover:scale-105"
                    >
                        Show More
                    </button>
                </div>
            )}
        </div>
    );
};

export default MoviesList;
