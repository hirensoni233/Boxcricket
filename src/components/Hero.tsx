import { useApp } from '../context/AppContext';
import { Star } from 'lucide-react';

export function Hero() {
  const { settings } = useApp();

  return (
    <section id="home" className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=1600" 
          alt="Cricket Turf"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <div
          className="flex flex-col items-center gap-4"
        >
          <div className="flex gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} size={20} fill="#d4af37" color="#d4af37" />
            ))}
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-none">
            {settings.name.split(' ').map((word, i) => (
              <span key={i} className={i === settings.name.split(' ').length - 1 ? "text-accent" : ""}>
                {word}{" "}
              </span>
            ))}
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 font-medium tracking-wide max-w-2xl">
            {settings.tagline}
          </p>

          <div className="flex flex-col md:flex-row gap-4 mt-8">
            <a href="#book" className="btn-accent text-lg px-12 py-4 animate-glow">
              BOOK YOUR SLOT NOW
            </a>
            <a href="#gallery" className="glass px-12 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition-all">
              VIEW GALLERY
            </a>
          </div>
        </div>
      </div>

      {/* Floating Badge */}
      <div className="absolute bottom-32 md:bottom-12 right-6 md:right-12 glass p-4 rounded-xl border-accent/20 animate-bounce">
        <p className="text-accent font-bold text-sm tracking-widest uppercase">Slots Filling Fast 🔥</p>
      </div>
    </section>
  );
}
