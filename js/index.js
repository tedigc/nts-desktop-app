const { ipcRenderer } = require("electron");

const streams = [
  "https://stream-relay-geo.ntslive.net/stream?client=NTSWebApp",
  "https://stream-relay-geo.ntslive.net/stream2?client=NTSWebApp"
];

const streamData = [{}, {}];

const channelSpan = document.querySelector("#channel");
const locationSpan = document.querySelector("#location");
const timeSpan = document.querySelector("#time");

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
});

ipcRenderer.on("switchChannels", () => {
  channel ^= 1;
  updateUI(channel);

  audio.pause();
  delete audio;

  audio = new Audio(streams[channel]);
  audio.play();
  paused = false;
});

window.addEventListener("load", () => {
  const headers = new Headers();
  headers.append("pragma", "no-cache");
  headers.append("cache-control", "no-cache");

  fetch("https://www.nts.live/api/v2/live", { headers })
    .then(res => res.json())
    .then(data => {
      streamData[0] = apiToStreamData(data, 0);
      streamData[1] = apiToStreamData(data, 1);
      updateUI(channel);
    });
});

const updateUI = channel => {
  channelSpan.innerText = `${channel + 1}`;
  locationSpan.innerText = streamData[channel].location;
  timeSpan.innerText = streamData[channel].time;
  document.body.style.backgroundImage = `url('${
    streamData[channel].background
  }')`;
};

const apiToStreamData = (data, channel) => {
  const { start_timestamp, end_timestamp } = data.results[channel].now;

  const start = new Date(start_timestamp);
  const end = new Date(end_timestamp);
  const startTimeString = start.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit"
  });
  const endTimeString = end.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit"
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
    background: media.background_medium
  };
};
