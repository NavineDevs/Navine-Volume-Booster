(() => {
  "use strict";

  /* =========================
     ELEMENT REFERENCES
  ========================== */
  const urlForm = document.getElementById("urlForm");
  const urlInput = document.getElementById("urlInput");
  const loadBtn = document.getElementById("loadBtn");

  const frame = document.getElementById("siteFrame");

  const boostSlider = document.getElementById("boostSlider");
  const boostValue = document.getElementById("boostValue");

  /* =========================
     AUDIO CONTEXT (LIMITED)
     NOTE: Browsers do NOT allow
     direct iframe audio control.
  ========================== */
  let audioContext = null;
  let gainNode = null;
  let audioUnlocked = false;

  /* =========================
     HELPERS
  ========================== */

  function normalizeUrl(input) {
    let url = input.trim();

    if (!url) return null;

    // Auto add https:// if missing
    if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url;
    }

    try {
      new URL(url);
      return url;
    } catch {
      return null;
    }
  }

  function updateBoostUI(value) {
    boostValue.textContent = `${value.toFixed(1)}×`;
  }

  /* =========================
     AUDIO UNLOCK
     Required by browser policy
  ========================== */
  function unlockAudio() {
    if (audioUnlocked) return;

    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      gainNode = audioContext.createGain();
      gainNode.gain.value = boostSlider.value;

      audioUnlocked = true;
      console.info("[Booster] Audio context unlocked");
    } catch (err) {
      console.warn("[Booster] Audio unlock failed", err);
    }
  }

  /* =========================
     LOAD WEBSITE
  ========================== */
  function loadWebsite(url) {
    frame.src = "about:blank";

    // Small delay to ensure reload
    setTimeout(() => {
      frame.src = url;
    }, 50);
  }

  /* =========================
     EVENTS
  ========================== */

  // Form submit (load website)
  urlForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const normalized = normalizeUrl(urlInput.value);

    if (!normalized) {
      alert("Invalid URL");
      return;
    }

    unlockAudio();
    loadWebsite(normalized);
  });

  // Volume boost slider
  boostSlider.addEventListener("input", () => {
    const value = Number(boostSlider.value);
    updateBoostUI(value);

    if (gainNode) {
      gainNode.gain.value = value;
    }
  });

  // Unlock audio on first user interaction
  ["click", "touchstart", "keydown"].forEach((event) => {
    window.addEventListener(event, unlockAudio, { once: true });
  });

  // Iframe load detection
  frame.addEventListener("load", () => {
    console.info("[Booster] Website loaded:", frame.src);
  });

  /* =========================
     INIT
  ========================== */
  updateBoostUI(Number(boostSlider.value));

})();
