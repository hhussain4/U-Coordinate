import { useState } from 'react';
import '@styles/Pages.css';
import CreateGroup from '@components/CreateGroup';

const GroupView: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    return (
        <>
            <div className='header'>
                <h2 className="title">Groups</h2>
                <button className="create-button" onClick={handleOpenModal}>+</button>
            </div>
            <div className='group-list'>
                
            </div>
            <CreateGroup isOpen={isModalOpen} onClose={handleCloseModal} />
        </>
    );
}

export default GroupView;
