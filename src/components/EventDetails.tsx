import '@styles/EventDetails.css';
import { CalendarEvent } from './Calendar-days';
import { useEffect, useRef, useState } from 'react';

interface EventDetailsProps {
  events: CalendarEvent[];
  onEdit: (event: CalendarEvent) => void;
  onDelete: (event: CalendarEvent) => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({ events, onEdit, onDelete }) => {

  // Makes open state of all the events initially set to false
  const [openStates, setOpenStates] = useState<boolean[]>(Array(events.length).fill(false));
  const handleDropdown = ((index: number) => {
    const updatedOpenStates = [...openStates];
    updatedOpenStates[index] = !updatedOpenStates[index];
    setOpenStates(updatedOpenStates);
  });

  // Listens for when you click away from the event menu
  const eventMenus = useRef<(HTMLDivElement | null)[]>(Array(events.length).fill(null));
  useEffect(() => {
    const closeDropdown = (e: MouseEvent) => {
      const updatedOpenStates = [...openStates];
      eventMenus.current.forEach((element, i) => {
        if (!element?.contains(e.target as Node)) {
          updatedOpenStates[i] = false;
        }
      });
      setOpenStates(updatedOpenStates);
    };

    document.addEventListener('mousedown', closeDropdown);
    return () => {
      document.removeEventListener('mousedown', closeDropdown);
    };
  }, [openStates]);

  return (
    <div className="event-details">
      {events.map((event, index) => (
        <div key={index} className="event-box">
          <div className='event-header'>
            <h3>{event.name}</h3>
            <div className='event-dropdown' ref={e => eventMenus.current[index] = e}>
              <button className="event-button" onClick={() => handleDropdown(index)}>
                <i className="fa-solid fa-ellipsis"></i>
              </button>
              {openStates[index] &&
                <div className="event-options">
                  <button className="event-option-btn" onClick={() => onEdit(event)}> Edit </button>
                  <button className="event-option-btn" onClick={() => onDelete(event)}> Delete </button>
                </div>}
            </div>
          </div>
          <table>
            <tr>
              <td>Description:</td>
              <td>{event.description}</td>
            </tr>
            <tr>
              <td>Start:</td>
              <td>{formatDate(new Date(event.start), new Date(event.end))}</td>
            </tr>
            <tr>
              <td>End:</td>
              <td>{formatDate(new Date(event.end), new Date(event.start))}</td>
            </tr>
            <tr>
              <td>Location:</td>
              <td>{event.location}</td>
            </tr>
            <tr>
              <td>Members:</td>
              <td>{event.usersInvolved}</td>
            </tr>
          </table>
        </div>
      ))}
    </div>
  );
};

function formatDate(date: Date, compareDate: Date) {
  let dateString = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

  // if the dates do not fall on the same day
  if (date.getDate() != compareDate.getDate() ||
    date.getMonth() != compareDate.getMonth() ||
    date.getFullYear() != compareDate.getFullYear()) {
    dateString = `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at ${dateString}`;
  }

  return dateString;
}

export default EventDetails;