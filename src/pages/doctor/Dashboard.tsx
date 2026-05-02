import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, Button, Input, cn } from '../../components/ui/Base';
import { Search, User, Clipboard, Calendar, Camera, Scan, Sparkles, Filter, MoreVertical, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { QRScanner } from '../../components/QRScanner';
import { motion } from 'motion/react';

export default function DoctorDashboard() {
  const { profile } = useAuth();
  const [patientId, setPatientId] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (patientId.trim()) {
      navigate(`/doctor/patient/${patientId.trim()}`);
    }
  };

  const onScan = (id: string) => {
    navigate(`/doctor/patient/${id}`);
    setShowScanner(false);
  };

  if (!profile) return null;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header Plate */}
      <section className="bg-gray-900 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-blue-500/30">
              <Sparkles className="w-3 h-3" /> Professional Workspace
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none truncate">Welcome, Dr. {profile.name.split(' ').pop()}</h1>
            <p className="text-gray-400 font-medium max-w-md">Access secure patient records instantly using our high-speed scanning system.</p>
          </div>
          
          <div className="flex flex-col gap-3 w-full md:w-64">
            <Button 
              id="qr-scan-trigger"
              onClick={() => setShowScanner(true)} 
              className="bg-blue-600 hover:bg-blue-700 py-4 text-lg rounded-[2rem]"
            >
              <Scan className="w-6 h-6" /> Scan QR Code
            </Button>
          </div>
        </div>
      </section>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <Card className="flex-grow p-2 pl-6 flex items-center bg-white border-0 shadow-xl ring-1 ring-black/5 rounded-[2rem]">
          <Search className="w-5 h-5 text-gray-400 mr-4" />
          <form onSubmit={handleSearch} className="flex-grow flex items-center gap-2">
            <input 
              id="patient-search-input"
              type="text" 
              placeholder="Search by Patient ID or Name..." 
              className="flex-grow bg-transparent border-0 focus:ring-0 text-gray-900 font-medium placeholder:text-gray-400"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
            />
            <Button id="search-btn" type="submit" size="sm" className="rounded-2xl px-6">Search</Button>
          </form>
        </Card>
        <Button id="filter-btn" variant="outline" className="rounded-[2rem] px-8 h-12 bg-white border-0 shadow-lg text-gray-600 ring-1 ring-black/5">
          <Filter className="w-4 h-4 mr-2" /> Filters
        </Button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
            Recent Patients <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-400">04</span>
          </h3>
          
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.01 }}
                className="group flex flex-col md:flex-row items-center justify-between p-6 bg-white rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-xl">
                    {['J', 'A', 'S'][i-1]}
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900">{['Johnathan Doe', 'Anil Mehta', 'Saira Banu'][i-1]}</h4>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1 italic">Last visit: 02 May 2026</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                  <div className="text-right hidden md:block">
                     <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none">Vitals</p>
                     <p className="text-sm font-black text-emerald-600">STABLE</p>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-8 rounded-[2.5rem] border-0 shadow-2xl relative overflow-hidden">
            <div className="absolute bottom-0 right-0 p-4 opacity-10">
              <Clipboard className="w-32 h-32 rotate-12" />
            </div>
            <h3 className="text-lg font-black tracking-tight mb-2">Upcoming Consults</h3>
            <p className="text-blue-100 text-sm mb-6 font-medium">You have 4 patients scheduled for today.</p>
            <div className="space-y-3">
              {[1, 2].map(i => (
                <div key={i} className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 flex items-center gap-3">
                  <div className="w-10 h-10 bg-white text-blue-600 rounded-xl flex items-center justify-center font-black">
                    1{i}
                  </div>
                  <div>
                    <p className="text-sm font-bold leading-none">{['Priya Singh', 'Kabir Khan'][i-1]}</p>
                    <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mt-1">10:{i}0 AM</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-8 rounded-[2.5rem] border-0 shadow-xl ring-1 ring-black/5 bg-white">
            <h3 className="font-black text-gray-900 mb-6">Clinic Statistics</h3>
            <div className="space-y-6">
              {[
                { label: 'Total Consultations', value: '142', color: 'bg-blue-600' },
                { label: 'Patient Satisfaction', value: '98%', color: 'bg-emerald-500' },
                { label: 'Reports Pending', value: '03', color: 'bg-orange-500' }
              ].map(stat => (
                <div key={stat.label}>
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{stat.label}</p>
                    <p className="text-sm font-black text-gray-900">{stat.value}</p>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full animate-in slide-in-from-left duration-1000", stat.color)} style={{ width: '70%' }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {showScanner && (
        <QRScanner onScan={onScan} onClose={() => setShowScanner(false)} />
      )}
    </div>
  );
}
