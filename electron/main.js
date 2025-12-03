import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let mainWindow

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
    },
    titleBarStyle: 'hiddenInset', // Nice macOS style
    backgroundColor: '#FFFDF7', // Match our cream-50 color
    show: false, // Don't show until ready
  })

  // Load the app
  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  // Intercept navigation to handle SPA routing
  mainWindow.webContents.on('will-navigate', (event, url) => {
    // Allow navigation in dev mode
    if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
      return
    }

    // In production, prevent navigation to file:// URLs (SPA routing issue)
    if (url.startsWith('file://')) {
      event.preventDefault()
      mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
    }
  })

  // Handle reload - always load index.html in production
  mainWindow.webContents.on('did-fail-load', () => {
    if (!(process.env.NODE_ENV === 'development' || !app.isPackaged)) {
      mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
    }
  })

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // On macOS, re-create window when dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Future: Add IPC handlers for native file operations, database, etc.
// ipcMain.handle('export-pdf', async (event, data) => { ... })
