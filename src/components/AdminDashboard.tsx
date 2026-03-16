import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BarChart3, Settings, Camera, Megaphone, 
  Search, Download, Trash2
} from 'lucide-react';
import type { TurfSettings } from '../types';

export function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const { settings, setSettings, bookings, updateBookingStatus, deleteBooking, deleteMatch } = useApp();
  const [activeTab, setActiveTab] = useState('bookings');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ type: 'booking' | 'match'; id: string; name: string } | null>(null);
  const [formData, setFormData] = useState<TurfSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Keep formData in sync when settings load from Supabase
  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setSettings(formData);
      showToast('Settings saved successfully!');
    } catch (error) {
      showToast('Failed to save settings', 'error');
    }
    setSaving(false);
  };

  // Auto-increment Match IDs: find the highest numeric matchId >= 100, add 1. Start at 101.
  const nextMatchId = () => {
    const existingIds = bookings
      .map(b => parseInt(b.matchId || '0', 10))
      .filter(n => !isNaN(n) && n >= 100);
    const max = existingIds.length > 0 ? Math.max(...existingIds) : 100;
    return String(max + 1);
  };

  const handleDeleteBooking = async (id: string) => {
    setConfirmDelete(null);
    await deleteBooking(id);
  };

  const handleDeleteMatch = async (matchId: string) => {
    setConfirmDelete(null);
    await deleteMatch(matchId);
    setSelectedMatchId(null);
  };

  const matches = Array.from(new Set(bookings.filter(b => b.matchId).map(b => b.matchId))).map(matchId => {
    const matchBookings = bookings.filter(b => b.matchId === matchId);
    const matchName = matchBookings[0]?.matchName || 'Unknown Match';
    const totalPlayers = matchBookings.reduce((sum, b) => b.status !== 'Cancelled' ? sum + b.players : sum, 0);
    const totalAmount = matchBookings.reduce((sum, b) => b.status !== 'Cancelled' ? sum + b.amount : sum, 0);
    const date = matchBookings[0]?.date || '-';
    return { matchId, matchName, totalPlayers, totalAmount, date, bookingsCount: matchBookings.length };
  });

  const filteredMatches = matches.filter(m => 
    m.matchName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.matchId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.date.includes(searchTerm)
  );

  const displayBookings = selectedMatchId ? bookings.filter(b => b.matchId === selectedMatchId) : bookings;

  const filteredBookings = displayBookings.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.date.includes(searchTerm) ||
    b.matchName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToCSV = () => {
    const headers = ['ID,Name,Phone,Email,Date,Slot,Players,Amount,Status,MatchName,MatchID'];
    const rows = filteredBookings.map(b => `${b.id},${b.name},${b.phone},${b.email},${b.date},${b.slot},${b.players},${b.amount},${b.status},${b.matchName || ''},${b.matchId || ''}`);
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bookings_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="pt-24 pb-12 px-6 min-h-screen bg-[#070e0a]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-2">
           {[
             { id: 'bookings', label: 'Bookings', icon: BarChart3 },
             { id: 'settings', label: 'Turf Setup', icon: Settings },
             { id: 'gallery', label: 'Gallery', icon: Camera },
             { id: 'broadcast', label: 'Announcements', icon: Megaphone },
           ].map(tab => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`w-full flex items-center gap-3 px-6 py-4 rounded-xl font-bold transition-all ${activeTab === tab.id ? 'bg-accent text-background shadow-glow-gold' : 'hover:bg-white/5 text-white/40'}`}
             >
               <tab.icon size={20} />
               {tab.label}
             </button>
           ))}
           <button onClick={onLogout} className="w-full flex items-center gap-3 px-6 py-4 rounded-xl font-bold text-red-400/60 hover:text-red-400 transition-colors mt-8">
             <Trash2 size={20} /> Logout
           </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 glass p-8 rounded-[2rem] border-white/5 overflow-hidden">

             {activeTab === 'bookings' && (
               <div key="bookings">
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div className="flex items-center gap-4">
                      {selectedMatchId && (
                         <button onClick={() => { setSelectedMatchId(null); setSearchTerm(''); }} className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                           ←
                         </button>
                      )}
                      <div>
                        <h2 className="text-3xl font-black uppercase">{selectedMatchId ? 'Match Bookings' : 'Match Overview'}</h2>
                        <p className="text-white/40">{selectedMatchId ? 'Players registered for this match' : 'Select a match to view registered players'}</p>
                      </div>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                       <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                          <input 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={selectedMatchId ? "Search name/ID..." : "Search match..."} 
                            className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-accent outline-none flex-1 min-w-[200px]"
                          />
                       </div>
                       <button onClick={exportToCSV} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-bold transition-all">
                          <Download size={16} /> CSV
                       </button>
                    </div>
                 </div>

                 {!selectedMatchId ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMatches.length === 0 ? (
                       <div className="col-span-full py-20 text-center text-white/20 uppercase font-bold tracking-[0.5em]">No Matches Found</div>
                    ) : filteredMatches.map(m => (
                      <div 
                        key={m.matchId} 
                        onClick={() => { setSelectedMatchId(m.matchId || ''); setSearchTerm(''); }}
                        className="glass-dark p-6 rounded-2xl border border-white/5 hover:border-accent/50 cursor-pointer transition-all group"
                      >
                         <div className="flex justify-between items-start mb-1">
                           <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors">{m.matchName}</h3>
                           <button
                             onClick={(e) => { e.stopPropagation(); setConfirmDelete({ type: 'match', id: m.matchId || '', name: m.matchName }); }}
                             className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/30 transition-all flex-shrink-0"
                           >
                             <Trash2 size={14} />
                           </button>
                         </div>
                         <p className="text-xs text-white/40 font-mono mb-4">#{m.matchId}</p>
                         <div className="space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-white/40">Date:</span> <span>{m.date}</span></div>
                            <div className="flex justify-between"><span className="text-white/40">Bookings:</span> <span>{m.bookingsCount}</span></div>
                            <div className="flex justify-between"><span className="text-white/40">Players:</span> <span className="text-accent font-bold">{m.totalPlayers}</span></div>
                            <div className="flex justify-between border-t border-white/5 pt-2 mt-2"><span className="text-white/40">Revenue:</span> <span className="font-bold text-green-400">₹{m.totalAmount}</span></div>
                         </div>
                      </div>
                    ))}
                  </div>
                 ) : (
                 <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/5 text-white/20 text-[10px] items-center uppercase tracking-[0.2em] font-black">
                          <th className="py-4 px-4">Booking</th>
                          <th className="py-4 px-4">Contact</th>
                          <th className="py-4 px-4">Details</th>
                          <th className="py-4 px-4">Amount</th>
                          <th className="py-4 px-4">Payment</th>
                          <th className="py-4 px-4">Status</th>
                          <th className="py-4 px-4 text-right">Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBookings.length === 0 ? (
                          <tr><td colSpan={7} className="py-20 text-center text-white/20 uppercase font-bold tracking-[0.5em]">No Data Found</td></tr>
                        ) : filteredBookings.map(b => (
                          <tr key={b.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="py-6 px-4">
                               <p className="font-bold text-accent">#{b.id}</p>
                               <p className="text-[10px] text-white/20 mt-1 uppercase">{new Date(b.createdAt).toLocaleDateString()}</p>
                            </td>
                            <td className="py-6 px-4">
                               <p className="font-bold">{b.name}</p>
                               <p className="text-xs text-white/40">{b.phone}</p>
                            </td>
                            <td className="py-6 px-4">
                               <p className="text-sm font-medium">{b.date}</p>
                               <p className="text-xs text-white/40">{b.slot}</p>
                               <p className="text-[10px] uppercase font-bold text-accent mt-1">{b.players} Players</p>
                               <p className="text-[10px] uppercase font-bold text-white/40 mt-1 tracking-wider">{b.matchName}</p>
                            </td>
                            <td className="py-6 px-4">
                               <p className="font-black text-lg">₹{b.amount}</p>
                            </td>
                            <td className="py-6 px-4">
                               {b.paymentScreenshot ? (
                                 <button 
                                   onClick={() => window.open(b.paymentScreenshot)}
                                   className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-accent hover:text-background transition-all"
                                 >
                                    <Camera size={18} />
                                 </button>
                               ) : "No Image"}
                            </td>
                            <td className="py-6 px-4">
                               <select 
                                 value={b.status}
                                 onChange={(e) => updateBookingStatus(b.id, e.target.value as any)}
                                 className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border outline-none ${
                                   b.status === 'Confirmed' ? 'bg-green-500/10 border-green-500/50 text-green-500' :
                                   b.status === 'Cancelled' ? 'bg-red-500/10 border-red-500/50 text-red-500' :
                                   'bg-yellow-500/10 border-yellow-500/50 text-yellow-500'
                                 }`}
                               >
                                 <option value="Pending">Pending</option>
                                 <option value="Confirmed">Confirmed</option>
                                 <option value="Cancelled">Cancelled</option>
                               </select>
                            </td>
                            <td className="py-6 px-4 text-right">
                              <button
                                onClick={() => setConfirmDelete({ type: 'booking', id: b.id, name: b.name })}
                                className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/30 transition-all ml-auto"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                 </div>
                 )}
               </div>
             )}

             {activeTab === 'settings' && (
               <div key="settings" className="space-y-12">
                  <div>
                    <h2 className="text-3xl font-black uppercase mb-8">Turf Information</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <label className="text-[10px] uppercase font-black text-white/20">Turf Name</label>
                          <input className="input-field w-full" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] uppercase font-black text-white/20">Tagline</label>
                          <input className="input-field w-full" value={formData.tagline} onChange={(e) => setFormData({...formData, tagline: e.target.value})} />
                       </div>
                       <div className="md:col-span-2 space-y-2">
                          <label className="text-[10px] uppercase font-black text-white/20">Description</label>
                          <textarea className="input-field w-full h-32" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                       </div>
                        <div className="space-y-2">
                           <label className="text-[10px] uppercase font-black text-white/20">Price (per player ₹)</label>
                           <input type="number" className="input-field w-full" value={formData.pricePerPlayer} onChange={(e) => setFormData({...formData, pricePerPlayer: Number(e.target.value)})} />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] uppercase font-black text-white/20">Min Players per Match</label>
                           <input type="number" className="input-field w-full" value={formData.minPlayers} onChange={(e) => setFormData({...formData, minPlayers: Number(e.target.value)})} />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] uppercase font-black text-white/20">Max Players per Match</label>
                           <input type="number" className="input-field w-full" value={formData.maxPlayers} onChange={(e) => setFormData({...formData, maxPlayers: Number(e.target.value)})} />
                        </div>
                       <div className="space-y-2">
                          <label className="text-[10px] uppercase font-black text-white/20">Google Maps Link</label>
                          <input className="input-field w-full" value={formData.googleMapsLink} onChange={(e) => setFormData({...formData, googleMapsLink: e.target.value})} />
                       </div>
                       <div className="md:col-span-2 space-y-2 p-6 glass-dark border border-accent/20 rounded-xl">
                          <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
                             <div className="flex-1 space-y-2 w-full">
                                <label className="text-[10px] uppercase font-black text-accent">Active Match Name</label>
                                <input className="input-field w-full border-accent/30 focus:border-accent" value={formData.matchName || ''} onChange={(e) => setFormData({...formData, matchName: e.target.value})} placeholder="e.g. Sunday Bash Phase 1" />
                             </div>
                             <button 
                               type="button"
                               onClick={() => setFormData({...formData, matchId: nextMatchId()})}
                               className="btn-accent px-6 py-3 whitespace-nowrap text-xs"
                             >
                               NEW MATCH ID
                             </button>
                          </div>
                          <p className="text-xs text-white/40 mt-2">Active Match ID: <span className="font-mono text-white/60">#{formData.matchId || 'None'}</span> (Hidden from public. Click "NEW MATCH ID" to start a fresh match — IDs auto-increment: 101, 102...)</p>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] uppercase font-black text-white/20">Fixed Date (For Users)</label>
                          <input type="date" className="input-field w-full" value={formData.fixedDate} onChange={(e) => setFormData({...formData, fixedDate: e.target.value})} />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] uppercase font-black text-white/20">Fixed Time Slot (For Users)</label>
                          <input 
                            placeholder="e.g. 6:00 PM - 9:00 PM (3 Hours)"
                            className="input-field w-full" 
                            value={formData.fixedTime} 
                            onChange={(e) => setFormData({...formData, fixedTime: e.target.value})} 
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] uppercase font-black text-white/20">Total Player Capacity (Slots)</label>
                          <input type="number" className="input-field w-full" value={formData.maxTotalSlots} onChange={(e) => setFormData({...formData, maxTotalSlots: Number(e.target.value)})} />
                       </div>
                    </div>
                  </div>

                  <div className="pt-12 border-t border-white/5">
                    <h3 className="text-xl font-bold uppercase mb-8">Payments & Contact</h3>
                    <div className="grid md:grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <label className="text-[10px] uppercase font-black text-white/20">UPI ID</label>
                          <input className="input-field w-full font-mono" value={formData.upiId} onChange={(e) => setFormData({...formData, upiId: e.target.value})} />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] uppercase font-black text-white/20">UPI QR Image URL</label>
                          <input className="input-field w-full" value={formData.upiQrCode} onChange={(e) => setFormData({...formData, upiQrCode: e.target.value})} />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] uppercase font-black text-white/20">Contact WhatsApp</label>
                          <input className="input-field w-full" value={formData.contactPhone} onChange={(e) => setFormData({...formData, contactPhone: e.target.value})} />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] uppercase font-black text-white/20">Contact Email</label>
                          <input className="input-field w-full" value={formData.contactEmail} onChange={(e) => setFormData({...formData, contactEmail: e.target.value})} />
                       </div>
                       <div className="md:col-span-2 space-y-2">
                          <label className="text-[10px] uppercase font-black text-white/20">Bank Details</label>
                          <textarea className="input-field w-full h-32 font-mono" value={formData.bankDetails} onChange={(e) => setFormData({...formData, bankDetails: e.target.value})} />
                       </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-8">
                    <button 
                      className="btn-accent px-12 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2" 
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'SAVE CHANGES'}
                    </button>
                  </div>
               </div>
             )}

             {activeTab === 'gallery' && (
               <div key="gallery" className="space-y-8">
                  <h2 className="text-3xl font-black uppercase">Gallery Management</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {formData.gallery.map((url, i) => (
                       <div key={i} className="space-y-3">
                          <div className="aspect-video rounded-xl bg-white/5 border border-white/5 overflow-hidden">
                             <img src={url} className="w-full h-full object-cover" />
                          </div>
                          <input 
                            className="input-field w-full text-xs" 
                            value={url} 
                            onChange={(e) => {
                              const newGal = [...formData.gallery];
                              newGal[i] = e.target.value;
                              setFormData({...formData, gallery: newGal});
                            }} 
                          />
                       </div>
                     ))}
                  </div>
                  <div className="flex justify-end pt-4">
                    <button 
                      className="btn-accent px-12 disabled:opacity-50 flex items-center gap-2" 
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'SAVE GALLERY'}
                    </button>
                  </div>
               </div>
             )}

             {activeTab === 'broadcast' && (
               <div key="broadcast" className="max-w-xl">
                  <h2 className="text-3xl font-black uppercase mb-8">Announcement Banner</h2>
                  <div className="space-y-6 glass-dark p-8 rounded-2xl border border-white/5">
                     <div className="flex items-center justify-between mb-4">
                        <span className="font-bold">Show on Website</span>
                        <button 
                          onClick={() => setFormData({...formData, announcement: {...formData.announcement, show: !formData.announcement.show}})}
                          className={`w-14 h-8 rounded-full transition-all relative ${formData.announcement.show ? 'bg-accent' : 'bg-white/10'}`}
                        >
                           <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${formData.announcement.show ? 'right-1' : 'left-1'}`}></div>
                        </button>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black text-white/20">Banner Message</label>
                        <textarea 
                          className="input-field w-full h-24" 
                          value={formData.announcement.text} 
                          onChange={(e) => setFormData({...formData, announcement: {...formData.announcement, text: e.target.value}})} 
                        />
                     </div>
                     <p className="text-xs text-white/20 italic">This message will appear at the top of the home page for all visitors.</p>
                     <div className="flex justify-end">
                       <button 
                         className="btn-accent px-12 disabled:opacity-50 flex items-center gap-2" 
                         onClick={handleSave}
                         disabled={saving}
                       >
                         {saving ? 'Saving...' : 'SAVE ANNOUNCEMENT'}
                       </button>
                     </div>
                  </div>
               </div>
             )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-background/80 backdrop-blur-xl">
          <div className="max-w-sm w-full glass p-8 rounded-3xl border border-red-500/20 text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="text-red-400" size={28} />
            </div>
            <h3 className="text-xl font-black mb-2">
              {confirmDelete.type === 'match' ? 'Delete Entire Match?' : 'Delete Booking?'}
            </h3>
            <p className="text-white/50 text-sm mb-6">
              {confirmDelete.type === 'match'
                ? `This will permanently delete ALL bookings for "${confirmDelete.name}". Deleted slots will become available again.`
                : `Remove booking for "${confirmDelete.name}"? Their slot count will be freed up.`}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-3 rounded-xl bg-white/10 font-bold hover:bg-white/20 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete.type === 'match' ? handleDeleteMatch(confirmDelete.id) : handleDeleteBooking(confirmDelete.id)}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
          <div className={`px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 font-bold text-sm ${
            toast.type === 'success' 
              ? 'bg-green-500 text-black shadow-[0_0_30px_rgba(34,197,94,0.3)]' 
              : 'bg-red-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.3)]'
          }`}>
            {toast.type === 'success' ? '✅' : '❌'} {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}
