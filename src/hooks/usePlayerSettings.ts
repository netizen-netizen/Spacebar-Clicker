import { useState, useCallback, useEffect } from 'react';
import { PlayerSettings } from '../types';
import {
  loadSettings,
  saveSettings,
} from '../utils/storage';

export const usePlayerSettings = () => {
  const [settings, setSettings] = useState<PlayerSettings>(() =>
    loadSettings()
  );

  const updateSettings = useCallback((newSettings: Partial<PlayerSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      saveSettings(updated);
      return updated;
    });
  }, []);

  const updateTheme = useCallback((theme: 'light' | 'dark') => {
    updateSettings({ theme });

    // Update DOM
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [updateSettings]);

  const updateAccentColor = useCallback((color: string) => {
    updateSettings({ accentColor: color });
    // Apply accent color to CSS variables if needed
    document.documentElement.style.setProperty('--accent-color', color);
  }, [updateSettings]);

  const updateVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    updateSettings({ volume: clampedVolume });
  }, [updateSettings]);

  const updatePlaybackSpeed = useCallback((speed: number) => {
    updateSettings({ playbackSpeed: speed });
  }, [updateSettings]);

  const updatePlayerSize = useCallback((size: 'normal' | 'theater' | 'minimal') => {
    updateSettings({ playerSize: size });
  }, [updateSettings]);

  const toggleAutoplay = useCallback(() => {
    updateSettings({ autoplay: !settings.autoplay });
  }, [settings.autoplay, updateSettings]);

  const toggleLoop = useCallback(() => {
    updateSettings({ loop: !settings.loop });
  }, [settings.loop, updateSettings]);

  const toggleMuted = useCallback(() => {
    updateSettings({ muted: !settings.muted });
  }, [settings.muted, updateSettings]);

  const toggleControls = useCallback(() => {
    updateSettings({ showControls: !settings.showControls });
  }, [settings.showControls, updateSettings]);

  const toggleSaveHistory = useCallback(() => {
    updateSettings({ saveHistory: !settings.saveHistory });
  }, [settings.saveHistory, updateSettings]);

  const toggleSubtitles = useCallback(() => {
    updateSettings({ subtitles: !settings.subtitles });
  }, [settings.subtitles, updateSettings]);

  // Apply theme on mount
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  return {
    settings,
    updateSettings,
    updateTheme,
    updateAccentColor,
    updateVolume,
    updatePlaybackSpeed,
    updatePlayerSize,
    toggleAutoplay,
    toggleLoop,
    toggleMuted,
    toggleControls,
    toggleSaveHistory,
    toggleSubtitles,
  };
};
