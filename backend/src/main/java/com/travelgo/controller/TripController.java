package com.travelgo.controller;

import com.travelgo.decision.budget.BudgetCalculator;
import com.travelgo.dto.BudgetSensitivityResult;
import com.travelgo.dto.PlanTripRequest;
import com.travelgo.dto.PlanTripResponse;
import com.travelgo.service.TripPlanningService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.*;

import com.travelgo.model.Destination;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class TripController {

    private final TripPlanningService tripPlanningService;

    @Autowired
    public TripController(TripPlanningService tripPlanningService) {
        this.tripPlanningService = tripPlanningService;
    }

    @GetMapping("/destinations")
    public ResponseEntity<List<Destination>> getAllDestinations() {
        return ResponseEntity.ok(tripPlanningService.getAllDestinations());
    }

    @PostMapping("/plan-trip")
    public ResponseEntity<PlanTripResponse> planTrip(@RequestBody PlanTripRequest request) {
        validateBudget(request);
        PlanTripResponse response = tripPlanningService.planTrip(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/simulate-sensitivity")
    public ResponseEntity<BudgetSensitivityResult> simulateSensitivity(@RequestBody PlanTripRequest request) {
        validateBudget(request);
        BudgetSensitivityResult result = tripPlanningService.simulateSensitivity(request);
        return ResponseEntity.ok(result);
    }

    private void validateBudget(PlanTripRequest request) {
        try {
            BudgetCalculator.totalBudget(request);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        return ResponseEntity.ok(Map.of("status", "UP", "system", "TravelGO Decision Intelligence Backend"));
    }
}
