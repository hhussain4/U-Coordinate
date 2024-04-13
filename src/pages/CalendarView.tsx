import { useContext, useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, onSnapshot, or, query, updateDoc, where } from 'firebase/firestore';
import { db } from 'src/config/firebase';
import { Event } from '@classes/Event';
import { GroupContext, UserContext } from 'src/App';
import { User, getUsers } from '@classes/User';
import { getGroups } from '@classes/Group';
import Calendar from '@components/Calendar';
import EventForm from '@components/EventForm';
import EventDetails from '@components/EventDetails';
import '@styles/CalendarView.css';

const CalendarView: React.FC = () => {
    const [user] = useContext(UserContext);
    const [groups] = useContext(GroupContext);
    const defaultEvent = new Event();
    defaultEvent.addMember(new User(user?.username));

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [events, setEvents] = useState<Event[]>([]);
    // this controls what is filled out on the form when creating/editing an event
    const [createEvent, setCreateEvent] = useState<Event>(defaultEvent);
    const [selectedDayEvents, setSelectedDayEvents] = useState<Event[]>([]);

    // retrieves events only if the user is logged in
    useEffect(() => {
        if (!user) {
            setEvents([]);
            return;
        }
        // the query to retrieve events where the user is a member or events that includes groups that the user is in (if they are in any)
        let q = query(collection(db, 'Event'), or(where('members', "array-contains", user?.username)));
        if (!(groups.length === 0)) {
            q = query(collection(db, 'Event'), or(where('members', "array-contains", user?.username),
                where('groups', 'array-contains-any', groups.map(group => group.tag))));
        }

        let initialLoad = true;
        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            const events = querySnapshot.docs.map(async (doc) => {
                const data = doc.data();
                const [groups, members] = await Promise.all([getGroups(data.groups), getUsers(data.members)]);
                return new Event(data.name, data.description, new Date(data.start), new Date(data.end), data.location, groups, members,
                    doc.id, data.recurrence, data.recur_times);
            });
            const resolvedEvents = await Promise.all(events);
            const sortedEvents = resolvedEvents.sort((event1, event2) => new Date(event1.start).valueOf() - new Date(event2.start).valueOf());
            setEvents(sortedEvents);

            // diplays todays events on initial load of the calendar page
            if (initialLoad) {
                setSelectedDayEvents(getEventsOnDate(sortedEvents, new Date()));
                initialLoad = false;
            }
        });

        () => unsubscribe();
    }, [user]);

    // functions for opening and closing event form
    const handleOpenModal = () => {
        if (!user) {
            alert('Sign in to use this feature');
            return;
        }
        setIsModalOpen(true);
        setCreateEvent(defaultEvent);
    }
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // handles the edit event modal
    const handleEditEvent = (event: Event) => {
        setCreateEvent(event);
        setIsModalOpen(true);
    };

    const handleSelectDay = (events: Event[]) => {
        setSelectedDayEvents(events);
    };

    // Handler to add a new event
    const addEvent = async (newEvent: Event) => {
        try {
            const groups = newEvent.groups.map(group => group.tag);
            const members = newEvent.members.map(member => member.username);
            await addDoc(collection(db, 'Event'), {
                name: newEvent.name,
                description: newEvent.description,
                start: newEvent.start.getTime(),
                end: newEvent.end.getTime(),
                location: newEvent.location,
                groups: groups,
                members: members,
                recurrence: newEvent.recurrence,
                recur_times: newEvent.recurTimes
            });
            // notify all members of the event's creation
            const notification = newEvent.getCreationNotification(user!, 3);
            newEvent.getAttendees().forEach(attendee => notification.notify(attendee.username));
        } catch (error) {
            console.log(error);
            alert('Error occured while adding event');
        }
    };

    // below are methods to update and delete events
    const updateEvent = async (event: Event) => {
        try {
            const groups = event.groups.map(group => group.tag);
            const members = event.members.map(member => member.username);
            await updateDoc(doc(db, 'Event', event.id), {
                name: event.name,
                description: event.description,
                start: event.start.getTime(),
                end: event.end.getTime(),
                location: event.location,
                groups: groups,
                members: members,
                recurrence: event.recurrence,
                recur_times: event.recurTimes
            });
            // remove the event from the selected days events
            const replacedEvent = selectedDayEvents.find(e => e.id === event.id);
            setSelectedDayEvents((prevSelectedDayEvents) => prevSelectedDayEvents.filter(e => e.id !== event.id));
            // add it back if it still starts on the same day
            if (new Date(replacedEvent!.start).toDateString() === new Date(event.start).toDateString()) {
                setSelectedDayEvents(prev => [...prev, event]);
            }
            // notify all attendees of updated event
            const notification = event.getUpdateNotification(user!, 3);
            event.getAttendees().forEach(attendee => notification.notify(attendee.username));
        } catch (error) {
            console.log(error);
            alert("Error occured while updating event");
        }
    };

    const deleteEvent = async (event: Event) => {
        try {
            await deleteDoc(doc(db, 'Event', event.id));
            // notify attendees of event deletion
            const notification = event.getDeleteNotification(user!, 3);
            event.getAttendees().forEach(attendee => notification.notify(attendee.username));
            setSelectedDayEvents((prevSelectedDayEvents) => prevSelectedDayEvents.filter(event => event !== event));
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
                    <EventDetails events={selectedDayEvents} onEdit={handleEditEvent} onDelete={deleteEvent} />
                </div>
                <div className="calendar-container">
                    <Calendar events={events} onSelectDay={handleSelectDay} />
                </div>
            </div>
            {isModalOpen && <EventForm onClose={handleCloseModal} addEvent={addEvent} updateEvent={updateEvent} event={createEvent} />}
        </>
    );
};

// returns a list of events happening on a certain day
function getEventsOnDate(eventlist: Event[], day: Date) {
    return eventlist.filter(event => {
        const eventStart = new Date(event.start);
        return eventStart.getDate() === day.getDate() &&
            eventStart.getMonth() === day.getMonth() &&
            eventStart.getFullYear() === day.getFullYear();
    });
}

export default CalendarView;