import { Api, WhatsappApi } from './'
import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: Api
    whatsappApi: WhatsappApi
  }
}
