import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

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

export type Api = typeof api

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
