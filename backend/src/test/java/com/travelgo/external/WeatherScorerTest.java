package com.travelgo.external;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class WeatherScorerTest {
    @Test
    void scoreAlwaysStaysInRange() {
        assertThat(WeatherScorer.score(-30, -20, 100, 500, 200)).isBetween(0.0, 10.0);
        assertThat(WeatherScorer.score(20, 27, 0, 0, 10)).isEqualTo(10.0);
    }

    @Test
    void pleasantDryWeatherScoresHigherThanStormyWeather() {
        double pleasant = WeatherScorer.score(20, 27, 10, 0, 12);
        double stormy = WeatherScorer.score(25, 34, 95, 80, 60);
        assertThat(pleasant).isGreaterThan(stormy);
    }
}
