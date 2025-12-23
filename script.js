let audioContext;
let sourceNode;
let gainNode;

const audio = document.getElementById("audio");
const slider = document.getElementById("boostSlider");
const boostValue = document.getElementById("boostValue");

function initAudio() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();

  sourceNode = audioContext.createMediaElementSource(audio);
  gainNode = audioContext.createGain();

  gainNode.gain.value = 1;

  sourceNode.connect(gainNode);
  gainNode.connect(audioContext.destination);
}

audio.addEventListener("play", () => {
  if (!audioContext) {
    initAudio();
  }
});

slider.addEventListener("input", () => {
  const value = parseFloat(slider.value);
  boostValue.textContent = value.toFixed(1) + "x";

  if (gainNode) {
    gainNode.gain.value = value;
  }
});
