const SAVE_VERSION = 4;
const SAVE_KEY = "inscryption-mock-web-save-v4";
const LEGACY_SAVE_KEYS = ["inscryption-mock-web-save-v3"];
const REGIONS = ["Woodlands", "Wetlands", "Snowline"];
const MAP_LANE_COUNT = 4;
const MAP_COLUMN_SPACING = 138;
const MAP_LANE_SPACING = 112;
const MAP_NODE_WIDTH = 104;
const MAP_NODE_HEIGHT = 82;
const MAP_PADDING_X = 44;
const MAP_PADDING_Y = 54;
const MAP_REGION_GAP = 1;
const NODE_META = {
  BATTLE: { label: "Battle", summary: "Fight for a reward card." },
  EPIC_BATTLE: { label: "Epic Battle", summary: "Take on a harder optional fight for a premium reward." },
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
  Repulsive: "Cannot be targeted directly.",
  "Trinket Bearer": "When played, finds one item for your pack.",
  "Touch of Death": "Any damage this creature deals is lethal.",
  "Many Lives": "Survives being sacrificed.",
  Unkillable: "Returns to hand when destroyed."
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
  "Trinket Bearer": "P",
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
  sky: { label: "Sky Scout", bonusCard: () => createCard("Raven Egg", 0, 2, 1, "blood", ["Fledgling"]) },
  ants: { label: "Ant Surge", bonusCard: () => createCard("Worker Ant", 1, 2, 1, "blood", []) },
  supply: { label: "Supply Rat", bonusCard: () => createCard("Pack Rat", 2, 2, 2, "blood", ["Trinket Bearer"]) },
  ritual: { label: "Sacrificial Rite", bonusCard: () => createCard("Black Goat", 0, 1, 1, "blood", ["Worthy Sacrifice"]) }
};
const MODAL_MODES = new Set(["reward", "campfire", "backpack", "sigil", "woodcarver", "mycologists", "economy", "gameover", "complete"]);
const VALID_MODES = new Set(["battle", "map", ...MODAL_MODES]);
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
  rewardCard(createCard("Pack Rat", 2, 2, 2, "blood", ["Trinket Bearer"]), "Uncommon"),
  rewardCard(createCard("Kingfisher", 1, 1, 1, "blood", ["Airborne", "Waterborne"]), "Uncommon"),
  rewardCard(createCard("River Snapper", 1, 6, 2, "blood", []), "Uncommon"),
  rewardCard(createCard("Ant Queen", 1, 3, 2, "blood", ["Ant Spawner"]), "Uncommon"),
  rewardCard(createCard("Black Goat", 0, 1, 1, "blood", ["Worthy Sacrifice"]), "Uncommon"),
  rewardCard(createCard("Vulture", 3, 1, 2, "blood", ["Scavenger"]), "Uncommon"),
  rewardCard(createCard("Elk Fawn", 1, 2, 1, "blood", ["Fledgling"]), "Uncommon"),
  rewardCard(createCard("Porcupine", 1, 2, 1, "blood", ["Sharp Quills"]), "Uncommon"),
  rewardCard(createCard("Opossum", 1, 1, 2, "bones", []), "Uncommon"),
  rewardCard(createCard("Grizzly Bear", 4, 6, 3, "blood", []), "Rare"),
  rewardCard(createCard("Mantis God", 2, 1, 3, "blood", ["Double Strike"]), "Rare"),
  rewardCard(createCard("Bone Heap", 1, 2, 2, "bones", ["Sharp Quills"]), "Rare"),
  rewardCard(createCard("Mantis", 1, 1, 1, "blood", ["Bifurcated Strike"]), "Rare"),
  rewardCard(createCard("Cockroach", 1, 1, 4, "bones", ["Unkillable"]), "Rare"),
  rewardCard(createCard("Pronghorn", 1, 3, 2, "blood", ["Bifurcated Strike"]), "Rare"),
  rewardCard(createCard("Rat King", 2, 1, 2, "blood", ["Bone King"]), "Rare"),
  rewardCard(createCard("Dire Wolf Pup", 1, 2, 2, "blood", ["Fledgling"]), "Rare"),
  rewardCard(createCard("Bell Tentacle", 1, 3, 2, "blood", ["Bellist"]), "Rare"),
  rewardCard(createCard("Raven Egg", 0, 2, 1, "blood", ["Fledgling"]), "Rare"),
  rewardCard(createCard("Warren", 0, 2, 1, "blood", ["Ant Spawner"]), "Rare"),
  rewardCard(createCard("Bone Lord", 1, 2, 1, "blood", ["Bone King"]), "Rare"),
  rewardCard(createCard("Corpse Maggots", 1, 2, 5, "bones", ["Corpse Eater"]), "Rare"),
  rewardCard(createCard("Mole Man", 0, 6, 1, "blood", ["Burrower", "Mighty Leap", "Repulsive"]), "Rare"),
  rewardCard(createCard("Wolverine", 2, 3, 2, "blood", ["Blood Lust"]), "Rare"),
  rewardCard(createCard("Otter", 1, 1, 1, "blood", ["Waterborne"]), "Rare")
];

const EPIC_REWARD_POOL = [
  rewardCard(createCard("Moose Buck", 3, 7, 3, "blood", []), "Epic"),
  rewardCard(createCard("Dire Wolf", 2, 5, 3, "blood", ["Double Strike"]), "Epic"),
  rewardCard(createCard("Urayuli", 7, 7, 4, "blood", []), "Epic"),
  rewardCard(createCard("Lammergeier", 0, 4, 3, "bones", ["Airborne"]), "Epic"),
  rewardCard(createCard("Child 13", 0, 1, 1, "blood", ["Many Lives", "Airborne"]), "Epic"),
  rewardCard(createCard("Long Elk", 1, 2, 2, "blood", ["Touch of Death", "Burrower"]), "Epic"),
  rewardCard(createCard("Amalgam", 3, 3, 2, "blood", ["Airborne", "Guardian"]), "Epic"),
  rewardCard(createCard("Pack Rat", 2, 2, 2, "blood", ["Trinket Bearer", "Sharp Quills"]), "Epic")
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

const ENCOUNTER_LIBRARY = {
  Woodlands: [
    {
      key: "woodlands-ambush",
      name: "Woodland Ambush",
      summary: "Cheap predators and blockers flood the center lanes first.",
      laneOrder: [1, 2, 0, 3],
      deck: () => [
        createCard("Stoat", 1, 3, 1, "blood", []),
        createCard("Bullfrog", 1, 2, 1, "blood", ["Mighty Leap"]),
        createCard("Adder", 1, 1, 1, "blood", []),
        createCard("Skunk", 0, 3, 1, "blood", ["Stinky"]),
        createCard("Elk", 1, 4, 1, "blood", []),
        createCard("Beehive", 0, 2, 1, "blood", ["Bees Within"])
      ],
      openingQueue: () => [null, createCard("Stoat", 1, 3, 1, "blood", []), null, null]
    },
    {
      key: "woodlands-pack",
      name: "Pack Hunt",
      summary: "Leaders and fast attackers collapse on lanes already under pressure.",
      laneOrder: [1, 2, 0, 3],
      deck: () => [
        createCard("Wolf Cub", 1, 1, 1, "blood", ["Fledgling"]),
        createCard("Alpha", 1, 2, 2, "blood", ["Leader"]),
        createCard("Coyote", 2, 1, 4, "bones", []),
        createCard("Wolf", 3, 2, 2, "blood", []),
        createCard("Bloodhound", 2, 3, 2, "blood", ["Guardian"]),
        createCard("Elk Fawn", 1, 2, 1, "blood", ["Fledgling"])
      ],
      openingBoard: () => [null, null, createCard("Alpha", 1, 2, 2, "blood", ["Leader"]), null],
      minTier: 1
    },
    {
      key: "woodlands-burrow",
      name: "Burrow Nest",
      summary: "Burrowers soak the first hits while split attackers line up behind them.",
      laneOrder: [0, 2, 1, 3],
      deck: () => [
        createCard("Mole", 0, 4, 2, "blood", ["Burrower"]),
        createCard("Bullfrog", 1, 2, 1, "blood", ["Mighty Leap"]),
        createCard("Porcupine", 1, 2, 1, "blood", ["Sharp Quills"]),
        createCard("Mantis", 1, 1, 1, "blood", ["Bifurcated Strike"]),
        createCard("Bloodhound", 2, 3, 2, "blood", ["Guardian"]),
        createCard("Wolf", 3, 2, 2, "blood", [])
      ],
      openingBoard: () => [createCard("Mole", 0, 4, 2, "blood", ["Burrower"]), null, null, null],
      minTier: 1
    }
  ],
  Wetlands: [
    {
      key: "wetlands-tide",
      name: "Tide Stalkers",
      summary: "Waterborne threats and fliers force awkward blocks.",
      laneOrder: [0, 3, 1, 2],
      deck: () => [
        createCard("Otter", 1, 1, 1, "blood", ["Waterborne"]),
        createCard("Kingfisher", 1, 1, 1, "blood", ["Airborne", "Waterborne"]),
        createCard("Raven", 2, 3, 2, "blood", ["Airborne"]),
        createCard("Mole", 0, 4, 2, "blood", ["Burrower"]),
        createCard("Beehive", 0, 2, 1, "blood", ["Bees Within"]),
        createCard("Vulture", 3, 1, 2, "blood", ["Scavenger"])
      ],
      openingQueue: () => [createCard("Otter", 1, 1, 1, "blood", ["Waterborne"]), null, null, null]
    },
    {
      key: "wetlands-bones",
      name: "Bone Dredge",
      summary: "Disposable bone creatures roll forward until scavengers clean up the board.",
      laneOrder: [0, 2, 1, 3],
      deck: () => [
        createCard("Skeleton", 1, 1, 1, "bones", []),
        createCard("Opossum", 1, 1, 2, "bones", []),
        createCard("Cockroach", 1, 1, 4, "bones", ["Unkillable"]),
        createCard("Bone Lord", 1, 2, 1, "blood", ["Bone King"]),
        createCard("Corpse Maggots", 1, 2, 5, "bones", ["Corpse Eater"]),
        createCard("Vulture", 3, 1, 2, "blood", ["Scavenger"])
      ],
      openingBoard: () => [null, createCard("Skeleton", 1, 1, 1, "bones", []), null, null],
      minTier: 1
    },
    {
      key: "wetlands-buckets",
      name: "Hookline Cache",
      summary: "Bait buckets and awkward blockers hide heavier follow-up threats.",
      laneOrder: [3, 0, 2, 1],
      deck: () => [
        createLibraryCard("baitBucket"),
        createCard("Mole", 0, 4, 2, "blood", ["Burrower"]),
        createCard("Kingfisher", 1, 1, 1, "blood", ["Airborne", "Waterborne"]),
        createLibraryCard("shark"),
        createCard("Bloodhound", 2, 3, 2, "blood", ["Guardian"]),
        createCard("Raven", 2, 3, 2, "blood", ["Airborne"])
      ],
      openingQueue: () => [null, null, createLibraryCard("baitBucket"), null],
      minTier: 2
    }
  ],
  Snowline: [
    {
      key: "snowline-traps",
      name: "Trapline Patrol",
      summary: "Touch-of-death traps and heavy finishers punish sloppy lanes.",
      laneOrder: [0, 2, 1, 3],
      deck: () => [
        createLibraryCard("leapingTrap"),
        createCard("Wolf", 3, 2, 2, "blood", []),
        createCard("Pronghorn", 1, 3, 2, "blood", ["Bifurcated Strike"]),
        createCard("Bloodhound", 2, 3, 2, "blood", ["Guardian"]),
        createCard("Mantis", 1, 1, 1, "blood", ["Bifurcated Strike"]),
        createCard("Grizzly Bear", 4, 6, 3, "blood", [])
      ],
      openingBoard: () => [createLibraryCard("leapingTrap"), null, null, null]
    },
    {
      key: "snowline-elites",
      name: "Apex Line",
      summary: "Premium sigils and overstatted bodies press every lane at once.",
      laneOrder: [1, 2, 0, 3],
      deck: () => [
        createCard("Grizzly Bear", 4, 6, 3, "blood", []),
        createCard("Mantis God", 2, 1, 3, "blood", ["Double Strike"]),
        createCard("Cockroach", 1, 1, 4, "bones", ["Unkillable"]),
        createCard("Dire Wolf Pup", 1, 2, 2, "blood", ["Fledgling"]),
        createCard("Vulture", 3, 1, 2, "blood", ["Scavenger"]),
        createCard("Mole Man", 0, 6, 1, "blood", ["Burrower", "Mighty Leap", "Repulsive"])
      ],
      openingQueue: () => [null, createCard("Dire Wolf Pup", 1, 2, 2, "blood", ["Fledgling"]), null, null],
      minTier: 1
    },
    {
      key: "snowline-bones",
      name: "Carrion Court",
      summary: "Bone engines trade bodies for tempo until an elite closes the fight.",
      laneOrder: [3, 1, 2, 0],
      deck: () => [
        createCard("Rat King", 2, 1, 2, "blood", ["Bone King"]),
        createCard("Cockroach", 1, 1, 4, "bones", ["Unkillable"]),
        createCard("Bone Heap", 1, 2, 2, "bones", ["Sharp Quills"]),
        createCard("Vulture", 3, 1, 2, "blood", ["Scavenger"]),
        createCard("Wolverine", 2, 3, 2, "blood", ["Blood Lust"]),
        createCard("Grizzly Bear", 4, 6, 3, "blood", [])
      ],
      openingBoard: () => [null, null, createCard("Rat King", 2, 1, 2, "blood", ["Bone King"]), null],
      minTier: 2
    }
  ]
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
  itemCountText: document.getElementById("item-count-text"),
  battlePhaseChip: document.getElementById("battle-phase-chip"),
  battleTip: document.getElementById("battle-tip"),
  battleBanner: document.getElementById("battle-banner"),
  tutorialPanel: document.getElementById("tutorial-panel"),
  mapView: document.getElementById("map-view"),
  mapSummary: document.getElementById("map-summary"),
  mapLegend: document.getElementById("map-legend"),
  mapScroll: document.getElementById("map-scroll"),
  mapBoard: document.getElementById("map-board"),
  mapLinks: document.getElementById("map-links"),
  mapRegions: document.getElementById("map-regions"),
  mapNodes: document.getElementById("map-nodes"),
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
  adminWinArea: document.getElementById("admin-win-area"),
  adminWinTrigger: document.getElementById("admin-win-trigger"),
  endTurnButton: document.getElementById("end-turn-button"),
  newRunButton: document.getElementById("new-run-button"),
  clearSaveButton: document.getElementById("clear-save-button")
};

refs.endTurnButton.addEventListener("click", endTurn);
refs.newRunButton.addEventListener("click", startNewRun);
refs.clearSaveButton.addEventListener("click", clearSave);
refs.drawSquirrelButton.addEventListener("click", () => chooseDraw("squirrel"));
refs.drawDeckButton.addEventListener("click", () => chooseDraw("deck"));
refs.adminWinTrigger?.addEventListener("pointerup", handleAdminWinTriggerEvent);
refs.adminWinArea?.addEventListener("click", (event) => {
  if (event.target.closest(".topbar-actions")) {
    return;
  }
  triggerAdminWin();
});
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
      completedRuns: 0,
      completedBosses: 0,
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
    anglerHookUsed: false,
    encounterKey: "standard",
    encounterName: "Trail Encounter",
    encounterDescription: "",
    queueOrder: null
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

function getStarterItems(key) {
  const items = [copyItem(ITEM_DEFS.squirrelBottle)];
  if (key === "supply") {
    items.push(copyItem(ITEM_DEFS.pliers));
  }
  if (key === "ritual") {
    items.push(copyItem(ITEM_DEFS.blackGoatBottle));
  }
  return items;
}

function getNextStarterUnlockKey() {
  const keys = Array.isArray(state.meta?.unlockedStarterKeys) && state.meta.unlockedStarterKeys.length
    ? state.meta.unlockedStarterKeys
    : ["classic"];
  const offset = Math.max((state.meta?.lifetimeRuns || 1) - 1, 0);
  return keys[offset % keys.length];
}

function applyMetaUnlockProgress() {
  if ((state.meta?.lifetimeRuns || 0) >= 2 || state.battlesWon > 0) {
    unlockStarter("bones");
  }
  if ((state.meta?.lifetimeRuns || 0) >= 3) {
    unlockStarter("ants");
  }
  if ((state.meta?.lifetimeRuns || 0) >= 5) {
    unlockStarter("supply");
  }
  if ((state.meta?.completedBosses || 0) >= 1) {
    unlockStarter("sky");
  }
  if ((state.meta?.completedBosses || 0) >= 3 || (state.meta?.completedRuns || 0) >= 1) {
    unlockStarter("ritual");
  }
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
  const previousMeta = Object.assign({ lifetimeRuns: 0, completedRuns: 0, completedBosses: 0, unlockedStarterKeys: ["classic"], activeStarterKey: "classic" }, state.meta || {});
  Object.assign(state, fresh);
  state.meta = previousMeta;
  state.meta.lifetimeRuns += 1;
  applyMetaUnlockProgress();
  state.meta.activeStarterKey = getNextStarterUnlockKey();
  state.map = generateMap();
  state.currentDeck = buildStarterDeck();
  state.items = getStarterItems(state.meta.activeStarterKey);
  moveToNode(0);
  appendLog(`Started a new run with ${getStarterUnlockLabel(state.meta.activeStarterKey)}.`);
  enterNode(getCurrentNode());
}

function clearSave() {
  window.localStorage.removeItem(SAVE_KEY);
  LEGACY_SAVE_KEYS.forEach((key) => window.localStorage.removeItem(key));
  startNewRun();
  state.saveStatus = "Reset";
  refs.saveText.textContent = state.saveStatus;
}

function loadSavedState() {
  const activeKey = [SAVE_KEY, ...LEGACY_SAVE_KEYS].find((key) => window.localStorage.getItem(key));
  if (!activeKey) {
    return false;
  }
  const raw = window.localStorage.getItem(activeKey);

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || ![SAVE_VERSION, SAVE_VERSION - 1].includes(parsed.saveVersion)) {
      window.localStorage.removeItem(activeKey);
      return false;
    }
    const fresh = createInitialState();
    Object.assign(state, fresh, parsed);
    state.saveVersion = SAVE_VERSION;
    state.saveStatus = "Loaded";
    normalizeStateAfterLoad();
    if (activeKey !== SAVE_KEY) {
      saveState();
      window.localStorage.removeItem(activeKey);
    }
    return true;
  } catch (error) {
    console.error("Failed to load save", error);
    window.localStorage.removeItem(activeKey);
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
  state.meta = Object.assign({ lifetimeRuns: 0, completedRuns: 0, completedBosses: 0, unlockedStarterKeys: ["classic"], activeStarterKey: "classic" }, state.meta || {});
  state.battle.enemySlots = normalizeEncounterRow(state.battle.enemySlots);
  state.battle.enemyQueue = normalizeEncounterRow(state.battle.enemyQueue);
  state.battle.playerSlots = normalizeEncounterRow(state.battle.playerSlots);
  state.items = state.items.map((item) => copyItem(ITEM_DEFS[item.id] || item));
  normalizeMapLayout(state.map);
  applyMetaUnlockProgress();
  ensureValidUiState("load");
}

function saveState() {
  window.localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  LEGACY_SAVE_KEYS.forEach((key) => {
    if (key !== SAVE_KEY) {
      window.localStorage.removeItem(key);
    }
  });
  state.saveStatus = `Saved ${new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
}

function generateMap() {
  const allNodes = [];
  const regionBosses = [];
  const regionStarts = [];
  let nodeIndex = 0;
  let globalColumn = 0;

  REGIONS.forEach((region, regionIndex) => {
    const normalColumns = 5 + Math.floor(Math.random() * 2);
    const columns = [];
    const startLane = regionIndex % 2 === 0 ? 1 : 2;

    columns.push({
      regionColumn: 0,
      lanes: [startLane],
      fixedType: "BATTLE"
    });

    for (let column = 1; column < normalColumns; column += 1) {
      const previousLanes = columns[column - 1].lanes;
      columns.push({
        regionColumn: column,
        lanes: createBranchLanes(previousLanes, column, normalColumns)
      });
    }

    const preBossLanes = columns[columns.length - 1].lanes;
    const epicLane = pickAnchorLane(preBossLanes, regionIndex);
    const bossLane = 1 + (regionIndex % 2);

    columns.push({
      regionColumn: columns.length,
      lanes: [epicLane],
      fixedType: "EPIC_BATTLE"
    });
    columns.push({
      regionColumn: columns.length,
      lanes: [bossLane],
      fixedType: "BOSS"
    });

    columns.forEach((columnData) => {
      const nodes = columnData.lanes.map((lane, laneIndex) => {
        const type = columnData.fixedType || selectNodeType(region, columnData.regionColumn, normalColumns);
        const node = {
          id: `${region.toLowerCase()}_${nodeIndex}`,
          type,
          region,
          regionIndex,
          position: nodeIndex,
          regionPosition: columnData.regionColumn,
          column: globalColumn + columnData.regionColumn,
          lane,
          nextChoices: [],
          visited: false,
          completed: false
        };
        if (type === "BOSS") {
          node.id = `${region.toLowerCase()}_boss`;
        } else if (type === "EPIC_BATTLE") {
          node.id = `${region.toLowerCase()}_epic`;
        } else {
          node.id = `${region.toLowerCase()}_${columnData.regionColumn}_${lane}_${laneIndex}`;
        }
        allNodes.push(node);
        nodeIndex += 1;
        return node;
      });
      columnData.nodes = nodes;
    });

    for (let column = 0; column < columns.length - 1; column += 1) {
      const currentNodes = columns[column].nodes;
      const nextNodes = columns[column + 1].nodes;
      const skipBossNodes = columns[column + 2]?.fixedType === "BOSS" && nextNodes[0]?.type === "EPIC_BATTLE"
        ? columns[column + 2].nodes
        : null;

      linkMapColumns(currentNodes, nextNodes);
      if (skipBossNodes) {
        linkMapColumns(currentNodes, skipBossNodes, 1);
      }
    }

    regionStarts.push(columns[0].nodes[0]);
    regionBosses.push(columns[columns.length - 1].nodes[0]);
    globalColumn += columns.length + MAP_REGION_GAP;
  });

  for (let regionIndex = 0; regionIndex < regionBosses.length - 1; regionIndex += 1) {
    const boss = regionBosses[regionIndex];
    const nextStart = regionStarts[regionIndex + 1];
    if (boss && nextStart && !boss.nextChoices.includes(nextStart.position)) {
      boss.nextChoices.push(nextStart.position);
    }
  }

  normalizeMapLayout(allNodes);
  return allNodes;
}

function createBranchLanes(previousLanes, column, totalColumns) {
  const targetCount = column >= totalColumns - 2 ? 2 : 2 + Math.floor(Math.random() * 2);
  const lanes = new Set(previousLanes.map((lane) => clampLane(lane + Math.floor(Math.random() * 3) - 1)));
  while (lanes.size < targetCount) {
    const seed = previousLanes[Math.floor(Math.random() * previousLanes.length)] ?? Math.floor(MAP_LANE_COUNT / 2);
    lanes.add(clampLane(seed + Math.floor(Math.random() * 5) - 2));
  }
  return [...lanes].sort((a, b) => a - b).slice(0, 3);
}

function pickAnchorLane(lanes, regionIndex = 0) {
  const sorted = [...lanes].sort((a, b) => a - b);
  const midpoint = sorted[Math.floor(sorted.length / 2)] ?? Math.floor(MAP_LANE_COUNT / 2);
  return clampLane(midpoint + (regionIndex % 2 === 0 ? 0 : -1));
}

function clampLane(lane) {
  return Math.max(0, Math.min(MAP_LANE_COUNT - 1, lane));
}

function linkMapColumns(sourceNodes, targetNodes, maxTargets = 2) {
  if (!sourceNodes?.length || !targetNodes?.length) {
    return;
  }

  sourceNodes.forEach((node) => {
    const rankedTargets = [...targetNodes].sort((a, b) => {
      const laneDelta = Math.abs(node.lane - a.lane) - Math.abs(node.lane - b.lane);
      return laneDelta || a.position - b.position;
    });
    const desiredTargets = Math.min(maxTargets, rankedTargets.length, sourceNodes.length > 1 && targetNodes.length > 1 ? 2 : 1);
    rankedTargets.slice(0, desiredTargets).forEach((target) => {
      if (!node.nextChoices.includes(target.position)) {
        node.nextChoices.push(target.position);
      }
    });
  });

  targetNodes.forEach((target) => {
    const hasInbound = sourceNodes.some((node) => node.nextChoices.includes(target.position));
    if (hasInbound) {
      return;
    }
    const nearestSource = [...sourceNodes].sort((a, b) => {
      const laneDelta = Math.abs(a.lane - target.lane) - Math.abs(b.lane - target.lane);
      return laneDelta || a.position - b.position;
    })[0];
    if (nearestSource && !nearestSource.nextChoices.includes(target.position)) {
      nearestSource.nextChoices.push(target.position);
    }
  });
}

function normalizeMapLayout(map) {
  if (!Array.isArray(map) || !map.length) {
    return;
  }

  const missingLayout = map.some((node) => !Number.isInteger(node.column) || !Number.isInteger(node.lane));
  if (!missingLayout) {
    map.forEach((node) => {
      node.regionIndex = Number.isInteger(node.regionIndex) ? node.regionIndex : Math.max(REGIONS.indexOf(node.region), 0);
      node.regionPosition = Number.isInteger(node.regionPosition) ? node.regionPosition : 0;
    });
    return;
  }

  let globalColumn = 0;
  REGIONS.forEach((region, regionIndex) => {
    const regionNodes = map
      .filter((node) => node.region === region)
      .sort((a, b) => (a.regionPosition ?? a.position) - (b.regionPosition ?? b.position) || a.position - b.position);
    if (!regionNodes.length) {
      return;
    }

    const groups = new Map();
    regionNodes.forEach((node) => {
      const key = Number.isInteger(node.regionPosition) ? node.regionPosition : 0;
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key).push(node);
    });

    const orderedKeys = [...groups.keys()].sort((a, b) => a - b);
    orderedKeys.forEach((regionColumn, index) => {
      const group = groups.get(regionColumn) || [];
      const baseLanes = getLegacyLanesForGroup(group.length, index);
      group.forEach((node, groupIndex) => {
        node.regionIndex = regionIndex;
        node.regionPosition = regionColumn;
        node.column = globalColumn + index;
        node.lane = node.type === "BOSS"
          ? 1 + (regionIndex % 2)
          : node.type === "EPIC_BATTLE"
            ? pickAnchorLane(baseLanes, regionIndex)
            : baseLanes[groupIndex] ?? baseLanes[baseLanes.length - 1] ?? 1;
      });
    });

    globalColumn += orderedKeys.length + MAP_REGION_GAP;
  });
}

function getLegacyLanesForGroup(size, offset = 0) {
  if (size <= 1) {
    return [1 + (offset % 2)];
  }
  if (size === 2) {
    return offset % 2 === 0 ? [1, 2] : [0, 2];
  }
  return [0, 1, 2];
}

function selectNodeType(region, regionPosition, nodeCount) {
  if (regionPosition === 0 || regionPosition >= nodeCount - 2) {
    return "BATTLE";
  }

  const roll = Math.floor(Math.random() * 140);
  if (roll < 62) {
    return "BATTLE";
  }
  if (roll < 77) {
    return "CAMPFIRE";
  }
  if (roll < 89) {
    return "BACKPACK";
  }
  if (roll < 102) {
    return "SIGIL_TRANSFER";
  }
  if (roll < 116) {
    return "WOODCARVER";
  }
  if (roll < 128) {
    return "MYCOLOGISTS";
  }
  if (region === "Wetlands" && roll < 134) {
    return "BACKPACK";
  }
  if (region === "Snowline" && roll < 136) {
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

  if (node.type === "BATTLE" || node.type === "EPIC_BATTLE" || node.type === "BOSS") {
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
  state.currentScreen = node.type === "BOSS" ? "Boss Battle" : node.type === "EPIC_BATTLE" ? "Epic Battle" : "Battle";
  state.battle = createBattleState();
  state.selection = createSelectionState();
  clearTransientCombatUi();
  state.battle.nodeType = node.type;
  state.battle.bossType = node.type === "BOSS" ? getBossType(node.region) : null;
  const encounterProfile = getEncounterProfile(node);
  state.battle.encounterKey = encounterProfile.key;
  state.battle.encounterName = encounterProfile.name;
  state.battle.encounterDescription = encounterProfile.summary;
  state.battle.queueOrder = encounterProfile.laneOrder || null;
  state.battle.hand = [createLibraryCard("squirrel")];
  state.battle.playerDeck = shuffle(state.currentDeck.map(copyCard));
  state.battle.enemyDeck = shuffle(encounterProfile.deck.map(copyCard));
  state.battle.enemySlots = normalizeEncounterRow(encounterProfile.openingBoard);
  state.battle.enemyQueue = normalizeEncounterRow(encounterProfile.openingQueue);

  drawPlayerCard();
  drawPlayerCard();
  drawPlayerCard();
  fillEnemyQueue();
  state.battle.awaitingDrawChoice = false;
  setBattlePhase(node.type === "BOSS" ? `${getBossDisplayName()} awaits` : node.type === "EPIC_BATTLE" ? "Epic Battle" : "Battle Ready", node.type === "BOSS" ? "enemy" : node.type === "EPIC_BATTLE" ? "warning" : "neutral");
  showTransientMessage(
    node.type === "BOSS" ? `${getBossDisplayName()} enters the fight.` : node.type === "EPIC_BATTLE" ? `${encounterProfile.name} stands between you and the boss.` : `${encounterProfile.name} begins.`,
    node.type === "BOSS" ? "enemy" : node.type === "EPIC_BATTLE" ? "warning" : "neutral",
    1800
  );

  appendLog(`Entered ${node.type === "BOSS" ? "a boss battle" : node.type === "EPIC_BATTLE" ? "an epic battle" : "a battle"} in ${node.region}.`);
  render();
}

function getEncounterProfile(node) {
  if (node.type === "BOSS") {
    return {
      key: `${node.region.toLowerCase()}-boss`,
      name: `${getBossDisplayName()} Encounter`,
      summary: getEncounterIdentityText().long,
      laneOrder: getBossQueueOrder(getBossType(node.region)),
      deck: getBossDeck(getBossType(node.region), 1),
      openingBoard: [null, null, null, null],
      openingQueue: [null, null, null, null]
    };
  }

  const tier = getEncounterTier(node) + (node.type === "EPIC_BATTLE" ? 1 : 0);
  const pool = (ENCOUNTER_LIBRARY[node.region] || []).filter((entry) => tier >= (entry.minTier || 0));
  const chosen = pool[Math.floor(Math.random() * pool.length)] || {
    key: "fallback",
    name: `${node.region} Battle`,
    summary: "A standard trail fight.",
    laneOrder: [0, 1, 2, 3],
    deck: () => [createCard("Stoat", 1, 3, 1, "blood", []), createCard("Bullfrog", 1, 2, 1, "blood", ["Mighty Leap"])],
    openingBoard: () => [null, null, null, null],
    openingQueue: () => [null, null, null, null]
  };
  const profile = {
    key: chosen.key,
    name: node.type === "EPIC_BATTLE" ? `${chosen.name} Elite` : chosen.name,
    summary: node.type === "EPIC_BATTLE" ? `${chosen.summary} The enemy line is reinforced for a premium prize.` : chosen.summary,
    laneOrder: chosen.laneOrder || [0, 1, 2, 3],
    deck: chosen.deck(),
    openingBoard: chosen.openingBoard ? chosen.openingBoard() : [null, null, null, null],
    openingQueue: chosen.openingQueue ? chosen.openingQueue() : [null, null, null, null]
  };
  return node.type === "EPIC_BATTLE" ? elevateEncounterProfile(profile, node.region) : profile;
}

function elevateEncounterProfile(profile, region) {
  const deck = profile.deck.map(copyCard);
  const eliteCard = getEpicEliteCard(region);
  if (eliteCard) {
    deck.push(eliteCard);
  }
  if (deck.length > 0) {
    const target = deck[Math.floor(Math.random() * deck.length)];
    if (target) {
      target.attack += 1;
      target.health += 1;
    }
  }
  const openingQueue = normalizeEncounterRow(profile.openingQueue);
  const emptyLane = openingQueue.findIndex((card) => !card);
  if (emptyLane >= 0 && eliteCard) {
    openingQueue[emptyLane] = copyCard(eliteCard);
  }
  return {
    key: `${profile.key}-epic`,
    name: profile.name,
    summary: profile.summary,
    laneOrder: profile.laneOrder,
    deck,
    openingBoard: normalizeEncounterRow(profile.openingBoard),
    openingQueue
  };
}

function getEpicEliteCard(region) {
  if (region === "Woodlands") {
    return createCard("Dire Wolf", 2, 5, 3, "blood", ["Double Strike"]);
  }
  if (region === "Wetlands") {
    return createCard("Kingfisher", 2, 2, 1, "blood", ["Airborne", "Waterborne"]);
  }
  if (region === "Snowline") {
    return createCard("Grizzly Bear", 4, 6, 3, "blood", []);
  }
  return createCard("Wolf", 3, 2, 2, "blood", []);
}

function normalizeEncounterRow(row = []) {
  return [0, 1, 2, 3].map((index) => row[index] ? copyCard(row[index]) : null);
}

function getEncounterTier(node) {
  const regionNodeCount = state.map.filter((entry) => entry.region === node.region).length;
  const regionDepth = node.regionPosition / Math.max(regionNodeCount - 1, 1);
  const regionRank = REGIONS.indexOf(node.region);
  return Math.min(2, Math.floor(regionDepth * 2.6) + Math.max(regionRank, 0));
}

function getBossQueueOrder(bossType) {
  if (bossType === "PROSPECTOR") return [1, 2, 0, 3];
  if (bossType === "ANGLER") return [0, 3, 1, 2];
  if (bossType === "TRAPPER_TRADER") return [0, 2, 1, 3];
  return [0, 1, 2, 3];
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
  const currentNode = getCurrentNode();
  if (currentNode && currentNode.type === "BOSS") {
    state.currentScreen = "Choose a Reward";
    state.rewardOptions = [pickRewardCardForTier("Uncommon"), pickRewardCardForTier("Rare"), pickRewardCardForTier("Rare")];
    state.items.push(copyItem(shuffle(Object.values(ITEM_DEFS))[0]));
    appendLog("Boss reward: you also found an item.");
  } else if (currentNode && currentNode.type === "EPIC_BATTLE") {
    state.currentScreen = "Choose an Epic Reward";
    state.rewardOptions = [pickRewardCardForTier("Epic"), pickRewardCardForTier("Epic"), pickRewardCardForTier("Epic")];
    appendLog("Epic battle reward: choose one premium card.");
  } else if (state.battlesWon > 0 && state.battlesWon % 4 === 0) {
    state.currentScreen = "Choose a Reward";
    state.rewardOptions = [pickRewardCardForTier("Uncommon"), pickRewardCardForTier("Uncommon"), pickRewardCardForTier("Rare")];
  } else {
    state.currentScreen = "Choose a Reward";
    state.rewardOptions = [pickRewardCard(), pickRewardCard(), pickRewardCard()];
  }
  render();
}

function pickRewardCard() {
  const node = getCurrentNode();
  const progress = node ? node.position / Math.max(state.map.length - 1, 1) : 0;
  const metaBoost = Math.min(state.meta?.completedBosses || 0, 2);
  const roll = Math.floor(Math.random() * 100);
  let rarity = "Common";
  if (progress > 0.7) {
    rarity = roll < 45 - metaBoost * 4 ? "Common" : roll < 82 - metaBoost * 3 ? "Uncommon" : "Rare";
  } else if (progress > 0.35) {
    rarity = roll < 58 - metaBoost * 3 ? "Common" : roll < 88 - metaBoost * 2 ? "Uncommon" : "Rare";
  } else {
    rarity = roll < 70 - metaBoost * 2 ? "Common" : roll < 92 - metaBoost ? "Uncommon" : "Rare";
  }
  return pickRewardCardForTier(rarity);
}

function pickRewardCardForTier(rarity) {
  const pool = rarity === "Epic"
    ? EPIC_REWARD_POOL
    : REWARD_POOL.filter((entry) => entry.rarity === rarity);
  const selected = pool[Math.floor(Math.random() * pool.length)];
  return { card: copyCard(selected.card), rarity: selected.rarity };
}

function showMapSelection() {
  const currentNode = getCurrentNode();
  normalizeMapLayout(state.map);
  state.mode = "map";
  state.currentScreen = "Choose Your Path";
  state.eventState = {
    type: "map",
    choices: currentNode ? currentNode.nextChoices.map(findNodeByIndex) : []
  };
  render();
}

function showCampfireEvent() {
  const variant = getCampfireVariant();
  state.mode = "campfire";
  state.currentScreen = variant.title;
  state.eventState = { type: "campfire", step: "chooseCard", selectedCardIndex: null, variant: variant.key, description: variant.description };
  render();
}

function showBackpackEvent() {
  const config = getBackpackEventConfig();
  state.mode = "backpack";
  state.currentScreen = config.title;
  state.eventState = { type: "backpack", options: config.options, description: config.description, picksRemaining: config.picksRemaining };
  render();
}

function showSigilTransferEvent() {
  const hasDonors = state.currentDeck.some((card) => card.sigils.length > 0);
  const ritual = getSigilEventConfig();
  state.mode = "sigil";
  state.currentScreen = ritual.title;
  state.eventState = {
    type: "sigil",
    step: hasDonors ? "chooseDonor" : "empty",
    donorIndex: null,
    sigil: null,
    ritual: ritual.key,
    description: ritual.description
  };
  if (!hasDonors) {
    appendLog("No card in your deck has a sigil to transfer.");
  }
  render();
}

function showWoodcarverEvent() {
  const config = getWoodcarverConfig();
  state.mode = "woodcarver";
  state.currentScreen = config.title;
  state.eventState = {
    type: "woodcarver",
    step: "chooseSigil",
    offeredSigils: shuffle(SIGIL_STONE_POOL).slice(0, config.offerCount),
    chosenSigil: null,
    boon: config.key,
    description: config.description
  };
  render();
}

function showMycologistsEvent() {
  const config = getMycologistConfig();
  state.mode = "mycologists";
  state.currentScreen = config.title;
  state.eventState = {
    type: "mycologists",
    pairs: findMergePairs(),
    fusion: config.key,
    description: config.description
  };
  render();
}

function showTraderEvent() {
  const config = getTraderConfig();
  state.mode = "economy";
  state.currentScreen = config.title;
  state.eventState = {
    type: "economy",
    step: "chooseSacrifice",
    tradeOutIndex: null,
    offers: config.offers,
    haggling: config.key,
    description: config.description
  };
  render();
}

function getNodeProgress(node = getCurrentNode()) {
  return node ? node.position / Math.max(state.map.length - 1, 1) : 0;
}

function getCampfireVariant() {
  const region = getCurrentNode()?.region;
  const progress = getNodeProgress();
  if (region === "Snowline" || progress > 0.6) {
    return {
      key: "hungry",
      title: "Hungry Campfire",
      description: "The flames burn bright. Larger gains are possible, but the card may come away singed."
    };
  }
  return {
    key: "steady",
    title: "Campfire",
    description: "A steady flame offers a reliable blessing."
  };
}

function getBackpackEventConfig() {
  const region = getCurrentNode()?.region;
  const progress = getNodeProgress();
  const pool = getRegionItemPool(region);
  return {
    title: progress > 0.68 ? "Supply Cache" : "Backpack",
    description: progress > 0.68 ? "A deeper cache lets you pack two tools for the road." : "Choose one tool to bring into the next fights.",
    picksRemaining: progress > 0.68 ? 2 : 1,
    options: shuffle(pool).slice(0, progress > 0.68 ? 4 : 3).map(copyItem)
  };
}

function getRegionItemPool(region) {
  const items = [ITEM_DEFS.squirrelBottle, ITEM_DEFS.pliers, ITEM_DEFS.hourglass, ITEM_DEFS.fan, ITEM_DEFS.boneJar, ITEM_DEFS.blackGoatBottle];
  if (region === "Wetlands") {
    return [ITEM_DEFS.hourglass, ITEM_DEFS.fan, ITEM_DEFS.boneJar, ITEM_DEFS.squirrelBottle, ITEM_DEFS.pliers];
  }
  if (region === "Snowline") {
    return [ITEM_DEFS.pliers, ITEM_DEFS.blackGoatBottle, ITEM_DEFS.boneJar, ITEM_DEFS.hourglass, ITEM_DEFS.fan];
  }
  return items;
}

function getSigilEventConfig() {
  const progress = getNodeProgress();
  if (progress > 0.65) {
    return {
      key: "echo",
      title: "Echo Stones",
      description: "The donor survives, but the chosen sigil is carved away and echoed onto another card."
    };
  }
  return {
    key: "sever",
    title: "Ritual Stones",
    description: "The donor is consumed so another card may inherit its sigil."
  };
}

function getWoodcarverConfig() {
  const region = getCurrentNode()?.region;
  if (region === "Snowline") {
    return {
      key: "fortified",
      title: "Totem Builder",
      description: "The carver reinforces the chosen creature with an extra point of health.",
      offerCount: 4
    };
  }
  return {
    key: "etched",
    title: "Totem Builder",
    description: "Choose one sigil stone to carve into a creature.",
    offerCount: 3
  };
}

function getMycologistConfig() {
  const progress = getNodeProgress();
  if (progress > 0.65) {
    return {
      key: "masterwork",
      title: "Master Mycologists",
      description: "Late-stage stitching yields a more dramatic fusion."
    };
  }
  return {
    key: "stitch",
    title: "Card Merge",
    description: "Fuse duplicate cards into one stronger specimen."
  };
}

function getTraderConfig() {
  const progress = getNodeProgress();
  return {
    key: progress > 0.72 ? "lavish" : "standard",
    title: progress > 0.72 ? "High Trader" : "Trader",
    description: progress > 0.72 ? "Late traders demand a card first, then reveal premium stock." : "Trade one card away for a curated offer.",
    offers: [pickRewardCardForTier("Uncommon"), pickRewardCardForTier("Uncommon"), pickRewardCardForTier(progress > 0.72 ? "Rare" : "Uncommon")]
  };
}

function buildTraderOffers(tradedCard, haggling = "standard") {
  const rareChance = haggling === "lavish";
  const matchingPool = REWARD_POOL.filter((entry) =>
    entry.card.costType === tradedCard.costType
    || entry.card.sigils.some((sigil) => tradedCard.sigils.includes(sigil))
  );
  const rarePool = REWARD_POOL.filter((entry) => entry.rarity === "Rare");
  const uncommonPool = REWARD_POOL.filter((entry) => entry.rarity === "Uncommon");
  const offers = [];
  const first = matchingPool.length ? matchingPool[Math.floor(Math.random() * matchingPool.length)] : uncommonPool[Math.floor(Math.random() * uncommonPool.length)];
  offers.push({ card: copyCard(first.card), rarity: first.rarity });
  const second = uncommonPool[Math.floor(Math.random() * uncommonPool.length)];
  offers.push({ card: copyCard(second.card), rarity: second.rarity });
  const finisherPool = rareChance ? rarePool : [...uncommonPool, ...rarePool];
  const third = finisherPool[Math.floor(Math.random() * finisherPool.length)];
  offers.push({ card: copyCard(third.card), rarity: third.rarity });
  return offers;
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
  } else if (card.name === "Raven Egg") {
    card.name = "Raven";
    card.attack = 2;
    card.health = 3;
    card.cost = 2;
    card.sigils.push("Airborne");
  } else if (card.name === "Elk Fawn") {
    card.name = "Elk";
    card.attack = 2;
    card.health = 4;
    card.cost = 2;
  } else if (card.name === "Dire Wolf Pup") {
    card.name = "Dire Wolf";
    card.attack = 2;
    card.health = 5;
    card.cost = 3;
    if (!card.sigils.includes("Double Strike")) {
      card.sigils.push("Double Strike");
    }
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
    resolveBattleVictory();
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

function handleAdminWinTriggerEvent(event) {
  event.preventDefault();
  event.stopPropagation();
  triggerAdminWin();
}

function resolveBattleVictory() {
  const node = getCurrentNode();
  if (node) {
    node.completed = true;
  }
  state.battlesWon += 1;
  if (state.battle.nodeType === "BOSS") {
    state.meta.completedBosses = (state.meta.completedBosses || 0) + 1;
  }
  applyMetaUnlockProgress();
  state.currentRound += 1;
  state.cumulativeDamageDealt += state.battle.playerDamage;
  state.cumulativeDamageReceived += state.battle.enemyDamage;
  appendLog("Battle won.");
  showCardReward();
}

function triggerAdminWin() {
  if (state.mode !== "battle") {
    showTransientMessage("Admin win only works during battles.", "warning", 1200);
    return;
  }
  uiState.turnAnimating = false;
  state.battle.playerDamage = 5;
  if (state.battle.nodeType === "BOSS") {
    state.battle.bossPhase = 2;
  }
  appendLog("Admin win triggered.");
  showTransientMessage("Admin win triggered.", "success", 1000);
  resolveBattleVictory();
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
  state.battle.queueOrder = getBossQueueOrder(state.battle.bossType);
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
  state.meta.completedRuns = (state.meta.completedRuns || 0) + 1;
  applyMetaUnlockProgress();
  state.mode = "complete";
  state.currentScreen = "Run Complete";
  state.eventState = { type: "complete" };
  render();
}

function setBattleScreenState(node) {
  state.mode = "battle";
  state.currentScreen = node && node.type === "BOSS" ? "Boss Battle" : node && node.type === "EPIC_BATTLE" ? "Epic Battle" : "Battle";
  state.eventState = null;
}

function setMapScreenState(node) {
  normalizeMapLayout(state.map);
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

  if (node.type === "BATTLE" || node.type === "EPIC_BATTLE" || node.type === "BOSS") {
    setBattleScreenState(node);
    return;
  }

  if (node.type === "CAMPFIRE") {
    const variant = getCampfireVariant();
    state.mode = "campfire";
    state.currentScreen = variant.title;
    state.eventState = { type: "campfire", step: "chooseCard", selectedCardIndex: null, variant: variant.key, description: variant.description };
    return;
  }

  if (node.type === "BACKPACK") {
    const config = getBackpackEventConfig();
    state.mode = "backpack";
    state.currentScreen = config.title;
    state.eventState = { type: "backpack", options: config.options, description: config.description, picksRemaining: config.picksRemaining };
    return;
  }

  if (node.type === "SIGIL_TRANSFER") {
    const hasDonors = state.currentDeck.some((card) => card.sigils.length > 0);
    const ritual = getSigilEventConfig();
    state.mode = "sigil";
    state.currentScreen = ritual.title;
    state.eventState = {
      type: "sigil",
      step: hasDonors ? "chooseDonor" : "empty",
      donorIndex: null,
      sigil: null,
      ritual: ritual.key,
      description: ritual.description
    };
    return;
  }

  if (node.type === "WOODCARVER") {
    const config = getWoodcarverConfig();
    state.mode = "woodcarver";
    state.currentScreen = config.title;
    state.eventState = {
      type: "woodcarver",
      step: "chooseSigil",
      offeredSigils: shuffle(SIGIL_STONE_POOL).slice(0, config.offerCount),
      chosenSigil: null,
      boon: config.key,
      description: config.description
    };
    return;
  }

  if (node.type === "MYCOLOGISTS") {
    const config = getMycologistConfig();
    state.mode = "mycologists";
    state.currentScreen = config.title;
    state.eventState = {
      type: "mycologists",
      pairs: findMergePairs(),
      fusion: config.key,
      description: config.description
    };
    return;
  }

  if (node.type === "ECONOMY") {
    const config = getTraderConfig();
    state.mode = "economy";
    state.currentScreen = config.title;
    state.eventState = {
      type: "economy",
      step: "chooseSacrifice",
      tradeOutIndex: null,
      offers: config.offers,
      haggling: config.key,
      description: config.description
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

  if (state.mode === "map") {
    if (state.eventState?.type !== "map" || !Array.isArray(state.eventState.choices)) {
      setMapScreenState(getCurrentNode());
      appendLog(`Recovered from a stuck map state during ${source}.`);
    }
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
  if (Array.isArray(state.battle.queueOrder) && state.battle.queueOrder.length === 4) {
    return state.battle.queueOrder;
  }
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
  const currentNode = getCurrentNode();
  if (!currentNode?.nextChoices.includes(index)) {
    return;
  }
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
  const risky = state.eventState.variant === "hungry";
  if (kind === "power") {
    card.attack += risky ? 2 : 1;
    appendLog(`${card.name} gained ${risky ? 2 : 1} power at the campfire.`);
  } else {
    card.health += risky ? 3 : 2;
    appendLog(`${card.name} gained ${risky ? 3 : 2} health at the campfire.`);
  }
  if (risky && Math.random() < 0.18) {
    card.health = Math.max(1, card.health - 1);
    appendLog(`${card.name} was singed by the hungry fire and lost 1 health.`);
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
  state.eventState.options.splice(index, 1);
  state.eventState.picksRemaining = Math.max((state.eventState.picksRemaining || 1) - 1, 0);
  if (state.eventState.picksRemaining > 0 && state.eventState.options.length) {
    render();
    return;
  }
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
  if (state.eventState.ritual === "echo") {
    donor.sigils = donor.sigils.filter((entry) => entry !== sigil);
    appendLog(`${receiver.name} echoed ${sigil} from ${donor.name}.`);
  } else {
    state.currentDeck.splice(donorIndex, 1);
    appendLog(`${receiver.name} inherited ${sigil}.`);
  }
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
  if (state.eventState.boon === "fortified") {
    card.health += 1;
  }
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
  base.attack += state.eventState.fusion === "masterwork" ? 2 : 1;
  base.health += state.eventState.fusion === "masterwork" ? 3 : 2;
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
  state.eventState.offers = buildTraderOffers(state.currentDeck[index], state.eventState.haggling);
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
  if (state.eventState.haggling === "lavish") {
    const extra = copyItem(shuffle(getRegionItemPool(getCurrentNode()?.region)).slice(0, 1)[0] || ITEM_DEFS.squirrelBottle);
    state.items.push(extra);
    appendLog(`The trader also tossed in ${extra.name}.`);
  }
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
  renderMapView();
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
  refs.progressText.textContent = node ? getProgressDisplay(node) : "No node";
  refs.saveText.textContent = state.saveStatus;
  refs.screenTitle.textContent = state.currentScreen || "Battle";
  refs.screenSubtitle.textContent = getScreenSubtitle(node);
}

function getProgressDisplay(node) {
  if (!node) {
    return "No node";
  }
  if (node.type === "BOSS") {
    return "Boss";
  }
  if (node.type === "EPIC_BATTLE") {
    return "Epic";
  }
  return `Stop ${node.regionPosition + 1}`;
}

function getScreenSubtitle(node) {
  if (state.mode === "battle" && node) {
    if (node.type === "BOSS") {
      return `${getBossDisplayName()} in ${node.region}, phase ${state.battle.bossPhase}.`;
    }
    if (node.type === "EPIC_BATTLE") {
      return `Optional elite fight in ${node.region} for a premium reward.`;
    }
    return `Battle in ${node.region}.`;
  }
  if (state.mode === "reward") return "Take one card and strengthen the run.";
  if (state.mode === "map") return "Follow a highlighted route. Reachable nodes are the only ones you can enter.";
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
  refs.itemCountText.textContent = String(state.items.length);
  refs.queueCaption.textContent = state.battle.skipEnemyAttackPhase
    ? "Enemy attack is skipped next turn"
    : state.battle.enemyDeck.length > 0
      ? `${state.battle.enemyDeck.length} cards left in enemy deck`
      : "Enemy deck empty";
  renderCombatHud();
  renderTutorialPanel();

  renderLane(refs.enemyQueue, state.battle.enemyQueue, "enemy", null);
  renderLane(refs.enemyBoard, state.battle.enemySlots, "enemy", null);
  renderLane(refs.playerBoard, state.battle.playerSlots, "player", onPlayerSlotClick);
  renderHand();
  renderItems();
}

function renderMapView() {
  const visible = state.mode === "map";
  refs.mapView.classList.toggle("hidden", !visible);
  if (!visible) {
    return;
  }

  normalizeMapLayout(state.map);
  const currentNode = getCurrentNode();
  const reachablePositions = new Set(currentNode?.nextChoices || []);
  const maxColumn = state.map.reduce((max, node) => Math.max(max, node.column || 0), 0);
  const boardWidth = MAP_PADDING_X * 2 + maxColumn * MAP_COLUMN_SPACING + MAP_NODE_WIDTH;
  const boardHeight = MAP_PADDING_Y * 2 + (MAP_LANE_COUNT - 1) * MAP_LANE_SPACING + MAP_NODE_HEIGHT;

  refs.mapBoard.style.width = `${boardWidth}px`;
  refs.mapBoard.style.height = `${boardHeight}px`;
  refs.mapLinks.setAttribute("viewBox", `0 0 ${boardWidth} ${boardHeight}`);
  refs.mapLinks.setAttribute("width", String(boardWidth));
  refs.mapLinks.setAttribute("height", String(boardHeight));
  refs.mapLinks.innerHTML = "";
  refs.mapRegions.innerHTML = "";
  refs.mapNodes.innerHTML = "";

  renderMapRegions(boardHeight);
  renderMapConnections(currentNode, reachablePositions);
  renderMapNodes(currentNode, reachablePositions);
  renderMapSummary(currentNode, reachablePositions);
  syncMapViewport(currentNode);
}

function renderMapSummary(currentNode, reachablePositions) {
  if (!currentNode) {
    refs.mapSummary.innerHTML = `<p class="choice-copy">No route remains.</p>`;
    refs.mapLegend.innerHTML = "";
    return;
  }

  const choices = [...reachablePositions].map(findNodeByIndex).filter(Boolean);
  const currentLabel = getNodeDisplayName(currentNode.type);
  refs.mapSummary.innerHTML = choices.length
    ? `<strong>${escapeHtml(`${currentNode.region} ${currentLabel}`)}</strong><span class="choice-copy">Highlighted nodes are reachable next. Scroll ahead to compare routes before you commit.</span>`
    : `<strong>${escapeHtml(`${currentNode.region} ${currentLabel}`)}</strong><span class="choice-copy">No further paths remain in this run.</span>`;

  refs.mapLegend.innerHTML = [
    `<span class="map-legend-chip current">Current</span>`,
    `<span class="map-legend-chip reachable">Reachable</span>`,
    `<span class="map-legend-chip completed">Cleared</span>`,
    `<span class="map-legend-chip locked">Future</span>`
  ].join("");

  if (!choices.length) {
    const button = document.createElement("button");
    button.className = "primary-button map-reset-button";
    button.type = "button";
    button.textContent = "Start New Run";
    button.addEventListener("click", startNewRun);
    refs.mapSummary.appendChild(button);
  }
}

function renderMapRegions(boardHeight) {
  REGIONS.forEach((region) => {
    const regionNodes = state.map.filter((node) => node.region === region);
    if (!regionNodes.length) {
      return;
    }
    const minColumn = Math.min(...regionNodes.map((node) => node.column));
    const maxColumn = Math.max(...regionNodes.map((node) => node.column));
    const marker = document.createElement("div");
    marker.className = "map-region-marker";
    marker.style.left = `${MAP_PADDING_X + minColumn * MAP_COLUMN_SPACING - 18}px`;
    marker.style.width = `${(maxColumn - minColumn + 1) * MAP_COLUMN_SPACING + 36}px`;
    marker.innerHTML = `<span class="map-region-label">${escapeHtml(region)}</span>`;
    refs.mapRegions.appendChild(marker);

    if (region !== REGIONS[REGIONS.length - 1]) {
      const divider = document.createElement("div");
      divider.className = "map-region-divider";
      divider.style.left = `${MAP_PADDING_X + (maxColumn + 0.5) * MAP_COLUMN_SPACING}px`;
      divider.style.height = `${boardHeight - 30}px`;
      refs.mapRegions.appendChild(divider);
    }
  });
}

function renderMapConnections(currentNode, reachablePositions) {
  state.map.forEach((node) => {
    node.nextChoices.forEach((nextPosition) => {
      const target = findNodeByIndex(nextPosition);
      if (!target) {
        return;
      }
      const start = getMapNodePoint(node, "end");
      const end = getMapNodePoint(target, "start");
      const dx = Math.max((end.x - start.x) * 0.45, 22);
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", `M ${start.x} ${start.y} C ${start.x + dx} ${start.y}, ${end.x - dx} ${end.y}, ${end.x} ${end.y}`);
      path.setAttribute("class", getMapLinkClass(node, target, currentNode, reachablePositions));
      refs.mapLinks.appendChild(path);
    });
  });
}

function getMapLinkClass(node, target, currentNode, reachablePositions) {
  const classes = ["map-link"];
  if (node.completed && target.visited) {
    classes.push("traveled");
  } else if (currentNode && node.position === currentNode.position && reachablePositions.has(target.position)) {
    classes.push("reachable");
  } else if (target.completed || node.completed) {
    classes.push("faded");
  }
  return classes.join(" ");
}

function renderMapNodes(currentNode, reachablePositions) {
  state.map.forEach((node) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = getMapNodeClasses(node, currentNode, reachablePositions);
    const point = getMapNodePoint(node);
    button.style.left = `${point.x - MAP_NODE_WIDTH / 2}px`;
    button.style.top = `${point.y - MAP_NODE_HEIGHT / 2}px`;
    const reachable = reachablePositions.has(node.position);
    button.tabIndex = reachable ? 0 : -1;
    button.setAttribute("aria-disabled", String(!reachable));
    button.innerHTML = [
      `<span class="map-node-type">${escapeHtml(getNodeDisplayName(node.type))}</span>`,
      `<strong class="map-node-region">${escapeHtml(node.region)}</strong>`,
      `<span class="map-node-copy">${escapeHtml(getNodeSummary(node.type, node.region))}</span>`
    ].join("");
    button.setAttribute("aria-label", `${getNodeDisplayName(node.type)} in ${node.region}`);
    if (reachable) {
      button.addEventListener("click", () => chooseMapNode(node.position));
    }
    refs.mapNodes.appendChild(button);
  });
}

function getMapNodeClasses(node, currentNode, reachablePositions) {
  const classes = ["map-node"];
  classes.push(`type-${node.type.toLowerCase()}`);
  if (node.completed) {
    classes.push("completed");
  } else if (node.visited) {
    classes.push("visited");
  }
  if (currentNode && node.position === currentNode.position) {
    classes.push("current");
  } else if (reachablePositions.has(node.position)) {
    classes.push("reachable");
  } else if (node.completed || node.visited) {
    classes.push("past");
  } else {
    classes.push("locked");
  }
  return classes.join(" ");
}

function getMapNodePoint(node, edge = "center") {
  const centerX = MAP_PADDING_X + (node.column || 0) * MAP_COLUMN_SPACING + MAP_NODE_WIDTH / 2;
  const centerY = MAP_PADDING_Y + (node.lane || 0) * MAP_LANE_SPACING + MAP_NODE_HEIGHT / 2;
  if (edge === "start") {
    return { x: centerX - MAP_NODE_WIDTH / 2 + 8, y: centerY };
  }
  if (edge === "end") {
    return { x: centerX + MAP_NODE_WIDTH / 2 - 8, y: centerY };
  }
  return { x: centerX, y: centerY };
}

function syncMapViewport(currentNode) {
  if (!currentNode || !refs.mapScroll) {
    return;
  }
  const focusKey = `${state.currentNodeIndex}:${state.mode}`;
  if (uiState.mapFocusKey === focusKey) {
    return;
  }
  uiState.mapFocusKey = focusKey;
  window.requestAnimationFrame(() => {
    const targetLeft = Math.max(0, MAP_PADDING_X + currentNode.column * MAP_COLUMN_SPACING - refs.mapScroll.clientWidth * 0.22);
    refs.mapScroll.scrollTo({ left: targetLeft, behavior: "auto" });
  });
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

function renderTutorialPanel() {
  const visible = shouldShowTutorialPanel();
  refs.tutorialPanel.classList.toggle("hidden", !visible);
  if (!visible) {
    refs.tutorialPanel.innerHTML = "";
    return;
  }

  refs.tutorialPanel.innerHTML = `
    <div class="tutorial-card tutorial-card-slim">
      <div class="section-head">
        <h3>Battle Basics</h3>
        <button id="dismiss-tutorial-button" class="ghost-button" type="button">Hide</button>
      </div>
      <div class="tutorial-grid">
        <div class="tutorial-tip"><strong>Draw</strong><span>Each turn starts with Deck or Squirrel.</span></div>
        <div class="tutorial-tip"><strong>Pay</strong><span>Blood cards need sacrifices. Bone cards spend bones.</span></div>
        <div class="tutorial-tip"><strong>Read</strong><span>Lane badges show incoming pressure and queue entry.</span></div>
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

function getEncounterIdentityText() {
  if (state.mode !== "battle") {
    return { short: "Run Planning", long: "" };
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
  if (state.battle.encounterName) {
    return {
      short: state.battle.encounterName,
      long: state.battle.encounterDescription || "Watch the queue and lean into the region's rhythm."
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
    empty.textContent = "No items ready.";
    refs.itemBar.appendChild(empty);
    return;
  }

  state.items.forEach((item) => {
    const button = document.createElement("button");
    button.className = "item-button";
    button.innerHTML = `<span class="item-button-name">${escapeHtml(item.name)}</span><span class="item-button-copy">${escapeHtml(item.description)}</span>`;
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

  if (state.mode === "campfire") {
    renderCampfireChoices();
    return;
  }

  if (state.mode === "backpack") {
    refs.choiceSummary.innerHTML = `<p class="choice-copy">${escapeHtml(state.eventState.description || "Pick one item to carry into future battles.")} ${escapeHtml((state.eventState.picksRemaining || 1) > 1 ? `${state.eventState.picksRemaining} picks remain.` : "")}</p>`;
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
    refs.choiceSummary.innerHTML = `<p class="choice-copy">${escapeHtml(state.eventState.description || "Choose one card to improve.")}</p>`;
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
  const risky = state.eventState.variant === "hungry";
  refs.choiceSummary.innerHTML = `<p class="choice-copy">Warm the ${escapeHtml(card ? card.name : "card")}. ${escapeHtml(state.eventState.description || "")}</p>`;
  refs.choiceActions.appendChild(createActionChoice("Increase Power", risky ? "+2 attack, may be singed" : "+1 attack", () => applyCampfireBuff("power")));
  refs.choiceActions.appendChild(createActionChoice("Increase Health", risky ? "+3 health, may be singed" : "+2 health", () => applyCampfireBuff("health")));
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
    refs.choiceSummary.innerHTML = `<p class="choice-copy">${escapeHtml(state.eventState.description || "Choose a donor card.")}</p>`;
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
    refs.choiceSummary.innerHTML = `<p class="choice-copy">${escapeHtml(state.eventState.description || "Choose a sigil stone to carve into a card.")}</p>`;
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

  refs.choiceSummary.innerHTML = `<p class="choice-copy">${escapeHtml(state.eventState.description || "Choose a matching pair to merge into one stronger card.")}</p>`;
  pairs.forEach((pair, index) => {
    const first = state.currentDeck[pair.indexes[0]];
    const second = state.currentDeck[pair.indexes[1]];
    refs.choiceActions.appendChild(createActionChoice(pair.name, `${first.attack}/${first.health} + ${second.attack}/${second.health}`, () => chooseMergePair(index)));
  });
}

function renderTraderChoices() {
  if (state.eventState.step === "chooseSacrifice") {
    refs.choiceSummary.innerHTML = `<p class="choice-copy">${escapeHtml(state.eventState.description || "Choose one card to trade away.")}</p>`;
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

function getNodeSummary(type, region = "") {
  if (type === "EPIC_BATTLE") {
    return "Optional elite encounter before the boss with a premium three-card reward.";
  }
  if (type === "BATTLE" && region === "Wetlands") {
    return "Expect awkward water lanes and airborne pressure.";
  }
  if (type === "BATTLE" && region === "Snowline") {
    return "Late enemies carry heavier sigils and stronger stats.";
  }
  return NODE_META[type]?.summary || "Continue the run.";
}

function renderRunInfo() {
  const bossText = state.mode === "battle" && state.battle.bossType ? ` | Boss phase ${state.battle.bossPhase}` : "";
  const encounter = getEncounterIdentityText();
  refs.runText.innerHTML = `
    <strong>${escapeHtml(`Round ${state.currentRound} | Battles won ${state.battlesWon}`)}</strong><br>
    ${escapeHtml(`Deck size ${state.currentDeck.length} | Items ${state.items.length}${bossText}`)}<br>
    ${escapeHtml(`Starter boon ${getStarterUnlockLabel(state.meta?.activeStarterKey || "classic")} | Unlocked ${state.meta?.unlockedStarterKeys?.length || 1}`)}<br>
    ${escapeHtml(`Bosses cleared ${state.meta?.completedBosses || 0} | Runs cleared ${state.meta?.completedRuns || 0}`)}<br>
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
