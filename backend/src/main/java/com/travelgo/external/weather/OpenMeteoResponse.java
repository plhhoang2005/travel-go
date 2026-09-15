package com.travelgo.external.weather;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class OpenMeteoResponse {
    private double latitude;
    private double longitude;
    private DailyData daily;

    public OpenMeteoResponse() {}

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public DailyData getDaily() {
        return daily;
    }

    public void setDaily(DailyData daily) {
        this.daily = daily;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class DailyData {
        private List<String> time;

        @JsonProperty("temperature_2m_max")
        private List<Double> temperature2mMax;

        @JsonProperty("temperature_2m_min")
        private List<Double> temperature2mMin;

        @JsonProperty("precipitation_sum")
        private List<Double> precipitationSum;

        @JsonProperty("windspeed_10m_max")
        private List<Double> windspeed10mMax;

        public DailyData() {}

        public List<String> getTime() {
            return time;
        }

        public void setTime(List<String> time) {
            this.time = time;
        }

        public List<Double> getTemperature2mMax() {
            return temperature2mMax;
        }

        public void setTemperature2mMax(List<Double> temperature2mMax) {
            this.temperature2mMax = temperature2mMax;
        }

        public List<Double> getTemperature2mMin() {
            return temperature2mMin;
        }

        public void setTemperature2mMin(List<Double> temperature2mMin) {
            this.temperature2mMin = temperature2mMin;
        }

        public List<Double> getPrecipitationSum() {
            return precipitationSum;
        }

        public void setPrecipitationSum(List<Double> precipitationSum) {
            this.precipitationSum = precipitationSum;
        }

        public List<Double> getWindspeed10mMax() {
            return windspeed10mMax;
        }

        public void setWindspeed10mMax(List<Double> windspeed10mMax) {
            this.windspeed10mMax = windspeed10mMax;
        }
    }
}
