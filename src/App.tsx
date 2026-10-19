/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import { Material, Question, StudentProfile } from './types';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [role, setRole] = useState<string>('');

  const [materials, setMaterials] = useState<Material[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppData = async () => {
    try {
      const matRes = await fetch('/api/materials');
      if (matRes.ok) {
        const matData = await matRes.json();
        setMaterials(matData);
      }

      const qRes = await fetch('/api/questions');
      if (qRes.ok) {
        const qData = await qRes.json();
        setQuestions(qData);
      }
    } catch (err) {
      console.error('Error fetching initial app data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppData();
  }, []);

  const handleLoginSuccess = (usr: any, prof: any, r: string) => {
    setUser(usr);
    setProfile(prof);
    setRole(r);
  };

  const handleLogout = () => {
    setUser(null);
    setProfile(null);
    setRole('');
  };

  const handleRefreshData = () => {
    fetchAppData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 space-y-4">
        <div className="h-10 w-10 rounded-xl bg-blue-600 border border-blue-500 animate-spin flex items-center justify-center text-white font-bold text-lg">
          🌏
        </div>
        <p className="text-xs text-slate-400 font-bold tracking-widest uppercase">Memuat Lab Diplomindo...</p>
      </div>
    );
  }

  // Session routing branch
  if (!user) {
    return <LandingPage onLoginSuccess={handleLoginSuccess} />;
  }

  if (role === 'student') {
    return (
      <StudentDashboard
        user={user}
        initialProfile={profile}
        materials={materials}
        questions={questions}
        onLogout={handleLogout}
      />
    );
  }

  // Teacher or Admin dashboard routing
  return (
    <TeacherDashboard
      user={user}
      materials={materials}
      questions={questions}
      onLogout={handleLogout}
      onRefreshData={handleRefreshData}
    />
  );
}
