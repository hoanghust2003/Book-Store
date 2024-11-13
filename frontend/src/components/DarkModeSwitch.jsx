import React, { useState, useEffect } from 'react';
import { IoMoon, IoSunnyOutline } from 'react-icons/io5';

const DarkModeSwitch = () => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Retrieve the dark mode setting from localStorage
        const savedMode = localStorage.getItem('darkMode');
        return savedMode === 'true' || false;
      });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Save the dark mode setting to localStorage
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <button onClick={toggleDarkMode} className="p-2">
      {isDarkMode ? <IoMoon size={24} /> : <IoSunnyOutline size={24} />}
    </button>
  );
};

export default DarkModeSwitch;