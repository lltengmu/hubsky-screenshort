import { app, globalShortcut } from "electron"
import ScreenShort from "./ScreenShort"

export default (screenShort: ScreenShort) => {
    // 注册一个'CommandOrControl+M' 快捷键监听器 触发开始截图
    globalShortcut.register('CommandOrControl+M', screenShort.show.bind(screenShort))
    // 注册一个'CommandOrControl+Q' 快捷键监听器 触发退出app
    globalShortcut.register('CommandOrControl+Q', () => {
        app.quit()
    })
}