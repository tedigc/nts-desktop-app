const {
  app,
  Tray,
  nativeImage,
  BrowserWindow,
  globalShortcut
} = require("electron");
const path = require("path");

let tray;
let window;

app.on("ready", () => {
  // Initialise tray
  const icon = nativeImage.createFromDataURL(base64Icon);
  tray = new Tray(icon);
  tray.on("click", function(event) {
    toggleWindow();

    // Show devtools when command clicked
    if (window.isVisible() && process.defaultApp && event.metaKey) {
      window.openDevTools({ mode: "detach" });
    }
  });

  // Initialise menu
  window = new BrowserWindow({
    width: 550,
    height: 400,
    show: false,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // Ensure window appears on top of fullscreen applications
  window.setAlwaysOnTop(true, "floating");
  window.setVisibleOnAllWorkspaces(true);
  window.setFullScreenable(false);

  // Set the window's content
  window.loadURL(path.join("file://", __dirname, "index.html"));

  window.on("blur", () => {
    if (!window.webContents.isDevToolsOpened()) {
      window.hide();
    }
  });

  // Configure keyboard shortcuts
  globalShortcut.register("CommandOrControl+P", () => {
    console.log("toggle pause");
    window.webContents.send("togglePause");
  });

  globalShortcut.register("CommandOrControl+L", () => {
    console.log("switch channels");
    window.webContents.send("switchChannels");
  });
});

const toggleWindow = () => {
  if (window.isVisible()) {
    window.hide();
  } else {
    app.dock.hide();
    showWindow();
  }
};

const showWindow = () => {
  const trayPos = tray.getBounds();
  const windowPos = window.getBounds();
  let x, y;
  if (process.platform == "darwin") {
    x = Math.round(trayPos.x + trayPos.width / 2 - windowPos.width / 2);
    y = Math.round(trayPos.y + trayPos.height);
  } else {
    x = Math.round(trayPos.x + trayPos.width / 2 - windowPos.width / 2);
    y = Math.round(trayPos.y + trayPos.height * 10);
  }

  window.setPosition(x, y + 16, false);
  window.show();
  window.focus();
};

const base64Icon =
  "data:image/png;base64,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";
