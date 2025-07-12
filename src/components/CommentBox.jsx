import React, { useState, useEffect } from 'react';
import api from '../utils/axios';
import { toast } from 'react-toastify';

const CommentBox = ({ doubtId, canComment }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    if (doubtId) fetchComments();
    // eslint-disable-next-line
  }, [doubtId, refresh]);

  const fetchComments = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/comments', { params: { doubtId } });
      setComments(res.data);
    } catch (err) {
      setError('Failed to fetch comments');
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/comments', { doubtId, content });
      setContent('');
      setRefresh(r => r + 1);
      toast.success('Comment posted');
    } catch (err) {
      setError('Failed to post comment');
      toast.error('Failed to post comment');
    }
    setLoading(false);
  };

  return (
    <div className="mt-6">
      <h4 className="font-semibold mb-4 text-accent text-lg">Comments</h4>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <ul className="space-y-2 mb-4">
        {comments.map(c => (
          <li key={c._id} className="bg-dark border border-card rounded px-4 py-3 flex items-center">
            <span className="font-bold text-accent mr-2">{c.createdBy?.name || 'Mentor'}:</span> <span className="text-muted">{c.content}</span>
          </li>
        ))}
      </ul>
      {canComment && (
        <form onSubmit={handleSubmit} className="flex space-x-2 mt-2">
          <input
            type="text"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Add a comment"
            required
            disabled={loading}
            className="flex-1 border border-card rounded px-3 py-2 bg-dark text-white"
          />
          <button type="submit" disabled={loading || !content} className="bg-accent text-dark px-4 py-2 rounded font-semibold disabled:opacity-50">
            {loading ? 'Posting...' : 'Post'}
          </button>
        </form>
      )}
    </div>
  );
};

export default CommentBox; 