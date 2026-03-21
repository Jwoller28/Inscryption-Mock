package game;

public enum BattleItem {
    PLIERS("Pliers", "Deal 1 direct damage to yourself.") {
        @Override
        public void use(Main game) {
            game.logMessage("You yank a tooth loose with the pliers.");
            game.dealEnemyDamage(1);
        }
    },
    SQUIRREL_BOTTLE("Squirrel Bottle", "Add a Squirrel to your hand.") {
        @Override
        public void use(Main game) {
            game.addCardToHand(new Card("Squirrel", 0, 1, 0, true));
            game.logMessage("A bottled squirrel leaps into your hand.");
        }
    },
    HOURGLASS("Hourglass", "Skip the enemy attack phase once.") {
        @Override
        public void use(Main game) {
            game.skipEnemyAttackPhase();
            game.logMessage("Time stills. The enemy loses its next attack.");
        }
    };

    private final String displayName;
    private final String description;

    BattleItem(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getDescription() {
        return description;
    }

    public abstract void use(Main game);
}
