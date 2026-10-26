# Smallstop case study

Entry point: `work/smallstop.html`. Linked from both `index.html` and `work/work.html`; `smallstop.html` redirects to the canonical case-study page.

## Assets and provenance

- `assets/figma-*.png`: direct exports of Keyaa's Ride Ready Figma file, `Vv83KuJwDAmdzZEdZ78SFL`. Nodes: welcome `4:5`, home `4:147`, practice `5:162`, ride `6:269`, next stop `6:322`, arrived `6:363`, calm `7:395`, passport `9:338`.
- Seven SVGs: original Figma character and UI artwork.
- `assets/subway-scene.png`: AI-generated editorial scene created for this case study. Not documentary photography.
- `feature-*.mp4`, `journey.mp4`, and `calm.mp4`: original frame-rendered UI motion studies based on the Figma layouts and components. Independent button presses, tap indicators, quiz feedback and shake, rolling stop counters, a breathing cycle, stamp/badge landings, and a caregiver’s practice-first approval; directional transitions link the states. No audio.
- `tools/render-interactions.py`: reproducible microinteraction film generator (Pillow, imageio-ffmpeg).
- Saans: existing portfolio font assets.

The live HTML prototype is a visual adaptation of the Figma flow, with working route counting, help/return, quiz feedback, and screen navigation. It uses illustrative data; it does not connect to live transit or send messages. Existing Figma source files have not been modified.

## Interaction guidance

Used Emil Kowalski's `emil-design-eng` skill from https://github.com/emilkowalski/skills: short ease-out transitions, press feedback, transform/opacity motion, hover gating, keyboard immediacy, reduced-motion support. The Outsider case study informed visual pacing, not copied content or imagery.

Videos pause off-screen and when the document is hidden. Reduced-motion preference disables automatic playback and spatial UI transitions; explicit film playback remains available.

October 17 layout refinement: uses the shared portfolio navigation, Season Sans,
three-column project introduction, media gutters and related-project footer.
`case-study.css` bridges the portfolio shell and Smallstop's product artwork.
Cover and caregiver scene are AI-generated editorial concept imagery (not user
research photography). Both portfolio listings now use the photographic cover.
Feature films autoplay muted and loop in view, without manual playback overlays.
