import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'


// Custom APIs for renderer
const api = {
  initialize:() => ipcRenderer.invoke("SCREEN:SIZE"),
  show:(callBack) => ipcRenderer.on("SCREEN:SHOW",(_event,data) => callBack(data)),
  cancel:() => ipcRenderer.invoke("SCREEN:CANCEL"),
  source:() => ipcRenderer.invoke("SCREEN:SOURCE"),
  save:(url:string,capture) => ipcRenderer.invoke("SCREEN:SAVE",url,capture),
};

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
