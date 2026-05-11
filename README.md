# Car Learning Garage - Enhanced

This version keeps the original GitHub-backed static app architecture.

## What changed

- Voice tuning was adjusted to a smooth, warm, kid-friendly browser voice.
- Added an interactive Sound Match Game.
- Added a Score page with:
  - Current game score
  - Correct answers
  - Total tries
  - Best score saved in browser local storage
  - Star reward display

## GitHub-backed structure

```text
car-learning-garage/
├── index.html
├── styles.css
├── app.js
├── config.js
├── README.md
└── data/
    └── cars.json
```

## Update data

Edit:

```text
data/cars.json
```

Each vehicle can include:

```json
{
  "name": "Fire Truck",
  "type": "Rescue Vehicle",
  "emoji": "🚒",
  "color": "Red",
  "fact": "A fire truck carries firefighters, ladders, and water.",
  "clue": "Which vehicle helps firefighters?"
}
```

## Voice settings

Edit `config.js`:

```js
rate: 0.78,
pitch: 1.42,
volume: 1
```

For a smoother voice, use pitch between `1.25` and `1.45`.

For a more playful voice, use pitch between `1.45` and `1.6`.
