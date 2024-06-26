import { useEffect, useState } from 'react';
import { Event } from '@classes/Event';
import { User } from '@classes/User';
import { Group, getGroups } from '@classes/Group';
import { db } from 'src/config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Multiselect from 'multiselect-react-dropdown';
import '@styles/CreateForm.css';

interface EventFormProps {
  event: Event;
  addEvent: (newEvent: Event) => void;
  updateEvent: (newEvent: Event) => void;
  onClose: () => void;
}

interface ErrorData {
  name: string;
  description: string;
  time: string;
  location: string;
  users: string;
}

const EventForm: React.FC<EventFormProps> = ({ event, addEvent, updateEvent, onClose }) => {
  const [errors, setErrors] = useState<ErrorData>({ name: "", description: "", time: "", location: "", users: "" });
  const [usernames, setUsernames] = useState<string[]>([]);
  const [groupTags, setGroupTags] = useState<String[]>([]);
  const [users, setUsers] = useState<User[]>(event.members);
  const [groups, setGroups] = useState<Group[]>(event.groups);
  const [start, setStart] = useState<Date>(event.start);
  const [end, setEnd] = useState<Date>(event.end);

  // multiselect adding and removing groups
  const addGroup = (prevList: string[], group: string) => {
    setGroups((prevGroups) => [...prevGroups, new Group(group)]);
  }
  const removeGroup = (prevList: string[], group: string) => {
    setGroups((prevGroups) => prevGroups.filter(g => g.tag != group));
  }
  // multiselect adding and removing users
  const addUser = (prevList: string[], user: string) => {
    setUsers((prevUsers) => [...prevUsers, new User(user)]);
  }
  const removeUser = (prevList: string[], user: string) => {
    setUsers((prevUsers) => prevUsers.filter(m => m.username != user));
  }

  // gets the usernames from the database
  useEffect(() => {
    const fetchUsernames = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'User'));
        const usernames = querySnapshot.docs.map(doc => doc.data().email);
        setUsernames(usernames);
      } catch (error) {
        console.error('Error fetching usernames:', error);
      }
    };
    const fetchGroupTags = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Group'));
        const tags = querySnapshot.docs.map(doc => doc.id);
        setGroupTags(tags);
      } catch (error) {
        console.error('Error fetching group tags:', error);
      }
    }

    fetchUsernames();
    fetchGroupTags();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errorMsg: ErrorData = { name: "", description: "", time: "", location: "", users: "" };

    const form = e.currentTarget;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim();
    const description = (form.elements.namedItem('description') as HTMLTextAreaElement).value.trim();
    const location = (form.elements.namedItem('location') as HTMLInputElement).value.trim();

    //checking for empty fields
    if (!name) {
      errorMsg.name = "Please provide an event name";
    }
    if (!description) {
      errorMsg.description = "Please provide a description";
    }
    if (!start || !end) {
      errorMsg.time = "Please provide a start and end date";
    }
    if (!location) {
      errorMsg.location = "Please provide a location";
    }
    if (groups.length === 0 && users.length === 0) {
      errorMsg.users = "Please provide at least one username";
    }

    //checking for valid inputs
    if (start >= end) {
      errorMsg.time = "Please provide a valid time range";
    }

    setErrors(errorMsg);

    //only submits if there are no errors
    if (Object.values(errorMsg).every((error) => !error)) {
      // retrieve the members and admins of the groups selected so that they can be notified
      const groupsList = await getGroups(groups.map(group => group.tag));
      const newEvent = new Event(name, description, start, end, location, groupsList, users, event.id);

      // only update event if it has an id and it is different from the previous event
      if (event.id) {
        if (!newEvent.equals(event)) updateEvent(newEvent);
      } else {
        addEvent(newEvent)
      }
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close-btn" onClick={onClose}>X</button>
        <h2>{event.id ? 'Edit' : 'Create'} Event</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Event Name:
            <input type="text" name="name" defaultValue={event.name} />
            {errors.name && <div className="err-msg">{errors.name}</div>}
          </label>
          <label>
            Event Description:
            <textarea name="description" defaultValue={event.description} />
            {errors.description && <div className="err-msg">{errors.description}</div>}
          </label>
          <label>
            Event Start:
            <input type="datetime-local" name="start" defaultValue={event.id ? event.start.toISOString().slice(0, 16) : ''} onChange={(e) => setStart(new Date(e.target.value))} />
          </label>
          <label>
            Event End:
            <input type="datetime-local" name="end" defaultValue={event.id ? end.toISOString().slice(0, 16) : ''} onChange={(e) => setEnd(new Date(e.target.value))} />
            {errors.time && <div className="err-msg">{errors.time}</div>}
          </label>
          <label>
            Event Location:
            <input type="text" name="location" defaultValue={event.location} />
            {errors.location && <div className="err-msg">{errors.location}</div>}
          </label>
          <label>
            Groups Involved:
            <Multiselect
              isObject={false}
              options={groupTags}
              selectedValues={event.groups.map(group => group.tag)}
              onSelect={addGroup}
              onRemove={removeGroup}
              hidePlaceholder={true}
            />
          </label>
          <label>
            Users Involved:
            <Multiselect
              isObject={false}
              options={usernames}
              selectedValues={event.members.map(member => member.username)}
              onSelect={addUser}
              onRemove={removeUser}
              hidePlaceholder={true}
            />
            {errors.users && <div className="err-msg">{errors.users}</div>}
          </label>
          <button className="submit-button" type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
