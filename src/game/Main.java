package game;

import javafx.application.Application;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.ScrollPane;
import javafx.scene.layout.*;
import javafx.stage.Stage;
import javafx.animation.PauseTransition;
import javafx.util.Duration;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;


public class Main extends Application {
    private enum BossType {
        NONE,
        PROSPECTOR,
        ANGLER,
        TRAPPER_TRADER
    }

    // Battle state
    int playerDamage = 0; // package-visible for sigil helpers if necessary
    int enemyDamage = 0;
    int playerBones = 0;
    private Label scaleLabel = new Label("Scale: 0 | 0");
    private Label bonesLabel = new Label("Bones: 0");
    private Label itemsLabel = new Label("Items: none");
    private Label runInfoLabel = new Label();
    private Label messageLabel = new Label();
    private Card selectedHandCard = null;
    private List<Card> hand = new ArrayList<>();
    private List<Card> playerDeck = new ArrayList<>();
    private List<Card> enemyDeck = new ArrayList<>();
    private BoardSlot[] playerSlots = new BoardSlot[4];
    private BoardSlot[] enemySlots = new BoardSlot[4];
    private BoardSlot[] enemyQueue = new BoardSlot[4];
    private HBox handLayout = new HBox(10);
    private GridPane boardGrid = new GridPane();
    private List<BoardSlot> selectedSacrifices = new ArrayList<>();
    private boolean skipEnemyAttackPhase = false;
    private boolean gameOver = false;
    private final Random random = new Random();
    private BossType currentBossType = BossType.NONE;
    private int bossPhase = 1;
    private boolean anglerHookUsed = false;

    // Roguelike tracking
    private GameRun currentRun = null;
    private Stage primaryStage = null;


    @Override
    public void start(Stage stage) {
        this.primaryStage = stage;
        startNewRun();
    }

    /**
     * Initializes a new roguelike run with a fresh deck and generated map.
     */
    private void startNewRun() {
        // Create starter deck (Squirrels are only available as a free hand card each battle)
        List<Card> starterDeck = new ArrayList<>();
        starterDeck.add(new Card("Stoat", 1, 3, 1, false, Sigil.DOUBLE_STRIKE));
        starterDeck.add(new Card("Bullfrog", 1, 2, 1, false, Sigil.MIGHTY_LEAP));
        starterDeck.add(new Card("Adder", 1, 1, 1, false, Sigil.AIRBORNE));
        starterDeck.add(new Card("Wolf Cub", 1, 1, 1, false, Sigil.FLEDGLING));
        starterDeck.add(new Card("Coyote", 2, 1, 4, Card.CostType.BONES, false));
        starterDeck.add(new Card("Cat", 0, 1, 1, false, Sigil.MANY_LIVES));
        starterDeck.add(new Card("Raven", 2, 3, 2, false, Sigil.AIRBORNE));
        starterDeck.add(new Card("Cockroach", 1, 1, 4, Card.CostType.BONES, false, Sigil.UNKILLABLE));

        // Create new run with map - this ensures fresh deck for each new game
        Map gameMap = new Map();
        currentRun = new GameRun(starterDeck, gameMap);
        currentRun.addItem(BattleItem.SQUIRREL_BOTTLE);
        currentRun.moveToNode(0);
        System.out.println("Starting new run: " + currentRun);
        enterNode(currentRun.getCurrentNode());
    }

    /**
     * Starts a battle for the given map node.
     */
    private void startBattle(MapNode node) {
        // Reset battle state
        playerDamage = 0;
        enemyDamage = 0;
        playerBones = 0;
        skipEnemyAttackPhase = false;
        anglerHookUsed = false;
        gameOver = false;
        hand.clear();
        playerDeck.clear();
        enemyDeck.clear();
        selectedSacrifices.clear();
        
        // Re-enable UI (was disabled when last battle ended)
        boardGrid.setDisable(false);
        handLayout.setDisable(false);

        // Initialize player deck from GameRun
        playerDeck.addAll(currentRun.getCurrentDeck());
        hand.add(new Card("Squirrel", 0, 1, 0, true));

        // Shuffle Deck
        Collections.shuffle(playerDeck);
        // Draw 3 cards for starting hand
        for (int i = 0; i < 3; i++) {
            if (!playerDeck.isEmpty()) {
                hand.add(playerDeck.remove(0));
            }
        }

        currentBossType = resolveBossType(node);
        bossPhase = 1;

        // Get enemy deck with difficulty scaling based on node index
        enemyDeck.addAll(getEncounterDeck(node));

        // Create board slots
        for (int i = 0; i < 4; i++) {
            playerSlots[i] = new BoardSlot(true);
            enemySlots[i] = new BoardSlot(false);
            enemyQueue[i] = new BoardSlot(false);
        }

        drawBoard();
        drawHand();

        // Fill enemy queue before first turn
        for (int i = 0; i < 4; i++) {
            if (enemyQueue[i].isEmpty() && !enemyDeck.isEmpty()) {
                Card card = enemyDeck.remove(0);
                enemyQueue[i].placeCard(card);
                logMessage("Enemy queues: " + card.getName());
            }
        }
        drawBoard();

        // Update run info display
        updateRunInfoDisplay();
        updateBonesLabel();
        updateItemsLabel();

        Button attackBtn = new Button("End Turn");
        stylePrimaryButton(attackBtn);
        attackBtn.setOnAction(e -> {
            if (gameOver) return;

            messageLabel.setText(""); // Clear log
            performPlayerAttacks();
            drawBoard();

            PauseTransition pause1 = new PauseTransition(Duration.seconds(1));
            pause1.setOnFinished(ev -> {
                if (gameOver) return;

                if (skipEnemyAttackPhase) {
                    skipEnemyAttackPhase = false;
                    logMessage("The enemy attack phase was skipped.");
                } else {
                    performEnemyAttacks();
                }
                drawBoard();

                PauseTransition pause2 = new PauseTransition(Duration.seconds(1));
                pause2.setOnFinished(ev2 -> {
                    if (gameOver) return;

                    enemyTurn();

                    PauseTransition pause3 = new PauseTransition(Duration.seconds(1));
                    pause3.setOnFinished(ev3 -> {
                        if (gameOver) return;

                        drawBoard();
                        promptDraw();
                        logMessage("Your turn");
                    });

                    pause3.play();
                });

                pause2.play();
            });

            pause1.play();
        });

        Label battleTitle = createScreenTitle(node.getType() == MapNode.NodeType.BOSS ? "Boss Battle" : "Battle");
        Label handTitle = createSectionLabel("Your Hand");
        Label itemsTitle = createSectionLabel("Items");
        Label logTitle = createSectionLabel("Turn Log");
        styleStatusLabel(scaleLabel);
        styleStatusLabel(bonesLabel);
        styleStatusLabel(itemsLabel);
        styleStatusLabel(runInfoLabel);
        boardGrid.setStyle("-fx-background-color: rgba(32, 18, 12, 0.65); -fx-background-radius: 22; -fx-padding: 18;");
        handLayout.setPadding(new Insets(8, 0, 0, 0));
        messageLabel.setWrapText(true);
        messageLabel.setStyle("-fx-text-fill: #f3e6cf; -fx-font-size: 13px; -fx-font-family: 'Trebuchet MS';");

        VBox leftPanel = createPanel();
        leftPanel.getChildren().addAll(
                battleTitle,
                runInfoLabel,
                scaleLabel,
                bonesLabel,
                itemsLabel,
                boardGrid,
                itemsTitle,
                createItemBar(),
                handTitle,
                handLayout,
                attackBtn
        );

        VBox rightPanel = createPanel();
        rightPanel.setPrefWidth(280);
        rightPanel.getChildren().addAll(logTitle, messageLabel);

        HBox root = new HBox(20, leftPanel, rightPanel);
        root.setPadding(new Insets(24));
        root.setStyle(appBackgroundStyle());
        HBox.setHgrow(leftPanel, Priority.ALWAYS);
        HBox.setHgrow(rightPanel, Priority.NEVER);

        Scene scene = new Scene(root, 1800, 1200);
        primaryStage.setScene(scene);
        primaryStage.setTitle("Inscryption - Battle");
        primaryStage.setMinWidth(1600);
        primaryStage.setMinHeight(1000);
        primaryStage.show();
    }

    private void enterNode(MapNode node) {
        if (node == null) {
            showRunResults();
            return;
        }

        switch (node.getType()) {
            case BATTLE:
            case BOSS:
                startBattle(node);
                break;
            case CAMPFIRE:
                showCampfireEvent(node);
                break;
            case BACKPACK:
                showBackpackEvent(node);
                break;
            case SIGIL_TRANSFER:
                showSigilTransferEvent(node);
                break;
            default:
                currentRun.markCurrentNodeCompleted();
                showMapSelection();
                break;
        }
    }

    private BossType resolveBossType(MapNode node) {
        if (node == null || node.getType() != MapNode.NodeType.BOSS) {
            return BossType.NONE;
        }

        switch (node.getRegion()) {
            case "Woodlands":
                return BossType.PROSPECTOR;
            case "Wetlands":
                return BossType.ANGLER;
            case "Snowline":
                return BossType.TRAPPER_TRADER;
            default:
                return BossType.NONE;
        }
    }

    private List<Card> getEncounterDeck(MapNode node) {
        if (node != null && node.getType() == MapNode.NodeType.BOSS) {
            return getBossDeck(resolveBossType(node), 1);
        }
        return EnemyDeckPool.getEnemyDeck(currentRun.getCurrentNodeIndex());
    }

    private List<Card> getBossDeck(BossType bossType, int phase) {
        List<Card> deck = new ArrayList<>();
        switch (bossType) {
            case PROSPECTOR:
                if (phase == 1) {
                    deck.add(new Card("Pack Mule", 0, 5, 0, false));
                    deck.add(new Card("Coyote", 2, 1, 4, Card.CostType.BONES, false));
                    deck.add(new Card("Bloodhound", 2, 3, 2, false, Sigil.GUARDIAN));
                    deck.add(new Card("Prospector", 1, 4, 2, false, Sigil.SHARP_QUILLS));
                } else {
                    deck.add(new Card("Bloodhound", 2, 3, 2, false, Sigil.GUARDIAN));
                    deck.add(new Card("Wolf", 3, 2, 2, false));
                    deck.add(new Card("Coyote", 2, 1, 4, Card.CostType.BONES, false));
                    deck.add(new Card("Prospector", 2, 4, 2, false));
                }
                break;
            case ANGLER:
                if (phase == 1) {
                    deck.add(new Card("Kingfisher", 1, 1, 1, false, Sigil.AIRBORNE));
                    deck.add(new Card("Mole", 0, 4, 2, false, Sigil.BURROWER));
                    deck.add(new Card("Angler", 2, 4, 2, false));
                    deck.add(new Card("Raven", 2, 3, 2, false, Sigil.AIRBORNE));
                } else {
                    for (int i = 0; i < 4; i++) {
                        deck.add(new Card("Shark", 4, 2, 0, false));
                    }
                }
                break;
            case TRAPPER_TRADER:
                if (phase == 1) {
                    deck.add(new Card("Leaping Trap", 0, 2, 0, false, Sigil.TOUCH_OF_DEATH));
                    deck.add(new Card("Leaping Trap", 0, 2, 0, false, Sigil.TOUCH_OF_DEATH));
                    deck.add(new Card("Wolf", 3, 2, 2, false));
                    deck.add(new Card("Trapper", 1, 4, 2, false));
                } else {
                    deck.add(new Card("Trader", 2, 4, 2, false));
                    deck.add(new Card("Wolf", 3, 2, 2, false));
                    deck.add(new Card("Mantis God", 2, 2, 3, false, Sigil.TRIFURCATED_STRIKE));
                    deck.add(new Card("Raven", 2, 3, 2, false, Sigil.AIRBORNE));
                }
                break;
            default:
                return EnemyDeckPool.getEnemyDeck(currentRun.getCurrentNodeIndex());
        }
        return deck;
    }

    private void drawBoard() {
        selectedSacrifices.clear();
        boardGrid.getChildren().clear();
        boardGrid.setHgap(10);
        boardGrid.setVgap(10);

        // Row 0: Enemy queue (top row)
        for (int i = 0; i < 4; i++) {
            Button btn = createSlotButton(enemyQueue[i], false);
            boardGrid.add(btn, i, 0);
        }

        // Row 1: Enemy row (middle row)
        for (int i = 0; i < 4; i++) {
            Button btn = createSlotButton(enemySlots[i], false);
            boardGrid.add(btn, i, 1);
        }

        // Row 2: Player row (bottom row)
        for (int i = 0; i < 4; i++) {
            Button btn = createSlotButton(playerSlots[i], true);
            boardGrid.add(btn, i, 2);
        }
    }



    private Button createSlotButton(BoardSlot slot, boolean isPlayerRow) {
        Button btn = new Button();
        btn.setPrefSize(240, 190);
        btn.setWrapText(true);
        styleSlotButton(btn, slot, isPlayerRow);

        if (slot.isEmpty()) {
            btn.setText("");
        } else {
            Card c = slot.getCard();
            btn.setText(formatCardText(c, false));
            if (isPlayerRow) {
                btn.setOnAction(e -> {
                    if (selectedHandCard != null && !selectedSacrifices.contains(slot)) {
                        int required = selectedHandCard.getCost();
                        int selectedValue = getSelectedSacrificeValue();

                        // Only allow sacrifices if the selected card costs blood
                        if (!selectedHandCard.isBloodCost() || required == 0) {
                            logMessage("No sacrifices needed for: " + selectedHandCard.getName());
                            return;
                        }

                        // Only allow up to the required number of sacrifices
                        if (selectedValue >= required) {
                            logMessage("Already selected enough sacrifices for: " + selectedHandCard.getName());
                            return;
                        }

                        selectedSacrifices.add(slot);
                        styleSelectedSacrifice(btn, slot, true);
                        logMessage("Marked for sacrifice: " + slot.getCard().getName() + " (" + getSacrificeValue(slot.getCard()) + " blood).");
                    }
                });
            }
        }

        if (isPlayerRow) {
            btn.setOnAction(e -> {
                if (selectedHandCard != null) {
                    int bloodCost = selectedHandCard.isBloodCost() ? selectedHandCard.getCost() : 0;
                    int selectedValue = getSelectedSacrificeValue();

                    if (selectedHandCard.isBoneCost()) {
                        if (!slot.isEmpty()) {
                            logMessage("That slot is occupied.");
                            return;
                        }
                        if (playerBones < selectedHandCard.getCost()) {
                            logMessage("You need " + selectedHandCard.getCost() + " bones to play " + selectedHandCard.getName() + ".");
                            return;
                        }

                        spendBones(selectedHandCard.getCost());
                        slot.placeCard(selectedHandCard);
                        logMessage("Played " + selectedHandCard.getName() + " for " + selectedHandCard.getCost() + " bones.");
                        handleGuardianResponse(true, getLaneIndex(slot));
                        for (Sigil s : selectedHandCard.getSigils()) {
                            s.onCardPlaced(this, slot);
                        }

                        hand.remove(selectedHandCard);
                        selectedHandCard = null;
                        selectedSacrifices.clear();
                        drawHand();
                        drawBoard();
                    } else if (selectedValue >= bloodCost) {
                        // Clear sacrificed cards
                        for (BoardSlot s : selectedSacrifices) {
                            sacrificeCard(s);
                        }

                        // Place the new card in the clicked slot (even if it was just cleared)
                        slot.placeCard(selectedHandCard);
                        logMessage("Played " + selectedHandCard.getName() + " at slot after sacrifices.");
                        handleGuardianResponse(true, getLaneIndex(slot));
                        // trigger any "on placed" sigils
                        for (Sigil s : selectedHandCard.getSigils()) {
                            s.onCardPlaced(this, slot);
                        }

                        hand.remove(selectedHandCard);
                        selectedHandCard = null;
                        selectedSacrifices.clear();
                        drawHand();
                        drawBoard();
                    } else if (slot.getCard() != null && !selectedSacrifices.contains(slot)) {
                        // This is the block we already edited before: sacrifice logic
                        int required = selectedHandCard.getCost();
                        if (!selectedHandCard.isBloodCost() || required == 0) {
                            logMessage("No sacrifices needed.");
                            return;
                        }
                        if (selectedValue >= required) {
                            logMessage("Already selected enough sacrifices.");
                            return;
                        }

                        selectedSacrifices.add(slot);
                        styleSelectedSacrifice(btn, slot, true);
                        logMessage("Marked for sacrifice: " + slot.getCard().getName() + " (" + getSacrificeValue(slot.getCard()) + " blood).");
                    }
                }
            });
        }
        return btn;
    }


    private void drawHand() {
        handLayout.getChildren().clear();
        handLayout.setSpacing(18);
        for (Card card : hand) {
            Button cardBtn = new Button(formatCardText(card, true));
            cardBtn.setPrefSize(280, 220);
            cardBtn.setWrapText(true);
            styleCardButton(cardBtn);

            cardBtn.setOnAction(e -> {
                selectedHandCard = card;
                logMessage("Selected from hand: " + card.getName());
            });

            handLayout.getChildren().add(cardBtn);
        }
    }

    private void performPlayerAttacks() {
        logMessage("\n--- PLAYER ATTACKS ---");

        // trigger start-of-turn effects for player cards
        for (BoardSlot ps : playerSlots) {
            if (!ps.isEmpty()) {
                for (Sigil s : ps.getCard().getSigils()) {
                    s.onTurnStart(this, ps);
                }
            }
        }

        for (int i = 0; i < 4; i++) {
            BoardSlot playerSlot = playerSlots[i];

            if (!playerSlot.isEmpty()) {
                Card attacker = playerSlot.getCard();

                // run any "before attack" sigils; if one returns true we skip default damage
                boolean skip = false;
                for (Sigil s : attacker.getSigils()) {
                    if (s.onBeforeAttack(this, playerSlot, enemySlots[i])) {
                        skip = true;
                        break;
                    }
                }

                if (!skip) {
                    resolveAttackToLane(playerSlot, i);

                    // run any "after attack" sigils
                    for (Sigil s : attacker.getSigils()) {
                        s.onAfterAttack(this, playerSlot, enemySlots[i]);
                    }
                }
            }
        }
    }

    private void performEnemyAttacks() {
        logMessage("\n--- ENEMY ATTACKS ---");

        // enemy start-of-turn effects
        for (BoardSlot es : enemySlots) {
            if (!es.isEmpty()) {
                for (Sigil s : es.getCard().getSigils()) {
                    s.onTurnStart(this, es);
                }
            }
        }

        for (int i = 0; i < 4; i++) {
            BoardSlot enemySlot = enemySlots[i];

            if (!enemySlot.isEmpty()) {
                Card attacker = enemySlot.getCard();

                boolean skip = false;
                for (Sigil s : attacker.getSigils()) {
                    if (s.onBeforeAttack(this, enemySlot, playerSlots[i])) {
                        skip = true;
                        break;
                    }
                }

                if (!skip) {
                    resolveAttackToLane(enemySlot, i);

                    for (Sigil s : attacker.getSigils()) {
                        s.onAfterAttack(this, enemySlot, playerSlots[i]);
                    }
                }
            }
        }
    }


    private void enemyTurn() {
        if (currentBossType == BossType.ANGLER && bossPhase == 1 && !anglerHookUsed) {
            performAnglerHook();
        }

        // Step 1: Move queue cards up if main enemy row is empty
        for (int i = 0; i < 4; i++) {
            if (enemySlots[i].isEmpty() && !enemyQueue[i].isEmpty()) {
                enemySlots[i].placeCard(enemyQueue[i].getCard());
                enemyQueue[i].clear();
                handleGuardianResponse(false, i);
            }
        }

        // Step 2: Add new cards to queue if empty slots exist
        for (int i = 0; i < 4; i++) {
            if (enemyQueue[i].isEmpty() && !enemyDeck.isEmpty()) {
                Card card = enemyDeck.remove(0);
                enemyQueue[i].placeCard(card);
                logMessage("Enemy queues: " + card.getName());
            }
        }
    }


    void logMessage(String text) { // package-visible so Sigil can call
        System.out.println(text);
        String current = messageLabel.getText();
        messageLabel.setText(current + text + "\n");
    }

    public void resolveAttackToLane(BoardSlot attackerSlot, int laneIndex) {
        if (attackerSlot == null || attackerSlot.isEmpty()) {
            return;
        }

        BoardSlot[] defendingRow = attackerSlot.isPlayerSlot() ? enemySlots : playerSlots;
        BoardSlot defenderSlot = defendingRow[laneIndex];

        if (defenderSlot.isEmpty()) {
            tryMoveBurrower(defendingRow, laneIndex);
            defenderSlot = defendingRow[laneIndex];
        }

        Card attacker = attackerSlot.getCard();
        int attackPower = getEffectiveAttack(attackerSlot);
        if (!defenderSlot.isEmpty()) {
            Card defender = defenderSlot.getCard();
            defender.takeDamage(attackPower);
            if (attackerSlot.isPlayerSlot()) {
                logMessage(attacker.getName() + " attacks " + defender.getName() + " for " + attackPower);
            } else {
                logMessage("Enemy " + attacker.getName() + " attacks " + defender.getName() + " for " + attackPower);
            }

            for (Sigil s : defender.getSigils()) {
                s.onDamaged(this, defenderSlot, attacker);
            }

            if (defender.getHealth() <= 0) {
                logMessage(defender.getName() + " dies.");
                destroyCardInSlot(defenderSlot);
            }
        } else if (attackerSlot.isPlayerSlot()) {
            logMessage(attacker.getName() + " deals " + attackPower + " direct damage to enemy!");
            playerDamage += attackPower;
            updateScale();
        } else {
            logMessage("Enemy " + attacker.getName() + " deals " + attackPower + " direct damage to player!");
            enemyDamage += attackPower;
            updateScale();
        }
    }

    public int getEffectiveAttack(BoardSlot slot) {
        if (slot == null || slot.isEmpty()) {
            return 0;
        }

        int attack = slot.getCard().getAttack();
        BoardSlot[] allies = slot.isPlayerSlot() ? playerSlots : enemySlots;
        int lane = getLaneIndex(slot);

        if (lane > 0 && !allies[lane - 1].isEmpty() && allies[lane - 1].getCard().hasSigil(Sigil.LEADER)) {
            attack += 1;
        }
        if (lane < allies.length - 1 && !allies[lane + 1].isEmpty() && allies[lane + 1].getCard().hasSigil(Sigil.LEADER)) {
            attack += 1;
        }

        BoardSlot[] opponents = slot.isPlayerSlot() ? enemySlots : playerSlots;
        if (lane >= 0 && lane < opponents.length && !opponents[lane].isEmpty() && opponents[lane].getCard().hasSigil(Sigil.STINKY)) {
            attack -= 1;
        }

        return Math.max(0, attack);
    }

    public int getLaneIndex(BoardSlot slot) {
        if (slot == null) {
            return -1;
        }

        BoardSlot[] row = slot.isPlayerSlot() ? playerSlots : enemySlots;
        for (int i = 0; i < row.length; i++) {
            if (row[i] == slot) {
                return i;
            }
        }
        return -1;
    }

    private void tryMoveBurrower(BoardSlot[] defendingRow, int laneIndex) {
        for (int i = 0; i < defendingRow.length; i++) {
            if (i == laneIndex || defendingRow[i].isEmpty()) {
                continue;
            }
            Card candidate = defendingRow[i].getCard();
            if (candidate.hasSigil(Sigil.BURROWER)) {
                defendingRow[laneIndex].placeCard(candidate);
                defendingRow[i].clear();
                logMessage(candidate.getName() + " burrows over to block the attack.");
                return;
            }
        }
    }

    public void handleGuardianResponse(boolean playedByPlayer, int laneIndex) {
        BoardSlot[] guardians = playedByPlayer ? enemySlots : playerSlots;
        BoardSlot target = guardians[laneIndex];
        if (!target.isEmpty()) {
            return;
        }

        for (int i = 0; i < guardians.length; i++) {
            if (i == laneIndex || guardians[i].isEmpty()) {
                continue;
            }
            Card candidate = guardians[i].getCard();
            if (candidate.hasSigil(Sigil.GUARDIAN)) {
                target.placeCard(candidate);
                guardians[i].clear();
                logMessage(candidate.getName() + " leaps over as a guardian.");
                return;
            }
        }
    }

    /**
     * Helper used by sigils such as Double Strike to apply an additional hit
     * using the game's normal damage resolution logic.  The method simply
     * duplicates what performPlayerAttacks/performEnemyAttacks would do for a
     * second strike.
     */
    public void resolveExtraAttack(BoardSlot attackerSlot, BoardSlot defenderSlot) {
        Card attacker = attackerSlot.getCard();
        int attackPower = getEffectiveAttack(attackerSlot);
        if (attackerSlot.isPlayerSlot()) {
            // player is attacking
            if (defenderSlot == null || defenderSlot.isEmpty()) {
                logMessage(attacker.getName() + " deals " + attackPower + " extra direct damage!");
                dealPlayerDamage(attackPower);
            } else {
                Card defender = defenderSlot.getCard();
                defender.takeDamage(attackPower);
                logMessage(attacker.getName() + " strikes again for " + attackPower);
                for (Sigil s : defender.getSigils()) {
                    s.onDamaged(this, defenderSlot, attacker);
                }
                if (defender.getHealth() <= 0) {
                    logMessage(defender.getName() + " dies.");
                    destroyCardInSlot(defenderSlot);
                }
            }
        } else {
            // enemy is attacking
            if (defenderSlot == null || defenderSlot.isEmpty()) {
                logMessage("Enemy " + attacker.getName() + " deals " + attackPower + " extra direct damage!");
                dealEnemyDamage(attackPower);
            } else {
                Card defender = defenderSlot.getCard();
                defender.takeDamage(attackPower);
                logMessage("Enemy " + attacker.getName() + " strikes again for " + attackPower);
                for (Sigil s : defender.getSigils()) {
                    s.onDamaged(this, defenderSlot, attacker);
                }
                if (defender.getHealth() <= 0) {
                    logMessage(defender.getName() + " dies.");
                    destroyCardInSlot(defenderSlot);
                }
            }
        }
    }

    /**
     * Remove a specific card from whatever slot it's occupying (player or
     * enemy).  Used by sigil code that kills/destroys cards indirectly.
     */
    public void removeCardFromBoard(Card card) {
        for (BoardSlot s : playerSlots) {
            if (!s.isEmpty() && s.getCard() == card) {
                destroyCardInSlot(s);
                return;
            }
        }
        for (BoardSlot s : enemySlots) {
            if (!s.isEmpty() && s.getCard() == card) {
                destroyCardInSlot(s);
                return;
            }
        }
    }

    public void destroyCardInSlot(BoardSlot slot) {
        if (slot == null || slot.isEmpty()) {
            return;
        }

        Card card = slot.getCard();
        Card rebornCard = null;
        boolean enemyBaitBucket = !slot.isPlayerSlot() && "Bait Bucket".equals(card.getName());
        if (slot.isPlayerSlot()) {
            gainBones(card != null && card.hasSigil(Sigil.BONE_KING) ? 4 : 1);
            if (card != null && card.hasSigil(Sigil.UNKILLABLE)) {
                rebornCard = card.copy();
            }
        }
        slot.clear();
        if (rebornCard != null) {
            addCardToHand(rebornCard);
            logMessage(rebornCard.getName() + " returns to your hand.");
        }
        if (enemyBaitBucket) {
            slot.placeCard(new Card("Shark", 4, 2, 0, false));
            logMessage("A shark bursts from the bait bucket!");
        }
    }

    private void sacrificeCard(BoardSlot slot) {
        if (slot == null || slot.isEmpty()) {
            return;
        }

        Card card = slot.getCard();
        Card rebornCard = null;
        gainBones(card != null && card.hasSigil(Sigil.BONE_KING) ? 4 : 1);
        if (card != null && card.hasSigil(Sigil.UNKILLABLE)) {
            rebornCard = card.copy();
        }
        if (card != null && card.hasSigil(Sigil.MANY_LIVES)) {
            logMessage(card.getName() + " survives the sacrifice.");
            return;
        }
        slot.clear();
        if (rebornCard != null) {
            addCardToHand(rebornCard);
            logMessage(rebornCard.getName() + " returns to your hand.");
        }
    }

    private void gainBones(int amount) {
        if (amount <= 0) {
            return;
        }
        playerBones += amount;
        updateBonesLabel();
    }

    private void spendBones(int amount) {
        playerBones = Math.max(0, playerBones - amount);
        updateBonesLabel();
    }

    private void updateBonesLabel() {
        bonesLabel.setText("Bones: " + playerBones);
    }

    private int getSacrificeValue(Card card) {
        if (card == null) {
            return 0;
        }
        return card.hasSigil(Sigil.WORTHY_SACRIFICE) ? 3 : 1;
    }

    private int getSelectedSacrificeValue() {
        int total = 0;
        for (BoardSlot slot : selectedSacrifices) {
            if (slot != null && !slot.isEmpty()) {
                total += getSacrificeValue(slot.getCard());
            }
        }
        return total;
    }

    private void disableGame() {
        for (javafx.scene.Node node : handLayout.getChildren()) {
            if (node instanceof Button) {
                ((Button) node).setDisable(true);
            }
        }
        boardGrid.setDisable(true);
    }

    void updateScale() {
        // Prevent multiple battle end callbacks if updateScale is called after game is over
        if (gameOver) return;

        scaleLabel.setText("Scale: " + playerDamage + " | " + enemyDamage);

        int difference = playerDamage - enemyDamage;

        if (difference >= 5) {
            logMessage("🎉 YOU WIN THIS BATTLE!");
            disableGame();
            gameOver = true;
            
            // Record this battle in the run
            recordBattleWin();
        } else if (difference <= -5) {
            logMessage("💀 YOU LOSE!");
            disableGame();
            gameOver = true;
            
            // End the run
            recordBattleLoss();
        }
    }

    /**
     * Helper to adjust the player's damage total and update the scale.
     */
    public void dealPlayerDamage(int amt) {
        playerDamage += amt;
        updateScale();
    }

    /**
     * Helper to adjust the enemy's damage total and update the scale.
     */
    public void dealEnemyDamage(int amt) {
        enemyDamage += amt;
        updateScale();
    }

    /**
     * Called when player wins a battle. Records stats and shows map selection.
     */
    private void recordBattleWin() {
        if (currentBossType != BossType.NONE && bossPhase == 1) {
            triggerBossPhaseTransition();
            return;
        }

        currentRun.recordBattleVictory(playerDamage, enemyDamage);
        System.out.println("Battle won! Current run: " + currentRun);

        // Show card reward UI after a delay
        PauseTransition rewardDelay = new PauseTransition(Duration.seconds(2));
        rewardDelay.setOnFinished(ev -> showCardReward());
        rewardDelay.play(); 
    }

    private void triggerBossPhaseTransition() {
        bossPhase = 2;
        gameOver = false;
        boardGrid.setDisable(false);
        handLayout.setDisable(false);
        resetScaleForBossPhase();

        switch (currentBossType) {
            case PROSPECTOR:
                logMessage("Prospector phase two: all your creatures turn to gold!");
                transformPlayerBoardToGold();
                enemyDeck.clear();
                enemyDeck.addAll(getBossDeck(currentBossType, 2));
                refillEnemyQueue();
                break;
            case ANGLER:
                logMessage("Angler phase two: bait buckets line the shore.");
                replaceEnemyBoardWithBaitBuckets();
                enemyDeck.clear();
                enemyDeck.addAll(getBossDeck(currentBossType, 2));
                refillEnemyQueue();
                break;
            case TRAPPER_TRADER:
                logMessage("Trader phase two: pelts for the trapper's bargain.");
                addPeltsToHand();
                enemyDeck.clear();
                enemyDeck.addAll(getBossDeck(currentBossType, 2));
                clearEnemyBoardAndQueue();
                refillEnemyQueue();
                break;
            default:
                break;
        }

        drawBoard();
        drawHand();
    }

    private void resetScaleForBossPhase() {
        playerDamage = 0;
        enemyDamage = 0;
        scaleLabel.setText("Scale: 0 | 0");
    }

    private void transformPlayerBoardToGold() {
        for (BoardSlot slot : playerSlots) {
            if (!slot.isEmpty()) {
                slot.placeCard(new Card("Gold Nugget", 0, 2, 0, false));
            }
        }
    }

    private void replaceEnemyBoardWithBaitBuckets() {
        clearEnemyBoardAndQueue();
        for (int i = 0; i < enemySlots.length; i++) {
            enemySlots[i].placeCard(new Card("Bait Bucket", 0, 2, 0, false));
        }
    }

    private void addPeltsToHand() {
        hand.add(new Card("Rabbit Pelt", 0, 1, 0, false));
        hand.add(new Card("Rabbit Pelt", 0, 1, 0, false));
    }

    private void refillEnemyQueue() {
        for (int i = 0; i < enemyQueue.length; i++) {
            if (enemyQueue[i].isEmpty() && !enemyDeck.isEmpty()) {
                enemyQueue[i].placeCard(enemyDeck.remove(0));
            }
        }
    }

    private void clearEnemyBoardAndQueue() {
        for (BoardSlot slot : enemySlots) {
            slot.clear();
        }
        for (BoardSlot slot : enemyQueue) {
            slot.clear();
        }
    }

    private void performAnglerHook() {
        for (int i = 0; i < playerSlots.length; i++) {
            if (!playerSlots[i].isEmpty() && enemySlots[i].isEmpty()) {
                enemySlots[i].placeCard(playerSlots[i].getCard());
                playerSlots[i].clear();
                anglerHookUsed = true;
                logMessage("The Angler hooks away your " + enemySlots[i].getCard().getName() + "!");
                return;
            }
        }
        anglerHookUsed = true;
    }

    /**
     * Called when player loses a battle. Ends the run and shows results.
     */
    private void recordBattleLoss() {
        currentRun.endRun();
        System.out.println("Run ended! Stats: " + currentRun);

        PauseTransition resultsDelay = new PauseTransition(Duration.seconds(2));
        resultsDelay.setOnFinished(ev -> showRunResults());
        resultsDelay.play();
    }

    /**
     * Shows a reward dialog after winning a battle. Player selects 1 of 3 random cards
     * to add to their deck with rarity-weighted selection.
     */
    private void showCardReward() {
        List<Card> rewardOptions = CardRewardPool.getRewardOptions();
        
        Stage rewardStage = new Stage();
        rewardStage.setTitle("Reward!");
        
        VBox layout = createPanel();
        layout.setAlignment(Pos.CENTER);
        layout.setStyle(panelStyle() + "-fx-alignment: center;");
        
        Label titleLabel = createScreenTitle("Choose a Card");
        Label subtitleLabel = createSectionLabel("Take one reward and strengthen the deck.");
        layout.getChildren().add(titleLabel);
        layout.getChildren().add(subtitleLabel);
        
        HBox cardButtonsBox = new HBox(15);
        cardButtonsBox.setAlignment(Pos.CENTER);
        cardButtonsBox.setPadding(new Insets(20));
        
        // Create a button for each reward option
        for (Card rewardCard : rewardOptions) {
            Button cardButton = createRewardCardButton(rewardCard, rewardStage);
            cardButtonsBox.getChildren().add(cardButton);
        }
        
        layout.getChildren().add(cardButtonsBox);
        
        StackPane root = createWindowRoot(layout);
        Scene scene = new Scene(root, 760, 420);
        rewardStage.setScene(scene);
        rewardStage.show();
    }
    
    /**
     * Creates a button for a card reward option that can be clicked to add the card.
     * 
     * @param card The card to create a button for
     * @param rewardStage The stage to close after selection
     * @return A styled Button for the card reward
     */
    private Button createRewardCardButton(Card card, Stage rewardStage) {
        Button cardBtn = new Button(formatCardText(card, true));
        cardBtn.setPrefSize(260, 220);
        cardBtn.setWrapText(true);
        styleCardButton(cardBtn);
        
        cardBtn.setOnAction(e -> {
            // Add selected card to deck
            currentRun.addCardToDeck(card);
            System.out.println("Added " + card.getName() + " to deck. Deck size: " + 
                             currentRun.getCurrentDeck().size());
            
            // Close reward dialog and show map selection
            rewardStage.close();
            showMapSelection();
        });
        
        return cardBtn;
    }

    /**
     * Shows the map selection screen after winning a battle.
     */
    private void showMapSelection() {
        Map gameMap = currentRun.getGameMap();
        MapNode currentNode = currentRun.getCurrentNode();
        List<MapNode> choices = currentNode != null ? currentNode.getNextChoices() : List.of();

        Stage mapStage = new Stage();
        mapStage.setTitle("Choose Your Path");

        VBox layout = createPanel();

        Label infoLabel = createSectionLabel("Round " + currentRun.getCurrentRound() + 
            " | Battles Won: " + currentRun.getBattlesWon() +
            " | Nodes: " + currentRun.getCurrentNodeIndex() + "/" + gameMap.getTotalNodes());
        layout.getChildren().addAll(createScreenTitle("Choose Your Path"), infoLabel);

        if (choices.isEmpty()) {
            Label endLabel = createSectionLabel("No more choices. Run complete.");
            Button restartBtn = new Button("Start New Run");
            stylePrimaryButton(restartBtn);
            restartBtn.setOnAction(e -> {
                mapStage.close();
                startNewRun();
            });
            layout.getChildren().addAll(endLabel, restartBtn);
        } else {
            Label chooseLabel = createSectionLabel("Choose your next stop.");
            layout.getChildren().add(chooseLabel);

            for (MapNode choice : choices) {
                Button choiceBtn = new Button(choice.getDisplayName() + " (" + choice.getType() + ")");
                styleChoiceButton(choiceBtn);
                choiceBtn.setOnAction(e -> {
                    currentRun.moveToNode(choice.getPosition());
                    mapStage.close();
                    enterNode(choice);
                });
                layout.getChildren().add(choiceBtn);
            }
        }

        ScrollPane scroll = new ScrollPane(layout);
        styleScrollPane(scroll);
        Scene scene = new Scene(createWindowRoot(scroll), 520, 420);
        mapStage.setScene(scene);
        mapStage.show();
    }

    /**
     * Shows the run results screen after losing.
     */
    private void showRunResults() {
        RunPersistence.HighScore highScore = RunPersistence.loadHighScore();

        Stage resultsStage = new Stage();
        resultsStage.setTitle("Run Over");

        VBox layout = createPanel();
        layout.setAlignment(Pos.CENTER);

        Label titleLabel = createScreenTitle("Run Statistics");

        Label stats = new Label(
            "Battles Won: " + currentRun.getBattlesWon() + "\n" +
            "Nodes Reached: " + currentRun.getHighestNodeReached() + "/" + currentRun.getGameMap().getTotalNodes() + "\n" +
            "Total Damage Dealt: " + currentRun.getCumulativeDamageDealt() + "\n" +
            "Total Damage Received: " + currentRun.getCumulativeDamageReceived() + "\n"
        );
        stats.setStyle("-fx-font-size: 15px; -fx-font-family: 'Trebuchet MS'; -fx-text-fill: #f3e6cf;");

        Label highScoreLabel = new Label(
            "HIGH SCORE:\n" +
            "Battles: " + highScore.battlesWon + " | Nodes: " + highScore.nodeReached
        );
        highScoreLabel.setStyle("-fx-font-size: 15px; -fx-font-family: 'Trebuchet MS'; -fx-text-fill: #f0c56f;");

        Button restartBtn = new Button("Start New Run");
        restartBtn.setPrefSize(150, 50);
        stylePrimaryButton(restartBtn);
        restartBtn.setOnAction(e -> {
            resultsStage.close();
            startNewRun();
        });

        layout.getChildren().addAll(titleLabel, stats, highScoreLabel, restartBtn);
        Scene scene = new Scene(createWindowRoot(layout), 520, 430);
        resultsStage.setScene(scene);
        resultsStage.show();
    }

    /**
     * Updates the display with current run information.
     */
    private void updateRunInfoDisplay() {
        if (currentRun != null) {
            String runInfo = "Round " + currentRun.getCurrentRound() + 
                " | Battles Won: " + currentRun.getBattlesWon() +
                " | Deck Size: " + currentRun.getCurrentDeck().size();
            runInfoLabel.setText(runInfo);
        }
    }

    private void showCampfireEvent(MapNode node) {
        Stage eventStage = new Stage();
        eventStage.setTitle(node.getDisplayName());

        VBox layout = createPanel();
        layout.getChildren().addAll(
                titledLabel("Campfire"),
                new Label("Choose a card to permanently improve."),
                createDeckSelectionPane(currentRun.getCurrentDeck(), card -> showCampfireBuffChoice(eventStage, card))
        );

        eventStage.setScene(new Scene(createWindowRoot(new ScrollPane(layout)), 720, 500));
        eventStage.show();
    }

    private void showCampfireBuffChoice(Stage eventStage, Card card) {
        VBox layout = new VBox(15);
        layout.setPadding(new Insets(20));
        layout.setAlignment(Pos.CENTER);

        Label cardLabel = new Label(formatCardText(card, true));
        cardLabel.setWrapText(true);
        cardLabel.setStyle("-fx-font-size: 18px; -fx-font-family: 'Georgia'; -fx-text-fill: #f4e9d7; "
                + "-fx-background-color: rgba(38, 22, 14, 0.82); -fx-background-radius: 18; -fx-padding: 18;");
        Button powerButton = new Button("Increase Power (+1)");
        stylePrimaryButton(powerButton);
        powerButton.setOnAction(e -> {
            card.increaseAttack(1);
            completeEventAndAdvance(eventStage, card.getName() + " gained 1 power at the campfire.");
        });

        Button healthButton = new Button("Increase Health (+2)");
        styleSecondaryButton(healthButton);
        healthButton.setOnAction(e -> {
            card.increaseHealth(2);
            completeEventAndAdvance(eventStage, card.getName() + " gained 2 health at the campfire.");
        });

        layout.getChildren().addAll(
                titledLabel("Warm the " + card.getName()),
                cardLabel,
                powerButton,
                healthButton
        );
        eventStage.getScene().setRoot(layout);
    }

    private void showSigilTransferEvent(MapNode node) {
        List<Card> donorCandidates = new ArrayList<>();
        for (Card card : currentRun.getCurrentDeck()) {
            if (!card.getSigils().isEmpty()) {
                donorCandidates.add(card);
            }
        }

        if (donorCandidates.isEmpty()) {
            currentRun.markCurrentNodeCompleted();
            showSimpleEventResult(node.getDisplayName(), "No card in your deck has a sigil to transfer.");
            return;
        }

        Stage eventStage = new Stage();
        eventStage.setTitle(node.getDisplayName());

        VBox layout = createPanel();
        layout.getChildren().addAll(
                titledLabel("Ritual Stones"),
                new Label("Choose a donor card. It will be destroyed after the transfer."),
                createDeckSelectionPane(donorCandidates, card -> showSigilChoice(eventStage, card))
        );

        eventStage.setScene(new Scene(createWindowRoot(new ScrollPane(layout)), 760, 540));
        eventStage.show();
    }

    private void showSigilChoice(Stage eventStage, Card donor) {
        VBox layout = new VBox(15);
        layout.setPadding(new Insets(20));
        layout.getChildren().addAll(
                titledLabel("Choose a Sigil"),
                new Label("Donor: " + donor.getName())
        );

        for (Sigil sigil : donor.getSigils()) {
            Button sigilButton = new Button(sigil.getDisplayName() + "\n" + sigil.getDescription());
            sigilButton.setWrapText(true);
            sigilButton.setMaxWidth(Double.MAX_VALUE);
            sigilButton.setOnAction(e -> showSigilReceiverChoice(eventStage, donor, sigil));
            layout.getChildren().add(sigilButton);
        }

        layout.getChildren().add(backButton(() -> {
            eventStage.close();
            showSigilTransferEvent(currentRun.getCurrentNode());
        }));
        eventStage.getScene().setRoot(new ScrollPane(layout));
    }

    private void showSigilReceiverChoice(Stage eventStage, Card donor, Sigil sigil) {
        List<Card> receiverCandidates = new ArrayList<>();
        for (Card card : currentRun.getCurrentDeck()) {
            if (card != donor && !card.hasSigil(sigil)) {
                receiverCandidates.add(card);
            }
        }

        VBox layout = new VBox(15);
        layout.setPadding(new Insets(20));
        layout.getChildren().addAll(
                titledLabel("Choose the Receiver"),
                new Label("Transfer " + sigil.getDisplayName() + " from " + donor.getName() + ".")
        );

        if (receiverCandidates.isEmpty()) {
            layout.getChildren().addAll(
                    new Label("No other card can receive this sigil."),
                    backButton(() -> showSigilChoice(eventStage, donor))
            );
            eventStage.getScene().setRoot(layout);
            return;
        }

        layout.getChildren().add(createDeckSelectionPane(receiverCandidates, receiver -> {
            receiver.addSigil(sigil);
            currentRun.removeCardFromDeck(donor);
            completeEventAndAdvance(
                    eventStage,
                    donor.getName() + " was sacrificed. " + receiver.getName()
                            + " inherited " + sigil.getDisplayName() + "."
            );
        }));
        layout.getChildren().add(backButton(() -> showSigilChoice(eventStage, donor)));
        eventStage.getScene().setRoot(new ScrollPane(layout));
    }

    private ScrollPane createDeckSelectionPane(List<Card> cards, java.util.function.Consumer<Card> onSelect) {
        VBox deckBox = new VBox(10);
        for (Card card : cards) {
            Button cardButton = new Button(formatCardText(card, true));
            cardButton.setWrapText(true);
            cardButton.setPrefSize(320, 220);
            cardButton.setMaxWidth(Double.MAX_VALUE);
            styleCardButton(cardButton);
            cardButton.setOnAction(e -> onSelect.accept(card));
            deckBox.getChildren().add(cardButton);
        }

        ScrollPane scrollPane = new ScrollPane(deckBox);
        scrollPane.setFitToWidth(true);
        scrollPane.setPrefViewportHeight(300);
        styleScrollPane(scrollPane);
        return scrollPane;
    }

    private void completeEventAndAdvance(Stage eventStage, String message) {
        currentRun.markCurrentNodeCompleted();
        eventStage.close();
        showSimpleEventResult("Event Complete", message);
    }

    private void showSimpleEventResult(String titleText, String message) {
        Stage resultStage = new Stage();
        resultStage.setTitle(titleText);

        VBox layout = new VBox(15);
        layout.setPadding(new Insets(20));
        layout.setAlignment(Pos.CENTER);
        layout.getChildren().addAll(
                titledLabel(titleText),
                new Label(message)
        );

        Button continueButton = new Button("Continue");
        stylePrimaryButton(continueButton);
        continueButton.setOnAction(e -> {
            resultStage.close();
            showMapSelection();
        });
        layout.getChildren().add(continueButton);

        resultStage.setScene(new Scene(createWindowRoot(layout), 480, 280));
        resultStage.show();
    }

    private Label titledLabel(String text) {
        return createScreenTitle(text);
    }

    private Button backButton(Runnable action) {
        Button button = new Button("Back");
        styleSecondaryButton(button);
        button.setOnAction(e -> action.run());
        return button;
    }

    private HBox createItemBar() {
        HBox bar = new HBox(12);
        bar.setAlignment(Pos.CENTER_LEFT);

        for (BattleItem item : currentRun.getItems()) {
            Button itemButton = new Button(item.getDisplayName());
            styleSecondaryButton(itemButton);
            itemButton.setOnAction(e -> {
                if (gameOver) {
                    return;
                }
                currentRun.removeItem(item);
                updateItemsLabel();
                item.use(this);
                drawHand();
                drawBoard();
            });
            bar.getChildren().add(itemButton);
        }

        if (bar.getChildren().isEmpty()) {
            Label empty = createSectionLabel("No items in pack");
            bar.getChildren().add(empty);
        }

        return bar;
    }

    private void styleSelectedSacrifice(Button button, BoardSlot slot, boolean isPlayerRow) {
        styleSlotButton(button, slot, isPlayerRow);
        button.setStyle(button.getStyle() + "-fx-border-color: #ff6b57; -fx-border-width: 4;");
    }

    public void addCardToHand(Card card) {
        if (card == null) {
            return;
        }
        hand.add(card);
        drawHand();
    }

    public void skipEnemyAttackPhase() {
        skipEnemyAttackPhase = true;
    }

    private void updateItemsLabel() {
        if (currentRun == null || currentRun.getItems().isEmpty()) {
            itemsLabel.setText("Items: none");
            return;
        }

        StringBuilder text = new StringBuilder("Items: ");
        for (int i = 0; i < currentRun.getItems().size(); i++) {
            text.append(currentRun.getItems().get(i).getDisplayName());
            if (i < currentRun.getItems().size() - 1) {
                text.append(", ");
            }
        }
        itemsLabel.setText(text.toString());
    }

    public void evolveCard(BoardSlot slot) {
        if (slot == null || slot.isEmpty()) {
            return;
        }

        Card card = slot.getCard();
        if (!card.hasSigil(Sigil.FLEDGLING)) {
            return;
        }

        switch (card.getName()) {
            case "Wolf Cub":
                card.setName("Wolf");
                card.setAttack(3);
                card.setHealth(2);
                card.setCost(2);
                break;
            case "Raven Egg":
                card.setName("Raven");
                card.setAttack(2);
                card.setHealth(3);
                card.setCost(2);
                card.addSigil(Sigil.AIRBORNE);
                break;
            case "Elk Fawn":
                card.setName("Elk");
                card.setAttack(2);
                card.setHealth(4);
                card.setCost(2);
                break;
            default:
                card.increaseAttack(1);
                card.increaseHealth(1);
                break;
        }

        card.removeSigil(Sigil.FLEDGLING);
        card.resetTurnsInPlay();
        logMessage(card.getName() + " has grown.");
        drawBoard();
    }

    public void createAdjacentChimes(BoardSlot slot) {
        int lane = getLaneIndex(slot);
        BoardSlot[] row = slot.isPlayerSlot() ? playerSlots : enemySlots;

        if (lane > 0 && row[lane - 1].isEmpty()) {
            row[lane - 1].placeCard(new Card("Chime", 0, 1, 0, false));
        }
        if (lane < row.length - 1 && row[lane + 1].isEmpty()) {
            row[lane + 1].placeCard(new Card("Chime", 0, 1, 0, false));
        }
        drawBoard();
    }

    private void showBackpackEvent(MapNode node) {
        Stage eventStage = new Stage();
        eventStage.setTitle(node.getDisplayName());

        List<BattleItem> options = rollItemChoices();
        VBox layout = createPanel();
        layout.getChildren().addAll(
                titledLabel("Backpack"),
                new Label("Choose one item to bring into future battles.")
        );

        for (BattleItem item : options) {
            Button itemButton = new Button(item.getDisplayName() + "\n" + item.getDescription());
            itemButton.setWrapText(true);
            itemButton.setMaxWidth(Double.MAX_VALUE);
            styleChoiceButton(itemButton);
            itemButton.setOnAction(e -> {
                currentRun.addItem(item);
                completeEventAndAdvance(eventStage, "You packed " + item.getDisplayName() + ".");
            });
            layout.getChildren().add(itemButton);
        }

        eventStage.setScene(new Scene(createWindowRoot(layout), 620, 420));
        eventStage.show();
    }

    private List<BattleItem> rollItemChoices() {
        List<BattleItem> pool = new ArrayList<>(List.of(BattleItem.values()));
        Collections.shuffle(pool, random);
        return pool.subList(0, Math.min(3, pool.size()));
    }

    private StackPane createWindowRoot(javafx.scene.Node content) {
        StackPane root = new StackPane(content);
        root.setPadding(new Insets(24));
        root.setStyle(appBackgroundStyle());
        return root;
    }

    private VBox createPanel() {
        VBox panel = new VBox(16);
        panel.setPadding(new Insets(24));
        panel.setStyle(panelStyle());
        return panel;
    }

    private void styleStatusLabel(Label label) {
        label.setStyle("-fx-font-size: 15px; -fx-font-family: 'Trebuchet MS'; "
                + "-fx-text-fill: #f3e6cf; -fx-background-color: rgba(26, 14, 9, 0.78); "
                + "-fx-background-radius: 14; -fx-padding: 10 14;");
    }

    private Label createScreenTitle(String text) {
        Label label = new Label(text);
        label.setStyle("-fx-font-size: 28px; -fx-font-family: 'Georgia'; "
                + "-fx-font-weight: bold; -fx-text-fill: #f7ead0;");
        return label;
    }

    private Label createSectionLabel(String text) {
        Label label = new Label(text);
        label.setStyle("-fx-font-size: 15px; -fx-font-family: 'Trebuchet MS'; "
                + "-fx-text-fill: #d7c4a5; -fx-letter-spacing: 0.5px;");
        return label;
    }

    private void stylePrimaryButton(Button button) {
        button.setStyle("-fx-background-color: linear-gradient(to bottom, #d6a256, #8a5424); "
                + "-fx-text-fill: #1d120d; -fx-font-size: 15px; -fx-font-family: 'Georgia'; "
                + "-fx-font-weight: bold; -fx-background-radius: 16; -fx-padding: 12 20; "
                + "-fx-border-color: #f1d08d; -fx-border-radius: 16;");
    }

    private void styleSecondaryButton(Button button) {
        button.setStyle("-fx-background-color: rgba(66, 42, 28, 0.9); -fx-text-fill: #f1e2c8; "
                + "-fx-font-size: 14px; -fx-font-family: 'Trebuchet MS'; -fx-background-radius: 14; "
                + "-fx-padding: 10 18; -fx-border-color: #9a7c58; -fx-border-radius: 14;");
    }

    private void styleChoiceButton(Button button) {
        button.setMaxWidth(Double.MAX_VALUE);
        button.setStyle("-fx-background-color: linear-gradient(to right, rgba(84, 46, 28, 0.95), rgba(43, 24, 17, 0.95)); "
                + "-fx-text-fill: #f5e6cf; -fx-font-size: 15px; -fx-font-family: 'Georgia'; "
                + "-fx-background-radius: 18; -fx-padding: 14 18; -fx-border-color: #b88a52; "
                + "-fx-border-radius: 18; -fx-alignment: center-left;");
    }

    private void styleCardButton(Button button) {
        button.setStyle("-fx-background-color: linear-gradient(to bottom, #f1e0bc, #c7ab7a); "
                + "-fx-text-fill: #21140d; -fx-font-size: 19px; -fx-font-family: 'Georgia'; "
                + "-fx-font-weight: bold; -fx-background-radius: 18; -fx-border-color: #6b4423; "
                + "-fx-border-radius: 18; -fx-padding: 18; -fx-alignment: top-left;");
    }

    private void styleSlotButton(Button button, BoardSlot slot, boolean isPlayerRow) {
        String fill;
        if (slot.isEmpty()) {
            fill = isPlayerRow ? "rgba(99, 61, 35, 0.72)" : "rgba(63, 36, 24, 0.72)";
        } else if (isPlayerRow) {
            fill = "linear-gradient(to bottom, #f3e3c1, #cba977)";
        } else {
            fill = "linear-gradient(to bottom, #d0bbb2, #8f6d61)";
        }

        button.setStyle("-fx-background-color: " + fill + "; -fx-text-fill: #1d120d; "
                + "-fx-font-size: 17px; -fx-font-family: 'Georgia'; -fx-font-weight: bold; "
                + "-fx-background-radius: 18; -fx-border-color: #6c492e; -fx-border-radius: 18; "
                + "-fx-padding: 14; -fx-alignment: top-left;");
    }

    private String formatCardText(Card card, boolean detailed) {
        StringBuilder text = new StringBuilder();
        text.append(card.getName())
                .append("\nCost ").append(card.getCostDisplay())
                .append(" | ATK ").append(card.getAttack())
                .append(" | HP ").append(card.getHealth());

        if (!card.getSigils().isEmpty()) {
            text.append("\nSigils:");
            int limit = detailed ? card.getSigils().size() : Math.min(2, card.getSigils().size());
            for (int i = 0; i < limit; i++) {
                Sigil sigil = card.getSigils().get(i);
                text.append("\n- ").append(sigil.getDisplayName());
            }
            if (!detailed && card.getSigils().size() > limit) {
                text.append("\n- +").append(card.getSigils().size() - limit).append(" more");
            }
        } else if (detailed) {
            text.append("\nSigils:\n- None");
        }

        return text.toString();
    }

    private void styleScrollPane(ScrollPane scrollPane) {
        scrollPane.setFitToWidth(true);
        scrollPane.setStyle("-fx-background: transparent; -fx-background-color: transparent;");
    }

    private String panelStyle() {
        return "-fx-background-color: linear-gradient(to bottom, rgba(56, 33, 23, 0.94), rgba(23, 14, 11, 0.94)); "
                + "-fx-background-radius: 26; -fx-border-color: rgba(195, 146, 86, 0.7); "
                + "-fx-border-radius: 26;";
    }

    private String appBackgroundStyle() {
        return "-fx-background-color: radial-gradient(center 30% 20%, radius 90%, #4f2d20, #120b09 70%);";
    }

    private void promptDraw() {
        Stage popup = new Stage();
        popup.setTitle("Choose a Card to Draw");

        Button drawSquirrel = new Button("Draw Squirrel 🐿️");
        Button drawFromDeck = new Button("Draw From Deck 🃏");

        drawSquirrel.setOnAction(e -> {
            hand.add(new Card("Squirrel", 0, 1, 0, true));
            drawHand();
            popup.close();
            logMessage("You drew a Squirrel.");
        });

        drawFromDeck.setOnAction(e -> {
            if (!playerDeck.isEmpty()) {
                Card card = playerDeck.remove(0);
                hand.add(card);
                drawHand();
                logMessage("You drew: " + card.getName());
            } else {
                logMessage("Deck is empty!");
            }
            popup.close();
        });

        HBox layout = new HBox(20, drawSquirrel, drawFromDeck);
        layout.setPadding(new Insets(20));

        Scene scene = new Scene(layout);
        popup.setScene(scene);
        popup.show();
    }

    public static void main(String[] args) {
        launch();
    }
}
