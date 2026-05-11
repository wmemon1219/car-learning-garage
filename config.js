/*
  Car Learning Garage
  GitHub-backed configuration
*/

window.CAR_APP_CONFIG = {
  dataUrl: "./data/cars.json",

  voice: {
    enabled: true,

    // Smooth, warm, kid-friendly browser voice.
    // Browser/device voice availability varies.
    rate: 0.78,
    pitch: 1.42,
    volume: 1,

    preferredVoices: [
      "Microsoft Jenny Online",
      "Microsoft Aria Online",
      "Google US English",
      "Samantha",
      "Karen",
      "Moira"
    ]
  },

  phrases: {
    intro: [
      "Hi there, little driver!",
      "Let's learn together!",
      "Ready for a fun ride?"
    ],
    correct: [
      "Great job!",
      "You got it!",
      "Awesome work!",
      "Nice driving!"
    ],
    retry: [
      "Almost! Try again.",
      "Let's look one more time.",
      "Good try. Pick another one."
    ],
    gameStart: [
      "Listen carefully, then tap the right vehicle.",
      "Let's play the sound match game.",
      "Here comes your clue."
    ]
  },

  game: {
    roundsPerGame: 5,
    pointsPerCorrect: 10,
    maxStars: 5
  }
};
