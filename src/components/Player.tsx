import React, { useEffect, useState } from 'react';
import { useYouTubePlayer } from '../hooks/useYouTubePlayer';
import { usePlayerSettings } from '../hooks/usePlayerSettings';
import { usePlaybackHistory } from '../hooks/usePlaybackHistory';
import { PlayerControls } from './PlayerControls';
import { SettingsPanel } from './SettingsPanel';
import { PlaybackHistory } from './PlaybackHistory';
import { BookmarksList } from './BookmarksList';
import { handleKeyboardShortcuts, KEYBOARD_HELP } from '../utils/keyboard';
import { getThumbnailUrl } from '../utils/youtube';
import { HelpCircle, X } from 'lucide-react';

interface PlayerProps {
  videoId: string | null;
  onTitleChange: (title: string) => void;
}

export const Player: React.FC<PlayerProps> = ({ videoId, onTitleChange }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [bookmarkTitle, setBookmarkTitle] = useState('');

  const {
    playerState,
    togglePlayPause,
    seek,
    setVolume,
    toggleMute,
    setPlaybackSpeed,
    toggleFullscreen,
  } = useYouTubePlayer(videoId, 'youtube-player');

  const {
    settings,
    updateTheme,
    updateAccentColor,
    updatePlayerSize,
    toggleAutoplay,
    toggleLoop,
    toggleControls,
    toggleSaveHistory,
    toggleSubtitles,
  } = usePlayerSettings();

  const {
    history,
    bookmarks,
    addVideoToHistory,
    updateVideoProgress,
    clearHistory,
    addBookmarkToVideo,
    deleteBookmark,
    getBookmarksForVideo,
  } = usePlaybackHistory();

  // Add video to history when loaded
  useEffect(() => {
    if (videoId && settings.saveHistory) {
      const thumbnail = getThumbnailUrl(videoId);
      addVideoToHistory({
        id: videoId,
        url: `https://youtube.com/watch?v=${videoId}`,
        title: playerState.videoTitle || `Video ${videoId}`,
        duration: playerState.duration,
        thumbnail,
        addedAt: Date.now(),
      });
    }
  }, [videoId]);

  // Update progress periodically
  useEffect(() => {
    if (videoId && settings.saveHistory && playerState.currentTime > 0) {
      const interval = setInterval(() => {
        updateVideoProgress(
          videoId,
          playerState.currentTime,
          playerState.currentTime >= playerState.duration * 0.9
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [videoId, playerState.currentTime, playerState.duration, settings.saveHistory]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      handleKeyboardShortcuts(e, {
        onPlayPause: togglePlayPause,
        onSeek: seek,
        onVolumeChange: (delta) => setVolume(playerState.volume + delta * 10),
        onMute: toggleMute,
        onSpeedChange: (delta) => {
          const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
          const currentIndex = speeds.indexOf(playerState.playbackSpeed);
          let newIndex = currentIndex + (delta > 0 ? 1 : -1);
          newIndex = Math.max(0, Math.min(speeds.length - 1, newIndex));
          setPlaybackSpeed(speeds[newIndex]);
        },
        onFullscreen: toggleFullscreen,
        onBookmark: () => setBookmarkTitle('Bookmark'),
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerState, togglePlayPause, seek, setVolume, toggleMute, setPlaybackSpeed, toggleFullscreen]);

  const handleAddBookmark = () => {
    if (videoId && bookmarkTitle.trim()) {
      addBookmarkToVideo(videoId, playerState.currentTime, bookmarkTitle.trim());
      setBookmarkTitle('');
    }
  };

  const sizeClass =
    settings.playerSize === 'theater'
      ? 'max-w-full'
      : settings.playerSize === 'minimal'
      ? 'max-w-md'
      : 'max-w-4xl';

  return (
    <div className={`w-full ${sizeClass} mx-auto space-y-4`}>
      {/* Video Container */}
      <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl aspect-video">
        {videoId ? (
          <div id="youtube-player" className="w-full h-full" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <div className="text-center">
              <div className="text-6xl mb-4">🎬</div>
              <p className="text-gray-400">Load a video to get started</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls - Only show if settings allow it */}
      {settings.showControls && videoId && (
        <PlayerControls
          playerState={playerState}
          onPlayPause={togglePlayPause}
          onSeek={seek}
          onVolumeChange={setVolume}
          onToggleMute={toggleMute}
          onSpeedChange={setPlaybackSpeed}
          onFullscreen={toggleFullscreen}
          onSettings={() => setShowSettings(true)}
          onBookmark={() => setBookmarkTitle(`${playerState.currentTime}`)}
          onHelp={() => setShowHelp(true)}
        />
      )}

      {/* Modals */}
      {showSettings && (
        <SettingsPanel
          settings={settings}
          onClose={() => setShowSettings(false)}
          onThemeChange={updateTheme}
          onAccentColorChange={updateAccentColor}
          onAutoplayChange={toggleAutoplay}
          onLoopChange={toggleLoop}
          onPlayerSizeChange={updatePlayerSize}
          onControlsChange={toggleControls}
          onHistoryChange={toggleSaveHistory}
          onSubtitlesChange={toggleSubtitles}
        />
      )}

      {showHistory && (
        <PlaybackHistory
          history={history}
          onSelectVideo={(videoId) => {
            // This would need to be passed up to parent component
            setShowHistory(false);
          }}
          onClearHistory={clearHistory}
          onClose={() => setShowHistory(false)}
        />
      )}

      {showBookmarks && (
        <BookmarksList
          bookmarks={bookmarks}
          currentVideoId={videoId}
          onSelectTimestamp={(timestamp) => {
            seek(timestamp);
            setShowBookmarks(false);
          }}
          onDeleteBookmark={deleteBookmark}
          onClose={() => setShowBookmarks(false)}
        />
      )}

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                Keyboard Shortcuts
              </h2>
              <button
                onClick={() => setShowHelp(false)}
                className="p-1 hover:bg-gray-700 rounded transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(90vh-60px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {KEYBOARD_HELP.map((shortcut) => (
                  <div key={shortcut.key} className="flex gap-3">
                    <div className="px-3 py-1 rounded bg-gray-700 text-sm font-medium text-primary-400 whitespace-nowrap">
                      {shortcut.key}
                    </div>
                    <div className="text-gray-300 text-sm flex items-center">
                      {shortcut.action}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
