<script lang="ts">
  import StartMenu from './StartMenu.svelte';
  
  export let theme = 'win98';
  export let onAppClick: (app: string) => void;
  export let openApps: { id: string; name: string; icon: string }[] = [];
  
  let isStartMenuOpen = false;

  function toggleStartMenu() {
    isStartMenuOpen = !isStartMenuOpen;
  }

  const appIcons = {
    encryptor: '🔐',
    cybersecball: '🎯',
    messages: '📂',
    retrotube: '📺',
    control: '⚙️'
  };

  $: startButtonClass = {
    'win98': 'start-button-98',
    'winxp': 'start-button-xp',
    'vista': 'start-button-vista',
    'win7': 'start-button-vista',
    'win10': 'start-button-modern',
    'win11': 'start-button-modern win11'
  }[theme] || 'start-button-98';

  $: taskbarClass = {
    'win98': '',
    'winxp': 'xp',
    'vista': 'vista',
    'win7': 'vista',
    'win10': 'modern',
    'win11': 'modern'
  }[theme] || '';
</script>

<div class="taskbar" class:xp={taskbarClass === 'xp'} class:vista={taskbarClass === 'vista'} class:modern={taskbarClass === 'modern'}>
  <button 
    class="start-button {startButtonClass}"
    on:click={toggleStartMenu}
    class:active={isStartMenuOpen}
  >
    <span class="start-icon">
      {#if theme === 'win98'}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 3h4v4H3zM9 3h4v4H9zM3 9h4v4H3zM9 9h4v4H9z" fill="#000"/>
          <path d="M3.5 3.5h3v3h-3zM9.5 3.5h3v3h-3zM3.5 9.5h3v3h-3zM9.5 9.5h3v3h-3z" fill="#fff"/>
        </svg>
      {:else if theme === 'winxp'}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 2l3 0.5L7 2l3 0.5L13 2v12l-3-0.5L7 14l-3 0.5L2 14V2z" fill="#fff"/>
          <path d="M7 2v12M10 2.5v11" stroke="#fff" stroke-opacity="0.5"/>
        </svg>
      {:else if theme === 'vista' || theme === 'win7'}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="8" r="7" fill="url(#vista-gradient)"/>
          <path d="M8 3v10M3 8h10" stroke="#fff" stroke-opacity="0.8"/>
          <defs>
            <radialGradient id="vista-gradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(6 6) rotate(45) scale(11.3137)">
              <stop offset="0%" stop-color="#9BE4FF"/>
              <stop offset="100%" stop-color="#1D91D0"/>
            </radialGradient>
          </defs>
        </svg>
      {:else if theme === 'win10'}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="5.5" height="5.5" fill="#fff"/>
          <rect x="8.5" y="2" width="5.5" height="5.5" fill="#fff"/>
          <rect x="2" y="8.5" width="5.5" height="5.5" fill="#fff"/>
          <rect x="8.5" y="8.5" width="5.5" height="5.5" fill="#fff"/>
        </svg>
      {:else if theme === 'win11'}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="4" height="4" rx="0.5" fill="#fff"/>
          <rect x="9" y="3" width="4" height="4" rx="0.5" fill="#fff"/>
          <rect x="3" y="9" width="4" height="4" rx="0.5" fill="#fff"/>
          <rect x="9" y="9" width="4" height="4" rx="0.5" fill="#fff"/>
        </svg>
      {/if}
    </span>
    <span class="start-text">Start</span>
  </button>

  <div class="taskbar-items">
    {#each openApps as app}
      <button 
        class="taskbar-item"
        class:active={true}
        on:click={() => onAppClick(app.id)}
      >
        <span class="app-icon">{app.icon}</span>
        {#if taskbarClass !== 'modern'}
          <span class="app-name">{app.name}</span>
        {/if}
      </button>
    {/each}
  </div>

  <div class="system-tray">
    <span class="time">
      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </span>
  </div>
</div>

<StartMenu 
  isOpen={isStartMenuOpen}
  {theme}
  {onAppClick}
/>

<style>
  .taskbar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 32px;
    background: var(--theme-taskbar, #c0c0c0);
    border-top: 1px solid #fff;
    display: flex;
    align-items: center;
    padding: 2px;
    gap: 4px;
    z-index: 9999;
  }

  .start-button {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    height: 28px;
    border: none;
    cursor: pointer;
    font-weight: bold;
    font-size: 14px;
    color: var(--theme-text, #000);
  }

  .start-icon {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .start-icon svg {
    width: 16px;
    height: 16px;
  }

  /* Windows 98 Start Button */
  .start-button-98 {
    background: #c0c0c0;
    border: 2px outset #fff;
  }

  .start-button-98:active,
  .start-button-98.active {
    border-style: inset;
  }

  .start-button-98 .start-icon svg {
    filter: drop-shadow(1px 1px 0 #fff);
  }

  /* Windows XP Start Button */
  .start-button-xp {
    background: linear-gradient(180deg, #2A8F38 0%, #1B5E24 100%);
    border-radius: 4px;
    color: white !important;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
    border: 1px solid #164B1D;
  }

  .start-button-xp:hover {
    background: linear-gradient(180deg, #35A844 0%, #236B2C 100%);
  }

  .start-button-xp:active,
  .start-button-xp.active {
    background: linear-gradient(180deg, #1B5E24 0%, #2A8F38 100%);
  }

  .start-button-xp .start-icon svg {
    filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.5));
  }

  /* Windows Vista/7 Start Button */
  .start-button-vista {
    background: radial-gradient(circle at center, #9BE4FF 0%, #1D91D0 100%);
    border-radius: 50%;
    color: white !important;
    width: 40px;
    height: 40px;
    padding: 0;
    margin: -6px 4px -6px 0;
    position: relative;
    overflow: hidden;
    border: none;
    box-shadow: 
      0 0 10px rgba(155, 228, 255, 0.5),
      0 0 20px rgba(155, 228, 255, 0.3),
      0 0 30px rgba(155, 228, 255, 0.1);
  }

  .start-button-vista:hover {
    background: radial-gradient(circle at center, #B0EAFF 0%, #2DA1E0 100%);
  }

  .start-button-vista:active,
  .start-button-vista.active {
    background: radial-gradient(circle at center, #1D91D0 0%, #9BE4FF 100%);
  }

  .start-button-vista .start-icon {
    width: 100%;
    height: 100%;
  }

  .start-button-vista .start-icon svg {
    width: 24px;
    height: 24px;
    filter: drop-shadow(0 0 4px rgba(255,255,255,0.8));
  }

  .start-button-vista .start-text {
    display: none;
  }

  /* Windows 10/11 Start Button */
  .start-button-modern {
    background: transparent;
    color: white !important;
    padding: 4px 12px;
    transition: all 0.2s ease;
  }

  .start-button-modern:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .start-button-modern:active,
  .start-button-modern.active {
    background: rgba(255, 255, 255, 0.2);
  }

  .start-button-modern.win11 {
    margin-left: calc(50% - 60px);
  }

  .taskbar.xp {
    background: linear-gradient(180deg, #2255BB 0%, #1144AA 100%);
    border-top: 1px solid #3366CC;
  }

  .taskbar.vista {
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(10px);
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    height: 40px;
  }

  .taskbar.modern {
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(20px);
    border: none;
  }

  .taskbar-items {
    flex: 1;
    display: flex;
    gap: 4px;
    padding: 0 4px;
    height: 100%;
  }

  .taskbar-item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 2px 8px;
    height: 100%;
    border: none;
    cursor: pointer;
    color: inherit;
    background: none;
    font-size: 12px;
    min-width: 32px;
    position: relative;
  }

  /* Windows 98 taskbar item */
  :global(.taskbar:not(.xp):not(.vista):not(.modern)) .taskbar-item {
    background: #c0c0c0;
    border: 2px outset #fff;
  }

  :global(.taskbar:not(.xp):not(.vista):not(.modern)) .taskbar-item:active,
  :global(.taskbar:not(.xp):not(.vista):not(.modern)) .taskbar-item.active {
    border-style: inset;
    padding-top: 3px;
    padding-left: 9px;
  }

  /* Windows XP taskbar item */
  .taskbar.xp .taskbar-item {
    background: linear-gradient(180deg, #2255BB 0%, #1144AA 100%);
    border-radius: 2px;
    color: white;
  }

  .taskbar.xp .taskbar-item:hover {
    background: linear-gradient(180deg, #2766CC 0%, #1755BB 100%);
  }

  .taskbar.xp .taskbar-item:active,
  .taskbar.xp .taskbar-item.active {
    background: linear-gradient(180deg, #1144AA 0%, #2255BB 100%);
  }

  /* Windows Vista/7 taskbar item */
  .taskbar.vista .taskbar-item {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    color: white;
    backdrop-filter: blur(10px);
    margin: 4px 2px;
  }

  .taskbar.vista .taskbar-item:hover {
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
  }

  .taskbar.vista .taskbar-item:active,
  .taskbar.vista .taskbar-item.active {
    background: rgba(255, 255, 255, 0.25);
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
  }

  /* Windows 10/11 taskbar item */
  .taskbar.modern .taskbar-item {
    color: white;
    width: 40px;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .taskbar.modern .taskbar-item::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 20%;
    width: 60%;
    height: 2px;
    background: white;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .taskbar.modern .taskbar-item:hover::after {
    opacity: 0.5;
  }

  .taskbar.modern .taskbar-item:active::after,
  .taskbar.modern .taskbar-item.active::after {
    opacity: 1;
  }

  .app-icon {
    font-size: 16px;
  }

  .app-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 150px;
  }

  .system-tray {
    display: flex;
    align-items: center;
    padding: 0 8px;
    gap: 8px;
    height: 100%;
    border-left: 1px solid rgba(255, 255, 255, 0.2);
  }

  .time {
    color: var(--theme-text, #000);
    font-size: 12px;
  }

  .taskbar.xp .time,
  .taskbar.vista .time,
  .taskbar.modern .time {
    color: white;
  }
</style> 