import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-black text-white p-4 flex justify-between items-center border-b border-gray-700">
      <div className="text-lg font-bold tracking-widest">180 BY BINHO</div>
      <div className="hidden md:flex space-x-6 uppercase text-sm">
        <a href="#" className="hover:text-gray-400">Blog</a>
        <a href="#" className="hover:text-gray-400">Sobre</a>
        <a href="#" className="hover:text-gray-400">Contactos</a>
      </div>
    </nav>
  );
};

export default Navbar;
