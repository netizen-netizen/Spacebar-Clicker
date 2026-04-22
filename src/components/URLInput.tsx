import React, { useState } from 'react';
import { AlertCircle, Link as LinkIcon } from 'lucide-react';
import { isValidYouTubeUrl, extractVideoId } from '../utils/youtube';

interface URLInputProps {
  onSubmit: (videoId: string) => void;
  loading: boolean;
}

export const URLInput: React.FC<URLInputProps> = ({ onSubmit, loading }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Please enter a YouTube URL or video ID');
      return;
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      setError('Invalid YouTube URL or video ID');
      return;
    }

    onSubmit(videoId);
    setUrl('');
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError('');
              }}
              placeholder="Paste YouTube URL or video ID..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-primary-500 focus:outline-none transition"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Load'}
          </button>
        </div>
        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500 bg-opacity-10 p-3 rounded-lg border border-red-500 border-opacity-30">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </form>
    </div>
  );
};
