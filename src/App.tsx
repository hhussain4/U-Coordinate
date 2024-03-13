import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Calendar from './pages/CalendarView';
import NotFound from './pages/NotFound';

function App() {
  // make index element whatever we decide to be the home page
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Calendar />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
