import { useContext, useState } from 'react';
import { GroupContext, UserContext } from 'src/App';
import { addDoc, collection } from 'firebase/firestore';
import { db } from 'src/config/firebase';
import { Group } from '@classes/Group';
import GroupDetails from '@components/GroupDetails';
import CreateGroup from '@components/CreateGroup';
import '@styles/Pages.css';

const GroupView: React.FC = () => {
    const [user] = useContext(UserContext);
    const [groups] = useContext(GroupContext);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        if (!user) {
            alert('Sign in to use this feature');
            return;
        }
        setIsModalOpen(true);
    }
    const closeModal = () => setIsModalOpen(false);

    const addGroup = async (newGroup: Group) => {
        try {
            const admins = newGroup.admins.map(admin => admin.username);
            const members = newGroup.members.map(member => member.username);
            addDoc(collection(db, 'Group'), {
                name: newGroup.name,
                admins: admins,
                members: members
            });
            // notify members of groups creation
            const notification = newGroup.getCreationNotification(user!);
            [...admins, ...members].forEach(username => notification.notify(username));
        } catch (error) {
            console.log(error);
            alert('An error occured while creating group');
        }
    };

    return (
        <>
            <div className='header'>
                <h2 className="title">Groups</h2>
                <button className="create-button" onClick={openModal}>+</button>
            </div>
            <GroupDetails groups={groups} />
            <div className='empty'>
                {groups.length == 0 && <p>No groups to display</p>}
            </div>
            {isModalOpen && <CreateGroup onClose={closeModal} addGroup={addGroup} />}
        </>
    );
}

export default GroupView;
