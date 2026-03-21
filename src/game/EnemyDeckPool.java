package game;

import java.util.*;

/**
 * Manages enemy deck composition with difficulty scaling based on map progression.
 * Returns appropriate enemy decks for different difficulty tiers and node types.
 */
public class EnemyDeckPool {
    
    /**
     * Difficulty tiers based on progression through the map.
     */
    public enum DifficultyTier {
        EASY,      // Nodes 0-5: Basic enemies
        MEDIUM,    // Nodes 6-10: Intermediate enemies
        HARD       // Nodes 11+: Powerful enemies
    }
    
    /**
     * Gets the appropriate enemy deck based on node index.
     * Difficulty scales with progression: Early (0-5), Mid (6-10), Late (11+)
     * 
     * @param nodeIndex The index of the current node on the map
     * @return A List of Cards representing the enemy deck
     */
    public static List<Card> getEnemyDeck(int nodeIndex) {
        DifficultyTier tier = getDifficultyTier(nodeIndex);
        return getEnemyDeckByTier(tier);
    }
    
    /**
     * Gets the appropriate enemy deck based on difficulty tier.
     * 
     * @param tier The difficulty tier (EASY, MEDIUM, HARD)
     * @return A List of Cards representing the enemy deck
     */
    public static List<Card> getEnemyDeckByTier(DifficultyTier tier) {
        List<Card> deck = new ArrayList<>();
        
        switch (tier) {
            case EASY:
                // Early game: Basic creatures, mostly Common cards
                deck.add(new Card("Adder", 1, 1, 1, false));
                deck.add(new Card("Bullfrog", 1, 2, 1, false, Sigil.TOUCH_OF_DEATH));
                deck.add(new Card("Stoat", 1, 3, 1, false, Sigil.DOUBLE_STRIKE));
                deck.add(new Card("Adder", 1, 1, 1, false));
                deck.add(new Card("Elk", 1, 4, 1, false, Sigil.SHARP_QUILLS));
                deck.add(new Card("Mole", 0, 4, 2, false, Sigil.BURROWER));
                deck.add(new Card("Skeleton", 1, 1, 1, Card.CostType.BONES, false));
                deck.add(new Card("Skunk", 0, 3, 1, false, Sigil.STINKY));
                break;
                
            case MEDIUM:
                // Mid game: Mix of Common and Uncommon, some power
                deck.add(new Card("Wolf", 3, 2, 2, false, Sigil.SHARP_QUILLS));
                deck.add(new Card("Raven", 2, 3, 2, false, Sigil.AIRBORNE));
                deck.add(new Card("Elk", 1, 4, 1, false));
                deck.add(new Card("Bloodhound", 2, 3, 2, false, Sigil.GUARDIAN));
                deck.add(new Card("Angler", 3, 1, 2, false));
                deck.add(new Card("Mole", 2, 3, 2, false));
                deck.add(new Card("Coyote", 2, 1, 4, Card.CostType.BONES, false));
                deck.add(new Card("Alpha", 1, 2, 2, false, Sigil.LEADER));
                break;
                
            case HARD:
                // Late game: Powerful Uncommon and Rare cards
                deck.add(new Card("Grizzly Bear", 4, 6, 3, false));
                deck.add(new Card("Mantis God", 4, 4, 3, false, Sigil.DOUBLE_STRIKE));
                deck.add(new Card("Wolf", 3, 2, 2, false));
                deck.add(new Card("Angler", 3, 1, 2, false));
                deck.add(new Card("Raven", 2, 3, 2, false, Sigil.AIRBORNE));
                deck.add(new Card("Mantis", 1, 1, 1, false, Sigil.BIFURCATED_STRIKE));
                deck.add(new Card("Prospector", 0, 4, 2, false));
                deck.add(new Card("Bone Heap", 1, 2, 2, Card.CostType.BONES, false, Sigil.SHARP_QUILLS));
                deck.add(new Card("Cockroach", 1, 1, 4, Card.CostType.BONES, false, Sigil.UNKILLABLE));
                break;
        }
        
        return deck;
    }
    
    /**
     * Determines the difficulty tier based on the current node index.
     * 
     * @param nodeIndex The index of the current node on the map (0-based)
     * @return The appropriate DifficultyTier
     */
    private static DifficultyTier getDifficultyTier(int nodeIndex) {
        if (nodeIndex < 6) {
            return DifficultyTier.EASY;
        } else if (nodeIndex < 11) {
            return DifficultyTier.MEDIUM;
        } else {
            return DifficultyTier.HARD;
        }
    }
    
    /**
     * Gets a string representation of the current difficulty tier.
     * Useful for UI display.
     * 
     * @param nodeIndex The index of the current node on the map
     * @return A string like "Easy", "Medium", or "Hard"
     */
    public static String getDifficultyDisplay(int nodeIndex) {
        DifficultyTier tier = getDifficultyTier(nodeIndex);
        switch (tier) {
            case EASY:
                return "Easy";
            case MEDIUM:
                return "Medium";
            case HARD:
                return "Hard";
            default:
                return "Unknown";
        }
    }
}
