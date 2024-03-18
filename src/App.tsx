import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Calendar from '@pages/CalendarView';
import NotFound from '@pages/NotFound';
import DarkModeToggle from './components/DarkMode'; // Import DarkModeToggle component

function App() {
  return (
    <div>
      <BrowserRouter>
        {/* Add the DarkModeToggle component outside the Routes */}
        <DarkModeToggle />
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
