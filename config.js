const colorMap = {
  Red: "#ef4444",
  Blue: "#3b82f6",
  Yellow: "#facc15",
  Green: "#22c55e",
  White: "#f8fafc",
  Orange: "#fb923c"
};

const fallbackVehicles = [
  {
    name: "Car",
    type: "Everyday Vehicle",
    emoji: "🚗",
    color: "Blue",
    fact: "A car helps people go from one place to another."
  },
  {
    name: "Fire Truck",
    type: "Rescue Vehicle",
    emoji: "🚒",
    color: "Red",
    fact: "A fire truck carries firefighters, ladders, and water."
  }
];

const state = {
  vehicles: [],
  currentIndex: 0,
  voiceEnabled: true,
  findAnswer: null,
  colorAnswer: null,
  rewardProgress: 0
};

const el = {
  vehicleEmoji: document.getElementById("vehicleEmoji"),
  vehicleType: document.getElementById("vehicleType"),
  vehicleName: document.getElementById("vehicleName"),
  vehicleFact: document.getElementById("vehicleFact"),
  dataStatus: document.getElementById("dataStatus"),
  voiceToggle: document.getElementById("voiceToggle"),
  backButton: document.getElementById("backButton"),
  sayButton: document.getElementById("sayButton"),
  nextButton: document.getElementById("nextButton"),
  learnTab: document.getElementById("learnTab"),
  findTab: document.getElementById("findTab"),
  colorTab: document.getElementById("colorTab"),
  rewardTab: document.getElementById("rewardTab"),
  learnPanel: document.getElementById("learnPanel"),
  findPanel: document.getElementById("findPanel"),
  colorPanel: document.getElementById("colorPanel"),
  rewardPanel: document.getElementById("rewardPanel"),
  vehicleGrid: document.getElementById("vehicleGrid"),
  findQuestion: document.getElementById("findQuestion"),
  findGrid: document.getElementById("findGrid"),
  findMessage: document.getElementById("findMessage"),
  newFindQuestion: document.getElementById("newFindQuestion"),
  colorQuestion: document.getElementById("colorQuestion"),
  colorGrid: document.getElementById("colorGrid"),
  colorMessage: document.getElementById("colorMessage"),
  newColorQuestion: document.getElementById("newColorQuestion"),
  rewardVehicle: document.getElementById("rewardVehicle"),
  stars: document.getElementById("stars"),
  rewardMessage: document.getElementById("rewardMessage"),
  startDriveButton: document.getElementById("startDriveButton")
};

async function init() {
  bindEvents();

  const configuredUrl = window.CAR_APP_CONFIG?.dataUrl || "./data/cars.json";

  try {
    const response = await fetch(configuredUrl, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Data request failed: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("cars.json must contain a non-empty array.");
    }

    state.vehicles = data;
    el.dataStatus.textContent = "Data loaded from GitHub.";
  } catch (error) {
    console.warn("Using fallback vehicle data.", error);
    state.vehicles = fallbackVehicles;
    el.dataStatus.textContent = "Using fallback data. Check GitHub data URL.";
  }

  renderVehicle();
  renderVehicleGrid();
  createFindQuestion(false);
  createColorQuestion(false);
  renderStars();
}

function bindEvents() {
  el.backButton.addEventListener("click", previousVehicle);
  el.sayButton.addEventListener("click", speakCurrentVehicle);
  el.nextButton.addEventListener("click", nextVehicle);
  el.vehicleEmoji.addEventListener("click", speakCurrentVehicle);
  el.voiceToggle.addEventListener("click", toggleVoice);

  el.learnTab.addEventListener("click", () => setMode("learn"));
  el.findTab.addEventListener("click", () => setMode("find"));
  el.colorTab.addEventListener("click", () => setMode("color"));
  el.rewardTab.addEventListener("click", () => setMode("reward"));

  el.newFindQuestion.addEventListener("click", () => createFindQuestion(true));
  el.newColorQuestion.addEventListener("click", () => createColorQuestion(true));
  el.startDriveButton.addEventListener("click", startDrive);
}

function renderVehicle() {
  const vehicle = state.vehicles[state.currentIndex];

  el.vehicleEmoji.textContent = vehicle.emoji;
  el.vehicleEmoji.setAttribute("aria-label", vehicle.name);
  el.vehicleType.textContent = vehicle.type;
  el.vehicleName.textContent = vehicle.name;
  el.vehicleFact.textContent = vehicle.fact;
  el.rewardVehicle.textContent = vehicle.emoji;
}

function renderVehicleGrid() {
  el.vehicleGrid.innerHTML = "";

  state.vehicles.forEach((vehicle, index) => {
    const tile = createVehicleTile(vehicle);

    tile.addEventListener("click", () => {
      state.currentIndex = index;
      renderVehicle();
      speakCurrentVehicle();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    el.vehicleGrid.appendChild(tile);
  });
}

function createVehicleTile(vehicle) {
  const tile = document.createElement("button");
  tile.type = "button";
  tile.className = "tile";
  tile.innerHTML = `
    <span class="emoji">${vehicle.emoji}</span>
    <span class="name">${vehicle.name}</span>
  `;
  return tile;
}

function nextVehicle() {
  state.currentIndex = (state.currentIndex + 1) % state.vehicles.length;
  renderVehicle();
  speakCurrentVehicle();
}

function previousVehicle() {
  state.currentIndex = (state.currentIndex - 1 + state.vehicles.length) % state.vehicles.length;
  renderVehicle();
  speakCurrentVehicle();
}

function speakCurrentVehicle() {
  const vehicle = state.vehicles[state.currentIndex];
  speak(`${vehicle.name}. ${vehicle.fact}`);
}

function getPreferredKidVoice() {
  if (!window.speechSynthesis) return null;

  const voices = window.speechSynthesis.getVoices();

  const preferredVoiceNames = [
    "Google US English",
    "Microsoft Aria Online",
    "Microsoft Jenny Online",
    "Samantha",
    "Karen",
    "Moira"
  ];

  return (
    voices.find(voice => preferredVoiceNames.some(name => voice.name.includes(name))) ||
    voices.find(voice => voice.lang && voice.lang.toLowerCase().startsWith("en")) ||
    null
  );
}

function speak(text) {
  if (!state.voiceEnabled || !window.speechSynthesis) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  // Kid-friendly voice tuning:
  // Higher pitch, warm pacing, and animated delivery.
  utterance.rate = 0.76;
  utterance.pitch = 1.55;
  utterance.volume = 1;

  const preferredVoice = getPreferredKidVoice();
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  window.speechSynthesis.speak(utterance);
}

// Some browsers load voices after the page loads.
if (window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}

function toggleVoice() {
  state.voiceEnabled = !state.voiceEnabled;
  el.voiceToggle.textContent = state.voiceEnabled ? "Voice: On" : "Voice: Off";

  if (!state.voiceEnabled && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

function setMode(mode) {
  const modeMap = {
    learn: [el.learnTab, el.learnPanel],
    find: [el.findTab, el.findPanel],
    color: [el.colorTab, el.colorPanel],
    reward: [el.rewardTab, el.rewardPanel]
  };

  Object.values(modeMap).forEach(([tab, panel]) => {
    tab.classList.remove("active");
    panel.classList.add("hidden");
  });

  modeMap[mode][0].classList.add("active");
  modeMap[mode][1].classList.remove("hidden");

  if (mode === "find") speak(el.findQuestion.textContent);
  if (mode === "color") speak(el.colorQuestion.textContent);
  if (mode === "reward") speak("Road trip rewards. Answer questions to move the car.");
}

function createFindQuestion(useVoice) {
  state.findAnswer = randomItem(state.vehicles);

  el.findQuestion.textContent = `Can you find the ${state.findAnswer.name.toLowerCase()}?`;
  el.findMessage.textContent = "";
  el.findMessage.className = "message";

  const options = getOptions(state.findAnswer, state.vehicles);
  renderAnswerTiles(el.findGrid, options, state.findAnswer, el.findMessage);

  if (useVoice) speak(el.findQuestion.textContent);
}

function createColorQuestion(useVoice) {
  const vehiclesWithColor = state.vehicles.filter(vehicle => vehicle.color);
  state.colorAnswer = randomItem(vehiclesWithColor);

  el.colorQuestion.textContent = `Which vehicle is ${state.colorAnswer.color.toLowerCase()}?`;
  el.colorMessage.textContent = "";
  el.colorMessage.className = "message";

  const options = getOptions(state.colorAnswer, vehiclesWithColor);
  renderColorTiles(options);

  if (useVoice) speak(el.colorQuestion.textContent);
}

function renderAnswerTiles(container, options, answer, messageElement) {
  container.innerHTML = "";

  options.forEach(vehicle => {
    const tile = createVehicleTile(vehicle);

    tile.addEventListener("click", () => {
      if (vehicle.name === answer.name) {
        tile.classList.add("correct");
        messageElement.textContent = "Great job!";
        messageElement.className = "message good";
        advanceReward();
        speak(`Great job. That is the ${vehicle.name}.`);
      } else {
        tile.classList.add("wrong");
        messageElement.textContent = "Try again.";
        messageElement.className = "message try";
        speak("Try again.");
      }
    });

    container.appendChild(tile);
  });
}

function renderColorTiles(options) {
  el.colorGrid.innerHTML = "";

  options.forEach(vehicle => {
    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = "tile";

    const swatch = colorMap[vehicle.color] || "#cbd5e1";

    tile.innerHTML = `
      <span class="emoji">${vehicle.emoji}</span>
      <span class="color-swatch" style="background:${swatch}"></span>
      <span class="name">${vehicle.name}</span>
    `;

    tile.addEventListener("click", () => {
      if (vehicle.name === state.colorAnswer.name) {
        tile.classList.add("correct");
        el.colorMessage.textContent = "You got it!";
        el.colorMessage.className = "message good";
        advanceReward();
        speak(`You got it. The ${vehicle.name} is ${vehicle.color}.`);
      } else {
        tile.classList.add("wrong");
        el.colorMessage.textContent = "Not that one. Try again.";
        el.colorMessage.className = "message try";
        speak("Not that one. Try again.");
      }
    });

    el.colorGrid.appendChild(tile);
  });
}

function startDrive() {
  if (state.rewardProgress >= 5) {
    state.rewardProgress = 0;
    el.rewardVehicle.style.left = "10px";
    el.rewardMessage.textContent = "New road trip started.";
    renderStars();
    speak("New road trip started.");
    return;
  }

  state.currentIndex = Math.floor(Math.random() * state.vehicles.length);
  renderVehicle();
  setMode("find");
  createFindQuestion(true);
}

function advanceReward() {
  state.rewardProgress = Math.min(5, state.rewardProgress + 1);
  const leftPercent = 10 + (state.rewardProgress / 5) * 78;
  el.rewardVehicle.style.left = `${leftPercent}%`;

  el.rewardMessage.textContent =
    state.rewardProgress === 5
      ? "Road trip complete. Great work!"
      : "Nice driving. Keep going!";

  renderStars();
}

function renderStars() {
  el.stars.innerHTML = "";

  for (let index = 0; index < 5; index++) {
    const star = document.createElement("div");
    star.className = index < state.rewardProgress ? "star active" : "star";
    star.textContent = "⭐";
    el.stars.appendChild(star);
  }
}

function getOptions(answer, source) {
  const others = shuffle(source.filter(item => item.name !== answer.name)).slice(0, 3);
  return shuffle([answer, ...others]);
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

init();
