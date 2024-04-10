import { useState, useEffect, useContext } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { UserContext } from 'src/App';
import FAQ from '@components/FAQ';
import FileTicket from '@components/FileTicket';
import '@styles/Support.css';

interface Result {
    id: string;
    question: string;
    answer: string;
}

const Support: React.FC = () => {
    const [user] = useContext(UserContext);
    const [showFAQPopup, setShowFAQPopup] = useState<boolean>(false);
    const [faqs, setFaqs] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filteredResults, setFilteredResults] = useState<Result[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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
        if (!user) {
            alert('Sign in to use this feature');
            return;
        }
        setIsModalOpen(true);
    };

    const handlePostFAQ = () => {
        if (!user) {
            alert('You do not have the permissions for this');
            return;
        }
        setShowFAQPopup(true);
    };

    // fetch FAQs upon component mount
    useEffect(() => {
        fetchFAQs();
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

            <div className="button-container">
                {/* File a Ticket button */}
                <button onClick={handleFileTicket} className='file-ticket-btn'>File a Ticket</button>
                {/* Post a FAQ button */}
                <button onClick={handlePostFAQ} className='post-faq-btn'>Post a FAQ</button>
            </div>
            {showFAQPopup && <FAQ onClose={() => setShowFAQPopup(false)} updateFAQ={fetchFAQs} />}
            {/* Modal for filing a ticket */}
            {isModalOpen && <FileTicket onClose={() => setIsModalOpen(false)} />}
        </>
    );
}

export default Support;
