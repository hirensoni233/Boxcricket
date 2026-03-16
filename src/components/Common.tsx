import { useApp } from '../context/AppContext';
import { Megaphone } from 'lucide-react';

export function AnnouncementBanner() {
  const { settings } = useApp();

  if (!settings.announcement.show) return null;

  return (
    <div 
      className="fixed top-20 left-0 right-0 z-40 px-6 py-3 bg-accent text-background"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 font-bold uppercase tracking-widest text-sm">
          <Megaphone size={18} className="animate-bounce" />
          <span>{settings.announcement.text}</span>
        </div>
      </div>
    </div>
  );
}

export function Footer() {
  const { settings } = useApp();

  return (
    <footer className="py-20 px-6 border-t border-white/10 bg-background/50">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <h2 className="text-3xl font-black text-accent mb-6 uppercase tracking-tighter">
            TURF<span className="text-white">BOOK</span>
          </h2>
          <p className="text-white/40 max-w-sm leading-relaxed mb-8">
            Providing premium sports facilities for the community. Professional turf, high-end lighting, and a great atmosphere for every game.
          </p>
          <div className="flex gap-4">
             {/* Social mockups */}
             <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-accent hover:text-background transition-colors cursor-pointer">IG</div>
             <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-accent hover:text-background transition-colors cursor-pointer">FB</div>
             <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-accent hover:text-background transition-colors cursor-pointer">YT</div>
          </div>
        </div>

        <div>
           <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-white/40">Quick Links</h4>
           <ul className="space-y-4 font-medium">
             <li><a href="#home" className="hover:text-accent transition-colors">Home</a></li>
             <li><a href="#gallery" className="hover:text-accent transition-colors">Gallery</a></li>
             <li><a href="#book" className="hover:text-accent transition-colors">Book Now</a></li>
             <li><a href="/admin" className="hover:text-accent transition-colors text-white/30">Owner Login</a></li>
           </ul>
        </div>

        <div>
           <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-white/40">Support</h4>
           <ul className="space-y-4 font-medium">
             <li className="flex items-center gap-2"><span>📞</span> {settings.contactPhone}</li>
             <li className="flex items-center gap-2"><span>✉️</span> {settings.contactEmail}</li>
             <li className="mt-4">
                <a 
                  href={`https://wa.me/${settings.contactPhone}`}
                  className="inline-block bg-[#25D366] text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg hover:brightness-110 transition-all"
                >
                   WHATSAPP US
                </a>
             </li>
           </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 text-center text-white/20 text-xs uppercase tracking-widest">
        &copy; {new Date().getFullYear()} {settings.name}. All rights reserved.
      </div>
    </footer>
  );
}
