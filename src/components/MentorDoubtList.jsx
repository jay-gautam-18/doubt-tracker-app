import React from 'react';
import MentorDoubtCard from './MentorDoubtCard';
import { FaChevronDown } from 'react-icons/fa';

const MentorDoubtList = ({ doubts, onComment, onResolve, filter, setFilter, loading, page, totalPages, onPageChange }) => {
  return (
    <div>
      <div className="mb-4 flex items-center space-x-4">
        <label className="mr-2 text-black">Filter by status: </label>
        <div className="relative">
          <select value={filter} onChange={e => setFilter(e.target.value)} className="border rounded px-2 py-1 bg-black text-white appearance-none focus:outline-none focus:ring-2 focus:ring-accent pr-8">
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="resolved">Resolved</option>
          </select>
          <FaChevronDown className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 text-white text-base" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {doubts.length === 0 && <p className="text-muted">No doubts found.</p>}
        {doubts.map(doubt => (
          <MentorDoubtCard key={doubt._id} doubt={doubt} onComment={onComment} onResolve={onResolve} loading={loading} />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <button onClick={() => onPageChange(page - 1)} disabled={page === 1} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">Prev</button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => onPageChange(idx + 1)}
              className={`px-3 py-1 rounded ${page === idx + 1 ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            >
              {idx + 1}
            </button>
          ))}
          <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  );
};

export default MentorDoubtList; 