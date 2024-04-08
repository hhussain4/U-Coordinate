import { useContext, useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, getDoc, onSnapshot, query, where } from 'firebase/firestore';
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
        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            const events = querySnapshot.docs.map(async (doc) => {
                const data = doc.data();
                const members = await getUsers(data.members);
                return new Event(data.name, data.description, new Date(data.start), new Date(data.end), data.location, members, doc.id,
                    data.recurrence, data.recur_times);
            });
            const resolvedEvents = await Promise.all(events);
            const sortedEvents = resolvedEvents.sort((event1, event2) => new Date(event1.start).valueOf() - new Date(event2.start).valueOf());
            setEvents(sortedEvents);
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
            await addDoc(collection(db, 'Event'), {
                name: newEvent.name,
                description: newEvent.description,
                start: newEvent.start.getTime(),
                end: newEvent.end.getTime(),
                location: newEvent.location,
                members: members,
                recurrence: newEvent.recurrence,
                recur_times: newEvent.recurTimes
            });
            // notify all members of the event's creation
            const notification = newEvent.getCreationNotification(user!, 3);
            members.forEach(username => notification.notify(username));
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
            // notify users of event deletion
            const notification = eventToDelete.getDeleteNotification(user!, 3);
            eventToDelete.members.map(member => member.username).forEach((username => notification.notify(username)));
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

// returns list of users with their usernames and displaynames
export async function getUsers(usernames: string[]): Promise<User[]> {
    const displayNames = await Promise.all(usernames.map(async (username: string) => {
        const user = await getDoc(doc(db, 'User', username));

        if (user.exists()) {
            return new User(username, user.data().display_name);
        } else {
            return new User(username, username);
        }
    }));
    return displayNames;
}

export default CalendarView;