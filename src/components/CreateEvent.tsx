import React from 'react';
import './CreateEvent.css'; // Assuming this is the path to your CSS file for the modal

interface CreateEventProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateEvent: React.FC<CreateEventProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would extract form data, call an API, or update local state
    console.log('Form submitted');
    onClose(); // Close the modal after submitting
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close-btn" onClick={onClose}>X</button>
        <h2>Create Event</h2>
        <form onSubmit={handleSubmit}> /* this allows us to capture user input for a new event. Allows us to also include more complex event handling later like backend work or API stuff  */
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
}

export default CreateEvent;