import { addDoc, collection } from "firebase/firestore";
import { db } from "src/config/firebase";

export class Notification {
    title: string;
    sender: string;
    info: string;
    priority: number;
    read: boolean;
    id: string;

    constructor(title: string, sender: string, info: string, priority: number, read: boolean = false, id: string = '') {
        this.title = title;
        this.sender = sender;
        this.info = info;
        this.priority = priority;
        this.read = read;
        this.id = id;
    }

    // sends a notification to the specified user
    notify(username: string) {
        addDoc(collection(db, 'Event'), {
            title: this.title,
            sender: this.sender,
            info: this.info,
            priority: this.priority,
            user_id: username,
            read: false
        }).catch(error => {
            console.log(`An error occured while notifying ${username}, ${error}`);
        });
    }
}