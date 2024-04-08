import React, { useEffect, useState } from 'react';
import '@styles/ViewTickets.css'; // Assuming you have a CSS file for ViewTickets
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';

const ViewTickets: React.FC = () => {
    const [tickets, setTickets] = useState<any[]>([]);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const ticketsCollection = collection(db, 'tickets');
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
           <div id="pageTitle" >  <h2>View Tickets</h2> {/* Need to center this later */} </div>
            {/* Display ticket information */}
            {tickets.map((ticket, index) => (
                <div className="ticket-box" key={index}>
                    <table>
                        <tbody>
                            <tr>
                                <td> User Email: </td>
                                <td> {ticket.userEmail} </td>
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
                                    <tr> 
                                        <td> Reason: </td>                    
                                        <td> {ticket.reasons} </td>
                                    </tr>
                                    </div>
                                )}
                            </tr>
                                
                            <tr>  {(ticket.category === 'Bug' || ticket.category === 'Policy' || ticket.category === 'General' || ticket.category === 'Account') && (
                                  <><td> Description: </td><td> {ticket.description} </td></> )} 
                            </tr>
                            <tr>
                                
                                      <button className="deleteTicketBtn" onClick={() => handleDeleteTicket(ticket.id)}>Delete</button>
                            </tr>                      
                        </tbody>
                    </table>
                </div>
            ))}
        </div>  
        // 
        
    );
}

export default ViewTickets;
