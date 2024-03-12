import React from 'react';
import './NavBar.css'
const NavBar: React.FC = () => {
    return (
        <div className="navbar">
            <div className="dropdown">
                <button className="dropbtn">
                    <i className="fa fa-bars"></i> {/* Stack icon */}
                </button>
                <div className="dropdown-content">
                    <a href="#">Option 1</a>
                    <a href="#">Option 2</a>
                    <a href="#">Option 3</a>
                </div>
            </div>
            <img src = '../../logo.png'></img>
            {/* Add navigation elements here */}
        </div>
    );
}

export default NavBar;
