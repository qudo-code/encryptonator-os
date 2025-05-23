<script lang="ts">
  import { onMount } from 'svelte';

  export let windowPos = { x: 200, y: 150 };
  export let windowSize = { width: 400, height: 500 };
  export let onClose = () => {};

  let isDragging = false;
  let dragStart = { x: 0, y: 0 };
  let isResizing = false;
  let resizeStart = { x: 0, y: 0 };
  let initialSize = { width: 0, height: 0 };
  let isMinimized = false;

  // Theme settings
  let currentTheme = 'win98';
  let themes = [
    { 
      id: 'win98', 
      name: 'Windows 98',
      icon: '🖥️',
      colors: {
        primary: '#008080',
        secondary: '#006666',
        taskbar: '#c0c0c0',
        taskbarGradient: 'linear-gradient(180deg, #c0c0c0 0%, #a0a0a0 100%)',
        window: 'rgba(192, 192, 192, 0.95)',
        startButton: 'linear-gradient(180deg, #c0c0c0 0%, #a0a0a0 100%)',
        startBorder: '#ffffff #404040 #404040 #ffffff'
      },
      startIcon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="14" height="14" fill="#000"/>
        <rect x="2" y="2" width="12" height="12" fill="#c0c0c0"/>
        <path d="M4 4h8v2h-2v2h-2v2h-2v-2h-2v-2h-2v-2z" fill="#000"/>
      </svg>`
    },
    { 
      id: 'winxp', 
      name: 'Windows XP',
      icon: '💠',
      colors: {
        primary: '#245edb',
        secondary: '#1d4bab',
        taskbar: '#2b579a',
        taskbarGradient: 'linear-gradient(180deg, #2b579a 0%, #1f3c6b 100%)',
        window: 'rgba(220, 230, 244, 0.95)',
        startButton: 'linear-gradient(180deg, #5aa744 0%, #4c8e39 100%)',
        startBorder: '#7bc25f #37672a #37672a #7bc25f'
      },
      startIcon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 2l3 0.5L7 2l3 0.5L13 2v12l-3-0.5L7 14l-3 0.5L2 14V2z" fill="#fff"/>
        <path d="M7 2v12M10 2.5v11" stroke="#fff" stroke-opacity="0.5"/>
      </svg>`
    },
    { 
      id: 'vista', 
      name: 'Windows Vista',
      icon: '✨',
      colors: {
        primary: '#0a4c8b',
        secondary: '#083966',
        taskbar: 'rgba(10, 76, 139, 0.85)',
        taskbarGradient: 'linear-gradient(180deg, rgba(10, 76, 139, 0.85) 0%, rgba(8, 57, 102, 0.85) 100%)',
        window: 'rgba(210, 220, 235, 0.95)',
        startButton: 'radial-gradient(circle at 30% 30%, #5ab0ff 0%, #1c6bb2 100%)',
        startBorder: '#7cc2ff #0d4c8c #0d4c8c #7cc2ff'
      },
      startIcon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" fill="#fff"/>
        <path d="M8 3v10M3 8h10" stroke="#fff" stroke-opacity="0.5"/>
      </svg>`
    },
    {
      id: 'win7',
      name: 'Windows 7',
      icon: '🌟',
      colors: {
        primary: '#1f5fb0',
        secondary: '#094ab2',
        taskbar: 'rgba(31, 95, 176, 0.9)',
        taskbarGradient: 'linear-gradient(180deg, rgba(31, 95, 176, 0.9) 0%, rgba(9, 74, 178, 0.9) 100%)',
        window: 'rgba(220, 235, 250, 0.97)',
        startButton: 'radial-gradient(circle at 30% 30%, #5ab0ff 0%, #1c6bb2 100%)',
        startBorder: '#7cc2ff #0d4c8c #0d4c8c #7cc2ff'
      },
      startIcon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 2l3 0.5L7 2l3 0.5L13 2v12l-3-0.5L7 14l-3 0.5L2 14V2z" fill="#fff"/>
        <path d="M7 2v12M10 2.5v11" stroke="#fff" stroke-opacity="0.5"/>
        <circle cx="8" cy="8" r="4" fill="rgba(255,255,255,0.2)"/>
      </svg>`
    },
    {
      id: 'win10',
      name: 'Windows 10',
      icon: '🔷',
      colors: {
        primary: '#0078d7',
        secondary: '#005a9e',
        taskbar: 'rgba(0, 120, 215, 0.95)',
        taskbarGradient: 'linear-gradient(180deg, rgba(0, 120, 215, 0.95) 0%, rgba(0, 90, 158, 0.95) 100%)',
        window: 'rgba(240, 240, 240, 0.98)',
        startButton: 'linear-gradient(180deg, #0078d7 0%, #005a9e 100%)',
        startBorder: '#2b99ff #004275 #004275 #2b99ff'
      },
      startIcon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="2" width="5.5" height="5.5" fill="#fff"/>
        <rect x="8.5" y="2" width="5.5" height="5.5" fill="#fff"/>
        <rect x="2" y="8.5" width="5.5" height="5.5" fill="#fff"/>
        <rect x="8.5" y="8.5" width="5.5" height="5.5" fill="#fff"/>
      </svg>`
    },
    {
      id: 'win11',
      name: 'Windows 11',
      icon: '💫',
      colors: {
        primary: '#0067c0',
        secondary: '#004881',
        taskbar: 'rgba(255, 255, 255, 0.85)',
        taskbarGradient: 'linear-gradient(180deg, rgba(255, 255, 255, 0.85) 0%, rgba(240, 240, 240, 0.85) 100%)',
        window: 'rgba(243, 243, 243, 0.98)',
        startButton: 'linear-gradient(180deg, #0067c0 0%, #004881 100%)',
        startBorder: '#2b99ff #004275 #004275 #2b99ff'
      },
      startIcon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3 3h4v4H3zM9 3h4v4H9zM3 9h4v4H3zM9 9h4v4H9z" fill="#0067c0"/>
        <path d="M3.5 3.5h3v3h-3zM9.5 3.5h3v3h-3zM3.5 9.5h3v3h-3zM9.5 9.5h3v3h-3z" fill="#fff"/>
      </svg>`
    }
  ];

  function handleMouseDown(event: MouseEvent) {
    if ((event.target as HTMLElement).closest('.title-bar')) {
      isDragging = true;
      dragStart = {
        x: event.clientX - windowPos.x,
        y: event.clientY - windowPos.y
      };
      event.preventDefault();
    }
  }

  function handleResizeMouseDown(event: MouseEvent) {
    isResizing = true;
    resizeStart = {
      x: event.clientX,
      y: event.clientY
    };
    initialSize = {
      width: windowSize.width,
      height: windowSize.height
    };
    event.preventDefault();
  }

  function handleMouseMove(event: MouseEvent) {
    if (isDragging) {
      windowPos = {
        x: Math.max(0, event.clientX - dragStart.x),
        y: Math.max(0, event.clientY - dragStart.y)
      };
    }
    if (isResizing) {
      const dx = event.clientX - resizeStart.x;
      const dy = event.clientY - resizeStart.y;
      windowSize = {
        width: Math.max(400, initialSize.width + dx),
        height: Math.max(300, initialSize.height + dy)
      };
    }
  }

  function handleMouseUp() {
    isDragging = false;
    isResizing = false;
  }

  function toggleMinimize() {
    isMinimized = !isMinimized;
  }

  function applyTheme(themeId: string) {
    const theme = themes.find(t => t.id === themeId);
    if (!theme) return;

    document.documentElement.style.setProperty('--theme-primary', theme.colors.primary);
    document.documentElement.style.setProperty('--theme-secondary', theme.colors.secondary);
    document.documentElement.style.setProperty('--theme-taskbar', theme.colors.taskbar);
    document.documentElement.style.setProperty('--theme-taskbar-gradient', theme.colors.taskbarGradient);
    document.documentElement.style.setProperty('--theme-window', theme.colors.window);
    document.documentElement.style.setProperty('--theme-start-button', theme.colors.startButton);
    document.documentElement.style.setProperty('--theme-start-border', theme.colors.startBorder);
    document.documentElement.style.setProperty('--theme-start-icon', `url("data:image/svg+xml,${encodeURIComponent(theme.startIcon)}")`);

    // Save theme preference
    localStorage.setItem('encryptonator_theme', themeId);
    currentTheme = themeId;

    // Dispatch theme change event
    window.dispatchEvent(new CustomEvent('encryptonator_theme_change', { detail: themeId }));
  }

  onMount(() => {
    // Load saved theme preference
    const savedTheme = localStorage.getItem('encryptonator_theme');
    if (savedTheme) {
      applyTheme(savedTheme);
    }
  });
</script>

<svelte:window 
  on:mousemove={handleMouseMove}
  on:mouseup={handleMouseUp}
/>

<div
  class="window control-panel"
  class:minimized={isMinimized}
  style="position: fixed; left: {windowPos.x}px; top: {windowPos.y}px; width: {windowSize.width}px; height: {isMinimized ? 'auto' : windowSize.height + 'px'};"
  on:mousedown={handleMouseDown}
>
  <div class="title-bar">
    <div class="title-bar-text">
      Control Panel
    </div>
    <div class="title-bar-controls">
      <button aria-label="Minimize" on:click={toggleMinimize}></button>
      <button aria-label="Maximize"></button>
      <button aria-label="Close" on:click={onClose}></button>
    </div>
  </div>

  <div class="window-body" style="display: {isMinimized ? 'none' : 'block'};">
    <div class="section">
      <h3>Theme Settings</h3>
      <p>Choose your preferred Windows theme:</p>
      
      <div class="theme-grid">
        {#each themes as theme}
          <button 
            class="theme-button" 
            class:active={currentTheme === theme.id}
            on:click={() => applyTheme(theme.id)}
          >
            <span class="theme-icon">{theme.icon}</span>
            <span class="theme-name">{theme.name}</span>
            {#if currentTheme === theme.id}
              <span class="theme-active">✓</span>
            {/if}
          </button>
        {/each}
      </div>

      <div class="theme-preview">
        <div class="preview-window">
          <div class="preview-titlebar"></div>
          <div class="preview-content"></div>
        </div>
        <div class="preview-taskbar"></div>
      </div>
    </div>
  </div>

  <div 
    class="resize-handle"
    style="display: {isMinimized ? 'none' : 'block'};"
    on:mousedown={handleResizeMouseDown}
  ></div>
</div>

<style>
  .control-panel {
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 100;
  }

  .window-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 16px;
    overflow: auto;
  }

  .section {
    margin-bottom: 24px;
  }

  h3 {
    margin: 0 0 8px 0;
    font-size: 14px;
    color: #222;
  }

  p {
    margin: 0 0 16px 0;
    font-size: 12px;
    color: #444;
  }

  .theme-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
    margin-bottom: 24px;
  }

  .theme-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px;
    border: 2px solid #888;
    background: #f0f0f0;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
  }

  .theme-button:hover {
    background: #e0e0e0;
    border-color: #666;
  }

  .theme-button.active {
    background: #d0d0d0;
    border-color: #000080;
  }

  .theme-icon {
    font-size: 20px;
  }

  .theme-name {
    font-size: 12px;
    color: #222;
  }

  .theme-active {
    position: absolute;
    top: 4px;
    right: 4px;
    color: #008000;
    font-weight: bold;
  }

  .theme-preview {
    width: 100%;
    height: 200px;
    border: 2px solid #888;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
    background: var(--theme-primary, #008080);
  }

  .preview-window {
    position: absolute;
    top: 20px;
    left: 20px;
    width: 160px;
    height: 120px;
    background: var(--theme-window, rgba(192, 192, 192, 0.95));
    border: 2px solid #000;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
  }

  .preview-titlebar {
    height: 20px;
    background: var(--theme-taskbar, #2a2a8c);
    border-bottom: 1px solid #000;
  }

  .preview-content {
    height: calc(100% - 20px);
    background: repeating-linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.1),
      rgba(255, 255, 255, 0.1) 10px,
      transparent 10px,
      transparent 20px
    );
  }

  .preview-taskbar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 32px;
    background: var(--theme-taskbar, #2a2a8c);
    border-top: 1px solid #000;
  }

  .resize-handle {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 16px;
    height: 16px;
    cursor: se-resize;
    background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M14 14H8M14 8V14' stroke='%23000' stroke-width='1'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: bottom right;
  }

  .title-bar {
    cursor: move;
  }

  .minimized {
    height: auto !important;
  }
</style> 