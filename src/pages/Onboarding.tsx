import React, { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { Button, Input, Select, Card } from '../components/ui/Base';
import { User, Stethoscope, ChevronRight, MapPin, Heart } from 'lucide-react';
import { motion } from 'motion/react';

export default function Onboarding() {
  const { user, refreshProfile } = useAuth();
  const [role, setRole] = useState<'patient' | 'doctor' | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Shared fields
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  
  // Patient fields
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  
  // Doctor fields
  const [degree, setDegree] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !role) return;
    
    setLoading(true);
    try {
      const profileData: any = {
        uid: user.uid,
        email: user.email,
        role,
        name,
        address,
        createdAt: new Date().toISOString(),
      };

      if (role === 'patient') {
        profileData.age = parseInt(age);
        profileData.gender = gender;
        profileData.bloodGroup = bloodGroup;
        profileData.isSharingEnabled = true; // Default to ON
      } else {
        profileData.degree = degree;
      }

      await setDoc(doc(db, 'users', user.uid), profileData);
      await refreshProfile();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!role) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Complete Your Profile</h1>
            <p className="text-gray-500 mt-2">How will you be using MedVault?</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              id="select-patient-btn"
              onClick={() => setRole('patient')}
              className="p-8 bg-white rounded-3xl border-2 border-transparent hover:border-blue-500 hover:shadow-xl transition-all group text-center flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                <User className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">I am a Patient</h3>
              <p className="text-gray-500 text-sm mt-2">Manage your medical records and share with doctors.</p>
            </button>

            <button 
              id="select-doctor-btn"
              onClick={() => setRole('doctor')}
              className="p-8 bg-white rounded-3xl border-2 border-transparent hover:border-blue-500 hover:shadow-xl transition-all group text-center flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                <Stethoscope className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">I am a Doctor</h3>
              <p className="text-gray-500 text-sm mt-2">Access patient records securely via QR codes.</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <Button id="back-to-role-btn" variant="ghost" className="mb-6 -ml-4" onClick={() => setRole(null)}>
          <ChevronRight className="w-4 h-4 rotate-180" /> Change Role
        </Button>

        <Card className="shadow-xl">
          <div className="flex items-center gap-4 mb-8">
             <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${role === 'patient' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
               {role === 'patient' ? <User className="w-6 h-6" /> : <Stethoscope className="w-6 h-6" />}
             </div>
             <div>
               <h2 className="text-2xl font-bold text-gray-900">{role === 'patient' ? 'Patient Profile' : 'Doctor Registration'}</h2>
               <p className="text-gray-500 text-sm">Tell us more about yourself</p>
             </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                id="name-input"
                label="Full Name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              {role === 'patient' && (
                <Input
                  id="age-input"
                  label="Age"
                  type="number"
                  placeholder="25"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
              )}
            </div>

            {role === 'patient' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  id="gender-select"
                  label="Gender"
                  options={[
                    { label: 'Male', value: 'male' },
                    { label: 'Female', value: 'female' },
                    { label: 'Other', value: 'other' }
                  ]}
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                />
                <Select
                  id="blood-group-select"
                  label="Blood Group"
                  options={[
                    { label: 'A+', value: 'A+' },
                    { label: 'A-', value: 'A-' },
                    { label: 'B+', value: 'B+' },
                    { label: 'B-', value: 'B-' },
                    { label: 'AB+', value: 'AB+' },
                    { label: 'AB-', value: 'AB-' },
                    { label: 'O+', value: 'O+' },
                    { label: 'O-', value: 'O-' }
                  ]}
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  required
                />
              </div>
            )}

            {role === 'doctor' && (
              <Input
                id="degree-input"
                label="Degree / Specialization"
                placeholder="MBBS, Cardiology"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                required
              />
            )}

            <Input
              id="address-input"
              label="Address"
              placeholder="City, Province"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />

            <Button id="finish-onboarding-btn" type="submit" loading={loading} className="w-full" size="lg">
              Finish Setup
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
