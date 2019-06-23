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
    audio = new Audio(streams[channel]);
    audio.play();
  } else {
    paused = true;
    audio.pause();
    delete audio;
  }
  statusSpan.innerText = paused ? "Paused" : "Playing";
});

ipcRenderer.on("switchChannels", () => {
  channel ^= 1;
  channelSpan.innerText = `Channel ${channel + 1}`;

  audio.pause();
  delete audio;

  audio = new Audio(streams[channel]);
  audio.play();
});
