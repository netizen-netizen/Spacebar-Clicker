import { useState, useCallback, useEffect, useRef } from 'react';
import { PlayerState } from '../types';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export const useYouTubePlayer = (videoId: string | null, containerId: string) => {
  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 100,
    isMuted: false,
    isFullscreen: false,
    isPIP: false,
    playbackSpeed: 1,
    quality: 'auto',
    videoId,
    videoTitle: '',
    isLoading: false,
    error: null,
  });

  const playerRef = useRef<any>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  // Load YouTube API
  useEffect(() => {
    if (window.YT) {
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    document.body.appendChild(script);

    window.onYouTubeIframeAPIReady = () => {
      // API ready, player will be initialized when videoId changes
    };

    return () => {
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Initialize player when videoId changes
  useEffect(() => {
    if (!videoId || !window.YT) {
      return;
    }

    const initPlayer = () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }

      playerRef.current = new window.YT.Player(containerId, {
        videoId,
        width: '100%',
        height: '100%',
        playerVars: {
          autoplay: 0,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          iv_load_policy: 3,
        },
        events: {
          onReady: handlePlayerReady,
          onStateChange: handleStateChange,
          onError: handleError,
        },
      });
    };

    // Wait for YT API to be fully loaded
    const checkInterval = setInterval(() => {
      if (window.YT?.Player) {
        clearInterval(checkInterval);
        initPlayer();
      }
    }, 100);

    return () => clearInterval(checkInterval);
  }, [videoId, containerId]);

  const handlePlayerReady = useCallback(() => {
    setPlayerState((prev) => ({ ...prev, isLoading: false }));

    // Start updating current time
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (playerRef.current?.getCurrentTime) {
        const currentTime = playerRef.current.getCurrentTime();
        const duration = playerRef.current.getDuration();
        const isPlaying =
          playerRef.current.getPlayerState() ===
          window.YT.PlayerState.PLAYING;

        setPlayerState((prev) => ({
          ...prev,
          currentTime,
          duration,
          isPlaying,
        }));
      }
    }, 100);
  }, []);

  const handleStateChange = useCallback((event: any) => {
    const state = event.data;
    const isPlaying = state === window.YT.PlayerState.PLAYING;

    setPlayerState((prev) => ({
      ...prev,
      isPlaying,
      isLoading: state === window.YT.PlayerState.BUFFERING,
    }));
  }, []);

  const handleError = useCallback((event: any) => {
    const errorMessages: { [key: number]: string } = {
      2: 'Invalid parameter',
      5: 'HTML5 player error',
      100: 'Video not found',
      101: 'Video not allowed to be played embedded',
      150: 'Video not allowed to be played embedded',
    };

    const errorMessage = errorMessages[event.data] || 'Unknown error';
    setPlayerState((prev) => ({
      ...prev,
      error: errorMessage,
      isLoading: false,
    }));
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (playerRef.current?.destroy) {
        playerRef.current.destroy();
      }
    };
  }, []);

  // Player control methods
  const play = useCallback(() => {
    playerRef.current?.playVideo?.();
  }, []);

  const pause = useCallback(() => {
    playerRef.current?.pauseVideo?.();
  }, []);

  const togglePlayPause = useCallback(() => {
    if (playerState.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [playerState.isPlaying, play, pause]);

  const seek = useCallback((time: number) => {
    playerRef.current?.seekTo?.(time, true);
  }, []);

  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(100, volume));
    playerRef.current?.setVolume?.(clampedVolume);
    setPlayerState((prev) => ({ ...prev, volume: clampedVolume }));
  }, []);

  const toggleMute = useCallback(() => {
    if (playerState.isMuted) {
      playerRef.current?.unMute?.();
    } else {
      playerRef.current?.mute?.();
    }
    setPlayerState((prev) => ({ ...prev, isMuted: !prev.isMuted }));
  }, [playerState.isMuted]);

  const setPlaybackSpeed = useCallback((speed: number) => {
    playerRef.current?.setPlaybackRate?.(speed);
    setPlayerState((prev) => ({ ...prev, playbackSpeed: speed }));
  }, []);

  const getAvailableSpeeds = useCallback(() => {
    return playerRef.current?.getAvailablePlaybackRates?.() || [0.25, 0.5, 1, 1.5, 2];
  }, []);

  const getAvailableQualityLevels = useCallback(() => {
    return playerRef.current?.getAvailableQualityLevels?.() || [];
  }, []);

  const setQuality = useCallback((quality: string) => {
    playerRef.current?.setPlaybackQuality?.(quality);
    setPlayerState((prev) => ({ ...prev, quality }));
  }, []);

  const requestFullscreen = useCallback(() => {
    const element = document.getElementById(containerId);
    if (element?.requestFullscreen) {
      element.requestFullscreen().catch(() => {
        // Fullscreen request failed
      });
    }
    setPlayerState((prev) => ({ ...prev, isFullscreen: true }));
  }, [containerId]);

  const exitFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    setPlayerState((prev) => ({ ...prev, isFullscreen: false }));
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (playerState.isFullscreen) {
      exitFullscreen();
    } else {
      requestFullscreen();
    }
  }, [playerState.isFullscreen, requestFullscreen, exitFullscreen]);

  const requestPIP = useCallback(async () => {
    try {
      const video = document.querySelector(
        `#${containerId} iframe`
      ) as HTMLVideoElement;
      if (video && document.pictureInPictureEnabled) {
        await document.pictureInPictureElement ? document.exitPictureInPicture() : document.pictureInPictureElement;
        setPlayerState((prev) => ({ ...prev, isPIP: !prev.isPIP }));
      }
    } catch (error) {
      console.error('PIP error:', error);
    }
  }, [containerId]);

  return {
    playerState,
    playerRef,
    play,
    pause,
    togglePlayPause,
    seek,
    setVolume,
    toggleMute,
    setPlaybackSpeed,
    getAvailableSpeeds,
    getAvailableQualityLevels,
    setQuality,
    requestFullscreen,
    exitFullscreen,
    toggleFullscreen,
    requestPIP,
  };
};
