import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Card, Button, Input, Select, cn } from './ui/Base';
import { Bell, BellOff, Plus, Trash2, Clock, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Reminders = () => {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newType, setNewType] = useState('medicine');

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'reminders'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setReminders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, [user]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTitle || !newTime) return;
    try {
      await addDoc(collection(db, 'reminders'), {
        userId: user.uid,
        title: newTitle,
        time: newTime,
        type: newType,
        active: true,
        createdAt: new Date().toISOString()
      });
      setIsAdding(false);
      setNewTitle('');
      setNewTime('');
    } catch (err) {
      console.error(err);
    }
  };

  const toggleReminder = async (id: string, current: boolean) => {
    try {
      await updateDoc(doc(db, 'reminders', id), { active: !current });
    } catch (err) {
      console.error(err);
    }
  };

  const removeReminder = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'reminders', id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-600" /> Reminders
        </h3>
        <button 
          id="add-reminder-toggle"
          onClick={() => setIsAdding(!isAdding)}
          className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <Plus className={cn("w-5 h-5 transition-transform", isAdding && "rotate-45")} />
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <Card className="bg-blue-50/50 border-blue-100 p-4 mb-4">
              <form onSubmit={handleAdd} className="space-y-3">
                <Input 
                  id="reminder-title"
                  label="What's this for?"
                  placeholder="e.g. Morning Insulin"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="bg-white"
                  size="sm"
                />
                <div className="flex gap-2">
                  <Input 
                    id="reminder-time"
                    type="time" 
                    label="Time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="bg-white"
                  />
                  <Select 
                    id="reminder-type"
                    label="Type"
                    options={[
                      { label: 'Medicine', value: 'medicine' },
                      { label: 'Appointment', value: 'appointment' },
                      { label: 'General', value: 'general' }
                    ]}
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="bg-white"
                  />
                </div>
                <Button id="save-reminder-btn" type="submit" className="w-full" size="sm">Save Reminder</Button>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {reminders.length === 0 ? (
          <p className="text-sm text-gray-400 italic py-4 text-center">No active reminders</p>
        ) : (
          reminders.map((rem) => (
            <div 
              key={rem.id}
              className={cn(
                "flex items-center justify-between p-3 rounded-2xl border transition-all",
                rem.active ? "bg-white border-gray-100 shadow-sm" : "bg-gray-50 border-transparent opacity-60"
              )}
            >
              <div className="flex items-center gap-3">
                <button 
                  id={`toggle-reminder-${rem.id}`}
                  onClick={() => toggleReminder(rem.id, rem.active)}
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                    rem.active ? "bg-blue-50 text-blue-600" : "bg-gray-200 text-gray-400"
                  )}
                >
                  {rem.active ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
                </button>
                <div>
                  <p className="text-sm font-bold text-gray-900 leading-tight">{rem.title}</p>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] uppercase font-black tracking-widest text-gray-400">
                    <Clock className="w-3 h-3" /> {rem.time}
                  </div>
                </div>
              </div>
              <button 
                id={`remove-reminder-${rem.id}`}
                onClick={() => removeReminder(rem.id)}
                className="p-2 text-gray-300 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
