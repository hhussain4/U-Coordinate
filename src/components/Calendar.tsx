import { Component } from 'react';
import CalendarDays, { CalendarDay } from './Calendar-days';
import '@styles/Calendar.css';
import '@pages/CalendarView';

interface CalendarEvent {
    name: string;
    description: string;
    start: Date;
    end: Date;
    location: string;
    usersInvolved: string[];
}

interface CalendarState {
    currentDay: Date;
}

interface CalendarProps {
    currentDay: Date;
    events: CalendarEvent[];
    onSelectDay: (events: CalendarEvent[]) => void;
}  

export default class Calendar extends Component<CalendarProps, CalendarState> {
    private readonly weekdays: string[];
    private readonly months: string[];

    constructor(props: CalendarProps) {
        super(props);

        this.weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        this.months = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];

        this.state = {
            currentDay: new Date()
        }
    }

    changeCurrentDay = (day: CalendarDay) => {
        this.setState({ currentDay: new Date(day.year, day.month, day.number) });
    }

    render() {
        const { currentDay, events } = this.props;
        return (
            <div className="calendar">
                <div className="calendar-body">
                    <div className="table-header">
                        <h2>{this.months[this.state.currentDay.getMonth()]} {this.state.currentDay.getFullYear()}</h2>
                    </div>
                    <div className="table-header">
                        {
                            this.weekdays.map((weekday) => {
                                return <div className="weekday"><p>{weekday}</p></div>
                            })
                        }
                    </div>
                    <CalendarDays day={currentDay}
                                changeCurrentDay={this.changeCurrentDay}
                                events={events}
                                onSelectDay={this.props.onSelectDay}/>
                </div>
            </div>
        );
    }
}
