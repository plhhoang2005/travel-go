package com.travelgo.external.weather;

public class WeatherInfo {
    private double weatherScore;
    private String source;
    private double avgPrecipitation;
    private double avgTempMax;

    public WeatherInfo() {}

    public WeatherInfo(double weatherScore, String source) {
        this.weatherScore = weatherScore;
        this.source = source;
    }

    public WeatherInfo(double weatherScore, String source, double avgPrecipitation, double avgTempMax) {
        this.weatherScore = weatherScore;
        this.source = source;
        this.avgPrecipitation = avgPrecipitation;
        this.avgTempMax = avgTempMax;
    }

    public double getWeatherScore() {
        return weatherScore;
    }

    public void setWeatherScore(double weatherScore) {
        this.weatherScore = weatherScore;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public double getAvgPrecipitation() {
        return avgPrecipitation;
    }

    public void setAvgPrecipitation(double avgPrecipitation) {
        this.avgPrecipitation = avgPrecipitation;
    }

    public double getAvgTempMax() {
        return avgTempMax;
    }

    public void setAvgTempMax(double avgTempMax) {
        this.avgTempMax = avgTempMax;
    }
}
