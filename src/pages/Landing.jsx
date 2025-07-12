import React from 'react';
import { useNavigate } from 'react-router-dom';


const Landing = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center " >
      <h2 className="text-4xl font-extrabold text-white mb-8 drop-shadow-lg">Doubt Tracker App</h2>
      <div className="bg-white/80 rounded-2xl shadow-lg p-8 max-w-md w-full flex flex-col items-center">
        <h1 className="text-3xl font-bold text-leaf mb-4 text-center">Welcome to DevHelp</h1>
        <p className="text-leaf mb-8 text-center">A modern doubt tracker for students and mentors.<br/>Choose your role to get started.</p>
        <button
          onClick={() => navigate('/login?role=student')}
          className="w-full mb-4 py-3 rounded-xl bg-black text-white font-semibold text-lg shadow hover:bg-gray-800 transition"
        >
          Login as Student
        </button>
        <button
          onClick={() => navigate('/login?role=mentor')}
          className="w-full py-3 rounded-xl bg-black text-white font-semibold text-lg shadow hover:bg-gray-800 transition"
        >
          Login as Mentor
        </button>
        <button
          onClick={() => navigate('/register')}
          className="w-full mt-4 py-3 rounded-xl bg-leaf  text-black border border-black font-semibold text-lg shadow hover:bg-leafdark transition"
        >
          Register as New User
        </button>
      </div>
    </div>
  );
};

export default Landing;