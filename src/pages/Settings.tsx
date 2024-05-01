import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from 'src/config/firebase';
import { collection, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword, updateEmail } from 'firebase/auth';
import { UserContext } from 'src/App';
import { validateName, validateEmail } from './Register';
import { User } from '@classes/User';
import moment from 'moment';
import '@styles/Settings.css'


interface ErrorData {
    name: string;
    email: string;
    password: string;
    newPassword: string;
    timezone: string;
}

const Settings: React.FC = () => {
    const [user, setUser] = useContext(UserContext);
    const [errors, setErrors] = useState<ErrorData>({ name: '', email: '', password: '', newPassword: '', timezone: '' });
    const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');

    const userAuth = auth.currentUser;
    let navigate = useNavigate();
    const timezones = moment.tz.names();

    // save changes and update database
    const saveChanges = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!userAuth || !user) return;
        const errorMsg: ErrorData = { name: '', email: '', password: '', newPassword: '', timezone: '' };

        const form = e.currentTarget;
        const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim();
        const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim();
        const password = (form.elements.namedItem('password') as HTMLInputElement).value;
        const newPass = (form.elements.namedItem('newPass') as HTMLInputElement).value;
        const confirmPass = (form.elements.namedItem('confirmPass') as HTMLInputElement).value;
        const timezone = (form.elements.namedItem('timezone') as HTMLInputElement).value;
        const theme = darkMode ? 'dark' : 'light';

        // validate inputs 
        if (!validateName(name)) {
            errorMsg.name = "Please enter a valid name";
        }
        if (!validateEmail(email)) {
            errorMsg.email = "Please enter a valid email";
        }
        // for changing passwords
        if (newPass || confirmPass) {
            if (newPass !== confirmPass) {
                errorMsg.newPassword = "Passwords must match";
            } else if (newPass.length < 6) {
                errorMsg.newPassword = "Password must be at least 6 characters";
            }
        }
        // must reauthenticate before changing password or email
        if ((newPass || confirmPass || (email !== user.username))) {
            if (!password) {
                errorMsg.password = "Please enter password"
            } else {
                await reauthenticateWithCredential(userAuth, EmailAuthProvider.credential(
                    user.username,
                    password
                )).catch(e => {
                    console.log(e);
                    errorMsg.password = 'Incorrect Password';
                });
            }
        }
        if (!timezones.includes(timezone)) {
            errorMsg.timezone = "Please enter a valid timezone";
        }

        setErrors(errorMsg);

        // save changes if there are no errors
        if (Object.values(errorMsg).every((error) => !error)) {
            try {
                localStorage.setItem('theme', theme);
                // Query the "User" collection to find the document with the matching email and update changes
                const userDoc = await getDocs(query(collection(db, 'User'), where('email', '==', user.username)));
                userDoc.forEach(document => {
                    updateDoc(document.ref, {
                        display_name: name,
                        timezone: timezone,
                        theme: theme
                    });
                });

                // only update if new password is provided
                if (newPass) {
                    updatePassword(userAuth, newPass);
                }

                // only update if the email changes
                if (email !== user.username) {
                    updateEmail(userAuth, email).then(() => {
                        user.changeUsername(email);
                        userDoc.forEach(document => updateDoc(document.ref, { email: email }));
                    }).catch(error => {
                        console.log(error);
                        errorMsg.email = "This email is already in use";
                        setErrors(errorMsg);
                    });
                }
                setUser(new User(email, name, timezone, theme, user.privilege));
            } catch (error) {
                console.log(error);
                alert("Error occured while saving changes");
            }
        }
    };

    return (
        <>
            <div className='header'>
                <button className='back-button' onClick={() => navigate(-1)}>
                    <i className='fa-solid fa-arrow-left'></i>
                </button>
                <h2>Settings</h2>
            </div>
            <form onSubmit={saveChanges}>
                <div className='settings'>
                    <div className='settings-col'>
                        <label>
                            Display Name
                            <input type="text" name="name" defaultValue={user?.displayName}></input>
                            {errors.name && <div className="err-msg">{errors.name}</div>}
                        </label>
                        <label>
                            Email
                            <input type="text" name="email" defaultValue={user?.username}></input>
                            {errors.email && <div className="err-msg">{errors.email}</div>}
                        </label>
                        <label>
                            Password
                            <input type="password" name="password"></input>
                            {errors.password && <div className="err-msg">{errors.password}</div>}
                        </label>
                        <label>
                            New Password
                            <input type="password" name="newPass"></input>
                        </label>
                        <label>
                            Confirm Password
                            <input type="password" name="confirmPass"></input>
                            {errors.newPassword && <div className="err-msg">{errors.newPassword}</div>}
                        </label>
                    </div>
                    <div className='settings-col'>
                        <label>
                            Timezone
                            <input
                                type="text"
                                name="timezone"
                                defaultValue={user?.timezone}
                                placeholder="Timezone"
                                list="timezones"
                            />
                            <datalist id="timezones">
                                {timezones.map((tz, index) => (
                                    <option key={index} value={tz} />
                                ))}
                            </datalist>
                            {errors.timezone && <div className="error-message">{errors.timezone}</div>}
                        </label>
                        <label>
                            Dark Mode
                            <label className="switch">
                                <input type="checkbox" onChange={() => setDarkMode(prev => !prev)} checked={darkMode} />
                                <span className="slider round"></span>
                            </label>
                        </label>
                    </div>
                </div>
                <div className='save-changes'>
                    <button className='save-btn' type="submit">Save Changes</button>
                </div>
            </form>
        </>
    );
}

export default Settings;