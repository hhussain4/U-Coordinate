import { useState, useEffect, useRef, useContext } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { UserContext } from 'src/App';
import Inbox from '@components/Inbox';
import '@styles/NavBar.css'

const NavBar: React.FC = () => {
    const [user] = useContext(UserContext);
    const [open, setOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');
    const handleDropdown = () => setOpen(!open);

    // makes user menu collapse when clicking outside the menu
    const userMenu = useRef<HTMLDivElement>(null);
    useEffect(() => {
        let closeDropdown = (e: MouseEvent) => {
            if (!userMenu.current?.contains(e.target as Node)) {
                setOpen(false);
            }
        }

        document.addEventListener('mousedown', closeDropdown);
        return () => {
            document.removeEventListener('mousedown', closeDropdown);
        }
    });

    const logout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        try {
            await signOut(auth);
            window.location.href = '/';
            console.log("Signed out");
        } catch {
            console.log("Error while signing out");
        }
    }

    useEffect(() => {
        setDarkMode(localStorage.getItem('theme') === 'dark');
    }, [user]);

    return (
        <div className="navbar">
            <div className="dropdown">
                <button className="dropbtn">
                    <i className="fa fa-bars"></i>
                </button>
                <div className="dropdown-content">
                    <a href="./calendar">Calendar</a>
                    <a href="./groups">Groups</a>
                    <a href="./support">Support</a>
                    <a href="./tickets">Tickets</a>
                </div>
            </div>
            <div className='logo'>
                {darkMode ? <img src='../../darkLogo.png'></img> : <img src='../../logo.png'></img>}
            </div>
            {user && <Inbox />}
            <div className='dropdown' ref={userMenu}>
                <button className="user-button" onClick={handleDropdown}>
                    <i className="fa-solid fa-user" />
                </button>
                {open &&
                    <div className="user-options">
                        {user && <a href="./settings">Settings</a>}
                        <a href="./" onClick={logout}>{user ? "Log out" : "Sign in"}</a>
                    </div>}
            </div>
        </div>
    );
}

export default NavBar;
