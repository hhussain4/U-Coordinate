import { useContext, useState } from 'react';
import { UserContext } from 'src/App';
import { User } from '@classes/User';
import '@styles/NavBar.css';

const DarkModeToggle: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useContext(UserContext);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
    const newUser = new User(
      user?.username,
      user?.displayName,
      user?.timezone,
      darkMode ? 'light' : 'dark',
      user?.privilege
    );
    setUser(newUser)
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