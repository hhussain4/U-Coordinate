import { useState } from 'react';
import Calendar from '@components/Calendar';
import { CalendarEvent } from '@components/Calendar-days';
import CreateEvent from '@components/CreateEvent';
import EventDetails from '@components/EventDetails';
import '@styles/CalendarView.css';

const CalendarView: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [events, setEvents] = useState<CalendarEvent[]>(() => {
        // Retrieve events from local storage or initialize as empty array
        const savedEvents = localStorage.getItem('events');
        return savedEvents ? JSON.parse(savedEvents) : [];
    });

    // sort the events by start dates
    events.sort((event1, event2) => new Date(event1.start).valueOf() - new Date(event2.start).valueOf());

    //filter for events that start today
    const today = new Date();
    const todayEvents = events.filter(event => {
        const eventStart = new Date(event.start);
        return eventStart.getDate() === today.getDate() &&
            eventStart.getMonth() === today.getMonth() &&
            eventStart.getFullYear() === today.getFullYear();
    });

    //adding state to store the selected date's events
    const [selectedDayEvents, setSelectedDayEvents] = useState<CalendarEvent[]>(todayEvents);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    //below is a callback function that updates 'selectedDayEvents'
    const handleSelectDay = (events: CalendarEvent[]) => {
        setSelectedDayEvents(events);
    };

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
            <div className="content-wrapper">
                <div className="event-container">
                    <button className="create-event-btn" onClick={handleOpenModal}>Create Event</button>
                    <EventDetails events={selectedDayEvents} />
                </div>
                <div className="calendar-container">
                    <Calendar events={events} onSelectDay={handleSelectDay} />
                </div>
            </div>
            <CreateEvent isOpen={isModalOpen} onClose={handleCloseModal} addEvent={addEvent} />
        </>
    );
};

export default CalendarView;