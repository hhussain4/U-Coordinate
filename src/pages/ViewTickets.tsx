import React from 'react';
import { useLocation } from 'react-router-dom';

const ViewTickets: React.FC = () => {
    // Get ticket data from location state
    const location = useLocation();
    const ticketData = location.state;

    return (
        <div>
            <h2>View Tickets</h2>
            {/* Display ticket information */}
            <div>
                <p>Date: {ticketData.date}</p>
                <p>Time: {ticketData.time}</p>
                <p>Subject: {ticketData.subject}</p>
                <p>Category: {ticketData.category}</p>
                {/* Conditionally render additional fields based on category */}
                {ticketData.category === 'TimeOff' && (
                    <div>
                        <p>Duration From: {ticketData.durationFrom}</p>
                        <p>Duration To: {ticketData.durationTo}</p>
                        <p>Reasons: {ticketData.reasons}</p>
                    </div>
                )}
                {(ticketData.category === 'Bug' || ticketData.category === 'Policy' || ticketData.category === 'General' || ticketData.category === 'Account') && (
                    <p>Description: {ticketData.description}</p>
                )}
            </div>
        </div>
    );
}

export default ViewTickets;
