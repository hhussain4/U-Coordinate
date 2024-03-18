import { User } from "./User";

export class Event {
    private name: string;
    private members: User[];
    private start: Date;
    private end: Date;
    // number of days between events
    private recurrence: number;

    constructor(name: string, members: User[], start: Date, end: Date, recurrence: number = 0) {
        this.name = name;
        this.members = members;
        this.start = start;
        this.end = end;
        this.recurrence = recurrence;
    }

    addMember(member: User) {
        if(!this.members.includes(member)) this.members.push(member);
    }

    removeMember(member: User) {
        if(this.members.includes(member)) this.members.splice(this.members.indexOf(member), 1);
    }

    // getters
    getName() {
        return this.name;
    }

    getMembers() {
        return this.members;
    }

    getStart() {
        return this.start;
    }

    getEnd() {
        return this.end;
    }

    getRecurrence() {
        return this.recurrence;
    }

    // setters
    setName(name:string) {
        this.name = name;
    }

    setMembers(members: User[]) {
        this.members = members;
    }

    setStart(start: Date) {
        this.start = start;
    }

    setEnd(end: Date) {
        this.end = end;
    }

    setTimeRange(start: Date, end: Date) {
        if (start < end) {
            this.start = start;
            this.end = end;
        }
    }

    setRecurrence(recurrence: number) {
        this.recurrence = recurrence;
    }
}

module.exports = Event;