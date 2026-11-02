# Changelog

## 0.5.0
- Rename the displayed product to exactly `middleshoooot by more`.
- Add a local screenshot editor: crop, arrows, rectangles, freehand pen, text, and opaque privacy masking.
- Add native-resolution flattened PNG export, display zoom, independent multi-part edits, undo/redo and reset.
- Confirm before switching sidebar layout when edits exist; explain that edits are in-memory until exported.
- Preserve manual capture, pause/continue, local UI-noise cleanup and original local-data clearing.
- Add actual Chromium extension editor integration tests and synthetic output screenshots.

## 0.4.0
- Rename the extension to `middle by more`.
- Add optional local filtering for small exact-label message-count / See more controls, including nonfixed and dynamically inserted controls.
- Preserve chat prose, images and layout; restore hidden controls immediately after each capture.
- Keep manual-scroll pause/continue, overlap protection, composer avoidance and PNG export.
- Publish source under the MIT License with local Chromium integration tests and unit-test CI.
