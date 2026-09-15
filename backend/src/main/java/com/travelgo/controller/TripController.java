package com.travelgo.controller;

import com.travelgo.dto.BudgetSensitivityResult;
import com.travelgo.dto.PlanTripRequest;
import com.travelgo.dto.PlanTripResponse;
import com.travelgo.service.TripPlanningService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class TripController {

    private final TripPlanningService tripPlanningService;

    @Autowired
    public TripController(TripPlanningService tripPlanningService) {
        this.tripPlanningService = tripPlanningService;
    }

    @PostMapping("/plan-trip")
    public ResponseEntity<PlanTripResponse> planTrip(@RequestBody PlanTripRequest request) {
        PlanTripResponse response = tripPlanningService.planTrip(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/simulate-sensitivity")
    public ResponseEntity<BudgetSensitivityResult> simulateSensitivity(@RequestBody PlanTripRequest request) {
        BudgetSensitivityResult result = tripPlanningService.simulateSensitivity(request);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        return ResponseEntity.ok(Map.of("status", "UP", "system", "TravelGO Decision Intelligence Backend"));
    }
}
