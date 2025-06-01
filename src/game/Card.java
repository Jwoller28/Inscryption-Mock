package game;

public class Card {
    private String name;
    private int attack;
    private int health;
    private int cost;
    private boolean isSquirrel;

    public Card(String name, int attack, int health, int cost, boolean isSquirrel) {
        this.name = name;
        this.attack = attack;
        this.health = health;
        this.cost = cost;
        this.isSquirrel = isSquirrel;
    }

    public String getName() { return name; }
    public int getAttack() { return attack; }
    public int getHealth() { return health; }
    public int getCost() { return cost; }
    public boolean isSquirrel() { return isSquirrel; }

    @Override
    public String toString() {
        return name + "\nATK: " + attack + "  HP: " + health + "\nCost: " + cost;
    }


    public void takeDamage(int dmg) {
        this.health -= dmg;
    }

}
