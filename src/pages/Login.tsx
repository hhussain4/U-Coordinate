import { useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { User } from 'firebase/auth';
import firebase from 'firebase/compat';
import { useNavigate } from 'react-router-dom';
import '@styles/Login.css';
import { Link } from 'react-router-dom';

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<User | null>(null)
  // Use useEffect to listen for changes in authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        console.log("Current User:", user.email);
      } else {
        console.log("No user signed in.");
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    await signInWithEmailAndPassword(auth, email, password).then((userCredential) =>  {
      console.log(userCredential);
      navigate("./calendar");
    }).catch((error) => {
      console.log("Could not log in");
    });
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>U-Coordinate</h2>
        <form>
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
          </label>
          <div>
            <button onClick={signIn} className='login-btn' type="button">Log in</button>
            <Link to="/register"><button className='register-btn-login' type="button">Register</button></Link>
            <button onClick={logOut} className='logout-btn' type="button">Log out</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;