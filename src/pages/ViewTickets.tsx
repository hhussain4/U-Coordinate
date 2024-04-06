import React from 'react';
import '@styles/Pages.css';

interface Ticket {
    date: string;
    time: string;
    subject: string;
    category: string;
    durationFrom?: string;
    durationTo?: string;
    reasons?: string;
    description?: string;
}

interface ViewTicketsProps {
    tickets: Ticket[];
}

const ViewTickets: React.FC<ViewTicketsProps> = ({ tickets }) => {
    return (
        <div className='header'>
            <h2 className="title">View Tickets</h2>
            {/* Display all submitted tickets */}
            {tickets.map((ticket, index) => (
                <div key={index} className="ticket">
                    <p>Date: {ticket.date}</p>
                    <p>Time: {ticket.time}</p>
                    <p>Subject: {ticket.subject}</p>
                    <p>Category: {ticket.category}</p>
                    {/* Conditionally render additional fields based on category */}
                    {ticket.category === 'TimeOff' && (
                        <div>
                            <p>Duration From: {ticket.durationFrom}</p>
                            <p>Duration To: {ticket.durationTo}</p>
                            <p>Reasons: {ticket.reasons}</p>
                        </div>
                    )}
                    {(ticket.category === 'Bug' || ticket.category === 'Policy' || ticket.category === 'General' || ticket.category === 'Account') && (
                        <p>Description: {ticket.description}</p>
                    )}
                </div>
            ))}
        </div>
    );
}

export default ViewTickets;
