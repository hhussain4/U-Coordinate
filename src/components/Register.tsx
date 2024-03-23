import React, { useState } from 'react';
import { auth } from '../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import '@styles/Register.css'; 

const Register: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
  
    const register = async () => {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
      } catch (err) {
        console.error(err)
      }
    };
  
    return (
      <div className="register-container">
        <div className="register-box">
          <h2>Register</h2>
          {error && <div className="error-message">{error}</div>}
          <form>
            <div className="form-group">
              <input 
                className='register-field' 
                type="text" 
                id="email" 
                name="email" 
                placeholder='Email' 
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <input 
                className='register-field' 
                type="password" 
                id="password" 
                name="password" 
                placeholder='Password'
                onChange={(e) => setPassword(e.target.value)}
              />
              </div>

              <div className="form-group">
              <input 
                className='register-field' 
                type="text" 
                id="name" 
                name="name" 
                placeholder='Name'
    
              />
              </div>

              <div className="form-group">
              <input 
                className='register-field' 
                type="text" 
                id="timezone" 
                name="timezone" 
                placeholder='Timezone'
    
              />
              
            </div>
  
            <div>
              <button onClick={register} className='register-btn' type="button">Register</button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  export default Register;