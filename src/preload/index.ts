import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { Chat, ClientInfo, Message } from 'whatsapp-web.js';

// Custom APIs for renderer
const api = {
    verifyVersionApp: () => ipcRenderer.invoke('verifyVersionApp'),
    installLatestVersionApp: () => ipcRenderer.invoke('installLatestVersionApp'),

    createNewWindow: (url: string) => ipcRenderer.invoke('open-new-window', url),

    getAppVersion: () => ipcRenderer.invoke("get-app-version"),
    getPlatform: () => ipcRenderer.invoke("get-platform"),
    minimize: () => ipcRenderer.send("minimize"),
    maximize: () => ipcRenderer.invoke("maximize"),
    isMaximized: () => ipcRenderer.invoke("isMaximized"),
    close: () => ipcRenderer.send("close"),
    onMaximizeChanged: (callback: (isMax: boolean) => void) => {
      ipcRenderer.on("maximize-changed", (_, value) => callback(value));
    },
}

const whatsappApi = {
  // Inicializa el cliente
  init: () => ipcRenderer.invoke('whatsapp-init'),
  
  // Escucha cambios de estado: qr, ready, loading, auth_failure, disconnected
  onStatus: (callback: (data: { status: string; qr?: string; error?: string }) => void) => {
    ipcRenderer.on('whatsapp-status', (_, data) => callback(data));
  },

  // Perfil del usuario actual
  onUser: (callback: (user: ClientInfo) => void) => {
    ipcRenderer.on('whatsapp-user', (_, user: ClientInfo) => callback(user));
  },

  // Chats iniciales
  onChats: (callback: (chats: Chat[]) => void) => {
    ipcRenderer.on('whatsapp-chats', (_, chats: Chat[]) => callback(chats));
  },

  // Mensajes entrantes
  onMessage: (callback: (msg: Message) => void) => {
    ipcRenderer.on('whatsapp-message', (_, msg: Message) => callback(msg));
  },

  getMessagesChat: (chatId: string) => ipcRenderer.invoke('whatsapp-get-messages', chatId),
  downloadMedia: (messageId: string, chatId: string) => ipcRenderer.invoke('whatsapp-download-media', messageId, chatId)
};

export type Api = typeof api
export type WhatsappApi = typeof whatsappApi

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('whatsappApi', whatsappApi);
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
