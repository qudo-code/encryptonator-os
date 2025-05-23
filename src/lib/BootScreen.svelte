<script lang="ts">
  import type { Theme } from './types';
  export let theme: Theme = 'win98';
  export let onBootComplete: () => void;
  
  let progress = 0;
  let bootStage = 0;
  let showLogo = false;

  const messages: Record<Theme, string[]> = {
    win98: [
      'EncryptornatorOS 98',
      'Loading secure environment...',
      'Initializing encryption modules...',
      'Preparing quantum-safe workspace...'
    ],
    winxp: [
      'EncryptornatorOS XP',
      'Initializing secure boot...'
    ],
    vista: [
      'EncryptornatorOS Vista',
      'Loading secure modules...'
    ],
    win7: [
      'EncryptornatorOS 7',
      'Loading secure modules...'
    ],
    win10: [
      'EncryptornatorOS 10'
    ],
    win11: [
      'EncryptornatorOS 11'
    ]
  };

  $: currentMessages = messages[theme];
  $: isModern = theme === 'win10' || theme === 'win11';
  $: isClassic = theme === 'win98';
  $: isXP = theme === 'winxp';
  $: isVista = theme === 'vista' || theme === 'win7';

  function startBoot() {
    showLogo = true;
    const duration = isModern ? 800 : 1200;
    const steps = isModern ? 50 : currentMessages.length;
    const interval = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      progress = (currentStep / steps) * 100;
      
      if (!isModern) {
        bootStage = Math.floor((currentStep / steps) * currentMessages.length);
      }
      
      currentStep++;
      
      if (currentStep > steps) {
        clearInterval(timer);
        onBootComplete();
      }
    }, interval);
  }

  setTimeout(startBoot, 100);
</script>

<div class="boot-screen" class:modern={isModern} class:classic={isClassic} class:xp={isXP} class:vista={isVista}>
  <div class="stars"></div>
  <div class="twinkling"></div>
  
  <div class="content">
    <div class="logo">
      <div class="logo-icon">🔐</div>
      <div class="logo-text">EncryptornatorOS</div>
    </div>

    {#if isModern}
      <div class="modern-boot">
        <div class="spinner">
          <div class="spinner-dot" style="--delay: 0s"></div>
          <div class="spinner-dot" style="--delay: 0.2s"></div>
          <div class="spinner-dot" style="--delay: 0.4s"></div>
          <div class="spinner-dot" style="--delay: 0.6s"></div>
          <div class="spinner-dot" style="--delay: 0.8s"></div>
        </div>
        {#if showLogo}
          <div class="message">{currentMessages[0]}</div>
        {/if}
      </div>
    {:else if isXP}
      <div class="xp-boot">
        <div class="xp-progress">
          <div class="xp-bar">
            <div class="xp-blocks">
              {#each Array(3) as _, i}
                <div class="block" style="animation-delay: {i * 0.2}s"></div>
              {/each}
            </div>
          </div>
        </div>
        {#if showLogo}
          <div class="message">{currentMessages[bootStage]}</div>
        {/if}
      </div>
    {:else if isVista}
      <div class="vista-boot">
        <div class="vista-progress">
          <div class="vista-dots">
            {#each Array(5) as _, i}
              <div class="dot" style="animation-delay: {i * 0.2}s"></div>
            {/each}
          </div>
        </div>
        {#if showLogo}
          <div class="message">{currentMessages[bootStage]}</div>
        {/if}
      </div>
    {:else}
      <div class="classic-boot">
        {#if showLogo}
          <div class="message">{currentMessages[bootStage]}</div>
          <div class="progress-bar">
            <div class="progress" style="width: {progress}%"></div>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  .boot-screen {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #000;
    color: white;
    font-family: "Segoe UI", "MS Sans Serif", sans-serif;
    overflow: hidden;
  }

  .content {
    position: relative;
    z-index: 2;
    text-align: center;
  }

  .logo {
    margin-bottom: 20px;
    animation: fadeIn 0.5s ease-out;
  }

  .logo-icon {
    font-size: 64px;
    margin-bottom: 10px;
    animation: glow 1s infinite alternate;
  }

  .logo-text {
    font-size: 36px;
    font-weight: bold;
    background: linear-gradient(45deg, #fff, #7af, #fff);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    text-shadow: 0 0 5px rgba(122,170,255,0.5);
  }

  /* Space background */
  .stars {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #000 url('data:image/svg+xml,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="black"/><g fill="white">%3Ccircle cx="24" cy="30" r="1"/%3E%3Ccircle cx="65" cy="85" r="1"/%3E%3Ccircle cx="120" cy="50" r="1"/%3E%3Ccircle cx="180" cy="160" r="1"/%3E%3Ccircle cx="150" cy="30" r="1"/%3E%3Ccircle cx="95" cy="140" r="1"/%3E%3Ccircle cx="40" cy="160" r="1"/%3E%3Ccircle cx="180" cy="80" r="1"/%3E%3Ccircle cx="10" cy="100" r="1"/%3E%3Ccircle cx="85" cy="30" r="1"/%3E</g></svg>') repeat;
    animation: rotate 100s linear infinite;
  }

  .twinkling {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, 
      rgba(255,255,255,0.1) 0%,
      rgba(255,255,255,0) 20%,
      rgba(255,255,255,0.1) 40%,
      rgba(255,255,255,0) 60%,
      rgba(255,255,255,0.1) 80%,
      rgba(255,255,255,0) 100%
    );
    animation: twinkle 2s ease-in-out infinite;
  }

  .message {
    text-align: center;
    margin-top: 20px;
    font-size: 18px;
    text-shadow: 0 0 5px rgba(122,170,255,0.5);
  }

  /* Classic (Windows 98) Boot */
  .classic-boot {
    text-align: center;
  }

  .classic-boot .message {
    color: white;
    font-family: "MS Sans Serif", sans-serif;
    margin-bottom: 20px;
  }

  .progress-bar {
    width: 300px;
    height: 20px;
    border: 2px solid #7af;
    background: rgba(0,0,0,0.5);
    box-shadow: 0 0 10px rgba(122,170,255,0.5);
  }

  .progress {
    height: 100%;
    background: linear-gradient(90deg, #7af, #fff, #7af);
    transition: width 0.3s ease;
  }

  /* Windows XP Boot */
  .xp-boot {
    text-align: center;
  }

  .xp-progress {
    width: 300px;
    height: 20px;
    background: rgba(255,255,255,0.1);
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 0 20px rgba(122,170,255,0.3);
  }

  .xp-blocks {
    display: flex;
    height: 100%;
  }

  .block {
    width: 20px;
    height: 100%;
    background: linear-gradient(90deg, #7af, #fff);
    margin-right: 2px;
    animation: slide 0.75s infinite;
    transform-origin: left center;
    box-shadow: 0 0 10px rgba(122,170,255,0.5);
  }

  /* Vista/7 Boot */
  .vista-boot {
    text-align: center;
  }

  .vista-dots {
    display: flex;
    justify-content: center;
    gap: 10px;
  }

  .dot {
    width: 10px;
    height: 10px;
    background: #7af;
    border-radius: 50%;
    animation: pulse 0.75s infinite;
    box-shadow: 0 0 10px rgba(122,170,255,0.5);
  }

  /* Modern (Windows 10/11) Boot */
  .modern-boot {
    text-align: center;
  }

  .spinner {
    display: flex;
    justify-content: center;
    gap: 5px;
  }

  .spinner-dot {
    width: 8px;
    height: 8px;
    background: #7af;
    border-radius: 50%;
    animation: bounce 0.75s infinite;
    animation-delay: var(--delay);
    box-shadow: 0 0 10px rgba(122,170,255,0.5);
  }

  @keyframes slide {
    0% { transform: scaleX(0); }
    50% { transform: scaleX(1); }
    100% { transform: scaleX(0); }
  }

  @keyframes pulse {
    0% { transform: scale(0.5); opacity: 0.3; }
    50% { transform: scale(1); opacity: 1; }
    100% { transform: scale(0.5); opacity: 0.3; }
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes twinkle {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 1; }
  }

  @keyframes fadeIn {
    from { 
      opacity: 0; 
      transform: translateY(-10px);
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }

  @keyframes glow {
    from { 
      text-shadow: 0 0 5px rgba(122,170,255,0.5);
    }
    to { 
      text-shadow: 0 0 10px rgba(122,170,255,0.8), 
                   0 0 15px rgba(122,170,255,0.6);
    }
  }
</style> 