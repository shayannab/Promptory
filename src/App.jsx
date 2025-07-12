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
import Login from './pages/Login';
import Signup from './pages/Signup';
import Account from './pages/Account';
import PublicPrompt from './pages/PublicPrompt';
import Settings from './pages/Settings';

function AppContent() {
  const { loading } = useUser();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white text-xl">
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
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen text-white bg-gradient-to-br from-black via-gray-900 to-black">
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1a1a2e',
                color: '#fff',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              },
            }}
          />
          <AppContent />
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
console.log("Rendering App");
