export interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  setVolume(volume: number): void;
}

interface YT {
  Player: {
    new (
      element: HTMLIFrameElement,
      config: {
        events?: {
          onReady?: (event: { target: YTPlayer }) => void;
          onError?: () => void;
        };
        playerVars?: {
          autoplay?: 0 | 1;
          controls?: 0 | 1;
          modestbranding?: 0 | 1;
          playlist?: string;
        };
      }
    ): YTPlayer;
  };
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: YT;
  }
}

export {}; 