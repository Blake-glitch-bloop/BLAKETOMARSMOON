# Lil’ Johnny Builds to Mars

A touch-friendly, interactive picture book for little explorers. Ten story pages plus the cover: a star hunt, a rocket workshop, rocket coloring, packing supplies, a press-and-hold launch, a Moon visit, clearing space rocks, a Mars landing, a rover adventure, and a celebratory ending.

## Run

Open `index.html` in a modern browser. No installation, dependencies, build tools, or network requests are required. All illustrations are original inline SVG; sound uses Web Audio and optional narration uses the browser’s speech synthesis.

For a local HTTP preview, run `python -m http.server 8000` in this directory, then open `http://localhost:8000`.

## GitHub Pages

The included GitHub Actions workflow publishes this static site to GitHub Pages whenever `main` is updated. In the repository’s **Settings → Pages → Build and deployment**, select **GitHub Actions** as the source. The site address is `https://blake-glitch-bloop.github.io/BLAKETOMARSMOON/`.

## Play

- Tap the five golden stars to turn each one rainbow. Collected stars stay rainbow when revisiting the page.
- Drag rocket parts into place, or tap a part and then the rocket. The tap alternative also works with a keyboard.
- Color the rocket outline with seven rainbow colors: red, orange, yellow, green, blue, indigo, and purple. Use Crayon for freehand strokes, or Paint bucket to tap and fill an outlined part (nose, window, body, fins, or bottom band). Erase removes color wherever you drag while keeping the outline. Undo reverses the last crayon stroke, bucket fill, eraser stroke, or Start over (up to 20 actions, retained while turning pages). Redo brings an undone action back, including after turning pages. Making a new coloring action clears the redo history. Bucket fills use the rocket outline, so they work over existing crayon marks. Coloring stays inside the rocket, and its outlines stay visible. Your colored rocket appears at launch, on Mars, and at the ending, and stays when moving between pages. Start over clears the colors and keeps the outline; skipping the coloring page uses the original rocket.
- Hold the launch button with a finger, mouse, Space, or Enter to fill the power meter.
- Tap the water bottle, apple, and teddy bear to pack for the trip.
- Tap three Moon craters to make them glow, then nudge three space rocks aside to clear a path to Mars.
- Tap the flag to plant it on Mars.
- Tap Roll the rover three times to explore Mars and leave wheel tracks.
- Use the page arrows or dots to explore freely. Read again resets the adventure.

Sound starts off and can be enabled with the speaker button. Read to me narrates the current page when the browser has a compatible voice. No accounts, analytics, ads, cookies, or remote assets. Motion respects the system’s reduced-motion preference.
