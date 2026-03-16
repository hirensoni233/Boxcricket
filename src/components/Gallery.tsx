import { useApp } from '../context/AppContext';

export function Gallery() {
  const { settings } = useApp();

  return (
    <section id="gallery" className="py-24 bg-black/40">
      <div className="max-w-7xl mx-auto px-6 text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">GALLERY</h2>
        <p className="text-white/50 max-w-2xl mx-auto">Take a look at our world-class facilities and the vibrant community of cricketers who call this turf their home.</p>
      </div>

      <div className="px-6">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 mx-auto">
          {settings.gallery.map((url, i) => (
            <div
              key={i}
              className="relative group cursor-zoom-in break-inside-avoid rounded-2xl overflow-hidden glass border-white/5"
            >
              <img 
                src={url} 
                alt={`Turf Photo ${i + 1}`} 
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <p className="text-accent font-bold tracking-widest uppercase text-sm">View Full Screen</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
