const colorMap = {
  Red: "#ef4444",
  Blue: "#3b82f6",
  Yellow: "#facc15",
  Green: "#22c55e",
  White: "#f8fafc",
  Orange: "#fb923c",
  Black: "#111827",
  Gray: "#94a3b8"
};

const fallbackVehicles = [
  {
    name: "Car",
    type: "Everyday Vehicle",
    emoji: "🚗",
    color: "Blue",
    sound: "Vroom vroom",
    fact: "A car helps people go from one place to another.",
    job: "Carries people safely.",
    where: "On roads, streets, driveways, and parking lots.",
    safety: "Always sit in a car seat and wear a seat belt.",
    clue: "Which vehicle helps people go from one place to another?",
    parts: [
      { name: "Wheels", emoji: "⚙️", detail: "Wheels help the car roll." },
      { name: "Lights", emoji: "💡", detail: "Lights help drivers see." },
      { name: "Seat Belt", emoji: "🪑", detail: "A seat belt helps keep people safe." }
    ]
  }
];

const state = {
  vehicles: [],
  currentIndex: 0,
  voiceEnabled: true,
  findAnswer: null,
  colorAnswer: null,
  gameAnswer: null,
  gameRound: 1,
  gameScore: 0,
  correctCount: 0,
  totalTries: 0,
  bestScore: Number(localStorage.getItem("carGarageBestScore") || 0),
  answeredThisRound: false,
  speechTimers: []
};

const el = {
  vehicleEmoji: document.getElementById("vehicleEmoji"),
  vehicleBrand: document.getElementById("vehicleBrand"),
  vehicleType: document.getElementById("vehicleType"),
  vehicleName: document.getElementById("vehicleName"),
  vehicleFact: document.getElementById("vehicleFact"),
  vehicleCatchphrase: document.getElementById("vehicleCatchphrase"),
  vehicleSound: document.getElementById("vehicleSound"),
  dataStatus: document.getElementById("dataStatus"),
  voiceToggle: document.getElementById("voiceToggle"),
  backButton: document.getElementById("backButton"),
  sayButton: document.getElementById("sayButton"),
  nextButton: document.getElementById("nextButton"),

  learnTab: document.getElementById("learnTab"),
  brandsTab: document.getElementById("brandsTab"),
  partsTab: document.getElementById("partsTab"),
  findTab: document.getElementById("findTab"),
  colorTab: document.getElementById("colorTab"),
  gameTab: document.getElementById("gameTab"),
  scoreTab: document.getElementById("scoreTab"),

  learnPanel: document.getElementById("learnPanel"),
  brandsPanel: document.getElementById("brandsPanel"),
  partsPanel: document.getElementById("partsPanel"),
  findPanel: document.getElementById("findPanel"),
  colorPanel: document.getElementById("colorPanel"),
  gamePanel: document.getElementById("gamePanel"),
  scorePanel: document.getElementById("scorePanel"),

  vehicleGrid: document.getElementById("vehicleGrid"),
  brandGrid: document.getElementById("brandGrid"),
  deepTitle: document.getElementById("deepTitle"),
  vehicleJob: document.getElementById("vehicleJob"),
  vehicleWhere: document.getElementById("vehicleWhere"),
  vehicleSafety: document.getElementById("vehicleSafety"),
  learnMoreButton: document.getElementById("learnMoreButton"),

  partsTitle: document.getElementById("partsTitle"),
  partsGrid: document.getElementById("partsGrid"),

  findQuestion: document.getElementById("findQuestion"),
  findGrid: document.getElementById("findGrid"),
  findMessage: document.getElementById("findMessage"),
  newFindQuestion: document.getElementById("newFindQuestion"),

  colorQuestion: document.getElementById("colorQuestion"),
  colorGrid: document.getElementById("colorGrid"),
  colorMessage: document.getElementById("colorMessage"),
  newColorQuestion: document.getElementById("newColorQuestion"),

  gameRound: document.getElementById("gameRound"),
  liveScore: document.getElementById("liveScore"),
  playClueButton: document.getElementById("playClueButton"),
  gameQuestion: document.getElementById("gameQuestion"),
  gameGrid: document.getElementById("gameGrid"),
  gameMessage: document.getElementById("gameMessage"),
  nextGameQuestion: document.getElementById("nextGameQuestion"),

  finalScore: document.getElementById("finalScore"),
  scoreMessage: document.getElementById("scoreMessage"),
  scoreStars: document.getElementById("scoreStars"),
  correctCount: document.getElementById("correctCount"),
  totalTries: document.getElementById("totalTries"),
  bestScore: document.getElementById("bestScore"),
  resetScoreButton: document.getElementById("resetScoreButton")
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
  renderBrandGrid();
  createFindQuestion(false);
  createColorQuestion(false);
  createGameRound(false);
  updateScorePage();
}

function bindEvents() {
  el.backButton.addEventListener("click", previousVehicle);
  el.sayButton.addEventListener("click", speakCurrentVehicle);
  el.nextButton.addEventListener("click", nextVehicle);
  el.vehicleEmoji.addEventListener("click", speakCurrentVehicle);
  el.voiceToggle.addEventListener("click", toggleVoice);

  el.learnTab.addEventListener("click", () => setMode("learn"));
  el.brandsTab.addEventListener("click", () => setMode("brands"));
  el.partsTab.addEventListener("click", () => setMode("parts"));
  el.findTab.addEventListener("click", () => setMode("find"));
  el.colorTab.addEventListener("click", () => setMode("color"));
  el.gameTab.addEventListener("click", () => setMode("game"));
  el.scoreTab.addEventListener("click", () => setMode("score"));

  el.learnMoreButton.addEventListener("click", speakDeepLearning);
  el.newFindQuestion.addEventListener("click", () => createFindQuestion(true));
  el.newColorQuestion.addEventListener("click", () => createColorQuestion(true));

  el.playClueButton.addEventListener("click", speakGameClue);
  el.nextGameQuestion.addEventListener("click", nextGameRound);
  el.resetScoreButton.addEventListener("click", resetScore);
}

function renderVehicle() {
  const vehicle = state.vehicles[state.currentIndex];

  el.vehicleEmoji.textContent = vehicle.emoji;
  el.vehicleEmoji.setAttribute("aria-label", vehicle.name);
  el.vehicleBrand.textContent = `Brand: ${vehicle.brand || "Fun Car"}`;
  el.vehicleType.textContent = vehicle.type;
  el.vehicleName.textContent = vehicle.name;
  el.vehicleFact.textContent = vehicle.fact;
  el.vehicleCatchphrase.textContent = vehicle.catchphrase || "Beep beep, little driver.";
  el.vehicleSound.textContent = `Sound: ${vehicle.sound || "Vroom vroom"}`;

  el.deepTitle.textContent = `What does the ${vehicle.name} do?`;
  el.vehicleJob.textContent = vehicle.job || vehicle.fact;
  el.vehicleWhere.textContent = vehicle.where || "You can see it on the road.";
  el.vehicleSafety.textContent = vehicle.safety || "Always stay safe near vehicles.";

  renderParts();
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

function renderBrandGrid() {
  el.brandGrid.innerHTML = "";

  state.vehicles.forEach((vehicle, index) => {
    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = "tile";
    tile.innerHTML = `
      <span class="emoji">${vehicle.emoji}</span>
      <span class="name">${vehicle.brand || vehicle.name}</span>
      <span class="small-text">${vehicle.name}</span>
    `;

    tile.addEventListener("click", () => {
      state.currentIndex = index;
      renderVehicle();
      speak([
        `${vehicle.brand || "This brand"} makes this ${vehicle.name}.`,
        vehicle.brandFact || vehicle.fact,
        vehicle.catchphrase || "Beep beep."
      ]);
    });

    el.brandGrid.appendChild(tile);
  });
}

function renderParts() {
  const vehicle = state.vehicles[state.currentIndex];
  const parts = vehicle.parts || [];

  el.partsTitle.textContent = `${vehicle.name} Parts`;
  el.partsGrid.innerHTML = "";

  if (!parts.length) {
    el.partsGrid.innerHTML = "<p>No parts added yet.</p>";
    return;
  }

  parts.forEach(part => {
    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = "tile";
    tile.innerHTML = `
      <span class="emoji">${part.emoji || "🔧"}</span>
      <span class="name">${part.name}</span>
      <span class="part-detail">${part.detail}</span>
    `;

    tile.addEventListener("click", () => {
      speak(`${part.name}. ${part.detail}`);
    });

    el.partsGrid.appendChild(tile);
  });
}

function createVehicleTile(vehicle) {
  const tile = document.createElement("button");
  tile.type = "button";
  tile.className = "tile";
  tile.innerHTML = `
    <span class="emoji">${vehicle.emoji}</span>
    <span class="name">${vehicle.name}</span>
    <span class="small-text">${vehicle.brand || ""}</span>
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

  speak([
    `${randomPhrase("intro")} This is a ${vehicle.brand || ""} ${vehicle.name}.`,
    vehicle.catchphrase || "",
    vehicle.fact,
    `It sounds like ${vehicle.sound || "vroom vroom"}.`
  ]);
}

function speakDeepLearning() {
  const vehicle = state.vehicles[state.currentIndex];

  speak([
    `${vehicle.name}.`,
    vehicle.job || vehicle.fact,
    vehicle.where ? `You may see it ${vehicle.where}` : "",
    vehicle.safety ? `Safety tip. ${vehicle.safety}` : ""
  ]);
}

function getPreferredKidVoice() {
  if (!window.speechSynthesis) return null;

  const voices = window.speechSynthesis.getVoices();
  const preferred = window.CAR_APP_CONFIG?.voice?.preferredVoices || [];

  return (
    voices.find(v => preferred.some(name => v.name.includes(name))) ||
    voices.find(v => v.lang && v.lang.toLowerCase().startsWith("en")) ||
    null
  );
}

function clearSpeechTimers() {
  state.speechTimers.forEach(timer => clearTimeout(timer));
  state.speechTimers = [];
}

function speak(input) {
  const configVoice = window.CAR_APP_CONFIG?.voice || {};

  if (!state.voiceEnabled || !configVoice.enabled || !window.speechSynthesis) {
    return;
  }

  clearSpeechTimers();
  window.speechSynthesis.cancel();

  const chunks = Array.isArray(input)
    ? input.filter(Boolean)
    : String(input).split(/(?<=[.!?])\s+/).filter(Boolean);

  const preferredVoice = getPreferredKidVoice();
  const pause = configVoice.pauseBetweenChunksMs ?? 260;

  chunks.forEach((chunk, index) => {
    const timer = setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(chunk);

      utterance.rate = configVoice.rate ?? 0.88;
      utterance.pitch = configVoice.pitch ?? 1.18;
      utterance.volume = configVoice.volume ?? 1;

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      window.speechSynthesis.speak(utterance);
    }, index * pause);

    state.speechTimers.push(timer);
  });
}

function toggleVoice() {
  state.voiceEnabled = !state.voiceEnabled;
  el.voiceToggle.textContent = state.voiceEnabled ? "Voice: On" : "Voice: Off";

  if (!state.voiceEnabled && window.speechSynthesis) {
    clearSpeechTimers();
    window.speechSynthesis.cancel();
  }
}

function setMode(mode) {
  const modeMap = {
    learn: [el.learnTab, el.learnPanel],
    brands: [el.brandsTab, el.brandsPanel],
    parts: [el.partsTab, el.partsPanel],
    find: [el.findTab, el.findPanel],
    color: [el.colorTab, el.colorPanel],
    game: [el.gameTab, el.gamePanel],
    score: [el.scoreTab, el.scorePanel]
  };

  Object.values(modeMap).forEach(([tab, panel]) => {
    tab.classList.remove("active");
    panel.classList.add("hidden");
  });

  modeMap[mode][0].classList.add("active");
  modeMap[mode][1].classList.remove("hidden");

  if (mode === "brands") speak("Tap a car brand to learn.");
  if (mode === "parts") speak(`${state.vehicles[state.currentIndex].name} parts. Tap a part to learn.`);
  if (mode === "find") speak(el.findQuestion.textContent);
  if (mode === "color") speak(el.colorQuestion.textContent);
  if (mode === "game") speakGameClue();
  if (mode === "score") updateScorePage();
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
      state.totalTries += 1;

      if (vehicle.name === answer.name) {
        tile.classList.add("correct");
        messageElement.textContent = randomPhrase("correct");
        messageElement.className = "message good";
        state.correctCount += 1;
        speak([messageElement.textContent, `That is the ${vehicle.name}.`]);
      } else {
        tile.classList.add("wrong");
        messageElement.textContent = randomPhrase("retry");
        messageElement.className = "message try";
        speak(messageElement.textContent);
      }

      updateScorePage();
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
      state.totalTries += 1;

      if (vehicle.name === state.colorAnswer.name) {
        tile.classList.add("correct");
        el.colorMessage.textContent = randomPhrase("correct");
        el.colorMessage.className = "message good";
        state.correctCount += 1;
        speak([el.colorMessage.textContent, `The ${vehicle.name} is ${vehicle.color}.`]);
      } else {
        tile.classList.add("wrong");
        el.colorMessage.textContent = randomPhrase("retry");
        el.colorMessage.className = "message try";
        speak(el.colorMessage.textContent);
      }

      updateScorePage();
    });

    el.colorGrid.appendChild(tile);
  });
}

function createGameRound(useVoice) {
  state.answeredThisRound = false;
  state.gameAnswer = randomItem(state.vehicles);
  const clue = state.gameAnswer.clue || state.gameAnswer.fact || `Find the ${state.gameAnswer.name}.`;

  const maxRounds = window.CAR_APP_CONFIG?.game?.roundsPerGame || 5;

  el.gameRound.textContent = `${state.gameRound} / ${maxRounds}`;
  el.liveScore.textContent = state.gameScore;
  el.gameQuestion.textContent = clue;
  el.gameMessage.textContent = "";
  el.gameMessage.className = "message";

  const options = getOptions(state.gameAnswer, state.vehicles);
  renderGameTiles(options);

  if (useVoice) speakGameClue();
}

function renderGameTiles(options) {
  el.gameGrid.innerHTML = "";

  options.forEach(vehicle => {
    const tile = createVehicleTile(vehicle);

    tile.addEventListener("click", () => {
      if (state.answeredThisRound) return;

      state.totalTries += 1;
      state.answeredThisRound = true;

      if (vehicle.name === state.gameAnswer.name) {
        tile.classList.add("correct");
        state.correctCount += 1;
        state.gameScore += window.CAR_APP_CONFIG?.game?.pointsPerCorrect || 10;
        el.gameMessage.textContent = `${randomPhrase("correct")} +10 points`;
        el.gameMessage.className = "message good";
        speak([randomPhrase("correct"), `You picked the ${vehicle.name}.`]);
      } else {
        tile.classList.add("wrong");
        el.gameMessage.textContent = randomPhrase("retry");
        el.gameMessage.className = "message try";
        speak(["Good try.", `The answer was ${state.gameAnswer.name}.`]);
      }

      el.liveScore.textContent = state.gameScore;
      updateBestScore();
      updateScorePage();
    });

    el.gameGrid.appendChild(tile);
  });
}

function speakGameClue() {
  const clue = el.gameQuestion.textContent;
  speak([randomPhrase("gameStart"), clue]);
}

function nextGameRound() {
  const maxRounds = window.CAR_APP_CONFIG?.game?.roundsPerGame || 5;

  if (state.gameRound >= maxRounds) {
    updateBestScore();
    updateScorePage();
    setMode("score");
    speak([`Game finished.`, `You scored ${state.gameScore} points.`]);
    return;
  }

  state.gameRound += 1;
  createGameRound(true);
}

function updateBestScore() {
  if (state.gameScore > state.bestScore) {
    state.bestScore = state.gameScore;
    localStorage.setItem("carGarageBestScore", String(state.bestScore));
  }
}

function updateScorePage() {
  updateBestScore();

  el.finalScore.textContent = state.gameScore;
  el.correctCount.textContent = state.correctCount;
  el.totalTries.textContent = state.totalTries;
  el.bestScore.textContent = state.bestScore;

  const maxRounds = window.CAR_APP_CONFIG?.game?.roundsPerGame || 5;
  const maxStars = window.CAR_APP_CONFIG?.game?.maxStars || 5;
  const scoreRatio = Math.min(1, state.gameScore / (maxRounds * 10));
  const earnedStars = Math.round(scoreRatio * maxStars);

  el.scoreMessage.textContent =
    state.gameScore === 0
      ? "Play the game to earn stars."
      : `You earned ${earnedStars} star${earnedStars === 1 ? "" : "s"}!`;

  renderScoreStars(earnedStars, maxStars);
}

function renderScoreStars(earnedStars, maxStars) {
  el.scoreStars.innerHTML = "";

  for (let index = 0; index < maxStars; index++) {
    const star = document.createElement("div");
    star.className = index < earnedStars ? "star active" : "star";
    star.textContent = "⭐";
    el.scoreStars.appendChild(star);
  }
}

function resetScore() {
  state.gameRound = 1;
  state.gameScore = 0;
  state.correctCount = 0;
  state.totalTries = 0;
  state.answeredThisRound = false;

  el.liveScore.textContent = "0";
  createGameRound(false);
  updateScorePage();
  speak(["Score reset.", "Ready for a new game."]);
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

function randomPhrase(type) {
  const phrases = window.CAR_APP_CONFIG?.phrases?.[type] || [];
  if (!phrases.length) return "";
  return phrases[Math.floor(Math.random() * phrases.length)];
}

if (window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}

init();
