package com.travelgo.controller;

import com.travelgo.dto.PlanTripRequest;
import com.travelgo.dto.PlanTripResponse;
import com.travelgo.service.TripPlanningService;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class TripControllerTest {
    private final MockMvc mvc = MockMvcBuilders.standaloneSetup(new TripController(null))
            .setControllerAdvice(new ApiExceptionHandler()).build();

    @Test
    void ambiguousBudgetReturnsBadRequestWithFieldMessage() throws Exception {
        mvc.perform(post("/api/v1/plan-trip")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"origin":"Ho Chi Minh","numDays":3,"numPeople":2,
                                 "budgetVnd":4000000,"budgetPerPersonVnd":4000000}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value(
                        "Provide exactly one positive budgetPerPersonVnd or budgetVnd"));
    }

    @Test
    void invalidPeopleReturnBadRequestForSensitivity() throws Exception {
        mvc.perform(post("/api/v1/simulate-sensitivity")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"origin":"Ho Chi Minh","numDays":3,"numPeople":0,
                                 "budgetPerPersonVnd":4000000}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").isNotEmpty());
    }
    @Test
    void costOverflowReturnsBadRequestInsteadOfServerError() throws Exception {
        TripPlanningService overflowing = new TripPlanningService(null, null, null, null,
                null, null, null) {
            @Override
            public PlanTripResponse planTrip(PlanTripRequest request) {
                throw new ArithmeticException("long overflow");
            }
        };
        MockMvc failingMvc = MockMvcBuilders.standaloneSetup(new TripController(overflowing))
                .setControllerAdvice(new ApiExceptionHandler()).build();
        failingMvc.perform(post("/api/v1/plan-trip")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"origin":"Ho Chi Minh","numDays":1000000000,
                                 "numPeople":1000000000,"budgetPerPersonVnd":1}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").isNotEmpty());
    }
}
