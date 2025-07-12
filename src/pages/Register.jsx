import React, { useState, useContext } from 'react';
import api from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaChevronDown } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';


const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', { name, email, password, role });
      // Immediately log in the user after registration
      const loginRes = await api.post('/auth/login', { email, password, role });
      login(loginRes.data.user, loginRes.data.token);
      toast.success('Registration successful! Redirecting to dashboard...');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-leaflight">
      <h2 className="text-4xl absolute top-10 font-extrabold text-white mb-8 drop-shadow-lg">Doubt Tracker App</h2>
      <div className="bg-white/80 rounded-2xl shadow-lg p-8 max-w-md w-full flex flex-col items-center">
        <h2 className="text-2xl font-bold text-leaf mb-4">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <div className="relative">
            <FaUser className="absolute left-3 top-3 text-leaf" />
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" required className="w-full pl-10 border rounded-xl px-3 py-2 bg-leaflight text-leaf focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3 text-leaf" />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required className="w-full pl-10 border rounded-xl px-3 py-2 bg-leaflight text-leaf focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-leaf" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required className="w-full pl-10 border rounded-xl px-3 py-2 bg-leaflight text-leaf focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
          <div className="relative">
            <select value={role} onChange={e => setRole(e.target.value)} className="w-full border rounded-xl px-3 py-2 text-leaf appearance-none focus:outline-none focus:ring-2 focus:ring-accent pr-10">
              <option value="student" >Student</option>
              <option value="mentor">Mentor</option>
            </select>
            <FaChevronDown className="pointer-events-none absolute right-4 top-1/2 transform -translate-y-1/2 text-leaf text-lg" />
          </div>
          <button type="submit" className="w-full bg-black text-white py-3 rounded-xl font-semibold text-lg shadow hover:bg-accent transition">Register</button>
        </form>
        <div className="mt-4 text-leaf text-sm">
          Already have an account? <span className="underline cursor-pointer" onClick={() => navigate('/login')}>Sign in</span>
        </div>
      </div>
    </div>
  );
};

export default Register; 