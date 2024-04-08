// import { Ticket, TicketType } from "./Ticket";
// import { User } from "./User";

// export class TimeOffTicket extends Ticket {
//     private employee: User;
//     private employer: User;
//     private startDate: Date;
//     private endDate: Date;

//     constructor(employee: User, employer: User, startDate: Date, endDate: Date) {
//         super("Time Off Request", TicketType.TimeOff, 2,
//             `${employee.getDisplayName()} is requesting that ${employer.getDisplayName()} grants them time off from ${startDate} to ${endDate}`);
//         this.employee = employee;
//         this.employer = employer;
//         this.startDate = startDate;
//         this.endDate = endDate;
//     }

//     // TODO: notification for approval and denial
//     approve(message?: string) {
//         this.resolved = true;

//         if (message) {
//             this.issue += `\n${this.employer.getDisplayName()} has approved your request for the following reason: ${message}`;
//         }
//     }

//     deny(message?: string) {
//         this.resolved = true;

//         if (message) {
//             this.issue += `\n${this.employer.getDisplayName()} has denied your request for the following reason: ${message}`;
//         }
//     }

//     getTimeOffIssue(): string {
//         return `${this.employee.getDisplayName()} is requesting that ${this.employer.getDisplayName()} grants them time off from ${this.startDate} to ${this.endDate}`;
//     }

//     // setters
//     setEmployeeName(employee: User) {
//         this.employee = employee;
//         this.issue = this.getTimeOffIssue();
//     }

//     setEmployerName(employer: User) {
//         this.employer = employer;
//         this.issue = this.getTimeOffIssue();
//     }

//     setTimeRange(start: Date, end: Date) {
//         if (start >= end) return;
//         this.startDate = start;
//         this.endDate = end;
//         this.issue = this.getTimeOffIssue();
//     }

//     // getters
//     getEmployee(): User {
//         return this.employee;
//     }

//     getEmployer(): User {
//         return this.employer;
//     }

//     getStartDate(): Date {
//         return this.startDate;
//     }

//     getEndDate(): Date {
//         return this.endDate;
//     }
// }

// module.exports = TimeOffTicket;