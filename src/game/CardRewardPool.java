package game;

import java.util.*;

/**
 * Manages the card reward pool and handles random selection with rarity weighting.
 * Provides a list of available cards for rewards with rarity tiers.
 */
public class CardRewardPool {
    
    /**
     * Rarity levels for cards in the reward pool.
     */
    public enum Rarity {
        COMMON(70),      // 70% chance
        UNCOMMON(20),    // 20% chance
        RARE(10);        // 10% chance
        
        private final int weight;
        
        Rarity(int weight) {
            this.weight = weight;
        }
        
        public int getWeight() {
            return weight;
        }
    }
    
    /**
     * Inner class to pair a card with its rarity.
     */
    private static class RewardCard {
        final Card card;
        final Rarity rarity;
        
        RewardCard(Card card, Rarity rarity) {
            this.card = card;
            this.rarity = rarity;
        }
    }

    private static final List<RewardCard> CARD_POOL = new ArrayList<>();
    private static final EnumMap<Rarity, List<RewardCard>> CARDS_BY_RARITY = new EnumMap<>(Rarity.class);
    private static final Random random = new Random();
    
    static {
        for (Rarity rarity : Rarity.values()) {
            CARDS_BY_RARITY.put(rarity, new ArrayList<>());
        }

        // COMMON (70%) - Basic and foundational cards
        // Note: Squirrels are only available as a free hand card each battle, not from rewards
        addRewardCard(new Card("Elk", 1, 4, 1, false), Rarity.COMMON);
        addRewardCard(new Card("Royal Spaniel", 1, 2, 1, false), Rarity.COMMON);
        addRewardCard(new Card("Stoat", 1, 3, 1, false), Rarity.COMMON);
        addRewardCard(new Card("Bullfrog", 1, 2, 1, false, Sigil.MIGHTY_LEAP), Rarity.COMMON);
        addRewardCard(new Card("Adder", 1, 1, 1, false), Rarity.COMMON);
        addRewardCard(new Card("Cat", 0, 1, 1, false, Sigil.MANY_LIVES), Rarity.COMMON);
        addRewardCard(new Card("Skunk", 0, 3, 1, false, Sigil.STINKY), Rarity.COMMON);
        addRewardCard(new Card("Wolf Cub", 1, 1, 1, false, Sigil.FLEDGLING), Rarity.COMMON);
        
        // UNCOMMON (20%) - Moderately powerful cards
        addRewardCard(new Card("Wolf", 3, 2, 2, false), Rarity.UNCOMMON);
        addRewardCard(new Card("Raven", 2, 3, 2, false), Rarity.UNCOMMON);
        addRewardCard(new Card("Raccoon", 2, 3, 2, false), Rarity.UNCOMMON);
        addRewardCard(new Card("Tree Frog", 2, 2, 2, false), Rarity.UNCOMMON);
        addRewardCard(new Card("Mole", 0, 4, 2, false, Sigil.BURROWER), Rarity.UNCOMMON);
        addRewardCard(new Card("Angler", 3, 1, 2, false), Rarity.UNCOMMON);
        addRewardCard(new Card("Coyote", 2, 1, 4, Card.CostType.BONES, false), Rarity.UNCOMMON);
        addRewardCard(new Card("Skeleton", 1, 1, 1, Card.CostType.BONES, false), Rarity.UNCOMMON);
        addRewardCard(new Card("Bloodhound", 2, 3, 2, false, Sigil.GUARDIAN), Rarity.UNCOMMON);
        addRewardCard(new Card("Beehive", 0, 2, 1, false, Sigil.BEES_WITHIN), Rarity.UNCOMMON);
        addRewardCard(new Card("Ant Queen", 1, 3, 2, false, Sigil.ANT_SPAWNER), Rarity.UNCOMMON);
        addRewardCard(new Card("Alpha", 1, 2, 2, false, Sigil.LEADER), Rarity.UNCOMMON);
        
        // RARE (10%) - Powerful and impactful cards
        addRewardCard(new Card("Grizzly Bear", 4, 6, 3, false), Rarity.RARE);
        addRewardCard(new Card("Mantis God", 2, 1, 3, false, Sigil.TRIFURCATED_STRIKE), Rarity.RARE);
        addRewardCard(new Card("Prospector", 0, 4, 2, false), Rarity.RARE);
        addRewardCard(new Card("Leaping", 2, 2, 1, false), Rarity.RARE);
        addRewardCard(new Card("Bone Heap", 1, 2, 2, Card.CostType.BONES, false, Sigil.SHARP_QUILLS), Rarity.RARE);
        addRewardCard(new Card("Mantis", 1, 1, 1, false, Sigil.BIFURCATED_STRIKE), Rarity.RARE);
        addRewardCard(new Card("Cockroach", 1, 1, 4, Card.CostType.BONES, false, Sigil.UNKILLABLE), Rarity.RARE);
        addRewardCard(new Card("Bell Tentacle", 1, 3, 2, false, Sigil.BELLIST), Rarity.RARE);
    }

    private static void addRewardCard(Card card, Rarity rarity) {
        RewardCard rewardCard = new RewardCard(card, rarity);
        CARD_POOL.add(rewardCard);
        CARDS_BY_RARITY.get(rarity).add(rewardCard);
    }
    
    /**
     * Gets 3 random cards from the pool with rarity-weighted selection.
     * The same card can appear multiple times in the reward options.
     * 
     * @return A list of 3 randomly selected cards with rarity weighting applied
     */
    public static List<Card> getRewardOptions() {
        List<Card> rewards = new ArrayList<>();
        
        for (int i = 0; i < 3; i++) {
            rewards.add(selectRandomCard());
        }
        
        return rewards;
    }
    
    /**
     * Selects a single random card from the pool using weighted rarity selection.
     * Cards with higher rarity weights are more likely to be selected.
     * 
     * @return A randomly selected card based on rarity weights
     */
    private static Card selectRandomCard() {
        Rarity rarity = selectRandomRarity();
        List<RewardCard> cards = CARDS_BY_RARITY.get(rarity);
        if (cards == null || cards.isEmpty()) {
            return cloneCard(CARD_POOL.get(0).card);
        }

        RewardCard selected = cards.get(random.nextInt(cards.size()));
        return cloneCard(selected.card);
    }

    private static Rarity selectRandomRarity() {
        int totalWeight = 0;
        for (Rarity rarity : Rarity.values()) {
            totalWeight += rarity.getWeight();
        }

        int randomValue = random.nextInt(totalWeight);
        int currentSum = 0;
        for (Rarity rarity : Rarity.values()) {
            currentSum += rarity.getWeight();
            if (randomValue < currentSum) {
                return rarity;
            }
        }

        return Rarity.COMMON;
    }

    private static Card cloneCard(Card original) {
        Card clone = new Card(original.getName(), original.getAttack(),
                original.getHealth(), original.getCost(), original.getCostType(), original.isSquirrel());
        for (Sigil sigil : original.getSigils()) {
            clone.addSigil(sigil);
        }
        return clone;
    }

    /**
     * Returns the rarity for a card definition in the reward pool.
     * Useful for verification and for tests that sample generated rewards.
     */
    public static Rarity getRarityForCard(Card card) {
        if (card == null) {
            return null;
        }

        for (RewardCard rewardCard : CARD_POOL) {
            Card poolCard = rewardCard.card;
            if (poolCard.getName().equals(card.getName())
                    && poolCard.getAttack() == card.getAttack()
                    && poolCard.getHealth() == card.getHealth()
                    && poolCard.getCost() == card.getCost()
                    && poolCard.getCostType() == card.getCostType()
                    && poolCard.isSquirrel() == card.isSquirrel()) {
                return rewardCard.rarity;
            }
        }

        return null;
    }
}
