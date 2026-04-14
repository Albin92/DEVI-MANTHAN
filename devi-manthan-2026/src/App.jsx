import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import GlobalLayout from './components/GlobalLayout';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import AboutPage from './pages/AboutPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/admin/AdminPage';
import './styles/homeDesign.css'; // Add the global AAA-game design here

function AppLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <Routes location={location} key={location.pathname}>
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    );
  }

  return (
    <GlobalLayout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </AnimatePresence>
    </GlobalLayout>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
