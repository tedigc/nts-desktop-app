const { ipc, remote, globalShortcut } = require("electron");

remote.require("./main.js");
remote.on("testBindRemote", function(event) {
  console.log(event + " - test - from remote index.js");
  versionEl.innerText = "hello";
});

const stream1 = "https://stream-relay-geo.ntslive.net/stream?client=NTSWebApp";
const stream2 = "https://stream-relay-geo.ntslive.net/stream2?client=NTSWebApp";

const versionEl = document.querySelector("#debug");
const audio = new Audio(stream2);
let paused = true;

// document.addEventListener("keydown", () => {
//   if (paused) {
//     paused = false;
//     audio.play();
//   } else {
//     paused = true;
//     audio.pause();
//   }
//   versionEl.innerText = paused ? "Paused" : "Playing";
// });

// document.addEventListener("DOMContentLoaded", () => {
//   fetch("https://www.nts.live/api/v2/live")
//     .then(response)
//     .then(data);
// });

// document.addEventListener("DOMContentLoaded", () => {
//   let n = new Notification("You did it!", {
//     body: "Nice work."
//   });

//   // Tell the notification to show the menubar popup window on click
//   n.onclick = () => {
//     ipcRenderer.send("show-window");
//   };
// });
