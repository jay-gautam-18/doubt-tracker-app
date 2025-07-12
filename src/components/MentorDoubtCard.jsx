import React from 'react';

const MentorDoubtCard = ({ doubt, onComment, onResolve, loading }) => {
  const isResolved = doubt.status === 'resolved';
  return (
    <div className={`${isResolved ? 'bg-black' : 'bg-card'} rounded-xl shadow-lg flex flex-col md:flex-row overflow-hidden mb-6`}>
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          <h3 className={`text-xl font-bold mb-2 ${isResolved ? 'text-white' : 'text-accent'}`}>{doubt.title}</h3>
          <p className={`mb-2 ${isResolved ? 'text-white' : 'text-muted'}`}>{doubt.description}</p>
          <div className="flex items-center space-x-4 text-sm mb-2">
            <span className={isResolved ? 'text-white' : 'text-muted'}>Status: <span className={doubt.status === 'open' ? 'text-yellow-400' : 'text-green-400'}>{doubt.status}</span></span>
            <span className={isResolved ? 'text-white' : 'text-muted'}>Posted: {new Date(doubt.createdAt).toLocaleString()}</span>
            <span className={isResolved ? 'text-white' : 'text-muted'}>By: {doubt.user?.name}</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <button onClick={() => onComment(doubt)} className={`px-4 py-2 bg-accent ${isResolved ? 'text-white border border-white' : 'text-dark'} rounded-lg font-semibold hover:bg-green-300 transition`}>Chat</button>
          {doubt.status === 'open' && (
            <button onClick={() => onResolve(doubt._id)} disabled={loading} className="px-4 py-2 bg-yellow-400 text-xs text-dark rounded-lg font-semibold">Mark as Resolved</button>
          )}
          {doubt.status === 'resolved' && (
            <span className="px-3 py-1 bg-green-400 text-black rounded-lg text-xs">Resolved</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorDoubtCard; 