import { is } from "@electron-toolkit/utils";
import { BrowserWindow, app, desktopCapturer, dialog, nativeImage, screen, shell } from "electron";
import { join } from "path";
import fs from "fs";
import icon from '../../resources/icon.png?asset';


export interface ScreenSize {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
    scaleFactor: number;
}

export default class ScreenShort {

    public win: BrowserWindow;

    //窗口是否可见
    protected isShow = false

    protected size = this.getDisplaySize()

    constructor() {
        this.win = this.createWindow(this.size)
    }

    public getDisplaySize() {
        const point = screen.getCursorScreenPoint();
        const { id, bounds, scaleFactor } = screen.getDisplayNearestPoint(point);

        return {
            id,
            x: Math.floor(bounds.x),
            y: Math.floor(bounds.y),
            width: Math.floor(bounds.width),
            height: Math.floor(bounds.height),
            scaleFactor,
        };
    }

    protected createWindow(screenSize: ScreenSize): BrowserWindow {
        // Create the browser window.
        const mainWindow = new BrowserWindow({
            title: "ScreenShort",
            x: screenSize.x,
            y: screenSize.y,
            width: screenSize.width,
            height: screenSize.height,
            //隐藏macOS的红绿灯按钮
            frame: false,
            //窗口的类型,panel 类型，窗口浮于全屏应用顶部
            type: "panel",
            show: false,
            //总是显示在顶部
            alwaysOnTop: true,
            //是否可以缩放
            resizable: false,
            //窗口是否可移动
            movable: false,
            //背景透明
            transparent: true,
            //窗口是否可最小化
            minimizable: false,
            //窗口是否最大化
            maximizable: false,
            focusable: true,
            skipTaskbar: true,
            hasShadow: false,
            //禁止全屏
            fullscreen: false,
            fullscreenable: false,
            kiosk: true,
            titleBarStyle: 'hidden',
            roundedCorners: false,
            //macOS 使窗口尺寸可大于屏幕的大小
            enableLargerThanScreen: false,
            paintWhenInitiallyHidden: true,
            autoHideMenuBar: true,
            ...(process.platform === 'linux' ? { icon } : {}),
            webPreferences: {
                preload: join(__dirname, '../preload/index.js'),
                sandbox: false,
            }
        })

        mainWindow.webContents.openDevTools()

        mainWindow.webContents.setWindowOpenHandler((details) => {
            shell.openExternal(details.url)
            return { action: 'deny' }
        })

        // HMR for renderer base on electron-vite cli.
        // Load the remote URL for development or the local html file for production.
        if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
            mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
        } else {
            mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
        }

        return mainWindow
    }

    public async show() {
        if (this.isShow) return
        const displayCapture = await this.displayCapture()
        this.isShow = true
        this.win.show()
        this.win.webContents.send("SCREEN:SHOW", displayCapture)
    }

    public async cancel(e: Electron.IpcMainInvokeEvent) {
        return await new Promise(resolve => {
            this.isShow = false
            this.win.hide()
            resolve(true)
        })
    }

    public async displayCapture() {
        return await desktopCapturer.getSources({ types: ['window', 'screen'], thumbnailSize: { width: this.size.width, height: this.size.height } }).then(sources => {
            for (const source of sources) {
                if (source.name === 'Screen 2') {
                    return `data:image/png;base64,${source.thumbnail.toPNG().toString("base64")}`
                }
            }
        })
    }

    public async save(e: Electron.IpcMainInvokeEvent, url: string, capture: { x: number, y: number, w: number, h: number }) {

        const { x, y, w, h } = capture;
        const defaultPath = `${app.getPath("downloads")}/hubsky-${new Date().getTime()}.png`;

        const path = dialog.showSaveDialogSync(this.win, {
            title: '保存截图',
            defaultPath: defaultPath,
            buttonLabel: 'Save',
            filters: [
                { name: 'Images', extensions: ['png'] }
            ]
        });

        const store = (path: string) => {
            if (!path) return { status: "cancel" }
            const png = nativeImage.createFromDataURL(url).crop({ x, y, width: w, height: h }).toPNG();
            fs.writeFileSync(path, png)
            return { status: "success" };
        }

        return store(path!)
    }
}