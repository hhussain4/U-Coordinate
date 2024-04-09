import React, { useEffect, useState } from 'react';
import '@styles/ViewTickets.css'; // Assuming you have a CSS file for ViewTickets
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import '@styles/Pages.css';

const ViewTickets: React.FC = () => {
    const [tickets, setTickets] = useState<any[]>([]);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const ticketsCollection = collection(db, 'Tickets');
                const snapshot = await getDocs(ticketsCollection);
                const ticketData = snapshot.docs.map(doc => {
                    const data = doc.data();
                    // Assuming the user email is stored in the document
                    const userEmail = data.userEmail; // Adjust this according to your database structure
                    return { id: doc.id, ...data, userEmail };
                });
                setTickets(ticketData);
            } catch (error) {
                console.error('Error fetching tickets: ', error);
            }
        };

        fetchTickets();
    }, []);

    const handleDeleteTicket = async (ticketId: string) => {
        try {
            await deleteDoc(doc(db, 'tickets', ticketId));
            setTickets(tickets.filter(ticket => ticket.id !== ticketId));
        } catch (error) {
            console.error('Error deleting ticket: ', error);
        }
    };

    return (
        <div className="ticket-container">
            <h2>View Tickets</h2>
            {/* Display ticket information */}
            {tickets.map((ticket, index) => (
                <div className="ticket-box" key={index}>
                    <p>User Email: {ticket.userEmail}</p>
                    <p>Date: {ticket.date}</p>
                    <p>Time: {ticket.time}</p>
                    <p>Subject: {ticket.subject}</p>
                    <p>Category: {ticket.category}</p>
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
                    <button onClick={() => handleDeleteTicket(ticket.id)}>Delete</button>
                </div>
            ))}
        </div>
    );
}

export default ViewTickets;
