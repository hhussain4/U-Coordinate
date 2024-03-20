import '@styles/EventDetails.css';
import { CalendarEvent } from './Calendar-days';


interface EventDetailsProps {
  events: CalendarEvent[];
}

const EventDetails: React.FC<EventDetailsProps> = ({ events }) => {
  return (
    <div className="event-details">
      {events.map((event, index) => (
        <div key={index} className="event-box">
          <h3>{event.name}</h3>
          <table>
            <tr>
              <td>Description:</td>
              <td>{event.description}</td>
            </tr>
            <tr>
              <td>Start:</td>
              <td>{new Date(event.start).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</td>
            </tr>
            <tr>
              <td>End:</td>
              <td>{new Date(event.end).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</td>
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

export default EventDetails;