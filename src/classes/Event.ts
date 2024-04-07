import { User } from "./User";

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
}