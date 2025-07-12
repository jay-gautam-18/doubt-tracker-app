import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import api from '../utils/axios';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const beep = () => {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'sine';
  o.frequency.value = 880;
  o.connect(g);
  g.connect(ctx.destination);
  g.gain.value = 0.1;
  o.start();
  o.stop(ctx.currentTime + 0.1);
  o.onended = () => ctx.close();
};

const ChatBox = ({ doubtId, user }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [newMsgAlert, setNewMsgAlert] = useState(null);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [atBottom, setAtBottom] = useState(true);

  useEffect(() => {
    // Fetch chat history
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/chat/${doubtId}`);
        setMessages(res.data);
      } catch {
        setMessages([]);
      }
      setLoading(false);
    };
    fetchHistory();
  }, [doubtId]);

  useEffect(() => {
    // Connect to socket and join room
    socketRef.current = io(SOCKET_URL, { transports: ['websocket'] });
    socketRef.current.emit('join_doubt', doubtId);
    socketRef.current.on('chat_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
      // Show alert and play sound if not at bottom
      if (!atBottom) {
        setNewMsgAlert(`${msg.sender?.name || 'User'} sent a new message`);
        beep();
        setTimeout(() => setNewMsgAlert(null), 3000);
      }
    });
    return () => {
      socketRef.current.disconnect();
    };
    // eslint-disable-next-line
  }, [doubtId, atBottom]);

  useEffect(() => {
    if (atBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, atBottom]);

  // Track if user is at the bottom of chat
  useEffect(() => {
    const handleScroll = () => {
      if (!chatContainerRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      setAtBottom(scrollTop + clientHeight >= scrollHeight - 10);
    };
    const ref = chatContainerRef.current;
    if (ref) ref.addEventListener('scroll', handleScroll);
    return () => {
      if (ref) ref.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    socketRef.current.emit('chat_message', {
      doubtId,
      sender: user.id,
      content: input.trim(),
    });
    setInput('');
    setAtBottom(true);
  };

  return (
    <div className="flex flex-col h-80 sm:h-96 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg p-2 sm:p-4 relative">
      {newMsgAlert && (
        <div className="absolute top-0 left-0 right-0 bg-accent text-dark text-center py-1 rounded-t-xl animate-pulse z-10 text-xs sm:text-base">
          {newMsgAlert}
        </div>
      )}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto mb-2 pt-4 sm:pt-6 scrollbar-hidden text-sm sm:text-base">
        {loading ? (
          <div className="text-muted text-center">Loading chat...</div>
        ) : (
          <ul className="space-y-2">
            {messages.map((msg) => (
              <li key={msg._id} className={`w-full flex ${msg.sender?._id === user.id ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs sm:max-w-md px-4 py-2 rounded-2xl shadow-md flex flex-col transition-all duration-150 ${msg.sender?._id === user.id ? 'bg-gradient-to-br from-green-300 to-green-500 text-black items-end rounded-tr-none hover:shadow-green-200' : 'bg-white/70 text-leaf items-start rounded-tl-none hover:shadow-leaflight/60 border border-white/40'}`}>
                  <div className="flex items-center w-full justify-between mb-1">
                    <span className="text-xs font-bold opacity-80">{msg.sender?.name || 'User'}</span>
                  </div>
                  <span className="w-full break-words text-base">{msg.content}</span>
                  <span className="block text-xs text-muted mt-1 self-end">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </li>
            ))}
            <div ref={messagesEndRef} />
          </ul>
        )}
      </div>
      <form onSubmit={handleSend} className="flex space-x-2 mt-2 bg-white/30 rounded-xl p-2 shadow-inner">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border-none outline-none bg-transparent text-leaf placeholder:text-leaf/60 px-2 sm:px-3 py-2 text-sm sm:text-base"
        />
        <button type="submit" className="bg-gradient-to-br from-green-400 to-green-600 text-white px-4 py-2 rounded-xl font-bold shadow hover:from-green-500 hover:to-green-700 transition disabled:opacity-50" disabled={!input.trim()}>Send</button>
      </form>
    </div>
  );
};

export default ChatBox; 