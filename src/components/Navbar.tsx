import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Camera, Calendar, User, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Navbar() {
  const { settings } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Gallery', path: '#gallery', icon: Camera },
    { name: 'Book Now', path: '#book', icon: Calendar },
    { name: 'Contact', path: '#contact', icon: Phone },
  ];

  if (isAdmin) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-white/10 px-6 py-4 flex justify-between items-center text-white">
        <Link to="/" className="text-xl font-bold text-accent tracking-wider">
          TURF<span className="text-white">BOOK</span> ADMIN
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/" className="text-sm hover:text-accent transition-colors">View Site</Link>
          <button onClick={() => window.location.href = '/admin'} className="bg-red-500/20 text-red-400 px-4 py-1.5 rounded-lg text-sm font-medium border border-red-500/30">Logout</button>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-white/10 px-6 py-4 flex justify-between items-center transition-all duration-300">
        <Link to="/" className="text-2xl font-bold text-accent tracking-tighter flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-gold rounded-full flex items-center justify-center text-background">
             🏏
          </div>
          <span className="hidden md:inline uppercase">{settings.name}</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.path} 
              className="text-white/80 hover:text-accent font-medium transition-colors"
            >
              {link.name}
            </a>
          ))}
          <a href="#book" className="btn-accent py-2 px-6 text-sm">BOOK NOW</a>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 glass-dark backdrop-blur-3xl md:hidden pt-24 px-8"
        >
          <div className="flex flex-col gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.path} 
                onClick={() => setIsOpen(false)}
                className="text-2xl font-bold flex items-center gap-4 text-white"
              >
                <link.icon className="text-accent" />
                {link.name}
              </a>
            ))}
            <a href="#book" onClick={() => setIsOpen(false)} className="btn-accent text-center mt-4">BOOK NOW</a>
          </div>
        </div>
      )}

      {/* Mobile Sticky Bottom Nav */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm glass rounded-2xl md:hidden px-6 py-3 border border-white/20 shadow-2xl flex justify-between items-center">
        {navLinks.map((link) => (
          <a key={link.name} href={link.path} className="flex flex-col items-center gap-1 group">
            <link.icon size={20} className="text-white/60 group-hover:text-accent transition-colors" />
            <span className="text-[10px] text-white/40 uppercase font-medium">{link.name.split(' ')[0]}</span>
          </a>
        ))}
        <Link to="/admin" className="flex flex-col items-center gap-1 group">
          <User size={20} className="text-white/60 group-hover:text-accent transition-colors" />
          <span className="text-[10px] text-white/40 uppercase font-medium">Admin</span>
        </Link>
      </div>
    </>
  );
}
