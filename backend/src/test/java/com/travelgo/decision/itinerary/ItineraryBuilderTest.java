package com.travelgo.decision.itinerary;

import com.travelgo.dto.PlanTripResponse.ItineraryDay;
import com.travelgo.model.DestinationPois.PoiItem;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class ItineraryBuilderTest {

    private ItineraryBuilder builder;

    @BeforeEach
    public void setUp() {
        builder = new ItineraryBuilder();
    }

    @Test
    public void testBuildItineraryPoiConstraints() {
        List<PoiItem> pois = new ArrayList<>();
        pois.add(new PoiItem("Ăn sáng Bánh mì xíu mại", "food", 40000L, 1.0, "morning"));
        pois.add(new PoiItem("Hồ Xuân Hương", "sightseeing", 0L, 1.5, "morning"));
        pois.add(new PoiItem("Thung lũng Tình Yêu", "sightseeing", 250000L, 2.5, "afternoon"));
        pois.add(new PoiItem("Cafe Túi Mơ To", "cafe", 80000L, 1.5, "afternoon"));
        pois.add(new PoiItem("Chợ Đêm Đà Lạt", "food", 180000L, 2.5, "evening"));
        pois.add(new PoiItem("Đồi Cầu Đất", "sightseeing", 0L, 2.5, "morning"));
        pois.add(new PoiItem("Vườn hoa Đà Lạt", "sightseeing", 100000L, 2.0, "afternoon"));

        List<ItineraryDay> days = builder.buildItinerary("da-lat", 2, 500_000L, pois);

        assertEquals(2, days.size());
        for (ItineraryDay day : days) {
            assertTrue(day.getActivities().size() >= ItineraryBuilder.MIN_POIS_PER_DAY);
            assertTrue(day.getActivities().size() <= ItineraryBuilder.MAX_POIS_PER_DAY);
        }
    }
}
