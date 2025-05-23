<script lang="ts">
  import { onMount } from 'svelte';
  import type { YTPlayer } from './youtube';

  export let onClose: () => void;
  
  let isPlaying = false;
  let showStatic = true;
  let volume = 0.5;
  let brightness = 1.0;
  let contrast = 1.0;
  let videoError = false;
  let iframeElement: HTMLIFrameElement;
  let player: YTPlayer | null = null;

  // YouTube playlist ID
  const playlistId = 'PLAL8n-gb1TGm4hkwZJV_XKsZA3vxXYhcG';
  const embedUrl = `https://www.youtube.com/embed/zdumpLhvqMU?list=${playlistId}&controls=0&modestbranding=1&autoplay=1&enablejsapi=1`;

  let windowPos = { 
    x: typeof window !== 'undefined' ? (window.innerWidth - 640) / 2 : 100,
    y: typeof window !== 'undefined' ? (window.innerHeight - 480) / 2 : 100
  };

  onMount(() => {
    // Initialize YouTube iframe API
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      player = new window.YT.Player(iframeElement, {
        events: {
          onReady: (event) => {
            event.target.setVolume(volume * 100);
            // Start playing when ready if power is on
            if (isPlaying) {
              event.target.playVideo();
            }
          },
          onError: () => {
            videoError = true;
            showStatic = true;
            isPlaying = false;
          }
        },
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          playlist: playlistId,
          rel: 0, // Don't show related videos
          iv_load_policy: 3 // Don't show video annotations
        }
      });
    };

    // Auto-turn on the TV after a brief delay
    setTimeout(() => {
      handlePowerToggle();
    }, 100); // Quick initial delay before auto-power on
  });

  function handlePowerToggle() {
    if (!isPlaying) {
      showStatic = true;
      setTimeout(() => {
        showStatic = false;
        if (player) {
          player.playVideo();
        }
        isPlaying = true;
      }, 800); // Reduced from 1500ms to 800ms for faster boot
    } else {
      showStatic = true;
      setTimeout(() => {
        if (player) {
          player.pauseVideo();
        }
        isPlaying = false;
      }, 300); // Reduced from 500ms to 300ms for faster shutdown
    }
  }

  function handleVolumeChange(event: Event) {
    const input = event.target as HTMLInputElement;
    volume = parseFloat(input.value);
    if (player) {
      player.setVolume(volume * 100);
    }
  }

  function handleBrightnessChange(event: Event) {
    const input = event.target as HTMLInputElement;
    brightness = parseFloat(input.value);
  }

  function handleContrastChange(event: Event) {
    const input = event.target as HTMLInputElement;
    contrast = parseFloat(input.value);
  }

  function handleMouseDown(event: MouseEvent) {
    if ((event.target as HTMLElement).closest('.title-bar')) {
      const startX = event.clientX - windowPos.x;
      const startY = event.clientY - windowPos.y;
      
      function handleMouseMove(e: MouseEvent) {
        windowPos = {
          x: e.clientX - startX,
          y: e.clientY - startY
        };
      }
      
      function handleMouseUp() {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      }
      
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
  }
</script>

<svelte:head>
  <script>
    // Type definition for YouTube IFrame API
    declare global {
      interface Window {
        onYouTubeIframeAPIReady: () => void;
        YT: any;
      }
    }
  </script>
</svelte:head>

<div
  class="window tv-window"
  style="
    position: fixed;
    left: {windowPos.x}px;
    top: {windowPos.y}px;
  "
  on:mousedown={handleMouseDown}
>
  <div class="title-bar">
    <div class="title-bar-text">
      📺 EncryptorTV - Classic Computing Channel
    </div>
    <div class="title-bar-controls">
      <button aria-label="Minimize"></button>
      <button aria-label="Maximize"></button>
      <button aria-label="Close" on:click={onClose}></button>
    </div>
  </div>

  <div class="window-body tv-body">
    <div class="tv-screen" style="filter: brightness({brightness}) contrast({contrast})">
      <div class="screen-content">
        <iframe
          bind:this={iframeElement}
          width="600"
          height="450"
          src={embedUrl}
          title="Classic Computing Videos"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
        {#if showStatic || videoError}
          <div class="static-overlay"></div>
          {#if videoError}
            <div class="error-message">No Signal</div>
          {/if}
        {/if}
        <div class="scan-lines"></div>
        <div class="vignette"></div>
      </div>
    </div>

    <div class="tv-controls">
      <div class="control-group">
        <button class="power-button" on:click={handlePowerToggle}>
          {isPlaying ? 'Turn Off' : 'Turn On'}
        </button>
      </div>

      <div class="control-group">
        <label>Volume</label>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.1" 
          value={volume}
          on:input={handleVolumeChange}
        />
      </div>

      <div class="control-group">
        <label>Brightness</label>
        <input 
          type="range" 
          min="0.5" 
          max="1.5" 
          step="0.1" 
          value={brightness}
          on:input={handleBrightnessChange}
        />
      </div>

      <div class="control-group">
        <label>Contrast</label>
        <input 
          type="range" 
          min="0.8" 
          max="1.2" 
          step="0.1" 
          value={contrast}
          on:input={handleContrastChange}
        />
      </div>
    </div>
  </div>
</div>

<style>
  .tv-window {
    width: 640px;
    background: var(--theme-window, #c0c0c0);
    box-shadow: var(--theme-window-shadow, 4px 4px 10px rgba(0, 0, 0, 0.5));
    border: 2px solid #000;
  }

  .tv-body {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .tv-screen {
    position: relative;
    width: 600px;
    height: 450px;
    background: #000;
    border: 8px solid #222;
    border-radius: 8px;
    overflow: hidden;
  }

  .screen-content {
    position: relative;
    width: 100%;
    height: 100%;
  }

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  .static-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/gif;base64,R0lGODlhCgAKAIAAAMzMzP///yH5BAEAAAEALAAAAAAKAAoAAAIRjI+py+0Po5y02ouz3rz7VgAAOw==');
    opacity: 0.3;
    pointer-events: none;
    animation: static 0.2s steps(4) infinite;
    z-index: 2;
  }

  .scan-lines {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      transparent 50%,
      rgba(0, 0, 0, 0.1) 51%
    );
    background-size: 100% 4px;
    pointer-events: none;
    z-index: 3;
  }

  .vignette {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      circle at center,
      transparent 60%,
      rgba(0, 0, 0, 0.4) 100%
    );
    pointer-events: none;
    z-index: 3;
  }

  .tv-controls {
    display: flex;
    gap: 16px;
    padding: 8px;
    background: #222;
    border-radius: 4px;
  }

  .control-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .control-group label {
    color: #fff;
    font-size: 12px;
  }

  .power-button {
    background: #444;
    color: #fff;
    border: 2px solid #666;
    border-radius: 4px;
    padding: 8px 16px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .power-button:hover {
    background: #555;
  }

  .power-button:active {
    background: #333;
    transform: translateY(1px);
  }

  input[type="range"] {
    width: 100px;
  }

  .error-message {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-family: monospace;
    font-size: 24px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    z-index: 4;
  }

  @keyframes static {
    0% { transform: translate(0, 0); }
    25% { transform: translate(-2px, 2px); }
    50% { transform: translate(2px, -2px); }
    75% { transform: translate(-2px, -2px); }
    100% { transform: translate(2px, 2px); }
  }
</style> 