import { addDoc, collection } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "src/App";
import { db } from "src/config/firebase";
import '@styles/CreateForm.css';

interface TicketData {
    date: string;
    time: string;
    subject: string;
    category: string;
    durationFrom: Date;
    durationTo: Date;
    description: string;
    user_id: string;
}

interface FileTicketProps {
    onClose: () => void;
}

interface ErrorData {
    subject: string;
    description: string;
    time: string;
    user: string;
}

const FileTicket: React.FC<FileTicketProps> = ({ onClose }) => {
    const [user] = useContext(UserContext);
    const [errors, setErrors] = useState<ErrorData>({ subject: "", description: "", time: "", user: "" });
    const [ticketData, setTicketData] = useState<TicketData>({
        date: '',
        time: '',
        subject: '',
        category: 'General',
        durationFrom: new Date(),
        durationTo: new Date(),
        description: '',
        user_id: user?.username as string
    });

    // sets the initial time and date
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
    }, []);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setTicketData({ ...ticketData, [name]: value });
    };

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTicketData({ ...ticketData, category: event.target.value });
    };

    const handleAddFAQ = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const errorMsg: ErrorData = { subject: "", description: "", time: "", user: "" };

        const subject = ticketData.subject.trim();
        const description = ticketData.description.trim();
        const start = ticketData.durationFrom;
        const end = ticketData.durationTo;
        const username = ticketData.user_id.trim();

        if (!subject) {
            errorMsg.subject = "Please provide a subject";
        }
        if (!description) {
            errorMsg.description = `Please provide a ${ticketData.category != 'Time off' ? 'description': 'reason'}`;
        }
        if (!username) {
            errorMsg.user = 'Please sign in to file a ticket';
        }

        //checking for valid inputs
        if ((start >= end) && (ticketData.category === 'Time off')) {
            errorMsg.time = "Please provide a valid time range";
        }

        setErrors(errorMsg);

        // only create ticket if there are no errors
        if (Object.values(errorMsg).every((error) => !error)) {
            // Add the ticket data to Firestore
            try {
                await addDoc(collection(db, "Tickets"), ticketData);
                console.log("Ticket submitted successfully");
                onClose();
            } catch (error) {
                console.log(error);
                alert('Error while submitting ticket');
            }
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <button className="modal-close-btn" onClick={onClose}>X</button>
                <h2>File a Ticket</h2>
                <form onSubmit={handleAddFAQ}>
                    <label>
                        Date:
                        <input type="date" value={ticketData.date} readOnly />
                    </label>
                    <label>
                        Time:
                        <input type="time" value={ticketData.time} readOnly />
                    </label>
                    <label>
                        Subject:
                        <input name="subject" onChange={handleInputChange} />
                        {errors.subject && <div className="err-msg">{errors.subject}</div>}
                    </label>
                    <div className="select-options">
                        <label>
                            Category:
                            <select name="category" onChange={handleCategoryChange}>
                                <option value="General">General</option>
                                <option value="Bug">Bug</option>
                                <option value="Account">Account</option>
                                <option value="Time off">Time Off</option>
                                <option value="Policy">Policy</option>
                            </select>
                        </label>
                    </div>
                    {/* Conditionally render input fields based on category */}
                    {ticketData.category === "Time off" &&
                        <>
                            <label>
                                Start Date:
                                <input type="date" name="durationFrom" onChange={handleInputChange} />
                            </label>
                            <label>
                                End Date:
                                <input type="date" name="durationTo" onChange={handleInputChange} />
                                {errors.time && <div className="err-msg">{errors.time}</div>}
                            </label>
                        </>}
                    <label>
                        {ticketData.category !== "Time off" ? 'Description:' : 'Reason:'}
                        <input name="description" onChange={handleInputChange} />
                        {errors.description && <div className="err-msg">{errors.description}</div>}
                    </label>
                    <label>
                        User Email:
                        <input name="username" value={ticketData.user_id} readOnly />
                        {errors.description && <div className="err-msg">{errors.user}</div>}
                    </label>
                    <button className="submit-button" type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default FileTicket;