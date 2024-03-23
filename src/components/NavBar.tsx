import DarkModeToggle from '@components/DarkMode'
import '@styles/NavBar.css'
import { Link } from 'react-router-dom';

const NavBar: React.FC = () => {
    return (
        <div className="navbar">
            <div className="dropdown">
                <button className="dropbtn">
                    <i className="fa fa-bars"></i> {/* Stack icon */}
                </button>
                <div className="dropdown-content">
                    <a href="./calendar">Calendar</a>
                    <a href="./groups">Groups</a>
                    <a href="./support">Support</a>
                </div>
            </div>
            <img src='../../logo.png'></img>
            {/* Add navigation elements here */}
            <div className="login-button"><Link to="/">Login</Link></div>
            <div className='dark-mode-toggle'>
                <DarkModeToggle />
            </div>
            
        </div>
    );
}

export default NavBar;
