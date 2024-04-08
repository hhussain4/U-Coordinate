import { useState } from 'react';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '@styles/Login.css';

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const signIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
      console.log(userCredential);
      navigate("./calendar");
    }).catch((e) => {
      console.log("Could not log in");
      if (!email || !password) {
        setError("Please fill out all fields");
      } else {
        setError("Incorrect email or password");
      }
    });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>U-Coordinate</h2>
        <form onSubmit={signIn}>
          <label>
            <input
              className='login-field'
              type="text"
              id="email"
              name="email"
              placeholder='Email'
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            <input
              className='password-field'
              type="password"
              id="password"
              name="password"
              placeholder='Password'
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <div className="err-msg">{error}</div>}
          </label>
          <div className='auth-buttons'>
            <button className='login-btn' type="submit">Log in</button>
            <Link to="/register"><button className='register-btn-login' type="button">Register</button></Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;