package game;

import java.io.*;
import java.nio.file.*;

/**
 * Handles persistence of high score data to disk.
 * High score is tracked as: [battles won, highest node reached]
 */
public class RunPersistence {
    private static final String HIGH_SCORE_FILE = "inscryption_highscore.txt";

    /**
     * Inner class to hold high score info.
     */
    public static class HighScore {
        public int battlesWon;
        public int nodeReached;

        public HighScore(int battlesWon, int nodeReached) {
            this.battlesWon = battlesWon;
            this.nodeReached = nodeReached;
        }

        @Override
        public String toString() {
            return String.format("HighScore{battlesWon=%d, nodeReached=%d}", 
                battlesWon, nodeReached);
        }
    }

    /**
     * Loads the high score from file if it exists.
     * Returns a new HighScore with 0 values if file doesn't exist.
     */
    public static HighScore loadHighScore() {
        try {
            Path filePath = Paths.get(HIGH_SCORE_FILE);
            if (Files.exists(filePath)) {
                String content = Files.readString(filePath);
                String[] parts = content.trim().split(",");
                if (parts.length == 2) {
                    int battlesWon = Integer.parseInt(parts[0]);
                    int nodeReached = Integer.parseInt(parts[1]);
                    System.out.println("[RunPersistence] Loaded high score: " + 
                        new HighScore(battlesWon, nodeReached));
                    return new HighScore(battlesWon, nodeReached);
                }
            }
        } catch (IOException | NumberFormatException e) {
            System.err.println("[RunPersistence] Error loading high score: " + e.getMessage());
        }

        // Default: no high score yet
        System.out.println("[RunPersistence] No high score file found. Starting fresh.");
        return new HighScore(0, 0);
    }

    /**
     * Updates the high score if the new run was better.
     * Compares first by node reached, then by battles won as tiebreaker.
     */
    public static void updateHighScore(int battlesWon, int nodeReached) {
        try {
            HighScore current = loadHighScore();

            boolean isNewHighScore = false;
            if (nodeReached > current.nodeReached) {
                isNewHighScore = true;
            } else if (nodeReached == current.nodeReached && battlesWon > current.battlesWon) {
                isNewHighScore = true;
            }

            if (isNewHighScore) {
                String data = battlesWon + "," + nodeReached;
                Files.writeString(Paths.get(HIGH_SCORE_FILE), data);
                System.out.println("[RunPersistence] New high score saved: " + 
                    new HighScore(battlesWon, nodeReached));
            } else {
                System.out.println("[RunPersistence] High score not beaten. Current best: " + current);
            }
        } catch (IOException e) {
            System.err.println("[RunPersistence] Error saving high score: " + e.getMessage());
        }
    }

    /**
     * Clears the high score file (for testing/reset).
     */
    public static void clearHighScore() {
        try {
            Files.deleteIfExists(Paths.get(HIGH_SCORE_FILE));
            System.out.println("[RunPersistence] High score cleared.");
        } catch (IOException e) {
            System.err.println("[RunPersistence] Error clearing high score: " + e.getMessage());
        }
    }
}
