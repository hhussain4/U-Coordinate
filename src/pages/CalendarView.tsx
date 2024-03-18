import { useState } from 'react';
import Calendar from '@components/Calendar';
import CreateEvent from '@components/CreateEvent';
import EventDetails from '@components/EventDetails'; 

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
    //adding state to store the selected date's events
    const [selectedDayEvents, setSelectedDayEvents] = useState<CalendarEvent[]>([]);

    

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
            {/* Split view: Left side for event details, right side for calendar */}
            <div className="event-details-container">
                <EventDetails events={selectedDayEvents} />
            </div>
            <div className="calendar-container">
                <button className="create-event-btn" onClick={handleOpenModal}>Create Event</button>
                <Calendar currentDay={currentDay} events={events} onSelectDay={handleSelectDay} />
            </div>
        </div>
        <CreateEvent isOpen={isModalOpen} onClose={handleCloseModal} addEvent={addEvent} />
    </>
    );
};

export default CalendarView;