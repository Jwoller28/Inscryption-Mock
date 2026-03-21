package game;

/**
 * Represents a card sigil (passive ability). Each sigil optionally hooks into
 * battle events.
 */
public enum Sigil {
    AIRBORNE("Airborne", "This card will ignore opposing cards and strike an opponent directly.", "") {
        @Override
        public boolean onBeforeAttack(Main game, BoardSlot attacker, BoardSlot defender) {
            Card card = attacker.getCard();
            if (defender != null && !defender.isEmpty() && defender.getCard().hasSigil(MIGHTY_LEAP)) {
                game.logMessage(defender.getCard().getName() + " blocks the airborne strike.");
                return false;
            }

            int attack = game.getEffectiveAttack(attacker);
            if (attacker.isPlayerSlot()) {
                game.logMessage(card.getName() + " swoops overhead and hits the enemy directly for " + attack + "!");
                game.dealPlayerDamage(attack);
            } else {
                game.logMessage("Enemy " + card.getName() + " swoops overhead and hits you directly for " + attack + "!");
                game.dealEnemyDamage(attack);
            }
            return true;
        }
    },
    MIGHTY_LEAP("Mighty Leap", "A card bearing this sigil will block an opposing Airborne creature."),
    WATERBORNE("Waterborne", "On the opponent's turn, creatures attacking this card's space attack directly instead."),
    SPRINTER("Sprinter", "At the end of the owner's turn, this card moves in the direction inscribed in the sigil."),
    SPRINTER_LEFT("Sprinter (Left)", "At the end of the owner's turn, this card moves to the left."),
    HEFTY("Hefty", "At the end of the owner's turn, this card moves in the direction inscribed, pushing other cards."),
    HEFTY_LEFT("Hefty (Left)", "At the end of the owner's turn, this card moves to the left, pushing other cards."),
    BIFURCATED_STRIKE("Bifurcated Strike", "This card will strike each opposing space to the left and right of the space across from it.") {
        @Override
        public boolean onBeforeAttack(Main game, BoardSlot attacker, BoardSlot defender) {
            int lane = game.getLaneIndex(attacker);
            if (lane >= 0) {
                if (lane - 1 >= 0) {
                    game.resolveAttackToLane(attacker, lane - 1);
                }
                if (lane + 1 < 4) {
                    game.resolveAttackToLane(attacker, lane + 1);
                }
            }
            return true;
        }
    },
    TRIFURCATED_STRIKE("Trifurcated Strike", "This card will strike each opposing space to the left, right, and center.") {
        @Override
        public boolean onBeforeAttack(Main game, BoardSlot attacker, BoardSlot defender) {
            int lane = game.getLaneIndex(attacker);
            if (lane >= 0) {
                if (lane - 1 >= 0) {
                    game.resolveAttackToLane(attacker, lane - 1);
                }
                game.resolveAttackToLane(attacker, lane);
                if (lane + 1 < 4) {
                    game.resolveAttackToLane(attacker, lane + 1);
                }
            }
            return true;
        }
    },
    TOUCH_OF_DEATH("Touch of Death", "Any creature dealt damage by this card is instantly killed.", "") {
        @Override
        public void onAfterAttack(Main game, BoardSlot attacker, BoardSlot defender) {
            if (defender != null && !defender.isEmpty()) {
                Card target = defender.getCard();
                game.logMessage(attacker.getCard().getName() + "'s touch of death obliterates " + target.getName() + "!");
                game.destroyCardInSlot(defender);
            }
        }
    },
    FLEDGLING("Fledgling", "After surviving for one turn, this card grows into a stronger form.") {
        @Override
        public void onTurnStart(Main game, BoardSlot slot) {
            Card card = slot.getCard();
            card.incrementTurnsInPlay();
            if (card.getTurnsInPlay() >= 1) {
                game.evolveCard(slot);
            }
        }
    },
    UNKILLABLE("Unkillable", "When this card perishes, a copy of it returns to your hand."),
    MANY_LIVES("Many Lives", "When this card is sacrificed, it does not perish."),
    LOOSE_TAIL("Loose Tail", "When this card would be struck, a tail is created in its place and this card moves right."),
    SHARP_QUILLS("Sharp Quills", "Once struck, the striker is dealt 1 damage.", "") {
        @Override
        public void onDamaged(Main game, BoardSlot damagedSlot, Card source) {
            if (source != null) {
                game.logMessage(damagedSlot.getCard().getName() + "'s sharp quills deal 1 damage back to " + source.getName());
                source.takeDamage(1);
                if (source.getHealth() <= 0) {
                    game.logMessage(source.getName() + " dies from quills.");
                    game.removeCardFromBoard(source);
                }
            }
        }
    },
    BURROWER("Burrower", "This card will move to block an opposing creature bearing Airborne or a direct attack."),
    STINKY("Stinky", "The creature opposing this card loses 1 Power."),
    LEADER("Leader", "Creatures adjacent to this card gain 1 Power."),
    ANT_SPAWNER("Ant Spawner", "When this card is played, an Ant enters your hand.") {
        @Override
        public void onCardPlaced(Main game, BoardSlot slot) {
            game.addCardToHand(new Card("Worker Ant", 1, 2, 1, false));
            game.logMessage("An Ant scurries into your hand.");
        }
    },
    HIVE("Hive", "When this card is struck, an Ant is created in your hand.") {
        @Override
        public void onDamaged(Main game, BoardSlot damagedSlot, Card source) {
            if (damagedSlot.isPlayerSlot()) {
                game.addCardToHand(new Card("Worker Ant", 1, 2, 1, false));
                game.logMessage("The hive swarms. An Ant enters your hand.");
            }
        }
    },
    TRINKET_BEARER("Trinket Bearer", "When this card is played, you receive a random item."),
    CORPSE_EATER("Corpse Eater", "If a creature you own dies by combat, this card is played from your hand into its space."),
    BONE_KING("Bone King", "When this card dies, it generates 4 Bones."),
    SCAVENGER("Scavenger", "When a creature you do not own dies, this card generates 1 Bone."),
    BEES_WITHIN("Bees Within", "When this card is struck, a Bee is created in your hand.") {
        @Override
        public void onDamaged(Main game, BoardSlot damagedSlot, Card source) {
            if (damagedSlot.isPlayerSlot()) {
                game.addCardToHand(new Card("Bee", 1, 1, 0, false, AIRBORNE));
                game.logMessage("A Bee buzzes into your hand.");
            }
        }
    },
    BLOOD_LUST("Blood Lust", "When this card kills a creature, it gains 1 Power."),
    DOUBLE_STRIKE("Double Strike", "This card will strike the opposing space an additional time when attacking.", "") {
        @Override
        public void onAfterAttack(Main game, BoardSlot attacker, BoardSlot defender) {
            Card card = attacker.getCard();
            game.logMessage(card.getName() + " triggers Double Strike!");
            game.resolveExtraAttack(attacker, defender);
        }
    },
    BELLIST("Bellist", "When this card is played, Chimes are created on adjacent empty spaces.") {
        @Override
        public void onCardPlaced(Main game, BoardSlot slot) {
            game.createAdjacentChimes(slot);
        }
    },
    GUARDIAN("Guardian", "When an opposing card is played opposite an empty space, this card moves to that space."),
    REPULSIVE("Repulsive", "Creatures will not attack this card."),
    WORTHY_SACRIFICE("Worthy Sacrifice", "This card counts as three blood rather than one when sacrificed.");

    private final String displayName;
    private final String description;
    private final String icon;

    Sigil(String displayName, String description) {
        this(displayName, description, "");
    }

    Sigil(String displayName, String description, String icon) {
        this.displayName = displayName;
        this.description = description;
        this.icon = icon == null ? "" : icon;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getDescription() {
        return description;
    }

    public String getIcon() {
        return icon;
    }

    public boolean onBeforeAttack(Main game, BoardSlot attacker, BoardSlot defender) {
        return false;
    }

    public void onAfterAttack(Main game, BoardSlot attacker, BoardSlot defender) {
    }

    public void onDamaged(Main game, BoardSlot damagedSlot, Card source) {
    }

    public void onTurnStart(Main game, BoardSlot slot) {
    }

    public void onCardPlaced(Main game, BoardSlot slot) {
    }
}
