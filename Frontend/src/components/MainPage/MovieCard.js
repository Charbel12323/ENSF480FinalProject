import React from "react";

const MovieCard = ({ title, description, image }) => {
    return (
        <div className="bg-gray-800 text-white rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 animate-scale">
            <img
                src={image}
                alt={title}
                className="w-full h-56 object-cover"
            />
            <div className="p-6">
                <h2 className="text-2xl font-bold text-yellow-400">{title}</h2>
                <p className="text-gray-400 mt-3 text-sm">{description}</p>
                <button className="mt-6 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-gray-900 px-5 py-2 rounded-lg font-bold transition-all duration-300">
                    View Details
                </button>
            </div>
        </div>
    );
};

export default MovieCard;
