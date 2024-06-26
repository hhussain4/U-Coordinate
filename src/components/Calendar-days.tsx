import { Event } from "@classes/Event";

export interface CalendarDay {
    currentMonth: boolean;
    date: Date;
    month: number;
    number: number;
    selected: boolean;
    year: number;
    today: boolean;
    events?: Event[];
}

interface CalendarDaysProps {
    day: Date;
    events: Event[];
    changeCurrentDay: (day: CalendarDay) => void;
    onSelectDay: (events: Event[]) => void;
}

const CalendarDays: React.FC<CalendarDaysProps> = (props) => {
    let firstDayOfMonth = new Date(props.day.getFullYear(), props.day.getMonth(), 1);
    let weekdayOfFirstDay = firstDayOfMonth.getDay();
    let currentDays: CalendarDay[] = [];

    for (let day = 0; day < 42; day++) {
        if (day === 0 && weekdayOfFirstDay === 0) {
            firstDayOfMonth.setDate(firstDayOfMonth.getDate() - 7);
        } else if (day === 0) {
            firstDayOfMonth.setDate(firstDayOfMonth.getDate() + (day - weekdayOfFirstDay));
        } else {
            firstDayOfMonth.setDate(firstDayOfMonth.getDate() + 1);
        }

        //find events for this day
        const dayEvents = props.events.filter(event => {
            const eventDate = new Date(event.start).toDateString();
            return eventDate === firstDayOfMonth.toDateString();
        });

        let calendarDay: CalendarDay = {
            currentMonth: (firstDayOfMonth.getMonth() === props.day.getMonth()),
            date: new Date(firstDayOfMonth),
            month: firstDayOfMonth.getMonth(),
            number: firstDayOfMonth.getDate(),
            selected: (firstDayOfMonth.toDateString() === props.day.toDateString()),
            year: firstDayOfMonth.getFullYear(),
            today: (firstDayOfMonth.toDateString() == new Date(new Date().setHours(0, 0, 0, 0)).toDateString()),
            events: dayEvents.length > 0 ? dayEvents : undefined
        };

        currentDays.push(calendarDay);
    }

    const handleDayClick = (day: CalendarDay) => {
        props.changeCurrentDay(day);
        props.onSelectDay(day.events || []);
    }

    return (
        <div className="table-content">
            {currentDays.map((day, index) => (
                <div
                    key={index}
                    className={`calendar-day ${day.currentMonth ? "current" : ""} ${day.selected ? "selected" : ""} ${day.today ? "today" : ""}`}
                    onClick={() => handleDayClick(day)}
                >
                    <p>{day.number}</p>
                    <div className="calendar-event-container">
                        {day.events && day.events.map((event, eventIndex) => (
                            <div key={eventIndex} className="calendar-event">
                                {event.name}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default CalendarDays;
