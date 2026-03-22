const { chromium, devices } = require("playwright");

const baseUrl = process.argv[2] || "http://127.0.0.1:4173/";
const outputDir = process.argv[3] || "tempbuild";

async function readState(page) {
  return page.evaluate(() => {
    const raw = window.localStorage.getItem("inscryption-mock-web-save-v4");
    return raw ? JSON.parse(raw) : null;
  });
}

async function capture(page, name) {
  await page.screenshot({ path: `${outputDir}/${name}.png`, fullPage: true });
}

async function chooseBattleNode(page) {
  const battleNode = page.locator("button.map-node.reachable").filter({ hasText: /BATTLE/i }).first();
  if (await battleNode.count()) {
    await battleNode.click();
    return true;
  }
  const firstNode = page.locator("button.map-node.reachable").first();
  if (await firstNode.count()) {
    await firstNode.click();
    return false;
  }
  throw new Error("No reachable map node found.");
}

async function playSimpleTurn(page) {
  const drawDeckButton = page.locator("#draw-deck-button");
  if (await drawDeckButton.isVisible()) {
    await drawDeckButton.click();
    await page.waitForTimeout(250);
  }

  const handCards = page.locator("#hand-strip .hand-card.selectable");
  const handCount = await handCards.count();
  for (let i = 0; i < handCount; i += 1) {
    const card = handCards.nth(i);
    const text = ((await card.textContent()) || "").toLowerCase();
    if (text.includes("cost 0") || text.includes("squirrel")) {
      await card.click();
      await page.waitForTimeout(150);
      const lane = page.locator("#player-board .slot-card.empty.selectable").first();
      if (await lane.count()) {
        await lane.click();
        await page.waitForTimeout(250);
      }
      break;
    }
  }

  const endTurn = page.locator("#end-turn-button");
  if (await endTurn.isVisible()) {
    await endTurn.click();
    await page.waitForTimeout(1800);
  }
}

async function runScenario(browser, contextOptions, prefix) {
  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);

  await capture(page, `${prefix}-home`);
  const initialState = await readState(page);

  const pickedBattle = await chooseBattleNode(page);
  await page.waitForTimeout(900);
  await capture(page, `${prefix}-after-node`);

  const stateAfterNode = await readState(page);
  if (stateAfterNode?.mode === "battle") {
    await playSimpleTurn(page);
    await capture(page, `${prefix}-battle-turn`);
  }

  const finalState = await readState(page);
  await context.close();
  return { initialState, stateAfterNode, finalState, pickedBattle };
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  try {
    const desktop = await runScenario(browser, { viewport: { width: 1440, height: 1200 } }, "desktop");
    const mobile = await runScenario(browser, { ...devices["iPhone 13"] }, "iphone13");
    process.stdout.write(JSON.stringify({ desktop, mobile }, null, 2));
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
