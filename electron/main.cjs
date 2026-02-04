const { app, BrowserWindow, ipcMain } = require('electron')
const { autoUpdater } = require('electron-updater')
const path = require('path')

let mainWindow = null

function createWindow() {
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
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#FFFDF7',
    show: false,
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
    if (process.env.NODE_ENV === 'development' || !app.isPackaged) return
    if (url.startsWith('file://')) {
      event.preventDefault()
      mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
    }
  })

  mainWindow.webContents.on('did-fail-load', () => {
    if (!(process.env.NODE_ENV === 'development' || !app.isPackaged)) {
      mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
    }
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// Auto-updater configuration
autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = true

// Auto-updater event handlers
autoUpdater.on('checking-for-update', () => {
  console.log('Checking for updates...')
})

autoUpdater.on('update-available', (info) => {
  console.log('Update available:', info.version)
  if (mainWindow) {
    mainWindow.webContents.send('update-available', info)
  }
})

autoUpdater.on('update-not-available', () => {
  console.log('App is up to date')
})

autoUpdater.on('error', (err) => {
  console.error('Update error:', err)
})

autoUpdater.on('download-progress', (progressObj) => {
  if (mainWindow) {
    mainWindow.webContents.send('download-progress', progressObj)
  }
})

autoUpdater.on('update-downloaded', () => {
  console.log('Update downloaded')
  if (mainWindow) {
    mainWindow.webContents.send('update-downloaded')
  }
})

// IPC handlers for update actions
ipcMain.on('download-update', () => {
  autoUpdater.downloadUpdate()
})

ipcMain.on('install-update', () => {
  autoUpdater.quitAndInstall()
})

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  createWindow()

  // Check for updates after app is ready (only in production)
  if (app.isPackaged) {
    setTimeout(() => {
      autoUpdater.checkForUpdates()
    }, 3000) // Wait 3 seconds after launch
  }

  app.on('activate', () => {
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