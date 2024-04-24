import { ElectronAPI } from '@electron-toolkit/preload'
import { ScreenSize } from '../main/ScreenShort'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      initialize():Promise<ScreenSize>,
      source():Promise<string>,
      cancel(): void,
      show(callBack:(data:string)=>void):void,
      save(url:string,capture:{x:number,y:number,w:number,h:number}):Record<"status","success"|"cancel">
    }
  }
}
