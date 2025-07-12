import React, { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import DoubtForm from '../components/DoubtForm';
import MentorDoubtList from '../components/MentorDoubtList';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import StudentDoubtCard from '../components/StudentDoubtCard';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mentorDoubts, setMentorDoubts] = useState([]);
  const [mentorLoading, setMentorLoading] = useState(false);
  const [mentorError, setMentorError] = useState('');
  const [filter, setFilter] = useState('all');
  const [mentorPage, setMentorPage] = useState(1);
  const [mentorTotalPages, setMentorTotalPages] = useState(1);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, { transports: ['websocket'] });
    if (user?.role === 'mentor') {
      socketRef.current.on('new_doubt', (doubt) => {
        toast.info('New doubt posted!');
        setMentorDoubts((prev) => [doubt, ...prev]);
      });
      socketRef.current.on('doubt_status_update', ({ doubtId, status, doubt }) => {
        setMentorDoubts((prev) => prev.map(d => d._id === doubtId ? { ...d, status } : d));
        toast.info(`Doubt status updated to ${status}`);
      });
      socketRef.current.on('doubt_deleted', ({ doubtId }) => {
        setMentorDoubts((prev) => prev.filter(d => d._id !== doubtId));
        toast.info('A doubt was deleted');
      });
    }
    if (user?.role === 'student') {
      socketRef.current.on('doubt_status_update', ({ doubtId, status, doubt }) => {
        setDoubts((prev) => prev.map(d => d._id === doubtId ? { ...d, status } : d));
        toast.info(`Your doubt status updated to ${status}`);
      });
      socketRef.current.on('doubt_deleted', ({ doubtId }) => {
        setDoubts((prev) => prev.filter(d => d._id !== doubtId));
        toast.info('A doubt was deleted');
      });
    }
    return () => {
      socketRef.current.disconnect();
    };
    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    if (user?.role === 'student') fetchDoubts();
  }, [user]);

  useEffect(() => {
    if (user?.role === 'mentor') fetchMentorDoubts();
  }, [user, filter, mentorPage]);

  const fetchDoubts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/doubts');
      setDoubts(res.data.doubts);
    } catch (err) {
      setError('Failed to fetch doubts');
    }
    setLoading(false);
  };

  const fetchMentorDoubts = async () => {
    setMentorLoading(true);
    setMentorError('');
    try {
      const params = { page: mentorPage, limit: 5 };
      if (filter && filter !== 'all') params.status = filter;
      const res = await api.get('/doubts', { params });
      setMentorDoubts(res.data.doubts);
      setMentorTotalPages(res.data.totalPages);
    } catch (err) {
      setMentorError('Failed to fetch doubts');
    }
    setMentorLoading(false);
  };

  const handleCreate = async (data) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/doubts', data);
      fetchDoubts();
      toast.success('Doubt created');
      // Emit new_doubt event for mentors
      if (socketRef.current) {
        socketRef.current.emit('new_doubt', res.data._id);
      }
    } catch (err) {
      setError('Failed to create doubt');
      toast.error('Failed to create doubt');
    }
    setLoading(false);
  };

  const handleResolve = async (id) => {
    setLoading(true);
    setError('');
    try {
      await api.patch(`/doubts/${id}/resolve`);
      fetchDoubts();
      toast.success('Doubt marked as resolved');
      // Emit status update
      if (socketRef.current) {
        socketRef.current.emit('doubt_status_update', { doubtId: id, status: 'resolved' });
      }
    } catch (err) {
      setError('Failed to mark as resolved');
      toast.error('Failed to mark as resolved');
    }
    setLoading(false);
  };

  const handleMentorResolve = async (id) => {
    setMentorLoading(true);
    setMentorError('');
    try {
      await api.patch(`/doubts/${id}/resolve`);
      fetchMentorDoubts();
      toast.success('Doubt marked as resolved');
      // Emit status update
      if (socketRef.current) {
        socketRef.current.emit('doubt_status_update', { doubtId: id, status: 'resolved' });
      }
    } catch (err) {
      setMentorError('Failed to mark as resolved');
      toast.error('Failed to mark as resolved');
    }
    setMentorLoading(false);
  };

  const handleMentorPageChange = (page) => {
    if (page >= 1 && page <= mentorTotalPages) setMentorPage(page);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    setError('');
    try {
      await api.delete(`/doubts/${id}`);
      toast.success('Doubt deleted');
    } catch (err) {
      setError('Failed to delete doubt');
      toast.error('Failed to delete doubt');
    }
    setLoading(false);
  };

  if (!user) return null;

  const bgUrl = 'https://plus.unsplash.com/premium_photo-1686133832542-e95f2a6d953e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyOXx8fGVufDB8fHx8fA%3D%3D';

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-leaflight" style={{ backgroundImage: `url(${bgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <h2 className="text-4xl font-extrabold text-white mt-8 mb-8 drop-shadow-lg">Doubt Tracker App</h2>
      <div className="bg-white/80 rounded-2xl shadow-lg p-8 max-w-2xl w-full flex flex-col items-center mx-2 relative">
        <button className="absolute top-2 right-2 px-3 py-1 border border-black hover:bg-black hover:text-white bg-transparent rounded" onClick={() => { logout(); navigate('/'); }}>Logout</button>
        <h2 className="text-2xl font-bold mb-2 text-leaf">Welcome, {user.name}!</h2>
        <p className="mb-2 text-leaf">Role: {user.role}</p>
        <hr className="my-4 w-full" />
        {user.role === 'student' ? (
          <div className="w-full">
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-2 text-leaf">Post a New Doubt</h4>
              <DoubtForm onSubmit={handleCreate} loading={loading} />
            </div>
            <h3 className="text-xl font-bold mb-4 text-leaf">Your Doubts</h3>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            {loading && <Spinner />}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 scrollbar-hidden">
              {doubts
                .slice()
                .sort((a, b) => {
                  if (a.status === b.status) return 0;
                  if (a.status === 'open') return -1;
                  if (b.status === 'open') return 1;
                  return 0;
                })
                .map(doubt => (
                  <StudentDoubtCard key={doubt._id} doubt={doubt} onDelete={handleDelete} />
                ))}
            </div>
          </div>
        ) : (
          <div className="w-full">
            <h3 className="text-xl font-bold mb-4 text-leaf">Mentor Dashboard</h3>
            {mentorError && <p className="text-red-500 mb-2">{mentorError}</p>}
            {mentorLoading && <Spinner />}
            <MentorDoubtList
              doubts={mentorDoubts}
              onComment={(doubt) => navigate(`/doubt/${doubt._id}`)}
              onResolve={handleMentorResolve}
              filter={filter}
              setFilter={setFilter}
              loading={mentorLoading}
              page={mentorPage}
              totalPages={mentorTotalPages}
              onPageChange={handleMentorPageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 