import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "src/App";
import { Group } from "@classes/Group";
import '@styles/Pages.css';

interface GroupDetailsProps {
    groups: Group[];
    onEdit: (group: Group) => void;
    onAnnounce: (group: Group) => void;
    onDelete: (group: Group) => void;
    onLeave: (group: Group) => void;
}

const GroupDetails: React.FC<GroupDetailsProps> = ({ groups, onEdit, onDelete, onAnnounce, onLeave }) => {
    const [user] = useContext(UserContext)
    // Makes open state of all the groups options initially set to false
    const [openStates, setOpenStates] = useState<boolean[]>(Array(groups.length).fill(false));
    const handleDropdown = ((index: number) => {
        const updatedOpenStates = [...openStates];
        updatedOpenStates[index] = !updatedOpenStates[index];
        setOpenStates(updatedOpenStates);
    });

    // Listens for when you click away from the event menu
    const groupMenus = useRef<(HTMLDivElement | null)[]>(Array(groups.length).fill(null));
    useEffect(() => {
        const closeDropdown = (e: MouseEvent) => {
            const updatedOpenStates = [...openStates];
            groupMenus.current.forEach((element, i) => {
                if (!element?.contains(e.target as Node)) {
                    updatedOpenStates[i] = false;
                }
            });
            setOpenStates(updatedOpenStates);
        };

        document.addEventListener('mousedown', closeDropdown);
        return () => {
            document.removeEventListener('mousedown', closeDropdown);
        };
    }, [openStates]);

    return (
        <div className="group-list">
            {groups.map((group, index) => (
                <div key={index} className="group">
                    <div className="group-name">
                        <h3>{group.name}</h3>
                        <div className='group-dropdown' ref={e => groupMenus.current[index] = e}>
                            <button className="group-button" onClick={() => handleDropdown(index)}>
                                <i className="fa-solid fa-ellipsis"></i>
                            </button>
                            {openStates[index] &&
                                <div className="group-options">
                                    {group.admins.map(admin => admin.username).includes(user!.username) ?
                                        <>
                                            <button className="group-option-btn" onClick={() => onEdit(group)}> Edit </button>
                                            <button className="group-option-btn" onClick={() => onAnnounce(group)}> Announcement </button>
                                            <button className="group-option-btn" onClick={() => onDelete(group)}> Delete </button>
                                        </> :
                                        <button className="group-option-btn" onClick={() => onLeave(group)}> Leave </button>}
                                </div>}
                        </div>
                    </div>
                    <div className="group-members">
                        <p>Admins: </p>
                        <ul>
                            {group.admins.map((admin, i) => (
                                <li key={i}>{admin.displayName}</li>
                            ))}
                        </ul>
                        {group.members.length > 0 &&
                        <>
                            <p>Members: </p>
                            <ul>
                                {group.members.map((member, i) => (
                                    <li key={i}>{member.displayName}</li>
                                ))}
                            </ul>
                        </>}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default GroupDetails;