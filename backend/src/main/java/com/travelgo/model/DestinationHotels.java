package com.travelgo.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class DestinationHotels {

    @JsonProperty("destination_id")
    private String destinationId;

    private List<HotelCategory> categories;

    public DestinationHotels() {}

    public String getDestinationId() { return destinationId; }
    public void setDestinationId(String destinationId) { this.destinationId = destinationId; }

    public List<HotelCategory> getCategories() { return categories; }
    public void setCategories(List<HotelCategory> categories) { this.categories = categories; }

    public static class HotelCategory {
        private String tier;
        private String name;

        @JsonProperty("avg_nightly_vnd")
        private long avgNightlyVnd;

        public HotelCategory() {}

        public String getTier() { return tier; }
        public void setTier(String tier) { this.tier = tier; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public long getAvgNightlyVnd() { return avgNightlyVnd; }
        public void setAvgNightlyVnd(long avgNightlyVnd) { this.avgNightlyVnd = avgNightlyVnd; }
    }
}
