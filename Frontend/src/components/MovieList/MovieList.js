import React, { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "../MainPage/MovieCard";
import { Link } from "react-router-dom";

const MoviesList = () => {
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [visibleMovies, setVisibleMovies] = useState(6);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/movies");
                const moviesData = response.data;
                setMovies(moviesData);
                setFilteredMovies(moviesData);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch movies. Please try again.");
                setLoading(false);
            }
        };

        const fetchUser = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/users/me", {
                    withCredentials: true,
                });
                setUserId(response.data.id);
            } catch (err) {
                console.error("Failed to fetch user:", err);
            }
        };

        fetchMovies();
        fetchUser();
    }, []);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = movies.filter((movie) =>
            movie.title.toLowerCase().includes(query)
        );
        setFilteredMovies(filtered);
        setVisibleMovies(6);
    };

    const showMoreMovies = () => {
        setVisibleMovies((prevVisible) => prevVisible + 6);
    };

    if (loading) {
        return <div className="text-center mt-10 text-lg text-gray-400">Loading movies...</div>;
    }

    if (error) {
        return <div className="text-center mt-10 text-red-500">{error}</div>;
    }

    return (
        <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-black min-h-screen py-10 text-white">
            <Navbar userId={userId} />
            <h1 className="text-center text-4xl md:text-6xl font-extrabold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-pink-500 to-red-500 drop-shadow-lg">
                Movies List
            </h1>

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

const Navbar = ({ userId }) => {
    return (
        <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
            <div className="text-2xl font-bold">
                <Link to="/">MovieApp</Link>
            </div>
            <div>
                <Link to={`/account/${userId}`} className="hover:text-yellow-500 transition duration-300">
                    <span className="material-icons text-3xl">MyAccount</span>
                </Link>
            </div>
        </nav>
    );
};

export default MoviesList;
