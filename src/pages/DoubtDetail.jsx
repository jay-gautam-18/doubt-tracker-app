import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { AuthContext } from '../context/AuthContext';
import ChatBox from '../components/ChatBox';

const DoubtDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [doubt, setDoubt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDoubt();
    // eslint-disable-next-line
  }, [id]);

  const fetchDoubt = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/doubts/${id}`);
      setDoubt(res.data);
    } catch (err) {
      setError('Failed to fetch doubt');
    }
    setLoading(false);
  };

  if (loading) return <p className="text-center text-muted">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!doubt) return null;

  const bgUrl = 'https://plus.unsplash.com/premium_photo-1686133832542-e95f2a6d953e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyOXx8fGVufDB8fHx8fA%3D%3D';

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-leaflight" style={{ backgroundImage: `url(${bgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {/* Navigation Bar */}
      <div className="w-full flex items-center justify-between px-4 py-3 bg-white/70 backdrop-blur-md shadow-md fixed top-0 left-0 z-20">
        <button onClick={() => navigate('/dashboard')} className="text-leaf font-bold text-lg hover:underline">&#8592; Back</button>
        <span className="text-2xl font-extrabold text-leaf drop-shadow-lg">Doubt Tracker App</span>
        {user && (
          <button className="px-3 py-1 border border-black hover:bg-black hover:text-white bg-transparent rounded" onClick={() => { localStorage.clear(); navigate('/'); }}>Logout</button>
        )}
      </div>
      <div className="pt-20"></div>
      <div className="bg-white/80 rounded-2xl shadow-lg p-8 max-w-3xl w-full flex flex-col items-center mx-2 mt-8">
        <div className="w-full flex flex-col-reverse md:flex-row-reverse rounded-xl overflow-hidden">
          <div className="flex-1 p-4 sm:p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2 text-accent">{doubt.title}</h2>
              <p className="text-muted mb-4">Doubt: {doubt.description}</p>
              <div className="flex items-center space-x-4 text-sm mb-2">
                <span className="text-muted">Status: <span className={doubt.status === 'open' ? 'text-yellow-400' : 'text-green-400'}>{doubt.status}</span></span>
                <span className="text-muted">Posted: {new Date(doubt.createdAt).toLocaleString()}</span>
                <span className="text-muted">By: {doubt.user?.name}</span>
              </div>
            </div>
          </div>
         
        </div>
        <div className="bg-card rounded-xl shadow-lg mt-8 p-6 w-full">
          <ChatBox doubtId={id} user={user} />
        </div>
      </div>
    </div>
  );
};

export default DoubtDetail; 