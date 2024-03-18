import './EventDetails.css';
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
            <p>{event.description}</p>
            <p>Start: {event.start.toLocaleString()}</p>
            <p>End: {event.end.toLocaleString()}</p>
            <p>Location: {event.location}</p>
            <p>Users Involved: {event.usersInvolved.join(', ')}</p>
          </div>
        ))}
      </div>
    );
  };
  
  export default EventDetails;