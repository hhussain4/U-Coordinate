import { useContext, useState } from 'react';
import { GroupContext, UserContext } from 'src/App';
import { addDoc, collection, deleteDoc, doc } from 'firebase/firestore';
import { db } from 'src/config/firebase';
import { Group } from '@classes/Group';
import GroupDetails from '@components/GroupDetails';
import CreateGroup from '@components/CreateGroup';
import EditGroup from '@components/EditGroup';
import '@styles/Pages.css';

const GroupView: React.FC = () => {
    const [user] = useContext(UserContext);
    const [groups] = useContext(GroupContext);
    const [manageGroup, setManageGroup] = useState<Group>(new Group());
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAnnounceModalOpen, setIsAnnounceModalOpen] = useState(false);

    const openModal = () => {
        if (!user) {
            alert('Sign in to use this feature');
            return;
        }
        setIsCreateModalOpen(true);
    }
    const closeModal = () => setIsCreateModalOpen(false);
    
    const addGroup = async (newGroup: Group) => {
        try {
            const admins = newGroup.admins.map(admin => admin.username);
            const members = newGroup.members.map(member => member.username);
            await addDoc(collection(db, 'Group'), {
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

    // group options
    const editGroup = async (group: Group) => {
        setManageGroup(group);
        setIsEditModalOpen(true);
    }

    const deleteGroup = async (group: Group) => {
        try {
            const admins = group.admins.map(admin => admin.username);
            const members = group.members.map(member => member.username);
            await deleteDoc(doc(db, 'Group', group.id));
            // notify users of event deletion
            const notification = group.getDeleteNotification(user!);
            [...admins, ...members].forEach(username => notification.notify(username));
        } catch (error) {
            console.log(error);
            alert("Error occured while deleting group");
        }
    };

    const makeAnnouncement = async (group: Group) => {
        setManageGroup(group);
        setIsAnnounceModalOpen(true);
    }

    return (
        <>
            <div className='header'>
                <h2 className="title">Groups</h2>
                <button className="create-button" onClick={openModal}>+</button>
            </div>
            <GroupDetails groups={groups} onEdit={editGroup} onAnnounce={makeAnnouncement} onDelete={deleteGroup}/>
            <div className='empty'>
                {groups.length == 0 && <p>No groups to display</p>}
            </div>
            {isCreateModalOpen && <CreateGroup onClose={closeModal} addGroup={addGroup} />}
            {isEditModalOpen && <EditGroup onClose={() => setIsEditModalOpen(false)} group={manageGroup} />}
            {/* {isAnnounceModalOpen && <CreateAnnouncement onClose={() => setIsAnnounceModalOpen(false)} group={manageGroup} />} */}
        </>
    );
}

export default GroupView;
