import { useState, useEffect, useContext } from 'react';
import { db, auth } from '../config/firebase';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { UserContext } from 'src/App';
import FAQ from '@components/FAQ';
import '@styles/Support.css';

interface Result {
    id: string;
    question: string;
    answer: string;
}

interface TicketData {
    date: string;
    time: string;
    subject: string;
    category: string;
    durationFrom: Date;
    durationTo: Date;
    reasons: string;
    description: string;
    userEmail: string;
}

interface ErrorData {
    date: string;
    description: string;
    time: string;
    subject: string;
    user: string;
}

const Support: React.FC = () => {
    const [user] = useContext(UserContext);
    const [errors, setErrors] = useState<ErrorData>({ date: "", description: "", time: "", subject: "", user: "" });
    const [showFAQPopup, setShowFAQPopup] = useState<boolean>(false);
    const [faqs, setFaqs] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filteredResults, setFilteredResults] = useState<Result[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [ticketData, setTicketData] = useState<TicketData>({
        date: '',
        time: '',
        subject: '',
        category: 'General',
        durationFrom: new Date(),
        durationTo: new Date(),
        reasons: '',
        description: '',
        userEmail: ''
    });

    const fetchFAQs = async () => {
        try {
            const snapshot = await getDocs(collection(db, 'FAQs'));
            const faqData = snapshot.docs.map(doc => ({ id: doc.id, question: doc.data().question, answer: doc.data().answer }));
            setFaqs(faqData);
            setFilteredResults(faqData);
        } catch (error) {
            console.error('Error fetching FAQs: ', error);
        }
    };

    // Function to filter pages based on search query
    // Function to filter FAQs based on search query
    const filterFaqs = (query: string) => {
        const filtered = faqs.filter(faq =>
            faq.question.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredResults(filtered);
    };

    // Handler for input change
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        setSearchQuery(query);
        filterFaqs(query);
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
            const errorMsg: ErrorData = { date: "", description: "", time: "", subject: "", user: "" };

            const description = ticketData.description.trim();
            const start = ticketData.durationFrom;
            const end = ticketData.durationTo;
            const subject = ticketData.subject.trim();

            if (!description) {
                errorMsg.description = "Please provide a description";
            }
            if ((!start || !end) && (ticketData.category === 'TimeOff')) {
                errorMsg.time = "Please provide a start and end date";
            }
            if (!subject) {
                errorMsg.subject = "Please provide a subject";
            }

            //checking for valid inputs
            if ((start >= end) && (ticketData.category === 'TimeOff')) {
                errorMsg.time = "Please provide a valid time range";
            }

            setErrors(errorMsg);
            console.log(errorMsg)
            if (Object.values(errorMsg).every((error) => !error)) {
                // Add the ticket data to Firestore
                await addDoc(collection(db, "Tickets"), { ...ticketData, user_id: user?.username });
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

        fetchFAQs();
        fetchUserInfo();
    }, []);

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

            <div className='faq-list'>
                {/* Display filtered FAQs */}
                {filteredResults.length > 0 ? (
                    filteredResults.map(faq => (
                        <div key={faq.id} className='faq-item'>
                            <div>
                            <h3>{faq.question}</h3>
                            <p>{faq.answer}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No FAQs found.</p>
                )}
            </div>

            {/* Your existing support page content */}
            <div className="button-container">
                {/* File a Ticket button */}
                <button onClick={() => setIsModalOpen(true)} className='file-ticket-btn'>File a Ticket</button>
                {/* Post a FAQ button */}
                <button onClick={() => setShowFAQPopup(true)} className='post-faq-btn'>Post a FAQ</button>
            </div>
            {showFAQPopup && <FAQ onClose={() => setShowFAQPopup(false)} updateFAQ={fetchFAQs} />}
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
                        {errors.subject && <div className="err-msg">{errors.subject}</div>}
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
                                <input type="date" name="durationFrom" onChange={handleTicketInputChange} />
                                <label>Duration To:</label>
                                <input type="date" name="durationTo" onChange={handleTicketInputChange} />
                                {errors.time && <div className="err-msg">{errors.time}</div>}
                                <label>Reasons:</label>
                                <input type="text" name="reasons" onChange={handleTicketInputChange} />
                                {errors.time && <div className="err-msg">{errors.time}</div>}
                            </div>
                        )}
                        {(ticketData.category === 'Bug' || ticketData.category === 'Policy' || ticketData.category === 'General' || ticketData.category === 'Account') && (
                            <div className="input-group">
                                <label>Description:</label>
                                <input type="text" name="description" onChange={handleTicketInputChange} />
                                {errors.description && <div className="err-msg">{errors.description}</div>}
                            </div>
                        )}
                        <label>User Email:</label>
                        <input type="text" value={user?.username} readOnly />
                        {errors.user && <div className="err-msg">{errors.user}</div>}
                        <button onClick={handleTicketSubmission}>Submit</button>
                        <button onClick={() => setIsModalOpen(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default Support;
