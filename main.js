const {
  app,
  Tray,
  nativeImage,
  BrowserWindow,
  globalShortcut,
} = require("electron");
const path = require("path");

let tray;
let window;

app.on("ready", () => {
  // Initialise tray
  let icon = nativeImage.createFromPath("./images/icon-crop.png");
  icon = icon.resize({ width: 16, height: 16 });
  tray = new Tray(icon);
  tray.on("click", toggleWindowVisibility);

  // Initialise menu
  window = new BrowserWindow({
    // width: 320,
    // height: 240,
    width: 640,
    height: 480,
    show: false,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    webPreferences: { nodeIntegration: true },
  });

  // Ensure window appears on top of fullscreen applications
  window.setAlwaysOnTop(true, "floating");
  window.setVisibleOnAllWorkspaces(true);
  window.fullScreenable = false;

  // Set the window's content
  window.loadURL(path.join("file://", __dirname, "index.html"));

  window.on("blur", () => {
    if (!window.webContents.isDevToolsOpened()) {
      window.hide();
    }
  });

  // Configure keyboard shortcuts
  globalShortcut.register("CommandOrControl+P", () => {
    window.webContents.send("togglepause");
  });
  globalShortcut.register("CommandOrControl+L", () => {
    window.webContents.send("switchchannels");
  });
});

const toggleWindowVisibility = () => {
  if (window.isVisible()) {
    window.hide();
  } else {
    app.dock.hide(); // Needed to ensure window appears on top of fullscreen apps
    showWindow();
  }
};

const showWindow = () => {
  const trayPos = tray.getBounds();
  const windowPos = window.getBounds();

  const yScale = process.platform == "darwin" ? 1 : 10;
  const x = Math.round(trayPos.x + trayPos.width / 2 - windowPos.width / 2);
  const y = Math.round(trayPos.y + trayPos.height * yScale);

  window.setPosition(x, y + 16, false);
  window.show();
  window.focus();
};
