import { Component } from 'react';
import CalendarDays, { CalendarDay } from './Calendar-days';
import '@styles/Calendar.css';

interface CalendarState {
    currentDay: Date;
}

export default class Calendar extends Component<{}, CalendarState> {
    private readonly weekdays: string[];
    private readonly months: string[];

    constructor(props: {}) {
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
                            this.weekdays.map((weekday) => {
                                return <div className="weekday"><p>{weekday}</p></div>
                            })
                        }
                    </div>
                    <CalendarDays day={this.state.currentDay} changeCurrentDay={this.changeCurrentDay} />
                </div>
            </div>
        )
    }
}
