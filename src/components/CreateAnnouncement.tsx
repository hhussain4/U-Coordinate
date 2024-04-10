import { useContext, useState } from 'react';
import { Group } from '@classes/Group';
import { UserContext } from 'src/App';
import { Notification } from '@classes/Notification';
import '@styles/CreateForm.css';

interface CreateEventProps {
  onClose: () => void;
  group: Group;
}

interface ErrorData {
  title: string;
  description: string;
}

const CreateAnnouncement: React.FC<CreateEventProps> = ({ onClose, group }) => {
  const [user] = useContext(UserContext);
  const [errors, setErrors] = useState<ErrorData>({ title: "", description: "" });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errorMsg: ErrorData = { title: "", description: "" };

    const form = e.currentTarget;
    const title = (form.elements.namedItem('title') as HTMLInputElement).value.trim();
    const sender = `${user?.displayName}: ${user?.username}`;
    const description = (form.elements.namedItem('description') as HTMLTextAreaElement).value.trim();
    const priority = parseInt((form.elements.namedItem('priority') as HTMLSelectElement).value);

    //checking for empty fields
    if (!title) {
      errorMsg.title = "Please provide a title";
    }
    if (!description) {
      errorMsg.description = "Please provide a description";
    }

    setErrors(errorMsg);

    //only submits if there are no errors
    if (Object.values(errorMsg).every((error) => !error)) {
      const notification = new Notification(title, sender, description, priority);
      [...group.admins, ...group.members].forEach(e => notification.notify(e.username));
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close-btn" onClick={onClose}>X</button>
        <h2>Make Announcement</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Title:
            <input type="text" name="title" />
            {errors.title && <div className="err-msg">{errors.title}</div>}
          </label>
          <label>
            Description:
            <textarea name="description" />
            {errors.description && <div className="err-msg">{errors.description}</div>}
          </label>
          <label>
            Priority:
            <div className='select-options'>
              <select name='priority'>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </div>
          </label>
          <button className="submit-button" type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default CreateAnnouncement;
