<script lang="ts">
  export let isOpen = false;
  export let theme = 'win98';
  export let onAppClick: (app: string) => void;

  const apps = [
    {
      id: 'encryptor',
      name: 'Encryptor',
      icon: '🔐',
      description: 'Secure Message Encryption'
    },
    {
      id: 'cybersecball',
      name: 'Cybersecball',
      icon: '🎯',
      description: 'Security-themed Pinball'
    },
    {
      id: 'messages',
      name: 'Messages',
      icon: '📂',
      description: 'Encrypted Message History'
    },
    {
      id: 'retrotube',
      name: 'RetroTube',
      icon: '📺',
      description: 'Retro Video Player'
    },
    {
      id: 'control',
      name: 'Control Panel',
      icon: '⚙️',
      description: 'System Settings'
    }
  ];

  function handleAppClick(appId: string) {
    onAppClick(appId);
    isOpen = false;
  }
</script>

{#if isOpen}
  <div class="start-menu" class:xp={theme === 'winxp'} class:vista={theme === 'vista'}>
    <div class="menu-header">
      {#if theme === 'winxp'}
        <div class="user-info">
          <div class="user-avatar">👤</div>
          <div class="user-name">User</div>
        </div>
      {/if}
    </div>

    <div class="menu-content">
      <div class="apps-list">
        {#each apps as app}
          <button 
            class="app-item"
            on:click={() => handleAppClick(app.id)}
          >
            <span class="app-icon">{app.icon}</span>
            <div class="app-text">
              <span class="app-name">{app.name}</span>
              {#if theme !== 'win98'}
                <span class="app-description">{app.description}</span>
              {/if}
            </div>
          </button>
        {/each}
      </div>

      <div class="menu-footer">
        {#if theme === 'winxp' || theme === 'vista'}
          <div class="system-actions">
            <button class="action-button">
              <span class="action-icon">🔒</span>
              Lock
            </button>
            <button class="action-button">
              <span class="action-icon">⭘</span>
              Shut Down
            </button>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .start-menu {
    position: fixed;
    bottom: 32px;
    left: 0;
    width: 320px;
    background: var(--theme-window, rgba(192, 192, 192, 0.95));
    border: 2px solid #000;
    border-bottom: none;
    box-shadow: 4px -4px 10px rgba(0, 0, 0, 0.2);
    z-index: 10000;
    display: flex;
    flex-direction: column;
  }

  .menu-header {
    padding: 8px;
    border-bottom: 1px solid #888;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px;
    background: linear-gradient(90deg, #0066cc 0%, #3399ff 100%);
    color: white;
    border-radius: 4px;
  }

  .user-avatar {
    font-size: 32px;
    background: white;
    color: #0066cc;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
  }

  .user-name {
    font-size: 14px;
    font-weight: bold;
  }

  .menu-content {
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - 200px);
    overflow-y: auto;
  }

  .apps-list {
    padding: 4px;
  }

  .app-item {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 8px;
    border: none;
    background: none;
    cursor: pointer;
    text-align: left;
    color: #000;
  }

  .app-item:hover {
    background: var(--theme-taskbar, #000080);
    color: white;
  }

  .app-icon {
    font-size: 24px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .app-text {
    display: flex;
    flex-direction: column;
  }

  .app-name {
    font-weight: bold;
    font-size: 14px;
  }

  .app-description {
    font-size: 11px;
    opacity: 0.8;
  }

  .menu-footer {
    margin-top: auto;
    border-top: 1px solid #888;
    padding: 8px;
  }

  .system-actions {
    display: flex;
    gap: 8px;
  }

  .action-button {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    border: 1px solid #888;
    background: #f0f0f0;
    cursor: pointer;
    font-size: 12px;
  }

  .action-button:hover {
    background: #e0e0e0;
  }

  .action-icon {
    font-size: 16px;
  }

  /* Windows XP Theme */
  .start-menu.xp {
    border: 1px solid #0066cc;
    border-radius: 6px 6px 0 0;
    background: linear-gradient(135deg, #ffffff 0%, #eef3ff 100%);
  }

  .start-menu.xp .app-item {
    border-radius: 4px;
  }

  .start-menu.xp .app-item:hover {
    background: linear-gradient(90deg, #0066cc 0%, #3399ff 100%);
  }

  /* Windows Vista Theme */
  .start-menu.vista {
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 8px 8px 0 0;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    color: white;
  }

  .start-menu.vista .app-item {
    color: white;
    border-radius: 6px;
  }

  .start-menu.vista .app-item:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .start-menu.vista .menu-header,
  .start-menu.vista .menu-footer {
    border-color: rgba(255, 255, 255, 0.1);
  }

  .start-menu.vista .action-button {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    color: white;
  }

  .start-menu.vista .action-button:hover {
    background: rgba(255, 255, 255, 0.2);
  }
</style> 