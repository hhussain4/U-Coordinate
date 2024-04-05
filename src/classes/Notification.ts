export class Notification {
    title: string;
    sender: string;
    info: string;
    priority: number;
    read: boolean;

    constructor(title: string, sender: string, info: string, priority: number, read: boolean = false) {
        this.title = title;
        this.sender = sender;
        this.info = info;
        this.priority = priority;
        this.read = read;
    }
}