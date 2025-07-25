import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/sections/navbar';
import Home from './pages/home';
import TryPlayground from './pages/TryPlayground';
import Dashboard from './pages/dashboards';
import AddPrompt from './pages/addPrompt';
import EditPrompt from './pages/editPrompts';
import { Toaster } from 'react-hot-toast';
import './App.css';
import { UserProvider, useUser } from './utils/UserContext';
import { ThemeProvider } from './utils/ThemeContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Account from './pages/Account';
import PublicPrompt from './pages/PublicPrompt';
import Settings from './pages/Settings';
import StatsDashboard from './pages/StatsDashboard';
import Billing from './pages/Billing';

function AppContent() {
  const { loading } = useUser();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xl transition-colors duration-300">
      Loading user...
    </div>
  );
  

  return (
    <>
      <Navbar />
      <div className="pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add" element={<AddPrompt />} />
          <Route path="/edit/:id" element={<EditPrompt />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/account" element={<Account />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/playground" element={<TryPlayground />} />
          <Route path="/public/:id" element={<PublicPrompt />} />
          <Route path="/stats" element={<StatsDashboard />} />
          <Route path="/billing" element={<Billing />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <Router>
          <div className="min-h-screen w-full bg-gradient-to-br from-[#111111] via-[#1e1e1e] to-[#2c2c2c] text-white">
            {/* Toaster and AppContent only, blobs removed */}
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 3000,
                style: {
                  background: 'rgba(255, 255, 255, 0.95)',
                  color: '#1f2937',
                  borderRadius: '12px',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  backdropFilter: 'blur(10px)',
                },
                className: 'dark:!bg-gray-800/95 dark:!text-white dark:!border-gray-600/30',
              }}
            />
            <AppContent />
          </div>
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
console.log("Rendering App");
