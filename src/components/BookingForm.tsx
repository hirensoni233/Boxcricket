import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Users, Phone, Mail, User, QrCode, CreditCard, CheckCircle2, Copy, Download, Clock, Trophy } from 'lucide-react';
import type { Booking } from '../types';
import emailjs from '@emailjs/browser';

export function BookingForm() {
  const { settings, addBooking, bookings } = useApp();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookingId, setBookingId] = useState('');

  // Calculate remaining slots: only count bookings for the CURRENT active match.
  // This ensures old match bookings don't reduce new match availability.
  const totalBooked = bookings
    .filter(b => b.matchId === settings.matchId && b.status !== 'Cancelled')
    .reduce((sum, b) => sum + b.players, 0);
  
  const remainingSlots = Math.max(0, settings.maxTotalSlots - totalBooked);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: settings.fixedDate,
    slot: settings.fixedTime,
    players: remainingSlots > 0 ? 1 : 0, 
    paymentMethod: 'UPI' as 'UPI' | 'Bank',
    screenshot: ''
  });

  const totalAmount = formData.players * settings.pricePerPlayer;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, screenshot: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2); // Go to payment
      return;
    }

    setIsSubmitting(true);

    const id = Math.random().toString(36).substring(2, 8).toUpperCase();
    setBookingId(id);

    const newBooking: Booking = {
      id,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      date: formData.date,
      slot: formData.slot,
      players: Number(formData.players),
      amount: totalAmount,
      paymentScreenshot: formData.screenshot,
      matchName: settings.matchName,
      matchId: settings.matchId,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    try {
      // Actually wait for Supabase to save
      await addBooking(newBooking);

      // Send Confirmation Email
      const emailParams = {
        to_name: formData.name,
        to_email: formData.email,
        booking_id: id,
        match_name: settings.matchName || 'Box Cricket Match',
        date: formData.date,
        slot: formData.slot,
        players: formData.players,
        amount: totalAmount,
        turf_name: settings.name,
        contact_phone: settings.contactPhone,
      };

      try {
        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          emailParams,
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );
        console.log("Confirmation Email Sent successfully!");
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
        // We don't block the UI if the email fails, the booking is still confirmed.
      }

      setIsSubmitting(false);
      setShowSuccess(true);
    } catch (error) {
      console.error('Failed to submit booking:', error);
      alert('Failed to save booking. Please try again.');
      setIsSubmitting(false);
    }
  };

  const copyUpi = () => {
    navigator.clipboard.writeText(settings.upiId);
    alert('UPI ID Copied!');
  };

  return (
    <section id="book" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 blur-3xl rounded-full -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 blur-3xl rounded-full -ml-32 -mb-32"></div>

      <div className="max-w-4xl mx-auto glass p-8 md:p-12 rounded-[2rem] border-white/10 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black mb-4">RESERVE YOUR SLOT</h2>
          <div className="flex justify-center gap-2 items-center text-white/40">
            <span className={`w-12 h-1 rounded-full ${step >= 1 ? 'bg-accent' : 'bg-white/10'}`}></span>
            <span className={`w-12 h-1 rounded-full ${step >= 2 ? 'bg-accent' : 'bg-white/10'}`}></span>
          </div>
          <p className="mt-4 text-white/60 font-medium uppercase tracking-[0.2em] text-xs">
            {step === 1 ? '1. Booking Details' : '2. Secure Payment'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {step === 1 && (
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/50 flex items-center gap-2 uppercase tracking-widest"><User size={14} /> Full Name *</label>
                  <input required name="name" value={formData.name} onChange={handleInputChange} type="text" placeholder="John Doe" className="input-field w-full" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/50 flex items-center gap-2 uppercase tracking-widest"><Phone size={14} /> Phone Number *</label>
                  <input required name="phone" value={formData.phone} onChange={handleInputChange} type="tel" placeholder="+91 00000 00000" className="input-field w-full" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/50 flex items-center gap-2 uppercase tracking-widest"><Mail size={14} /> Email Address *</label>
                  <input required name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="john@example.com" className="input-field w-full" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/50 flex items-center gap-2 uppercase tracking-widest"><Trophy size={14} /> Match Details</label>
                  <div className="input-field w-full bg-white/5 opacity-80 cursor-default flex flex-col justify-center py-2 h-auto">
                    <span className="text-accent font-bold">{settings.matchName}</span>
                    <span className="text-[10px] text-white/40 font-mono">ID: #{settings.matchId}</span>
                  </div>
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-bold text-white/50 flex items-center gap-2 uppercase tracking-widest"><Users size={14} /> Players</label>
                   <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-lg p-1">
                     <button 
                       type="button" 
                       disabled={remainingSlots <= 0 || formData.players <= 1}
                       onClick={() => setFormData(prev => ({...prev, players: Math.max(1, prev.players - 1)}))} 
                       className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-white/10 text-accent font-bold disabled:opacity-20"
                     >
                       -
                     </button>
                     <span className="flex-1 text-center font-bold">{formData.players}</span>
                     <button 
                       type="button" 
                       disabled={remainingSlots <= 0 || formData.players >= remainingSlots}
                       onClick={() => setFormData(prev => ({...prev, players: Math.min(remainingSlots, prev.players + 1)}))} 
                       className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-white/10 text-accent font-bold disabled:opacity-20"
                     >
                       +
                     </button>
                   </div>
                   <p className="text-[10px] text-white/20 italic">
                     {remainingSlots > 0 
                       ? `${remainingSlots} slots remaining across the session` 
                       : (
                         <span className="text-red-500 font-bold uppercase tracking-wider animate-pulse">
                           ⚠️ No more slots available for this session
                         </span>
                       )}
                   </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/50 flex items-center gap-2 uppercase tracking-widest"><Calendar size={14} /> Booking Date</label>
                  <div className="input-field w-full bg-white/5 opacity-80 cursor-not-allowed flex items-center">{settings.fixedDate}</div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/50 flex items-center gap-2 uppercase tracking-widest"><Clock size={14} /> Assigned Time Slot</label>
                  <div className="input-field w-full bg-white/5 opacity-80 cursor-not-allowed flex items-center">{settings.fixedTime}</div>
                </div>
              </div>

              <div className="p-6 glass-dark rounded-xl border border-accent/20 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <p className="text-white/40 text-xs uppercase font-bold tracking-[0.2em] mb-1">Total Bill</p>
                  <p className="text-4xl font-black text-accent flex items-center gap-2">₹{totalAmount}</p>
                </div>
                <p className="text-right text-sm text-white/60">₹{settings.pricePerPlayer} per player × {formData.players} players</p>
              </div>

              <div className="flex justify-end pt-4">
                <button 
                  type="submit" 
                  disabled={remainingSlots <= 0}
                  className="btn-accent px-12 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/20"
                >
                  {remainingSlots > 0 ? 'PROCEED TO PAY →' : 'NO SLOTS AVAILABLE'}
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div className="flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setFormData(p => ({...p, paymentMethod: 'UPI'}))}
                  className={`flex-1 py-4 rounded-xl border-2 transition-all flex items-center justify-center gap-3 font-bold ${formData.paymentMethod === 'UPI' ? 'border-accent bg-accent/5 text-accent' : 'border-white/5 text-white/40'}`}
                >
                  <QrCode size={20} /> UPI
                </button>
                <button 
                  type="button" 
                  onClick={() => setFormData(p => ({...p, paymentMethod: 'Bank'}))}
                  className={`flex-1 py-4 rounded-xl border-2 transition-all flex items-center justify-center gap-3 font-bold ${formData.paymentMethod === 'Bank' ? 'border-accent bg-accent/5 text-accent' : 'border-white/5 text-white/40'}`}
                >
                  <CreditCard size={20} /> BANK TRANSFER
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-center bg-white/5 p-8 rounded-2xl border border-white/10">
                {formData.paymentMethod === 'UPI' ? (
                  <>
                    <div className="flex flex-col items-center gap-4">
                      {settings.upiQrCode ? (
                        <img src={settings.upiQrCode} alt="UPI QR" className="w-48 h-48 rounded-lg" />
                      ) : (
                        <div className="w-48 h-48 bg-white/10 rounded-lg flex items-center justify-center text-white/20 uppercase text-xs text-center p-4">QR Code Not Uploaded</div>
                      )}
                      <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                         <span className="font-mono text-sm">{settings.upiId}</span>
                         <button type="button" onClick={copyUpi} className="text-accent hover:text-white"><Copy size={16} /></button>
                      </div>
                    </div>
                    <div className="text-white/60 text-sm leading-relaxed">
                      <p className="font-bold text-white mb-2 uppercase tracking-widest text-xs">Instructions:</p>
                      <ol className="list-decimal list-inside space-y-2">
                        <li>Scan the QR code or copy UPI ID</li>
                        <li>Pay exactly <span className="text-accent font-bold">₹{totalAmount}</span></li>
                        <li>Upload the payment screenshot below</li>
                      </ol>
                    </div>
                  </>
                ) : (
                  <div className="md:col-span-2">
                     <p className="font-bold text-white mb-4 uppercase tracking-widest text-xs text-center">Bank Account Details</p>
                     <div className="bg-background/80 p-6 rounded-xl font-mono text-sm whitespace-pre-wrap text-accent border border-accent/20">
                       {settings.bankDetails}
                     </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-white/50 flex items-center gap-2 uppercase tracking-widest">Upload Payment Screenshot</label>
                <div className="relative group">
                   <input required type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                   <div className="glass-dark border-2 border-dashed border-white/10 rounded-2xl p-8 text-center group-hover:border-accent group-hover:bg-accent/5 transition-all">
                      {formData.screenshot ? (
                        <div className="flex flex-col items-center gap-2">
                          <img src={formData.screenshot} className="w-24 h-24 object-cover rounded-lg mb-2" />
                          <p className="text-accent font-bold text-sm">Screenshot Attached!</p>
                        </div>
                      ) : (
                        <>
                          <Download className="mx-auto mb-4 text-white/20 group-hover:text-accent transition-colors" size={40} />
                          <p className="text-white/60">Click or drag image to upload</p>
                          <p className="text-white/20 text-xs mt-1">PNG, JPG up to 5MB</p>
                        </>
                      )}
                   </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button type="button" onClick={() => setStep(1)} className="text-white/50 font-bold hover:text-white transition-colors">← BACK</button>
                <button type="submit" disabled={isSubmitting} className="btn-accent px-16 relative overflow-hidden">
                   {isSubmitting ? (
                     <span className="flex items-center gap-2">
                       <svg className="animate-spin h-5 w-5 text-background" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                       SUBMITTING...
                     </span>
                   ) : 'CONFIRM & BOOK SLOT'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/90 backdrop-blur-xl">
          <div className="max-w-md w-full glass p-10 rounded-[3rem] border-accent/20 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-gold"></div>
            <CheckCircle2 className="mx-auto mb-6 text-accent" size={80} />
            <h3 className="text-4xl font-black mb-2 uppercase italic text-accent">SUCCESSFULLY REGISTERED!</h3>
            <p className="text-white mb-8 font-medium">Congratulations! Your booking is confirmed. A confirmation has been sent to your email.</p>
            <div className="bg-white/5 p-6 rounded-2xl border border-white/5 mb-8 text-left space-y-3">
              <div className="flex justify-between text-sm"><span className="text-white/40">Booking ID:</span> <span className="font-mono font-bold text-accent">#{bookingId}</span></div>
              <div className="flex justify-between text-sm"><span className="text-white/40">Date:</span> <span className="font-bold">{formData.date}</span></div>
              <div className="flex justify-between text-sm"><span className="text-white/40">Slot:</span> <span className="font-bold">{formData.slot}</span></div>
              <div className="flex justify-between text-sm border-t border-white/5 pt-3"><span className="text-white/40">Amount Paid:</span> <span className="font-bold text-lg text-accent">₹{totalAmount}</span></div>
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={() => {
                setFormData(p => ({...p, players: remainingSlots > 0 ? 1 : 0, screenshot: ''}));
                setStep(1);
                setShowSuccess(false);
              }} className="w-full py-4 bg-accent text-background font-black rounded-xl hover:opacity-90 transition-all uppercase tracking-widest">
                BOOK MORE SLOTS
              </button>
              <button onClick={() => window.location.href = '/'} className="w-full py-4 bg-white/10 text-white font-black rounded-xl hover:bg-white/20 transition-all uppercase tracking-widest border border-white/10">
                BACK TO HOME
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
