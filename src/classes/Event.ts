import { User } from "./User";
import { Notification } from "./Notification";

export class Event {
    name: string;
    description: string;
    start: Date;
    end: Date;
    location: string;
    members: User[];
    id: string;
    // number of days between events
    recurrence: number;
    // number of times it recurs
    recurTimes: number;

    constructor(name: string, description: string, start: Date, end: Date, location: string, members: User[], id: string = '', recurrence: number = 0, recurTimes: number = 0) {
        this.name = name;
        this.description = description;
        this.start = start;
        this.end = end;
        this.location = location;
        this.members = members;
        this.id = id;
        this.recurrence = recurrence;
        this.recurTimes = recurTimes;
    }

    addMember(member: User) {
        if (!this.members.includes(member)) this.members.push(member);
    }

    removeMember(member: User) {
        if (this.members.includes(member)) this.members.splice(this.members.indexOf(member), 1);
    }

    setTimeRange(start: Date, end: Date) {
        if (start < end) {
            this.start = start;
            this.end = end;
        }
    }

    // for notifying users of a created event
    getCreationNotification(user: User, priority: number): Notification {
        const title = `New event created: ${this.name}`;
        const sender = `${user.displayName}: ${user.username}`;
        const info = `Event name: ${this.name}\n
        Description: ${this.description}\n
        Time: ${this.start.toLocaleDateString()} to ${this.end.toLocaleDateString()}\n
        Location: ${this.location}\n
        Members: ${this.members.map(user => user.username)}`;
        return new Notification(title, sender, info, priority);
    }
}