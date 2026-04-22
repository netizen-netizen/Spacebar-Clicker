import React, { useState } from 'react';
import {
  X,
  Sun,
  Moon,
  Palette,
  Maximize2,
  Eye,
  History,
  MessageSquare,
} from 'lucide-react';
import { PlayerSettings } from '../types';

interface SettingsPanelProps {
  settings: PlayerSettings;
  onClose: () => void;
  onThemeChange: (theme: 'light' | 'dark') => void;
  onAccentColorChange: (color: string) => void;
  onAutoplayChange: () => void;
  onLoopChange: () => void;
  onPlayerSizeChange: (size: 'normal' | 'theater' | 'minimal') => void;
  onControlsChange: () => void;
  onHistoryChange: () => void;
  onSubtitlesChange: () => void;
}

const ACCENT_COLORS = [
  { name: 'Blue', value: '#0ea5e9' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Teal', value: '#14b8a6' },
];

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onClose,
  onThemeChange,
  onAccentColorChange,
  onAutoplayChange,
  onLoopChange,
  onPlayerSizeChange,
  onControlsChange,
  onHistoryChange,
  onSubtitlesChange,
}) => {
  const [activeTab, setActiveTab] = useState<'appearance' | 'playback' | 'privacy'>(
    'appearance'
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Settings</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          {['appearance', 'playback', 'privacy'].map((tab) => (
            <button
              key={tab}
              onClick={() =>
                setActiveTab(tab as 'appearance' | 'playback' | 'privacy')
              }
              className={`flex-1 py-3 text-sm font-medium transition capitalize ${
                activeTab === tab
                  ? 'border-b-2 border-primary-500 text-primary-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              {/* Theme */}
              <div>
                <label className="flex items-center gap-2 mb-3 text-sm font-medium">
                  {settings.theme === 'dark' ? (
                    <Moon className="w-4 h-4" />
                  ) : (
                    <Sun className="w-4 h-4" />
                  )}
                  Theme
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => onThemeChange('light')}
                    className={`flex-1 py-2 rounded transition ${
                      settings.theme === 'light'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Light
                  </button>
                  <button
                    onClick={() => onThemeChange('dark')}
                    className={`flex-1 py-2 rounded transition ${
                      settings.theme === 'dark'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Dark
                  </button>
                </div>
              </div>

              {/* Accent Color */}
              <div>
                <label className="flex items-center gap-2 mb-3 text-sm font-medium">
                  <Palette className="w-4 h-4" />
                  Accent Color
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {ACCENT_COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => onAccentColorChange(color.value)}
                      className="w-full h-8 rounded border-2 transition"
                      style={{
                        backgroundColor: color.value,
                        borderColor:
                          settings.accentColor === color.value
                            ? '#ffffff'
                            : 'transparent',
                      }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Player Size */}
              <div>
                <label className="flex items-center gap-2 mb-3 text-sm font-medium">
                  <Maximize2 className="w-4 h-4" />
                  Player Size
                </label>
                <div className="space-y-2">
                  {['normal', 'theater', 'minimal'].map((size) => (
                    <button
                      key={size}
                      onClick={() =>
                        onPlayerSizeChange(size as 'normal' | 'theater' | 'minimal')
                      }
                      className={`w-full py-2 rounded text-sm capitalize transition ${
                        settings.playerSize === size
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Playback Tab */}
          {activeTab === 'playback' && (
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-medium">Autoplay</span>
                <input
                  type="checkbox"
                  checked={settings.autoplay}
                  onChange={onAutoplayChange}
                  className="w-5 h-5 rounded accent-primary-600"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-medium">Loop Video</span>
                <input
                  type="checkbox"
                  checked={settings.loop}
                  onChange={onLoopChange}
                  className="w-5 h-5 rounded accent-primary-600"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-medium">Show Controls</span>
                <input
                  type="checkbox"
                  checked={settings.showControls}
                  onChange={onControlsChange}
                  className="w-5 h-5 rounded accent-primary-600"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-medium">Subtitles</span>
                <input
                  type="checkbox"
                  checked={settings.subtitles}
                  onChange={onSubtitlesChange}
                  className="w-5 h-5 rounded accent-primary-600"
                />
              </label>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-medium">Save Watch History</span>
                <input
                  type="checkbox"
                  checked={settings.saveHistory}
                  onChange={onHistoryChange}
                  className="w-5 h-5 rounded accent-primary-600"
                />
              </label>

              <div className="bg-gray-700 p-3 rounded text-xs text-gray-300">
                <p className="font-medium mb-1">Privacy Notice</p>
                <p>
                  Your preferences and watch history are stored locally in your browser.
                  No data is sent to external servers.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-700 p-4">
          <button
            onClick={onClose}
            className="w-full py-2 rounded bg-primary-600 hover:bg-primary-700 transition font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
