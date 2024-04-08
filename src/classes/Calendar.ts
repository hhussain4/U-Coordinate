import { Event } from "./Event";
import { Group } from "./Group";
import { User } from "./User";

export class Calendar {
    members: User[];
    events: Event[];

    constructor(members: User[], events?:Event[]) {
        this.members = members;
        this.events = events || [];
    }

    addEvent(event: Event) {
        if(!this.events.includes(event)) this.events.push(event);
    }

    removeEvent(event: Event) {
        if(this.events.includes(event)) this.events.splice(this.events.indexOf(event), 1);
    }

    addMember(member: User) {
        if(!this.members.includes(member)) this.members.push(member);
    }

    removeMember(member: User) {
        if(this.members.includes(member)) this.members.splice(this.members.indexOf(member), 1);
    }

    addGroup(group: Group) {
        group.members.forEach(member => {
            this.addMember(member);
        });
    }

    removeGroup(group: Group) {
        group.members.forEach(member => {
            this.removeMember(member);
        });
    }
}