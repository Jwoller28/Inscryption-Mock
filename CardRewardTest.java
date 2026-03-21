import game.*;
import java.util.*;

/**
 * Local verification script for the reward pool and run/map progression.
 */
public class CardRewardTest {
    public static void main(String[] args) {
        System.out.println("=== CARD REWARD POOL VERIFICATION TEST ===\n");

        testRewardGeneration();
        testRarityDistribution();
        testRunAndMapSync();

        System.out.println("\nALL TESTS PASSED");
    }

    private static void testRewardGeneration() {
        System.out.println("TEST 1: Reward Options Generation");
        for (int i = 1; i <= 5; i++) {
            List<Card> rewards = CardRewardPool.getRewardOptions();
            System.out.println("  Set " + i + ":");
            for (Card card : rewards) {
                CardRewardPool.Rarity rarity = CardRewardPool.getRarityForCard(card);
                require(rarity != null, "Reward card was not recognized by the pool: " + card.getName());
                System.out.println("    - " + card.getName() + " [" + rarity + "]"
                        + " (Cost: " + card.getCostDisplay()
                        + ", ATK: " + card.getAttack()
                        + ", HP: " + card.getHealth() + ")");
            }
        }
    }

    private static void testRarityDistribution() {
        System.out.println("\nTEST 2: Rarity Distribution (3000 samples)");
        EnumMap<CardRewardPool.Rarity, Integer> rarityCount = new EnumMap<>(CardRewardPool.Rarity.class);
        for (CardRewardPool.Rarity rarity : CardRewardPool.Rarity.values()) {
            rarityCount.put(rarity, 0);
        }

        for (int i = 0; i < 1000; i++) {
            List<Card> rewards = CardRewardPool.getRewardOptions();
            for (Card card : rewards) {
                CardRewardPool.Rarity rarity = CardRewardPool.getRarityForCard(card);
                require(rarity != null, "Could not determine rarity for reward card: " + card.getName());
                rarityCount.put(rarity, rarityCount.get(rarity) + 1);
            }
        }

        int total = 3000;
        printDistribution("Common", rarityCount.get(CardRewardPool.Rarity.COMMON), total, 70.0, 4.5);
        printDistribution("Uncommon", rarityCount.get(CardRewardPool.Rarity.UNCOMMON), total, 20.0, 3.5);
        printDistribution("Rare", rarityCount.get(CardRewardPool.Rarity.RARE), total, 10.0, 2.5);
    }

    private static void testRunAndMapSync() {
        System.out.println("\nTEST 3: GameRun / Map Sync");
        List<Card> starterDeck = new ArrayList<>();
        starterDeck.add(new Card("Squirrel", 0, 1, 0, true));
        starterDeck.add(new Card("Stoat", 1, 3, 1, false));

        game.Map gameMap = new game.Map();
        GameRun run = new GameRun(starterDeck, gameMap);

        require(run.getCurrentNodeIndex() == 0, "Run should begin at node 0");
        require(gameMap.getCurrentNodeIndex() == 0, "Map should begin at node 0");

        run.recordBattleVictory(3, 1);
        require(run.getBattlesWon() == 1, "Battle win count should increment");
        require(run.getCurrentRound() == 2, "Round should increment after a victory");
        require(run.getCurrentNode() != null && run.getCurrentNode().isCompleted(),
                "Current node should be marked completed after a victory");

        run.moveToNode(1);
        require(run.getCurrentNodeIndex() == 1, "Run node index should update when moving");
        require(gameMap.getCurrentNodeIndex() == 1, "Map node index should stay in sync with the run");

        List<MapNode> choicesFromRun = run.getGameMap().getAvailableChoices();
        List<MapNode> choicesFromIndex = run.getGameMap().getAvailableChoices(run.getCurrentNodeIndex());
        require(choicesFromRun.size() == choicesFromIndex.size(),
                "Available choices should match regardless of lookup path");

        run.addCardToDeck(new Card("Wolf", 3, 2, 2, false));
        require(run.getCurrentDeck().size() == 3, "Deck should grow when a reward is added");
    }

    private static void printDistribution(String label, int count, int total, double expectedPct, double tolerancePct) {
        double actualPct = count * 100.0 / total;
        System.out.println("  " + label + ": " + count + " (" + String.format("%.1f", actualPct) + "%)"
                + " - expected around " + expectedPct + "%");
        require(Math.abs(actualPct - expectedPct) <= tolerancePct,
                label + " distribution out of range: " + actualPct + "%");
    }

    private static void require(boolean condition, String message) {
        if (!condition) {
            throw new IllegalStateException(message);
        }
    }
}
