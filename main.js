const { globalShortcut } = require("electron");
const { menubar } = require("menubar");

let currentStream = 1;

const mb = menubar({
  // icon: __dirname + "/nts.png",
  tooltip: "NTS mix",
  dir: __dirname,
  resizable: false,
  preloadWindow: true,
  browserWindow: {
    y: 32,
    width: 300,
    height: 240,
    alwaysOnTop: true
  }
});

mb.on("ready", () => {
  globalShortcut.register("CommandOrControl+P", () => {
    currentStream = currentStream === 1 ? 2 : 1;
    global.currentStream = currentStream;
    // mb.window.webContents.send("testBindRemote", "HelloWorld");
  });
});

mb.on("focus-lost", () => {
  mb.hideWindow();
});

mb.on("will-quit", () => {
  console.log("Exiting...");
  globalShortcut.unregister("CommandOrControl+P");
});
