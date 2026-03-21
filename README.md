# Inscryption-Mock

This project is a simplified roguelike card battler inspired by *Inscryption*.

## Web Prototype

A GitHub Pages-friendly browser version now lives in [`docs/`](./docs).

- Open `docs/index.html` in a browser for the current prototype.
- It is mobile-first and uses a stacked 4-lane board plus a horizontally scrolling hand.
- The current browser build is an early port of the battle flow, not yet the full Java feature set.

### Publish To GitHub Pages

1. Commit and push the `docs/` folder to GitHub.
2. In the GitHub repo, open `Settings` -> `Pages`.
3. Under `Build and deployment`, choose `Deploy from a branch`.
4. Select branch `main` and folder `/docs`.
5. Save. GitHub will publish the site and give you the final URL.

After that, the game will be reachable at:

`https://jwoller28.github.io/Inscryption-Mock/`

## Recent Changes

- **Card Sigils/Passives:** A new `Sigil` system allows cards to have special abilities.
  - Sigils are defined in `game/Sigil.java` (based on `Sigil.json` for Act 1).
  - Each sigil includes a description and an optional icon, and can hook into battle events such as attacks, damage, or beginning of turn.
  - Sample sigils implemented so far: Airborne, Double Strike, Touch of Death, Sharp Quills. Additional sigils are listed in the JSON file.
  - Cards and enemy decks now include a few starting sigils.
- UI now displays sigils on cards (hand and board) using text and icons.
- Helper methods and event hooks were added to `Main.java` to support ability logic.

## Building

Run `build.bat` (Windows) or use `javac` with JavaFX modules as described in `build.bat`.

## Notes

The provided `Sigil.json` file served as the basis for the enum and contains all sigil definitions for Act 1; the game does not currently parse JSON at runtime but the file can be used for reference or to drive future tooling.

## Next Porting Steps

- Move more battle rules out of `Main.java` and into shared game-state structures.
- Port map progression, reward screens, and non-battle events into the web app.
- Add save data via browser `localStorage`.
- Continue tuning the card layout for smaller phones.
