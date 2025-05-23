<script lang="ts">
  import { onMount } from 'svelte';

  export let windowPos = { x: 400, y: 150 };
  export let windowSize = { width: 500, height: 400 };
  export let onClose = () => {};
  
  let isDragging = false;
  let dragStart = { x: 0, y: 0 };
  let isResizing = false;
  let resizeStart = { x: 0, y: 0 };
  let initialSize = { width: 0, height: 0 };
  let isMinimized = false;
  let files: Array<{
    id: string;
    name: string;
    date: string;
    status: 'shared' | 'received';
  }> = [];
  let selectedFile: string | null = null;

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

  function formatDate(date: string): string {
    return new Date(date).toLocaleString();
  }

  function selectFile(id: string) {
    selectedFile = selectedFile === id ? null : id;
  }

  function loadFiles() {
    const storedFiles = localStorage.getItem('encryptonator_files');
    if (storedFiles) {
      files = JSON.parse(storedFiles);
    }
  }

  function deleteFile(id: string) {
    files = files.filter(f => f.id !== id);
    localStorage.setItem('encryptonator_files', JSON.stringify(files));
    selectedFile = null;
  }

  // Subscribe to storage events to update files when changed from other components
  onMount(() => {
    loadFiles();
    window.addEventListener('storage', (e) => {
      if (e.key === 'encryptonator_files') {
        loadFiles();
      }
    });

    // Custom event for file updates
    window.addEventListener('encryptonator_file_update', () => {
      loadFiles();
    });
  });
</script>

<svelte:window 
  on:mousemove={handleMouseMove}
  on:mouseup={handleMouseUp}
/>

<div
  class="window file-explorer"
  class:minimized={isMinimized}
  style="position: fixed; left: {windowPos.x}px; top: {windowPos.y}px; width: {windowSize.width}px; height: {isMinimized ? 'auto' : windowSize.height + 'px'};"
  on:mousedown={handleMouseDown}
>
  <div class="title-bar">
    <div class="title-bar-text">
      Message History
    </div>
    <div class="title-bar-controls">
      <button aria-label="Minimize" on:click={toggleMinimize}></button>
      <button aria-label="Maximize"></button>
      <button aria-label="Close" on:click={onClose}></button>
    </div>
  </div>

  <div class="window-body" style="display: {isMinimized ? 'none' : 'block'};">
    <div class="file-list">
      <table>
        <thead>
          <tr>
            <th>Message Name</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each files as file}
            <tr 
              class:selected={selectedFile === file.id}
              on:click={() => selectFile(file.id)}
            >
              <td>
                <span class="file-icon">{file.status === 'shared' ? '📤' : '📥'}</span>
                {file.name}
              </td>
              <td>{formatDate(file.date)}</td>
              <td>
                <span class="status-badge {file.status}">
                  {file.status === 'shared' ? 'Shared' : 'Received'}
                </span>
              </td>
              <td>
                <button 
                  class="delete-btn"
                  on:click|stopPropagation={() => deleteFile(file.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>

  <div 
    class="resize-handle"
    style="display: {isMinimized ? 'none' : 'block'};"
    on:mousedown={handleResizeMouseDown}
  ></div>
</div>

<style>
  .file-explorer {
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 100;
  }

  .window-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 8px;
    overflow: hidden;
  }

  .file-list {
    flex: 1;
    overflow: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th {
    text-align: left;
    padding: 4px 8px;
    border-bottom: 1px solid #808080;
    background: #c0c0c0;
    position: sticky;
    top: 0;
  }

  td {
    padding: 4px 8px;
    border-bottom: 1px solid #dfdfdf;
  }

  tr:hover {
    background: #c0c0c0;
  }

  tr.selected {
    background: #000080;
    color: white;
  }

  .file-icon {
    margin-right: 8px;
  }

  .delete-btn {
    padding: 2px 6px;
    font-size: 11px;
  }

  .status-badge {
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 11px;
    font-weight: bold;
  }

  .status-badge.shared {
    background: #4CAF50;
    color: white;
  }

  .status-badge.received {
    background: #2196F3;
    color: white;
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