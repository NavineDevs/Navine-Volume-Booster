let audioCtx;
let gainNode;
let source;

function initBoost(audioElement) {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  source = audioCtx.createMediaElementSource(audioElement);

  gainNode = audioCtx.createGain();
  gainNode.gain.value = 1;

  source.connect(gainNode);
  gainNode.connect(audioCtx.destination);
}

function setBoost(value) {
  if (gainNode) {
    gainNode.gain.value = value;
  }
}
