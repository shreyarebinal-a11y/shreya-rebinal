import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Card, Button } from '../../components/ui/Base';
import { User, ShieldOff, FileText, Calendar, ExternalLink, ChevronLeft, Droplet, MapPin } from 'lucide-react';
import { format } from 'date-fns';

export default function PatientView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      if (!id) return;
      try {
        const patientDoc = await getDoc(doc(db, 'users', id));
        if (!patientDoc.exists()) {
          setError('Patient not found');
          setLoading(false);
          return;
        }

        const patientData = patientDoc.data();
        setPatient(patientData);

        if (patientData.isSharingEnabled) {
          const recordsQuery = query(
            collection(db, 'records'),
            where('patientId', '==', id),
            orderBy('createdAt', 'desc')
          );
          const recordsSnap = await getDocs(recordsQuery);
          setRecords(recordsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
      } catch (err) {
        console.error(err);
        setError('Error fetching patient data');
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [id]);

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (error || !patient) return (
    <div className="max-w-xl mx-auto p-4 py-20 text-center space-y-6">
      <div className="w-20 h-20 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto">
        <User className="w-10 h-10" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900">{error || 'Access Denied'}</h1>
      <p className="text-gray-500">The patient ID provided is invalid or you do not have permission to view this profile.</p>
      <Button id="error-back-btn" onClick={() => navigate('/doctor/dashboard')} variant="outline">
        Return to Dashboard
      </Button>
    </div>
  );

  if (!patient.isSharingEnabled) return (
    <div className="max-w-xl mx-auto p-4 py-20 text-center space-y-6">
      <div className="w-24 h-24 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-red-500/10">
        <ShieldOff className="w-12 h-12" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Access Denied</h1>
        <p className="text-gray-600 font-medium">Dr. {id}, the patient has disabled medical record sharing.</p>
      </div>
      <p className="text-gray-500 max-w-sm mx-auto">For privacy reasons, you cannot view this patient's history unless they enable sharing in their dashboard.</p>
      <Button id="denied-back-btn" onClick={() => navigate('/doctor/dashboard')} className="mt-4">
        Go Back
      </Button>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Button id="patient-view-back-btn" variant="ghost" className="mb-2 -ml-4" onClick={() => navigate('/doctor/dashboard')}>
        <ChevronLeft className="w-5 h-5" /> Back to Dashboard
      </Button>

      {/* Patient Header */}
      <Card className="p-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
           <div className="w-32 h-32 bg-blue-600 rounded-[2.5rem] flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-blue-500/20">
             {patient.name.charAt(0)}
           </div>
           <div className="flex-grow space-y-4">
             <div>
               <h1 className="text-4xl font-black text-gray-900 tracking-tighter">{patient.name}</h1>
               <p className="text-gray-500 text-lg font-medium">{patient.email}</p>
             </div>
             
             <div className="flex flex-wrap gap-3">
                <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl flex items-center gap-2 font-bold text-sm">
                  <User className="w-4 h-4" /> {patient.age} Yrs
                </div>
                <div className="px-4 py-2 bg-red-50 text-red-700 rounded-xl flex items-center gap-2 font-bold text-sm">
                  <Droplet className="w-4 h-4" /> {patient.bloodGroup}
                </div>
                <div className="px-4 py-2 bg-gray-50 text-gray-700 rounded-xl flex items-center gap-2 font-bold text-sm">
                  <MapPin className="w-4 h-4" /> {patient.address}
                </div>
             </div>
           </div>
        </div>
      </Card>

      {/* Medical Timeline */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <Calendar className="w-6 h-6 text-blue-600" /> Medical Timeline
          </h2>
          <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{records.length} Records found</span>
        </div>

        {records.length === 0 ? (
          <Card className="py-20 text-center">
            <FileText className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No medical records available for this patient.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {records.map((record) => (
              <Card key={record.id} className="flex items-center justify-between p-6 hover:border-blue-500 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${record.type === 'prescription' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    <FileText className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight text-sm">
                      {record.fileName}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{record.type}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs text-gray-500 font-medium">
                        {record.createdAt?.seconds ? format(new Date(record.createdAt.seconds * 1000), 'dd MMM yyyy') : 'Recent'}
                      </span>
                    </div>
                  </div>
                </div>
                <a 
                  id={`doctor-view-record-${record.id}`}
                  href={record.fileURL} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-3 bg-gray-50 text-gray-400 hover:bg-blue-600 hover:text-white rounded-2xl transition-all"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
