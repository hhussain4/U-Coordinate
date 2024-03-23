import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Calendar from '@pages/CalendarView';
import NotFound from '@pages/NotFound';
import NavBar from '@components/NavBar';
import GroupView from '@pages/GroupView';
import Support from '@pages/Support';
import Login from '@pages/Login';
import Register from '@pages/Register';

function App() {
  return (
    <div>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route index element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/groups" element={<GroupView />} />
          <Route path="/support" element={<Support />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
