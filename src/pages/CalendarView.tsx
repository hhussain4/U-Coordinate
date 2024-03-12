import NavBar from '../components/NavBar';
import React from 'react';
import Calendar from '../components/Calendar'; // Assuming the path is correct

const CalendarView: React.FC = () => {
    return (
        <>
            <NavBar />
            <Calendar />
            
        </>
    );
}

export default CalendarView;
