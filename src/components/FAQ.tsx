import React, { useState } from 'react';

interface FAQProps {
    onAddFAQ: (question: string, answer: string) => void;
}

const FAQ: React.FC<FAQProps> = ({ onAddFAQ }) => {
    const [question, setQuestion] = useState<string>('');
    const [answer, setAnswer] = useState<string>('');

    const handleAddFAQ = () => {
        // Check if both question and answer are not empty
        if (question.trim() !== '' && answer.trim() !== '') {
            // Call the onAddFAQ function with the question and answer
            onAddFAQ(question.trim(), answer.trim());
            // Clear the input fields
            setQuestion('');
            setAnswer('');
        } else {
            // Display an error message or handle the case where one of the fields is empty
            // For example, show a toast message or highlight the empty fields
            alert('Please enter both question and answer.');
        }
    };

    return (
        <div className="faq-popup">
            <h2>Post a FAQ</h2>
            <div className="input-group">
                <label htmlFor="question">Question:</label>
                <input
                    type="text"
                    id="question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                />
            </div>
            <div className="input-group">
                <label htmlFor="answer">Answer:</label>
                <textarea
                    id="answer"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                />
            </div>
            <button onClick={handleAddFAQ}>Submit FAQ</button>
        </div>
    );
};

export default FAQ;
