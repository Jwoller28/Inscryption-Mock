package game;

import java.util.ArrayList;
import java.util.List;

/**
 * Represents a single roguelike run through the game.
 * Persists across multiple battles until the player loses.
 * Tracks progression, damage, deck state, and high score info.
 */
public class GameRun {
    private int currentRound;
    private int cumulativeDamageDealt;      // Total damage dealt to all enemies
    private int cumulativeDamageReceived;   // Total damage taken from all enemies
    private int battlesWon;                 // Number of battles won this run
    private int currentNodeIndex;           // Position on the map
    private int highestNodeReached;         // Highest node index reached this run (for high score)
    
    private List<Card> currentDeck;         // Cards in player's deck (persists between battles)
    private List<BattleItem> items;         // Battle items carried between encounters
    private Map gameMap;                    // The randomly generated map

    public GameRun(List<Card> starterDeck, Map gameMap) {
        this.currentRound = 1;
        this.cumulativeDamageDealt = 0;
        this.cumulativeDamageReceived = 0;
        this.battlesWon = 0;
        this.currentNodeIndex = 0;
        this.highestNodeReached = 0;
        
        this.currentDeck = new ArrayList<>(starterDeck);
        this.items = new ArrayList<>();
        this.gameMap = gameMap;
    }

    // ==================== Getters ====================
    public int getCurrentRound() {
        return currentRound;
    }

    public int getCumulativeDamageDealt() {
        return cumulativeDamageDealt;
    }

    public int getCumulativeDamageReceived() {
        return cumulativeDamageReceived;
    }

    public int getBattlesWon() {
        return battlesWon;
    }

    public int getCurrentNodeIndex() {
        return currentNodeIndex;
    }

    public int getHighestNodeReached() {
        return highestNodeReached;
    }

    public List<Card> getCurrentDeck() {
        return currentDeck;
    }

    public Map getGameMap() {
        return gameMap;
    }

    public List<BattleItem> getItems() {
        return items;
    }

    public MapNode getCurrentNode() {
        return gameMap.getNodeByIndex(currentNodeIndex);
    }

    // ==================== Setters / Mutations ====================
    
    /**
     * Called after a battle completes. Updates damage, battle count, and node progression.
     * @param damageDealt damage the player dealt in this battle
     * @param damageReceived damage the player received in this battle
     */
    public void recordBattleVictory(int damageDealt, int damageReceived) {
        this.cumulativeDamageDealt += damageDealt;
        this.cumulativeDamageReceived += damageReceived;
        this.battlesWon++;
        this.currentRound++;
        markCurrentNodeCompleted();
        updateHighestNodeReached();
    }

    /**
     * Move to the next node on the map.
     */
    public void moveToNode(int nodeIndex) {
        if (nodeIndex < 0 || nodeIndex >= gameMap.getTotalNodes()) {
            throw new IllegalArgumentException("Invalid node index: " + nodeIndex);
        }
        this.currentNodeIndex = nodeIndex;
        this.gameMap.setCurrentNodeIndex(nodeIndex);
        MapNode currentNode = getCurrentNode();
        if (currentNode != null) {
            currentNode.markVisited();
        }
        updateHighestNodeReached();
    }

    /**
     * Add a card to the deck (for rewards, shops, etc).
     */
    public void addCardToDeck(Card card) {
        currentDeck.add(card);
    }

    /**
     * Remove a card from the deck (for mutations like sigil transfer).
     */
    public void removeCardFromDeck(Card card) {
        currentDeck.remove(card);
    }

    public void addItem(BattleItem item) {
        items.add(item);
    }

    public void removeItem(BattleItem item) {
        items.remove(item);
    }

    /**
     * Called when the run ends (player loses). Persists high score if needed.
     */
    public void endRun() {
        RunPersistence.updateHighScore(this.battlesWon, this.highestNodeReached);
    }

    /**
     * Marks the current node completed without advancing combat statistics.
     * Used for non-combat map events such as campfires and sigil transfer.
     */
    public void markCurrentNodeCompleted() {
        MapNode currentNode = getCurrentNode();
        if (currentNode != null) {
            currentNode.markCompleted();
        }
    }

    // ==================== Private Helpers ====================
    
    private void updateHighestNodeReached() {
        if (currentNodeIndex > highestNodeReached) {
            highestNodeReached = currentNodeIndex;
        }
    }

    // ==================== Debug ====================
    
    @Override
    public String toString() {
        return String.format(
            "GameRun{round=%d, damageDealt=%d, damageReceived=%d, " +
            "battlesWon=%d, nodeIndex=%d, deckSize=%d}",
            currentRound, cumulativeDamageDealt, cumulativeDamageReceived,
            battlesWon, currentNodeIndex, currentDeck.size()
        );
    }
}
