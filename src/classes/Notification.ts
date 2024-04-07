export class Notification {
    id: string;
    title: string;
    sender: string;
    info: string;
    priority: number;
    read: boolean;

    constructor(id: string, title: string, sender: string, info: string, priority: number, read: boolean = false) {
        this.id = id;
        this.title = title;
        this.sender = sender;
        this.info = info;
        this.priority = priority;
        this.read = read;
    }
}