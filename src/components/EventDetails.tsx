import '@styles/EventDetails.css';
import { CalendarEvent } from './Calendar-days';


interface EventDetailsProps {
  events: CalendarEvent[];
  //below I added the new props for editing and deleting events/event details. 
  onEdit: (event: CalendarEvent) => void; 
  onDelete: (event: CalendarEvent) => void; 
}

const EventDetails: React.FC<EventDetailsProps> = ({ events }) => {
  function onEdit(event: CalendarEvent): void {
    throw new Error('Function not implemented.');
  }

  function onDelete(event: CalendarEvent): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="event-details">
      {events.map((event, index) => (
        <div key={index} className="event-box">
          <h3>{event.name}</h3>
          <table>
            <tr>
              <button className="EventDetailsBtn" onClick={() => onEdit(event)}> Edit </button>
              <button className="EventDetailsBtn" onClick={() => onDelete(event)}> Delete </button>
            </tr>
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