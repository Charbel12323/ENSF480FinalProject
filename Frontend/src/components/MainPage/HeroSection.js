"use client";
import React from "react";
import MovieCard from "./MovieCard"; // Adjust the path based on your file structure
import Inception from "../../assets/images/inception.png";
import InfinityWar from "../../assets/images/InfinityWar.webp";
import intersteller from "../../assets/images/intersteller.webp";
import { TextGenerateEffect } from "../ui/text-generate-effect";
import { Link } from 'react-router-dom';

const words = `Book your tickets now and dive into the world of cinema.`;
const HeroSection = () => {
    const movies = [
        {
            title: "Avengers: Endgame",
            description: "The epic conclusion to the Infinity Saga.",
            image: Inception,
        },
        {
            title: "The Dark Knight",
            description: "The fight for Gotham continues.",
            image: InfinityWar,
        },
        {
            title: "Inception",
            description: "A mind-bending journey through dreams.",
            image: intersteller,
        },
    ];

    return (
        <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-black h-screen flex flex-col items-center text-white">
            {/* Hero Section Text */}
            <div className="text-center mb-12 mt-20 animate-slideUp">
                <h1 className="font-poppins text-4xl md:text-6xl font-extrabold mb-4 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-pink-500 to-red-500 drop-shadow-lg">
                    Experience Movies Like Never Before
                </h1>

                <p className="text-lg md:text-xl mb-6 text-gray-200">
                    <TextGenerateEffect duration={2} filter={false} words={words} />
                </p>
                <Link to="/MoviePage">
                    <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 rounded-lg font-bold shadow-lg transition-all duration-300 hover:scale-105">
                        Book Now
                    </button>
                </Link>
            </div>

            {/* Movie Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-6 max-w-7xl">
                {movies.map((movie, index) => (
                    <div
                        key={index}
                        className={`animate-fadeIn delay-${index * 300}`}
                    >
                        <MovieCard
                            title={movie.title}
                            description={movie.description}
                            image={movie.image}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HeroSection;
