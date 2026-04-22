import React from 'react';
import { X, Trash2, Bookmark, Clock } from 'lucide-react';
import { BookmarkedTimestamp } from '../types';
import { formatTime } from '../utils/youtube';

interface BookmarksListProps {
  bookmarks: BookmarkedTimestamp[];
  onSelectTimestamp: (timestamp: number) => void;
  onDeleteBookmark: (bookmarkId: string) => void;
  onClose: () => void;
  currentVideoId?: string;
}

export const BookmarksList: React.FC<BookmarksListProps> = ({
  bookmarks,
  onSelectTimestamp,
  onDeleteBookmark,
  onClose,
  currentVideoId,
}) => {
  const currentBookmarks = currentVideoId
    ? bookmarks.filter((b) => b.videoId === currentVideoId)
    : bookmarks;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Bookmark className="w-5 h-5" />
            Bookmarks
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
          {currentBookmarks.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400 p-4 text-center">
              <p>
                {currentVideoId
                  ? 'No bookmarks for this video'
                  : 'No bookmarks yet'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {currentBookmarks.map((bookmark) => (
                <div
                  key={bookmark.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-700 transition group"
                >
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => onSelectTimestamp(bookmark.timestamp)}
                  >
                    <p className="font-medium text-white truncate group-hover:text-primary-400 transition">
                      {bookmark.title}
                    </p>
                    <p className="text-sm text-gray-400">
                      {formatTime(bookmark.timestamp)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(bookmark.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={() => onDeleteBookmark(bookmark.id)}
                    className="ml-2 p-1.5 hover:bg-red-600 rounded transition"
                    title="Delete bookmark"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-700 p-4">
          <button
            onClick={onClose}
            className="w-full py-2 rounded bg-gray-700 hover:bg-gray-600 transition font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
