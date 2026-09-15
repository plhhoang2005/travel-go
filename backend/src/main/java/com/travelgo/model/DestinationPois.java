package com.travelgo.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class DestinationPois {

    @JsonProperty("destination_id")
    private String destinationId;

    private List<PoiItem> pois;

    public DestinationPois() {}

    public String getDestinationId() { return destinationId; }
    public void setDestinationId(String destinationId) { this.destinationId = destinationId; }

    public List<PoiItem> getPois() { return pois; }
    public void setPois(List<PoiItem> pois) { this.pois = pois; }

    public static class PoiItem {
        private String name;
        private String type;

        @JsonProperty("cost_vnd")
        private long costVnd;

        @JsonProperty("duration_hours")
        private double durationHours;

        @JsonProperty("time_of_day")
        private String timeOfDay;

        public PoiItem() {}

        public PoiItem(String name, String type, long costVnd, double durationHours, String timeOfDay) {
            this.name = name;
            this.type = type;
            this.costVnd = costVnd;
            this.durationHours = durationHours;
            this.timeOfDay = timeOfDay;
        }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public long getCostVnd() { return costVnd; }
        public void setCostVnd(long costVnd) { this.costVnd = costVnd; }

        public double getDurationHours() { return durationHours; }
        public void setDurationHours(double durationHours) { this.durationHours = durationHours; }

        public String getTimeOfDay() { return timeOfDay; }
        public void setTimeOfDay(String timeOfDay) { this.timeOfDay = timeOfDay; }
    }
}
