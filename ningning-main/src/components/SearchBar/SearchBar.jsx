/* eslint-disable react/prop-types */
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX } from 'react-icons/fi';

const SearchBar = ({ value, onChange, handleSearch, onClearSearch, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative ${className}`}
    >
      <div className="relative">
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder="ค้นหาเอกสาร..."
    className="w-full pl-10 pr-10 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
  />

  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors duration-200"
    onClick={handleSearch}
  >
    <FiSearch className="w-5 h-5" />
  </motion.button>

  <AnimatePresence>
    {value && (
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{
          opacity: 1,
          x: 0,
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 25
          }
        }}
        exit={{
          opacity: 0,
          x: 20,
          transition: { duration: 0.2 }
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors duration-200"
        onClick={onClearSearch}
      >
        <FiX className="w-5 h-5" />
      </motion.button>
    )}
  </AnimatePresence>
</div>
    </motion.div>
  );
};

export default SearchBar;
