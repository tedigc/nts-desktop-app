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
const stream1 = document.querySelector("#stream-1");
const stream2 = document.querySelector("#stream-2");

// Play/pause the current stream
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

// Switch between stream channels and update the UI
ipcRenderer.on("switchchannels", () => {
  channel ^= 1;
  audioPlayer.pause();
  audioPlayer.setAttribute("src", streams[channel]);
  audioPlayer.load();
  audioPlayer.play();

  if (channel === 0) {
    stream1.classList.add("active-1");
    stream2.classList.add("inactive-2");
    stream1.classList.remove("inactive-1");
    stream2.classList.remove("active-2");
  } else {
    stream1.classList.add("inactive-1");
    stream2.classList.add("active-2");
    stream1.classList.remove("active-1");
    stream2.classList.remove("inactive-2");
  }
});

// Update the time, location, artist, and background image
const updateUi = (channel, streamData) => {
  const index = channel + 1;

  const nameSpan = document.querySelector(`#stream-${index}-name`);
  const timeSpan = document.querySelector(`#stream-${index}-time`);
  const locationSpan = document.querySelector(`#stream-${index}-location`);
  const streamDiv = document.querySelector(`#stream-${index}`);

  nameSpan.innerHTML = streamData[channel].name;
  timeSpan.innerText = streamData[channel].time;
  locationSpan.innerText = streamData[channel].location;
  streamDiv.style.backgroundImage = `url('${streamData[channel].background}')`;
};

// Format info from the NTS API into a leaner object
const apiToStreamData = (data, channel) => {
  // Format the start and end time for the current show
  const { start_timestamp, end_timestamp } = data.results[channel].now;
  const start = new Date(start_timestamp);
  const end = new Date(end_timestamp);
  const options = { hour: "2-digit", minute: "2-digit" };
  const startTimeString = start.toLocaleTimeString("en-GB", options);
  const endTimeString = end.toLocaleTimeString("en-GB", options);
  const time = `${startTimeString} - ${endTimeString}`;

  // Grab any other useful details
  const details = data.results[channel].now.embeds.details;
  const { name, description, media, location_long } = details;
  const location = location_long;
  const background = media.background_large;

  // Return a reduced subset of the stream info
  return { name, time, description, location, background };
};

// When the page first loads, fetch details about the current streams
window.addEventListener("load", () => {
  fetch("https://www.nts.live/api/v2/live", { cache: "no-store" })
    .then((res) => res.json())
    .then((data) => {
      streamData[0] = apiToStreamData(data, 0);
      streamData[1] = apiToStreamData(data, 1);
      updateUi(0, streamData);
      updateUi(1, streamData);
    });
});
