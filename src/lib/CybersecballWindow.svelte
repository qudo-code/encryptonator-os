<script lang="ts">
  import { onMount } from 'svelte';
  
  export let windowPos = { x: 150, y: 150 };
  export let windowSize = { width: 400, height: 600 };
  export let onClose = () => {};
  
  let isDragging = false;
  let dragStart = { x: 0, y: 0 };
  let isResizing = false;
  let resizeStart = { x: 0, y: 0 };
  let initialSize = { width: 0, height: 0 };
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let isMinimized = false;
  let score = 0;
  let animationFrame: number;
  let isPaused = false;
  let highScore = 0;

  // Game objects with improved sizes and speeds
  let ball = {
    x: 200,
    y: 300,
    radius: 8,
    dx: 0,
    dy: 0,
    speed: 8,
    color: '#00ff00'
  };

  let leftFlipper = {
    x: 120,
    y: 520,
    width: 80,
    height: 20,
    angle: 0.6,
    rotation: 0,
    power: 15
  };

  let rightFlipper = {
    x: 280,
    y: 520,
    width: 80,
    height: 20,
    angle: -0.6,
    rotation: 0,
    power: 15
  };

  // Cybersecurity-themed bumpers
  let bumpers = [
    { x: 150, y: 150, radius: 25, type: 'firewall', color: '#ff4444', points: 150 },
    { x: 250, y: 150, radius: 25, type: 'encryption', color: '#44ff44', points: 200 },
    { x: 200, y: 250, radius: 25, type: 'antivirus', color: '#4444ff', points: 100 },
    { x: 150, y: 350, radius: 20, type: 'bug', color: '#ffff44', points: 50 },
    { x: 250, y: 350, radius: 20, type: 'bug', color: '#ffff44', points: 50 }
  ];

  // Add walls for more interesting gameplay
  let walls = [
    { x1: 50, y1: 100, x2: 150, y2: 50, color: '#666666' },
    { x2: 350, y2: 50, x1: 250, y1: 100, color: '#666666' }
  ];

  let messages: { text: string; x: number; y: number; life: number; color: string }[] = [];

  function addFloatingText(text: string, x: number, y: number, color: string) {
    messages.push({ text, x, y, life: 50, color });
  }

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
      if (canvas) {
        canvas.width = windowSize.width;
        canvas.height = windowSize.height - 32; // Account for title bar
      }
    }
  }

  function handleMouseUp() {
    isDragging = false;
    isResizing = false;
  }

  function toggleMinimize() {
    isMinimized = !isMinimized;
    if (isMinimized) {
      pauseGame();
    } else {
      resumeGame();
    }
  }

  function handleClose() {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
    isPaused = true;
    onClose();
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (!isPaused) {
      if (event.key === 'z') {
        leftFlipper.rotation = leftFlipper.angle;
      }
      if (event.key === '/') {
        rightFlipper.rotation = rightFlipper.angle;
      }
      if (event.key === ' ' && ball.dy === 0) {
        launchBall();
      }
    }
  }

  function handleKeyUp(event: KeyboardEvent) {
    if (event.key === 'z') {
      leftFlipper.rotation = 0;
    }
    if (event.key === '/') {
      rightFlipper.rotation = 0;
    }
  }

  function launchBall() {
    if (ball.dy === 0) {
      ball.dy = -ball.speed * 0.7;
      ball.dx = (Math.random() - 0.5) * ball.speed * 0.8;
      addFloatingText('Launch!', ball.x, ball.y - 20, '#00ff00');
    }
  }

  function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    // Add glow effect
    ctx.shadowBlur = 10;
    ctx.shadowColor = ball.color;
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.closePath();
  }

  function drawFlipper(flipper: typeof leftFlipper) {
    ctx.save();
    ctx.translate(flipper.x, flipper.y);
    ctx.rotate(flipper.rotation);
    
    // Draw flipper with gradient
    const gradient = ctx.createLinearGradient(-flipper.width/2, 0, flipper.width/2, 0);
    gradient.addColorStop(0, '#4488ff');
    gradient.addColorStop(1, '#0044ff');
    ctx.fillStyle = gradient;
    
    // Rounded rectangle for flipper
    ctx.beginPath();
    ctx.roundRect(-flipper.width/2, -flipper.height/2, flipper.width, flipper.height, 10);
    ctx.fill();
    
    // Add cyber effect lines
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-flipper.width/3, 0);
    ctx.lineTo(flipper.width/3, 0);
    ctx.stroke();
    
    ctx.restore();
  }

  function drawBumpers() {
    bumpers.forEach(bumper => {
      ctx.beginPath();
      ctx.arc(bumper.x, bumper.y, bumper.radius, 0, Math.PI * 2);
      
      // Create gradient for bumper
      const gradient = ctx.createRadialGradient(
        bumper.x, bumper.y, 0,
        bumper.x, bumper.y, bumper.radius
      );
      gradient.addColorStop(0, bumper.color);
      gradient.addColorStop(1, '#000033');
      
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Add cyber effect
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Add icon based on type
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const icon = bumper.type === 'firewall' ? '🛡️' :
                   bumper.type === 'encryption' ? '🔒' :
                   bumper.type === 'antivirus' ? '🦠' : '🐛';
      ctx.fillText(icon, bumper.x, bumper.y);
      
      ctx.closePath();
    });
  }

  function drawWalls() {
    walls.forEach(wall => {
      ctx.beginPath();
      ctx.moveTo(wall.x1, wall.y1);
      ctx.lineTo(wall.x2, wall.y2);
      ctx.strokeStyle = wall.color;
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.closePath();
    });
  }

  function updateGame() {
    // Update ball position with smoother physics
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Gentler gravity
    ball.dy += 0.2;

    // Wall collisions with better energy preservation
    if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
      ball.dx *= -0.9;
      ball.x = ball.x < 0 ? ball.radius : canvas.width - ball.radius;
    }
    if (ball.y - ball.radius < 0) {
      ball.dy *= -0.9;
      ball.y = ball.radius;
    }
    if (ball.y + ball.radius > canvas.height) {
      ball.y = 300;
      ball.x = 200;
      ball.dx = 0;
      ball.dy = 0;
      if (score > highScore) {
        highScore = score;
        addFloatingText('New High Score!', canvas.width/2, canvas.height/2, '#ffff00');
      }
      score = Math.max(0, score - 500);
      addFloatingText('-500', ball.x, ball.y - 20, '#ff0000');
    }

    // Improved flipper collision detection and response
    [leftFlipper, rightFlipper].forEach(flipper => {
      const flipperAngle = flipper.rotation;
      const flipperCenterX = flipper.x;
      const flipperCenterY = flipper.y;
      
      // Calculate the ball's position relative to the flipper's center
      const dx = ball.x - flipperCenterX;
      const dy = ball.y - flipperCenterY;
      
      // Calculate the distance from the ball to the flipper's center
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Check if the ball is close enough to the flipper
      if (distance < flipper.width/2 + ball.radius) {
        // Calculate the angle of impact
        const impactAngle = Math.atan2(dy, dx);
        
        // Calculate the flipper's current velocity at the point of impact
        const flipperVelocity = Math.abs(flipper.rotation) * 2;
        
        // Apply the hit with both the flipper's power and current velocity
        const hitPower = flipper.power + flipperVelocity;
        
        // Calculate new velocities with some randomness for more interesting gameplay
        ball.dx = Math.cos(impactAngle) * hitPower + (Math.random() - 0.5);
        ball.dy = Math.sin(impactAngle) * hitPower * 0.8; // Reduce vertical component slightly
        
        // Add visual feedback
        ball.color = '#00ffff';
        setTimeout(() => ball.color = '#00ff00', 100);
        
        // Add some "english" to the ball based on which side of the flipper was hit
        const sideHit = dx > 0 ? 1 : -1;
        ball.dx += sideHit * 2;
      }
    });

    // Bumper collisions with effects
    bumpers.forEach(bumper => {
      const dx = ball.x - bumper.x;
      const dy = ball.y - bumper.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < ball.radius + bumper.radius) {
        const angle = Math.atan2(dy, dx);
        ball.dx = Math.cos(angle) * ball.speed * 1.2;
        ball.dy = Math.sin(angle) * ball.speed * 1.2;
        score += bumper.points;
        addFloatingText(`+${bumper.points}`, bumper.x, bumper.y - 30, bumper.color);
        
        // Flash the ball
        ball.color = bumper.color;
        setTimeout(() => ball.color = '#00ff00', 100);
      }
    });

    // Update floating messages
    messages = messages.filter(msg => {
      msg.y -= 1;
      msg.life -= 1;
      return msg.life > 0;
    });
  }

  function draw() {
    if (!ctx || isPaused) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw cyberpunk background
    ctx.fillStyle = '#000033';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid effect
    ctx.strokeStyle = '#0066ff22';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 20) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    drawWalls();
    drawBumpers();
    drawFlipper(leftFlipper);
    drawFlipper(rightFlipper);
    drawBall();

    // Draw floating messages
    messages.forEach(msg => {
      ctx.fillStyle = `${msg.color}${Math.floor(msg.life * 5).toString(16)}`;
      ctx.font = '16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(msg.text, msg.x, msg.y);
    });

    // Draw scores with cyber effect
    ctx.fillStyle = '#00ff00';
    ctx.font = '20px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`SCORE: ${score}`, 10, 30);
    ctx.fillText(`HI-SCORE: ${highScore}`, 10, 60);

    updateGame();
  }

  function startGameLoop() {
    draw();
    animationFrame = requestAnimationFrame(startGameLoop);
  }

  function pauseGame() {
    isPaused = true;
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
  }

  function resumeGame() {
    isPaused = false;
    startGameLoop();
  }

  onMount(() => {
    if (canvas) {
      ctx = canvas.getContext('2d')!;
      canvas.width = windowSize.width;
      canvas.height = windowSize.height - 32; // Account for title bar
      startGameLoop();
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      isPaused = true;
    };
  });
</script>

<svelte:window 
  on:mousemove={handleMouseMove}
  on:mouseup={handleMouseUp}
  on:keydown={handleKeyDown}
  on:keyup={handleKeyUp}
/>

<div
  class="window pinball-window"
  class:minimized={isMinimized}
  style="position: fixed; left: {windowPos.x}px; top: {windowPos.y}px; width: {windowSize.width}px; height: {isMinimized ? 'auto' : windowSize.height + 'px'};"
  on:mousedown={handleMouseDown}
>
  <div class="title-bar">
    <div class="title-bar-text">
      Cybersecball
    </div>
    <div class="title-bar-controls">
      <button aria-label="Minimize" on:click={toggleMinimize}></button>
      <button aria-label="Maximize"></button>
      <button aria-label="Close" on:click={handleClose}></button>
    </div>
  </div>

  <div class="window-body" style="display: {isMinimized ? 'none' : 'block'}; height: calc(100% - 32px); padding: 0;">
    <canvas
      bind:this={canvas}
      style="width: 100%; height: 100%;"
    ></canvas>
    <div class="controls-hint">
      Controls: Z - Left Flipper, / - Right Flipper, Space - Launch Ball
    </div>
  </div>

  <div 
    class="resize-handle"
    style="display: {isMinimized ? 'none' : 'block'};"
    on:mousedown={handleResizeMouseDown}
  ></div>
</div>

<style>
  .pinball-window {
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 100;
  }

  .window-body {
    flex: 1;
    overflow: hidden;
    background: black;
    position: relative;
  }

  .controls-hint {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    color: #00ff00;
    font-family: monospace;
    font-size: 12px;
    background: rgba(0, 0, 33, 0.8);
    padding: 4px 8px;
    border: 1px solid #00ff00;
    border-radius: 4px;
    text-shadow: 0 0 5px #00ff00;
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