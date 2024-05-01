import { useContext, useState } from 'react';
import { GroupContext, UserContext } from 'src/App';
import { collection, deleteDoc, doc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from 'src/config/firebase';
import { User } from '@classes/User';
import { Group } from '@classes/Group';
import GroupDetails from '@components/GroupDetails';
import GroupForm from '@components/GroupForm';
import CreateAnnouncement from '@components/CreateAnnouncement';
import '@styles/Pages.css';

const GroupView: React.FC = () => {
    const [user] = useContext(UserContext);
    const [groups] = useContext(GroupContext);
    const defaultGroup = new Group();
    defaultGroup.addAdmin(new User(user?.username));

    const [manageGroup, setManageGroup] = useState<Group>(defaultGroup);
    const [groupFormOpen, setGroupFormOpen] = useState(false);
    const [isAnnounceModalOpen, setIsAnnounceModalOpen] = useState(false);

    // functions for opening and closing group form
    const openModal = () => {
        if (!user) {
            alert('Sign in to use this feature');
            return;
        }
        setGroupFormOpen(true);
        setManageGroup(defaultGroup)
    }
    const closeModal = () => {
        setGroupFormOpen(false);
    }
    
    // function to add group to database
    const addGroup = async (newGroup: Group) => {
        try {
            const admins = newGroup.admins.map(admin => admin.username);
            const members = newGroup.members.map(member => member.username);
            await setDoc(doc(db, 'Group', newGroup.tag), {
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

    // function to update group in database
    const updateGroup = async (group: Group) => {
        try {
            const prevGroup = groups.find(e => e.tag == group.tag);
            await updateDoc(doc(db, 'Group', group.tag), {
                name: group.name,
                admins: group.admins.map(admin => admin.username),
                members: group.members.map(member => member.username)
            });
            group.notifyChanges(prevGroup!, user!);
        } catch (error) {
            console.log('Error updating group', error);
            alert('An error occured while updating the group');
        }
    }

    // group options
    const editGroup = (group: Group) => {
        setManageGroup(group);
        setGroupFormOpen(true);
    }

    const deleteGroup = async (group: Group) => {
        try {
            const admins = group.admins.map(admin => admin.username);
            const members = group.members.map(member => member.username);
            await deleteDoc(doc(db, 'Group', group.tag));
            
            // notify users of group deletion
            const notification = group.getDeleteNotification(user!);
            [...admins, ...members].forEach(username => notification.notify(username));
            
            // delete events where the group is the only one involved
            const events = await getDocs(query(collection(db, 'Event'), where('groups', 'array-contains', group.tag)));
            events.forEach(event => {
                const eventData = event.data();
                const eventMembers = eventData.members || [];
                const eventGroups = eventData.groups;
                if (eventMembers.length === 0 && eventGroups.length === 1) {
                    deleteDoc(event.ref);
                }
            });
        } catch (error) {
            console.log(error);
            alert("Error occured while deleting group");
        }
    };

    const makeAnnouncement = (group: Group) => {
        setManageGroup(group);
        setIsAnnounceModalOpen(true);
    }

    const leaveGroup = async (group: Group) => {
        try {
            const members = group.members.map(member => member.username).filter(member => member != user?.username);
            await updateDoc(doc(db, 'Group', group.tag), {members: members});
            const notification = group.getLeaveNotification(user!);
            group.admins.forEach(admin => notification.notify(admin.username));
        } catch (error) {
            console.log(error);
            alert("Error occured while leaving group");
        }
    }

    return (
        <>
            <div className='header'>
                <h2 className="title">Groups</h2>
                <button className="create-button" onClick={openModal}>+</button>
            </div>
            <GroupDetails groups={groups} onEdit={editGroup} onAnnounce={makeAnnouncement} onDelete={deleteGroup} onLeave={leaveGroup}/>
            <div className='empty'>
                {groups.length == 0 && <p>No groups to display</p>}
            </div>
            {groupFormOpen && <GroupForm group={manageGroup} addGroup={addGroup} updateGroup={updateGroup} onClose={closeModal} />}
            {isAnnounceModalOpen && <CreateAnnouncement onClose={() => setIsAnnounceModalOpen(false)} group={manageGroup} />}
        </>
    );
}

export default GroupView;
