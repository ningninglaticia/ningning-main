/* eslint-disable react/prop-types */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import ProfileInfo from '../Cards/ProfileInfo';
import SearchBar from '../SearchBar/SearchBar';

const Navbar = ({ userInfo }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  // Add scroll listener
  useState(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = () => {
    // Implement search functionality
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const onClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-md shadow-lg'
          : 'bg-white shadow-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center"
          >
            <Link to="/" className="flex items-center space-x-3">
              <h2 className="text-xl font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ระบบเอกสารออนไลน์
              </h2>
            </Link>
          </motion.div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink to="/">หน้าแรก</NavLink>
            <NavLink to="/my-documents">เอกสารของฉัน</NavLink>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-4">
            <SearchBar
              value={searchQuery}
              onChange={({ target }) => setSearchQuery(target.value)}
              handleSearch={handleSearch}
              onClearSearch={onClearSearch}
              className="w-full"
            />
          </div>

          {/* Profile Info */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center"
          >
            <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
          </motion.div>
        </div>
      </div>

    </motion.nav>
  );
};

// NavLink Component
const NavLink = ({ to, children }) => (
  <motion.div whileHover={{ scale: 1.05 }}>
    <Link
      to={to}
      className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
    >
      {children}
    </Link>
  </motion.div>
);

export default Navbar;
