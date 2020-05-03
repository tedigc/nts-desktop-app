const { ipcRenderer } = require("electron");

// Stream controls
let channel = 0;
const streamData = [{}, {}];
const streams = [
  "https://stream-relay-geo.ntslive.net/stream?client=NTSWebApp",
  "https://stream-relay-geo.ntslive.net/stream2?client=NTSWebApp",
];

// DOM elements
const audioPlayer = document.querySelector("#audio-player");
const locationSpan = document.querySelector("#location");
const channelSpan = document.querySelector("#channel");
const timeSpan = document.querySelector("#time");
const nameSpan = document.querySelector("#name");

ipcRenderer.on("togglepause", () => {
  if (audioPlayer.paused) {
    // Play
    audioPlayer.setAttribute("src", streams[channel]);
    audioPlayer.load();
    audioPlayer.play();
  } else {
    // Pause
    audioPlayer.pause();
    audioPlayer.setAttribute("src", "");
  }
});

ipcRenderer.on("switchchannels", () => {
  channel ^= 1;
  updateUI(channel);
  audioPlayer.pause();
  audioPlayer.setAttribute("src", streams[channel]);
  audioPlayer.load();
  audioPlayer.play();
});

window.addEventListener("load", () => {
  fetch("https://www.nts.live/api/v2/live", { cache: "no-store" })
    .then((res) => res.json())
    .then((data) => {
      streamData[0] = apiToStreamData(data, 0);
      streamData[1] = apiToStreamData(data, 1);
      updateUI(channel);
    });
});

const updateUI = (channel) => {
  channelSpan.innerText = `${channel + 1}`;
  timeSpan.innerText = streamData[channel].time;
  nameSpan.innerHTML = streamData[channel].name;
  locationSpan.innerText = streamData[channel].location;
  document.body.style.backgroundImage = `url('${streamData[channel].background}')`;
};

const apiToStreamData = (data, channel) => {
  const { start_timestamp, end_timestamp } = data.results[channel].now;

  const start = new Date(start_timestamp);
  const end = new Date(end_timestamp);
  const startTimeString = start.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endTimeString = end.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const time = `${startTimeString} - ${endTimeString}`;

  const { name, description, media, location_long } = data.results[
    channel
  ].now.embeds.details;
  return {
    name,
    time,
    description,
    location: location_long,
    background: media.background_large,
  };
};
