import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { Card, Button, cn } from '../../components/ui/Base';
import { FileText, Search, Filter, ExternalLink, Calendar, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export default function PatientTimeline() {
  const { user } = useAuth();
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'records'),
      where('patientId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const recordsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRecords(recordsData);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const filteredRecords = records.filter(r => filter === 'all' || r.type === filter);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Medical Timeline</h1>
          <p className="text-gray-500 mt-1">View and manage all your health records</p>
        </div>
        <Link id="timeline-add-btn" to="/patient/upload">
          <Button>
            <Plus className="w-5 h-5" /> New Record
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['all', 'prescription', 'report'].map((t) => (
          <button
            id={`filter-${t}-btn`}
            key={t}
            onClick={() => setFilter(t)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-bold capitalize transition-all whitespace-nowrap",
              filter === t ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "bg-white text-gray-500 hover:bg-gray-100"
            )}
          >
            {t === 'all' ? 'All Records' : t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 w-full bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredRecords.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-20 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No records found</h3>
          <p className="text-gray-500 mt-2">Start by uploading your first prescription or report.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRecords.map((record) => (
            <Card key={record.id} className="flex items-center justify-between p-5 hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  record.type === 'prescription' ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"
                )}>
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight text-sm">
                    {record.fileName}
                  </h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{record.type}</span>
                    <span className="text-xs text-gray-300">•</span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {record.createdAt?.seconds ? format(new Date(record.createdAt.seconds * 1000), 'dd MMM yyyy') : 'Recently'}
                    </span>
                  </div>
                </div>
              </div>
              <a 
                id={`view-record-${record.id}`}
                href={record.fileURL} 
                target="_blank" 
                rel="noreferrer"
                className="p-3 bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
