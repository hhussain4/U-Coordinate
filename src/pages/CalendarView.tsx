import NavBar from '../components/NavBar';
import Calendar from '../components/Calendar';

const CalendarView: React.FC = () => {
    return (
        <>
            <NavBar />
            <div className="content-wrapper">
                <button className="create-event-btn">Create Event</button>
                <div className="calendar-container">
                    <Calendar />
                </div>
            </div>
        </>
    );
}

export default CalendarView;