import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TurfInfo } from './components/TurfInfo';
import { Gallery } from './components/Gallery';
import { BookingForm } from './components/BookingForm';
import { Footer, AnnouncementBanner } from './components/Common';
import { AdminDashboard } from './components/AdminDashboard';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Eye, EyeOff, Lock } from 'lucide-react';

function LandingPage() {
  return (
    <div>
      <AnnouncementBanner />
      <Hero />
      <TurfInfo />
      <BookingForm />
      <Gallery />
      <Footer />
    </div>
  );
}

function AdminGate() {
  const [password, setPassword] = useState('');
  const [isLogged, setIsLogged] = useState(localStorage.getItem('admin_session') === 'true');
  const [error, setError] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Hiren@2004') {
      localStorage.setItem('admin_session', 'true');
      setIsLogged(true);
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  if (isLogged) return <AdminDashboard onLogout={() => { localStorage.removeItem('admin_session'); setIsLogged(false); }} />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div 
        className="w-full max-w-md glass p-10 rounded-[2.5rem] border-white/10"
      >
        <div className="text-center mb-8">
           <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Lock className="text-accent" size={32} />
           </div>
           <h2 className="text-3xl font-black uppercase tracking-tighter">Admin Portal</h2>
           <p className="text-white/40 text-sm mt-2">Enter your credential to access management</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
             <input 
               type={showPass ? "text" : "password"} 
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               placeholder="Enter Password"
               className="input-field w-full pr-12"
               autoFocus
             />
             <button 
               type="button" 
               onClick={() => setShowPass(!showPass)}
               className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-accent"
             >
               {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
             </button>
          </div>
          {error && <p className="text-red-500 text-center text-sm font-bold">Access Denied! Incorrect Password.</p>}
          <button type="submit" className="btn-accent w-full py-4 text-lg">LOGIN TO DASHBOARD</button>
        </form>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="bg-background min-h-screen text-white">
      <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin" element={<AdminGate />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    </div>
  );
}

export default App;
