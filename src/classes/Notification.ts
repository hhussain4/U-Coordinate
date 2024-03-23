export class Notification {
    private title: string;
    private info: string;
    private priority: number;
    private read = false;

    constructor(title: string, info: string, priority: number) {
        this.title = title;
        this.info = info;
        this.priority = priority;
    }

    Notify() {
        // implementation
    }

    // getters
    getTitle() {
        return this.title;
    }

    getInfo() {
        return this.info;
    }

    getPriority() {
        return this.priority;
    }

    isRead() {
        return this.read;
    }

    // setters
    setTitle(title: string) {
        this.title = title;
    }

    setInfo(info: string) {
        this.info = info;
    }

    setPriority(priority: number) {
        this.priority = priority;
    }

    setRead(read: boolean) {
        this.read = read;
    }
}

module.exports = Notification;