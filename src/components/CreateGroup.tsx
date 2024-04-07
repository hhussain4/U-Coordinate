import { useState } from "react";
import { Group } from "@classes/Group";
import { User } from "@classes/User";
import '@styles/CreateForm.css';

interface CreateGroupProps {
    onClose: () => void;
    addGroup: (group: Group) => void;
}

interface ErrorData {
    name: string;
    admins: string;
    members: string;
}

const CreateGroup: React.FC<CreateGroupProps> = ({ onClose, addGroup }) => {
    const [errors, setErrors] = useState<ErrorData>({ name: "", admins: "", members: "" });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const errorMsg: ErrorData = { name: "", admins: "", members: "" };

        const form = e.currentTarget;
        const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim();
        const admins = (form.elements.namedItem('admins') as HTMLInputElement).value.trim();
        const members = (form.elements.namedItem('members') as HTMLInputElement).value.trim();

        //check for errors
        if (!name) {
            errorMsg.name = "Please enter a group name";
        }
        if (!admins) {
            errorMsg.admins = "Please provide at least one username";
        }
        if (!members) {
            errorMsg.members = "Please provide at least one username";
        }

        // TODO: check if usernames are in the database and retrieve those users
        const adminList = admins.replaceAll(' ', '').split(",").map((admin) => new User(admin, admin));
        const memberList = members.replaceAll(' ', '').split(",").map((member) => new User(member, member));

        setErrors(errorMsg);

        //only submit if there are no errors
        if (Object.values(errorMsg).every((error) => !error)) {
            const group = new Group(name, adminList, memberList);
            addGroup(group);
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
                        <input type="text" name="name" />
                        {errors.name && <div className="err-msg">{errors.name}</div>}
                    </label>
                    <label>
                        Admins:
                        <input type="text" name="admins" />
                        {errors.admins && <div className="err-msg">{errors.admins}</div>}
                    </label>
                    <label>
                        Members:
                        <input type="text" name="members" />
                        {errors.members && <div className="err-msg">{errors.members}</div>}
                    </label>
                    <button className="submit-button" type="submit">Submit</button>
                </form>
            </div>
        </div>
    )
};

export default CreateGroup;