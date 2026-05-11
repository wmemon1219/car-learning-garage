# Car Learning Garage - GitHub Backed

This version is designed to run as a static HTML app hosted by GitHub Pages.

GitHub is used for:

1. Hosting the website through GitHub Pages.
2. Serving the app data from `data/cars.json`.

## Repository layout

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

## How it works

The app reads vehicle data from:

```text
./data/cars.json
```

When this project is published through GitHub Pages, that file is served from your GitHub-hosted website.

Example:

```text
https://YOUR_USERNAME.github.io/car-learning-garage/data/cars.json
```

## How to update app content

Edit this file in GitHub:

```text
data/cars.json
```

Commit the change. GitHub Pages will serve the updated data after the site refreshes.

## Optional separate data repo

If you want the app to pull data from a different GitHub repo, edit:

```text
config.js
```

Change:

```js
dataUrl: "./data/cars.json"
```

To:

```js
dataUrl: "https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_DATA_REPO/main/data/cars.json"
```

## Important security note

Do not put a GitHub token inside browser JavaScript. If the app ever needs an admin screen that writes back to GitHub, use a small secure backend such as a serverless function.


## Voice tuning

The voice is tuned in `app.js` inside the `speak(text)` function.

Current child-friendly settings:

```js
utterance.rate = 0.76;
utterance.pitch = 1.55;
utterance.volume = 1;
```

Higher pitch range: `1.3` to `1.8`

Recommended toddler setting:

```js
rate: 0.74 - 0.82
pitch: 1.45 - 1.65
```
