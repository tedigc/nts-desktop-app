const { ipcRenderer } = require("electron");

const streams = [
  "https://stream-relay-geo.ntslive.net/stream?client=NTSWebApp",
  "https://stream-relay-geo.ntslive.net/stream2?client=NTSWebApp"
];

const statusSpan = document.querySelector("#status");
const channelSpan = document.querySelector("#channel");

let audio = new Audio(streams[0]);
let paused = true;
let channel = 0;

ipcRenderer.on("togglePause", () => {
  if (paused) {
    paused = false;
    audio.play();
  } else {
    paused = true;
    audio.pause();
  }
  statusSpan.innerText = paused ? "Paused" : "Playing";
});

ipcRenderer.on("switchChannels", () => {
  channel = channel === 0 ? 1 : 0;
  channelSpan.innerText = `Channel ${channel + 1}`;

  // Dispose of old object
  audio.pause();
  delete audio;

  // Initialise new one
  audio = new Audio(streams[channel]);
  audio.play();
});
