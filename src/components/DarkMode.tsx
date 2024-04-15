import { useContext, useState } from 'react';
import { UserContext } from 'src/App';
import { User } from '@classes/User';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from 'src/config/firebase';
import '@styles/NavBar.css';

const DarkModeToggle: React.FC = () => {
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const [user, setUser] = useContext(UserContext);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);

    const theme = localStorage.getItem('theme') === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    if (user) {
      updateDoc(doc(db, 'User', user.username), {theme: theme});
      setUser(new User(user.username, user.displayName, user.timezone, theme, user.privilege));
    } else {
      // Toggle dark mode class on any element in css by calling '.dark-mode' in front of it
      document.body.classList.toggle('dark-mode');
    }
  };

  return (
    <label className="switch">
      <input type="checkbox" onChange={toggleDarkMode} checked={darkMode} />
      <span className="slider round"></span>
    </label>
  );
};

export default DarkModeToggle;