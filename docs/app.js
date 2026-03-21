const SAVE_VERSION = 3;
const SAVE_KEY = "inscryption-mock-web-save-v3";
const REGIONS = ["Woodlands", "Wetlands", "Snowline"];
const NODE_META = {
  BATTLE: { label: "Battle", summary: "Fight for a reward card." },
  BOSS: { label: "Boss Battle", summary: "Survive a scripted two-phase encounter." },
  CAMPFIRE: { label: "Campfire", summary: "Improve one card permanently." },
  BACKPACK: { label: "Backpack", summary: "Take a battle item." },
  SIGIL_TRANSFER: { label: "Ritual Stones", summary: "Move a sigil between cards." },
  WOODCARVER: { label: "Totem Builder", summary: "Add one new sigil to your deck." },
  MYCOLOGISTS: { label: "Card Merge", summary: "Merge duplicate cards into one stronger card." },
  ECONOMY: { label: "Trader", summary: "Trade one card for a curated offer." }
};
const SIGIL_META = {
  Airborne: "Ignores blockers unless they can leap.",
  "Mighty Leap": "Blocks airborne attackers.",
  Burrower: "Moves to block an open lane.",
  Leader: "Adjacent allies gain 1 power.",
  "Sharp Quills": "Deals 1 damage back when struck.",
  "Double Strike": "Hits twice when attacking.",
  "Bifurcated Strike": "Hits left and right lanes.",
  "Trifurcated Strike": "Hits left, center, and right lanes.",
  "Bees Within": "Creates a Bee when struck.",
  Stinky: "Opposing creature loses 1 power.",
  "Bone King": "Leaves 4 bones when destroyed.",
  "Worthy Sacrifice": "Counts as 3 blood when sacrificed.",
  Fledgling: "Evolves after surviving a turn.",
  Guardian: "Moves to protect an open lane.",
  "Ant Spawner": "Creates a Worker Ant when played.",
  Bellist: "Creates adjacent Chimes.",
  "Blood Lust": "Gains 1 power after a kill.",
  "Corpse Eater": "Jumps from hand into an empty death lane.",
  Scavenger: "Gains a bone when an enemy dies.",
  Waterborne: "Enemy attacks pass over it.",
  Repulsive: "Cannot be targeted directly."
};
const SIGIL_ICONS = {
  Airborne: "W",
  "Mighty Leap": "^",
  Burrower: "_",
  Leader: "+",
  "Sharp Quills": "*",
  "Double Strike": "II",
  "Bifurcated Strike": "V",
  "Trifurcated Strike": "Y",
  "Bees Within": "B",
  Stinky: "~",
  "Bone King": "K",
  "Worthy Sacrifice": "3",
  Fledgling: ">",
  Guardian: "G",
  "Ant Spawner": "A",
  Bellist: "C",
  "Blood Lust": "!",
  "Corpse Eater": "E",
  Scavenger: "$",
  Waterborne: "=",
  Repulsive: "X",
  "Touch of Death": "T",
  "Many Lives": "M",
  Unkillable: "U"
};
const ITEM_DEFS = {
  pliers: { id: "pliers", name: "Pliers", description: "Deal 1 direct damage to the enemy scale." },
  squirrelBottle: { id: "squirrelBottle", name: "Squirrel Bottle", description: "Add a Squirrel to your hand." },
  hourglass: { id: "hourglass", name: "Hourglass", description: "Skip the next enemy attack phase." },
  fan: { id: "fan", name: "Fan", description: "Your cards gain Airborne for this turn." },
  boneJar: { id: "boneJar", name: "Bone Jar", description: "Gain 4 Bones." },
  blackGoatBottle: { id: "blackGoatBottle", name: "Black Goat Bottle", description: "Add a Black Goat to your hand." }
};
const STARTER_UNLOCKS = {
  classic: { label: "Classic", bonusCard: null },
  bones: { label: "Bone Cache", bonusCard: () => createCard("Skeleton", 1, 1, 1, "bones", []) },
  sky: { label: "Sky Scout", bonusCard: () => createCard("Raven Egg", 0, 2, 1, "blood", ["Fledgling"]) }
};
const MODAL_MODES = new Set(["reward", "map", "campfire", "backpack", "sigil", "woodcarver", "mycologists", "economy", "gameover", "complete"]);
const VALID_MODES = new Set(["battle", ...MODAL_MODES]);
const INFO_PANELS = ["run", "deck", "log"];

const SIGIL_STONE_POOL = [
  "Airborne",
  "Mighty Leap",
  "Burrower",
  "Leader",
  "Sharp Quills",
  "Double Strike",
  "Bifurcated Strike",
  "Bees Within",
  "Stinky",
  "Bone King",
  "Worthy Sacrifice"
];

const STARTER_DECK = [
  createCard("Stoat", 1, 3, 1, "blood", ["Double Strike"]),
  createCard("Bullfrog", 1, 2, 1, "blood", ["Mighty Leap"]),
  createCard("Adder", 1, 1, 1, "blood", ["Touch of Death"]),
  createCard("Wolf Cub", 1, 1, 1, "blood", ["Fledgling"]),
  createCard("Coyote", 2, 1, 4, "bones", []),
  createCard("Cat", 0, 1, 1, "blood", ["Many Lives"]),
  createCard("Raven", 2, 3, 2, "blood", ["Airborne"]),
  createCard("Cockroach", 1, 1, 4, "bones", ["Unkillable"])
];

const REWARD_POOL = [
  rewardCard(createCard("Elk", 1, 4, 1, "blood", []), "Common"),
  rewardCard(createCard("Royal Spaniel", 1, 2, 1, "blood", []), "Common"),
  rewardCard(createCard("Stoat", 1, 3, 1, "blood", []), "Common"),
  rewardCard(createCard("Bullfrog", 1, 2, 1, "blood", ["Mighty Leap"]), "Common"),
  rewardCard(createCard("Adder", 1, 1, 1, "blood", []), "Common"),
  rewardCard(createCard("Cat", 0, 1, 1, "blood", ["Many Lives"]), "Common"),
  rewardCard(createCard("Skunk", 0, 3, 1, "blood", ["Stinky"]), "Common"),
  rewardCard(createCard("Wolf Cub", 1, 1, 1, "blood", ["Fledgling"]), "Common"),
  rewardCard(createCard("Wolf", 3, 2, 2, "blood", []), "Uncommon"),
  rewardCard(createCard("Raven", 2, 3, 2, "blood", ["Airborne"]), "Uncommon"),
  rewardCard(createCard("Mole", 0, 4, 2, "blood", ["Burrower"]), "Uncommon"),
  rewardCard(createCard("Coyote", 2, 1, 4, "bones", []), "Uncommon"),
  rewardCard(createCard("Skeleton", 1, 1, 1, "bones", []), "Uncommon"),
  rewardCard(createCard("Bloodhound", 2, 3, 2, "blood", ["Guardian"]), "Uncommon"),
  rewardCard(createCard("Beehive", 0, 2, 1, "blood", ["Bees Within"]), "Uncommon"),
  rewardCard(createCard("Alpha", 1, 2, 2, "blood", ["Leader"]), "Uncommon"),
  rewardCard(createCard("Worker Ant", 1, 2, 1, "blood", []), "Uncommon"),
  rewardCard(createCard("Ant Queen", 1, 3, 2, "blood", ["Ant Spawner"]), "Uncommon"),
  rewardCard(createCard("Black Goat", 0, 1, 1, "blood", ["Worthy Sacrifice"]), "Uncommon"),
  rewardCard(createCard("Vulture", 3, 1, 2, "blood", ["Scavenger"]), "Uncommon"),
  rewardCard(createCard("Elk Fawn", 1, 2, 1, "blood", ["Fledgling"]), "Uncommon"),
  rewardCard(createCard("Porcupine", 1, 2, 1, "blood", ["Sharp Quills"]), "Uncommon"),
  rewardCard(createCard("Grizzly Bear", 4, 6, 3, "blood", []), "Rare"),
  rewardCard(createCard("Mantis God", 2, 1, 3, "blood", ["Double Strike"]), "Rare"),
  rewardCard(createCard("Bone Heap", 1, 2, 2, "bones", ["Sharp Quills"]), "Rare"),
  rewardCard(createCard("Mantis", 1, 1, 1, "blood", ["Bifurcated Strike"]), "Rare"),
  rewardCard(createCard("Cockroach", 1, 1, 4, "bones", ["Unkillable"]), "Rare"),
  rewardCard(createCard("Bell Tentacle", 1, 3, 2, "blood", ["Bellist"]), "Rare"),
  rewardCard(createCard("Raven Egg", 0, 2, 1, "blood", ["Fledgling"]), "Rare"),
  rewardCard(createCard("Warren", 0, 2, 1, "blood", ["Ant Spawner"]), "Rare"),
  rewardCard(createCard("Bone Lord", 1, 2, 1, "blood", ["Bone King"]), "Rare"),
  rewardCard(createCard("Corpse Maggots", 1, 2, 5, "bones", ["Corpse Eater"]), "Rare"),
  rewardCard(createCard("Mole Man", 0, 6, 1, "blood", ["Burrower", "Mighty Leap", "Repulsive"]), "Rare"),
  rewardCard(createCard("Wolverine", 2, 3, 2, "blood", ["Blood Lust"]), "Rare"),
  rewardCard(createCard("Otter", 1, 1, 1, "blood", ["Waterborne"]), "Rare")
];

const CARD_LIBRARY = {
  squirrel: () => createCard("Squirrel", 0, 1, 0, "blood", []),
  bee: () => createCard("Bee", 1, 1, 0, "blood", ["Airborne"]),
  blackGoat: () => createCard("Black Goat", 0, 1, 1, "blood", ["Worthy Sacrifice"]),
  workerAnt: () => createCard("Worker Ant", 1, 2, 1, "blood", []),
  chime: () => createCard("Chime", 0, 1, 0, "blood", []),
  goldNugget: () => createCard("Gold Nugget", 0, 2, 0, "blood", []),
  baitBucket: () => createCard("Bait Bucket", 0, 2, 0, "blood", []),
  shark: () => createCard("Shark", 4, 2, 0, "blood", []),
  rabbitPelt: () => createCard("Rabbit Pelt", 0, 1, 0, "blood", []),
  packMule: () => createCard("Pack Mule", 0, 5, 0, "blood", []),
  leapingTrap: () => createCard("Leaping Trap", 0, 2, 0, "blood", ["Touch of Death"])
};

const state = createInitialState();
const uiState = {
  mobileInfoPanel: "run",
  sigilInspector: null,
  turnAnimating: false,
  combatPreview: null,
  battlePhase: { text: "Battle Ready", tone: "neutral" },
  transientMessage: null,
  scaleEffect: null,
  laneEffects: [],
  turnSummary: null,
  lastTurnSummary: null,
  fxEvents: [],
  dragState: null,
  audioUnlocked: false,
  effectCounter: 0,
  timers: {
    message: null,
    scale: null,
    hold: null
  }
};
const refs = {
  screenText: document.getElementById("screen-text"),
  rotateOverlay: document.getElementById("rotate-overlay"),
  regionText: document.getElementById("region-text"),
  progressText: document.getElementById("progress-text"),
  saveText: document.getElementById("save-text"),
  screenTitle: document.getElementById("screen-title"),
  screenSubtitle: document.getElementById("screen-subtitle"),
  battleView: document.getElementById("battle-view"),
  choiceModal: document.getElementById("choice-modal"),
  choiceBackdrop: document.getElementById("choice-modal-backdrop"),
  choiceView: document.getElementById("choice-view"),
  choiceTitle: document.getElementById("choice-title"),
  closeChoiceButton: document.getElementById("close-choice-button"),
  choiceSummary: document.getElementById("choice-summary"),
  choiceActions: document.getElementById("choice-actions"),
  sigilModal: document.getElementById("sigil-modal"),
  sigilBackdrop: document.getElementById("sigil-modal-backdrop"),
  sigilTitle: document.getElementById("sigil-title"),
  sigilBody: document.getElementById("sigil-body"),
  closeSigilButton: document.getElementById("close-sigil-button"),
  drawModal: document.getElementById("draw-modal"),
  drawBackdrop: document.getElementById("draw-modal-backdrop"),
  scaleCard: document.getElementById("scale-card"),
  scaleText: document.getElementById("scale-text"),
  scaleFx: document.getElementById("scale-fx"),
  bonesText: document.getElementById("bones-text"),
  selectionText: document.getElementById("selection-text"),
  selectionHintText: document.getElementById("selection-hint-text"),
  itemCountText: document.getElementById("item-count-text"),
  battlePhaseChip: document.getElementById("battle-phase-chip"),
  battleTip: document.getElementById("battle-tip"),
  battleBanner: document.getElementById("battle-banner"),
  tutorialPanel: document.getElementById("tutorial-panel"),
  attackStageCaption: document.getElementById("attack-stage-caption"),
  attackPathStage: document.getElementById("attack-path-stage"),
  intentCaption: document.getElementById("intent-caption"),
  intentPanel: document.getElementById("intent-panel"),
  turnRecap: document.getElementById("turn-recap"),
  drawCaption: document.getElementById("draw-caption"),
  runText: document.getElementById("run-text"),
  queueCaption: document.getElementById("queue-caption"),
  enemyQueue: document.getElementById("enemy-queue"),
  enemyBoard: document.getElementById("enemy-board"),
  playerBoard: document.getElementById("player-board"),
  dragGhost: document.getElementById("drag-ghost"),
  handStrip: document.getElementById("hand-strip"),
  itemBar: document.getElementById("item-bar"),
  logPanel: document.getElementById("log-panel"),
  deckPanel: document.getElementById("deck-panel"),
  infoTabRun: document.getElementById("info-tab-run"),
  infoTabDeck: document.getElementById("info-tab-deck"),
  infoTabLog: document.getElementById("info-tab-log"),
  infoPanelRun: document.getElementById("info-panel-run"),
  infoPanelDeck: document.getElementById("info-panel-deck"),
  infoPanelLog: document.getElementById("info-panel-log"),
  drawSquirrelButton: document.getElementById("draw-squirrel-button"),
  drawDeckButton: document.getElementById("draw-deck-button"),
  endTurnButton: document.getElementById("end-turn-button"),
  newRunButton: document.getElementById("new-run-button"),
  clearSaveButton: document.getElementById("clear-save-button")
};

refs.endTurnButton.addEventListener("click", endTurn);
refs.newRunButton.addEventListener("click", startNewRun);
refs.clearSaveButton.addEventListener("click", clearSave);
refs.drawSquirrelButton.addEventListener("click", () => chooseDraw("squirrel"));
refs.drawDeckButton.addEventListener("click", () => chooseDraw("deck"));
refs.closeChoiceButton.addEventListener("click", forceCloseModal);
refs.choiceBackdrop.addEventListener("click", forceCloseModal);
refs.closeSigilButton.addEventListener("click", closeSigilInspector);
refs.sigilBackdrop.addEventListener("click", closeSigilInspector);
refs.infoTabRun.addEventListener("click", () => setMobileInfoPanel("run"));
refs.infoTabDeck.addEventListener("click", () => setMobileInfoPanel("deck"));
refs.infoTabLog.addEventListener("click", () => setMobileInfoPanel("log"));
window.addEventListener("resize", updateOrientationPrompt);
window.addEventListener("orientationchange", updateOrientationPrompt);
window.addEventListener("pointermove", handleGlobalPointerMove);
window.addEventListener("pointerup", handleGlobalPointerUp);
window.addEventListener("pointercancel", cancelDragInteraction);

boot();

function boot() {
  if (!loadSavedState()) {
    startNewRun();
  } else {
    appendLog("Loaded saved run.");
    render();
  }
  updateOrientationPrompt();
}

function createInitialState() {
  return {
    saveVersion: SAVE_VERSION,
    mode: "battle",
    currentScreen: null,
    runNumber: 1,
    saveStatus: "Unsaved",
    currentRound: 1,
    cumulativeDamageDealt: 0,
    cumulativeDamageReceived: 0,
    battlesWon: 0,
    highestNodeReached: 0,
    map: [],
    currentNodeIndex: 0,
    currentDeck: [],
    items: [],
    battle: createBattleState(),
    selection: createSelectionState(),
    rewardOptions: [],
    eventState: null,
    log: [],
    tutorial: {
      dismissed: false
    },
    meta: {
      lifetimeRuns: 0,
      unlockedStarterKeys: ["classic"],
      activeStarterKey: "classic"
    }
  };
}

function createBattleState() {
  return {
    playerDamage: 0,
    enemyDamage: 0,
    playerBones: 0,
    hand: [],
    playerDeck: [],
    enemyDeck: [],
    playerSlots: [null, null, null, null],
    enemySlots: [null, null, null, null],
    enemyQueue: [null, null, null, null],
    skipEnemyAttackPhase: false,
    playerAirborneTurns: 0,
    awaitingDrawChoice: false,
    nodeType: "BATTLE",
    bossType: null,
    bossPhase: 1,
    anglerHookUsed: false
  };
}

function createSelectionState() {
  return {
    selectedHandIndex: null,
    selectedSacrificeIndexes: []
  };
}

function rewardCard(card, rarity) {
  return { card, rarity };
}

function createCard(name, attack, health, cost, costType, sigils) {
  return { name, attack, health, cost, costType, sigils: [...sigils], turnsInPlay: 0 };
}

function copyCard(card) {
  return {
    name: card.name,
    attack: card.attack,
    health: card.health,
    cost: card.cost,
    costType: card.costType,
    sigils: [...card.sigils],
    turnsInPlay: card.turnsInPlay || 0
  };
}

function copyItem(itemDef) {
  return { id: itemDef.id, name: itemDef.name, description: itemDef.description };
}

function buildStarterDeck() {
  const deck = STARTER_DECK.map(copyCard);
  const unlock = STARTER_UNLOCKS[state.meta?.activeStarterKey || "classic"];
  if (unlock?.bonusCard) {
    deck.push(unlock.bonusCard());
  }
  return deck;
}

function getStarterUnlockLabel(key) {
  return STARTER_UNLOCKS[key]?.label || "Classic";
}

function getNextStarterUnlockKey() {
  const keys = Array.isArray(state.meta?.unlockedStarterKeys) && state.meta.unlockedStarterKeys.length
    ? state.meta.unlockedStarterKeys
    : ["classic"];
  const offset = Math.max((state.meta?.lifetimeRuns || 1) - 1, 0);
  return keys[offset % keys.length];
}

function unlockStarter(key) {
  if (!STARTER_UNLOCKS[key]) {
    return;
  }
  state.meta.unlockedStarterKeys = Array.isArray(state.meta.unlockedStarterKeys) ? state.meta.unlockedStarterKeys : ["classic"];
  if (!state.meta.unlockedStarterKeys.includes(key)) {
    state.meta.unlockedStarterKeys.push(key);
    appendLog(`Unlocked starter boon: ${getStarterUnlockLabel(key)}.`);
    showTransientMessage(`Unlocked ${getStarterUnlockLabel(key)} for future runs.`, "success", 1800);
  }
}

function startNewRun() {
  const fresh = createInitialState();
  const previousMeta = Object.assign({ lifetimeRuns: 0, unlockedStarterKeys: ["classic"], activeStarterKey: "classic" }, state.meta || {});
  Object.assign(state, fresh);
  state.meta = previousMeta;
  state.meta.lifetimeRuns += 1;
  state.meta.activeStarterKey = getNextStarterUnlockKey();
  state.map = generateMap();
  state.currentDeck = buildStarterDeck();
  state.items = [copyItem(ITEM_DEFS.squirrelBottle)];
  moveToNode(0);
  appendLog(`Started a new run with ${getStarterUnlockLabel(state.meta.activeStarterKey)}.`);
  enterNode(getCurrentNode());
}

function clearSave() {
  window.localStorage.removeItem(SAVE_KEY);
  startNewRun();
  state.saveStatus = "Reset";
  refs.saveText.textContent = state.saveStatus;
}

function loadSavedState() {
  const raw = window.localStorage.getItem(SAVE_KEY);
  if (!raw) {
    return false;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.saveVersion !== SAVE_VERSION) {
      window.localStorage.removeItem(SAVE_KEY);
      return false;
    }
    const fresh = createInitialState();
    Object.assign(state, fresh, parsed);
    state.saveStatus = "Loaded";
    normalizeStateAfterLoad();
    return true;
  } catch (error) {
    console.error("Failed to load save", error);
    window.localStorage.removeItem(SAVE_KEY);
    return false;
  }
}

function normalizeStateAfterLoad() {
  state.battle = Object.assign(createBattleState(), state.battle || {});
  state.selection = Object.assign(createSelectionState(), state.selection || {});
  state.log = Array.isArray(state.log) ? state.log : [];
  state.items = Array.isArray(state.items) ? state.items : [];
  state.currentDeck = Array.isArray(state.currentDeck) ? state.currentDeck : [];
  state.map = Array.isArray(state.map) ? state.map : [];
  state.rewardOptions = Array.isArray(state.rewardOptions) ? state.rewardOptions : [];
  state.tutorial = Object.assign({ dismissed: false }, state.tutorial || {});
  state.meta = Object.assign({ lifetimeRuns: 0, unlockedStarterKeys: ["classic"], activeStarterKey: "classic" }, state.meta || {});
  ensureValidUiState("load");
}

function saveState() {
  window.localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  state.saveStatus = `Saved ${new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
}

function generateMap() {
  const allNodes = [];
  let nodeIndex = 0;

  REGIONS.forEach((region) => {
    const nodeCount = 8 + Math.floor(Math.random() * 5);
    const regionNodes = [];

    for (let i = 0; i < nodeCount; i += 1) {
      const node = {
        id: `${region.toLowerCase()}_${i}`,
        type: selectNodeType(i, nodeCount),
        region,
        position: nodeIndex,
        regionPosition: i,
        nextChoices: [],
        visited: false,
        completed: false
      };
      regionNodes.push(node);
      allNodes.push(node);
      nodeIndex += 1;
    }

    const bossNode = {
      id: `${region.toLowerCase()}_boss`,
      type: "BOSS",
      region,
      position: nodeIndex,
      regionPosition: nodeCount,
      nextChoices: [],
      visited: false,
      completed: false
    };
    regionNodes.push(bossNode);
    allNodes.push(bossNode);
    nodeIndex += 1;

    for (let i = 0; i < regionNodes.length - 1; i += 1) {
      const choices = 2 + Math.floor(Math.random() * 2);
      for (let j = 0; j < choices && i + 1 + j < regionNodes.length; j += 1) {
        regionNodes[i].nextChoices.push(regionNodes[i + 1 + j].position);
      }
    }
  });

  for (let regionIndex = 0; regionIndex < REGIONS.length - 1; regionIndex += 1) {
    const currentBoss = allNodes.find((node) => node.id === `${REGIONS[regionIndex].toLowerCase()}_boss`);
    const nextStart = allNodes.find((node) => node.id === `${REGIONS[regionIndex + 1].toLowerCase()}_0`);
    if (currentBoss && nextStart && !currentBoss.nextChoices.includes(nextStart.position)) {
      currentBoss.nextChoices.push(nextStart.position);
    }
  }

  return allNodes;
}

function selectNodeType(regionPosition, nodeCount) {
  if (regionPosition === 0 || regionPosition >= nodeCount - 2) {
    return "BATTLE";
  }

  const roll = Math.floor(Math.random() * 140);
  if (roll < 70) {
    return "BATTLE";
  }
  if (roll < 85) {
    return "CAMPFIRE";
  }
  if (roll < 95) {
    return "BACKPACK";
  }
  if (roll < 108) {
    return "SIGIL_TRANSFER";
  }
  if (roll < 120) {
    return "WOODCARVER";
  }
  if (roll < 130) {
    return "MYCOLOGISTS";
  }
  return "ECONOMY";
}

function getCurrentNode() {
  return state.map.find((node) => node.position === state.currentNodeIndex) || null;
}

function moveToNode(nodeIndex) {
  state.currentNodeIndex = nodeIndex;
  const node = getCurrentNode();
  if (node) {
    node.visited = true;
    state.highestNodeReached = Math.max(state.highestNodeReached, node.position);
  }
}

function findNodeByIndex(index) {
  return state.map.find((node) => node.position === index) || null;
}

function enterNode(node) {
  if (!node) {
    showRunComplete();
    return;
  }

  if (node.type === "BATTLE" || node.type === "BOSS") {
    startBattle(node);
    return;
  }

  if (node.type === "CAMPFIRE") {
    showCampfireEvent();
    return;
  }

  if (node.type === "BACKPACK") {
    showBackpackEvent();
    return;
  }

  if (node.type === "SIGIL_TRANSFER") {
    showSigilTransferEvent();
    return;
  }

  if (node.type === "WOODCARVER") {
    showWoodcarverEvent();
    return;
  }

  if (node.type === "MYCOLOGISTS") {
    showMycologistsEvent();
    return;
  }

  if (node.type === "ECONOMY") {
    showTraderEvent();
    return;
  }

  showMapSelection();
}

function startBattle(node) {
  state.mode = "battle";
  state.currentScreen = node.type === "BOSS" ? "Boss Battle" : "Battle";
  state.battle = createBattleState();
  state.selection = createSelectionState();
  clearTransientCombatUi();
  state.battle.nodeType = node.type;
  state.battle.bossType = node.type === "BOSS" ? getBossType(node.region) : null;
  state.battle.hand = [createLibraryCard("squirrel")];
  state.battle.playerDeck = shuffle(state.currentDeck.map(copyCard));
  state.battle.enemyDeck = shuffle(getEncounterDeck(node).map(copyCard));

  drawPlayerCard();
  drawPlayerCard();
  drawPlayerCard();
  fillEnemyQueue();
  state.battle.awaitingDrawChoice = false;
  setBattlePhase(node.type === "BOSS" ? `${getBossDisplayName()} awaits` : "Battle Ready", node.type === "BOSS" ? "enemy" : "neutral");
  showTransientMessage(node.type === "BOSS" ? `${getBossDisplayName()} enters the fight.` : `Battle begins in ${node.region}.`, node.type === "BOSS" ? "enemy" : "neutral", 1800);

  appendLog(`Entered ${node.type === "BOSS" ? "a boss battle" : "a battle"} in ${node.region}.`);
  render();
}

function getEncounterDeck(node) {
  const idx = node.position;
  if (node.type === "BOSS") {
    return getBossDeck(getBossType(node.region), 1);
  }

  if (idx < 6) {
    return [
      createCard("Adder", 1, 1, 1, "blood", []),
      createCard("Bullfrog", 1, 2, 1, "blood", ["Mighty Leap"]),
      createCard("Stoat", 1, 3, 1, "blood", []),
      createCard("Elk", 1, 4, 1, "blood", []),
      createCard("Mole", 0, 4, 2, "blood", ["Burrower"]),
      createCard("Skeleton", 1, 1, 1, "bones", []),
      createCard("Skunk", 0, 3, 1, "blood", ["Stinky"]),
      createCard("Otter", 1, 1, 1, "blood", ["Waterborne"])
    ];
  }

  if (idx < 11) {
    return [
      createCard("Wolf", 3, 2, 2, "blood", []),
      createCard("Raven", 2, 3, 2, "blood", ["Airborne"]),
      createCard("Bloodhound", 2, 3, 2, "blood", ["Guardian"]),
      createCard("Coyote", 2, 1, 4, "bones", []),
      createCard("Alpha", 1, 2, 2, "blood", ["Leader"]),
      createCard("Mole", 0, 4, 2, "blood", ["Burrower"]),
      createCard("Beehive", 0, 2, 1, "blood", ["Bees Within"]),
      createCard("Vulture", 3, 1, 2, "blood", ["Scavenger"]),
      createCard("Wolverine", 2, 3, 2, "blood", ["Blood Lust"])
    ];
  }

  return [
    createCard("Grizzly Bear", 4, 6, 3, "blood", []),
    createCard("Mantis God", 2, 1, 3, "blood", ["Double Strike"]),
    createCard("Wolf", 3, 2, 2, "blood", []),
    createCard("Raven", 2, 3, 2, "blood", ["Airborne"]),
    createCard("Mantis", 1, 1, 1, "blood", ["Bifurcated Strike"]),
    createCard("Bone Heap", 1, 2, 2, "bones", ["Sharp Quills"]),
    createCard("Cockroach", 1, 1, 4, "bones", ["Unkillable"]),
    createCard("Mole Man", 0, 6, 1, "blood", ["Burrower", "Mighty Leap", "Repulsive"]),
    createCard("Bone Lord", 1, 2, 1, "blood", ["Bone King"])
  ];
}

function createLibraryCard(key) {
  return CARD_LIBRARY[key] ? CARD_LIBRARY[key]() : null;
}

function getBossType(region) {
  if (region === "Woodlands") return "PROSPECTOR";
  if (region === "Wetlands") return "ANGLER";
  if (region === "Snowline") return "TRAPPER_TRADER";
  return null;
}

function getBossDeck(bossType, phase) {
  if (bossType === "PROSPECTOR") {
    if (phase === 1) {
      return [
        createLibraryCard("packMule"),
        createCard("Coyote", 2, 1, 4, "bones", []),
        createCard("Bloodhound", 2, 3, 2, "blood", ["Guardian"]),
        createCard("Prospector", 1, 4, 2, "blood", ["Sharp Quills"])
      ];
    }
    return [
      createCard("Bloodhound", 2, 3, 2, "blood", ["Guardian"]),
      createCard("Wolf", 3, 2, 2, "blood", []),
      createCard("Coyote", 2, 1, 4, "bones", []),
      createCard("Prospector", 2, 4, 2, "blood", [])
    ];
  }

  if (bossType === "ANGLER") {
    if (phase === 1) {
      return [
        createCard("Kingfisher", 1, 1, 1, "blood", ["Airborne"]),
        createCard("Mole", 0, 4, 2, "blood", ["Burrower"]),
        createCard("Angler", 2, 4, 2, "blood", []),
        createCard("Raven", 2, 3, 2, "blood", ["Airborne"])
      ];
    }
    return [createLibraryCard("shark"), createLibraryCard("shark"), createLibraryCard("shark"), createLibraryCard("shark")];
  }

  if (bossType === "TRAPPER_TRADER") {
    if (phase === 1) {
      return [
        createLibraryCard("leapingTrap"),
        createLibraryCard("leapingTrap"),
        createCard("Wolf", 3, 2, 2, "blood", []),
        createCard("Trapper", 1, 4, 2, "blood", [])
      ];
    }
    return [
        createCard("Trader", 2, 4, 2, "blood", []),
        createCard("Wolf", 3, 2, 2, "blood", []),
        createCard("Mantis God", 2, 2, 3, "blood", ["Trifurcated Strike"]),
        createCard("Raven", 2, 3, 2, "blood", ["Airborne"])
    ];
  }

  return [];
}

function showCardReward() {
  state.mode = "reward";
  state.currentScreen = "Choose a Reward";
  const currentNode = getCurrentNode();
  if (currentNode && currentNode.type === "BOSS") {
    state.rewardOptions = [pickRewardCardForTier("Uncommon"), pickRewardCardForTier("Rare"), pickRewardCardForTier("Rare")];
    state.items.push(copyItem(shuffle(Object.values(ITEM_DEFS))[0]));
    appendLog("Boss reward: you also found an item.");
  } else if (state.battlesWon > 0 && state.battlesWon % 4 === 0) {
    state.rewardOptions = [pickRewardCardForTier("Uncommon"), pickRewardCardForTier("Uncommon"), pickRewardCardForTier("Rare")];
  } else {
    state.rewardOptions = [pickRewardCard(), pickRewardCard(), pickRewardCard()];
  }
  render();
}

function pickRewardCard() {
  const node = getCurrentNode();
  const progress = node ? node.position / Math.max(state.map.length - 1, 1) : 0;
  const roll = Math.floor(Math.random() * 100);
  let rarity = "Common";
  if (progress > 0.7) {
    rarity = roll < 45 ? "Common" : roll < 82 ? "Uncommon" : "Rare";
  } else if (progress > 0.35) {
    rarity = roll < 58 ? "Common" : roll < 88 ? "Uncommon" : "Rare";
  } else {
    rarity = roll < 70 ? "Common" : roll < 92 ? "Uncommon" : "Rare";
  }
  return pickRewardCardForTier(rarity);
}

function pickRewardCardForTier(rarity) {
  const pool = REWARD_POOL.filter((entry) => entry.rarity === rarity);
  const selected = pool[Math.floor(Math.random() * pool.length)];
  return { card: copyCard(selected.card), rarity: selected.rarity };
}

function showMapSelection() {
  const currentNode = getCurrentNode();
  state.mode = "map";
  state.currentScreen = "Choose Your Path";
  state.eventState = {
    type: "map",
    choices: currentNode ? currentNode.nextChoices.map(findNodeByIndex) : []
  };
  render();
}

function showCampfireEvent() {
  state.mode = "campfire";
  state.currentScreen = "Campfire";
  state.eventState = { type: "campfire", step: "chooseCard", selectedCardIndex: null };
  render();
}

function showBackpackEvent() {
  state.mode = "backpack";
  state.currentScreen = "Backpack";
  state.eventState = { type: "backpack", options: shuffle(Object.values(ITEM_DEFS)).slice(0, 3).map(copyItem) };
  render();
}

function showSigilTransferEvent() {
  const hasDonors = state.currentDeck.some((card) => card.sigils.length > 0);
  state.mode = "sigil";
  state.currentScreen = "Ritual Stones";
  state.eventState = {
    type: "sigil",
    step: hasDonors ? "chooseDonor" : "empty",
    donorIndex: null,
    sigil: null
  };
  if (!hasDonors) {
    appendLog("No card in your deck has a sigil to transfer.");
  }
  render();
}

function showWoodcarverEvent() {
  state.mode = "woodcarver";
  state.currentScreen = "Totem Builder";
  state.eventState = {
    type: "woodcarver",
    step: "chooseSigil",
    offeredSigils: shuffle(SIGIL_STONE_POOL).slice(0, 3),
    chosenSigil: null
  };
  render();
}

function showMycologistsEvent() {
  state.mode = "mycologists";
  state.currentScreen = "Card Merge";
  state.eventState = {
    type: "mycologists",
    pairs: findMergePairs()
  };
  render();
}

function showTraderEvent() {
  state.mode = "economy";
  state.currentScreen = "Trader";
  state.eventState = {
    type: "economy",
    step: "chooseSacrifice",
    tradeOutIndex: null,
    offers: [pickRewardCardForTier("Uncommon"), pickRewardCardForTier("Uncommon"), pickRewardCardForTier("Rare")]
  };
  render();
}

async function endTurn() {
  if (state.mode !== "battle") {
    return;
  }
  if (uiState.turnAnimating) {
    return;
  }
  if (state.battle.awaitingDrawChoice) {
    appendLog("Choose whether to draw from the deck or take a Squirrel first.");
    showTransientMessage("Choose Deck or Squirrel before you play.", "warning");
    setBattlePhase("Waiting on draw", "warning");
    render();
    return;
  }

  uiState.turnAnimating = true;
  resetTurnSummary();
  setBattlePhase("Player attack phase", "player");
  showTransientMessage("Your side attacks first.", "player", 900);
  render();
  try {
    appendLog("Player attacks.");
    tickTurns(state.battle.playerSlots);
    await pauseBattleAction();
    for (let lane = 0; lane < 4; lane += 1) {
      await resolveAttackLane(state.battle.playerSlots, state.battle.enemySlots, lane, true);
    }
    if (checkBattleEnd()) {
      return;
    }

    if (state.battle.skipEnemyAttackPhase) {
      state.battle.skipEnemyAttackPhase = false;
      appendLog("Hourglass stopped the enemy attack.");
      setBattlePhase("Enemy attack skipped", "success");
      showTransientMessage("Hourglass skips the enemy attack phase.", "success", 1100);
      await pauseBattleAction();
    } else {
      appendLog("Enemy attacks.");
      tickTurns(state.battle.enemySlots);
      setBattlePhase("Enemy attack phase", "enemy");
      showTransientMessage("Enemy creatures strike back.", "enemy", 900);
      await pauseBattleAction();
      for (let lane = 0; lane < 4; lane += 1) {
        await resolveAttackLane(state.battle.enemySlots, state.battle.playerSlots, lane, false);
      }
    }
    if (checkBattleEnd()) {
      return;
    }

    if (state.battle.bossType === "ANGLER" && state.battle.bossPhase === 1 && !state.battle.anglerHookUsed) {
      performAnglerHook();
      await pauseBattleAction();
    }

    advanceEnemyBoard();
    finalizeTurnSummary();
    state.battle.awaitingDrawChoice = true;
    setBattlePhase("Choose a draw", "warning");
    state.battle.playerAirborneTurns = Math.max(0, state.battle.playerAirborneTurns - 1);
    state.selection = createSelectionState();
    await pauseBattleAction();
  } finally {
    uiState.turnAnimating = false;
    uiState.combatPreview = null;
    render();
  }
}

function performAnglerHook() {
  for (let lane = 0; lane < state.battle.playerSlots.length; lane += 1) {
    if (state.battle.playerSlots[lane] && !state.battle.enemySlots[lane]) {
      state.battle.enemySlots[lane] = state.battle.playerSlots[lane];
      state.battle.playerSlots[lane] = null;
      state.battle.anglerHookUsed = true;
      appendLog(`The Angler hooked away your ${state.battle.enemySlots[lane].name}.`);
      return;
    }
  }
  state.battle.anglerHookUsed = true;
}

function tickTurns(slots) {
  slots.forEach((card, index) => {
    if (!card) {
      return;
    }
    card.turnsInPlay = (card.turnsInPlay || 0) + 1;
    if (card.sigils.includes("Fledgling") && card.turnsInPlay >= 1) {
      evolveCard(slots, index);
    }
  });
}

function evolveCard(slots, index) {
  const card = slots[index];
  if (!card || !card.sigils.includes("Fledgling")) {
    return;
  }

  if (card.name === "Wolf Cub") {
    card.name = "Wolf";
    card.attack = 3;
    card.health = 2;
    card.cost = 2;
  } else {
    card.attack += 1;
    card.health += 1;
  }

  card.sigils = card.sigils.filter((sigil) => sigil !== "Fledgling");
  card.turnsInPlay = 0;
  appendLog(`${card.name} has grown.`);
}

async function resolveAttackLane(attackingRow, defendingRow, lane, isPlayer) {
  const attacker = attackingRow[lane];
  if (!attacker) {
    return;
  }
  const attackLanes = getAttackLanes(attacker, lane);
  const strikes = attacker.sigils.includes("Double Strike") ? 2 : 1;
  for (const targetLane of attackLanes) {
    for (let hit = 0; hit < strikes; hit += 1) {
      if (!attackingRow[lane]) {
        break;
      }
      await singleStrike(attackingRow, defendingRow, lane, targetLane, isPlayer);
    }
  }
}

function getAttackLanes(attacker, lane) {
  if (attacker.sigils.includes("Trifurcated Strike")) {
    return [lane - 1, lane, lane + 1].filter((targetLane) => targetLane >= 0 && targetLane < 4);
  }
  if (attacker.sigils.includes("Bifurcated Strike")) {
    return [lane - 1, lane + 1].filter((targetLane) => targetLane >= 0 && targetLane < 4);
  }
  return [lane];
}

async function singleStrike(attackingRow, defendingRow, attackerLane, targetLane, isPlayer) {
  const attacker = attackingRow[attackerLane];
  if (!attacker) {
    return;
  }

  uiState.combatPreview = {
    side: isPlayer ? "player" : "enemy",
    attackerLane,
    targetLane
  };
  emitBattleEffect("strike", { side: isPlayer ? "player" : "enemy", attackerLane, targetLane });
  queueLaneEffect(isPlayer ? "player" : "enemy", attackerLane, getAttackCue(attacker), "attack", 520);
  render();
  await sleep(280);

  const airborne = attacker.sigils.includes("Airborne") || (isPlayer && state.battle.playerAirborneTurns > 0);
  const defenderLane = resolveDefenderLane(defendingRow, targetLane, airborne);
  const defender = defenderLane === null ? null : defendingRow[defenderLane];
  const blockedByLeap = defender && defender.sigils.includes("Mighty Leap");
  const repulsive = defender && defender.sigils.includes("Repulsive");
  const waterborne = defender && defender.sigils.includes("Waterborne");
  const attackPower = getAttackPower(attacker, attackingRow, attackerLane, defendingRow, targetLane);

  if (attackPower <= 0) {
    appendLog(`${attacker.name} could not deal damage.`);
    queueLaneEffect(isPlayer ? "player" : "enemy", attackerLane, "0", "block");
    await pauseBattleAction();
    return;
  }

  if (!defender || repulsive || waterborne || (airborne && !blockedByLeap)) {
    if (isPlayer) {
      state.battle.playerDamage += attackPower;
      appendLog(`${attacker.name} struck the scale for ${attackPower}.`);
      noteTurnDirectDamage(true, attackPower);
      showScaleEffect(`+${attackPower}`, "player");
    } else {
      state.battle.enemyDamage += attackPower;
      appendLog(`${attacker.name} dealt ${attackPower} direct damage.`);
      noteTurnDirectDamage(false, attackPower);
      showScaleEffect(`-${attackPower}`, "enemy");
    }
    queueLaneEffect(isPlayer ? "player" : "enemy", attackerLane, `${attackPower}`, "direct");
    if (defender && repulsive) {
      queueLaneEffect(isPlayer ? "player" : "enemy", attackerLane, "Repelled", "block");
    } else if (defender && waterborne) {
      queueLaneEffect(isPlayer ? "player" : "enemy", attackerLane, "Over", "direct");
    } else if (airborne && !blockedByLeap) {
      queueLaneEffect(isPlayer ? "player" : "enemy", attackerLane, "Fly", "direct");
    }
    await pauseBattleAction();
    return;
  }

  dealCombatDamage(attackingRow, defendingRow, attackerLane, defenderLane, attackPower, isPlayer);
  await pauseBattleAction();
}

function resolveDefenderLane(defendingRow, targetLane, airborne) {
  const directDefender = defendingRow[targetLane];
  if (directDefender) {
    return targetLane;
  }
  if (airborne) {
    return null;
  }
  const burrowerLane = findBurrowerLane(defendingRow, targetLane);
  if (burrowerLane !== null && burrowerLane !== targetLane) {
    defendingRow[targetLane] = defendingRow[burrowerLane];
    defendingRow[burrowerLane] = null;
    appendLog(`${defendingRow[targetLane].name} burrowed into lane ${targetLane + 1}.`);
    queueLaneEffect(getLaneSide(defendingRow), targetLane, "Burrow", "move", 850);
    return targetLane;
  }
  return burrowerLane;
}

function findBurrowerLane(defendingRow, targetLane) {
  if (defendingRow[targetLane] && defendingRow[targetLane].sigils.includes("Burrower")) {
    return targetLane;
  }
  for (let lane = 0; lane < defendingRow.length; lane += 1) {
    const card = defendingRow[lane];
    if (card && card.sigils.includes("Burrower")) {
      return lane;
    }
  }
  return null;
}

function getAttackPower(attacker, attackingRow, attackerLane, defendingRow, targetLane) {
  let power = attacker.attack;

  const leftAlly = attackingRow[attackerLane - 1];
  const rightAlly = attackingRow[attackerLane + 1];
  if (leftAlly && leftAlly.sigils.includes("Leader")) {
    power += 1;
  }
  if (rightAlly && rightAlly.sigils.includes("Leader")) {
    power += 1;
  }

  const opposingCard = defendingRow[targetLane];
  if (opposingCard && opposingCard.sigils.includes("Stinky")) {
    power -= 1;
  }

  return Math.max(power, 0);
}

function dealCombatDamage(attackingRow, defendingRow, attackerLane, defenderLane, attackPower, isPlayer) {
  const attacker = attackingRow[attackerLane];
  const defender = defendingRow[defenderLane];
  if (!defender) {
    return;
  }

  const lethal = attacker.sigils.includes("Touch of Death");
  defender.health = lethal ? 0 : defender.health - attackPower;
  appendLog(`${attacker.name} hit ${defender.name} for ${lethal ? "lethal" : attackPower}.`);
  queueLaneEffect(isPlayer ? "enemy" : "player", defenderLane, lethal ? "Lethal" : `-${attackPower}`, lethal ? "death" : "hit");

  if (defender.sigils.includes("Bees Within") && !isPlayer) {
    state.battle.hand.push(createLibraryCard("bee"));
    appendLog(`${defender.name} released a Bee into your hand.`);
    showTransientMessage(`${defender.name} released a Bee into your hand.`, "success", 1100);
  }

  if (defender.sigils.includes("Sharp Quills")) {
    attacker.health -= 1;
    appendLog(`${defender.name} reflected 1 damage.`);
    queueLaneEffect(isPlayer ? "player" : "enemy", attackerLane, "Quills", "block", 850);
    if (attacker.health <= 0) {
      removeDeadCard(attackingRow, attackerLane, isPlayer, { kind: "combat", lane: attackerLane, attacker: defender });
    }
  }

  if (defender.health <= 0) {
    removeDeadCard(defendingRow, defenderLane, !isPlayer, { kind: "combat", lane: defenderLane, attacker });
  }
}

function removeDeadCard(row, lane, belongsToPlayer, cause = { kind: "combat", lane }) {
  const card = row[lane];
  if (!card) {
    return;
  }
  const side = belongsToPlayer ? "player" : "enemy";
  row[lane] = null;
  if (!belongsToPlayer && card.name === "Bait Bucket") {
    row[lane] = createLibraryCard("shark");
    appendLog("A shark burst from the bait bucket.");
    noteTurnSummon("Shark", false);
    queueLaneEffect("enemy", lane, "Shark", "spawn", 1000);
    return;
  }
  onCardRemoved(card, belongsToPlayer, cause);
  noteTurnDeath(card.name, belongsToPlayer);
  queueLaneEffect(side, lane, `${card.name} down`, "death", 1050);
  appendLog(`${card.name} was destroyed.`);
}

function checkBattleEnd() {
  if (state.battle.playerDamage >= 5) {
    if (state.battle.nodeType === "BOSS" && state.battle.bossPhase === 1) {
      triggerBossPhaseTransition();
      return true;
    }
    const node = getCurrentNode();
    if (node) {
      node.completed = true;
    }
    state.battlesWon += 1;
    if (state.battlesWon >= 1) {
      unlockStarter("bones");
    }
    if (state.battle.nodeType === "BOSS") {
      unlockStarter("sky");
    }
    state.currentRound += 1;
    state.cumulativeDamageDealt += state.battle.playerDamage;
    state.cumulativeDamageReceived += state.battle.enemyDamage;
    appendLog("Battle won.");
    showCardReward();
    return true;
  }

  if (state.battle.enemyDamage >= 5) {
    state.cumulativeDamageDealt += state.battle.playerDamage;
    state.cumulativeDamageReceived += state.battle.enemyDamage;
    state.mode = "gameover";
    state.currentScreen = "Run Over";
    state.eventState = { type: "gameover" };
    appendLog("The run is over.");
    render();
    return true;
  }

  return false;
}

function triggerBossPhaseTransition() {
  state.battle.bossPhase = 2;
  state.battle.playerDamage = 0;
  state.battle.enemyDamage = 0;
  emitBattleEffect("boss_phase", { bossType: state.battle.bossType, label: `${getBossDisplayName()} phase 2` });
  showScaleEffect("Reset", "neutral", 1200);
  setBattlePhase(`${getBossDisplayName()} phase 2`, "enemy");
  showTransientMessage(`${getBossDisplayName()} changes the fight.`, "enemy", 2200);
  appendLog(`${getBossDisplayName()} reveals a second phase.`);

  if (state.battle.bossType === "PROSPECTOR") {
    transformPlayerBoardToGold();
    refillBossEnemyDeck();
    appendLog("Prospector phase two: your creatures turn to gold.");
  } else if (state.battle.bossType === "ANGLER") {
    replaceEnemyBoardWithBaitBuckets();
    refillBossEnemyDeck();
    appendLog("Angler phase two: bait buckets line the shore.");
  } else if (state.battle.bossType === "TRAPPER_TRADER") {
    addPeltsToHand();
    clearEnemyBoardAndQueue();
    refillBossEnemyDeck();
    appendLog("Trader phase two: pelts for the bargain.");
  }

  render();
}

function getBossDisplayName() {
  if (state.battle.bossType === "PROSPECTOR") return "The Prospector";
  if (state.battle.bossType === "ANGLER") return "The Angler";
  if (state.battle.bossType === "TRAPPER_TRADER") return "The Trader";
  return "The boss";
}

function refillBossEnemyDeck() {
  state.battle.enemyDeck = shuffle(getBossDeck(state.battle.bossType, 2).map(copyCard));
  fillEnemyQueue();
}

function transformPlayerBoardToGold() {
  state.battle.playerSlots = state.battle.playerSlots.map((card) => (card ? createLibraryCard("goldNugget") : null));
}

function replaceEnemyBoardWithBaitBuckets() {
  clearEnemyBoardAndQueue();
  state.battle.enemySlots = state.battle.enemySlots.map(() => createLibraryCard("baitBucket"));
}

function addPeltsToHand() {
  state.battle.hand.push(createLibraryCard("rabbitPelt"));
  state.battle.hand.push(createLibraryCard("rabbitPelt"));
}

function clearEnemyBoardAndQueue() {
  state.battle.enemySlots = [null, null, null, null];
  state.battle.enemyQueue = [null, null, null, null];
}

function showRunComplete() {
  state.mode = "complete";
  state.currentScreen = "Run Complete";
  state.eventState = { type: "complete" };
  render();
}

function setBattleScreenState(node) {
  state.mode = "battle";
  state.currentScreen = node && node.type === "BOSS" ? "Boss Battle" : "Battle";
  state.eventState = null;
}

function setMapScreenState(node) {
  state.mode = "map";
  state.currentScreen = "Choose Your Path";
  state.eventState = {
    type: "map",
    choices: node ? node.nextChoices.map(findNodeByIndex) : []
  };
}

function restoreNodeScreenState(node) {
  if (!node) {
    state.mode = "complete";
    state.currentScreen = "Run Complete";
    state.eventState = { type: "complete" };
    return;
  }

  if (node.completed) {
    setMapScreenState(node);
    return;
  }

  if (node.type === "BATTLE" || node.type === "BOSS") {
    setBattleScreenState(node);
    return;
  }

  if (node.type === "CAMPFIRE") {
    state.mode = "campfire";
    state.currentScreen = "Campfire";
    state.eventState = { type: "campfire", step: "chooseCard", selectedCardIndex: null };
    return;
  }

  if (node.type === "BACKPACK") {
    state.mode = "backpack";
    state.currentScreen = "Backpack";
    state.eventState = { type: "backpack", options: shuffle(Object.values(ITEM_DEFS)).slice(0, 3).map(copyItem) };
    return;
  }

  if (node.type === "SIGIL_TRANSFER") {
    const hasDonors = state.currentDeck.some((card) => card.sigils.length > 0);
    state.mode = "sigil";
    state.currentScreen = "Ritual Stones";
    state.eventState = {
      type: "sigil",
      step: hasDonors ? "chooseDonor" : "empty",
      donorIndex: null,
      sigil: null
    };
    return;
  }

  if (node.type === "WOODCARVER") {
    state.mode = "woodcarver";
    state.currentScreen = "Totem Builder";
    state.eventState = {
      type: "woodcarver",
      step: "chooseSigil",
      offeredSigils: shuffle(SIGIL_STONE_POOL).slice(0, 3),
      chosenSigil: null
    };
    return;
  }

  if (node.type === "MYCOLOGISTS") {
    state.mode = "mycologists";
    state.currentScreen = "Card Merge";
    state.eventState = {
      type: "mycologists",
      pairs: findMergePairs()
    };
    return;
  }

  if (node.type === "ECONOMY") {
    state.mode = "economy";
    state.currentScreen = "Trader";
    state.eventState = {
      type: "economy",
      step: "chooseSacrifice",
      tradeOutIndex: null,
      offers: [pickRewardCardForTier("Uncommon"), pickRewardCardForTier("Uncommon"), pickRewardCardForTier("Rare")]
    };
    return;
  }

  setMapScreenState(node);
}

function isValidModalState() {
  if (!MODAL_MODES.has(state.mode)) {
    return false;
  }

  if (state.mode === "reward") {
    return state.rewardOptions.length > 0;
  }
  if (state.mode === "map") {
    return state.eventState?.type === "map" && Array.isArray(state.eventState.choices);
  }
  if (state.mode === "campfire") {
    return state.eventState?.type === "campfire" && ["chooseCard", "buffChoice"].includes(state.eventState.step);
  }
  if (state.mode === "backpack") {
    return state.eventState?.type === "backpack" && Array.isArray(state.eventState.options);
  }
  if (state.mode === "sigil") {
    return state.eventState?.type === "sigil" && ["empty", "chooseDonor", "chooseSigil", "chooseReceiver"].includes(state.eventState.step);
  }
  if (state.mode === "woodcarver") {
    return state.eventState?.type === "woodcarver" && ["chooseSigil", "chooseReceiver"].includes(state.eventState.step);
  }
  if (state.mode === "mycologists") {
    return state.eventState?.type === "mycologists" && Array.isArray(state.eventState.pairs);
  }
  if (state.mode === "economy") {
    return state.eventState?.type === "economy" && ["chooseSacrifice", "chooseReward"].includes(state.eventState.step) && Array.isArray(state.eventState.offers);
  }
  if (state.mode === "gameover") {
    return state.eventState?.type === "gameover";
  }
  if (state.mode === "complete") {
    return state.eventState?.type === "complete";
  }

  return false;
}

function ensureValidUiState(source = "render") {
  if (!VALID_MODES.has(state.mode)) {
    restoreNodeScreenState(getCurrentNode());
    appendLog(`Recovered from an invalid UI mode during ${source}.`);
    return;
  }

  if (state.mode === "battle") {
    state.eventState = null;
    return;
  }

  if (!isValidModalState()) {
    restoreNodeScreenState(getCurrentNode());
    appendLog(`Recovered from a stuck popup state during ${source}.`);
  }
}

function advanceEnemyBoard() {
  for (let lane = 0; lane < 4; lane += 1) {
    if (!state.battle.enemySlots[lane] && state.battle.enemyQueue[lane]) {
      state.battle.enemySlots[lane] = state.battle.enemyQueue[lane];
      noteTurnSummon(state.battle.enemySlots[lane].name, false);
      state.battle.enemyQueue[lane] = null;
      handleGuardianResponse(state.battle.playerSlots, lane);
    }
  }
  fillEnemyQueue();
}

function drawStartOfTurnCard() {
  state.battle.awaitingDrawChoice = true;
}

function chooseDraw(kind) {
  if (state.mode !== "battle" || !state.battle.awaitingDrawChoice) {
    return;
  }
  if (uiState.turnAnimating) {
    return;
  }

  if (kind === "squirrel") {
    state.battle.hand.push(createLibraryCard("squirrel"));
    appendLog("Drew a Squirrel.");
    showTransientMessage("Drew a Squirrel.", "player", 900);
  } else {
    if (state.battle.playerDeck.length > 0) {
      drawPlayerCard();
    } else {
      appendLog("Deck is empty. Drew a Squirrel instead.");
      state.battle.hand.push(createLibraryCard("squirrel"));
      showTransientMessage("Deck empty. Drew a Squirrel instead.", "warning", 1100);
    }
  }

  state.battle.awaitingDrawChoice = false;
  setBattlePhase("Play a card or end turn", "player");
  render();
}

function drawPlayerCard() {
  if (state.battle.playerDeck.length > 0) {
    const card = state.battle.playerDeck.shift();
    state.battle.hand.push(card);
    appendLog(`Drew ${card.name}.`);
  }
}

function fillEnemyQueue() {
  const laneOrder = getPreferredEnemyQueueOrder();
  for (const lane of laneOrder) {
    if (!state.battle.enemyQueue[lane] && state.battle.enemyDeck.length > 0) {
      const card = state.battle.enemyDeck.shift();
      state.battle.enemyQueue[lane] = card;
      appendLog(`Enemy queued ${card.name} for lane ${lane + 1}.`);
    }
  }
}

function getPreferredEnemyQueueOrder() {
  if (state.battle.bossType === "PROSPECTOR") {
    return [1, 2, 0, 3];
  }
  if (state.battle.bossType === "ANGLER") {
    return [0, 3, 1, 2];
  }
  if (state.battle.bossType === "TRAPPER_TRADER") {
    return [0, 2, 1, 3];
  }
  const region = getCurrentNode()?.region;
  if (region === "Woodlands") {
    return [1, 2, 0, 3];
  }
  if (region === "Wetlands") {
    return [0, 3, 1, 2];
  }
  if (region === "Snowline") {
    return [0, 2, 1, 3];
  }
  return [0, 1, 2, 3];
}

function useItem(itemId) {
  if (state.mode !== "battle") {
    return;
  }
  if (uiState.turnAnimating) {
    return;
  }

  const item = state.items.find((entry) => entry.id === itemId);
  if (!item) {
    return;
  }

  if (itemId === "pliers") {
    state.battle.playerDamage += 1;
    appendLog("You used the pliers on the scale.");
    showScaleEffect("+1", "player");
    showTransientMessage("Pliers tip the scale.", "player", 1000);
  } else if (itemId === "squirrelBottle") {
    state.battle.hand.push(createLibraryCard("squirrel"));
    appendLog("A bottled squirrel leapt into your hand.");
    showTransientMessage("A Squirrel jumps into your hand.", "success", 1000);
  } else if (itemId === "hourglass") {
    state.battle.skipEnemyAttackPhase = true;
    appendLog("Time slowed. The enemy will miss its next attack.");
    setBattlePhase("Enemy attack skipped next turn", "success");
    showTransientMessage("Hourglass primed.", "success", 1000);
  } else if (itemId === "fan") {
    state.battle.playerAirborneTurns = 1;
    appendLog("A gust lifts your side into the air.");
    showTransientMessage("Your side gains Airborne this turn.", "player", 1000);
  } else if (itemId === "boneJar") {
    gainBones(4);
    appendLog("The jar cracked open into four bones.");
    showTransientMessage("+4 bones.", "success", 900);
  } else if (itemId === "blackGoatBottle") {
    state.battle.hand.push(createLibraryCard("blackGoat"));
    appendLog("A Black Goat emerged from the bottle.");
    showTransientMessage("Black Goat added to hand.", "success", 1000);
  }

  state.items = state.items.filter((entry) => entry.id !== itemId);
  if (!checkBattleEnd()) {
    render();
  }
}

function getSelectedHandCard() {
  return state.selection.selectedHandIndex === null ? null : state.battle.hand[state.selection.selectedHandIndex] || null;
}

function selectHandCard(index) {
  if (uiState.turnAnimating) {
    return;
  }
  state.selection.selectedHandIndex = index;
  state.selection.selectedSacrificeIndexes = [];
  appendLog(`Selected ${state.battle.hand[index].name}.`);
  setBattlePhase(`Selected ${state.battle.hand[index].name}`, "player");
  render();
}

function onPlayerSlotClick(index) {
  if (uiState.turnAnimating) {
    return;
  }
  if (state.battle.awaitingDrawChoice) {
    appendLog("Choose your draw first.");
    showTransientMessage("Choose Deck or Squirrel before placing a card.", "warning");
    setBattlePhase("Waiting on draw", "warning");
    return;
  }

  const selectedCard = getSelectedHandCard();
  if (!selectedCard) {
    appendLog("Select a hand card first.");
    showTransientMessage("Select a card in hand first.", "warning");
    return;
  }

  if (selectedCard.costType === "bones") {
    if (state.battle.playerSlots[index]) {
      appendLog("That lane is occupied.");
      showTransientMessage(`Lane ${index + 1} is occupied.`, "warning");
      return;
    }
    if (state.battle.playerBones < selectedCard.cost) {
      appendLog(`You need ${selectedCard.cost} bones for ${selectedCard.name}.`);
      showTransientMessage(`${selectedCard.name} needs ${selectedCard.cost} bones.`, "warning");
      return;
    }
    state.battle.playerBones -= selectedCard.cost;
    placeSelectedCard(index);
    return;
  }

  if (state.battle.playerSlots[index] && !state.selection.selectedSacrificeIndexes.includes(index)) {
    toggleSacrifice(index);
    return;
  }

  if (state.battle.playerSlots[index] && state.selection.selectedSacrificeIndexes.includes(index) && getSelectedSacrificeValue() >= selectedCard.cost) {
    consumeSacrifices();
    placeSelectedCard(index);
    return;
  }

  if (state.battle.playerSlots[index]) {
    appendLog("That lane is occupied.");
    showTransientMessage(`Lane ${index + 1} is occupied.`, "warning");
    return;
  }

  if (selectedCard.cost > 0 && getSelectedSacrificeValue() < selectedCard.cost) {
    appendLog(`Select ${selectedCard.cost} sacrifice${selectedCard.cost > 1 ? "s" : ""} first.`);
    showTransientMessage(`Need ${selectedCard.cost} blood before placing ${selectedCard.name}.`, "warning");
    return;
  }

  consumeSacrifices();
  placeSelectedCard(index);
}

function toggleSacrifice(index) {
  if (uiState.turnAnimating) {
    return;
  }
  const selectedCard = getSelectedHandCard();
  if (!selectedCard || selectedCard.costType !== "blood" || selectedCard.cost === 0) {
    appendLog("No sacrifices needed.");
    showTransientMessage("That card does not need blood sacrifices.", "warning");
    return;
  }

  const existing = state.selection.selectedSacrificeIndexes.indexOf(index);
  if (existing >= 0) {
    state.selection.selectedSacrificeIndexes.splice(existing, 1);
    appendLog(`Removed ${state.battle.playerSlots[index].name} from sacrifices.`);
  } else if (getSelectedSacrificeValue() < selectedCard.cost) {
    state.selection.selectedSacrificeIndexes.push(index);
    appendLog(`Marked ${state.battle.playerSlots[index].name} for sacrifice.`);
  } else {
    appendLog("Enough sacrifices already selected.");
    showTransientMessage("You already have enough blood selected.", "warning");
  }
  render();
}

function consumeSacrifices() {
  const indexes = [...state.selection.selectedSacrificeIndexes].sort((a, b) => b - a);
  indexes.forEach((index) => {
    const card = state.battle.playerSlots[index];
    if (!card) {
      return;
    }
    if (!card.sigils.includes("Many Lives")) {
      state.battle.playerSlots[index] = null;
      onCardRemoved(card, true, { kind: "sacrifice", lane: index, row: state.battle.playerSlots });
    }
    appendLog(`Sacrificed ${card.name}.`);
  });
  state.selection.selectedSacrificeIndexes = [];
}

function placeSelectedCard(index) {
  const selectedIndex = state.selection.selectedHandIndex;
  const selectedCard = getSelectedHandCard();
  if (selectedIndex === null || !selectedCard) {
    return;
  }
  state.battle.playerSlots[index] = selectedCard;
  state.battle.hand.splice(selectedIndex, 1);
  state.selection = createSelectionState();
  appendLog(`Played ${selectedCard.name}.`);
  queueLaneEffect("player", index, "Played", "spawn", 850);
  setBattlePhase(`${selectedCard.name} entered lane ${index + 1}`, "player");
  runOnCardPlaced(state.battle.playerSlots, index, true);
  handleGuardianResponse(state.battle.enemySlots, index);
  render();
}

function handleGuardianResponse(guardRow, targetLane) {
  if (guardRow[targetLane]) {
    return;
  }

  for (let lane = 0; lane < guardRow.length; lane += 1) {
    const card = guardRow[lane];
    if (!card || !card.sigils.includes("Guardian")) {
      continue;
    }
    guardRow[targetLane] = card;
    guardRow[lane] = null;
    appendLog(`${card.name} guarded lane ${targetLane + 1}.`);
    queueLaneEffect("enemy", targetLane, "Guard", "move", 900);
    return;
  }
}

function runOnCardPlaced(row, lane, belongsToPlayer) {
  const card = row[lane];
  if (!card) {
    return;
  }

  noteTurnSummon(card.name, belongsToPlayer);

  if (belongsToPlayer && card.sigils.includes("Ant Spawner")) {
    state.battle.hand.push(createLibraryCard("workerAnt"));
    appendLog("An Ant scurried into your hand.");
  }

  if (belongsToPlayer && card.sigils.includes("Bellist")) {
    createAdjacentChimes(row, lane);
  }

  if (belongsToPlayer && card.sigils.includes("Trinket Bearer")) {
    const item = copyItem(shuffle(Object.values(ITEM_DEFS))[0]);
    state.items.push(item);
    appendLog(`${card.name} found ${item.name}.`);
  }
}

function createAdjacentChimes(row, lane) {
  if (lane > 0 && !row[lane - 1]) {
    row[lane - 1] = createLibraryCard("chime");
    noteTurnSummon("Chime", true);
  }
  if (lane < row.length - 1 && !row[lane + 1]) {
    row[lane + 1] = createLibraryCard("chime");
    noteTurnSummon("Chime", true);
  }
  appendLog("Chimes rang out beside the card.");
}

function onCardRemoved(card, belongsToPlayer, cause) {
  if (belongsToPlayer) {
    gainBones(card.sigils.includes("Bone King") ? 4 : 1);
  }

  if (belongsToPlayer && card.sigils.includes("Unkillable")) {
    state.battle.hand.push(copyCard(card));
    appendLog(`${card.name} returned to your hand.`);
  }

  if (belongsToPlayer && cause.kind === "combat") {
    tryCorpseEater(cause.lane);
  }

  if (!belongsToPlayer && cause.kind === "combat") {
    rewardScavengers();
    if (cause.attacker && cause.attacker.sigils.includes("Blood Lust")) {
      cause.attacker.attack += 1;
      appendLog(`${cause.attacker.name} grew stronger from Blood Lust.`);
    }
  }
}

function tryCorpseEater(lane) {
  const handIndex = state.battle.hand.findIndex((card) => card.sigils.includes("Corpse Eater"));
  if (handIndex < 0 || state.battle.playerSlots[lane]) {
    return;
  }
  const corpseEater = state.battle.hand.splice(handIndex, 1)[0];
  state.battle.playerSlots[lane] = corpseEater;
  appendLog(`${corpseEater.name} leapt from your hand to eat the corpse.`);
  runOnCardPlaced(state.battle.playerSlots, lane, true);
}

function rewardScavengers() {
  const scavenger = state.battle.playerSlots.some((card) => card && card.sigils.includes("Scavenger"));
  if (scavenger) {
    gainBones(1);
    appendLog("A scavenger harvested 1 bone.");
  }
}

function canPlaceOnSlot(index) {
  const selectedCard = getSelectedHandCard();
  if (!selectedCard || state.battle.playerSlots[index]) {
    return false;
  }
  if (selectedCard.costType === "bones") {
    return state.battle.playerBones >= selectedCard.cost;
  }
  return getSelectedSacrificeValue() >= selectedCard.cost;
}

function getSacrificeValue(card) {
  if (!card) {
    return 0;
  }
  return card.sigils.includes("Worthy Sacrifice") ? 3 : 1;
}

function getSelectedSacrificeValue() {
  return state.selection.selectedSacrificeIndexes.reduce((total, index) => total + getSacrificeValue(state.battle.playerSlots[index]), 0);
}

function gainBones(amount) {
  state.battle.playerBones += amount;
  noteTurnBones(amount);
}

function chooseReward(index) {
  const reward = state.rewardOptions[index];
  if (!reward) {
    return;
  }
  state.currentDeck.push(copyCard(reward.card));
  appendLog(`Added ${reward.card.name} to the deck.`);
  state.rewardOptions = [];
  showMapSelection();
}

function chooseMapNode(index) {
  moveToNode(index);
  enterNode(getCurrentNode());
}

function chooseCampfireCard(index) {
  state.eventState.selectedCardIndex = index;
  state.eventState.step = "buffChoice";
  render();
}

function applyCampfireBuff(kind) {
  const card = state.currentDeck[state.eventState.selectedCardIndex];
  if (!card) {
    return;
  }
  if (kind === "power") {
    card.attack += 1;
    appendLog(`${card.name} gained 1 power at the campfire.`);
  } else {
    card.health += 2;
    appendLog(`${card.name} gained 2 health at the campfire.`);
  }
  completeCurrentEvent();
}

function chooseBackpackItem(index) {
  const item = state.eventState.options[index];
  if (!item) {
    return;
  }
  state.items.push(copyItem(item));
  appendLog(`Packed ${item.name}.`);
  completeCurrentEvent();
}

function chooseSigilDonor(index) {
  state.eventState.donorIndex = index;
  state.eventState.step = "chooseSigil";
  render();
}

function chooseSigil(sigil) {
  state.eventState.sigil = sigil;
  state.eventState.step = "chooseReceiver";
  render();
}

function chooseSigilReceiver(index) {
  const donorIndex = state.eventState.donorIndex;
  const receiver = state.currentDeck[index];
  const donor = state.currentDeck[donorIndex];
  const sigil = state.eventState.sigil;
  if (!receiver || !donor || donorIndex === index || receiver.sigils.includes(sigil)) {
    return;
  }
  receiver.sigils.push(sigil);
  state.currentDeck.splice(donorIndex, 1);
  appendLog(`${receiver.name} inherited ${sigil}.`);
  completeCurrentEvent();
}

function chooseWoodcarverSigil(sigil) {
  state.eventState.chosenSigil = sigil;
  state.eventState.step = "chooseReceiver";
  render();
}

function chooseWoodcarverReceiver(index) {
  const card = state.currentDeck[index];
  const sigil = state.eventState.chosenSigil;
  if (!card || !sigil || card.sigils.includes(sigil)) {
    return;
  }
  card.sigils.push(sigil);
  appendLog(`${card.name} gained ${sigil}.`);
  completeCurrentEvent();
}

function findMergePairs() {
  const groups = new Map();
  state.currentDeck.forEach((card, index) => {
    if (!groups.has(card.name)) {
      groups.set(card.name, []);
    }
    groups.get(card.name).push(index);
  });

  const pairs = [];
  groups.forEach((indexes, name) => {
    if (indexes.length >= 2) {
      pairs.push({ name, indexes: indexes.slice(0, 2) });
    }
  });
  return pairs;
}

function chooseMergePair(pairIndex) {
  const pair = state.eventState.pairs[pairIndex];
  if (!pair) {
    return;
  }
  const [firstIndex, secondIndex] = pair.indexes;
  const base = state.currentDeck[firstIndex];
  const other = state.currentDeck[secondIndex];
  if (!base || !other) {
    return;
  }
  base.attack += 1;
  base.health += 2;
  other.sigils.forEach((sigil) => {
    if (!base.sigils.includes(sigil)) {
      base.sigils.push(sigil);
    }
  });
  state.currentDeck.splice(secondIndex, 1);
  appendLog(`The Mycologists merged ${pair.name} into a stronger card.`);
  completeCurrentEvent();
}

function chooseTraderSacrifice(index) {
  state.eventState.tradeOutIndex = index;
  state.eventState.step = "chooseReward";
  render();
}

function chooseTraderOffer(index) {
  const offer = state.eventState.offers[index];
  const tradeOutIndex = state.eventState.tradeOutIndex;
  if (!offer || tradeOutIndex === null) {
    return;
  }
  const tradedCard = state.currentDeck[tradeOutIndex];
  state.currentDeck.splice(tradeOutIndex, 1);
  state.currentDeck.push(copyCard(offer.card));
  appendLog(`Traded ${tradedCard.name} for ${offer.card.name}.`);
  completeCurrentEvent();
}

function completeCurrentEvent() {
  const node = getCurrentNode();
  if (node) {
    node.completed = true;
  }
  showMapSelection();
}

function render() {
  ensureValidUiState();
  saveState();
  updateOrientationPrompt();
  renderMeta();
  renderBattle();
  renderChoiceScreen();
  renderRunInfo();
  renderDeck();
  renderLog();
  renderInfoPanels();
  renderSigilInspector();
  renderDrawModal();
  refs.endTurnButton.disabled = state.mode !== "battle" || uiState.turnAnimating;
}

function setMobileInfoPanel(panel) {
  if (!INFO_PANELS.includes(panel)) {
    return;
  }
  uiState.mobileInfoPanel = panel;
  renderInfoPanels();
}

function renderInfoPanels() {
  const panelMap = {
    run: { tab: refs.infoTabRun, panel: refs.infoPanelRun },
    deck: { tab: refs.infoTabDeck, panel: refs.infoPanelDeck },
    log: { tab: refs.infoTabLog, panel: refs.infoPanelLog }
  };

  INFO_PANELS.forEach((name) => {
    const active = uiState.mobileInfoPanel === name;
    panelMap[name].tab.classList.toggle("active", active);
    panelMap[name].tab.setAttribute("aria-pressed", String(active));
    panelMap[name].panel.classList.toggle("active", active);
  });
}

function updateOrientationPrompt() {
  if (refs.rotateOverlay) {
    refs.rotateOverlay.classList.add("hidden");
  }
}

function forceCloseModal() {
  if (state.mode === "battle") {
    return;
  }
  restoreNodeScreenState(getCurrentNode());
  render();
}

function openSigilInspector(card) {
  if (!card || !card.sigils?.length) {
    return;
  }
  uiState.sigilInspector = {
    cardName: card.name,
    sigils: [...card.sigils]
  };
  renderSigilInspector();
}

function closeSigilInspector() {
  uiState.sigilInspector = null;
  renderSigilInspector();
}

function clearTransientCombatUi() {
  uiState.combatPreview = null;
  uiState.transientMessage = null;
  uiState.scaleEffect = null;
  uiState.laneEffects = [];
  uiState.turnSummary = createTurnSummary();
  uiState.lastTurnSummary = null;
  uiState.fxEvents = [];
  setBattlePhase("Battle Ready", "neutral");
  window.clearTimeout(uiState.timers.message);
  window.clearTimeout(uiState.timers.scale);
  uiState.timers.message = null;
  uiState.timers.scale = null;
}

function setBattlePhase(text, tone = "neutral") {
  uiState.battlePhase = { text, tone };
}

function emitBattleEffect(type, payload = {}) {
  uiState.fxEvents.push({
    id: ++uiState.effectCounter,
    type,
    payload,
    at: Date.now()
  });
  if (uiState.fxEvents.length > 16) {
    uiState.fxEvents.shift();
  }
  playFeedback(type, payload);
}

function createTurnSummary() {
  return {
    playerDirect: 0,
    enemyDirect: 0,
    playerDeaths: [],
    enemyDeaths: [],
    bonesGained: 0,
    summons: []
  };
}

function resetTurnSummary() {
  uiState.turnSummary = createTurnSummary();
}

function noteTurnDirectDamage(isPlayer, amount) {
  if (!uiState.turnSummary) {
    resetTurnSummary();
  }
  if (isPlayer) {
    uiState.turnSummary.playerDirect += amount;
  } else {
    uiState.turnSummary.enemyDirect += amount;
  }
}

function noteTurnDeath(cardName, belongsToPlayer) {
  if (!uiState.turnSummary) {
    resetTurnSummary();
  }
  const list = belongsToPlayer ? uiState.turnSummary.playerDeaths : uiState.turnSummary.enemyDeaths;
  list.push(cardName);
}

function noteTurnBones(amount) {
  if (!uiState.turnSummary) {
    resetTurnSummary();
  }
  uiState.turnSummary.bonesGained += amount;
}

function noteTurnSummon(cardName, belongsToPlayer) {
  if (!uiState.turnSummary) {
    resetTurnSummary();
  }
  uiState.turnSummary.summons.push(`${belongsToPlayer ? "You" : "Enemy"}: ${cardName}`);
}

function finalizeTurnSummary() {
  uiState.lastTurnSummary = uiState.turnSummary || createTurnSummary();
}

function showTransientMessage(text, tone = "neutral", duration = 1600) {
  uiState.transientMessage = { text, tone };
  window.clearTimeout(uiState.timers.message);
  uiState.timers.message = window.setTimeout(() => {
    uiState.transientMessage = null;
    render();
  }, duration);
  render();
}

function showScaleEffect(text, tone = "neutral", duration = 900) {
  emitBattleEffect("scale", { text, tone });
  uiState.scaleEffect = { text, tone };
  window.clearTimeout(uiState.timers.scale);
  uiState.timers.scale = window.setTimeout(() => {
    uiState.scaleEffect = null;
    render();
  }, duration);
  render();
}

function queueLaneEffect(side, lane, text, tone = "hit", duration = 900) {
  emitBattleEffect("lane_fx", { side, lane, text, tone });
  const effect = {
    id: ++uiState.effectCounter,
    side,
    lane,
    text,
    tone
  };
  uiState.laneEffects = [...uiState.laneEffects, effect];
  window.setTimeout(() => {
    uiState.laneEffects = uiState.laneEffects.filter((entry) => entry.id !== effect.id);
    render();
  }, duration);
}

function getLaneEffect(side, lane) {
  for (let index = uiState.laneEffects.length - 1; index >= 0; index -= 1) {
    const effect = uiState.laneEffects[index];
    if (effect.side === side && effect.lane === lane) {
      return effect;
    }
  }
  return null;
}

function getLaneSide(row) {
  return row === state.battle.playerSlots ? "player" : "enemy";
}

function getAttackCue(attacker) {
  if (attacker.sigils.includes("Trifurcated Strike")) {
    return "Trio";
  }
  if (attacker.sigils.includes("Bifurcated Strike")) {
    return "Split";
  }
  if (attacker.sigils.includes("Double Strike")) {
    return "Twin";
  }
  return "Strike";
}

function renderSigilInspector() {
  const active = !!uiState.sigilInspector;
  refs.sigilModal.classList.toggle("hidden", !active);
  refs.sigilModal.setAttribute("aria-hidden", String(!active));
  refs.sigilModal.inert = !active;
  if (!active) {
    refs.sigilBody.innerHTML = "";
    return;
  }

  refs.sigilTitle.textContent = `${uiState.sigilInspector.cardName} Sigils`;
  refs.sigilBody.innerHTML = uiState.sigilInspector.sigils.map((sigil) => `
    <article class="sigil-entry">
      <div class="sigil-entry-icon">${escapeHtml(getSigilIcon(sigil))}</div>
      <div>
        <strong>${escapeHtml(sigil)}</strong>
        <p class="choice-copy">${escapeHtml(SIGIL_META[sigil] || "Special ability.")}</p>
      </div>
    </article>
  `).join("");
}

function renderDrawModal() {
  const active = state.mode === "battle" && state.battle.awaitingDrawChoice;
  refs.drawModal.classList.toggle("hidden", !active);
  refs.drawModal.setAttribute("aria-hidden", String(!active));
  refs.drawModal.inert = !active;
  refs.drawCaption.textContent = active ? "Choose how to start your turn." : "";
  refs.drawSquirrelButton.disabled = !active || uiState.turnAnimating;
  refs.drawDeckButton.disabled = !active || uiState.turnAnimating;
}

function renderMeta() {
  const node = getCurrentNode();
  refs.screenText.textContent = state.currentScreen || "Battle";
  refs.regionText.textContent = node ? node.region : "Run";
  refs.progressText.textContent = node ? `Node ${node.position + 1} / ${state.map.length}` : "No node";
  refs.saveText.textContent = state.saveStatus;
  refs.screenTitle.textContent = state.currentScreen || "Battle";
  refs.screenSubtitle.textContent = getScreenSubtitle(node);
}

function getScreenSubtitle(node) {
  if (state.mode === "battle" && node) {
    if (node.type === "BOSS") {
      return `${getBossDisplayName()} in ${node.region}, phase ${state.battle.bossPhase}.`;
    }
    return `Battle in ${node.region}.`;
  }
  if (state.mode === "reward") return "Take one card and strengthen the run.";
  if (state.mode === "map") return "Choose your next stop.";
  if (state.mode === "campfire") return "Choose one card to improve permanently.";
  if (state.mode === "backpack") return "Take one item into future battles.";
  if (state.mode === "sigil") return "Move one sigil from a donor card onto another card.";
  if (state.mode === "woodcarver") return "Carve a new sigil onto one card.";
  if (state.mode === "mycologists") return "Fuse duplicate cards into one stronger specimen.";
  if (state.mode === "economy") return "Trade away one card for a stronger offer.";
  if (state.mode === "gameover") return "The current run has ended.";
  if (state.mode === "complete") return "You cleared the current generated route.";
  return "";
}

function renderBattle() {
  const visible = state.mode === "battle";
  refs.battleView.classList.toggle("hidden", !visible);
  if (!visible) {
    return;
  }

  refs.scaleText.textContent = `${state.battle.playerDamage} | ${state.battle.enemyDamage}`;
  refs.bonesText.textContent = String(state.battle.playerBones);
  refs.selectionText.textContent = getSelectedHandCard() ? getSelectedHandCard().name : "None";
  refs.selectionHintText.textContent = getSelectionHint();
  refs.itemCountText.textContent = String(state.items.length);
  refs.queueCaption.textContent = state.battle.skipEnemyAttackPhase
    ? "Enemy attack is skipped next turn"
    : state.battle.enemyDeck.length > 0
      ? `${state.battle.enemyDeck.length} cards left in enemy deck`
      : "Enemy deck empty";
  renderCombatHud();
  renderTutorialPanel();
  renderAttackPathStage();
  renderEnemyIntent();
  renderTurnRecap();

  renderLane(refs.enemyQueue, state.battle.enemyQueue, "enemy", null);
  renderLane(refs.enemyBoard, state.battle.enemySlots, "enemy", null);
  renderLane(refs.playerBoard, state.battle.playerSlots, "player", onPlayerSlotClick);
  renderHand();
  renderItems();
}

function renderCombatHud() {
  refs.battlePhaseChip.textContent = uiState.battlePhase.text;
  refs.battlePhaseChip.className = `phase-chip ${uiState.battlePhase.tone || "neutral"}`;
  refs.battleTip.textContent = getBattleTip();
  if (uiState.transientMessage) {
    refs.battleBanner.textContent = uiState.transientMessage.text;
    refs.battleBanner.className = `combat-banner ${uiState.transientMessage.tone || "neutral"}`;
    refs.battleBanner.classList.remove("hidden");
  } else {
    refs.battleBanner.textContent = "";
    refs.battleBanner.className = "combat-banner hidden";
  }

  if (uiState.scaleEffect) {
    refs.scaleFx.textContent = uiState.scaleEffect.text;
    refs.scaleFx.className = `scale-fx ${uiState.scaleEffect.tone || "neutral"}`;
    refs.scaleFx.classList.remove("hidden");
    refs.scaleCard.classList.add("scale-pulse");
  } else {
    refs.scaleFx.textContent = "";
    refs.scaleFx.className = "scale-fx hidden";
    refs.scaleCard.classList.remove("scale-pulse");
  }
}

function getBattleTip() {
  if (uiState.turnAnimating) {
    return "Combat is resolving.";
  }
  if (state.battle.awaitingDrawChoice) {
    return "Start the turn by drawing from the deck or taking a Squirrel.";
  }
  if (uiState.transientMessage && uiState.transientMessage.tone === "warning") {
    return uiState.transientMessage.text;
  }
  const selectedCard = getSelectedHandCard();
  if (selectedCard) {
    if (selectedCard.costType === "bones") {
      return `${selectedCard.name} costs ${selectedCard.cost} bones.`;
    }
    if (selectedCard.cost > 0) {
      const selectedValue = getSelectedSacrificeValue();
      const needed = Math.max(selectedCard.cost - selectedValue, 0);
      return needed > 0
        ? `${selectedCard.name} still needs ${needed} blood.`
        : `Place ${selectedCard.name} into an empty lane.`;
    }
    return `Place ${selectedCard.name} into an empty lane.`;
  }
  if (state.runNumber === 1 && state.currentNodeIndex === 0) {
    return "Blood cards need sacrifices. Bone cards spend bones. Tap a sigil badge to inspect it.";
  }
  return "Tap a card, then a lane. Tap sigils for details.";
}

function renderEnemyIntent() {
  const hint = getEncounterIdentityText();
  refs.intentCaption.textContent = hint.short;
  refs.intentPanel.innerHTML = "";

  for (let lane = 0; lane < 4; lane += 1) {
    const row = document.createElement("div");
    row.className = "intent-row";

    const label = document.createElement("span");
    label.className = "intent-lane";
    label.textContent = `L${lane + 1}`;
    row.appendChild(label);

    const detail = document.createElement("div");
    detail.className = "intent-detail";
    detail.innerHTML = `<strong>${escapeHtml(getLaneIntentLabel(lane))}</strong><span>${escapeHtml(getLaneIntentSubtext(lane))}</span>`;
    row.appendChild(detail);
    refs.intentPanel.appendChild(row);
  }
}

function renderTutorialPanel() {
  const visible = shouldShowTutorialPanel();
  refs.tutorialPanel.classList.toggle("hidden", !visible);
  if (!visible) {
    refs.tutorialPanel.innerHTML = "";
    return;
  }

  refs.tutorialPanel.innerHTML = `
    <div class="tutorial-card">
      <div class="section-head">
        <h3>How This Battle Works</h3>
        <button id="dismiss-tutorial-button" class="ghost-button" type="button">Hide</button>
      </div>
      <div class="tutorial-grid">
        <div class="tutorial-tip"><strong>1. Draw first</strong><span>Each turn starts with Deck or Squirrel.</span></div>
        <div class="tutorial-tip"><strong>2. Pay costs</strong><span>Blood cards need sacrifices. Bone cards spend bones.</span></div>
        <div class="tutorial-tip"><strong>3. Read the board</strong><span>Red target markers show enemy pressure. Queue cards show where they will enter.</span></div>
      </div>
    </div>
  `;

  const dismissButton = document.getElementById("dismiss-tutorial-button");
  if (dismissButton) {
    dismissButton.addEventListener("click", dismissTutorialPanel);
  }
}

function shouldShowTutorialPanel() {
  return state.mode === "battle"
    && !state.tutorial.dismissed
    && state.runNumber === 1
    && state.currentNodeIndex === 0
    && state.currentRound <= 2;
}

function dismissTutorialPanel() {
  state.tutorial.dismissed = true;
  render();
}

function beginHandPointerInteraction(event, index, card) {
  if (uiState.turnAnimating || state.mode !== "battle") {
    return;
  }
  if (event.target.closest?.("[data-sigil]")) {
    return;
  }
  unlockAudio();
  cancelHoldTimer();
  uiState.dragState = {
    pointerId: event.pointerId,
    handIndex: index,
    startX: event.clientX,
    startY: event.clientY,
    x: event.clientX,
    y: event.clientY,
    dragging: false,
    targetLane: null,
    inspected: false
  };
  uiState.timers.hold = window.setTimeout(() => {
    if (!uiState.dragState || uiState.dragState.pointerId !== event.pointerId || uiState.dragState.dragging) {
      return;
    }
    uiState.dragState.inspected = true;
    if (card.sigils?.length) {
      openSigilInspector(card);
    }
  }, 420);
}

function handleGlobalPointerMove(event) {
  const drag = uiState.dragState;
  if (!drag || drag.pointerId !== event.pointerId) {
    return;
  }
  drag.x = event.clientX;
  drag.y = event.clientY;
  const distance = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY);
  if (!drag.dragging && distance > 12) {
    drag.dragging = true;
    cancelHoldTimer();
    showDragGhost();
    selectHandCard(drag.handIndex);
  }
  if (!drag.dragging) {
    return;
  }
  updateDragGhost();
  const nextLane = getPlayerLaneFromPoint(event.clientX, event.clientY);
  if (drag.targetLane !== nextLane) {
    drag.targetLane = nextLane;
    render();
  }
}

function handleGlobalPointerUp(event) {
  const drag = uiState.dragState;
  if (!drag || drag.pointerId !== event.pointerId) {
    return;
  }
  cancelHoldTimer();
  if (drag.dragging) {
    const lane = drag.targetLane;
    cancelDragInteraction();
    if (lane !== null) {
      onPlayerSlotClick(lane);
    } else {
      render();
    }
    return;
  }

  const handIndex = drag.handIndex;
  const inspected = drag.inspected;
  cancelDragInteraction();
  const card = state.battle.hand[handIndex];
  if (!card || inspected) {
    return;
  }
  if (state.selection.selectedHandIndex === handIndex && card.sigils?.length) {
    openSigilInspector(card);
    return;
  }
  selectHandCard(handIndex);
}

function cancelDragInteraction() {
  cancelHoldTimer();
  uiState.dragState = null;
  hideDragGhost();
}

function cancelHoldTimer() {
  window.clearTimeout(uiState.timers.hold);
  uiState.timers.hold = null;
}

function showDragGhost() {
  refs.dragGhost.classList.remove("hidden");
  updateDragGhost();
}

function hideDragGhost() {
  refs.dragGhost.classList.add("hidden");
  refs.dragGhost.innerHTML = "";
}

function updateDragGhost() {
  const drag = uiState.dragState;
  if (!drag || !drag.dragging) {
    return;
  }
  const card = state.battle.hand[drag.handIndex];
  if (!card) {
    return;
  }
  refs.dragGhost.innerHTML = formatCardMarkup(card);
  refs.dragGhost.style.transform = `translate(${drag.x + 14}px, ${drag.y + 14}px)`;
}

function getPlayerLaneFromPoint(clientX, clientY) {
  const target = document.elementFromPoint(clientX, clientY);
  const slot = target?.closest?.(".slot-card.player");
  if (!slot) {
    return null;
  }
  const lane = Number(slot.dataset.laneIndex);
  return Number.isInteger(lane) ? lane : null;
}

function unlockAudio() {
  if (uiState.audioUnlocked) {
    return;
  }
  uiState.audioUnlocked = true;
}

function playFeedback(type, payload = {}) {
  if (uiState.audioUnlocked) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        playTone(type, payload, AudioCtx);
      }
    } catch (error) {
      console.warn("Audio feedback unavailable", error);
    }
  }
  triggerHaptics(type);
}

function playTone(type, payload, AudioCtx) {
  if (!window.__inscryptionAudioCtx) {
    window.__inscryptionAudioCtx = new AudioCtx();
  }
  const ctx = window.__inscryptionAudioCtx;
  if (ctx.state === "suspended") {
    ctx.resume();
  }
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const now = ctx.currentTime;
  const toneMap = {
    strike: 240,
    lane_fx: payload.tone === "death" ? 120 : 220,
    scale: payload.tone === "enemy" ? 110 : 280,
    boss_phase: 90
  };
  osc.type = type === "boss_phase" ? "triangle" : "square";
  osc.frequency.setValueAtTime(toneMap[type] || 200, now);
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(type === "boss_phase" ? 0.04 : 0.025, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, now + (type === "boss_phase" ? 0.18 : 0.08));
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + (type === "boss_phase" ? 0.2 : 0.09));
}

function triggerHaptics(type) {
  if (!window.navigator?.vibrate) {
    return;
  }
  if (type === "boss_phase") {
    window.navigator.vibrate([30, 40, 50]);
    return;
  }
  if (type === "scale") {
    window.navigator.vibrate(20);
    return;
  }
  if (type === "strike" || type === "lane_fx") {
    window.navigator.vibrate(10);
  }
}

function renderAttackPathStage() {
  const activePreview = getActiveAttackPreview();
  const projectedEnemyPaths = activePreview ? [] : getProjectedAttackPaths();
  const projectedPlayerPaths = activePreview || !hasPlayerBoardCards() ? [] : getProjectedAttackPaths("player");
  refs.attackStageCaption.textContent = activePreview
    ? `${activePreview.label} in motion`
    : projectedEnemyPaths.length || projectedPlayerPaths.length
      ? "Enemy pressure and counter-lines"
      : "No active attack lines";
  refs.attackPathStage.className = `attack-path-stage ${getBossStageClass()}`;
  refs.attackPathStage.innerHTML = buildAttackStageMarkup(activePreview, projectedEnemyPaths, projectedPlayerPaths);
}

function hasPlayerBoardCards() {
  return state.battle.playerSlots.some(Boolean);
}

function getActiveAttackPreview() {
  if (!uiState.combatPreview) {
    return null;
  }
  const isPlayer = uiState.combatPreview.side === "player";
  const attackerRow = isPlayer ? state.battle.playerSlots : state.battle.enemySlots;
  const attacker = attackerRow[uiState.combatPreview.attackerLane];
  if (!attacker) {
    return null;
  }
  const attackLanes = getAttackLanes(attacker, uiState.combatPreview.attackerLane);
  return {
    side: uiState.combatPreview.side,
    paths: attackLanes.map((targetLane) => ({
      sourceLane: uiState.combatPreview.attackerLane,
      targetLane,
      side: uiState.combatPreview.side,
      airborne: attacker.sigils.includes("Airborne")
    })),
    label: attacker.name
  };
}

function getProjectedAttackPaths(side = "enemy") {
  if (state.mode !== "battle") {
    return [];
  }
  const isEnemy = side === "enemy";
  if (isEnemy && state.battle.skipEnemyAttackPhase) {
    return [];
  }
  const board = isEnemy ? state.battle.enemySlots : state.battle.playerSlots;
  const queue = isEnemy ? state.battle.enemyQueue : [null, null, null, null];
  const paths = [];
  for (let lane = 0; lane < 4; lane += 1) {
    const card = board[lane] || queue[lane];
    if (!card) {
      continue;
    }
    const source = board[lane] ? "board" : "queue";
    getAttackLanes(card, lane).forEach((targetLane) => {
      paths.push({
        sourceLane: lane,
        targetLane,
        side,
        source,
        airborne: card.sigils.includes("Airborne"),
        power: getProjectedPowerForPath(card, lane, side)
      });
    });
  }
  return paths;
}

function getProjectedPowerForPath(card, lane, side) {
  if (side === "enemy") {
    const alliedRow = state.battle.enemySlots.slice();
    alliedRow[lane] = card;
    return getAttackPower(card, alliedRow, lane, state.battle.playerSlots, lane);
  }
  const alliedRow = state.battle.playerSlots.slice();
  alliedRow[lane] = card;
  return getAttackPower(card, alliedRow, lane, state.battle.enemySlots, lane);
}

function buildAttackStageMarkup(activePreview, projectedEnemyPaths, projectedPlayerPaths) {
  const xForLane = (lane) => 50 + lane * 100;
  const enemyPaths = activePreview ? activePreview.paths : projectedEnemyPaths;
  const playerPaths = activePreview ? [] : projectedPlayerPaths;
  const pathMarkup = enemyPaths.map((path, index) => renderAttackPath(path, index, xForLane, activePreview ? "active" : "enemy"))
    .concat(playerPaths.map((path, index) => renderAttackPath(path, index + enemyPaths.length, xForLane, "player")))
    .join("");
  const labels = buildAttackStageLegend(activePreview, projectedEnemyPaths, projectedPlayerPaths);
  return `
    <svg class="attack-path-svg" viewBox="0 0 400 120" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <marker id="enemy-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="rgba(207, 107, 84, 0.95)"></path>
        </marker>
        <marker id="player-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="rgba(216, 163, 79, 0.95)"></path>
        </marker>
      </defs>
      <line x1="0" y1="20" x2="400" y2="20" class="attack-stage-rail enemy"></line>
      <line x1="0" y1="100" x2="400" y2="100" class="attack-stage-rail player"></line>
      ${pathMarkup}
    </svg>
    <div class="attack-stage-legend">${labels}</div>
  `;
}

function renderAttackPath(path, index, xForLane, tone) {
  const fromY = path.side === "enemy" ? (path.source === "queue" ? 8 : 20) : 100;
  const toY = path.side === "enemy" ? 100 : 20;
  const marker = path.side === "player" ? "url(#player-arrow)" : "url(#enemy-arrow)";
  const dash = path.source === "queue" || tone === "enemy" ? "6 5" : "none";
  const pathClass = `attack-path ${tone} ${path.airborne ? "airborne" : ""} ${tone === "active" ? "active" : ""}`;
  return `<line class="${pathClass}" x1="${xForLane(path.sourceLane)}" y1="${fromY}" x2="${xForLane(path.targetLane)}" y2="${toY}" marker-end="${marker}" stroke-dasharray="${dash}" style="animation-delay:${index * 60}ms"></line>`;
}

function buildAttackStageLegend(activePreview, projectedEnemyPaths, projectedPlayerPaths) {
  const chips = [];
  if (activePreview) {
    chips.push(`<span class="attack-chip active">${escapeHtml(activePreview.label)}</span>`);
  } else {
    if (projectedEnemyPaths.length) {
      chips.push(`<span class="attack-chip enemy">${escapeHtml(`Enemy ${projectedEnemyPaths.length} lanes`)}</span>`);
    }
    if (projectedPlayerPaths.length) {
      chips.push(`<span class="attack-chip player">${escapeHtml(`Counter ${projectedPlayerPaths.length} lanes`)}</span>`);
    }
  }
  const lastBossEvent = [...uiState.fxEvents].reverse().find((entry) => entry.type === "boss_phase");
  if (lastBossEvent) {
    chips.push(`<span class="attack-chip boss">${escapeHtml(lastBossEvent.payload.label || "Boss setpiece")}</span>`);
  }
  return chips.length ? chips.join("") : `<span class="attack-chip neutral">No queued attacks</span>`;
}

function getBossStageClass() {
  if (!state.battle.bossType) {
    return "";
  }
  if (state.battle.bossType === "PROSPECTOR") return "boss-prospector";
  if (state.battle.bossType === "ANGLER") return "boss-angler";
  if (state.battle.bossType === "TRAPPER_TRADER") return "boss-trader";
  return "";
}

function getLaneIntentLabel(lane) {
  const current = state.battle.enemySlots[lane];
  const queued = state.battle.enemyQueue[lane];
  if (state.battle.skipEnemyAttackPhase) {
    return queued ? `${queued.name} waits in queue` : current ? `${current.name} cannot strike next turn` : "No strike next turn";
  }
  if (current) {
    return `${current.name}: ${describeEnemyAttack(current, lane)}`;
  }
  if (queued) {
    return `${queued.name} enters here`;
  }
  return "Open lane";
}

function getLaneIntentSubtext(lane) {
  const current = state.battle.enemySlots[lane];
  const queued = state.battle.enemyQueue[lane];
  const pieces = [];
  if (current) {
    pieces.push(describeThreatTag(current));
  }
  if (!current && queued) {
    pieces.push(describeThreatTag(queued));
  }
  if (current && queued) {
    pieces.push(`Next: ${queued.name}`);
  } else if (!current && !queued) {
    pieces.push("No queued creature.");
  }
  return pieces.join(" | ");
}

function getProjectedEnemyTargetLanes() {
  const projected = new Map();
  if (state.mode !== "battle" || state.battle.skipEnemyAttackPhase) {
    return projected;
  }

  for (let lane = 0; lane < 4; lane += 1) {
    const attacker = state.battle.enemySlots[lane] || state.battle.enemyQueue[lane];
    if (!attacker) {
      continue;
    }
    const source = state.battle.enemySlots[lane] ? "board" : "queue";
    const lanes = getAttackLanes(attacker, lane);
    lanes.forEach((targetLane) => {
      const entries = projected.get(targetLane) || [];
      entries.push({
        name: attacker.name,
        power: getProjectedEnemyAttackPower(attacker, lane),
        source,
        airborne: attacker.sigils.includes("Airborne")
      });
      projected.set(targetLane, entries);
    });
  }
  return projected;
}

function getProjectedEnemyAttackPower(card, lane) {
  const alliedRow = state.battle.enemySlots.slice();
  alliedRow[lane] = card;
  return getAttackPower(card, alliedRow, lane, state.battle.playerSlots, lane);
}

function describeEnemyAttack(card, lane) {
  const lanes = getAttackLanes(card, lane).map((entry) => entry + 1);
  const basePower = getAttackPower(card, state.battle.enemySlots, lane, state.battle.playerSlots, lane);
  const laneText = lanes.length === 1 ? `hits lane ${lanes[0]}` : `hits lanes ${lanes.join("/")}`;
  const airborneText = card.sigils.includes("Airborne") ? "airborne" : null;
  return [`${basePower} power`, laneText, airborneText].filter(Boolean).join(", ");
}

function describeThreatTag(card) {
  if (card.sigils.includes("Guardian")) return "Guardian";
  if (card.sigils.includes("Burrower")) return "Burrower";
  if (card.sigils.includes("Airborne")) return "Airborne";
  if (card.sigils.includes("Double Strike")) return "Double strike";
  if (card.sigils.includes("Bifurcated Strike") || card.sigils.includes("Trifurcated Strike")) return "Split attack";
  return `${card.attack}/${card.health}`;
}

function renderTurnRecap() {
  const summary = uiState.lastTurnSummary || uiState.turnSummary || createTurnSummary();
  refs.turnRecap.innerHTML = "";
  const lines = buildTurnRecapLines(summary);
  lines.forEach((lineText) => {
    const line = document.createElement("div");
    line.className = "recap-line";
    line.textContent = lineText;
    refs.turnRecap.appendChild(line);
  });
}

function buildTurnRecapLines(summary) {
  const lines = [];
  if (summary.playerDirect > 0) {
    lines.push(`You dealt ${summary.playerDirect} direct damage.`);
  }
  if (summary.enemyDirect > 0) {
    lines.push(`Enemy dealt ${summary.enemyDirect} direct damage.`);
  }
  if (summary.enemyDeaths.length) {
    lines.push(`Enemy losses: ${formatNameList(summary.enemyDeaths)}.`);
  }
  if (summary.playerDeaths.length) {
    lines.push(`Your losses: ${formatNameList(summary.playerDeaths)}.`);
  }
  if (summary.bonesGained > 0) {
    lines.push(`You gained ${summary.bonesGained} bone${summary.bonesGained === 1 ? "" : "s"}.`);
  }
  if (summary.summons.length) {
    lines.push(`Summons: ${formatNameList(summary.summons)}.`);
  }
  if (!lines.length) {
    lines.push("No resolved turn yet.");
  }
  return lines;
}

function formatNameList(names) {
  const compact = names.slice(0, 3).join(", ");
  return names.length > 3 ? `${compact}, +${names.length - 3} more` : compact;
}

function getEncounterIdentityText() {
  if (state.mode !== "battle") {
    return { short: "Reading the next enemy turn", long: "" };
  }
  if (state.battle.bossType === "PROSPECTOR") {
    return {
      short: `Prospector phase ${state.battle.bossPhase}`,
      long: state.battle.bossPhase === 1 ? "Pack Mule and guards hold the line before the gold strike." : "Gold has fallen. Expect sturdier follow-up attackers."
    };
  }
  if (state.battle.bossType === "ANGLER") {
    return {
      short: `Angler phase ${state.battle.bossPhase}`,
      long: state.battle.bossPhase === 1 ? "Watch for hook turns and airborne fish slipping over blockers." : "Bait buckets crack into sharks when destroyed."
    };
  }
  if (state.battle.bossType === "TRAPPER_TRADER") {
    return {
      short: `Trader phase ${state.battle.bossPhase}`,
      long: state.battle.bossPhase === 1 ? "Traps punish direct lanes before the trade begins." : "Heavy split attacks and fliers close the fight."
    };
  }
  const region = getCurrentNode()?.region || "the trail";
  if (region === "Woodlands") {
    return { short: "Woodlands predators", long: "Early enemies mix cheap blockers with simple lane pressure." };
  }
  if (region === "Wetlands") {
    return { short: "Wetlands tricks", long: "Expect burrowers, guardians, and awkward attack angles." };
  }
  if (region === "Snowline") {
    return { short: "Snowline elites", long: "Late enemies hit harder and stack premium sigils." };
  }
  return { short: "Reading the next enemy turn", long: "Watch the queue to plan your next block." };
}

function getSelectionHint() {
  const selectedCard = getSelectedHandCard();
  if (state.battle.awaitingDrawChoice) {
    return "Choose Deck or Squirrel";
  }
  if (!selectedCard) {
    return "Pick a card";
  }

  if (selectedCard.costType === "bones") {
    const needed = Math.max(selectedCard.cost - state.battle.playerBones, 0);
    return needed > 0 ? `${needed} more bones needed` : "Tap an empty lane";
  }

  if (selectedCard.cost === 0) {
    return "Tap an empty lane";
  }

  const selectedValue = getSelectedSacrificeValue();
  const needed = Math.max(selectedCard.cost - selectedValue, 0);
  return needed > 0 ? `${needed} blood still needed` : "Tap an empty lane";
}

function renderLane(container, slots, side, onClick) {
  container.innerHTML = "";
  const projectedTargets = side === "player" ? getProjectedEnemyTargetLanes() : null;
  const selectedCard = getSelectedHandCard();
  slots.forEach((card, index) => {
    const button = document.createElement("button");
    button.className = `slot-card ${side} ${card ? "" : "empty"} ${onClick ? "selectable" : ""}`;
    button.dataset.laneIndex = String(index);
    const laneEffect = getLaneEffect(side, index);
    const targetPressure = projectedTargets ? projectedTargets.get(index) : null;
    const dragTarget = uiState.dragState?.dragging && uiState.dragState?.targetLane === index && side === "player";
    if (side === "player" && canPlaceOnSlot(index)) {
      button.classList.add("targetable");
    }
    if (dragTarget) {
      button.classList.add("drag-target");
    }
    if (side === "player" && state.selection.selectedSacrificeIndexes.includes(index)) {
      button.classList.add("sacrifice-selected");
    }
    if (side === "player" && card && isSacrificeCandidate(index, selectedCard)) {
      button.classList.add("sacrifice-candidate");
    }
    if (uiState.combatPreview && uiState.combatPreview.side === side && uiState.combatPreview.attackerLane === index) {
      button.classList.add("combat-attacker");
    }
    if (uiState.combatPreview && uiState.combatPreview.side !== side && uiState.combatPreview.targetLane === index) {
      button.classList.add("combat-target");
    }
    if (targetPressure?.length) {
      button.classList.add("intent-targeted");
    }
    if (side === "enemy" && !card && state.battle.enemyQueue[index] && container === refs.enemyBoard) {
      button.classList.add("queue-entry-slot");
    }
    const intentMarkup = getLaneOverlayMarkup(side, index, card, targetPressure, container, selectedCard);
    if (laneEffect) {
      button.classList.add(`lane-effect-${laneEffect.tone}`);
    }
    button.innerHTML = `${card ? formatCardMarkup(card) : `<span class="empty-caption">${side === "player" ? "Empty" : "None"}</span>`}${intentMarkup}${laneEffect ? `<span class="lane-fx lane-fx-${escapeHtml(laneEffect.tone)}">${escapeHtml(laneEffect.text)}</span>` : ""}`;
    if (onClick) {
      button.addEventListener("click", () => {
        if (card && card.sigils?.length && !getSelectedHandCard()) {
          openSigilInspector(card);
          return;
        }
        onClick(index);
      });
    } else if (card && card.sigils?.length) {
      button.disabled = false;
      button.addEventListener("click", () => openSigilInspector(card));
    } else {
      button.disabled = true;
    }
    bindCardHoldInspector(button, card);
    bindSigilButtons(button, card);
    container.appendChild(button);
  });
}

function getLaneOverlayMarkup(side, index, card, targetPressure, container, selectedCard) {
  const overlays = [];
  if (side === "player" && targetPressure?.length) {
    const boardPower = targetPressure
      .filter((entry) => entry.source === "board")
      .reduce((sum, entry) => sum + Math.max(entry.power, 0), 0);
    const queuePower = targetPressure
      .filter((entry) => entry.source === "queue")
      .reduce((sum, entry) => sum + Math.max(entry.power, 0), 0);
    if (boardPower > 0) {
      overlays.push(`<span class="intent-badge incoming">${escapeHtml(`Hit ${boardPower}`)}</span>`);
    } else if (queuePower > 0) {
      overlays.push(`<span class="intent-badge queued">${escapeHtml(`Next ${queuePower}`)}</span>`);
    }
    if (queuePower > 0 && boardPower > 0) {
      overlays.push(`<span class="queue-entry-badge entry-arrow">${escapeHtml(`Next ${queuePower}`)}</span>`);
    }
    overlays.push(`<span class="intent-path">${escapeHtml(targetPressure.map((entry) => `${entry.name} ${entry.airborne ? "flies" : "aims"}`).slice(0, 2).join(" | "))}</span>`);
  }

  if (side === "enemy" && container === refs.enemyQueue && card) {
    overlays.push(`<span class="queue-entry-badge">${escapeHtml(`To lane ${index + 1}`)}</span>`);
  }

  if (side === "enemy" && container === refs.enemyBoard && !card && state.battle.enemyQueue[index]) {
    overlays.push(`<span class="queue-entry-badge entry-arrow">${escapeHtml(`<- ${state.battle.enemyQueue[index].name}`)}</span>`);
  }
  if (side === "player" && card && isSacrificeCandidate(index, selectedCard)) {
    overlays.push(`<span class="sacrifice-badge">${escapeHtml(`Blood ${getSacrificeValue(card)}`)}</span>`);
  }

  return overlays.join("");
}

function isSacrificeCandidate(index, selectedCard = getSelectedHandCard()) {
  return !!(
    selectedCard
    && selectedCard.costType === "blood"
    && selectedCard.cost > 0
    && state.battle.playerSlots[index]
  );
}

function renderHand() {
  refs.handStrip.innerHTML = "";
  if (!state.battle.hand.length) {
    const empty = document.createElement("div");
    empty.className = "hand-empty";
    empty.textContent = "Your hand is empty.";
    refs.handStrip.appendChild(empty);
    return;
  }
  state.battle.hand.forEach((card, index) => {
    const button = document.createElement("button");
    button.className = "hand-card selectable";
    if (state.selection.selectedHandIndex === index) {
      button.classList.add("selected");
    }
    if (uiState.dragState?.dragging && uiState.dragState.handIndex === index) {
      button.classList.add("dragging-source");
    }
    button.innerHTML = formatCardMarkup(card);
    button.addEventListener("pointerdown", (event) => beginHandPointerInteraction(event, index, card));
    bindSigilButtons(button, card);
    refs.handStrip.appendChild(button);
  });
}

function renderItems() {
  refs.itemBar.innerHTML = "";
  if (!state.items.length) {
    const empty = document.createElement("div");
    empty.className = "deck-entry";
    empty.textContent = "No items in pack.";
    refs.itemBar.appendChild(empty);
    return;
  }

  state.items.forEach((item) => {
    const button = document.createElement("button");
    button.className = "item-button";
    button.innerHTML = `<strong>${escapeHtml(item.name)}</strong><span class="card-meta">${escapeHtml(item.description)}</span>`;
    button.addEventListener("click", () => useItem(item.id));
    refs.itemBar.appendChild(button);
  });
}

function renderChoiceScreen() {
  const modalVisible = MODAL_MODES.has(state.mode) && isValidModalState();
  refs.choiceModal.classList.toggle("hidden", !modalVisible);
  refs.choiceModal.setAttribute("aria-hidden", String(!modalVisible));
  refs.choiceModal.inert = !modalVisible;
  refs.choiceView.classList.toggle("hidden", !modalVisible);
  refs.choiceTitle.textContent = state.currentScreen || "Choice";

  if (!modalVisible) {
    return;
  }

  refs.choiceSummary.innerHTML = "";
  refs.choiceActions.innerHTML = "";

  if (state.mode === "reward") {
    refs.choiceSummary.innerHTML = `<p class="choice-copy">Choose one reward card.</p>`;
    state.rewardOptions.forEach((option, index) => {
      const card = document.createElement("button");
      card.className = "choice-card card-choice";
      card.innerHTML = `${formatCardMarkup(option.card)}<span class="card-meta">Rarity: ${escapeHtml(option.rarity)}</span>`;
      card.addEventListener("click", () => chooseReward(index));
      bindSigilButtons(card, option.card);
      refs.choiceActions.appendChild(card);
    });
    return;
  }

  if (state.mode === "map") {
    const currentNode = getCurrentNode();
    const choices = state.eventState?.choices || [];
    if (!choices.length) {
      refs.choiceSummary.innerHTML = `<p class="choice-copy">No more paths remain in this run.</p>`;
      refs.choiceActions.appendChild(createActionChoice("Start New Run", "Generate a fresh map and run.", startNewRun));
      return;
    }
    refs.choiceSummary.innerHTML = `<p class="choice-copy">Current stop: ${escapeHtml(currentNode ? getNodeDisplayName(currentNode.type) : "Start")}.</p>`;
    choices.forEach((node) => {
      if (node) refs.choiceActions.appendChild(createNodeChoice(node, () => chooseMapNode(node.position)));
    });
    return;
  }

  if (state.mode === "campfire") {
    renderCampfireChoices();
    return;
  }

  if (state.mode === "backpack") {
    refs.choiceSummary.innerHTML = `<p class="choice-copy">Pick one item to carry into future battles.</p>`;
    state.eventState.options.forEach((item, index) => {
      refs.choiceActions.appendChild(createActionChoice(item.name, item.description, () => chooseBackpackItem(index)));
    });
    return;
  }

  if (state.mode === "sigil") {
    renderSigilChoices();
    return;
  }

  if (state.mode === "woodcarver") {
    renderWoodcarverChoices();
    return;
  }

  if (state.mode === "mycologists") {
    renderMycologistChoices();
    return;
  }

  if (state.mode === "economy") {
    renderTraderChoices();
    return;
  }

  if (state.mode === "gameover") {
    refs.choiceSummary.innerHTML = `
      <p class="choice-copy">Battles won: ${state.battlesWon}</p>
      <p class="choice-copy">Highest node reached: ${state.highestNodeReached + 1} / ${state.map.length}</p>
      <p class="choice-copy">Damage dealt: ${state.cumulativeDamageDealt} | Damage received: ${state.cumulativeDamageReceived}</p>
    `;
    refs.choiceActions.appendChild(createActionChoice("Start New Run", "Reset the run and generate a new map.", startNewRun));
    return;
  }

  if (state.mode === "complete") {
    refs.choiceSummary.innerHTML = `<p class="choice-copy">You reached the end of the current generated route.</p>`;
    refs.choiceActions.appendChild(createActionChoice("Start New Run", "Generate a fresh run.", startNewRun));
  }
}

function renderCampfireChoices() {
  if (state.eventState.step === "chooseCard") {
    refs.choiceSummary.innerHTML = `<p class="choice-copy">Choose one card to improve.</p>`;
    state.currentDeck.forEach((card, index) => {
      const button = document.createElement("button");
      button.className = "choice-card card-choice";
      button.innerHTML = formatCardMarkup(card);
      button.addEventListener("click", () => chooseCampfireCard(index));
      bindSigilButtons(button, card);
      refs.choiceActions.appendChild(button);
    });
    return;
  }

  const card = state.currentDeck[state.eventState.selectedCardIndex];
  refs.choiceSummary.innerHTML = `<p class="choice-copy">Warm the ${escapeHtml(card ? card.name : "card")}.</p>`;
  refs.choiceActions.appendChild(createActionChoice("Increase Power", "+1 attack", () => applyCampfireBuff("power")));
  refs.choiceActions.appendChild(createActionChoice("Increase Health", "+2 health", () => applyCampfireBuff("health")));
}

function renderSigilChoices() {
  const donorIndex = state.eventState.donorIndex;
  const donor = donorIndex === null ? null : state.currentDeck[donorIndex];

  if (state.eventState.step === "empty") {
    refs.choiceSummary.innerHTML = `<p class="choice-copy">No card in your deck currently has a transferable sigil.</p>`;
    refs.choiceActions.appendChild(createActionChoice("Continue", "Return to map selection.", completeCurrentEvent));
    return;
  }

  if (state.eventState.step === "chooseDonor") {
    refs.choiceSummary.innerHTML = `<p class="choice-copy">Choose a donor card. It will be removed after the transfer.</p>`;
    state.currentDeck.forEach((card, index) => {
      if (!card.sigils.length) {
        return;
      }
      const button = document.createElement("button");
      button.className = "choice-card card-choice";
      button.innerHTML = formatCardMarkup(card);
      button.addEventListener("click", () => chooseSigilDonor(index));
      bindSigilButtons(button, card);
      refs.choiceActions.appendChild(button);
    });
    return;
  }

  if (state.eventState.step === "chooseSigil") {
    refs.choiceSummary.innerHTML = `<p class="choice-copy">Choose a sigil from ${escapeHtml(donor ? donor.name : "the donor")}.</p>`;
    donor.sigils.forEach((sigil) => {
      refs.choiceActions.appendChild(createActionChoice(sigil, "Transfer this sigil to another card.", () => chooseSigil(sigil)));
    });
    return;
  }

  refs.choiceSummary.innerHTML = `<p class="choice-copy">Choose a receiver for ${escapeHtml(state.eventState.sigil)}.</p>`;
  state.currentDeck.forEach((card, index) => {
    if (index === donorIndex || card.sigils.includes(state.eventState.sigil)) {
      return;
    }
    const button = document.createElement("button");
    button.className = "choice-card card-choice";
    button.innerHTML = formatCardMarkup(card);
    button.addEventListener("click", () => chooseSigilReceiver(index));
    bindSigilButtons(button, card);
    refs.choiceActions.appendChild(button);
  });
}

function renderWoodcarverChoices() {
  if (state.eventState.step === "chooseSigil") {
    refs.choiceSummary.innerHTML = `<p class="choice-copy">Choose a sigil stone to carve into a card.</p>`;
    state.eventState.offeredSigils.forEach((sigil) => {
      refs.choiceActions.appendChild(createActionChoice(sigil, "Add this sigil to one card in your deck.", () => chooseWoodcarverSigil(sigil)));
    });
    return;
  }

  refs.choiceSummary.innerHTML = `<p class="choice-copy">Choose a receiver for ${escapeHtml(state.eventState.chosenSigil)}.</p>`;
  state.currentDeck.forEach((card, index) => {
    if (card.sigils.includes(state.eventState.chosenSigil)) {
      return;
    }
    const button = document.createElement("button");
    button.className = "choice-card card-choice";
    button.innerHTML = formatCardMarkup(card);
    button.addEventListener("click", () => chooseWoodcarverReceiver(index));
    bindSigilButtons(button, card);
    refs.choiceActions.appendChild(button);
  });
}

function renderMycologistChoices() {
  const pairs = state.eventState.pairs || [];
  if (!pairs.length) {
    refs.choiceSummary.innerHTML = `<p class="choice-copy">No duplicate cards are available to merge.</p>`;
    refs.choiceActions.appendChild(createActionChoice("Continue", "Return to the map.", completeCurrentEvent));
    return;
  }

  refs.choiceSummary.innerHTML = `<p class="choice-copy">Choose a matching pair to merge into one stronger card.</p>`;
  pairs.forEach((pair, index) => {
    const first = state.currentDeck[pair.indexes[0]];
    const second = state.currentDeck[pair.indexes[1]];
    refs.choiceActions.appendChild(createActionChoice(pair.name, `${first.attack}/${first.health} + ${second.attack}/${second.health}`, () => chooseMergePair(index)));
  });
}

function renderTraderChoices() {
  if (state.eventState.step === "chooseSacrifice") {
    refs.choiceSummary.innerHTML = `<p class="choice-copy">Choose one card to trade away.</p>`;
    state.currentDeck.forEach((card, index) => {
      const button = document.createElement("button");
      button.className = "choice-card card-choice";
      button.innerHTML = formatCardMarkup(card);
      button.addEventListener("click", () => chooseTraderSacrifice(index));
      bindSigilButtons(button, card);
      refs.choiceActions.appendChild(button);
    });
    return;
  }

  refs.choiceSummary.innerHTML = `<p class="choice-copy">Choose the card you want in return.</p>`;
  state.eventState.offers.forEach((offer, index) => {
    const button = document.createElement("button");
    button.className = "choice-card card-choice";
    button.innerHTML = `${formatCardMarkup(offer.card)}<span class="card-meta">Trade offer: ${escapeHtml(offer.rarity)}</span>`;
    button.addEventListener("click", () => chooseTraderOffer(index));
    bindSigilButtons(button, offer.card);
    refs.choiceActions.appendChild(button);
  });
}

function createNodeChoice(node, onClick) {
  const button = document.createElement("button");
  button.className = "choice-card node-choice";
  button.innerHTML = `<strong>${escapeHtml(getNodeDisplayName(node.type))}</strong><span class="choice-copy">${escapeHtml(node.region)} | Node ${node.position + 1}</span><span class="choice-copy">${escapeHtml(getNodeSummary(node.type))}</span>`;
  button.addEventListener("click", onClick);
  return button;
}

function createActionChoice(title, subtitle, onClick) {
  const button = document.createElement("button");
  button.className = "choice-card action-choice";
  button.innerHTML = `<strong>${escapeHtml(title)}</strong><span class="choice-copy">${escapeHtml(subtitle)}</span>`;
  button.addEventListener("click", onClick);
  return button;
}

function getNodeDisplayName(type) {
  return NODE_META[type]?.label || type;
}

function getNodeSummary(type) {
  return NODE_META[type]?.summary || "Continue the run.";
}

function renderRunInfo() {
  const bossText = state.mode === "battle" && state.battle.bossType ? ` | Boss phase ${state.battle.bossPhase}` : "";
  const encounter = getEncounterIdentityText();
  refs.runText.innerHTML = `
    <strong>${escapeHtml(`Round ${state.currentRound} | Battles won ${state.battlesWon}`)}</strong><br>
    ${escapeHtml(`Deck size ${state.currentDeck.length} | Items ${state.items.length}${bossText}`)}<br>
    ${escapeHtml(`Starter boon ${getStarterUnlockLabel(state.meta?.activeStarterKey || "classic")} | Unlocked ${state.meta?.unlockedStarterKeys?.length || 1}`)}<br>
    ${escapeHtml(encounter.long || "Continue the run.")}
  `;
}

function renderDeck() {
  refs.deckPanel.innerHTML = "";
  state.currentDeck.forEach((card) => {
    const line = document.createElement("div");
    line.className = "deck-entry";
    line.innerHTML = `<strong>${escapeHtml(card.name)}</strong><div class="card-meta">Cost ${escapeHtml(`${card.cost} ${card.costType}`)} | ATK ${card.attack} | HP ${card.health}</div><div class="card-meta">Sigils: ${escapeHtml(card.sigils.length ? card.sigils.join(", ") : "None")}</div>`;
    refs.deckPanel.appendChild(line);
  });
}

function renderLog() {
  refs.logPanel.innerHTML = "";
  state.log.forEach((entry) => {
    const line = document.createElement("div");
    line.className = "log-entry";
    line.textContent = entry;
    refs.logPanel.appendChild(line);
  });
}

function bindSigilButtons(container, card) {
  if (!card?.sigils?.length) {
    return;
  }
  container.querySelectorAll("[data-sigil]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const sigil = button.dataset.sigil;
      if (!sigil) {
        return;
      }
      openSigilInspector({ name: card.name, sigils: [sigil] });
    });
  });
}

function bindCardHoldInspector(container, card) {
  if (!card?.sigils?.length) {
    return;
  }
  let timer = null;
  let origin = null;
  const clear = () => {
    window.clearTimeout(timer);
    timer = null;
    origin = null;
  };
  container.addEventListener("pointerdown", (event) => {
    if (event.target.closest("[data-sigil]")) {
      return;
    }
    origin = { x: event.clientX, y: event.clientY };
    timer = window.setTimeout(() => {
      openSigilInspector(card);
      clear();
    }, 420);
  });
  container.addEventListener("pointermove", (event) => {
    if (!origin || !timer) {
      return;
    }
    if (Math.hypot(event.clientX - origin.x, event.clientY - origin.y) > 10) {
      clear();
    }
  });
  container.addEventListener("pointerup", clear);
  container.addEventListener("pointercancel", clear);
  container.addEventListener("pointerleave", clear);
}

function getSigilIcon(sigil) {
  return SIGIL_ICONS[sigil] || "?";
}

function getCostShortLabel(card) {
  if (card.cost <= 0) {
    return "0";
  }
  return card.costType === "bones" ? `${card.cost}Bn` : `${card.cost}Bd`;
}

function sleep(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function pauseBattleAction(delay = 360) {
  render();
  await sleep(delay);
}

function formatCardMarkup(card) {
  const sigilMarkup = card.sigils.length
    ? `<span class="card-sigil-row">${card.sigils.map((sigil) => `<span class="sigil-badge" data-sigil="${escapeHtml(sigil)}" title="${escapeHtml(sigil)}">${escapeHtml(getSigilIcon(sigil))}</span>`).join("")}</span>`
    : "";
  return [
    `<span class="card-header"><span class="card-name">${escapeHtml(card.name)}</span><span class="card-cost">${escapeHtml(getCostShortLabel(card))}</span></span>`,
    `<span class="card-stats">A${card.attack} H${card.health}</span>`,
    sigilMarkup
  ].join("");
}

function appendLog(message) {
  state.log.push(message);
  if (state.log.length > 20) {
    state.log.shift();
  }
}

function shuffle(cards) {
  const copy = [...cards];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function escapeHtml(text) {
  return String(text).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
