import { addDoc, collection } from "firebase/firestore";
import { db } from "src/config/firebase";

export class Notification {
    title: string;
    sender: string;
    info: string;
    priority: number;
    date: Date;
    read: boolean;
    id: string;

    constructor(title: string, sender: string, info: string, priority: number, date?: Date, read: boolean = false, id: string = '') {
        this.title = title;
        this.sender = sender;
        this.info = info;
        this.priority = priority;
        this.date = date || new Date();
        this.read = read;
        this.id = id;
    }

    // sends a notification to the specified user
    notify(username: string) {
        addDoc(collection(db, 'Notification'), {
            title: this.title,
            sender: this.sender,
            info: this.info,
            priority: this.priority,
            user_id: username,
            date: new Date().getTime(),
            read: false
        }).catch(error => {
            console.log(`An error occured while notifying ${username}, ${error}`);
        });
    }
}