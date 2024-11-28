import React from "react";

const SimpleMovieCard = ({ title, description, image }) => {
    return (
        <div className="bg-gray-800 text-white rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105">
            <img
                src={image}
                alt={title}
                className="w-full h-64 object-cover"
            />
            <div className="p-6">
                <h2 className="text-xl font-bold">{title}</h2>
                <p className="text-sm text-gray-300 mt-2">{description}</p>
                <button className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-bold transition-all duration-300">
                    Learn More
                </button>
            </div>
        </div>
    );
};

export default SimpleMovieCard;
