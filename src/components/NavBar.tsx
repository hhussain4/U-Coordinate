import DarkModeToggle from '@components/DarkMode'
import { useState, useEffect, useRef } from 'react';
import { User, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import '@styles/NavBar.css'

interface NavBarProps {
    user: User | null;
}

const NavBar: React.FC<NavBarProps> = ({ user }) => {
    const [open, setOpen] = useState(false);
    const handleDropdown = () => setOpen(!open);
    
    // makes user menu collapse when clicking outside the menu
    const userMenu = useRef<HTMLDivElement>(null);
    useEffect(() => {
        let closeDropdown = (e: MouseEvent) => {
            if(!userMenu.current?.contains(e.target as Node)) {
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
                </div>
            </div>
            <img src='../../logo.png'></img>
            <div className='dark-mode-toggle'>
                <DarkModeToggle />
            </div>
            <div className='dropdown' ref={userMenu}>
                <button className="user-button" onClick={handleDropdown}>
                    <i className="fa-solid fa-user" />
                </button>
                {open &&
                    <div className="user-options">
                        <a href="./settings">Settings</a>
                        <a href="./" onClick={logout}>{user? "Log out": "Sign in"}</a>
                    </div>}
            </div>
        </div>
    );
}

export default NavBar;
