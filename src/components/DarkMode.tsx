import { useState } from 'react';
import '@styles/NavBar.css';

const DarkModeToggle: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
    document.body.classList.toggle('dark-mode'); // Toggle dark mode class on any element in css by calling '.dark-mode' in front of it
  };

  return (
    <label className="switch">
      <input type="checkbox" onChange={toggleDarkMode} checked={darkMode} />
      <span className="slider round"></span>
    </label>
  );
};

export default DarkModeToggle;