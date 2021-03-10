/* eslint global-require: off, no-console: off, @typescript-eslint/no-var-requires: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./src/main.prod.js` using webpack. This gives us some performance wins.
 */
import "core-js/stable";
import "regenerator-runtime/runtime";
import {
    app,
    BrowserWindow,
    shell,
    ipcMain,
    dialog,
    IpcMainInvokeEvent,
    IpcMainEvent,
    NewWindowWebContentsEvent,
} from "electron";
import { autoUpdater } from "electron-updater";
import log from "electron-log";
import fs from "fs";
import MenuBuilder from "./menu";
import store from "./storage";
import ErrnoException = NodeJS.ErrnoException;

export default class AppUpdater {
    constructor() {
        log.transports.file.level = "info";
        autoUpdater.logger = log;
        // eslint-disable-next-line promise/always-return,promise/catch-or-return
        autoUpdater.checkForUpdatesAndNotify().then(() => {});
    }
}

let mainWindow: BrowserWindow | null = null;
const windows: Map<number, BrowserWindow> = new Map();

console.log(store.get("counter"));

export function getStore(): Promise<number> {
    return store.get("counter");
}

if (process.env.NODE_ENV === "production") {
    const sourceMapSupport = require("source-map-support");
    sourceMapSupport.install();
}

if (
    process.env.NODE_ENV === "development" ||
    process.env.DEBUG_PROD === "true"
) {
    require("electron-debug")();
}

const installExtensions = async () => {
    const installer = require("electron-devtools-installer");
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    const extensions = ["REACT_DEVELOPER_TOOLS"];

    return installer
        .default(
            extensions.map((extensionName: string) => installer[extensionName]),
            forceDownload
        )
        .catch(console.log);
};

const notifyUpdateWindowIDs = (excludeId: number) => {
    const windowIds = Array.from(windows.keys());
    windows.forEach((w) => {
        if (w.id === excludeId) {
            return;
        }

        w.webContents.send("UpdateWindowIds", windowIds);
    });
};

const createNewWindow = () => {
    const newWindow = new BrowserWindow({
        show: true,
        width: 1024,
        height: 728,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    const windowId = newWindow.id;

    // eslint-disable-next-line promise/always-return,promise/catch-or-return
    newWindow.loadURL(`file://${__dirname}/index.html`).then(() => {});

    newWindow.on("closed", () => {
        console.log("closed", windowId);
        windows.delete(windowId);
        notifyUpdateWindowIDs(windowId);
    });

    windows.set(windowId, newWindow);
    notifyUpdateWindowIDs(windowId);
};

const createWindow = async () => {
    if (
        process.env.NODE_ENV === "development" ||
        process.env.DEBUG_PROD === "true"
    ) {
        await installExtensions();
    }

    mainWindow = new BrowserWindow({
        show: false,
        width: 1024,
        height: 728,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    await mainWindow.loadURL(`file://${__dirname}/index.html`);

    // @TODO: Use 'ready-to-show' event
    //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
    mainWindow.webContents.on("did-finish-load", () => {
        if (!mainWindow) {
            throw new Error(`"mainWindow" is not defined`);
        }
        if (process.env.START_MINIMIZED) {
            mainWindow.minimize();
        } else {
            mainWindow.show();
            mainWindow.focus();
        }
    });

    mainWindow.on("closed", () => {
        mainWindow = null;
    });

    const menuBuilder = new MenuBuilder(mainWindow);
    menuBuilder.buildMenu();

    // Open urls in the user's browser
    // eslint-disable-next-line no-shadow
    mainWindow.webContents.on(
        "new-window",
        // eslint-disable-next-line no-shadow
        (event: NewWindowWebContentsEvent, url) => {
            event.preventDefault();
            shell.openExternal(url);
        }
    );

    // Remove this if your app does not use auto updates
    // eslint-disable-next-line
    new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on("window-all-closed", () => {
    // Respect the OSX convention of having the application in memory even
    // after all windows have been closed
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.whenReady().then(createWindow).catch(console.log);

app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    // eslint-disable-next-line promise/always-return,promise/catch-or-return
    if (mainWindow === null) createWindow().then(() => {});
});

// @typescript-eslint/no-unused-vars
ipcMain.on("notify", () => {
    dialog.showErrorBox("Error", "Pizza");

    const root = fs.realpathSync("./LICENSE");
    console.log(root);
});

ipcMain.on(
    "write-to-file",
    // eslint-disable-next-line no-shadow
    (event: IpcMainEvent, fileName: string, message: string): void => {
        fs.writeFile(fileName, message, (err): void => {
            if (err) {
                console.log("Cant`t write to file", fileName);
            }
        });
        fs.readFile(
            fileName,
            "utf8",
            (err: ErrnoException | null, response: string) => {
                if (err) {
                    return console.log(err);
                }
                event.sender.send("get-message", response);
                windows.forEach(
                    (currentWindow: BrowserWindow, index: number) => {
                        if (currentWindow) {
                            currentWindow.webContents.send(
                                "get-message",
                                `${response}: ${index}`
                            );
                        }
                    }
                );
                return console.log("done");
            }
        );
    }
);

ipcMain.on("create-new-window", () => {
    createNewWindow();
});

// eslint-disable-next-line no-shadow
ipcMain.handle("get-counter", (_event: IpcMainInvokeEvent, key) => {
    return store.get(key);
});

// eslint-disable-next-line no-shadow
ipcMain.on("change-store", (_event: IpcMainEvent, key, value) => {
    store.set(key, value);
});

store.onDidChange("counter", (newValue: number, oldValue: number) => {
    console.log(oldValue, newValue);
    mainWindow?.webContents.send("get-new-counter", store.get("counter"));
    windows.forEach((currentWindow: BrowserWindow) => {
        if (currentWindow) {
            currentWindow.webContents.send(
                "get-new-counter",
                store.get("counter")
            );
        }
    });
});
