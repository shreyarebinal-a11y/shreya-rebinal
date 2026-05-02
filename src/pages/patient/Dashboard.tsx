import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, Button, cn } from '../../components/ui/Base';
import { QRCodeSVG } from 'qrcode.react';
import { Upload, History, Shield, ShieldOff, User as UserIcon, Droplet, Calendar, Activity, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { motion } from 'motion/react';
import { Reminders } from '../../components/Reminders';
import { HealthuChat } from '../../components/HealthuChat';

export default function PatientDashboard() {
  const { user, profile, refreshProfile } = useAuth();

  const toggleSharing = async () => {
    if (!user || !profile) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        isSharingEnabled: !profile.isSharingEnabled
      });
      await refreshProfile();
    } catch (error) {
      console.error(error);
    }
  };

  if (!profile) return null;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500 pb-24">
      {/* Dynamic Profile Plate */}
      <section className="relative overflow-hidden bg-blue-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-500/20">
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl" />
        
        <div className="relative flex flex-col md:flex-row gap-8 items-center text-center md:text-left">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-[2rem] flex items-center justify-center text-white text-4xl font-black border border-white/30 shadow-inner">
            {profile.name.charAt(0)}
          </div>
          <div className="flex-grow space-y-2">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">How are you, {profile.name.split(' ')[0]}?</h1>
            <p className="text-blue-100 font-medium">Your medical profile is up to date and secured.</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
              <div className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold border border-white/10 flex items-center gap-2">
                <Droplet className="w-3 h-3 text-red-300" /> {profile.bloodGroup}
              </div>
              <div className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold border border-white/10 flex items-center gap-2">
                <Calendar className="w-3 h-3 text-blue-200" /> {profile.age} Yrs
              </div>
              <div className="bg-emerald-400 text-emerald-950 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <Activity className="w-3 h-3" /> Healthy
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Action Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
        <Link id="action-upload" to="/patient/upload" className="group">
          <Card className="h-full flex flex-col items-center justify-center p-6 gap-3 group-hover:border-blue-500 transition-all active:scale-95 bg-blue-50/30 border-blue-100/50">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <span className="font-black text-xs uppercase tracking-widest text-blue-700">Upload Record</span>
          </Card>
        </Link>
        <Link id="action-timeline" to="/patient/timeline" className="group">
          <Card className="h-full flex flex-col items-center justify-center p-6 gap-3 group-hover:border-emerald-500 transition-all active:scale-95 bg-emerald-50/30 border-emerald-100/50">
            <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <History className="w-6 h-6" />
            </div>
            <span className="font-black text-xs uppercase tracking-widest text-emerald-700">View History</span>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <div className="md:col-span-2 space-y-8">
          {/* Identity Section */}
          <Card className="p-0 overflow-hidden border-0 shadow-xl ring-1 ring-black/5 bg-gradient-to-br from-white to-gray-50">
            <div className="p-8 flex flex-col items-center text-center border-b border-gray-100">
              <div className="bg-white p-4 rounded-[2rem] shadow-2xl mb-6 ring-8 ring-blue-50">
                <QRCodeSVG 
                  id="dashboard-qr"
                  value={`${window.location.origin}/doctor/patient/${user?.uid}`} 
                  size={160}
                  level="H"
                />
              </div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Your Identity QR</h2>
              <p className="text-gray-500 text-sm mt-2 max-w-xs">Share this with your doctor to allow instant medical record syncing.</p>
              <div className="mt-6 font-mono text-[10px] text-gray-400 bg-gray-100 px-4 py-2 rounded-xl">
                 REF: {user?.uid.toUpperCase()}
              </div>
            </div>
            <div className="grid grid-cols-2 divide-x divide-gray-100 bg-white">
              <div className="p-6 text-center">
                 <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Status</p>
                 <span className="inline-flex items-center gap-2 text-emerald-600 font-black text-sm">
                   <Shield className="w-4 h-4" /> SECURE
                 </span>
              </div>
              <div className="p-6 text-center">
                 <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Sharing</p>
                 <button 
                  id="dashboard-toggle-sharing"
                  onClick={toggleSharing} 
                  className={cn(
                    "text-sm font-black transition-colors",
                    profile.isSharingEnabled ? "text-blue-600" : "text-red-500"
                  )}
                 >
                   {profile.isSharingEnabled ? "ON" : "OFF"}
                 </button>
              </div>
            </div>
          </Card>

          {/* AI Banner */}
          <Card className="bg-gray-900 text-white p-8 relative overflow-hidden group border-0">
            <motion.div 
              animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500 rounded-full blur-[80px]" 
            />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-gray-900 shadow-xl shadow-blue-500/20">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight">Meet Healthu AI</h3>
                <p className="text-gray-400 text-sm mt-1">Struggling to understand reports? Ask Healthu to explain them in simple words.</p>
              </div>
              <Button id="launch-healthu-btn" variant="outline" className="border-white/20 text-white hover:bg-white/10 md:ml-auto">
                Ask Now
              </Button>
            </div>
          </Card>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
           <Card className="shadow-lg border-0 ring-1 ring-black/5">
             <Reminders />
           </Card>

           <Card className="bg-emerald-600 text-white border-0 shadow-lg p-6 group cursor-pointer active:scale-95 transition-all">
             <h4 className="font-black text-xs uppercase tracking-widest opacity-80 mb-4">Emergency Contact</h4>
             <p className="text-2xl font-black mb-2 whitespace-nowrap overflow-hidden text-ellipsis">Emergency Services</p>
             <div className="flex items-center justify-between text-emerald-200">
               <span className="text-xs font-bold">Tap to call</span>
               <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
             </div>
           </Card>
        </div>
      </div>

      <HealthuChat />
    </div>
  );
}

