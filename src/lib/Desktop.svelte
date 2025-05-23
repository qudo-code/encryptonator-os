<script lang="ts">
  import type { Theme } from './types';
  
  export let theme: Theme;
  export let onAppClick: (app: string) => void;

  interface ShortcutIcon {
    id: string;
    name: string;
    icon: string;
    description: string;
  }

  const shortcuts: ShortcutIcon[] = [
    {
      id: 'encryptor',
      name: 'Encryptor',
      icon: '🔐',
      description: 'Secure message encryption'
    },
    {
      id: 'cybersecball',
      name: 'Cybersecball',
      icon: '🎯',
      description: 'Security-themed pinball game'
    },
    {
      id: 'messages',
      name: 'Messages',
      icon: '📂',
      description: 'View encrypted message history'
    },
    {
      id: 'encryptortv',
      name: 'EncryptorTV',
      icon: '📺',
      description: 'Watch retro computer videos'
    },
    {
      id: 'control',
      name: 'Control Panel',
      icon: '⚙️',
      description: 'System settings and customization'
    },
    {
      id: 'readme',
      name: 'README',
      icon: '📖',
      description: 'View application documentation'
    }
  ];

  let draggedIcon: string | null = null;
  let iconPositions: { [key: string]: { x: number; y: number } } = {};

  // Initialize icon positions in a grid layout
  function initializeIconPositions() {
    const margin = 20;
    const iconWidth = 100;
    const iconHeight = 100;
    const iconsPerColumn = Math.floor((window.innerHeight - 100) / iconHeight);

    shortcuts.forEach((shortcut, index) => {
      const column = Math.floor(index / iconsPerColumn);
      const row = index % iconsPerColumn;
      
      iconPositions[shortcut.id] = {
        x: margin + (column * (iconWidth + margin)),
        y: margin + (row * (iconHeight + margin))
      };
    });
  }

  function handleDragStart(event: DragEvent, id: string) {
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', id);
      draggedIcon = id;
    }
  }

  function handleDrag(event: DragEvent) {
    if (draggedIcon && event.clientX && event.clientY) {
      iconPositions[draggedIcon] = {
        x: event.clientX - 50,
        y: event.clientY - 50
      };
    }
  }

  function handleDragEnd() {
    draggedIcon = null;
  }

  function handleDoubleClick(id: string) {
    onAppClick(id);
  }

  // Initialize positions when component mounts
  initializeIconPositions();
</script>

<div class="desktop">
  {#each shortcuts as shortcut}
    <div
      class="shortcut"
      class:modern={theme === 'win10' || theme === 'win11'}
      class:xp={theme === 'winxp'}
      class:vista={theme === 'vista' || theme === 'win7'}
      style="left: {iconPositions[shortcut.id]?.x}px; top: {iconPositions[shortcut.id]?.y}px;"
      draggable="true"
      on:dragstart={(e) => handleDragStart(e, shortcut.id)}
      on:drag={handleDrag}
      on:dragend={handleDragEnd}
      on:dblclick={() => handleDoubleClick(shortcut.id)}
      title={shortcut.description}
    >
      <div class="icon">{shortcut.icon}</div>
      <div class="name">{shortcut.name}</div>
    </div>
  {/each}
</div>

<style>
  .desktop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 32px;
    z-index: 0;
    user-select: none;
  }

  .shortcut {
    position: absolute;
    width: 100px;
    text-align: center;
    color: white;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.8);
    padding: 8px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .shortcut:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .shortcut:active {
    background: rgba(255, 255, 255, 0.2);
  }

  .shortcut.modern {
    border-radius: 8px;
  }

  .shortcut.modern:hover {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
  }

  .shortcut.xp {
    border: 1px solid transparent;
  }

  .shortcut.xp:hover {
    border-color: rgba(255, 255, 255, 0.5);
    background: rgba(0, 120, 255, 0.2);
  }

  .shortcut.vista {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .shortcut.vista:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
  }

  .icon {
    font-size: 32px;
    margin-bottom: 8px;
    filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.5));
  }

  .name {
    font-size: 12px;
    word-wrap: break-word;
    max-width: 100%;
    text-align: center;
    background: rgba(0, 0, 0, 0.5);
    padding: 2px 4px;
    border-radius: 3px;
  }

  /* Selection effect */
  .shortcut::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 1px dashed rgba(255, 255, 255, 0.5);
    border-radius: inherit;
    opacity: 0;
    pointer-events: none;
  }

  .shortcut:focus::after {
    opacity: 1;
  }
</style> 