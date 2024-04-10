import { Notification } from "./Notification";
import { User } from "./User";

export class Group {
    name: string;
    members: User[];
    admins: User[];
    id: string;

    constructor(name: string = '', admins?: User[], members?: User[], id: string = '') {
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
        const info = `${user.displayName} has added you to a group: ${this.name}`;
        return new Notification(title, sender, info, 3);
    }

    // for notifying users of group deletion
    getDeleteNotification(user: User): Notification {
        const title = `Group disbanded: ${this.name}`;
        const sender = `${user.displayName}: ${user.username}`
        const info = `${user.displayName} has deleted the group: ${this.name}`;
        return new Notification(title, sender, info, 3);
    }

    // for notifying users of group name change
    getNameChangeNotification(user: User, oldName: string) {
        const title = `Group name changed from ${oldName} to ${this.name}`;
        const sender = `${user.displayName}: ${user.username}`
        const info = `${user.displayName} has changed the name of the group to : ${this.name}`;
        return new Notification(title, sender, info, 3);
    }

    // for notifying users of addition to group
    getAddNotification(user: User) {
        const title = `You have been added to ${this.name}`;
        const sender = `${user.displayName}: ${user.username}`
        const info = `${user.displayName} has added you to the group: ${this.name}`;
        return new Notification(title, sender, info, 3);
    }

    // for notifying users of removal from group
    getRemoveNotification(user: User) {
        const title = `You have been removed from ${this.name}`;
        const sender = `${user.displayName}: ${user.username}`
        const info = `${user.displayName} has removed you from the group: ${this.name}`;
        return new Notification(title, sender, info, 3);
    }

    // notify admins of member leaving
    getLeaveNotification(user: User) {
        const title = `${user.displayName} left the group: ${this.name}`;
        const sender = `${user.displayName}: ${user.username}`;
        const info = `${user.displayName} has left the group: ${this.name}`;
        return new Notification(title, sender, info, 3);
    }
}