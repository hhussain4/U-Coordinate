import { Component } from 'react';
import CalendarDays, { CalendarDay } from './Calendar-days';
import { Event } from '@classes/Event';
import '@styles/Calendar.css';
import '@pages/CalendarView';

interface CalendarState {
    currentDay: Date;
}

interface CalendarProps {
    events: Event[];
    onSelectDay: (events: Event[]) => void;
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
        return (
            <div className="calendar">
                <div className="calendar-body">
                    <div className="table-header">
                        <h2>{this.months[this.state.currentDay.getMonth()]} {this.state.currentDay.getFullYear()}</h2>
                    </div>
                    <div className="table-header">
                        {
                            this.weekdays.map((weekday, index) => {
                                return <div className="weekday" key={index}><p>{weekday}</p></div>
                            })
                        }
                    </div>
                    <CalendarDays day={this.state.currentDay}
                        changeCurrentDay={this.changeCurrentDay}
                        events={this.props.events}
                        onSelectDay={this.props.onSelectDay} />
                </div>
            </div>
        );
    }
}
