// Storage utility functions for localStorage

import {
  PlayerSettings,
  PlaybackHistoryEntry,
  BookmarkedTimestamp,
} from '../types';

const STORAGE_KEYS = {
  SETTINGS: 'youtube_player_settings',
  HISTORY: 'youtube_player_history',
  BOOKMARKS: 'youtube_player_bookmarks',
};

// Settings
export const loadSettings = (): PlayerSettings => {
  const defaultSettings: PlayerSettings = {
    theme: 'dark',
    accentColor: '#0ea5e9',
    autoplay: false,
    loop: false,
    muted: false,
    volume: 1,
    playbackSpeed: 1,
    quality: 'auto',
    showControls: true,
    playerSize: 'normal',
    saveHistory: true,
    subtitles: false,
  };

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (stored) {
      return { ...defaultSettings, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }

  return defaultSettings;
};

export const saveSettings = (settings: Partial<PlayerSettings>): void => {
  try {
    const current = loadSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

// Playback History
export const loadPlaybackHistory = (): PlaybackHistoryEntry[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading history:', error);
  }

  return [];
};

export const addToPlaybackHistory = (
  entry: Omit<PlaybackHistoryEntry, 'lastWatched' | 'currentTime' | 'completed'>
): void => {
  try {
    const history = loadPlaybackHistory();
    const existingIndex = history.findIndex((h) => h.id === entry.id);

    const newEntry: PlaybackHistoryEntry = {
      ...entry,
      lastWatched: Date.now(),
      currentTime: 0,
      completed: false,
    };

    if (existingIndex >= 0) {
      history.splice(existingIndex, 1);
    }

    history.unshift(newEntry);

    // Keep only last 50 videos
    if (history.length > 50) {
      history.pop();
    }

    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  } catch (error) {
    console.error('Error adding to history:', error);
  }
};

export const updatePlaybackHistory = (
  videoId: string,
  currentTime: number,
  completed: boolean
): void => {
  try {
    const history = loadPlaybackHistory();
    const entry = history.find((h) => h.id === videoId);

    if (entry) {
      entry.lastWatched = Date.now();
      entry.currentTime = currentTime;
      entry.completed = completed;
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    }
  } catch (error) {
    console.error('Error updating history:', error);
  }
};

export const clearPlaybackHistory = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  } catch (error) {
    console.error('Error clearing history:', error);
  }
};

// Bookmarks
export const loadBookmarks = (): BookmarkedTimestamp[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading bookmarks:', error);
  }

  return [];
};

export const addBookmark = (
  videoId: string,
  timestamp: number,
  title: string
): BookmarkedTimestamp => {
  try {
    const bookmarks = loadBookmarks();
    const newBookmark: BookmarkedTimestamp = {
      id: `${videoId}_${timestamp}`,
      videoId,
      timestamp,
      title,
      createdAt: Date.now(),
    };

    bookmarks.push(newBookmark);
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));

    return newBookmark;
  } catch (error) {
    console.error('Error adding bookmark:', error);
    throw error;
  }
};

export const removeBookmark = (bookmarkId: string): void => {
  try {
    const bookmarks = loadBookmarks();
    const filtered = bookmarks.filter((b) => b.id !== bookmarkId);
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing bookmark:', error);
  }
};

export const getVideoBookmarks = (videoId: string): BookmarkedTimestamp[] => {
  const bookmarks = loadBookmarks();
  return bookmarks.filter((b) => b.videoId === videoId);
};
