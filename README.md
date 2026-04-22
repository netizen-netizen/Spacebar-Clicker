# 🎬 Advanced YouTube Video Player

A highly customizable, production-ready YouTube video player built with React, Vite, and TypeScript. Features advanced controls, customization options, and local storage support for preferences and history.

## ✨ Features

### Core Player Features
- ▶️ **Play/Pause Controls** - Full playback control
- ⏹️ **Seek Bar** - Jump to any point with preview
- 🔊 **Volume Control** - Adjust volume with slider and mute toggle
- ⚡ **Playback Speed** - 0.25x to 2x speed control (+ custom speeds)
- 🎬 **Quality Selection** - Switch between available qualities
- 🖥️ **Fullscreen Mode** - Immersive viewing experience
- 🖼️ **Picture-in-Picture** - Float player on top of other windows (if supported)

### Customization Features
- 🌓 **Theme Switch** - Dark/Light modes
- 🎨 **Custom Accent Colors** - 8 preset colors to choose from
- 📏 **Player Size Modes** - Normal, Theater, and Minimal modes
- 🎮 **UI Customization** - Toggle controls on/off for minimal UI
- ⌨️ **Keyboard Shortcuts** - Comprehensive keyboard support

### Playback Features
- 🔁 **Loop Toggle** - Repeat video automatically
- ⏱️ **Start/End Time** - Clip playback capability
- 📚 **Subtitle Toggle** - Enable/disable captions (if available)
- 🎯 **Bookmarks** - Save favorite timestamps with custom titles
- 📜 **Playback History** - Track recently watched videos
- 💾 **Auto-Save Progress** - Remember where you left off

### Advanced Features
- 🕐 **Intelligent Time Display** - Format times correctly (HH:MM:SS)
- 🔗 **Smart URL Parsing** - Support multiple YouTube URL formats
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎯 **Local Storage** - All preferences saved locally (no external data collection)
- ⚡ **Performance Optimized** - Built with Vite for fast loading

## 🚀 Quick Start

### Prerequisites
- Node.js 16.x or higher
- npm or yarn

### Installation

```bash
# Clone or download the project
cd youtube-player

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open in your browser at `http://localhost:3000`

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📖 Usage

### Loading a Video

1. **Paste a YouTube URL** in the sidebar:
   - `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
   - `https://youtu.be/dQw4w9WgXcQ`
   - Or just the video ID: `dQw4w9WgXcQ`

2. **Click "Load"** or press Enter
3. **Video will appear** in the player

### Basic Controls

| Control | Action |
|---------|--------|
| Click Play/Pause Button | Play or pause video |
| Drag Seek Bar | Jump to any time |
| Volume Slider | Adjust volume |
| Mute Button | Toggle mute |
| Speed Selector | Change playback speed |
| Settings | Open customization panel |
| Fullscreen | Enter fullscreen mode |

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **Space / K** | Play/Pause |
| **→ / J** | Seek forward 5s |
| **← / L** | Seek backward 5s |
| **Shift + →** | Seek forward 10s |
| **Shift + ←** | Seek backward 10s |
| **↑ / +** | Volume up |
| **↓ / -** | Volume down |
| **M** | Mute/Unmute |
| **F** | Fullscreen |
| **>** | Increase speed |
| **<** | Decrease speed |
| **B** | Add bookmark |
| **?** | Show help |

### Customization

#### Theme & Appearance
- Click **Settings** → **Appearance**
- Choose Dark or Light theme
- Select from 8 accent colors
- Pick player size (Normal, Theater, Minimal)

#### Playback Options
- Click **Settings** → **Playback**
- Enable/disable autoplay
- Toggle loop playback
- Show/hide controls
- Enable subtitles (if available)

#### Privacy Settings
- Click **Settings** → **Privacy**
- Toggle watch history saving
- All data is stored locally in your browser

### Bookmarks

Save important timestamps in videos:

1. Click the **Bookmark** button or press **B**
2. Enter a title for the bookmark
3. Access bookmarks from the **Bookmarks** modal
4. Click a bookmark to jump to that time
5. Delete bookmarks with the trash icon

### Watch History

Track your recently watched videos:

1. Click the **History** button
2. View all watched videos with timestamps
3. Click a video to load it again
4. Clear entire history if needed

## 🏗️ Project Structure

```
youtube-player/
├── src/
│   ├── components/
│   │   ├── Player.tsx              # Main player component
│   │   ├── PlayerControls.tsx      # Control bar UI
│   │   ├── URLInput.tsx            # URL input form
│   │   ├── SettingsPanel.tsx       # Settings modal
│   │   ├── PlaybackHistory.tsx     # History modal
│   │   └── BookmarksList.tsx       # Bookmarks modal
│   ├── hooks/
│   │   ├── useYouTubePlayer.ts     # Player state & controls
│   │   ├── usePlayerSettings.ts    # Settings management
│   │   └── usePlaybackHistory.ts   # History & bookmarks
│   ├── utils/
│   │   ├── youtube.ts             # YouTube utilities
│   │   ├── storage.ts             # LocalStorage management
│   │   └── keyboard.ts            # Keyboard shortcuts
│   ├── types/
│   │   └── index.ts               # TypeScript types
│   ├── App.tsx                    # Main app component
│   ├── main.tsx                   # React entry point
│   └── index.css                  # Global styles
├── index.html                     # HTML entry point
├── package.json                   # Dependencies & scripts
├── tsconfig.json                  # TypeScript config
├── vite.config.ts                 # Vite config
├── tailwind.config.js             # Tailwind CSS config
├── postcss.config.js              # PostCSS config
└── README.md                      # This file
```

## 🛠️ Technologies

- **React 18** - UI library
- **Vite** - Lightning-fast build tool
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **YouTube IFrame API** - Video playback engine

## 🎨 Customization Options

### Accent Colors
- Blue (default) - #0ea5e9
- Purple - #a855f7
- Pink - #ec4899
- Red - #ef4444
- Orange - #f97316
- Yellow - #eab308
- Green - #22c55e
- Teal - #14b8a6

### Player Sizes
- **Normal** - Standard responsive size
- **Theater** - Full width, smaller height
- **Minimal** - Compact view for small screens

### Themes
- **Dark** - Easy on the eyes, great for video watching
- **Light** - Clean and modern look

## 💾 Data Storage

All user data is stored locally in your browser's localStorage:

- **Settings** - Theme, colors, autoplay preferences
- **Watch History** - Recently watched videos (up to 50)
- **Bookmarks** - Saved timestamps for videos

**Privacy-Friendly**: No data is sent to external servers. Everything stays on your device.

## 🔧 Troubleshooting

### Video Won't Load
- Verify the YouTube URL is correct
- Check that the video isn't region-blocked
- Ensure YouTube IFrame API is accessible

### Controls Not Working
- Refresh the page
- Clear browser cache
- Try a different browser

### Bookmarks/History Not Saving
- Enable localStorage in browser settings
- Check that private/incognito mode is disabled
- Try clearing browser cache

## 📦 Building for Distribution

### Development Build
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

Output goes to `dist/` folder. Deploy the `dist` folder to any static hosting:
- Netlify
- Vercel
- GitHub Pages
- Any web server

## 🤝 Contributing

Feel free to fork and improve!

Potential improvements:
- Add playlist support
- Implement custom player themes
- Add video download (where allowed)
- Multi-language support
- Advanced analytics

## 📄 License

MIT License - Use freely for personal and commercial projects

## 🙏 Acknowledgments

- YouTube for the IFrame API
- React team for the excellent framework
- Tailwind CSS for beautiful styling
- Vite for amazing build performance

## 🐛 Known Limitations

- Quality selection depends on YouTube API availability
- Some videos may have embedding restrictions
- Picture-in-Picture support varies by browser
- Subtitles availability depends on video content

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review browser console for errors
3. Verify YouTube URL format
4. Try clearing browser cache

---

**Made with ❤️ using React, Vite & TypeScript**

Enjoy your enhanced YouTube viewing experience! 🎉
