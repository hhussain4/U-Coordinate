import { useEffect, useState } from 'react';
import { Event } from '@classes/Event';
import { User } from '@classes/User';
import { db } from 'src/config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Multiselect from 'multiselect-react-dropdown';
import '@styles/CreateForm.css';

interface CreateEventProps {
  onClose: () => void;
  addEvent: (newEvent: Event) => void;
}

interface ErrorData {
  name: string;
  description: string;
  time: string;
  location: string;
  users: string;
}

const CreateEvent: React.FC<CreateEventProps> = ({ onClose, addEvent }) => {
  const [errors, setErrors] = useState<ErrorData>({ name: "", description: "", time: "", location: "", users: "" });
  const [usernames, setUsernames] = useState<string[]>([]);
  const [users, setUser] = useState<User[]>([]);

  const addUser = (prevList: string[], user: string) => {
    setUser((prevUsers) => [...prevUsers, new User(user, user)]);
  }
  const removeUser = (prevList: string[], user: string) => {
    setUser((prevUsers) => prevUsers.filter(m => m.username != user));
  }

  // gets the usernames from the database
  useEffect(() => {
    const fetchUsernames = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'User'));
        const usernames = querySnapshot.docs.map(doc => doc.id);
        setUsernames(usernames);
      } catch (error) {
        console.error('Error fetching usernames:', error);
      }
    };

    fetchUsernames();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errorMsg: ErrorData = { name: "", description: "", time: "", location: "", users: "" };

    const form = e.currentTarget;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim();
    const description = (form.elements.namedItem('description') as HTMLTextAreaElement).value.trim();
    const start = (form.elements.namedItem('start') as HTMLInputElement).value.trim();
    const end = (form.elements.namedItem('end') as HTMLInputElement).value.trim();
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
    if (users.length === 0) {
      errorMsg.users = "Please provide at least one username";
    }

    //checking for valid inputs
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (start >= end) {
      errorMsg.time = "Please provide a valid time range";
    }

    setErrors(errorMsg);

    //only submits if there are no errors
    if (Object.values(errorMsg).every((error) => !error)) {
      const newEvent = new Event(name, description, startDate, endDate, location, users);
      addEvent(newEvent);
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close-btn" onClick={onClose}>X</button>
        <h2>Create Event</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Event Name:
            <input type="text" name="name" />
            {errors.name && <div className="err-msg">{errors.name}</div>}
          </label>
          <label>
            Event Description:
            <textarea name="description" />
            {errors.description && <div className="err-msg">{errors.description}</div>}
          </label>
          <label>
            Event Start:
            <input type="datetime-local" name="start" />
          </label>
          <label>
            Event End:
            <input type="datetime-local" name="end" />
            {errors.time && <div className="err-msg">{errors.time}</div>}
          </label>
          <label>
            Event Location:
            <input type="text" name="location" />
            {errors.location && <div className="err-msg">{errors.location}</div>}
          </label>
          <label>
            Users Involved:
            <Multiselect
              isObject={false}
              options={usernames}
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

export default CreateEvent;
