import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from 'src/config/firebase';
import '@styles/CreateForm.css';

interface FAQProps {
    onClose: () => void;
    updateFAQ: () => void;
}

interface ErrorData {
    question: string;
    answer: string;
}

const FAQ: React.FC<FAQProps> = ({ onClose, updateFAQ }) => {
    const [errors, setErrors] = useState<ErrorData>({ question: '', answer: '' });
    
    const handleAddFAQ = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const errorMsg: ErrorData = { question: '', answer: '' };

        const form = e.currentTarget;
        const question = (form.elements.namedItem('question') as HTMLInputElement).value.trim();
        const answer = (form.elements.namedItem('answer') as HTMLInputElement).value.trim();
        
        // Check if both question and answer are not empty
        if (!question) {
            errorMsg.question = "Please provide a question";
        }
        if (!answer) {
            errorMsg.answer = "Please provide an answer";
        }

        setErrors(errorMsg);
        
        // only add FAQ if there are no errors
        if (Object.values(errorMsg).every((error) => !error)) {
            addDoc(collection(db, 'FAQs'), {
                question: question,
                answer: answer
            }).then(() => {
                console.log("FAQ posted successfully");
                onClose();
                updateFAQ();
            }).catch((error) => {
                console.log(error);
                alert("Error occured while creating FAQ");
            });
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <button className="modal-close-btn" onClick={onClose}>X</button>
                <h2>Post a FAQ</h2>
                <form onSubmit={handleAddFAQ}>
                    <label>
                        Question:
                        <input type="text" name="question" />
                        {errors.question && <div className="err-msg">{errors.question}</div>}
                    </label>
                    <label>
                        Answer:
                        <textarea name="answer" />
                        {errors.answer && <div className="err-msg">{errors.answer}</div>}
                    </label>
                    <button className="submit-button" type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default FAQ;