import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { db, storage } from '../../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Button, Input, Select, Card, cn } from '../../components/ui/Base';
import { FileText, Upload, ChevronLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export default function PatientUpload() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState('prescription');
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileName(selectedFile.name.split('.')[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !user) return;

    setLoading(true);
    setStatus('idle');
    
    try {
      const fileId = Math.random().toString(36).substring(7);
      const storageRef = ref(storage, `records/${user.uid}/${fileId}_${file.name}`);
      
      const snapshot = await uploadBytes(storageRef, file);
      const fileURL = await getDownloadURL(snapshot.ref);

      await addDoc(collection(db, 'records'), {
        patientId: user.uid,
        fileURL,
        fileName: fileName || file.name,
        type,
        createdAt: serverTimestamp(),
        fileSize: file.size,
        fileType: file.type
      });

      setStatus('success');
      setTimeout(() => navigate('/patient/timeline'), 2000);
    } catch (error) {
      console.error(error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 md:py-12">
      <Button id="upload-back-btn" variant="ghost" className="mb-6 -ml-4" onClick={() => navigate(-1)}>
        <ChevronLeft className="w-5 h-5" /> Back
      </Button>

      <Card className="shadow-xl">
        <div className="flex items-center gap-4 mb-8">
           <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
             <Upload className="w-6 h-6" />
           </div>
           <div>
             <h2 className="text-2xl font-bold text-gray-900">Upload Record</h2>
             <p className="text-gray-500 text-sm">Add a new prescription or report</p>
           </div>
        </div>

        {status === 'success' ? (
          <div className="text-center py-12 space-y-4 animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Upload Successful</h3>
            <p className="text-gray-500">Your record has been securely stored.</p>
          </div>
        ) : (
          <form onSubmit={handleUpload} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Medical File (PDF/Image)</label>
              <div 
                id="file-drop-zone"
                className={cn(
                  "border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-colors cursor-pointer",
                  file ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300 bg-gray-50"
                )}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <input 
                  id="file-input"
                  type="file" 
                  className="hidden" 
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                />
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center mb-4",
                  file ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
                )}>
                  {file ? <FileText className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
                </div>
                {file ? (
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-900 truncate max-w-[200px]">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">Click or drag file to upload</p>
                    <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 10MB</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                id="record-type-select"
                label="Record Type"
                options={[
                  { label: 'Prescription', value: 'prescription' },
                  { label: 'Medical Report', value: 'report' }
                ]}
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              />
              <Input
                id="record-name-input"
                label="Document Name"
                placeholder="Blood Test Result"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                required
              />
            </div>

            {status === 'error' && (
              <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">Failed to upload file. Please try again.</p>
              </div>
            )}

            <Button id="submit-upload-btn" type="submit" loading={loading} className="w-full" size="lg" disabled={!file}>
              Complete Upload
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
