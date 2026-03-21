package game;

public class Card {
    public enum CostType {
        BLOOD,
        BONES
    }

    private String name;
    private int attack;
    private int health;
    private int cost;
    private CostType costType;
    private boolean isSquirrel;
    private int turnsInPlay;
    private java.util.List<Sigil> sigils = new java.util.ArrayList<>();

    public Card(String name, int attack, int health, int cost, boolean isSquirrel) {
        this(name, attack, health, cost, CostType.BLOOD, isSquirrel, new Sigil[0]);
    }

    /**
     * New constructor allowing an arbitrary number of sigils to be attached.
     */
    public Card(String name, int attack, int health, int cost, boolean isSquirrel, Sigil... sigils) {
        this(name, attack, health, cost, CostType.BLOOD, isSquirrel, sigils);
    }

    public Card(String name, int attack, int health, int cost, CostType costType, boolean isSquirrel, Sigil... sigils) {
        this.name = name;
        this.attack = attack;
        this.health = health;
        this.cost = cost;
        this.costType = costType == null ? CostType.BLOOD : costType;
        this.isSquirrel = isSquirrel;
        this.turnsInPlay = 0;
        if (sigils != null) {
            for (Sigil s : sigils) {
                this.sigils.add(s);
            }
        }
    }

    public String getName() { return name; }
    public int getAttack() { return attack; }
    public int getHealth() { return health; }
    public int getCost() { return cost; }
    public CostType getCostType() { return costType; }
    public boolean isSquirrel() { return isSquirrel; }
    public boolean isBloodCost() { return costType == CostType.BLOOD; }
    public boolean isBoneCost() { return costType == CostType.BONES; }
    public int getTurnsInPlay() { return turnsInPlay; }
    public String getCostDisplay() {
        String unit = costType == CostType.BONES ? "bones" : "blood";
        return cost + " " + unit;
    }

    public java.util.List<Sigil> getSigils() { return sigils; }
    public void addSigil(Sigil s) { if (s != null) sigils.add(s); }
    public boolean hasSigil(Sigil s) { return sigils.contains(s); }
    public void setName(String name) { this.name = name; }
    public void setAttack(int attack) { this.attack = attack; }
    public void setHealth(int health) { this.health = health; }
    public void setCost(int cost) { this.cost = cost; }
    public void setCostType(CostType costType) { this.costType = costType; }
    public void increaseAttack(int amount) { attack += amount; }
    public void increaseHealth(int amount) { health += amount; }
    public boolean removeSigil(Sigil s) { return sigils.remove(s); }
    public void incrementTurnsInPlay() { turnsInPlay++; }
    public void resetTurnsInPlay() { turnsInPlay = 0; }

    public Card copy() {
        Card copy = new Card(name, attack, health, cost, costType, isSquirrel);
        for (Sigil sigil : sigils) {
            copy.addSigil(sigil);
        }
        return copy;
    }

    @Override
    public String toString() {
        String base = name + "\nATK: " + attack + "  HP: " + health + "\nCost: " + getCostDisplay();
        if (!sigils.isEmpty()) {
            StringBuilder sb = new StringBuilder(base);
            sb.append("\nSigils: ");
            for (int i = 0; i < sigils.size(); i++) {
                Sigil s = sigils.get(i);
                if (!s.getIcon().isEmpty()) {
                    sb.append(s.getIcon()).append(" ");
                }
                sb.append(s.getDisplayName());
                if (i < sigils.size() - 1) sb.append(", ");
            }
            base = sb.toString();
        }
        return base;
    }


    public void takeDamage(int dmg) {
        this.health -= dmg;
    }

}
