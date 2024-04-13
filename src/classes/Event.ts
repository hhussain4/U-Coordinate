import { User } from "./User";
import { Notification } from "./Notification";
import { Group } from "./Group";

export class Event {
    name: string;
    description: string;
    start: Date;
    end: Date;
    location: string;
    groups: Group[];
    members: User[];
    id: string;
    // number of days between events
    recurrence: number;
    // number of times it recurs
    recurTimes: number;

    constructor(name?: string, description?: string, start?: Date, end?: Date, location?: string, groups?: Group[], members?: User[], id: string = '', recurrence: number = 0, recurTimes: number = 0) {
        this.name = name || '';
        this.description = description || '';
        this.start = start || new Date();
        this.end = end || new Date();
        this.location = location || '';
        this.groups = groups || [];
        this.members = members || [];
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

    getAttendees(): User[] {
        // this is for preventing duplicate attendees
        const attendeeMap = new Map<string, User>();

        // add members from event
        this.members.forEach(member => {
            attendeeMap.set(member.username, member);
        });
    
        // add members from groups
        this.groups.forEach(group => {
            group.admins.forEach(admin => {
                attendeeMap.set(admin.username, admin);
            });
            group.members.forEach(member => {
                attendeeMap.set(member.username, member);
            });
        });

        return Array.from(attendeeMap.values());
    }

    equals(event: Event) {
        const eventUsernames = new Set(event.members.map(member => member.username));
        const eventGroupTags = new Set(event.groups.map(group => group.tag));
        return (
            this.name === event.name &&
            this.description === event.description &&
            this.start.getTime() === event.start.getTime() && 
            this.end.getTime() === event.end.getTime() && 
            this.location === event.location &&
            this.groups.length === event.groups.length &&
            this.groups.every(group => eventGroupTags.has(group.tag)) &&
            this.members.length === event.members.length &&
            this.members.every((member) => eventUsernames.has(member.username)) &&
            this.id === event.id &&
            this.recurrence === event.recurrence &&
            this.recurTimes === event.recurTimes
        );
    }

    // for notifying users of a created event
    getCreationNotification(user: User, priority: number): Notification {
        const title = `New event created: ${this.name}`;
        const sender = `${user.displayName}: ${user.username}`;
        const info = `${user.displayName} has created a new event for ${this.start.toLocaleDateString()}: ${this.name}`;
        return new Notification(title, sender, info, priority);
    }

    // for notifying users of an updated event
    getUpdateNotification(user: User, priority: number): Notification {
        const title = `Event updated: ${this.name}`;
        const sender = `${user.displayName}: ${user.username}`;
        const info = `${user.displayName} has updated the event for ${this.start.toLocaleDateString()}: ${this.name}`;
        return new Notification(title, sender, info, priority);
    }

    // for notifying users of a canceled event
    getDeleteNotification(user: User, priority: number): Notification {
        const title = `Event canceled: ${this.name}`;
        const sender = `${user.displayName}: ${user.username}`;
        const info = `${user.displayName} has canceled an event for ${this.start.toLocaleDateString()}: ${this.name}`;
        return new Notification(title, sender, info, priority);
    }
}