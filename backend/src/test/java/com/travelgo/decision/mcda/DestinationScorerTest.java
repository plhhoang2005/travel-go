package com.travelgo.decision.mcda;

import com.travelgo.dto.PlanTripRequest;
import com.travelgo.dto.PlanTripResponse.DestinationCard;
import com.travelgo.model.Destination;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class DestinationScorerTest {

    private DestinationScorer scorer;

    @BeforeEach
    public void setUp() {
        scorer = new DestinationScorer();
    }

    @Test
    public void testConstants() {
        assertEquals(0.30, DestinationScorer.WEIGHT_BUDGET, 0.001);
        assertEquals(0.20, DestinationScorer.WEIGHT_WEATHER, 0.001);
        assertEquals(0.25, DestinationScorer.WEIGHT_PREFERENCE, 0.001);
        assertEquals(0.15, DestinationScorer.WEIGHT_TRAVEL_TIME, 0.001);
        assertEquals(0.10, DestinationScorer.WEIGHT_UNIQUENESS, 0.001);

        double totalWeight = DestinationScorer.WEIGHT_BUDGET +
                DestinationScorer.WEIGHT_WEATHER +
                DestinationScorer.WEIGHT_PREFERENCE +
                DestinationScorer.WEIGHT_TRAVEL_TIME +
                DestinationScorer.WEIGHT_UNIQUENESS;

        assertEquals(1.00, totalWeight, 0.001);
    }

    @Test
    public void testScoreDestinationNormal() {
        Destination dest = new Destination();
        dest.setId("da-lat");
        dest.setName("Đà Lạt");
        dest.setTags(List.of("mountain", "romantic", "food"));
        dest.setUniquenessScore(8.5);

        PlanTripRequest req = new PlanTripRequest("Ho Chi Minh", 3, 1, 4_000_000L, List.of("mountain", "food"), "balanced");

        DestinationCard card = scorer.scoreDestination(dest, req, 8.5, 6.0, 3_500_000L);

        assertNotNull(card);
        assertEquals("da-lat", card.getId());
        assertNotNull(card.getNormalizedScores());
        assertNotNull(card.getScoreContributions());

        assertTrue(card.getNormalizedScores().containsKey(DestinationScorer.KEY_BUDGET));
        assertTrue(card.getNormalizedScores().containsKey(DestinationScorer.KEY_WEATHER));
        assertTrue(card.getNormalizedScores().containsKey(DestinationScorer.KEY_PREFERENCE));
        assertTrue(card.getNormalizedScores().containsKey(DestinationScorer.KEY_TRAVEL_TIME));
        assertTrue(card.getNormalizedScores().containsKey(DestinationScorer.KEY_UNIQUENESS));

        assertTrue(card.getTotalScore() >= 0.0 && card.getTotalScore() <= 10.0);
    }
}
