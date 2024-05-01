import { collection, doc, getDocs, or, query, updateDoc, where } from "firebase/firestore";
import { db } from "src/config/firebase";

export class User {
    username: string;
    displayName: string;
    timezone: string;
    theme: string;
    privilege: boolean;

    constructor(username: string = "", displayName: string = "", timezone: string = "", theme: string = "light", privilege: boolean = false) {
        this.username = username;
        this.displayName = displayName;
        this.timezone = timezone;
        this.theme = theme;
        this.privilege = privilege;
    }

    // updates the events, groups, and notifications to reflect username change
    changeUsername(username: string) {
        try {
            // event, group, and notification queries
            const eventQuery = query(collection(db, 'Event'), or(where('members', "array-contains", this.username)));
            const groupQuery = query(collection(db, 'Group'), or(where('members', "array-contains", this.username),
                where('admins', "array-contains", this.username)));
            const notificationQuery = query(collection(db, 'Notification'), where('user_id', '==', this.username))

            // update events
            getDocs(eventQuery).then(events => {
                events.forEach(event => {
                    const eventData = event.data();
                    const updatedMembers = eventData.members.map((member: string) => (member === this.username ? username : member));
                    updateDoc(doc(db, 'Event', event.id), { members: updatedMembers });
                });
            });

            // update groups
            getDocs(groupQuery).then(groups => {
                groups.forEach(group => {
                    const groupData = group.data();
                    const updatedMembers = groupData.members.map((member: string) => (member === this.username ? username : member));
                    const updatedAdmins = groupData.admins.map((admin: string) => (admin === this.username ? username : admin));
                    updateDoc(doc(db, 'Group', group.id), { members: updatedMembers, admins: updatedAdmins });
                });
            });

            // update notifications
            getDocs(notificationQuery).then(notifications => {
                notifications.forEach(notification => {
                    updateDoc(notification.ref, {user_id: username});
                });
            });
            this.username = username;
        } catch (error) {
            console.log(error);
        }
    }
}

// returns list of users with their usernames and displaynames
export async function getUsers(usernames: string[]): Promise<User[]> {
    const displayNames = await Promise.all(usernames.map(async (username: string) => {
        const userDoc = await getDocs(query(collection(db, 'User'), where('email', '==', username)));

        if (!userDoc.empty) {
            return new User(username, userDoc.docs[0].data().display_name);
        } else {
            return new User(username, username);
        }
    }));
    return displayNames;
}