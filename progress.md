Original prompt: There are 2 big issues but ill let you decide how / the order we deal we them. 1. The board width horizontally shakes back and forth (when in verstical mode) depending on the number of cards in your hand / on the board. It should be fixed based on the screen size not based on the cards 2. On the wolf cub ability it is supposed to attack first, then at the start of the next turn they would evolve into their upgraded form. it is not once you click "end turn"

- Fixed Fledgling timing in `docs/app.js` so cards evolve after surviving a full turn cycle instead of immediately when the turn ends.
- Tightened portrait battle layout sizing in `docs/styles.css` so the board rows size to the viewport/container instead of being stretched by internal content width.
- Added unique-offer reward selection in `docs/app.js` so a single reward/trader choice set will not show the same card name twice.
- TODO: Verify on a portrait/mobile viewport that board rows no longer shift horizontally while hand size changes.
- TODO: Verify in battle that Wolf Cub attacks as Wolf Cub on the first end turn and only evolves at the start of its next active turn.
- TODO: Verify reward and trader screens no longer surface duplicate card names in the same offer set.
