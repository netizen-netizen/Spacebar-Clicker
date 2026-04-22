import React, { useState } from 'react';
import { Player } from './components/Player';
import { URLInput } from './components/URLInput';
import { Menu, X, Github } from 'lucide-react';
import { usePlayerSettings } from './hooks/usePlayerSettings';

function App() {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [videoTitle, setVideoTitle] = useState('YouTube Player');
  const { settings } = usePlayerSettings();

  return (
    <div className={`min-h-screen transition-colors ${
      settings.theme === 'dark'
        ? 'bg-gray-900 text-white'
        : 'bg-gray-100 text-gray-900'
    }`}>
      {/* Header */}
      <header className={`border-b ${
        settings.theme === 'dark'
          ? 'border-gray-800 bg-gray-950'
          : 'border-gray-300 bg-white'
      } sticky top-0 z-40`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className={`p-2 rounded transition ${
                settings.theme === 'dark'
                  ? 'hover:bg-gray-800'
                  : 'hover:bg-gray-200'
              }`}
            >
              {showSidebar ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            <h1 className="text-2xl font-bold">🎬 YouTube Player</h1>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`p-2 rounded transition ${
              settings.theme === 'dark'
                ? 'hover:bg-gray-800'
                : 'hover:bg-gray-200'
            }`}
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-6">
        {/* Sidebar */}
        {showSidebar && (
          <div className={`w-80 flex-shrink-0 ${
            settings.theme === 'dark'
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-300'
          } rounded-lg border p-6 space-y-6 h-fit`}>
            <div>
              <h2 className="text-lg font-bold mb-4">Load Video</h2>
              <URLInput
                onSubmit={setVideoId}
                loading={false}
              />
            </div>

            {/* Info */}
            <div className={`p-4 rounded text-sm ${
              settings.theme === 'dark'
                ? 'bg-gray-700 text-gray-200'
                : 'bg-gray-200 text-gray-700'
            }`}>
              <p className="font-medium mb-2">💡 Tips</p>
              <ul className="space-y-1 text-xs list-disc list-inside">
                <li>Paste YouTube URL or video ID</li>
                <li>Use keyboard shortcuts (press ? for help)</li>
                <li>Customize appearance in settings</li>
                <li>Bookmarks saved locally</li>
              </ul>
            </div>

            {/* Keyboard Shortcuts Preview */}
            <div className={`p-4 rounded text-sm ${
              settings.theme === 'dark'
                ? 'bg-gray-700'
                : 'bg-gray-200'
            }`}>
              <p className="font-medium mb-2">⌨️ Quick Keys</p>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span>Play/Pause:</span>
                  <span className="font-mono">Space</span>
                </div>
                <div className="flex justify-between">
                  <span>Seek:</span>
                  <span className="font-mono">← →</span>
                </div>
                <div className="flex justify-between">
                  <span>Volume:</span>
                  <span className="font-mono">↑ ↓</span>
                </div>
                <div className="flex justify-between">
                  <span>Fullscreen:</span>
                  <span className="font-mono">F</span>
                </div>
              </div>
            </div>

            {/* Version Info */}
            <div className={`text-xs text-center ${
              settings.theme === 'dark'
                ? 'text-gray-500'
                : 'text-gray-600'
            }`}>
              <p>YouTube Player v1.0.0</p>
              <p>Advanced video controls & customization</p>
            </div>
          </div>
        )}

        {/* Player Area */}
        <div className="flex-1 min-w-0">
          <Player
            videoId={videoId}
            onTitleChange={setVideoTitle}
          />

          {!videoId && (
            <div className={`mt-8 p-8 rounded-lg border-2 border-dashed text-center ${
              settings.theme === 'dark'
                ? 'border-gray-700 bg-gray-800'
                : 'border-gray-300 bg-gray-100'
            }`}>
              <div className="text-6xl mb-4">🎥</div>
              <h2 className="text-2xl font-bold mb-2">Welcome to YouTube Player</h2>
              <p className={`mb-6 ${
                settings.theme === 'dark'
                  ? 'text-gray-400'
                  : 'text-gray-600'
              }`}>
                Paste a YouTube URL or video ID in the sidebar to get started
              </p>
              <div className={`inline-block p-4 rounded-lg ${
                settings.theme === 'dark'
                  ? 'bg-gray-700'
                  : 'bg-white border'
              }`}>
                <p className="text-sm mb-2">Example URLs:</p>
                <ul className="text-xs space-y-1 text-gray-400">
                  <li>https://www.youtube.com/watch?v=dQw4w9WgXcQ</li>
                  <li>https://youtu.be/dQw4w9WgXcQ</li>
                  <li>dQw4w9WgXcQ</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className={`border-t ${
        settings.theme === 'dark'
          ? 'border-gray-800 bg-gray-950'
          : 'border-gray-300 bg-gray-100'
      } mt-12 py-8`}>
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <p className={
            settings.theme === 'dark'
              ? 'text-gray-400'
              : 'text-gray-600'
          }>
            Advanced YouTube Video Player • Built with React, Vite & Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
