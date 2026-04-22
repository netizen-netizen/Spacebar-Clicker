// Types for YouTube Player App

export interface PlayerSettings {
  theme: 'light' | 'dark';
  accentColor: string;
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
  volume: number;
  playbackSpeed: number;
  quality: string;
  showControls: boolean;
  playerSize: 'normal' | 'theater' | 'minimal';
  saveHistory: boolean;
  subtitles: boolean;
}

export interface VideoData {
  id: string;
  url: string;
  title: string;
  duration: number;
  thumbnail: string;
  addedAt: number;
}

export interface BookmarkedTimestamp {
  id: string;
  videoId: string;
  timestamp: number;
  title: string;
  createdAt: number;
}

export interface PlaybackHistoryEntry extends VideoData {
  lastWatched: number;
  currentTime: number;
  completed: boolean;
}

export interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  isPIP: boolean;
  playbackSpeed: number;
  quality: string;
  videoId: string | null;
  videoTitle: string;
  isLoading: boolean;
  error: string | null;
}

export interface UIMode {
  showSidebar: boolean;
  showSettings: boolean;
  showHistory: boolean;
  showBookmarks: boolean;
  theaterMode: boolean;
  minimalMode: boolean;
}
