import { Notification } from "./Notification";
import { User } from "./User";

export class Group {
    name: string;
    members: User[];
    admins: User[];
    id: string;

    constructor(name: string, admins?: User[], members?: User[], id: string = '') {
        this.name = name;
        this.admins = admins || [];
        this.members = members || [];
        this.id = id;
    }

    addAdmin(admin: User) {
        if (!this.admins.includes(admin)) this.admins.push(admin);
        if (this.members.includes(admin)) this.removeMember(admin);
    }

    removeAdmin(admin: User) {
        if (this.admins.includes(admin)) this.admins.splice(this.admins.indexOf(admin), 1);
    }

    addMember(member: User) {
        if (!this.members.includes(member)) this.members.push(member);
    }

    removeMember(member: User) {
        if (this.members.includes(member)) this.members.splice(this.members.indexOf(member), 1);
    }

    // for notifying users of a created group
    getCreationNotification(user: User): Notification {
        const title = `New group created: ${this.name}`;
        const sender = `${user.displayName}: ${user.username}`
        const info = `Group name: ${this.name}\n
        Admins: ${this.admins.map(user => user.username)}\n
        Members: ${this.members.map(user => user.username)}`;
        return new Notification(title, sender, info, 3);
    }
}