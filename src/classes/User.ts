import { doc, getDoc } from "firebase/firestore";
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
}

// returns list of users with their usernames and displaynames
export async function getUsers(usernames: string[]): Promise<User[]> {
    const displayNames = await Promise.all(usernames.map(async (username: string) => {
        const user = await getDoc(doc(db, 'User', username));

        if (user.exists()) {
            return new User(username, user.data().display_name);
        } else {
            return new User(username, username);
        }
    }));
    return displayNames;
}