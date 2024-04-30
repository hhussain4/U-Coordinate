import { useEffect, useState } from "react";
import { Group } from "@classes/Group";
import { User } from "@classes/User";
import { collection, getDocs } from "firebase/firestore";
import { db } from "src/config/firebase";
import Multiselect from "multiselect-react-dropdown";
import '@styles/CreateForm.css';

interface GroupFormProps {
    group: Group;
    addGroup: (group: Group) => void;
    updateGroup: (group: Group) => void;
    onClose: () => void;
}

interface ErrorData {
    name: string;
    tag: string;
    admins: string;
    members: string;
}

const GroupForm: React.FC<GroupFormProps> = ({ group, addGroup, updateGroup, onClose }) => {
    const [errors, setErrors] = useState<ErrorData>({ name: "", tag: "", admins: "", members: "" });
    const [usernames, setUsernames] = useState<string[]>([]);
    const [admins, setAdmins] = useState<User[]>(group.admins);
    const [members, setMembers] = useState<User[]>(group.members);
    const [groupTags, setGroupTags] = useState<String[]>([]);

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

    // gets usernames and group tags from the database
    useEffect(() => {
        const fetchUsernames = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'User'));
                const usernames = querySnapshot.docs.map(doc => doc.data().email);
                setUsernames(usernames);
            } catch (error) {
                console.error('Error fetching usernames:', error);
            }
        };
        const fetchGroupTags = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'Group'));
                const tags = querySnapshot.docs.map(doc => doc.id);
                setGroupTags(tags);
            } catch (error) {
                console.error('Error fetching group tags:', error);
            }
        }

        fetchUsernames();
        fetchGroupTags();
    }, []);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const errorMsg: ErrorData = { name: "", tag: "", admins: "", members: "" };

        const form = e.currentTarget;
        const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim();
        const tag = "@" + (form.elements.namedItem('tag') as HTMLInputElement).value.trim().toLowerCase();

        //check for errors
        if (!name) {
            errorMsg.name = "Please enter a group name";
        }
        if (admins.length === 0) {
            errorMsg.admins = "Please provide at least one admin";
        }
        if (!tag) {
            errorMsg.tag = "Please enter a group tag";
        }

        // validate input
        if (!group.tag && groupTags.includes(tag)) {
            errorMsg.tag = "This tag is already in use";
        }
        if (!validateTag(tag)) {
            errorMsg.tag = "Tags can only include alphanumeric characters and underscores";
        }

        // check for duplicate members
        const memberList = members.map(member => member.username);
        admins.forEach(admin => {
            if (memberList.includes(admin.username)) {
                errorMsg.members = "Cannot have a user as both an admin and member";
            }
        });

        setErrors(errorMsg);

        //only submit if there are no errors
        if (Object.values(errorMsg).every((error) => !error)) {
            // only update group if it had a group tag and is different from the previous group
            const newGroup = new Group(tag, name, admins, members);
            if (group.tag) {
                if (!group.equals(newGroup)) updateGroup(newGroup);
            } else {
                addGroup(newGroup);
            }
            onClose();
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal">
                <button className="modal-close-btn" onClick={onClose}>X</button>
                <h2>Create Group</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Group Name:
                        <input type="text" name="name" defaultValue={group.name} />
                        {errors.name && <div className="err-msg">{errors.name}</div>}
                    </label>
                    <label>
                        Group Tag:
                        <input type="text" name="tag" defaultValue={group.tag.substring(1)} readOnly={!!group.tag} />
                        {errors.tag && <div className="err-msg">{errors.tag}</div>}
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
                    <button className="submit-button" type="submit">Submit</button>
                </form>
            </div>
        </div>
    )
};

export default GroupForm;

function validateTag(tag: string) {
    const tagRegex = /^@[a-zA-Z0-9_]+$/;
    return tagRegex.test(tag);
}