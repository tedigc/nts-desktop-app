const { ipcRenderer } = require("electron");

const stream1 = "https://stream-relay-geo.ntslive.net/stream?client=NTSWebApp";
const stream2 = "https://stream-relay-geo.ntslive.net/stream2?client=NTSWebApp";

const versionEl = document.querySelector("#debug");
const audio = new Audio(stream2);
let paused = true;

ipcRenderer.on("togglePause", () => {
  if (paused) {
    paused = false;
    audio.play();
  } else {
    paused = true;
    audio.pause();
  }
  versionEl.innerText = paused ? "Paused" : "Playing";
});
