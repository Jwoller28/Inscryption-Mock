const { chromium } = require("playwright");

const baseUrl = process.argv[2] || "http://127.0.0.1:4173/";
const outputDir = process.argv[3] || "tempbuild/playtest-phones";

const phoneViewports = [
  { name: "iphone11", viewport: { width: 414, height: 896 } },
  { name: "iphone12", viewport: { width: 390, height: 844 } },
  { name: "iphone13", viewport: { width: 390, height: 844 } }
];

async function chooseBattleNode(page) {
  const battleNode = page.locator("button.map-node.reachable").filter({ hasText: /BATTLE/i }).first();
  if (await battleNode.count()) {
    await battleNode.click();
    return;
  }
  const firstNode = page.locator("button.map-node.reachable").first();
  if (await firstNode.count()) {
    await firstNode.click();
    return;
  }
  throw new Error("No reachable map node found.");
}

async function captureScenario(browser, phone) {
  const context = await browser.newContext({
    viewport: phone.viewport,
    screen: phone.viewport,
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2
  });
  const page = await context.newPage();
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  await chooseBattleNode(page);
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${outputDir}/${phone.name}-battle.png` });
  await page.locator("#hand-strip").screenshot({ path: `${outputDir}/${phone.name}-hand.png` });
  await context.close();
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const phone of phoneViewports) {
      await captureScenario(browser, phone);
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
