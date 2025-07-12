import React from 'react';

const DoubtList = ({ doubts, onEdit, onDelete, onResolve, loading }) => {
  if (!doubts.length) return <p>No doubts found.</p>;
  return (
    <ul className="space-y-4 mt-4">
      {doubts.map(doubt => (
        <li key={doubt._id} className="border rounded p-4">
          <h4 className="font-semibold">{doubt.title}</h4>
          <p>{doubt.description}</p>
          <p>Status: <span className={doubt.status === 'open' ? 'text-yellow-600' : 'text-green-600'}>{doubt.status}</span></p>
          <div className="space-x-2 mt-2">
            <button onClick={() => onEdit(doubt)} disabled={loading} className="px-2 py-1 bg-yellow-400 rounded">Edit</button>
            <button onClick={() => onDelete(doubt._id)} disabled={loading} className="px-2 py-1 bg-red-400 rounded">Delete</button>
            {doubt.status === 'open' && (
              <button onClick={() => onResolve(doubt._id)} disabled={loading} className="px-2 py-1 bg-green-500 text-white rounded">Mark as Resolved</button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default DoubtList; 