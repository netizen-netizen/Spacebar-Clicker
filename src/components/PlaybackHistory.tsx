import React from 'react';
import { X, Trash2, Clock } from 'lucide-react';
import { PlaybackHistoryEntry } from '../types';
import { formatTime } from '../utils/youtube';

interface PlaybackHistoryProps {
  history: PlaybackHistoryEntry[];
  onSelectVideo: (videoId: string) => void;
  onClearHistory: () => void;
  onClose: () => void;
}

export const PlaybackHistory: React.FC<PlaybackHistoryProps> = ({
  history,
  onSelectVideo,
  onClearHistory,
  onClose,
}) => {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Watch History
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {history.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <p>No watch history yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="flex gap-3 p-3 hover:bg-gray-700 transition cursor-pointer group"
                  onClick={() => onSelectVideo(entry.id)}
                >
                  {/* Thumbnail */}
                  <img
                    src={entry.thumbnail}
                    alt={entry.title}
                    className="w-20 h-20 rounded object-cover flex-shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white truncate group-hover:text-primary-400 transition">
                      {entry.title}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {formatTime(entry.currentTime)} watched
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(entry.lastWatched)}
                    </p>
                    {entry.completed && (
                      <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded bg-green-500 bg-opacity-20 text-green-400">
                        Watched
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="border-t border-gray-700 p-4 flex gap-2">
            <button
              onClick={onClearHistory}
              className="flex-1 py-2 rounded bg-red-600 hover:bg-red-700 transition font-medium flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear History
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2 rounded bg-gray-700 hover:bg-gray-600 transition font-medium"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
