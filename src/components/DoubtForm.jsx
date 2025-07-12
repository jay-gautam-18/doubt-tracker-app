import React, { useState } from 'react';

const DoubtForm = ({ onSubmit, initial = {}, loading }) => {
  const [title, setTitle] = useState(initial.title || '');
  const [description, setDescription] = useState(initial.description || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, description });
    setTitle('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Type of doubt "
        required
        className="w-full border rounded px-3 py-2"
      />
      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Mention your doubt"
        required
        className="w-full border rounded px-3 py-2"
      />
      <button type="submit" disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50">
        {loading ? 'Saving...' : 'Submit'}
      </button>
    </form>
  );
};

export default DoubtForm; 