import React, { useContext, useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { UserContext } from 'src/App';
import { db } from '../config/firebase';
import '@styles/ViewTickets.css';

const ViewTickets: React.FC = () => {
    const [user] = useContext(UserContext)
    const [tickets, setTickets] = useState<any[]>([]);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const ticketsCollection = collection(db, 'Tickets');
                const snapshot = await getDocs(ticketsCollection);
                const ticketData = snapshot.docs.map(doc => {
                    const data = doc.data();
                    return { id: doc.id, ...data };
                });
                setTickets(ticketData);
            } catch (error) {
                console.error('Error fetching tickets: ', error);
            }
        };

        fetchTickets();
    }, []);

    const handleDeleteTicket = async (ticketId: string) => {
        if (!user) {
            alert('You do not have the permissions to do this');
            return;
        }
        try {
            // Delete the ticket document from Firestore
            await deleteDoc(doc(db, 'Tickets', ticketId));
            // Remove the deleted ticket from the local state
            setTickets(tickets.filter(ticket => ticket.id !== ticketId));
        } catch (error) {
            console.error('Error deleting ticket: ', error);
        }
    };

    return (
        <div className="ticket-container">
            <div id="pageTitle" >  <h2>View Tickets</h2> {/* Need to center this later */} </div>
            {/* Display ticket information */}
            {tickets.map((ticket, index) => (
                <div className="ticket-box" key={index}>
                    <table>
                        <tbody>
                            <tr>
                                <td> User Email: </td>
                                <td> {ticket.user_id} </td>
                            </tr>
                            <tr>
                                <td> Date: </td>
                                <td> {ticket.date} </td>
                            </tr>
                            <tr>
                                <td> Time:  </td>
                                <td> {ticket.time} </td>
                            </tr>
                            <tr>
                                <td> Subject:  </td>
                                <td> {ticket.subject} </td>
                            </tr>
                            <tr>
                                <td> Category:  </td>
                                <td> {ticket.category} </td>
                            </tr>


                            <tr>  {ticket.category === 'TimeOff' && (
                                <div>
                                    <tr>
                                        <td> Start: </td>
                                        <td> {ticket.durationFrom} </td>
                                    </tr>

                                    <tr>
                                        <td> End: </td>
                                        <td> {ticket.durationTo} </td>
                                    </tr>
                                </div>
                            )}
                            </tr>
                            <tr>
                                <td> {ticket.category != 'TimeOff' ? 'Description:' : 'Reason:'} </td>
                                <td> {ticket.description} </td>
                            </tr>
                            <tr>
                                <button className="deleteTicketBtn" onClick={() => handleDeleteTicket(ticket.id)}>Delete</button>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
}

export default ViewTickets;
