const { contextBridge, ipcRenderer } = require('electron')

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Future: Add methods for native operations
  // exportPDF: (data) => ipcRenderer.invoke('export-pdf', data),
  // saveFile: (path, data) => ipcRenderer.invoke('save-file', path, data),
  platform: process.platform,
})
