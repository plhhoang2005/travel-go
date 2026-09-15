package com.travelgo.external;

public final class WeatherScorer {
    private WeatherScorer() {}

    public static double score(
            double temperatureMinC,
            double temperatureMaxC,
            double precipitationProbabilityMax,
            double precipitationSumMm,
            double windSpeedMaxKmh
    ) {
        double meanTemperature = (temperatureMinC + temperatureMaxC) / 2.0;
        double temperaturePenalty = meanTemperature < 18
                ? Math.min(3, (18 - meanTemperature) * 0.25)
                : Math.min(3, Math.max(0, meanTemperature - 28) * 0.25);
        double rainProbabilityPenalty = Math.min(3, precipitationProbabilityMax * 0.03);
        double rainAmountPenalty = Math.min(2, precipitationSumMm / 10.0);
        double windPenalty = Math.min(2, Math.max(0, windSpeedMaxKmh - 25) * 0.08);

        double result = Math.max(0, Math.min(10,
                10 - temperaturePenalty - rainProbabilityPenalty - rainAmountPenalty - windPenalty));
        return Math.round(result * 100.0) / 100.0;
    }
}
