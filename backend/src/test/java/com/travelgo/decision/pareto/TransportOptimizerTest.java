package com.travelgo.decision.pareto;

import com.travelgo.dto.PlanTripResponse.TransportOption;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class TransportOptimizerTest {

    private TransportOptimizer optimizer;

    @BeforeEach
    public void setUp() {
        optimizer = new TransportOptimizer();
    }

    @Test
    public void testParetoDominanceAndTradeoffs() {
        List<TransportOption> options = new ArrayList<>();

        // Option A: Cheap but slow (500k, 7.5h, comfort 7)
        TransportOption bus = new TransportOption();
        bus.setMode("xe_khach");
        bus.setDisplayName("Xe khách");
        bus.setPriceTotalVnd(500_000L);
        bus.setDurationHours(7.5);
        bus.setComfortScore(7);
        options.add(bus);

        // Option B: Fast but expensive (1.8M, 1.0h, comfort 9)
        TransportOption flight = new TransportOption();
        flight.setMode("may_bay");
        flight.setDisplayName("Máy bay");
        flight.setPriceTotalVnd(1_800_000L);
        flight.setDurationHours(1.0);
        flight.setComfortScore(9);
        options.add(flight);

        // Option C: Dominated option (2.0M, 8.0h, comfort 5) - Strictly worse than bus and flight
        TransportOption bad = new TransportOption();
        bad.setMode("xe_om");
        bad.setDisplayName("Xe ôm");
        bad.setPriceTotalVnd(2_000_000L);
        bad.setDurationHours(8.0);
        bad.setComfortScore(5);
        options.add(bad);

        List<TransportOption> result = optimizer.optimize(options);

        assertTrue(bus.isParetoOptimal());
        assertTrue(flight.isParetoOptimal());
        assertFalse(bad.isParetoOptimal());

        assertEquals(TransportOptimizer.TRADEOFF_CHEAPEST, bus.getTradeoffType());
        assertEquals(TransportOptimizer.TRADEOFF_FASTEST, flight.getTradeoffType());
        assertEquals(TransportOptimizer.TRADEOFF_SUBOPTIMAL, bad.getTradeoffType());
    }
}
