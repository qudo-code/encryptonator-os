<script lang="ts">
  export let onClose: () => void;
  
  const readmeContent = `# EncryptornatorOS 🔐

A retro-futuristic encrypted notes application that combines the nostalgia of classic Windows interfaces with modern security features. Share encrypted messages through URLs while enjoying a unique operating system experience.

## ✨ Features

### 🖥️ Multi-Era Windows Themes
- **Windows 98**: Classic gray interface with iconic 3D elements
- **Windows XP**: Vibrant blue and green with gradient effects
- **Windows Vista/7**: Aero glass effects with transparency
- **Windows 10**: Modern flat design with minimalist elements
- **Windows 11**: Contemporary centered layout with rounded corners

### 🚀 Retro-Futuristic Boot Experience
- Custom space-themed boot screen
- Era-appropriate loading animations
- Dynamic star field background
- Themed progress indicators
- Nostalgic boot messages

### 🔒 Encryption Features
- End-to-end encryption for messages
- URL-based encrypted message sharing
- Quantum-safe encryption algorithms
- Password-protected content
- Secure message history

### 💫 Modern UI Elements
- Draggable windows with resize support
- Interactive taskbar with running applications
- Start menu with application launcher
- File explorer for message history
- Control panel for theme customization

### 🎮 Bonus Features
- Cybersecball game (security-themed Pinball)
- RetroTube video player
- Message history viewer
- Theme customization options`;

  let windowPos = { 
    x: typeof window !== 'undefined' ? (window.innerWidth - 600) / 2 : 100,
    y: typeof window !== 'undefined' ? (window.innerHeight - 500) / 2 : 100
  };
  let windowSize = { width: 600, height: 500 };
  let isDragging = false;
  let dragStart = { x: 0, y: 0 };
  let isResizing = false;
  let resizeStart = { x: 0, y: 0 };
  let initialSize = { width: 0, height: 0 };

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
        x: event.clientX - dragStart.x,
        y: event.clientY - dragStart.y
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
</script>

<svelte:window 
  on:mousemove={handleMouseMove}
  on:mouseup={handleMouseUp}
/>

<div
  class="window readme-window"
  style="
    position: fixed;
    left: {windowPos.x}px;
    top: {windowPos.y}px;
    width: {windowSize.width}px;
    height: {windowSize.height}px;
  "
  on:mousedown={handleMouseDown}
>
  <div class="title-bar">
    <div class="title-bar-text">
      📖 README - EncryptornatorOS
    </div>
    <div class="title-bar-controls">
      <button aria-label="Minimize"></button>
      <button aria-label="Maximize"></button>
      <button aria-label="Close" on:click={onClose}></button>
    </div>
  </div>

  <div class="window-body" style="height: calc(100% - 50px); overflow: auto;">
    <div class="readme-content">
      {#each readmeContent.split('\n') as line}
        {#if line.startsWith('# ')}
          <h1>{line.slice(2)}</h1>
        {:else if line.startsWith('## ')}
          <h2>{line.slice(3)}</h2>
        {:else if line.startsWith('### ')}
          <h3>{line.slice(4)}</h3>
        {:else if line.startsWith('- ')}
          <div class="list-item">{line}</div>
        {:else}
          <p>{line}</p>
        {/if}
      {/each}
    </div>
  </div>

  <div 
    class="resize-handle"
    on:mousedown={handleResizeMouseDown}
  ></div>
</div>

<style>
  .readme-window {
    background: var(--theme-window, #c0c0c0);
    box-shadow: var(--theme-window-shadow, 4px 4px 10px rgba(0, 0, 0, 0.5));
    display: flex;
    flex-direction: column;
    border: 2px solid #000;
    z-index: 100;
  }

  .window-body {
    flex: 1;
    padding: 16px;
    font-family: "Segoe UI", "MS Sans Serif", sans-serif;
    line-height: 1.5;
  }

  .readme-content {
    max-width: 800px;
    margin: 0 auto;
  }

  h1 {
    font-size: 24px;
    margin: 0 0 20px 0;
    color: #222;
  }

  h2 {
    font-size: 20px;
    margin: 20px 0 15px 0;
    color: #444;
  }

  h3 {
    font-size: 16px;
    margin: 15px 0 10px 0;
    color: #666;
  }

  p {
    margin: 10px 0;
    color: #222;
  }

  .list-item {
    margin: 5px 0 5px 20px;
    color: #222;
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
</style> 