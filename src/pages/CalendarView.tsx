import React, { useState, useEffect } from 'react';
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
    const [currentDay, setCurrentDay] = useState(new Date()); // State for managing the current day
    const [events, setEvents] = useState<CalendarEvent[]>(() => {
        // Retrieve events from local storage or initialize as empty array
        const savedEvents = localStorage.getItem('events');
        return savedEvents ? JSON.parse(savedEvents) : [];
    });

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    // Handler to add a new event
    const addEvent = (newEvent: CalendarEvent) => {
        setEvents(prevEvents => {
            const updatedEvents = [...prevEvents, newEvent];
            // Save updated events to local storage
            localStorage.setItem('events', JSON.stringify(updatedEvents));
            return updatedEvents;
        });
    };

    return (
        <>
            <NavBar />
            <div className="content-wrapper">
                <button className="create-event-btn" onClick={handleOpenModal}>Create Event</button>
                <div className="calendar-container">
                    <Calendar currentDay={currentDay} events={events} />
                </div>
            </div>
            <CreateEvent isOpen={isModalOpen} onClose={handleCloseModal} addEvent={addEvent} />
        </>
    );
};

export default CalendarView;