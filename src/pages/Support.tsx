import React, { useState, useEffect } from 'react';
import '@styles/Pages.css';
import { db, auth } from '../config/firebase';
import { addDoc, collection } from 'firebase/firestore';

const Support: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filteredResults, setFilteredResults] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [ticketData, setTicketData] = useState<any>({
        date: '',
        time: '',
        subject: '',
        category: 'General', // Default category
        durationFrom: '',
        durationTo: '',
        reasons: '',
        description: '',
        //userEmail: ''
    });

    // Dummy data for demonstration
    const allPages = ['Page 1', 'Page 2', 'Page 3', 'Page 4', 'Page 5'];

    // Function to filter pages based on search query
    const filterPages = (query: string) => {
        const filtered = allPages.filter(page => page.toLowerCase().includes(query.toLowerCase()));
        setFilteredResults(filtered);
    };

    // Handler for input change
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
        filterPages(event.target.value);
    };

    // Handler for filing a ticket button click
    const handleFileTicket = () => {
        setIsModalOpen(true);
    };

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTicketData({ ...ticketData, category: event.target.value });
    };

    const handleTicketInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setTicketData({ ...ticketData, [name]: value });
    };

    const handleTicketSubmission = async () => {
        try {
            // Get the current user
            const user = auth.currentUser;
            if (user) {
                // Add the user's email to the ticket data
                const ticketWithUser = { ...ticketData, userId: user.uid, userEmail: user.email };
                // Add the ticket data to Firestore
                await addDoc(collection(db, "tickets"), ticketWithUser);
                console.log("Ticket submitted successfully");
                // Close the modal after submitting the ticket
                setIsModalOpen(false);
            } else {
                console.error("No user signed in.");
            }
        } catch (error) {
            console.error("Error adding ticket: ", error);
        }
    };

    // useEffect to set the initial date and time values
    useEffect(() => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        const formattedTime = `${hours}:${minutes}`;
        setTicketData({
            ...ticketData,
            date: formattedDate,
            time: formattedTime
        });

        // Fetch user information when component mounts
        const fetchUserInfo = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    setTicketData((prevState: any) => ({ ...prevState, userEmail: user.email }));
                }
            } catch (error) {
                console.error('Error fetching user information: ', error);
            }
        };

        fetchUserInfo();
    }, []); // Empty dependency array to run the effect only once on component mount

    return (
        <>
            <div className='header'>
                <h2 className="title">Frequently Asked Questions</h2>
            </div>
            {/* Search bar */}
            <div className='search-container'>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleInputChange}
                    className='search-bar'
                />
            </div>
            {/* Page list */}
            <div className='page-list'>
                {/* Display filtered results */}
                {filteredResults.length > 0 ? (
                    filteredResults.map(page => <p key={page}>{page}</p>)
                ) : (
                    <p>No results found.</p>
                )}
            </div>
            {/* File a Ticket button */}
            <button onClick={handleFileTicket} className='file-ticket-btn'>
                File a Ticket
            </button>
            {/* Modal for filing a ticket */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>File a Ticket</h2>
                        <label>Date:</label>
                        <input type="date" name="date" value={ticketData.date} readOnly />
                        <label>Time:</label>
                        <input type="time" name="time" value={ticketData.time} readOnly />
                        <label>Subject:</label>
                        <input type="text" name="subject" value={ticketData.subject} onChange={handleTicketInputChange} />
                        <div className="input-group">
                            <label>Category:</label>
                            <select name="category" value={ticketData.category} onChange={handleCategoryChange}>
                                <option value="General">General</option>
                                <option value="Bug">Bug</option>
                                <option value="Account">Account</option>
                                <option value="TimeOff">TimeOff</option>
                                <option value="Policy">Policy</option>
                                {/* Add more options as needed */}
                            </select>
                        </div>
                        {/* Conditionally render input fields based on category */}
                        {ticketData.category === 'TimeOff' && (
                            <div className="input-group">
                                <label>Duration From:</label>
                                <input type="date" name="durationFrom" value={ticketData.durationFrom} onChange={handleTicketInputChange} />
                                <label>Duration To:</label>
                                <input type="date" name="durationTo" value={ticketData.durationTo} onChange={handleTicketInputChange} />
                                <label>Reasons:</label>
                                <input type="text" name="reasons" value={ticketData.reasons} onChange={handleTicketInputChange} />
                            </div>
                        )}
                        {(ticketData.category === 'Bug' || ticketData.category === 'Policy' || ticketData.category === 'General' || ticketData.category === 'Account') && (
                            <div className="input-group">
                                <label>Description:</label>
                                <input type="text" name="description" value={ticketData.description} onChange={handleTicketInputChange} />
                            </div>
                        )}
                        <label>User Email:</label>
                        <input type="text" value={ticketData.userEmail} readOnly />
                        <button onClick={handleTicketSubmission}>Submit</button>
                        <button onClick={() => setIsModalOpen(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default Support;
