import '@styles/CreateEvent.css';

interface CalendarEvent {
  name: string;
  description: string;
  start: Date;
  end: Date;
  location: string;
  usersInvolved: string[];
}

interface CreateEventProps {
  isOpen: boolean;
  onClose: () => void;
  addEvent: (newEvent: CalendarEvent) => void;
}

const CreateEvent: React.FC<CreateEventProps> = ({ isOpen, onClose, addEvent }) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = form.elements.namedItem('name') as HTMLInputElement;
    const description = form.elements.namedItem('description') as HTMLTextAreaElement;
    const start = form.elements.namedItem('start') as HTMLInputElement;
    const end = form.elements.namedItem('end') as HTMLInputElement;
    const location = form.elements.namedItem('location') as HTMLInputElement;
    const users = form.elements.namedItem('users') as HTMLInputElement;

    if (name && description && start && end && location && users) {
      const newEvent: CalendarEvent = {
        name: name.value,
        description: description.value,
        start: new Date(start.value),
        end: new Date(end.value),
        location: location.value,
        usersInvolved: users.value.split(','),
      };
      addEvent(newEvent);
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close-btn" onClick={onClose}>X</button>
        <h2>Create Event</h2>
        <form onSubmit={handleSubmit}> {/* this allows us to capture user input for a new event. Allows us to also include more complex event handling later like backend work or API stuff  */}
          <label>
            Event Name:
            <input type="text" name="name" />
          </label>
          <label>
            Event Description:
            <textarea name="description" />
          </label>
          <label>
            Event Start:
            <input type="datetime-local" name="start" />
          </label>
          <label>
            Event End:
            <input type="datetime-local" name="end" />
          </label>
          <label>
            Event Location:
            <input type="text" name="location" />
          </label>
          <label>
            Users Involved:
            <input type="text" name="users" />
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;

function addEvent(newEvent: CalendarEvent) {
  throw new Error('Function not implemented.');
}
