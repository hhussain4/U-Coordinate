import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import Calendar from '../components/Calendar';
import CreateEvent from '../components/CreateEvent';

//new code below helps define an event type 

interface CalendarEvent {
    name: string;
    description: string;
    start: Date;
    end: Date;
    location: string;
    usersInvolved: string[];
  }


const CalendarView: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [events, setEvents] = useState<CalendarEvent[]>([]);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    //below is a handler to add a new event
    const addEvent = (newEvent: CalendarEvent) => {
        setEvents(prevEvents => [...prevEvents, newEvent]);
    };


    return (
        <>
            <NavBar />
            <div className="content-wrapper">
                <button className="create-event-btn" onClick={handleOpenModal}>Create Event</button>
                <div className="calendar-container">
                    <Calendar />
                </div>
            </div>
            <CreateEvent isOpen={isModalOpen} onClose={handleCloseModal} addEvent={addEvent} />
        </>
    );
}

export default CalendarView;