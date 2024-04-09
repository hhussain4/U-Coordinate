import { useContext, useEffect, useState } from "react";
import { Group } from "@classes/Group";
import { User } from "@classes/User";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "src/config/firebase";
import { UserContext } from "src/App";
import Multiselect from "multiselect-react-dropdown";
import '@styles/CreateForm.css';

interface CreateGroupProps {
    onClose: () => void;
    group: Group;
}

interface ErrorData {
    name: string;
    admins: string;
    members: string;
}

const EditGroup: React.FC<CreateGroupProps> = ({ onClose, group }) => {
    const [user] = useContext(UserContext);
    const [errors, setErrors] = useState<ErrorData>({ name: "", admins: "", members: "" });
    const [usernames, setUsernames] = useState<string[]>([]);
    const [admins, setAdmins] = useState<User[]>(group.admins);
    const [members, setMembers] = useState<User[]>(group.members);

    // multiselect functions
    const addAdmin = (prevList: string[], user: string) => {
        setAdmins((prevAdmin) => [...prevAdmin, new User(user)]);
    }
    const removeAdmin = (prevList: string[], user: string) => {
        setAdmins((prevAdmin) => prevAdmin.filter(admin => admin.username != user));
    }
    const addMember = (prevList: string[], user: string) => {
        setMembers((prevMember) => [...prevMember, new User(user)]);
    }
    const removeMember = (prevList: string[], user: string) => {
        setMembers((prevMember) => prevMember.filter(member => member.username != user));
    }

    // gets usernames from the database
    useEffect(() => {
        const fetchUsernames = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'User'));
                const usernames = querySnapshot.docs.map(doc => doc.id);
                setUsernames(usernames);
            } catch (error) {
                console.error('Error fetching usernames:', error);
            }
        };

        fetchUsernames();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const errorMsg: ErrorData = { name: "", admins: "", members: "" };

        const form = e.currentTarget;
        const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim();

        //check for errors
        if (!name) {
            errorMsg.name = "Please enter a group name";
        }
        if (admins.length === 0) {
            errorMsg.admins = "Please provide at least one admin";
        }
        if (members.length === 0) {
            errorMsg.members = "Please provide at least one member";
        }

        // check for duplicate members
        admins.forEach(admin => {
            const memberList = members.map(member => member.username);
            if (memberList.includes(admin.username)) {
                errorMsg.members = "Cannot have a user as both an admin and member";
            }
        });

        setErrors(errorMsg);

        //only save if there are no errors
        if (Object.values(errorMsg).every((error) => !error)) {
            try {
                await updateDoc(doc(db, 'Group', group.id), {
                    name: name,
                    admins: admins.map(admin => admin.username),
                    members: members.map(member => member.username)
                });
                onClose();
                notifyChanges(group, new Group(name, admins, members), user!);
            } catch (error) {
                console.log('Error updating group', error);
                alert('An error occured while updating the group');
            }
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal">
                <button className="modal-close-btn" onClick={onClose}>X</button>
                <h2>Edit Group</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Group Name:
                        <input type="text" name="name" value={group.name} />
                        {errors.name && <div className="err-msg">{errors.name}</div>}
                    </label>
                    <label>
                        Admins:
                        <Multiselect
                            isObject={false}
                            options={usernames}
                            selectedValues={group.admins.map(admin => admin.username)}
                            onSelect={addAdmin}
                            onRemove={removeAdmin}
                            hidePlaceholder={true}
                        />
                        {errors.admins && <div className="err-msg">{errors.admins}</div>}
                    </label>
                    <label>
                        Members:
                        <Multiselect
                            isObject={false}
                            options={usernames}
                            selectedValues={group.members.map(member => member.username)}
                            onSelect={addMember}
                            onRemove={removeMember}
                            hidePlaceholder={true}
                        />
                        {errors.members && <div className="err-msg">{errors.members}</div>}
                    </label>
                    <button className="submit-button" type="submit">Save</button>
                </form>
            </div>
        </div>
    )
};

// notifies users accordingly of changes
function notifyChanges(prevGroup: Group, newGroup: Group, user: User) {
    const prevAdminUsernames = new Set(prevGroup.admins.map(admin => admin.username));
    const newAdminUsernames = new Set(newGroup.admins.map(admin => admin.username));
    const prevMemberUsernames = new Set(prevGroup.members.map(member => member.username));
    const newMemberUsernames = new Set(newGroup.members.map(member => member.username));

    const removedAdmins = prevGroup.admins.filter(admin => !newAdminUsernames.has(admin.username));
    const addedAdmins = newGroup.admins.filter(admin => !prevAdminUsernames.has(admin.username));
    const removedMembers = prevGroup.members.filter(member => !newMemberUsernames.has(member.username));
    const addedMembers = newGroup.members.filter(member => !prevMemberUsernames.has(member.username));
    
    // if names do not match
    if (prevGroup.name !== newGroup.name) {
        const notification = newGroup.getNameChangeNotification(user, prevGroup.name);
        [...newAdminUsernames, ...newMemberUsernames].forEach(e => notification.notify(e));
    }
    
    // notify added users
    const addnotification = newGroup.getAddNotification(user);
    [...addedAdmins, ...addedMembers].forEach(e => addnotification.notify(e.username))
    // notify removed users
    const removeNotification = newGroup.getRemoveNotification(user);
    [...removedAdmins, ...removedMembers].forEach(e => removeNotification.notify(e.username));
}

export default EditGroup;