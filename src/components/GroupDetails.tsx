import { Group } from "@classes/Group";
import '@styles/Pages.css';

interface GroupDetailsProps {
    groups: Group[];
}

const GroupDetails: React.FC<GroupDetailsProps> = ({ groups }) => {
    return (
        <div className="group-list">
            {groups.map((group, index) => (
                <div key={index} className="group">
                    <div className="group-name">
                        {group.getName()}
                    </div>
                    <div className="group-members">
                        <p>Admins: </p>
                        <ul>
                            {group.getAdmins().map((admin, i) => (
                                <li key={i}>{admin.displayName}</li>
                            ))}
                        </ul>
                        <p>Members: </p>
                        <ul>
                            {group.getMembers().map((member, i) => (
                                <li key={i}>{member.displayName}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default GroupDetails;