import { useState, useCallback, useEffect } from 'react';
import {
  PlaybackHistoryEntry,
  BookmarkedTimestamp,
} from '../types';
import {
  loadPlaybackHistory,
  addToPlaybackHistory,
  updatePlaybackHistory,
  clearPlaybackHistory,
  addBookmark,
  removeBookmark,
  loadBookmarks,
  getVideoBookmarks,
} from '../utils/storage';

export const usePlaybackHistory = () => {
  const [history, setHistory] = useState<PlaybackHistoryEntry[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkedTimestamp[]>([]);

  // Load history on mount
  useEffect(() => {
    setHistory(loadPlaybackHistory());
    setBookmarks(loadBookmarks());
  }, []);

  const addVideoToHistory = useCallback(
    (entry: Omit<PlaybackHistoryEntry, 'lastWatched' | 'currentTime' | 'completed'>) => {
      addToPlaybackHistory(entry);
      setHistory(loadPlaybackHistory());
    },
    []
  );

  const updateVideoProgress = useCallback(
    (videoId: string, currentTime: number, completed: boolean = false) => {
      updatePlaybackHistory(videoId, currentTime, completed);
      setHistory(loadPlaybackHistory());
    },
    []
  );

  const clearHistory = useCallback(() => {
    clearPlaybackHistory();
    setHistory([]);
  }, []);

  const getVideoHistory = useCallback((videoId: string) => {
    return history.find((h) => h.id === videoId);
  }, [history]);

  // Bookmark functions
  const addBookmarkToVideo = useCallback(
    (videoId: string, timestamp: number, title: string) => {
      const bookmark = addBookmark(videoId, timestamp, title);
      setBookmarks(loadBookmarks());
      return bookmark;
    },
    []
  );

  const deleteBookmark = useCallback((bookmarkId: string) => {
    removeBookmark(bookmarkId);
    setBookmarks(loadBookmarks());
  }, []);

  const getBookmarksForVideo = useCallback(
    (videoId: string) => {
      return getVideoBookmarks(videoId);
    },
    []
  );

  return {
    history,
    bookmarks,
    addVideoToHistory,
    updateVideoProgress,
    clearHistory,
    getVideoHistory,
    addBookmarkToVideo,
    deleteBookmark,
    getBookmarksForVideo,
  };
};
