/*
  Car Learning Garage
  GitHub-backed configuration
*/

window.CAR_APP_CONFIG = {
  dataUrl: "./data/cars.json",

  voice: {
    enabled: true,

    // Softer, clearer, joyful, normal-sounding browser voice.
    // Lower pitch helps avoid choppy playback on some devices.
    rate: 0.86,
    pitch: 1.08,
    volume: 1,

    preferredVoices: [
      "Google US English",
      "Microsoft Jenny Online",
      "Microsoft Aria Online",
      "Samantha",
      "Karen",
      "Moira",
      "Daniel"
    ],

    pauseBetweenChunksMs: 320
  },

  phrases: {
    intro: [
      "Hi little driver.",
      "Beep beep, buddy.",
      "Let's take a tiny drive.",
      "Ready, set, vroom.",
      "Hello, car explorer."
    ],
    correct: [
      "Yay, you found it.",
      "Great job, little driver.",
      "Beep beep, that is right.",
      "Awesome work.",
      "You are a super driver."
    ],
    retry: [
      "Almost. Try again.",
      "Good try. Pick another one.",
      "Let's look one more time.",
      "Hmm, not that one yet.",
      "Keep going, little driver."
    ],
    gameStart: [
      "Listen carefully.",
      "Here comes your clue.",
      "Let's play.",
      "Tiny driver challenge.",
      "Vroom vroom question time."
    ],
    learnMore: [
      "Let's peek under the hood.",
      "Tiny mechanic time.",
      "Let's learn how it works.",
      "Ready to learn car parts."
    ]
  },

  game: {
    roundsPerGame: 5,
    pointsPerCorrect: 10,
    maxStars: 5
  }
};
