# Voice PE LED

A reference cheat-sheet and visual generator for the LED-ring effects of the
[Home Assistant Voice PE](https://www.home-assistant.io/voice-pe/) speaker.
Look up what each ring animation means, design your own from presets, and copy a
ready-to-paste ESPHome `addressable_lambda` block.

[**▶ Open the live app**](https://maxmaxme.github.io/home-assistant-voice-led/)

[![Deploy](https://github.com/maxmaxme/home-assistant-voice-led/actions/workflows/deploy.yml/badge.svg)](https://github.com/maxmaxme/home-assistant-voice-led/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![Nuxt 4](https://img.shields.io/badge/Nuxt-4-00DC82?logo=nuxt&logoColor=white)

## Why

The Voice PE ring has a dozen animations baked into its firmware, and it is easy
to forget which one means what — or how to write a new one without digging
through ESPHome lambda syntax. This is a tiny static site that does two things:

- **Reference** — every phase/state animated live on a photo of the device, so
  you can recognise what your speaker is doing at a glance.
- **Builder** — pick a preset, tweak the parameters, watch the live preview on
  the device, and export a self-contained ESPHome effect block.

It is purely a companion tool: it has no backend, talks to nothing, and never
touches your firmware. The export is copy-paste.

## Features

- **Live 12-LED preview** rendered over a real photo of the speaker — unlit LEDs
  read as a faint glow fading to transparent, just like the physical diffuser.
- **Reference tab** covering the phases and key states: idle, waiting,
  listening, thinking, replying, error, mute, and volume.
- **Builder tab** with presets: `rotate`, `pulse`, `wave`, `breathing`, `solid`,
  `twinkle`, and `rainbow`, each with its own parameters (color, speed,
  direction, tail, brightness, indicators, …).
- **One-click YAML export** — a self-contained `addressable_lambda` (or built-in
  `addressable_twinkle` / `addressable_rainbow`) block with no hidden
  dependencies on firmware globals.

## How the export works

The Builder emits an effect block you can drop straight into your firmware's
`light:` section under the addressable LED (`id: voice_assistant_leds`), then
wire to a phase/script yourself:

```yaml
- addressable_lambda:
    name: "My Effect"
    update_interval: 50ms
    lambda: |-
      static int frame = 0;
      const int n = it.size();
      Color base(24, 187, 242);
      int head = (frame % n);
      head = (head % n + n) % n;
      for (int i = 0; i < n; i++) {
        int behind = ((head - i) % n + n) % n;
        float k = behind == 0 ? 1.00f : (behind <= 3 ? (1.0f - (float)behind / 4) * 1.00f : 0.0f);
        it[i] = base * (uint8_t)(k * 255);
      }
      frame++;
```

The block carries its own frame counter and a fixed color, so it does not depend
on `global_led_animation_index` or `led_ring` and can be pasted anywhere.

> **Note:** the preview is an approximation. It runs in RGB at a fixed
> orientation, and the export does not yet encode `speed`/`brightness` — those
> are preview-only; set `update_interval` and brightness in ESPHome yourself.

## Getting started

Requires Node 24+.

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm test           # unit tests for the engine and YAML generator
npm run generate   # static build → .output/public
```

## Deployment

The site is statically generated and published to GitHub Pages by
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) on every push to
`main`. To enable it on a fork:

1. **Settings → Pages → Source → GitHub Actions** (one-time).
2. Push to `main` — the workflow runs `nuxt generate` and deploys
   `.output/public`.

The base path is set via `NUXT_APP_BASE_URL` in CI only, so local `npm run dev`
stays at `/`.

## Project structure

```
app/
├─ pages/index.vue          # Reference / Builder tabs
├─ components/
│  ├─ LedRing.vue           # animated 12-LED SVG ring
│  ├─ DeviceHero.vue        # ring overlaid on the device photo
│  ├─ EffectCard.vue        # one reference entry
│  ├─ EffectBuilder.vue     # preset form + live preview + export
│  └─ ExportModal.vue       # generated YAML + copy
└─ utils/leds/
   ├─ types.ts              # effect descriptors
   ├─ engine.ts             # per-LED color over time (pure, tested)
   ├─ toYaml.ts             # descriptor → ESPHome YAML (pure, tested)
   └─ catalog.ts            # the reference states
```

The `app/utils/leds` core is framework-agnostic and unit-tested; the Vue layer
just renders it.

## Tech stack

[Nuxt 4](https://nuxt.com) · [Nuxt UI 4](https://ui.nuxt.com) ·
[Vue 3](https://vuejs.org) · TypeScript · [Vitest](https://vitest.dev) ·
GitHub Pages.

## Contributing

Issues and PRs are welcome. Keep the `app/utils/leds` core pure and covered by
tests (`npm test`); the firmware effects evolve, so corrections to the reference
catalog are especially useful.

## License

[MIT](LICENSE) © maxmaxme

This is an unofficial community tool and is not affiliated with Home Assistant
or Nabu Casa.
