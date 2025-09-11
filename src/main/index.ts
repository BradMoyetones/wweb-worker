import { app, shell, BrowserWindow, ipcMain, protocol } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { installLatestVersionApp, verifyVersionApp } from './config/updater'
import { initializeClient } from '@core/lib/whatsappClient'
import { Client } from 'whatsapp-web.js'
import { getAllWorkflows } from './models/workflow'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1080,
    height: 700,
    minHeight: 700,
    minWidth: 1080,
    show: false,
    frame: process.platform === 'darwin' ? undefined : false, // Solo false en Windows/Linux, true en macOS
    titleBarStyle: process.platform === 'darwin' ? 'hidden' : undefined,
    titleBarOverlay: process.platform === 'darwin' ? { height: 64 } : undefined,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {icon}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true, // Asegúrate de que esté en true
      nodeIntegration: false, // Esto debe estar en false para evitar problemas de seguridad
      devTools: true,
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  mainWindow.on("maximize", () => {
    mainWindow.webContents.send("maximize-changed", true);
  });

  mainWindow.on("unmaximize", () => {
    mainWindow.webContents.send("maximize-changed", false);
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    // Error que me dio en producción
    // mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    mainWindow.loadFile(path.join(process.resourcesPath, 'app.asar.unpacked', 'out', 'renderer', 'index.html'))
  }
}

const openWindows = new Map<string, BrowserWindow>();

function createNewWindow(url: string): BrowserWindow {
  // Si ya existe una ventana con esta URL, enfócala y retorna
  for (const [openUrl, window] of openWindows.entries()) {
    if (openUrl === url && !window.isDestroyed()) {
      window.focus();
      return window;
    }
  }

  // Crea una nueva ventana si no existe
  const newWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    minHeight: 700,
    minWidth: 1080,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  newWindow.loadURL(url);

  // Guarda la ventana en el mapa
  openWindows.set(url, newWindow);

  // Elimina la ventana del mapa cuando se cierre
  newWindow.on('closed', () => {
    openWindows.delete(url);
  });

  return newWindow;
}



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  protocol.registerFileProtocol('safe-file', (request, callback) => {
    const url = request.url.replace('safe-file://', '');
    callback({ path: path.normalize(url) });
  });

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.handle("get-app-version", () => {
  return app.getVersion();
});
ipcMain.handle('verifyVersionApp', (_event) => {
  return verifyVersionApp();
});
ipcMain.handle('installLatestVersionApp', (_event) => {
  return installLatestVersionApp();
});

ipcMain.handle('get-platform', () => process.platform);

ipcMain.on('minimize', () => {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  if (focusedWindow) {
    focusedWindow.minimize();
  }
});

let isMaximized: boolean = false;
ipcMain.handle('maximize', () => {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  if (focusedWindow) {
    if (focusedWindow.isMaximized()) {
      focusedWindow.unmaximize();
      isMaximized = false;
    } else {
      focusedWindow.maximize();
      isMaximized = true;
    }
  }
  return isMaximized;
});
ipcMain.handle('isMaximized', () => {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  if (focusedWindow) {
    return focusedWindow.isMaximized();
  }
  return false;
});

ipcMain.on('close', () => {
  app.quit();
});

ipcMain.handle('open-new-window', (_event, url: string) => {
  createNewWindow(url);
});

// WHATSAPP
ipcMain.handle('whatsapp-init', async (event) => {
  try {
    await initializeClient(event.sender);
    return { success: true };
  } catch (err:any) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle("whatsapp-get-messages", async (event, chatId: string) => {
  try {
    const client = await initializeClient(event.sender) as Client | null;
    if(!client) return

    const chat = await client.getChatById(chatId);
    const messages = await chat.fetchMessages({ limit: 100 }); // últimos 50
    return messages;
  } catch (err) {
    console.error("Error fetching messages", err);
    return [];
  }
});

ipcMain.handle("whatsapp-download-media", async (event, messageId: string, chatId: string) => {
  try {
    const client = await initializeClient(event.sender) as Client | null;
    if (!client) return null;

    const chat = await client.getChatById(chatId);
    const messages = await chat.fetchMessages({ limit: 50 });

    const message = messages.find(m => m.id._serialized === messageId);
    if (!message) return null;

    if (!message.hasMedia) {
      return { error: "No media in message" };
    }

    const media = await message.downloadMedia();
    if (!media) {
      return { error: "Failed to download media" };
    }

    return media;
  } catch (err: any) {
    console.error("Error downloading media", err);
    return { error: err.message };
  }
});

ipcMain.handle("whatsapp-send-message", async (event, chatId: string, content: string, replyToId?: string | null) => {
  try {
    const client = await initializeClient(event.sender) as Client | null;
    if (!client) return { error: "No client initialized" };

    const chat = await client.getChatById(chatId);
    if (!chat) return { error: "Chat not found" };

    if (replyToId) {
      // buscar el mensaje al que queremos responder
      const messages = await chat.fetchMessages({ limit: 100 }); // búscalo en los últimos 100 por si acaso
      const msgToReply = messages.find(m => m.id._serialized === replyToId);

      if (!msgToReply) {
        return { error: "Message to reply not found" };
      }

      await msgToReply.reply(content, chatId);
      return { success: true, replied: true };
    } else {
      await client.sendMessage(chatId, content);
      return { success: true, replied: false };
    }
  } catch (err: any) {
    console.error("Error sending message", err);
    return { error: err.message };
  }
});


// DATABASE
ipcMain.handle('getAllWorkflows', (_event) => {
  return getAllWorkflows();
});