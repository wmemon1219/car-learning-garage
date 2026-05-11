/*
  GitHub-backed data configuration.

  Option A - Recommended:
  Leave this as "./data/cars.json" when the app and data file live in the same GitHub Pages repo.

  Option B:
  Use a raw GitHub URL if you want the app to read data from a different repo:
  https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/data/cars.json
*/

window.CAR_APP_CONFIG = {
  dataUrl: "./data/cars.json"
};
