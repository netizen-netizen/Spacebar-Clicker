// Keyboard shortcuts utility

export interface KeyboardHandler {
  onPlayPause: () => void;
  onSeek: (delta: number) => void;
  onVolumeChange: (delta: number) => void;
  onSpeedChange: (delta: number) => void;
  onFullscreen: () => void;
  onMute: () => void;
  onBookmark: () => void;
}

export const handleKeyboardShortcuts = (
  event: KeyboardEvent,
  handler: Partial<KeyboardHandler>
): void => {
  // Ignore if typing in input
  if (
    event.target instanceof HTMLInputElement ||
    event.target instanceof HTMLTextAreaElement
  ) {
    return;
  }

  const key = event.key.toLowerCase();
  const code = event.code;

  switch (true) {
    // Play/Pause (Space or K)
    case key === ' ' || key === 'k':
      event.preventDefault();
      handler.onPlayPause?.();
      break;

    // Seek forward (Right Arrow or J)
    case code === 'ArrowRight' || key === 'j':
      event.preventDefault();
      handler.onSeek?.(5);
      break;

    // Seek backward (Left Arrow or L)
    case code === 'ArrowLeft' || key === 'l':
      event.preventDefault();
      handler.onSeek?.(-5);
      break;

    // Fast forward (Shift + Right Arrow)
    case code === 'ArrowRight' && event.shiftKey:
      event.preventDefault();
      handler.onSeek?.(10);
      break;

    // Rewind (Shift + Left Arrow)
    case code === 'ArrowLeft' && event.shiftKey:
      event.preventDefault();
      handler.onSeek?.(-10);
      break;

    // Volume up (Up Arrow or +)
    case code === 'ArrowUp' || key === '+' || key === '=':
      event.preventDefault();
      handler.onVolumeChange?.(0.1);
      break;

    // Volume down (Down Arrow or -)
    case code === 'ArrowDown' || key === '-':
      event.preventDefault();
      handler.onVolumeChange?.(-0.1);
      break;

    // Mute/Unmute (M)
    case key === 'm':
      event.preventDefault();
      handler.onMute?.();
      break;

    // Fullscreen (F)
    case key === 'f':
      event.preventDefault();
      handler.onFullscreen?.();
      break;

    // Increase Speed (>)
    case key === '>':
      event.preventDefault();
      handler.onSpeedChange?.(0.25);
      break;

    // Decrease Speed (<)
    case key === '<':
      event.preventDefault();
      handler.onSpeedChange?.(-0.25);
      break;

    // Add Bookmark (B)
    case key === 'b':
      event.preventDefault();
      handler.onBookmark?.();
      break;

    default:
      break;
  }
};

export const KEYBOARD_HELP = [
  { key: 'Space / K', action: 'Play / Pause' },
  { key: 'Arrow Right / J', action: 'Seek forward 5s' },
  { key: 'Arrow Left / L', action: 'Seek backward 5s' },
  { key: 'Shift + Arrow Right', action: 'Seek forward 10s' },
  { key: 'Shift + Arrow Left', action: 'Seek backward 10s' },
  { key: 'Arrow Up / +', action: 'Volume up' },
  { key: 'Arrow Down / -', action: 'Volume down' },
  { key: 'M', action: 'Mute / Unmute' },
  { key: 'F', action: 'Fullscreen' },
  { key: '>', action: 'Increase speed' },
  { key: '<', action: 'Decrease speed' },
  { key: 'B', action: 'Add bookmark' },
];
