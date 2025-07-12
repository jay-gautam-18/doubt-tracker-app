import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import { toast } from 'react-toastify';


const Login = ({ role: initialRole }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(initialRole || 'student');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialRole) setRole(initialRole);
  }, [initialRole]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password, role });
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-leaflight" >
      <h2 className="text-4xl absolute top-20 font-extrabold text-white mb-8 drop-shadow-lg">Doubt Tracker App</h2>
      <div className="bg-white/80 rounded-2xl shadow-lg p-8 max-w-md w-full flex flex-col items-center">
        <h2 className="text-2xl font-bold text-leaf mb-4">Welcome Back</h2>
        <div className="mb-2 text-leaf text-lg font-semibold">
          You are logging in as <span className="text-accent">{role.charAt(0).toUpperCase() + role.slice(1)}</span>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <div className="relative">
            <FaUser className="absolute left-3 top-3 text-leaf" />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required className="w-full pl-10 border rounded-xl px-3 py-2 bg-leaflight text-leaf focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-leaf" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required className="w-full pl-10 border rounded-xl px-3 py-2 bg-leaflight text-leaf focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
          {/* Removed role dropdown */}
          <button type="submit" className="w-full bg-black text-white py-3 rounded-xl font-semibold text-lg shadow hover:bg-accent2 transition">Login</button>
        </form>
        <div className="mt-4 text-leaf text-sm">
          Don&apos;t have an account? <span className="underline cursor-pointer" onClick={() => navigate('/register')}>Sign up</span>
        </div>
      </div>
    </div>
  );
};

export default Login; 