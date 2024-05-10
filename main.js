const { app, BrowserWindow, session, Tray, shell} = require('electron');
const path = require('path');

let mainWindow;
let appUrl = 'https://app.plex.tv/desktop/#!/';

app.on('ready', async () => {
    mainWindow = new BrowserWindow({
        width: 1920,
        height: 1080,
        webPreferences: {
            nodeIntegration: true,
        }
    });

    mainWindow.setMenu(null);

    mainWindow.webContents.on("new-window", function (event, url) {
        event.preventDefault();
        if (url !== "about:blank#blocked") shell.openExternal(url);
    });

    await mainWindow.loadURL(appUrl, {userAgent: 'Chrome'});

    session.defaultSession.cookies.on('changed', (event, cookie, cause, removed) => {
        if (!removed) {
            app.setLoginItemSettings({
                openAtLogin: true,
                path: app.getPath('userData'),
                args: [
                    '--authToken=' + cookie.value
                ]
            });
        }
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});

function toggleWindow() {
    if (mainWindow.isVisible()) {
        mainWindow.hide();
    } else {
        mainWindow.show();
    }
}
