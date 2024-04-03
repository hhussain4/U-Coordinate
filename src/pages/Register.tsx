import { useState } from 'react';
import { auth } from '../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '@styles/Register.css';

interface ErrorData {
  email: string;
  password: string;
  name: string;
  timezone: string;
}
const Register: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<ErrorData>({ email: "", password: "", name: "", timezone: "" });

  const register = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errorMsg: ErrorData = { email: "", password: "", name: "", timezone: "" };

    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem('password') as HTMLInputElement).value.trim();
    const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim();
    const timezone = (form.elements.namedItem('timezone') as HTMLInputElement).value.trim();

    // TODO: validate timezone and password
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
    if (!timezone) {
      errorMsg.timezone = "Please choose a timezone";
    }

    setError(errorMsg);

    // only register if there are no errors
    if (Object.values(errorMsg).every((error) => !error)) {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        navigate("../");
      } catch (err) {
        console.error(err)
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
              className='register-field'
              type="text"
              id="timezone"
              name="timezone"
              placeholder='Timezone'
            />
            {error.timezone && <div className="error-message">{error.timezone}</div>}
          </label>
          <button className='register-btn' type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;

function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateName(name: string) {
  const nameRegex = /^[a-zA-Z0-9]+[a-zA-Z0-9_\-]*/;
  return nameRegex.test(name);
}