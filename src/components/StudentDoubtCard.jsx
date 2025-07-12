import React from 'react';
import { Link } from 'react-router-dom';

const StudentDoubtCard = ({ doubt, onDelete }) => {
  const isResolved = doubt.status === 'resolved';
  return (
    <div className={`${isResolved ? 'bg-white/80' : 'bg-black'} rounded-xl shadow-lg flex flex-col md:flex-row overflow-hidden mb-6`}>
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          <h3 className={`text-xl font-bold mb-2 ${isResolved ? 'text-leaf' : 'text-white'}`}>{doubt.title}</h3>
          <p className={`mb-2 ${isResolved ? 'text-leaf' : 'text-white'}`}>{doubt.description}</p>
          <div className="flex items-center space-x-4 text-sm mb-2">
            <span className={isResolved ? 'text-leaf' : 'text-white'}>Status: <span className={doubt.status === 'open' ? 'text-yellow-400' : 'text-green-400'}>{doubt.status}</span></span>
            <span className={isResolved ? 'text-leaf' : 'text-white'}>Posted: {new Date(doubt.createdAt).toLocaleString()}</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-2">
            <Link to={`/doubt/${doubt._id}`} className={`px-4 py-2 bg-accent ${isResolved ? 'text-leaf border border-leaf' : 'text-white border border-white'} hover:text-black rounded-lg font-semibold hover:bg-green-300 transition`}>Chats</Link>
            {onDelete && (
              <button onClick={() => onDelete(doubt._id)} className="px-3 py-2 border border-red-500 text-red-500 rounded-lg font-semibold hover:bg-red-500 hover:text-white transition">Delete</button>
            )}
          </div>
          {doubt.status === 'open' && (
            <span className="px-3 py-1 bg-yellow-400 text-black rounded-lg text-xs">open</span>
          )}
          {doubt.status === 'resolved' && (
            <span className="px-3 py-1 bg-green-400 text-black rounded-lg text-xs">Resolved</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDoubtCard; 