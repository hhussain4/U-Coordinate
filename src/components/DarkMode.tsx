import React, { useState } from 'react';


const DarkModeToggle: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);

    // Apply CSS class to toggle dark mode
    const mode = newMode ? 'dark' : 'light';
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(`${mode}-mode`);
  };

  return (
    <label className="switch">
      <input type="checkbox" onChange={toggleDarkMode} checked={darkMode} />
      <span className="slider round"></span>
    </label>
  );
};

export default DarkModeToggle;