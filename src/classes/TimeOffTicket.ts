import { Ticket, TicketType } from "./Ticket";

export class TimeOffTicket extends Ticket{
    private employeeName: string;
    private employerName: string;
    private startDate: Date;
    private endDate: Date;

    constructor(employeeName:string, employerName: string, startDate: Date, endDate: Date) {
        super("Time Off Request", TicketType.TimeOff, 2,
         `${employeeName} is requesting that ${employerName} grants them time off from ${startDate} to ${endDate}`);
        this.employeeName = employeeName;
        this.employerName = employerName;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    // TODO: notification for approval and denial
    approve(message?: string) {
        this.resolved = true;

        if (message) {
            this.issue += `\n${this.employerName} has approved your request for the following reason: ${message}`;
        }
    }

    deny(message?: string) {
        this.resolved = true;

        if (message) {
            this.issue += `\n${this.employerName} has denied your request for the following reason: ${message}`;
        }
    }

    getTimeOffIssue(): string {
        return `${this.employeeName} is requesting that ${this.employerName} grants them time off from ${this.startDate} to ${this.endDate}`;
    }
    
    // setters
    setEmployeeName(employeeName: string) {
        this.employeeName = employeeName;
        this.issue = this.getTimeOffIssue();
    }

    setEmployerName(employerName: string) {
        this.employerName = employerName;
        this.issue = this.getTimeOffIssue();
    }

    setTimeRange(start: Date, end: Date) {
        if (start >= end) return;
        this.startDate = start;
        this.endDate = end;
        this.issue = this.getTimeOffIssue();
    }

    // getters
    getEmployeeName(): string {
        return this.employeeName;
    }

    getEmployerName(): string {
        return this.employerName;
    }

    getStartDate(): Date {
        return this.startDate;
    }

    getEndDate(): Date {
        return this.endDate;
    }
}

module.exports = TimeOffTicket;