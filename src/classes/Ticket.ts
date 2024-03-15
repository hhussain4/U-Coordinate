export enum TicketType {
    Bug,
    Account,
    TimeOff,
    Policy
}

export class Ticket {
    protected name: string;
    protected type: TicketType;
    protected priority: number;
    protected issue: string;
    protected resolved: boolean;

    constructor(name: string, type: TicketType, priority: number, issue: string, resolved=false) {
        this.name = name;
        this.type = type;
        this.priority = priority;
        this.issue = issue;
        this.resolved = resolved;
    }

    // getters
    getName(): string {
        return this.name;
    }

    getType(): TicketType {
        return this.type;
    }

    getPriority(): number {
        return this.priority;
    }

    getIssue(): string {
        return this.issue;
    }

    getResolved(): boolean {
        return this.resolved;
    }

    // setters
    setName(name: string) {
        this.name = name;
    }

    setType(type: TicketType) {
        this.type = type;
    }

    setPriority(priority: number) {
        this.priority = priority;
    }

    setIssue(issue: string) {
        this.issue = issue;
    }

    setResolved(resolved: boolean) {
        this.resolved = resolved;
    }
}

module.exports = Ticket;