<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>Car Learning Garage</title>

  <link rel="stylesheet" href="styles.css" />
</head>

<body>
  <div class="cloud cloud-one"></div>
  <div class="cloud cloud-two"></div>
  <div class="cloud cloud-three"></div>

  <div class="app">
    <header class="header">
      <div>
        <p class="eyebrow">Little Driver</p>
        <h1>Car Learning Garage</h1>
        <p class="subtitle">Cars, brands, parts, sounds, colors, and fun little-driver games.</p>
      </div>

      <button id="voiceToggle" class="dark-button" type="button">Voice: On</button>
    </header>

    <main>
      <section class="scene" aria-live="polite">
        <div class="sun"></div>

        <div class="garage" aria-hidden="true">
          <div class="roof"></div>
          <div class="garage-sign">Garage</div>
          <div class="garage-door"></div>
        </div>

        <article class="info-card">
          <p id="vehicleBrand" class="brand-pill">Brand: Toyota</p>
          <p id="vehicleType" class="vehicle-type">Everyday Vehicle</p>
          <h2 id="vehicleName">Car</h2>
          <p id="vehicleFact" class="vehicle-fact">A car helps people go from one place to another.</p>
          <p id="vehicleCatchphrase" class="catchphrase">Beep beep, little driver!</p>
          <p id="vehicleSound" class="mini-fact">Sound: Vroom vroom</p>
          <p id="dataStatus" class="data-status">Loading from GitHub data...</p>
        </article>

        <div class="vehicle-display">
          <div id="vehicleEmoji" class="vehicle-emoji" role="img" aria-label="Car">🚗</div>
        </div>

        <div class="road"></div>
      </section>

      <section class="controls">
        <button id="backButton" type="button">Back</button>
        <button id="sayButton" class="primary-button" type="button">Say It</button>
        <button id="nextButton" type="button">Next</button>
      </section>

      <section class="tabs">
        <button id="learnTab" class="tab active" type="button">Learn</button>
        <button id="brandsTab" class="tab" type="button">Brands</button>
        <button id="partsTab" class="tab" type="button">Parts</button>
        <button id="findTab" class="tab" type="button">Find It</button>
        <button id="colorTab" class="tab" type="button">Colors</button>
        <button id="gameTab" class="tab" type="button">Game</button>
        <button id="scoreTab" class="tab" type="button">Score</button>
      </section>

      <section id="learnPanel" class="panel">
        <h3>Tap a vehicle to learn more</h3>
        <div id="vehicleGrid" class="grid"></div>

        <div class="deep-card">
          <h3 id="deepTitle">What does this vehicle do?</h3>
          <div class="deep-grid">
            <div>
              <span class="score-label">Job</span>
              <p id="vehicleJob">Carries people.</p>
            </div>
            <div>
              <span class="score-label">Where you see it</span>
              <p id="vehicleWhere">On roads and streets.</p>
            </div>
            <div>
              <span class="score-label">Safety</span>
              <p id="vehicleSafety">Always wear a seat belt.</p>
            </div>
          </div>
          <div class="center">
            <button id="learnMoreButton" class="primary-button" type="button">Learn More</button>
          </div>
        </div>
      </section>

      <section id="brandsPanel" class="panel hidden">
        <h3>Car Brands</h3>
        <p class="game-help">Tap a brand to hear a simple kid-friendly fact.</p>
        <div id="brandGrid" class="grid"></div>
      </section>

      <section id="partsPanel" class="panel hidden">
        <h3 id="partsTitle">Car Parts</h3>
        <p class="game-help">Tap a part to hear what it does.</p>
        <div id="partsGrid" class="grid"></div>
      </section>

      <section id="findPanel" class="panel hidden">
        <h3 id="findQuestion">Can you find the fire truck?</h3>
        <div id="findGrid" class="grid"></div>
        <p id="findMessage" class="message"></p>
        <div class="center">
          <button id="newFindQuestion" class="primary-button" type="button">New Question</button>
        </div>
      </section>

      <section id="colorPanel" class="panel hidden">
        <h3 id="colorQuestion">Which vehicle is red?</h3>
        <div id="colorGrid" class="grid"></div>
        <p id="colorMessage" class="message"></p>
        <div class="center">
          <button id="newColorQuestion" class="primary-button" type="button">New Color</button>
        </div>
      </section>

      <section id="gamePanel" class="panel hidden">
        <h3>Learning Match Game</h3>
        <p class="game-help">Listen to the clue, then tap the right vehicle.</p>

        <div class="game-score-strip">
          <div>
            <span class="score-label">Round</span>
            <strong id="gameRound">1 / 5</strong>
          </div>
          <div>
            <span class="score-label">Score</span>
            <strong id="liveScore">0</strong>
          </div>
        </div>

        <div class="center">
          <button id="playClueButton" class="primary-button" type="button">Play Clue</button>
        </div>

        <h3 id="gameQuestion" class="game-question">Which vehicle helps firefighters?</h3>
        <div id="gameGrid" class="grid"></div>
        <p id="gameMessage" class="message"></p>

        <div class="center">
          <button id="nextGameQuestion" class="primary-button" type="button">Next Round</button>
        </div>
      </section>

      <section id="scorePanel" class="panel hidden">
        <h3>Score Page</h3>

        <div class="score-card">
          <div class="score-big" id="finalScore">0</div>
          <p id="scoreMessage" class="score-message">Play the game to earn stars.</p>
        </div>

        <div id="scoreStars" class="stars"></div>

        <div class="score-stats">
          <div>
            <span class="score-label">Correct</span>
            <strong id="correctCount">0</strong>
          </div>
          <div>
            <span class="score-label">Tries</span>
            <strong id="totalTries">0</strong>
          </div>
          <div>
            <span class="score-label">Best</span>
            <strong id="bestScore">0</strong>
          </div>
        </div>

        <div class="center">
          <button id="resetScoreButton" class="primary-button" type="button">Reset Score</button>
        </div>
      </section>
    </main>

    <footer>
      Parent-controlled learning. No ads. No random internet browsing.
    </footer>
  </div>

  <script src="config.js"></script>
  <script src="app.js"></script>
</body>
</html>
