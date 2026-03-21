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
const ITEM_DEFS = {
  pliers: { id: "pliers", name: "Pliers", description: "Deal 1 direct damage to the enemy scale." },
  squirrelBottle: { id: "squirrelBottle", name: "Squirrel Bottle", description: "Add a Squirrel to your hand." },
  hourglass: { id: "hourglass", name: "Hourglass", description: "Skip the next enemy attack phase." },
  fan: { id: "fan", name: "Fan", description: "Your cards gain Airborne for this turn." },
  boneJar: { id: "boneJar", name: "Bone Jar", description: "Gain 4 Bones." },
  blackGoatBottle: { id: "blackGoatBottle", name: "Black Goat Bottle", description: "Add a Black Goat to your hand." }
};

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
  choiceView: document.getElementById("choice-view"),
  choiceTitle: document.getElementById("choice-title"),
  choiceSummary: document.getElementById("choice-summary"),
  choiceActions: document.getElementById("choice-actions"),
  scaleText: document.getElementById("scale-text"),
  bonesText: document.getElementById("bones-text"),
  selectionText: document.getElementById("selection-text"),
  selectionHintText: document.getElementById("selection-hint-text"),
  itemCountText: document.getElementById("item-count-text"),
  drawCaption: document.getElementById("draw-caption"),
  runText: document.getElementById("run-text"),
  queueCaption: document.getElementById("queue-caption"),
  enemyQueue: document.getElementById("enemy-queue"),
  enemyBoard: document.getElementById("enemy-board"),
  playerBoard: document.getElementById("player-board"),
  handStrip: document.getElementById("hand-strip"),
  itemBar: document.getElementById("item-bar"),
  logPanel: document.getElementById("log-panel"),
  deckPanel: document.getElementById("deck-panel"),
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
window.addEventListener("resize", updateOrientationPrompt);
window.addEventListener("orientationchange", updateOrientationPrompt);

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
    log: []
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

function startNewRun() {
  const fresh = createInitialState();
  Object.assign(state, fresh);
  state.map = generateMap();
  state.currentDeck = STARTER_DECK.map(copyCard);
  state.items = [copyItem(ITEM_DEFS.squirrelBottle)];
  moveToNode(0);
  appendLog("Started a new run.");
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

function endTurn() {
  if (state.mode !== "battle") {
    return;
  }
  if (state.battle.awaitingDrawChoice) {
    appendLog("Choose whether to draw from the deck or take a Squirrel first.");
    render();
    return;
  }

  appendLog("Player attacks.");
  tickTurns(state.battle.playerSlots);
  for (let lane = 0; lane < 4; lane += 1) {
    resolveAttackLane(state.battle.playerSlots, state.battle.enemySlots, lane, true);
  }
  if (checkBattleEnd()) {
    return;
  }

  if (state.battle.skipEnemyAttackPhase) {
    state.battle.skipEnemyAttackPhase = false;
    appendLog("Hourglass stopped the enemy attack.");
  } else {
    appendLog("Enemy attacks.");
    tickTurns(state.battle.enemySlots);
    for (let lane = 0; lane < 4; lane += 1) {
      resolveAttackLane(state.battle.enemySlots, state.battle.playerSlots, lane, false);
    }
  }
  if (checkBattleEnd()) {
    return;
  }

  if (state.battle.bossType === "ANGLER" && state.battle.bossPhase === 1 && !state.battle.anglerHookUsed) {
    performAnglerHook();
  }

  advanceEnemyBoard();
  state.battle.awaitingDrawChoice = true;
  state.battle.playerAirborneTurns = Math.max(0, state.battle.playerAirborneTurns - 1);
  state.selection = createSelectionState();
  render();
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

function resolveAttackLane(attackingRow, defendingRow, lane, isPlayer) {
  const attacker = attackingRow[lane];
  if (!attacker) {
    return;
  }
  const attackLanes = getAttackLanes(attacker, lane);
  const strikes = attacker.sigils.includes("Double Strike") ? 2 : 1;
  attackLanes.forEach((targetLane) => {
    for (let hit = 0; hit < strikes; hit += 1) {
      if (!attackingRow[lane]) {
        break;
      }
      singleStrike(attackingRow, defendingRow, lane, targetLane, isPlayer);
    }
  });
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

function singleStrike(attackingRow, defendingRow, attackerLane, targetLane, isPlayer) {
  const attacker = attackingRow[attackerLane];
  if (!attacker) {
    return;
  }

  const airborne = attacker.sigils.includes("Airborne") || (isPlayer && state.battle.playerAirborneTurns > 0);
  const defenderLane = resolveDefenderLane(defendingRow, targetLane, airborne);
  const defender = defenderLane === null ? null : defendingRow[defenderLane];
  const blockedByLeap = defender && defender.sigils.includes("Mighty Leap");
  const repulsive = defender && defender.sigils.includes("Repulsive");
  const waterborne = defender && defender.sigils.includes("Waterborne");
  const attackPower = getAttackPower(attacker, attackingRow, attackerLane, defendingRow, targetLane);

  if (attackPower <= 0) {
    appendLog(`${attacker.name} could not deal damage.`);
    return;
  }

  if (!defender || repulsive || waterborne || (airborne && !blockedByLeap)) {
    if (isPlayer) {
      state.battle.playerDamage += attackPower;
      appendLog(`${attacker.name} struck the scale for ${attackPower}.`);
    } else {
      state.battle.enemyDamage += attackPower;
      appendLog(`${attacker.name} dealt ${attackPower} direct damage.`);
    }
    return;
  }

  dealCombatDamage(attackingRow, defendingRow, attackerLane, defenderLane, attackPower, isPlayer);
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

  if (defender.sigils.includes("Bees Within") && !isPlayer) {
    state.battle.hand.push(createLibraryCard("bee"));
    appendLog(`${defender.name} released a Bee into your hand.`);
  }

  if (defender.sigils.includes("Sharp Quills")) {
    attacker.health -= 1;
    appendLog(`${defender.name} reflected 1 damage.`);
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
  row[lane] = null;
  if (!belongsToPlayer && card.name === "Bait Bucket") {
    row[lane] = createLibraryCard("shark");
    appendLog("A shark burst from the bait bucket.");
    return;
  }
  onCardRemoved(card, belongsToPlayer, cause);
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

function advanceEnemyBoard() {
  for (let lane = 0; lane < 4; lane += 1) {
    if (!state.battle.enemySlots[lane] && state.battle.enemyQueue[lane]) {
      state.battle.enemySlots[lane] = state.battle.enemyQueue[lane];
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

  if (kind === "squirrel") {
    state.battle.hand.push(createLibraryCard("squirrel"));
    appendLog("Drew a Squirrel.");
  } else {
    if (state.battle.playerDeck.length > 0) {
      drawPlayerCard();
    } else {
      appendLog("Deck is empty. Drew a Squirrel instead.");
      state.battle.hand.push(createLibraryCard("squirrel"));
    }
  }

  state.battle.awaitingDrawChoice = false;
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
  for (let i = 0; i < state.battle.enemyQueue.length; i += 1) {
    if (!state.battle.enemyQueue[i] && state.battle.enemyDeck.length > 0) {
      const card = state.battle.enemyDeck.shift();
      state.battle.enemyQueue[i] = card;
      appendLog(`Enemy queued ${card.name}.`);
    }
  }
}

function useItem(itemId) {
  if (state.mode !== "battle") {
    return;
  }

  const item = state.items.find((entry) => entry.id === itemId);
  if (!item) {
    return;
  }

  if (itemId === "pliers") {
    state.battle.playerDamage += 1;
    appendLog("You used the pliers on the scale.");
  } else if (itemId === "squirrelBottle") {
    state.battle.hand.push(createLibraryCard("squirrel"));
    appendLog("A bottled squirrel leapt into your hand.");
  } else if (itemId === "hourglass") {
    state.battle.skipEnemyAttackPhase = true;
    appendLog("Time slowed. The enemy will miss its next attack.");
  } else if (itemId === "fan") {
    state.battle.playerAirborneTurns = 1;
    appendLog("A gust lifts your side into the air.");
  } else if (itemId === "boneJar") {
    gainBones(4);
    appendLog("The jar cracked open into four bones.");
  } else if (itemId === "blackGoatBottle") {
    state.battle.hand.push(createLibraryCard("blackGoat"));
    appendLog("A Black Goat emerged from the bottle.");
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
  state.selection.selectedHandIndex = index;
  state.selection.selectedSacrificeIndexes = [];
  appendLog(`Selected ${state.battle.hand[index].name}.`);
  render();
}

function onPlayerSlotClick(index) {
  if (state.battle.awaitingDrawChoice) {
    appendLog("Choose your draw first.");
    return;
  }

  const selectedCard = getSelectedHandCard();
  if (!selectedCard) {
    appendLog("Select a hand card first.");
    return;
  }

  if (selectedCard.costType === "bones") {
    if (state.battle.playerSlots[index]) {
      appendLog("That lane is occupied.");
      return;
    }
    if (state.battle.playerBones < selectedCard.cost) {
      appendLog(`You need ${selectedCard.cost} bones for ${selectedCard.name}.`);
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
    return;
  }

  if (selectedCard.cost > 0 && getSelectedSacrificeValue() < selectedCard.cost) {
    appendLog(`Select ${selectedCard.cost} sacrifice${selectedCard.cost > 1 ? "s" : ""} first.`);
    return;
  }

  consumeSacrifices();
  placeSelectedCard(index);
}

function toggleSacrifice(index) {
  const selectedCard = getSelectedHandCard();
  if (!selectedCard || selectedCard.costType !== "blood" || selectedCard.cost === 0) {
    appendLog("No sacrifices needed.");
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
    return;
  }
}

function runOnCardPlaced(row, lane, belongsToPlayer) {
  const card = row[lane];
  if (!card) {
    return;
  }

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
  }
  if (lane < row.length - 1 && !row[lane + 1]) {
    row[lane + 1] = createLibraryCard("chime");
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
  saveState();
  updateOrientationPrompt();
  renderMeta();
  renderBattle();
  renderChoiceScreen();
  renderRunInfo();
  renderDeck();
  renderLog();
  refs.endTurnButton.disabled = state.mode !== "battle";
}

function updateOrientationPrompt() {
  const isPhoneLike = window.innerWidth <= 960;
  const isPortrait = window.innerHeight > window.innerWidth;
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  const shouldShow = isPhoneLike && isPortrait && isStandalone;
  refs.rotateOverlay.classList.toggle("hidden", !shouldShow);
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
  refs.drawCaption.textContent = state.battle.awaitingDrawChoice ? "Choose one before playing" : "Waiting for end of turn";
  refs.drawSquirrelButton.disabled = !state.battle.awaitingDrawChoice;
  refs.drawDeckButton.disabled = !state.battle.awaitingDrawChoice;
  refs.queueCaption.textContent = state.battle.enemyDeck.length > 0 ? `${state.battle.enemyDeck.length} cards left in enemy deck` : "Enemy deck empty";

  renderLane(refs.enemyQueue, state.battle.enemyQueue, "enemy", null);
  renderLane(refs.enemyBoard, state.battle.enemySlots, "enemy", null);
  renderLane(refs.playerBoard, state.battle.playerSlots, "player", onPlayerSlotClick);
  renderHand();
  renderItems();
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
  slots.forEach((card, index) => {
    const button = document.createElement("button");
    button.className = `slot-card ${side} ${card ? "" : "empty"} ${onClick ? "selectable" : ""}`;
    if (side === "player" && canPlaceOnSlot(index)) {
      button.classList.add("targetable");
    }
    if (side === "player" && state.selection.selectedSacrificeIndexes.includes(index)) {
      button.classList.add("sacrifice-selected");
    }
    button.innerHTML = card ? formatCardMarkup(card) : `<span class="empty-caption">${side === "player" ? "Empty lane" : "No card"}</span>`;
    if (onClick) {
      button.addEventListener("click", () => onClick(index));
    } else {
      button.disabled = true;
    }
    container.appendChild(button);
  });
}

function renderHand() {
  refs.handStrip.innerHTML = "";
  state.battle.hand.forEach((card, index) => {
    const button = document.createElement("button");
    button.className = "hand-card selectable";
    if (state.selection.selectedHandIndex === index) {
      button.classList.add("selected");
    }
    button.innerHTML = formatCardMarkup(card);
    button.addEventListener("click", () => selectHandCard(index));
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
  const modalVisible = state.mode !== "battle";
  refs.choiceModal.classList.toggle("hidden", !modalVisible);
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
  refs.runText.textContent = `Round ${state.currentRound} | Battles won ${state.battlesWon} | Deck size ${state.currentDeck.length} | Items ${state.items.length}${bossText}`;
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

function formatCardMarkup(card) {
  const sigils = card.sigils.length ? card.sigils.join(", ") : "None";
  const costLabel = `${card.cost} ${card.costType}`;
  const primarySigil = card.sigils.length ? SIGIL_META[card.sigils[0]] || card.sigils[0] : "No sigils";
  return [
    `<span class="card-name">${escapeHtml(card.name)}</span>`,
    `<span class="card-stats">Cost ${escapeHtml(costLabel)} | ATK ${card.attack} | HP ${card.health}</span>`,
    `<span class="card-sigils">Sigils: ${escapeHtml(sigils)}</span>`,
    `<span class="card-meta">${escapeHtml(primarySigil)}</span>`
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
