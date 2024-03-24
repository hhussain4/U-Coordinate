import DarkModeToggle from '@components/DarkMode'
import { useState, useEffect, useRef } from 'react';
import '@styles/NavBar.css'

const NavBar: React.FC = () => {
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
                    <i className="fa-solid fa-user"></i>
                </button>
                {open &&
                    <div className="user-options">
                        <a href="./settings">Settings</a>
                        <a href="./">Logout</a>
                    </div>}
            </div>
        </div>
    );
}

export default NavBar;
