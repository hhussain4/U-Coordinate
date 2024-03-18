import DarkModeToggle from '@components/DarkMode'
import '@styles/NavBar.css'

const NavBar: React.FC = () => {
    return (
        <div className="navbar">
            <div className="dropdown">
                <button className="dropbtn">
                    <i className="fa fa-bars"></i> {/* Stack icon */}
                </button>
                <div className="dropdown-content">
                    <a href="./calendar">Calendar</a>
                    <a href="#">Option 2</a>
                    <a href="#">Option 3</a>
                </div>
            </div>
            <img src='../../logo.png'></img>
            {/* Add navigation elements here */}
            <DarkModeToggle />
        </div>
    );
}

export default NavBar;
