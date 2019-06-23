const { ipcRenderer } = require("electron");

const streams = [
  "https://stream-relay-geo.ntslive.net/stream?client=NTSWebApp",
  "https://stream-relay-geo.ntslive.net/stream2?client=NTSWebApp"
];

const statusSpan = document.querySelector("#status");
const channelSpan = document.querySelector("#channel");
const locationSpan = document.querySelector("#location");

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
  channelSpan.innerText = `${channel + 1}`;

  audio.pause();
  delete audio;

  audio = new Audio(streams[channel]);
  audio.play();
});

window.addEventListener("load", () => {
  const headers = new Headers();
  headers.append("pragma", "no-cache");
  headers.append("cache-control", "no-cache");

  fetch("https://www.nts.live/api/v2/live", { headers })
    .then(res => res.json())
    .then(data => {
      const {
        name,
        description,
        media,
        location_long
      } = data.results[0].now.embeds.details;
      locationSpan.innerText = location_long;
      document.body.style.backgroundImage = `url('${
        media.background_medium_large
      }')`;
    });
});
