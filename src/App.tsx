import { createContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { auth, db } from './config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { User } from '@classes/User';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import moment from 'moment';
import Calendar from '@pages/CalendarView';
import NotFound from '@pages/NotFound';
import NavBar from '@components/NavBar';
import GroupView from '@pages/GroupView';
import Support from '@pages/Support';
import Login from '@pages/Login';
import Register from '@pages/Register';
import Settings from '@pages/Settings';
import ViewTickets from '@pages/ViewTickets';

// allows access to the signed-in user's data from anywhere
export const UserContext = createContext<[User | null, (user: User | null) => void]>([null, () => null]);

function App() {
  const [user, setUser] = useState<User | null>(null);

  // checks for changes in the authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userCredential) => {
      if (userCredential) {
        const email = userCredential.email as string;
        const name = userCredential.displayName || 'User';
        const userData = await getUserData(email, name);
        setUser(userData);
      } else {
        console.log('User is not logged in');
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={[user, setUser]}>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route index element={user ? <Navigate to="/calendar" /> : <Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/groups" element={<GroupView />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/support" element={<Support />} />
          <Route path="/tickets" element={<ViewTickets />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

// get user from database
async function getUserData(email: string, displayName: string): Promise<User> {
  const userData = await getDoc(doc(db, 'User', email));

  // retrieves user data from database
  if (userData.exists()) {
    const user = userData.data();
    return new User(email, user.display_name, user.timezone, user.theme);
  }
  // add user to the database if they are not in it
  const timezone = moment.tz.guess();
  await setDoc(doc(db, 'User', email), {
    display_name: displayName,
    timezone: timezone,
    theme: 'light'
  });
  return new User(email, displayName, timezone);
}

export default App;
