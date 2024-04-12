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

    equals(group: Group) {
        const adminUsernames = new Set(group.admins.map(admin => admin.username));
        const memberUsernames = new Set(group.members.map(member => member.username));
        return (
            this.name === group.name &&
            this.id === group.id &&
            this.admins.length === group.admins.length &&
            this.members.length === group.members.length &&
            this.admins.every(admin => adminUsernames.has(admin.username)) &&
            this.members.every(member => memberUsernames.has(member.username))
        )
    }

    /* Below are function for notifying users*/

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

    // notifies users of changes accordingly
    notifyChanges(prevGroup: Group, user: User) {
        const prevAdminUsernames = new Set(prevGroup.admins.map(admin => admin.username));
        const newAdminUsernames = new Set(this.admins.map(admin => admin.username));
        const prevMemberUsernames = new Set(prevGroup.members.map(member => member.username));
        const newMemberUsernames = new Set(this.members.map(member => member.username));

        const removedAdmins = prevGroup.admins.filter(admin => !newAdminUsernames.has(admin.username));
        const addedAdmins = this.admins.filter(admin => !prevAdminUsernames.has(admin.username));
        const removedMembers = prevGroup.members.filter(member => !newMemberUsernames.has(member.username));
        const addedMembers = this.members.filter(member => !prevMemberUsernames.has(member.username));

        // if names do not match
        if (prevGroup.name !== this.name) {
            const notification = this.getNameChangeNotification(user, prevGroup.name);
            [...newAdminUsernames, ...newMemberUsernames].forEach(e => notification.notify(e));
        }

        // notify added users
        const addnotification = this.getAddNotification(user);
        [...addedAdmins, ...addedMembers].forEach(e => addnotification.notify(e.username))
        // notify removed users
        const removeNotification = this.getRemoveNotification(user);
        [...removedAdmins, ...removedMembers].forEach(e => removeNotification.notify(e.username));
    }
}