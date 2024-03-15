import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import Calendar from '../components/Calendar';
import CreateEvent from '../components/CreateEvent';

const CalendarView: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    return (
        <>
            <NavBar />
            <div className="content-wrapper">
                <button className="create-event-btn" onClick={handleOpenModal}>Create Event</button>
                <div className="calendar-container">
                    <Calendar />
                </div>
            </div>
            <CreateEvent isOpen={isModalOpen} onClose={handleCloseModal} />
        </>
    );
}

export default CalendarView;