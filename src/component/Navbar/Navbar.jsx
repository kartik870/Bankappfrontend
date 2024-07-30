import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext/AuthContext"; // Adjust the path accordingly
import "./Navbar.css";

const Navbar = () => {
  const { role, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="px-5 z-50 py-[.8rem] bg-[#E14220] lg:px-20 flex justify-between">
      <div className="lg:mr-10 cursor-pointer flex items-center space-x-4">
        <li className="logo font-semibold text-grey-300 text-2xl ml-10">
          <Link
            className="logo font-semibold text-grey-300 text-2xl ml-10"
            to="/"
            style={{ color: "white", textDecoration: "none" }}
          >
            VaultVerse
          </Link>
        </li>
      </div>
      <div className="flex items-center space-x-2 lg:space-x-10">
        {role && role !== "SUPERVISOR" && (
          <div className="relative inline-block text-left dropdown">
            <button
              onClick={toggleDropdown}
              className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Menu
            </button>
            <div
              className={`dropdown-menu ${isDropdownOpen ? "block" : "hidden"} origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5`}
            >
              <div className="py-1">
                <Link
                  to="/user-profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  View Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
