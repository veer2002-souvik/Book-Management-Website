import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="h-screen flex items-center justify-between bg-gradient-to-r from-blue-900 to-purple-900 text-white">
      <div className="flex flex-col items-center justify-center flex-1">
        <img src="/book-icon.png" alt="book" className="w-24 h-24" />
        <h1 className="text-2xl mt-4 font-light">Manage your dreams</h1>
      </div>
      <div className="w-1/4 space-y-6 text-right pr-12">
        <Link to="/view" className="block hover:underline">view all</Link>
        <Link to="/add" className="block hover:underline">add new</Link>
        <Link to="/about" className="block hover:underline">about</Link>
        <Link to="/" onClick={(e) => e.preventDefault()} className="block hover:underline">exit</Link>
      </div>
    </div>
  );
}

export default Home;