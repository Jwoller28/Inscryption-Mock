package game;

import javafx.application.Application;
import javafx.geometry.Insets;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.layout.*;
import javafx.stage.Stage;
import javafx.animation.PauseTransition;
import javafx.util.Duration;
import javafx.scene.Node;


import java.util.ArrayList;
import java.util.List;

public class Main extends Application {
    private int playerDamage = 0;
    private int enemyDamage = 0;
    private Label scaleLabel = new Label("Scale: 0 | 0");
    private Label messageLabel = new Label();
    private List<Card> hand = new ArrayList<>();
    private List<Card> enemyDeck = new ArrayList<>();
    private BoardSlot[] playerSlots = new BoardSlot[4];
    private BoardSlot[] enemySlots = new BoardSlot[4];
    private HBox handLayout = new HBox(10);
    private GridPane boardGrid = new GridPane();
    private List<BoardSlot> selectedSacrifices = new ArrayList<>();
    private Card selectedHandCard = null;
    private boolean gameOver = false;


    @Override
    public void start(Stage stage) {
        // Sample hand
        hand.add(new Card("Wolf", 3, 2, 2, false));
        hand.add(new Card("Stoat", 1, 3, 1, false));
        hand.add(new Card("Squirrel", 0, 1, 0, true));
        hand.add(new Card("Squirrel", 0, 1, 0, true));
        hand.add(new Card("Raven", 2, 3, 2, false));

        // Enemy cards (could be more complex later)
        enemyDeck.add(new Card("Squirrel", 0, 1, 0, true));
        enemyDeck.add(new Card("Squirrel", 0, 1, 0, true));
        enemyDeck.add(new Card("Adder", 1, 1, 1, false));
        enemyDeck.add(new Card("Bullfrog", 1, 2, 1, false));
        enemyDeck.add(new Card("Raven", 2, 3, 2, false));

        // Create board slots
        for (int i = 0; i < 4; i++) {
            playerSlots[i] = new BoardSlot(true);
            enemySlots[i] = new BoardSlot(false);
        }

        drawBoard();
        drawHand();

        Button attackBtn = new Button("End Turn");
        attackBtn.setOnAction(e -> {
            if (gameOver) return;

            messageLabel.setText(""); // Clear log
            performPlayerAttacks();
            drawBoard();

            PauseTransition pause1 = new PauseTransition(Duration.seconds(1));
            pause1.setOnFinished(ev -> {
                if (gameOver) return;

                performEnemyAttacks();
                drawBoard();

                PauseTransition pause2 = new PauseTransition(Duration.seconds(1));
                pause2.setOnFinished(ev2 -> {
                    if (gameOver) return;

                    enemyTurn();

                    PauseTransition pause3 = new PauseTransition(Duration.seconds(1));
                    pause3.setOnFinished(ev3 -> {
                        if (gameOver) return;

                        drawBoard();
                        logMessage("Your turn");
                    });

                    pause3.play();
                });

                pause2.play();
            });

            pause1.play();
        });



        VBox leftPanel = new VBox(20,
                scaleLabel,
                boardGrid,
                new Label("Your Hand:"),
                handLayout,
                attackBtn
        );
        leftPanel.setPadding(new Insets(20));

        VBox rightPanel = new VBox(10,
                new Label("Turn Log:"),
                messageLabel
        );
        rightPanel.setPadding(new Insets(20));
        rightPanel.setPrefWidth(250); // Fixed width for log area

        HBox root = new HBox(20, leftPanel, rightPanel);


        Scene scene = new Scene(root, 900, 500);
        stage.setScene(scene);
        stage.setTitle("Inscryption");
        stage.show();
    }

    private void drawBoard() {
        selectedSacrifices.clear();
        boardGrid.getChildren().clear();
        boardGrid.setHgap(10);
        boardGrid.setVgap(10);

        // Enemy row
        for (int i = 0; i < 4; i++) {
            Button btn = createSlotButton(enemySlots[i], false);
            boardGrid.add(btn, i, 0);
        }

        // Player row
        for (int i = 0; i < 4; i++) {
            Button btn = createSlotButton(playerSlots[i], true);
            boardGrid.add(btn, i, 1);
        }
    }

    private Button createSlotButton(BoardSlot slot, boolean isPlayerRow) {
        Button btn = new Button();
        btn.setPrefSize(120, 80);

        if (slot.isEmpty()) {
            btn.setText("");
        } else {
            Card c = slot.getCard();
            btn.setText(
                    c.getName() +
                            "\nATK: " + c.getAttack() +
                            "  HP: " + c.getHealth() +
                            "\nCost: " + c.getCost()
            );
            if (isPlayerRow) {
                btn.setOnAction(e -> {
                    if (selectedHandCard != null && !selectedSacrifices.contains(slot)) {
                        int required = selectedHandCard.getCost();

                        // Only allow sacrifices if the selected card costs blood
                        if (required == 0) {
                            logMessage("No sacrifices needed for: " + selectedHandCard.getName());
                            return;
                        }

                        // Only allow up to the required number of sacrifices
                        if (selectedSacrifices.size() >= required) {
                            logMessage("Already selected enough sacrifices for: " + selectedHandCard.getName());
                            return;
                        }

                        selectedSacrifices.add(slot);
                        btn.setStyle("-fx-background-color: red;");
                        logMessage("Marked for sacrifice: " + slot.getCard().getName());
                    }
                });
            }
        }

        if (isPlayerRow) {
            btn.setOnAction(e -> {
                if (selectedHandCard != null) {
                    int bloodCost = selectedHandCard.getCost();

                    if (selectedSacrifices.size() >= bloodCost) {
                        // Clear sacrificed cards
                        for (BoardSlot s : selectedSacrifices) {
                            s.clear();
                        }

                        // Place the new card in the clicked slot (even if it was just cleared)
                        slot.placeCard(selectedHandCard);
                        logMessage("Played " + selectedHandCard.getName() + " at slot after sacrifices.");

                        hand.remove(selectedHandCard);
                        selectedHandCard = null;
                        selectedSacrifices.clear();
                        drawHand();
                        drawBoard();
                    } else if (slot.getCard() != null && !selectedSacrifices.contains(slot)) {
                        // This is the block we already edited before: sacrifice logic
                        int required = selectedHandCard.getCost();
                        if (required == 0) {
                            logMessage("No sacrifices needed.");
                            return;
                        }
                        if (selectedSacrifices.size() >= required) {
                            logMessage("Already selected enough sacrifices.");
                            return;
                        }

                        selectedSacrifices.add(slot);
                        btn.setStyle("-fx-background-color: red;");
                        logMessage("Marked for sacrifice: " + slot.getCard().getName());
                    }
                }
            });
        }
        return btn;
    }


    private void drawHand() {
        handLayout.getChildren().clear();
        for (Card card : hand) {
            Button cardBtn = new Button(card.toString());
            cardBtn.setPrefSize(160, 60);

            cardBtn.setOnAction(e -> {
                selectedHandCard = card;
                logMessage("Selected from hand: " + card.getName());
            });

            handLayout.getChildren().add(cardBtn);
        }
    }

    private void performPlayerAttacks() {
        logMessage("\n--- PLAYER ATTACKS ---");

        for (int i = 0; i < 4; i++) {
            BoardSlot playerSlot = playerSlots[i];
            BoardSlot enemySlot = enemySlots[i];

            if (!playerSlot.isEmpty()) {
                Card attacker = playerSlot.getCard();

                if (!enemySlot.isEmpty()) {
                    Card defender = enemySlot.getCard();
                    defender.takeDamage(attacker.getAttack());
                    logMessage(attacker.getName() + " attacks " + defender.getName() + " for " + attacker.getAttack());

                    if (defender.getHealth() <= 0) {
                        logMessage(defender.getName() + " dies.");
                        enemySlot.clear();
                    }
                } else {
                    logMessage(attacker.getName() + " deals " + attacker.getAttack() + " direct damage to enemy!");
                    playerDamage += attacker.getAttack();
                    updateScale();
                }
            }
        }
    }

    private void performEnemyAttacks() {
        logMessage("\n--- ENEMY ATTACKS ---");

        for (int i = 0; i < 4; i++) {
            BoardSlot enemySlot = enemySlots[i];
            BoardSlot playerSlot = playerSlots[i];

            if (!enemySlot.isEmpty()) {
                Card attacker = enemySlot.getCard();

                if (!playerSlot.isEmpty()) {
                    Card defender = playerSlot.getCard();
                    defender.takeDamage(attacker.getAttack());
                    logMessage("Enemy " + attacker.getName() + " attacks " + defender.getName() + " for " + attacker.getAttack());

                    if (defender.getHealth() <= 0) {
                        logMessage(defender.getName() + " dies.");
                        playerSlot.clear();
                    }
                } else {
                    logMessage("Enemy " + attacker.getName() + " deals " + attacker.getAttack() + " direct damage to player!");
                    enemyDamage += attacker.getAttack();
                    updateScale();
                }
            }
        }
    }


    private void enemyTurn() {
        for (int i = 0; i < 4; i++) {
            if (enemySlots[i].isEmpty() && !enemyDeck.isEmpty()) {
                Card card = enemyDeck.remove(0); // remove from top of deck
                enemySlots[i].placeCard(card);
                logMessage("Enemy plays: " + card.getName());
                break; // Only play one card per turn
            }
        }
    }

    private void logMessage(String text) {
        System.out.println(text);
        String current = messageLabel.getText();
        messageLabel.setText(current + text + "\n");
    }

    private void disableGame() {
        for (javafx.scene.Node node : handLayout.getChildren()) {
            if (node instanceof Button) {
                ((Button) node).setDisable(true);
            }
        }
        boardGrid.setDisable(true);
    }

    private void updateScale() {
        scaleLabel.setText("Scale: " + playerDamage + " | " + enemyDamage);

        int difference = playerDamage - enemyDamage;

        if (difference >= 5) {
            logMessage("🎉 YOU WIN!");
            disableGame();
            gameOver = true;
        } else if (difference <= -5) {
            logMessage("💀 YOU LOSE!");
            disableGame();
            gameOver = true;
        }
    }

    public static void main(String[] args) {
        launch();
    }
}
