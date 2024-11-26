import React from 'react';

const Navbar = () => {
    return (
        <nav className="bg-gray-900 text-white px-6 py-3 m-0 animate-fadeIn">
            <div className="flex justify-between items-center max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold">CinemaNext</h1>
                <ul className="flex space-x-6">
                    <li><a href="#now-showing" className="hover:text-yellow-500">Now Showing</a></li>
                    <li><a href="#upcoming" className="hover:text-yellow-500">Upcoming</a></li>
                    <li><a href="#contact" className="hover:text-yellow-500">Contact</a></li>
                </ul>
            </div>
        </nav>
    );
};


export default Navbar;
