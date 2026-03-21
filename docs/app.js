const starterDeck = [
  createCard("Stoat", 1, 3, 1, "blood", ["Double Strike"]),
  createCard("Bullfrog", 1, 2, 1, "blood", ["Mighty Leap"]),
  createCard("Adder", 1, 1, 1, "blood", ["Touch of Death"]),
  createCard("Wolf Cub", 1, 1, 1, "blood", ["Fledgling"]),
  createCard("Coyote", 2, 1, 4, "bones", []),
  createCard("Cat", 0, 1, 1, "blood", ["Many Lives"]),
  createCard("Raven", 2, 3, 2, "blood", ["Airborne"]),
  createCard("Cockroach", 1, 1, 4, "bones", ["Unkillable"])
];

const enemyDeckTemplate = [
  createCard("Skink", 1, 2, 1, "blood", []),
  createCard("Wolf", 3, 2, 2, "blood", []),
  createCard("Mole", 0, 4, 1, "blood", ["Burrower"]),
  createCard("Raven", 2, 3, 2, "blood", ["Airborne"]),
  createCard("Coyote", 2, 1, 4, "bones", []),
  createCard("Bullfrog", 1, 2, 1, "blood", ["Mighty Leap"])
];

const state = {
  run: 1,
  battlesWon: 0,
  playerDamage: 0,
  enemyDamage: 0,
  playerBones: 0,
  hand: [],
  playerDeck: [],
  enemyDeck: [],
  playerSlots: new Array(4).fill(null),
  enemySlots: new Array(4).fill(null),
  enemyQueue: new Array(4).fill(null),
  selectedHandIndex: null,
  selectedSacrificeIndexes: [],
  log: []
};

const refs = {
  scaleText: document.getElementById("scale-text"),
  bonesText: document.getElementById("bones-text"),
  selectionText: document.getElementById("selection-text"),
  runText: document.getElementById("run-text"),
  queueCaption: document.getElementById("queue-caption"),
  enemyQueue: document.getElementById("enemy-queue"),
  enemyBoard: document.getElementById("enemy-board"),
  playerBoard: document.getElementById("player-board"),
  handStrip: document.getElementById("hand-strip"),
  logPanel: document.getElementById("log-panel"),
  endTurnButton: document.getElementById("end-turn-button"),
  newRunButton: document.getElementById("new-run-button")
};

refs.endTurnButton.addEventListener("click", endTurn);
refs.newRunButton.addEventListener("click", startNewRun);

startNewRun();

function startNewRun() {
  state.run = 1;
  state.battlesWon = 0;
  startBattle();
  appendLog("Started a new browser run.");
}

function startBattle() {
  state.playerDamage = 0;
  state.enemyDamage = 0;
  state.playerBones = 0;
  state.hand = [createCard("Squirrel", 0, 1, 0, "blood", [])];
  state.playerDeck = shuffle(starterDeck.map(copyCard));
  state.enemyDeck = shuffle(enemyDeckTemplate.map(copyCard));
  state.playerSlots = new Array(4).fill(null);
  state.enemySlots = new Array(4).fill(null);
  state.enemyQueue = new Array(4).fill(null);
  state.selectedHandIndex = null;
  state.selectedSacrificeIndexes = [];
  state.log = [];

  drawCardFromDeck();
  drawCardFromDeck();
  drawCardFromDeck();
  fillEnemyQueue();
  appendLog("Battle started. Pick a card from your hand.");
  render();
}

function createCard(name, attack, health, cost, costType, sigils) {
  return { name, attack, health, cost, costType, sigils: [...sigils] };
}

function copyCard(card) {
  return createCard(card.name, card.attack, card.health, card.cost, card.costType, card.sigils);
}

function shuffle(cards) {
  const deck = [...cards];
  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function drawCardFromDeck() {
  if (state.playerDeck.length > 0) {
    state.hand.push(state.playerDeck.shift());
  }
}

function fillEnemyQueue() {
  for (let i = 0; i < state.enemyQueue.length; i += 1) {
    if (!state.enemyQueue[i] && state.enemyDeck.length > 0) {
      const card = state.enemyDeck.shift();
      state.enemyQueue[i] = card;
      appendLog(`Enemy queued ${card.name}.`);
    }
  }
}

function render() {
  refs.scaleText.textContent = `${state.playerDamage} | ${state.enemyDamage}`;
  refs.bonesText.textContent = String(state.playerBones);
  refs.runText.textContent = `Run ${state.run} | Battles won ${state.battlesWon} | Deck ${state.playerDeck.length} | Hand ${state.hand.length}`;
  refs.queueCaption.textContent = state.enemyDeck.length > 0 ? `${state.enemyDeck.length} cards left in enemy deck` : "Enemy deck empty";

  const selectedCard = state.selectedHandIndex === null ? null : state.hand[state.selectedHandIndex];
  refs.selectionText.textContent = selectedCard ? `${selectedCard.name} selected` : "None";

  renderLane(refs.enemyQueue, state.enemyQueue, "enemy", null);
  renderLane(refs.enemyBoard, state.enemySlots, "enemy", null);
  renderLane(refs.playerBoard, state.playerSlots, "player", onPlayerSlotClick);
  renderHand();
  renderLog();
}

function renderLane(container, slots, side, onClick) {
  container.innerHTML = "";
  slots.forEach((card, index) => {
    const button = document.createElement("button");
    button.className = `slot-card ${side} ${card ? "" : "empty"} ${onClick ? "selectable" : ""}`;

    if (side === "player" && canPlaceOnSlot(index)) {
      button.classList.add("targetable");
    }

    if (side === "player" && state.selectedSacrificeIndexes.includes(index)) {
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
  state.hand.forEach((card, index) => {
    const button = document.createElement("button");
    button.className = "hand-card selectable";
    if (state.selectedHandIndex === index) {
      button.classList.add("selected");
    }
    button.innerHTML = formatCardMarkup(card);
    button.addEventListener("click", () => {
      state.selectedHandIndex = index;
      state.selectedSacrificeIndexes = [];
      appendLog(`Selected ${card.name}.`);
      render();
    });
    refs.handStrip.appendChild(button);
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
  const sigils = card.sigils.length > 0 ? card.sigils.join(", ") : "None";
  const costLabel = `${card.cost} ${card.costType}`;
  return [
    `<span class="card-name">${escapeHtml(card.name)}</span>`,
    `<span class="card-stats">Cost ${escapeHtml(costLabel)} | ATK ${card.attack} | HP ${card.health}</span>`,
    `<span class="card-sigils">Sigils: ${escapeHtml(sigils)}</span>`
  ].join("");
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function onPlayerSlotClick(index) {
  const selectedCard = state.selectedHandIndex === null ? null : state.hand[state.selectedHandIndex];
  if (!selectedCard) {
    if (state.playerSlots[index]) {
      toggleSacrifice(index);
    }
    return;
  }

  if (selectedCard.costType === "bones") {
    if (state.playerSlots[index]) {
      appendLog("That lane is occupied.");
      return;
    }
    if (state.playerBones < selectedCard.cost) {
      appendLog(`You need ${selectedCard.cost} bones for ${selectedCard.name}.`);
      return;
    }
    state.playerBones -= selectedCard.cost;
    state.playerSlots[index] = selectedCard;
    state.hand.splice(state.selectedHandIndex, 1);
    state.selectedHandIndex = null;
    appendLog(`Played ${selectedCard.name} for ${selectedCard.cost} bones.`);
    render();
    return;
  }

  if (state.playerSlots[index] && !state.selectedSacrificeIndexes.includes(index)) {
    toggleSacrifice(index);
    return;
  }

  if (state.playerSlots[index]) {
    appendLog("That lane is occupied.");
    return;
  }

  const required = selectedCard.cost;
  if (required > 0 && state.selectedSacrificeIndexes.length < required) {
    appendLog(`Select ${required} sacrifice${required > 1 ? "s" : ""} first.`);
    return;
  }

  consumeSacrifices();
  state.playerSlots[index] = selectedCard;
  state.hand.splice(state.selectedHandIndex, 1);
  state.selectedHandIndex = null;
  appendLog(`Played ${selectedCard.name}.`);
  render();
}

function toggleSacrifice(index) {
  const selectedCard = state.selectedHandIndex === null ? null : state.hand[state.selectedHandIndex];
  if (!selectedCard || selectedCard.costType !== "blood" || selectedCard.cost === 0) {
    appendLog("No sacrifices needed.");
    return;
  }

  if (!state.playerSlots[index]) {
    return;
  }

  const existing = state.selectedSacrificeIndexes.indexOf(index);
  if (existing >= 0) {
    state.selectedSacrificeIndexes.splice(existing, 1);
    appendLog(`Removed ${state.playerSlots[index].name} from sacrifices.`);
  } else if (state.selectedSacrificeIndexes.length < selectedCard.cost) {
    state.selectedSacrificeIndexes.push(index);
    appendLog(`Marked ${state.playerSlots[index].name} for sacrifice.`);
  } else {
    appendLog("Enough sacrifices already selected.");
  }
  render();
}

function consumeSacrifices() {
  const sacrificeIndexes = [...state.selectedSacrificeIndexes].sort((a, b) => b - a);
  sacrificeIndexes.forEach((index) => {
    const card = state.playerSlots[index];
    if (!card) {
      return;
    }
    if (!card.sigils.includes("Many Lives")) {
      state.playerSlots[index] = null;
      state.playerBones += 1;
    }
    appendLog(`Sacrificed ${card.name}.`);
  });
  state.selectedSacrificeIndexes = [];
}

function canPlaceOnSlot(index) {
  const selectedCard = state.selectedHandIndex === null ? null : state.hand[state.selectedHandIndex];
  if (!selectedCard) {
    return false;
  }
  if (state.playerSlots[index]) {
    return false;
  }
  if (selectedCard.costType === "bones") {
    return state.playerBones >= selectedCard.cost;
  }
  return state.selectedSacrificeIndexes.length >= selectedCard.cost;
}

function endTurn() {
  appendLog("Player attacks.");
  for (let lane = 0; lane < 4; lane += 1) {
    attackLane(state.playerSlots, state.enemySlots, lane, true);
  }
  if (checkBattleEnd()) {
    render();
    return;
  }

  appendLog("Enemy attacks.");
  for (let lane = 0; lane < 4; lane += 1) {
    attackLane(state.enemySlots, state.playerSlots, lane, false);
  }
  if (checkBattleEnd()) {
    render();
    return;
  }

  for (let lane = 0; lane < 4; lane += 1) {
    if (!state.enemySlots[lane] && state.enemyQueue[lane]) {
      state.enemySlots[lane] = state.enemyQueue[lane];
      state.enemyQueue[lane] = null;
    }
  }
  fillEnemyQueue();

  const squirrelBias = state.hand.some((card) => card.name === "Squirrel");
  if (!squirrelBias || Math.random() > 0.35) {
    drawCardFromDeck();
  } else {
    state.hand.push(createCard("Squirrel", 0, 1, 0, "blood", []));
  }

  state.selectedHandIndex = null;
  state.selectedSacrificeIndexes = [];
  render();
}

function attackLane(attackingRow, defendingRow, lane, isPlayer) {
  const attacker = attackingRow[lane];
  if (!attacker) {
    return;
  }

  const defender = defendingRow[lane];
  if (defender) {
    defender.health -= attacker.attack;
    appendLog(`${attacker.name} hit ${defender.name} for ${attacker.attack}.`);
    if (defender.health <= 0) {
      defendingRow[lane] = null;
      if (!isPlayer) {
        state.playerBones += 1;
      }
      appendLog(`${defender.name} was destroyed.`);
    }
    return;
  }

  if (isPlayer) {
    state.playerDamage += attacker.attack;
    appendLog(`${attacker.name} struck the scale for ${attacker.attack}.`);
  } else {
    state.enemyDamage += attacker.attack;
    appendLog(`${attacker.name} dealt ${attacker.attack} direct damage.`);
  }
}

function checkBattleEnd() {
  if (state.playerDamage >= 5) {
    state.battlesWon += 1;
    state.run += 1;
    appendLog("Battle won. Starting the next one.");
    const carryBones = state.playerBones;
    startBattle();
    state.playerBones = carryBones;
    return true;
  }

  if (state.enemyDamage >= 5) {
    appendLog("You lost the battle. Starting a new run.");
    startNewRun();
    return true;
  }

  return false;
}

function appendLog(message) {
  state.log.push(message);
  if (state.log.length > 16) {
    state.log.shift();
  }
}
