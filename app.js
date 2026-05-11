const fallbackVehicles = [
  {
    name: "Car",
    type: "Everyday Vehicle",
    emoji: "🚗",
    fact: "A car helps people go from one place to another."
  }
];

const state = {
  vehicles: [],
  currentIndex: 0,
  voiceEnabled: true
};

async function init() {
  try {
    const response = await fetch(window.CAR_APP_CONFIG.dataUrl);
    state.vehicles = await response.json();
  } catch {
    state.vehicles = fallbackVehicles;
  }

  bindEvents();
  renderVehicle();
}

function bindEvents() {
  document.getElementById("nextButton").addEventListener("click", nextVehicle);
  document.getElementById("backButton").addEventListener("click", previousVehicle);
  document.getElementById("sayButton").addEventListener("click", speakCurrentVehicle);

  document.getElementById("voiceToggle")
    .addEventListener("click", toggleVoice);
}

function renderVehicle() {
  const vehicle = state.vehicles[state.currentIndex];

  document.getElementById("vehicleEmoji").textContent = vehicle.emoji;
  document.getElementById("vehicleName").textContent = vehicle.name;
  document.getElementById("vehicleType").textContent = vehicle.type;
  document.getElementById("vehicleFact").textContent = vehicle.fact;
}

function nextVehicle() {
  state.currentIndex =
    (state.currentIndex + 1) % state.vehicles.length;

  renderVehicle();
  speakCurrentVehicle();
}

function previousVehicle() {
  state.currentIndex =
    (state.currentIndex - 1 + state.vehicles.length)
    % state.vehicles.length;

  renderVehicle();
  speakCurrentVehicle();
}

function toggleVoice() {
  state.voiceEnabled = !state.voiceEnabled;

  document.getElementById("voiceToggle").textContent =
    state.voiceEnabled
      ? "Voice: On"
      : "Voice: Off";
}

function randomPhrase() {
  const phrases =
    window.CAR_APP_CONFIG.phrases.intro;

  return phrases[
    Math.floor(Math.random() * phrases.length)
  ];
}

function getPreferredKidVoice() {
  const voices = window.speechSynthesis.getVoices();

  const preferred =
    window.CAR_APP_CONFIG.voice.preferredVoices;

  return (
    voices.find(v =>
      preferred.some(name =>
        v.name.includes(name)
      )
    ) ||
    voices.find(v =>
      v.lang &&
      v.lang.toLowerCase().startsWith("en")
    ) ||
    null
  );
}

function speak(text) {
  if (
    !state.voiceEnabled ||
    !window.speechSynthesis
  ) {
    return;
  }

  window.speechSynthesis.cancel();

  const utterance =
    new SpeechSynthesisUtterance(text);

  utterance.rate =
    window.CAR_APP_CONFIG.voice.rate;

  utterance.pitch =
    window.CAR_APP_CONFIG.voice.pitch;

  utterance.volume =
    window.CAR_APP_CONFIG.voice.volume;

  const preferredVoice =
    getPreferredKidVoice();

  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  window.speechSynthesis.speak(utterance);
}

function speakCurrentVehicle() {
  const vehicle = state.vehicles[state.currentIndex];

  speak(
    `${randomPhrase()} ${vehicle.name}! ${vehicle.fact}`
  );
}

if (window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}

init();
