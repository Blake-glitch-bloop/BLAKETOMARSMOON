# Lil’ Johnny Builds to Mars

A touch-friendly, interactive picture book for little explorers. Seven illustrated spreads: a cover, a star hunt, a rocket workshop, a drawing activity, a press-and-hold launch, a Mars landing, and a celebratory ending.

## Run

Open `index.html` in a modern browser. No installation, dependencies, build tools, or network requests are required. All illustrations are original inline SVG; sound uses Web Audio and optional narration uses the browser’s speech synthesis.

For a local HTTP preview, run `python -m http.server 8000` in this directory, then open `http://localhost:8000`.

## GitHub Pages

The included GitHub Actions workflow publishes this static site to GitHub Pages whenever `main` is updated. In the repository’s **Settings → Pages → Build and deployment**, select **GitHub Actions** as the source. The site address is `https://blake-glitch-bloop.github.io/BLAKETOMARSMOON/`.

## Play

- Tap stars to collect five sparks of inspiration.
- Drag rocket parts into place, or tap a part and then the rocket. The tap alternative also works with a keyboard.
- Draw with four crayon colors; the drawing stays while moving between pages during the session.
- Hold the launch button with a finger, mouse, Space, or Enter to fill the power meter.
- Tap the flag to plant it on Mars.
- Use the page arrows or dots to explore freely. Read again resets the adventure.

Sound starts off and can be enabled with the speaker button. Read to me narrates the current page when the browser has a compatible voice. No accounts, analytics, ads, cookies, or remote assets. Motion respects the system’s reduced-motion preference.
