package game;

import java.util.ArrayList;
import java.util.List;

/**
 * Represents a single node on the map.
 * A node is either a battle, shop, event, or boss encounter.
 */
public class MapNode {
    public enum NodeType {
        BATTLE,
        BOSS,
        CAMPFIRE,
        BACKPACK,
        SIGIL_TRANSFER,
        WOODCARVER,
        MYCOLOGISTS,
        ECONOMY,
        SPECIAL_EVENT
    }

    private String id;
    private NodeType type;
    private String region;              // "woodlands", "wetlands", "snowline"
    private int position;               // 0-based index in the overall map
    private int regionPosition;         // Position within region (for visual layout)
    private List<MapNode> nextChoices;  // 2-3 forward options from this node
    private boolean visited;
    private boolean completed;

    public MapNode(String id, NodeType type, String region, int position, int regionPosition) {
        this.id = id;
        this.type = type;
        this.region = region;
        this.position = position;
        this.regionPosition = regionPosition;
        this.nextChoices = new ArrayList<>();
        this.visited = false;
        this.completed = false;
    }

    // ==================== Getters ====================

    public String getId() {
        return id;
    }

    public NodeType getType() {
        return type;
    }

    public String getRegion() {
        return region;
    }

    public int getPosition() {
        return position;
    }

    public int getRegionPosition() {
        return regionPosition;
    }

    public List<MapNode> getNextChoices() {
        return nextChoices;
    }

    public boolean isVisited() {
        return visited;
    }

    public boolean isCompleted() {
        return completed;
    }

    // ==================== Setters ====================

    public void addNextChoice(MapNode node) {
        if (!nextChoices.contains(node)) {
            nextChoices.add(node);
        }
    }

    public void markVisited() {
        this.visited = true;
    }

    public void markCompleted() {
        this.completed = true;
    }

    // ==================== Utility ====================

    public String getDisplayName() {
        switch (type) {
            case BATTLE:
                return "Battle";
            case BOSS:
                return "Boss Battle";
            case CAMPFIRE:
                return "Campfire";
            case BACKPACK:
                return "Backpack";
            case SIGIL_TRANSFER:
                return "Ritual Stones";
            case WOODCARVER:
                return "Totem Builder";
            case MYCOLOGISTS:
                return "Card Merge";
            case ECONOMY:
                return "Trader";
            case SPECIAL_EVENT:
                return "Special Event";
            default:
                return "Unknown";
        }
    }

    @Override
    public String toString() {
        return String.format("MapNode{id='%s', type=%s, region='%s', pos=%d}", 
            id, type, region, position);
    }
}
