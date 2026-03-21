package game;

import java.util.*;

/**
 * Represents the randomly generated map for a roguelike run.
 * The map has 3 regions (Woodlands, Wetlands, Snowline), each with 8-12 nodes.
 * Each region ends with a boss. Nodes branch forward with 2-3 choices.
 */
public class Map {
    private static final int BATTLE_WEIGHT = 70;
    private static final int CAMPFIRE_WEIGHT = 15;
    private static final int BACKPACK_WEIGHT = 10;
    private static final int SIGIL_TRANSFER_WEIGHT = 15;

    private List<MapNode> allNodes;
    private List<String> regions;
    private int currentNodeIndex;
    private Random random;

    public Map() {
        this.allNodes = new ArrayList<>();
        this.regions = Arrays.asList("Woodlands", "Wetlands", "Snowline");
        this.currentNodeIndex = 0;
        this.random = new Random();
        
        generateMap();
    }

    // ==================== Map Generation ====================

    /**
     * Generates the full 3-region map with branching paths and bosses.
     */
    private void generateMap() {
        int nodeIndex = 0;

        // Generate each region
        for (String region : regions) {
            // 8-12 nodes per region
            int nodeCountThisRegion = 8 + random.nextInt(5); // 8-12

            // Create nodes for this region
            List<MapNode> regionNodes = new ArrayList<>();
            for (int i = 0; i < nodeCountThisRegion; i++) {
                String nodeId = region.toLowerCase() + "_" + i;
                MapNode node = new MapNode(nodeId, selectNodeType(i, nodeCountThisRegion), region, nodeIndex++, i);
                regionNodes.add(node);
                allNodes.add(node);
            }

            // Add boss at end of region
            String bossId = region.toLowerCase() + "_boss";
            MapNode boss = new MapNode(bossId, MapNode.NodeType.BOSS, region, nodeIndex++, nodeCountThisRegion);
            regionNodes.add(boss);
            allNodes.add(boss);

            // Create forward branching connections within the region
            for (int i = 0; i < regionNodes.size() - 1; i++) {
                MapNode current = regionNodes.get(i);
                // 2-3 forward choices
                int choices = 2 + random.nextInt(2); // 2-3
                for (int j = 0; j < choices && i + 1 + j < regionNodes.size(); j++) {
                    current.addNextChoice(regionNodes.get(i + 1 + j));
                }
            }
        }

        // Connect boss nodes from one region to first nodes of next region
        for (int regionIdx = 0; regionIdx < regions.size() - 1; regionIdx++) {
            String currentRegion = regions.get(regionIdx);
            String nextRegion = regions.get(regionIdx + 1);

            // Find boss of current region
            MapNode currentBoss = findNodeById(currentRegion.toLowerCase() + "_boss");
            // Find first node of next region
            MapNode nextRegionStart = findNodeById(nextRegion.toLowerCase() + "_0");

            if (currentBoss != null && nextRegionStart != null) {
                currentBoss.addNextChoice(nextRegionStart);
            }
        }
    }

    private MapNode.NodeType selectNodeType(int regionPosition, int nodeCountThisRegion) {
        // Keep early and late region pacing combat-focused.
        if (regionPosition == 0 || regionPosition >= nodeCountThisRegion - 2) {
            return MapNode.NodeType.BATTLE;
        }

        int roll = random.nextInt(BATTLE_WEIGHT + CAMPFIRE_WEIGHT + BACKPACK_WEIGHT + SIGIL_TRANSFER_WEIGHT);
        if (roll < BATTLE_WEIGHT) {
            return MapNode.NodeType.BATTLE;
        }
        if (roll < BATTLE_WEIGHT + CAMPFIRE_WEIGHT) {
            return MapNode.NodeType.CAMPFIRE;
        }
        if (roll < BATTLE_WEIGHT + CAMPFIRE_WEIGHT + BACKPACK_WEIGHT) {
            return MapNode.NodeType.BACKPACK;
        }
        return MapNode.NodeType.SIGIL_TRANSFER;
    }

    // ==================== Queries ====================

    public MapNode getNodeByIndex(int index) {
        if (index >= 0 && index < allNodes.size()) {
            return allNodes.get(index);
        }
        return null;
    }

    public MapNode findNodeById(String id) {
        for (MapNode node : allNodes) {
            if (node.getId().equals(id)) {
                return node;
            }
        }
        return null;
    }

    public int getTotalNodes() {
        return allNodes.size();
    }

    public List<MapNode> getAllNodes() {
        return new ArrayList<>(allNodes);
    }

    public int getCurrentNodeIndex() {
        return currentNodeIndex;
    }

    /**
     * Updates the current node pointer so choice generation stays in sync with
     * the current run.
     */
    public void setCurrentNodeIndex(int currentNodeIndex) {
        if (currentNodeIndex < 0 || currentNodeIndex >= allNodes.size()) {
            throw new IllegalArgumentException("Invalid node index: " + currentNodeIndex);
        }
        this.currentNodeIndex = currentNodeIndex;
        MapNode current = getCurrentNode();
        if (current != null) {
            current.markVisited();
        }
    }

    /**
     * Convenience helper for moving along the generated path.
     */
    public void moveToNode(MapNode node) {
        if (node == null) {
            throw new IllegalArgumentException("node cannot be null");
        }
        setCurrentNodeIndex(node.getPosition());
    }

    public MapNode getCurrentNode() {
        return getNodeByIndex(currentNodeIndex);
    }

    /**
     * Gets the available forward choices from current position.
     */
    public List<MapNode> getAvailableChoices() {
        return getAvailableChoices(currentNodeIndex);
    }

    /**
     * Gets the available forward choices from the supplied node index.
     */
    public List<MapNode> getAvailableChoices(int nodeIndex) {
        MapNode current = getNodeByIndex(nodeIndex);
        if (current != null) {
            return new ArrayList<>(current.getNextChoices());
        }
        return new ArrayList<>();
    }

    // ==================== Debug ====================

    public void printMapStructure() {
        System.out.println("=== MAP STRUCTURE ===");
        for (String region : regions) {
            System.out.println("\n" + region + ":");
            for (MapNode node : allNodes) {
                if (node.getRegion().equals(region)) {
                    System.out.println("  " + node.getId() + " (" + node.getType() + 
                        ") -> " + node.getNextChoices().size() + " choices");
                }
            }
        }
        System.out.println("\nTotal nodes: " + allNodes.size());
    }

    @Override
    public String toString() {
        return String.format("Map{regions=%s, totalNodes=%d}", regions, allNodes.size());
    }
}
