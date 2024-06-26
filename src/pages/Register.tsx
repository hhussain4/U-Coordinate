import { useState } from 'react';
import { auth, db } from '../config/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { AuthError, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import moment from 'moment-timezone';
import '@styles/Register.css';

interface ErrorData {
  email: string;
  password: string;
  name: string;
  timezone: string;
}

const timezones = moment.tz.names();

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [timezone, setTimezone] = useState(moment.tz.guess());
  const handleTimezoneChange = (e: React.ChangeEvent<HTMLInputElement>) => { setTimezone(e.target.value) };
  const [error, setError] = useState<ErrorData>({ email: "", password: "", name: "", timezone: "" });

  const register = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errorMsg: ErrorData = { email: "", password: "", name: "", timezone: "" };

    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim().toLowerCase();
    const password = (form.elements.namedItem('password') as HTMLInputElement).value.trim();
    const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim();

    if (!validateEmail(email)) {
      errorMsg.email = "Please enter a valid email";
    }
    if (!password) {
      errorMsg.password = "Please enter a password";
    } else if (password.length < 6) {
      errorMsg.password = "Password must be at least 6 characters";
    }
    if (!validateName(name)) {
      errorMsg.name = "Please enter a valid name";
    }
    if (!timezone || !timezones.includes(timezone)) {
      errorMsg.timezone = "Please enter a valid timezone";
    }

    setError(errorMsg);

    // only register if there are no errors
    if (Object.values(errorMsg).every((error) => !error)) {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        addDoc(collection(db, 'User'), {
          email: email,
          display_name: name,
          theme: 'light',
          timezone: timezone
        });
        navigate("../");
      } catch (e) {
        if ((e as AuthError).code === "auth/email-already-in-use") {
          errorMsg.email = "This email is already in use";
        } else {
          errorMsg.timezone = "An error occured while registering";
        }
        setError(errorMsg);
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Register</h2>
        <form onSubmit={register} >
          <label>
            <input
              className='register-field'
              type="text"
              id="email"
              name="email"
              placeholder='Email'
            />
            {error.email && <div className="error-message">{error.email}</div>}
          </label>
          <label>
            <input
              className='register-field'
              type="password"
              id="password"
              name="password"
              placeholder='Password'
            />
            {error.password && <div className="error-message">{error.password}</div>}
          </label>

          <label>
            <input
              className='register-field'
              type="text"
              id="name"
              name="name"
              placeholder='Name'
            />
            {error.name && <div className="error-message">{error.name}</div>}
          </label>

          <label>
            <input
              type="text"
              id="timezone"
              className="register-field"
              value={timezone}
              onChange={handleTimezoneChange}
              placeholder="Timezone"
              list="timezones"
            />
            <datalist id="timezones">
              {timezones.map((tz, index) => (
                <option key={index} value={tz} />
              ))}
            </datalist>
            {error.timezone && <div className="error-message">{error.timezone}</div>}
          </label>
          <button className='register-btn' type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;

export function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateName(name: string) {
  const nameRegex = /^[a-zA-Z0-9]+[a-zA-Z0-9_\- ]*$/;
  return nameRegex.test(name);
}