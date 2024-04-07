import { useContext, useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from 'src/config/firebase';
import { Event } from '@classes/Event';
import { UserContext } from 'src/App';
import { User } from '@classes/User';
import Calendar from '@components/Calendar';
import CreateEvent from '@components/CreateEvent';
import EventDetails from '@components/EventDetails';
import '@styles/CalendarView.css';

const CalendarView: React.FC = () => {
    const [user] = useContext(UserContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [events, setEvents] = useState<Event[]>([]);

    // retrieves events only if the user is logged in
    useEffect(() => {
        if (!user) {
            setEvents([]);
            return;
        } 
        const q = query(collection(db, 'Event'), where('members', "array-contains", user?.username));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const events = querySnapshot.docs.map(doc => {
                const data = doc.data();
                const members = data.members.map((member: any) => new User(member.display_name));
                return new Event(data.name, data.description, new Date(data.start), new Date(data.end), data.location, members, doc.id,
                        data.recurrence, data.recur_times);
            }).sort((event1, event2) => new Date(event1.start).valueOf() - new Date(event2.start).valueOf());
            setEvents(events);
        });

        () => unsubscribe();
    }, [user]);

    //filter for events that start today
    const today = new Date();
    const todayEvents = events.filter(event => {
        const eventStart = new Date(event.start);
        return eventStart.getDate() === today.getDate() &&
            eventStart.getMonth() === today.getMonth() &&
            eventStart.getFullYear() === today.getFullYear();
    });

    //adding state to store the selected date's events
    const [selectedDayEvents, setSelectedDayEvents] = useState<Event[]>(todayEvents);

    const handleOpenModal = () => {
        if (!user) {
            alert('Sign in to use this feature');
            return;
        }
        setIsModalOpen(true);
    }
    const handleCloseModal = () => setIsModalOpen(false);

    const handleSelectDay = (events: Event[]) => {
        setSelectedDayEvents(events);
    };

    // Handler to add a new event
    const addEvent = async (newEvent: Event) => {
        try {
            const members = newEvent.members.map(member => member.username);
            const doc = await addDoc(collection(db, 'Event'), {
                name: newEvent.name,
                description: newEvent.description,
                start: newEvent.start.getTime(),
                end: newEvent.end.getTime(),
                location: newEvent.location,
                members: members,
                recurrence: newEvent.recurrence,
                recur_times: newEvent.recurTimes
            });
            newEvent.id = doc.id;
            setEvents(prevEvents => [...prevEvents, newEvent]);
        } catch (error) {
            console.log(error);
            alert('Error occured while adding event');
        }
    };

    //below are methods to handle editing and deleting events
    const handleEditEvent = (eventToEdit: Event) => {
        // Implement code for edit functionality here
    };

    const handleDeleteEvent = async (eventToDelete: Event) => {
        try {
            await deleteDoc(doc(db, 'Event', eventToDelete.id));
            setEvents((prevEvents) => prevEvents.filter(event => event !== eventToDelete));
            setSelectedDayEvents((prevSelectedDayEvents) => prevSelectedDayEvents.filter(event => event !== eventToDelete));
        } catch (error) {
            console.log(error);
            alert("Error occured while deleting event");
        }
    };

    return (
        <>
            <div className="content-wrapper">
                <div className="event-container">
                    <button className="create-event-btn" onClick={handleOpenModal}>Create Event</button>
                    <EventDetails events={selectedDayEvents} onEdit={handleEditEvent} onDelete={handleDeleteEvent} />
                </div>
                <div className="calendar-container">
                    <Calendar events={events} onSelectDay={handleSelectDay} />
                </div>
            </div>
            {isModalOpen && <CreateEvent onClose={handleCloseModal} addEvent={addEvent} />}
        </>
    );
};

export default CalendarView;