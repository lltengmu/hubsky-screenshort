import { ipcMain } from "electron";
import ScreenShort from "./ScreenShort";

export default (screenShort: ScreenShort) => {
    ipcMain.handle('SCREEN:CANCEL', screenShort.cancel.bind(screenShort))
    ipcMain.handle('SCREEN:SIZE', screenShort.getDisplaySize.bind(screenShort))
    // ipcMain.handle('SCREEN:SOURCE', screenShort.capture.bind(screenShort))
}