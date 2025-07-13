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
          <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-black transition-all duration-500 ease-in-out">
            {/* Animated background blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 dark:bg-blue-500/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-400/20 dark:bg-cyan-500/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="absolute top-40 left-40 w-80 h-80 bg-purple-400/20 dark:bg-purple-500/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>
            
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
