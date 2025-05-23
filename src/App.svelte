<script lang="ts">
  import { encryptText, decryptText } from './lib/crypto';
  import { onMount } from 'svelte';
  import '98.css';
  import CybersecballWindow from './lib/CybersecballWindow.svelte';
  import FileExplorerWindow from './lib/FileExplorerWindow.svelte';
  import ControlPanelWindow from './lib/ControlPanelWindow.svelte';
  import EncryptorTV from './lib/EncryptorTV.svelte';
  import Taskbar from './lib/Taskbar.svelte';
  import BootScreen from './lib/BootScreen.svelte';
  import Desktop from './lib/Desktop.svelte';
  import ReadmeWindow from './lib/ReadmeWindow.svelte';
  import type { Theme } from './lib/types';

  let note = '';
  let password = '';
  let salt = '';
  let encryptedUrl = '';
  let error = '';
  let urlData: { data: string; salt: string } | null = null;
  let mode: 'read' | 'edit' = 'edit';
  let showPasswordPrompt = false;
  let decryptedContent = '';
  let showPinball = false;
  let showFileExplorer = false;
  let showMainWindow = false;
  let showControlPanel = false;
  let showEncryptorTV = false;
  let showReadme = false;

  // Window position and size - centered in viewport
  let windowPos = { 
    x: typeof window !== 'undefined' ? (window.innerWidth - 400) / 2 : 100,
    y: typeof window !== 'undefined' ? (window.innerHeight - 600) / 2 : 100
  };
  let windowSize = { width: 400, height: 600 };
  let isDragging = false;
  let dragStart = { x: 0, y: 0 };
  let isResizing = false;
  let resizeStart = { x: 0, y: 0 };
  let initialSize = { width: 0, height: 0 };

  let currentTheme: Theme = 'win98';
  let openWindows: { [key: string]: boolean } = {
    pinball: false,
    fileExplorer: false,
    mainWindow: false,
    controlPanel: false,
    encryptortv: false
  };

  let isBooting = true;

  $: openApps = [
    ...(showMainWindow ? [{ id: 'encryptor', name: 'Encryptor', icon: '🔐' }] : []),
    ...(showPinball ? [{ id: 'cybersecball', name: 'Cybersecball', icon: '🎯' }] : []),
    ...(showFileExplorer ? [{ id: 'messages', name: 'Messages', icon: '📂' }] : []),
    ...(showEncryptorTV ? [{ id: 'encryptortv', name: 'EncryptorTV', icon: '📺' }] : []),
    ...(showControlPanel ? [{ id: 'control', name: 'Control Panel', icon: '⚙️' }] : []),
    ...(showReadme ? [{ id: 'readme', name: 'README', icon: '📖' }] : [])
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

  // Generate a random salt if not decrypting
  onMount(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const data = params.get('data');
    const urlSalt = params.get('salt');
    
    if (data && urlSalt) {
      mode = 'read';
      urlData = { data, salt: urlSalt };
      note = 'Enter password to decrypt...';
      showPasswordPrompt = true;
    } else {
      salt = Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    }
  });

  // Watch for password changes and attempt decryption in read mode
  $: if (password && urlData && mode === 'read') {
    handleDecrypt();
  }

  function toggleMode() {
    mode = mode === 'read' ? 'edit' : 'read';
    // Reset state when switching modes
    note = '';
    password = '';
    error = '';
    encryptedUrl = '';
    decryptedContent = '';
    
    if (mode === 'edit') {
      salt = Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    }
  }

  async function handleEncrypt() {
    try {
      error = '';
      if (!note || !password) {
        error = 'Please fill in both note and password fields';
        return;
      }

      const encrypted = await encryptText(note, password, salt);
      const baseUrl = window.location.href.split('#')[0];
      encryptedUrl = `${baseUrl}#data=${encrypted}&salt=${salt}`;

      // Save to message history
      const messageHistory = JSON.parse(localStorage.getItem('encryptonator_files') || '[]');
      const newMessage = {
        id: crypto.randomUUID(),
        name: note.slice(0, 30) + (note.length > 30 ? '...' : ''),
        date: new Date().toISOString(),
        status: 'shared'
      };
      messageHistory.push(newMessage);
      localStorage.setItem('encryptonator_files', JSON.stringify(messageHistory));
      
      // Dispatch event to update file explorer
      window.dispatchEvent(new Event('encryptonator_file_update'));
    } catch (e) {
      error = 'Encryption failed: ' + (e instanceof Error ? e.message : String(e));
    }
  }

  async function handleDecrypt(fromPrompt = false) {
    try {
      error = '';
      if (!urlData || !password) {
        return;
      }

      const decrypted = await decryptText(urlData.data, password, urlData.salt);
      decryptedContent = decrypted;
      note = decrypted;

      // Save to message history if successful
      const messageHistory = JSON.parse(localStorage.getItem('encryptonator_files') || '[]');
      const newMessage = {
        id: crypto.randomUUID(),
        name: decrypted.slice(0, 30) + (decrypted.length > 30 ? '...' : ''),
        date: new Date().toISOString(),
        status: 'received'
      };
      messageHistory.push(newMessage);
      localStorage.setItem('encryptonator_files', JSON.stringify(messageHistory));
      
      // Dispatch event to update file explorer
      window.dispatchEvent(new Event('encryptonator_file_update'));

      if (fromPrompt) {
        showPasswordPrompt = false;
      }
    } catch (e) {
      if (fromPrompt) {
        error = 'Decryption failed: ' + (e instanceof Error ? e.message : String(e));
      }
    }
  }

  function dismissPrompt() {
    showPasswordPrompt = false;
    password = '';
    error = '';
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(encryptedUrl);
  }

  function togglePinball() {
    showPinball = !showPinball;
  }

  function toggleFileExplorer() {
    showFileExplorer = !showFileExplorer;
  }

  function closeMainWindow() {
    showMainWindow = false;
  }

  function toggleControlPanel() {
    showControlPanel = !showControlPanel;
  }

  function toggleEncryptorTV() {
    showEncryptorTV = !showEncryptorTV;
  }

  function handleAppClick(appId: string) {
    switch (appId) {
      case 'encryptor':
        showMainWindow = !showMainWindow;
        break;
      case 'cybersecball':
        togglePinball();
        break;
      case 'messages':
        toggleFileExplorer();
        break;
      case 'encryptortv':
        toggleEncryptorTV();
        break;
      case 'control':
        toggleControlPanel();
        break;
      case 'readme':
        showReadme = !showReadme;
        break;
    }
  }

  function handleBootComplete() {
    isBooting = false;
  }
</script>

{#if isBooting}
  <BootScreen theme={currentTheme} onBootComplete={handleBootComplete} />
{:else}
<main 
  class="win98"
  style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; overflow: hidden;"
>
  <div class="wallpaper">
    <div class="wallpaper-grid"></div>
    <div class="os-text">
      <div class="os-name">EncryptornatorOS</div>
      <div class="os-version">Version 98.3</div>
    </div>
  </div>

  <Desktop theme={currentTheme} onAppClick={handleAppClick} />

  <Taskbar 
    theme={currentTheme}
    onAppClick={handleAppClick}
    openApps={openApps}
  />

  <div
    class="window"
    style="position: fixed; left: {windowPos.x}px; top: {windowPos.y}px; width: {windowSize.width}px; height: {windowSize.height}px; display: {showMainWindow ? 'flex' : 'none'};"
    on:mousedown={handleMouseDown}
  >
    <div class="title-bar">
      <div class="title-bar-text">
        Encryptor {mode === 'read' ? '- Read Mode' : '- Edit Mode'}
      </div>
      <div class="title-bar-controls">
        <button aria-label="Minimize"></button>
        <button aria-label="Maximize"></button>
        <button aria-label="Close" on:click={closeMainWindow}></button>
      </div>
    </div>

    <div class="window-body" style="height: calc(100% - 50px); overflow: auto;">
      <div class="mode-switch">
        <button on:click={toggleMode}>
          Switch to {mode === 'read' ? 'Edit' : 'Read'} Mode
        </button>
      </div>

      {#if mode === 'read'}
        <div class="read-section">
          <fieldset>
            <legend>Read Encrypted Message</legend>
            <div class="field-row-stacked">
              <label for="decrypt-password">Password:</label>
              <input
                type="password"
                id="decrypt-password"
                bind:value={password}
                placeholder="Enter password to decrypt"
                autofocus
              />
            </div>
            <div class="field-row-stacked" style="margin-top: 16px;">
              <label for="note">Decrypted Message:</label>
              <textarea
                id="note"
                value={decryptedContent}
                placeholder="Decrypted content will appear here"
                rows="8"
                readonly
              ></textarea>
            </div>
          </fieldset>
        </div>
      {:else}
        <div class="edit-section">
          <fieldset>
            <legend>Create New Message</legend>
            <div class="field-row-stacked">
              <label for="note">Message:</label>
              <textarea
                id="note"
                bind:value={note}
                placeholder="Enter your message here"
                rows="8"
                autofocus
              ></textarea>
            </div>
            
            <div class="field-row-stacked" style="margin-top: 16px;">
              <label for="password">Encryption Password:</label>
              <input
                type="password"
                id="password"
                bind:value={password}
                placeholder="Enter encryption password"
              />
            </div>
            
            <div class="field-row" style="justify-content: flex-end; margin-top: 16px;">
              <button on:click={handleEncrypt}>
                Encrypt Message
              </button>
            </div>
            
            {#if encryptedUrl}
              <fieldset style="margin-top: 16px;">
                <legend>Encrypted Message URL</legend>
                <div class="field-row">
                  <input type="text" readonly value={encryptedUrl} style="flex: 1;" />
                  <button on:click={copyToClipboard}>Copy</button>
                </div>
                <p class="status-bar" style="margin-top: 8px;">
                  Share this URL with the recipient along with the password
                </p>
              </fieldset>
            {/if}
          </fieldset>
        </div>
      {/if}

      {#if error}
        <div class="status-bar error-bar" role="alert" style="margin-top: 16px;">
          <p class="status-bar-field">{error}</p>
        </div>
      {/if}
    </div>

    <!-- Resize handle -->
    <div 
      class="resize-handle"
      on:mousedown={handleResizeMouseDown}
    ></div>
  </div>

  {#if showPinball}
    <CybersecballWindow onClose={togglePinball} />
  {/if}

  {#if showFileExplorer}
    <FileExplorerWindow onClose={toggleFileExplorer} />
  {/if}

  {#if showControlPanel}
    <ControlPanelWindow onClose={() => showControlPanel = false} />
  {/if}

  {#if showEncryptorTV}
    <EncryptorTV onClose={() => showEncryptorTV = false} />
  {/if}

  {#if showReadme}
    <ReadmeWindow onClose={() => showReadme = false} />
  {/if}

  {#if showPasswordPrompt}
    <div class="modal-overlay">
      <div class="window modal" style="width: 300px;">
        <div class="title-bar">
          <div class="title-bar-text">
            Enter Password
          </div>
          <div class="title-bar-controls">
            <button aria-label="Close" on:click={dismissPrompt}></button>
          </div>
        </div>
        <div class="window-body">
          <p>This message is encrypted. Please enter the password to decrypt it.</p>
          <div class="field-row-stacked" style="margin: 16px 0;">
            <label for="modal-password">Password:</label>
            <input
              type="password"
              id="modal-password"
              bind:value={password}
              placeholder="Enter password"
              autofocus
            />
          </div>
          {#if error}
            <p class="error-text">{error}</p>
          {/if}
          <div class="field-row" style="justify-content: flex-end; margin-top: 16px;">
            <button on:click={dismissPrompt}>Cancel</button>
            <button on:click={() => handleDecrypt(true)} style="margin-left: 8px;">OK</button>
          </div>
        </div>
      </div>
    </div>
  {/if}
</main>
{/if}

<style>
  .wallpaper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 32px;
    background: linear-gradient(135deg, var(--theme-primary, #008080) 0%, var(--theme-secondary, #006666) 100%);
    overflow: hidden;
    z-index: -1;
  }

  .wallpaper-grid {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-size: 50px 50px;
    background-image: linear-gradient(to right, rgba(255,255,255,.1) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(255,255,255,.1) 1px, transparent 1px);
    pointer-events: none;
  }

  .os-text {
    position: absolute;
    bottom: 40px;
    right: 10px;
    text-align: right;
    color: rgba(255, 255, 255, 0.3);
    font-family: "Pixelated MS Sans Serif", Arial;
    pointer-events: none;
  }

  .os-name {
    font-size: 24px;
    font-weight: bold;
  }

  .os-version {
    font-size: 16px;
  }

  @keyframes float {
    0%, 100% {
      transform: translate(-50%, -50%);
    }
    50% {
      transform: translate(-50%, -52%);
    }
  }

  :global(body) {
    background-color: transparent;
    margin: 0;
    padding: 0;
    color: #222;
    overflow: hidden;
    height: 100vh;
  }

  .win98 {
    height: 100vh;
    width: 100vw;
    position: relative;
  }

  .window {
    min-width: 350px;
    background: var(--theme-window, #c0c0c0);
    box-shadow: var(--theme-window-shadow, 4px 4px 10px rgba(0, 0, 0, 0.5));
    display: flex;
    flex-direction: column;
    position: relative;
    border: 2px solid #000;
  }

  .window-body {
    flex: 1;
    padding: 12px;
    overflow: auto;
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

  .mode-switch {
    margin-bottom: 16px;
    text-align: right;
  }

  textarea {
    width: 100%;
    min-height: 120px;
    resize: vertical;
    color: #222;
  }

  input[type="text"], input[type="password"] {
    width: 100%;
    color: #222;
  }

  .error-bar {
    background-color: #ffd6d6;
  }

  .status-bar {
    margin: 0;
    font-size: 12px;
    color: #222;
  }

  fieldset {
    margin: 0;
    padding: 12px;
  }

  legend {
    color: #222;
  }

  label {
    color: #222;
  }

  .field-row-stacked {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .field-row {
    display: flex;
    gap: 4px;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal {
    background: #c0c0c0;
  }

  .error-text {
    color: #a00;
    margin: 8px 0;
    font-size: 12px;
  }

  :global(.modal .window-body) {
    margin: 16px;
  }

  :global(.window-body p) {
    color: #222;
    margin: 0;
  }

  textarea[readonly] {
    background-color: #dfdfdf;
  }

  .taskbar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 32px;
    background: linear-gradient(180deg, var(--theme-taskbar, #2a2a8c) 0%, color-mix(in srgb, var(--theme-taskbar, #2a2a8c) 80%, black) 100%);
    border-top: 1px solid color-mix(in srgb, var(--theme-taskbar, #2a2a8c) 80%, white);
    padding: 2px 4px;
    display: flex;
    align-items: center;
    gap: 4px;
    z-index: 9999;
  }

  .start-button {
    height: 28px;
    padding: 2px 12px;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 6px;
    position: relative;
    overflow: hidden;
    border: 2px solid;
    border-color: #8080ff #000066 #000066 #8080ff;
    background: linear-gradient(180deg, #4040cc 0%, #2a2a8c 100%);
    color: white;
    text-shadow: 2px 2px 2px rgba(0,0,0,0.5);
    font-weight: bold;
    font-family: 'Arial', sans-serif;
    transition: all 0.1s ease;
  }

  .start-button:hover {
    background: linear-gradient(180deg, #5050dd 0%, #3a3a9c 100%);
    border-color: #9090ff #000077 #000077 #9090ff;
  }

  .start-button:active {
    background: linear-gradient(180deg, #2a2a8c 0%, #4040cc 100%);
    border-color: #000066 #8080ff #8080ff #000066;
    transform: translateY(1px);
  }

  .button-shine {
    position: absolute;
    top: -50%;
    left: -100%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent 0%,
      rgba(255,255,255,0.1) 30%,
      rgba(255,255,255,0.2) 50%,
      rgba(255,255,255,0.1) 70%,
      transparent 100%
    );
    animation: shine 4s infinite;
    pointer-events: none;
  }

  .encryptor-button {
    background: linear-gradient(180deg, #00E676 0%, #00C853 100%);
    border-color: #69F0AE #00B248 #00B248 #69F0AE;
  }

  .encryptor-button:hover {
    background: linear-gradient(180deg, #00E676 0%, #00C853 100%);
    border-color: #B9F6CA #00B248 #00B248 #B9F6CA;
  }

  .encryptor-button:active {
    background: linear-gradient(180deg, #2E7D32 0%, #4CAF50 100%);
    border-color: #1B5E20 #81C784 #81C784 #1B5E20;
  }

  .game-button {
    background: linear-gradient(180deg, #FF4081 0%, #F50057 100%);
    border-color: #FF80AB #C51162 #C51162 #FF80AB;
  }

  .game-button:hover {
    background: linear-gradient(180deg, #FF4081 0%, #F50057 100%);
    border-color: #FF80AB #C51162 #C51162 #FF80AB;
  }

  .game-button:active {
    background: linear-gradient(180deg, #C51162 0%, #FF4081 100%);
    border-color: #880E4F #FF80AB #FF80AB #880E4F;
  }

  .files-button {
    background: linear-gradient(180deg, #448AFF 0%, #2962FF 100%);
    border-color: #82B1FF #0D47A1 #0D47A1 #82B1FF;
  }

  .files-button:hover {
    background: linear-gradient(180deg, #448AFF 0%, #2962FF 100%);
    border-color: #82B1FF #0D47A1 #0D47A1 #82B1FF;
  }

  .files-button:active {
    background: linear-gradient(180deg, #1565C0 0%, #2196F3 100%);
    border-color: #0D47A1 #64B5F6 #64B5F6 #0D47A1;
  }

  .retrotube-button {
    background: linear-gradient(180deg, #FF3D00 0%, #DD2C00 100%);
    border-color: #FF6E40 #BF360C #BF360C #FF6E40;
    animation: rainbow 10s linear infinite;
  }

  .retrotube-button:hover {
    background: linear-gradient(180deg, #FF3D00 0%, #DD2C00 100%);
    border-color: #FF6E40 #BF360C #BF360C #FF6E40;
    animation: rainbow 5s linear infinite;
  }

  .control-panel-button {
    background: linear-gradient(180deg, #FFC107 0%, #FFA000 100%);
    border-color: #FFD54F #FF6F00 #FF6F00 #FFD54F;
  }

  .control-panel-button:hover {
    background: linear-gradient(180deg, #FFC107 0%, #FFA000 100%);
    border-color: #FFE082 #FF6F00 #FF6F00 #FFE082;
  }

  .control-panel-button:active {
    background: linear-gradient(180deg, #FB8C00 0%, #FFB74D 100%);
    border-color: #E65100 #FFE0B2 #FFE0B2 #E65100;
  }

  @keyframes shine {
    0% {
      transform: translateX(-100%) translateY(-100%) rotate(45deg);
    }
    20%, 100% {
      transform: translateX(100%) translateY(100%) rotate(45deg);
    }
  }

  @keyframes rainbow {
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(360deg); }
  }

  /* Ensure windows don't go under taskbar */
  .window {
    max-height: calc(100vh - 34px);
  }
</style>
