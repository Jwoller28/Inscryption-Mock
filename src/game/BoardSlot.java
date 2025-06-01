package game;

public class BoardSlot {
    private Card card;
    private boolean isPlayerSlot;

    public BoardSlot(boolean isPlayerSlot) {
        this.isPlayerSlot = isPlayerSlot;
    }

    public boolean isEmpty() {
        return card == null;
    }

    public void placeCard(Card card) {
        this.card = card;
    }

    public Card getCard() {
        return card;
    }

    public boolean isPlayerSlot() {
        return isPlayerSlot;
    }

    public void clear() {
        this.card = null;
    }
}
