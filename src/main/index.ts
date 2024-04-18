import { electronApp, optimizer } from '@electron-toolkit/utils'
import { app, globalShortcut } from 'electron'
import ScreenShort from './ScreenShort'
import registerIpcMain from './ipcMain'
import registerShortcut from './shortcut'

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {

  const screenShort = new ScreenShort();

  app.dock.hide()

  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    // if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
  //注册主进程通信事件
  registerIpcMain(screenShort)
  //注册快捷方式
  registerShortcut(screenShort)
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

app.on("will-quit", () => {
  //注销所有快捷键
  globalShortcut.unregisterAll()
})