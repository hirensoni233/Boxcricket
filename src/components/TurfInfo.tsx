import { MapPin, Users, IndianRupee, Car, Utensils, Zap, Shirt, Droplets, Instagram, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function TurfInfo() {
  const { settings } = useApp();

  const amenities = [
    { icon: Droplets, label: 'Drinking Water' },
    { icon: Instagram, label: 'Photo & Instagram Post' },
    { icon: Award, label: 'Bat, Ball & Stumps' },
    { icon: Car, label: 'Parking' },
    { icon: Utensils, label: 'Cafeteria' },
    { icon: Zap, label: 'Floodlights' },
    { icon: Shirt, label: 'Changing Room' },
  ];

  return (
    <section id="contact" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Left: Stats & Description */}
        <div
          className="space-y-8"
        >
          <div>
            <h2 className="text-4xl font-bold mb-4 flex items-center gap-3">
              <span className="w-2 h-8 bg-accent rounded-full"></span>
              THE ARENA
            </h2>
            <p className="text-white/60 text-lg leading-relaxed">
              {settings.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass p-6 rounded-2xl border-white/5">
              <IndianRupee className="text-accent mb-3" size={32} />
              <h3 className="text-2xl font-bold">₹{settings.pricePerPlayer}</h3>
              <p className="text-white/40 text-sm uppercase font-semibold">Per Player</p>
            </div>
            <div className="glass p-6 rounded-2xl border-white/5">
              <Users className="text-accent mb-3" size={32} />
              <h3 className="text-2xl font-bold">{settings.minPlayers}-{settings.maxPlayers}</h3>
              <p className="text-white/40 text-sm uppercase font-semibold">Players per match</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              AMENITIES
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {amenities.map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-white/70 bg-white/5 p-3 rounded-lg border border-white/5">
                  <item.icon size={18} className="text-accent" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Location & Hours */}
        <div
          className="space-y-6"
        >
          <div className="glass p-8 rounded-3xl border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-3xl -mr-10 -mt-10"></div>
            
            <MapPin className="text-accent mb-4" size={40} />
            <h3 className="text-2xl font-bold mb-2">LOCATION</h3>
            <p className="text-white/60 mb-6">Near City Center Mall, Sports Hub Road, Mumbai - 400001</p>
            
            <a 
              href={settings.googleMapsLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-accent font-bold hover:gap-4 transition-all"
            >
              OPEN IN GOOGLE MAPS →
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
