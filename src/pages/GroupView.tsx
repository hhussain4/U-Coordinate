import { useState } from 'react';
import { Group } from '@classes/Group';
import { User } from '@classes/User';
import GroupDetails from '@components/GroupDetails';
import CreateGroup from '@components/CreateGroup';
import '@styles/Pages.css';

const GroupView: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const [groups, setGroups] = useState<Group[]>(() => {
        // retrieves groups from local storage
        const savedGroups = localStorage.getItem("groups");
        if (!savedGroups) return [];

        const parsedGroups = JSON.parse(savedGroups);
        return parsedGroups.map((group: any) => {
            return new Group(group.name,
                group.admins.map((admin: any) => new User(admin.username, admin.displayName)),
                group.members.map((member: any) => new User(member.username, member.displayName)));
        })
    });

    const addGroup = (newGroup: Group) => {
        const updatedGroups = [...groups, newGroup];
        setGroups(updatedGroups);
        localStorage.setItem('groups', JSON.stringify(updatedGroups));
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
            <CreateGroup isOpen={isModalOpen} onClose={closeModal} addGroup={addGroup} />
        </>
    );
}

export default GroupView;
