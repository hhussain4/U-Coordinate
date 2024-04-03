import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './config/firebase';
import { User, onAuthStateChanged } from 'firebase/auth';
import Calendar from '@pages/CalendarView';
import NotFound from '@pages/NotFound';
import NavBar from '@components/NavBar';
import GroupView from '@pages/GroupView';
import Support from '@pages/Support';
import Login from '@pages/Login';
import Register from '@pages/Register';
import Settings from '@pages/Settings';

function App() {
  const [user, setUser] = useState<User | null>(null)

  // checks for changes in the authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        console.log('User is not logged in');
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <BrowserRouter>
        <NavBar user={user} />
        <Routes>
          <Route index element={user ? <Navigate to="/calendar" /> : <Login />}/>
          <Route path="/register" element={<Register />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/groups" element={<GroupView />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/support" element={<Support />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
