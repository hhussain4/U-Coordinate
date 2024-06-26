import { createContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { auth, db } from './config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection, getDocs, onSnapshot, or, query, where } from 'firebase/firestore';
import { User, getUsers } from '@classes/User';
import { Group } from '@classes/Group';
import Calendar from '@pages/CalendarView';
import moment from 'moment';
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
export const GroupContext = createContext<[Group[], (group: Group[]) => void]>([[], () => null]);

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);

  // checks for changes in the authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userCredential) => {
      if (userCredential) {
        const email = userCredential.email as string;
        const name = userCredential.displayName || 'User';
        const userData = await getUserData(email, name);
        setUser(userData);
        // store theme in local data for faster access
        localStorage.setItem('theme', userData.theme);
      } else {
        console.log('User is not logged in');
      }
    });

    return () => unsubscribe();
  }, []);

  // gets user's groups once signed in
  useEffect(() => {
    if (!user) {
      setGroups([]);
      return;
    }
    const q = query(collection(db, 'Group'), or(where('members', "array-contains", user?.username),
      where('admins', "array-contains", user?.username)));
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const groups = querySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const [admins, members] = await Promise.all([getUsers(data.admins), getUsers(data.members)]);
        return new Group(doc.id, data.name, admins, members);
      });
      const resolvedGroups = await Promise.all(groups);
      setGroups(resolvedGroups);
    });

    () => unsubscribe();
  }, [user]);

  // sets the theme for the entire app
  useEffect(() => {
    // access theme from local data
    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

  }, [user]);

  return (
    <UserContext.Provider value={[user, setUser]}>
      <GroupContext.Provider value={[groups, setGroups]}>
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
      </GroupContext.Provider>
    </UserContext.Provider>
  );
}

// get user from database
async function getUserData(email: string, displayName: string): Promise<User> {
  const userData = await getDocs(query(collection(db, 'User'), where('email', '==', email)));

  // retrieves user data from database
  if (!userData.empty) {
    const user = userData.docs[0].data();
    return new User(email, user.display_name, user.timezone, user.theme);
  }
  // add user to the database if they are not in it
  const timezone = moment.tz.guess();
  await addDoc(collection(db, 'User'), {
    email: email,
    display_name: displayName,
    timezone: timezone,
    theme: 'light'
  });
  return new User(email, displayName, timezone);
}

export default App;
