import { ElectronAPI } from '@electron-toolkit/preload'
import { ScreenSize } from '../main/ScreenShort'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      initialize():Promise<ScreenSize>,
      source():Promise<string>,
      cancel(): void,
      save(url:string):Record<"status","success"|"cancel">
    }
  }
}
