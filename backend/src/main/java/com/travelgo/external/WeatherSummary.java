package com.travelgo.external;

import java.time.LocalDate;

public record WeatherSummary(
        String destinationId,
        LocalDate fromDate,
        LocalDate toDate,
        double temperatureMinC,
        double temperatureMaxC,
        double precipitationProbabilityMax,
        double precipitationSumMm,
        double windSpeedMaxKmh,
        int weatherCode,
        double suitabilityScore,
        WeatherSource source
) {}
