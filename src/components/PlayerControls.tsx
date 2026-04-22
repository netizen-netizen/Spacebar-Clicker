import React, { useState } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  BookmarkPlus,
  HelpCircle,
} from 'lucide-react';
import { PlayerState } from '../types';
import { formatTime } from '../utils/youtube';

interface PlayerControlsProps {
  playerState: PlayerState;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onSpeedChange: (speed: number) => void;
  onFullscreen: () => void;
  onSettings: () => void;
  onBookmark: () => void;
  onHelp: () => void;
  availableSpeeds?: number[];
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  playerState,
  onPlayPause,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onSpeedChange,
  onFullscreen,
  onSettings,
  onBookmark,
  onHelp,
  availableSpeeds = [0.25, 0.5, 1, 1.5, 2],
}) => {
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  const handleSeekBarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSeek(parseFloat(e.target.value));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onVolumeChange(parseFloat(e.target.value));
  };

  const progress = playerState.duration
    ? (playerState.currentTime / playerState.duration) * 100
    : 0;

  return (
    <div className="bg-gray-900 bg-opacity-90 backdrop-blur-sm p-3 space-y-2 rounded-lg">
      {/* Progress Bar */}
      <div className="group space-y-1 cursor-pointer">
        <input
          type="range"
          min="0"
          max={playerState.duration || 0}
          value={playerState.currentTime || 0}
          onChange={handleSeekBarChange}
          className="w-full h-1 bg-gray-700 rounded appearance-none cursor-pointer group-hover:h-2 transition-all accent-primary-600"
          style={{
            background: `linear-gradient(to right, rgb(59, 130, 246) 0%, rgb(59, 130, 246) ${progress}%, rgb(55, 65, 81) ${progress}%, rgb(55, 65, 81) 100%)`,
          }}
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>{formatTime(playerState.currentTime)}</span>
          <span>{formatTime(playerState.duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Play/Pause */}
          <button
            onClick={onPlayPause}
            className="p-2 hover:bg-gray-700 rounded transition"
            title={playerState.isPlaying ? 'Pause (Space)' : 'Play (Space)'}
          >
            {playerState.isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </button>

          {/* Volume Control */}
          <div className="flex items-center gap-1">
            <button
              onClick={onToggleMute}
              className="p-2 hover:bg-gray-700 rounded transition"
              title="Mute (M)"
            >
              {playerState.isMuted || playerState.volume === 0 ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={playerState.volume}
              onChange={handleVolumeChange}
              className="w-20 h-1 bg-gray-700 rounded appearance-none cursor-pointer accent-primary-600"
            />
          </div>

          {/* Time Display */}
          <span className="text-sm text-gray-300 ml-2 min-w-fit">
            {formatTime(playerState.currentTime)} / {formatTime(playerState.duration)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Speed Control */}
          <div className="relative">
            <button
              onClick={() => setShowSpeedMenu(!showSpeedMenu)}
              className="px-3 py-1 text-sm rounded bg-gray-700 hover:bg-gray-600 transition"
              title="Playback Speed"
            >
              {playerState.playbackSpeed.toFixed(2)}x
            </button>
            {showSpeedMenu && (
              <div className="absolute bottom-full right-0 mb-2 bg-gray-800 border border-gray-700 rounded shadow-lg z-10">
                {availableSpeeds.map((speed) => (
                  <button
                    key={speed}
                    onClick={() => {
                      onSpeedChange(speed);
                      setShowSpeedMenu(false);
                    }}
                    className={`block w-full px-4 py-2 text-sm text-left hover:bg-primary-600 transition ${
                      playerState.playbackSpeed === speed ? 'bg-primary-600' : ''
                    }`}
                  >
                    {speed.toFixed(2)}x
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bookmark */}
          <button
            onClick={onBookmark}
            className="p-2 hover:bg-gray-700 rounded transition"
            title="Bookmark (B)"
          >
            <BookmarkPlus className="w-5 h-5" />
          </button>

          {/* Settings */}
          <button
            onClick={onSettings}
            className="p-2 hover:bg-gray-700 rounded transition"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* Help */}
          <button
            onClick={onHelp}
            className="p-2 hover:bg-gray-700 rounded transition"
            title="Keyboard Shortcuts"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={onFullscreen}
            className="p-2 hover:bg-gray-700 rounded transition"
            title={playerState.isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
          >
            {playerState.isFullscreen ? (
              <Minimize className="w-5 h-5" />
            ) : (
              <Maximize className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
