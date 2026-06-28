# home-assistant-voice-led

A reference cheat-sheet and generator for the Home Assistant Voice PE LED-ring
effects. Static site (Nuxt 4 + Nuxt UI 4), deployed to GitHub Pages.

Live site: https://maxmaxme.github.io/home-assistant-voice-led/

## Development

    npm install
    npm run dev      # http://localhost:3000
    npm test         # unit tests for the engine and YAML generator

## Static build

    npm run generate # → .output/public

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`.
Enable Pages once: Settings → Pages → Source = GitHub Actions.

## License

MIT — see [LICENSE](LICENSE).
