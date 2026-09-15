package com.travelgo.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Map;

public class PricingData {

    @JsonProperty("reference_month")
    private String referenceMonth;

    private String disclaimer;

    @JsonProperty("food_daily_estimate")
    private Map<String, Long> foodDailyEstimate;

    public PricingData() {}

    public String getReferenceMonth() { return referenceMonth; }
    public void setReferenceMonth(String referenceMonth) { this.referenceMonth = referenceMonth; }

    public String getDisclaimer() { return disclaimer; }
    public void setDisclaimer(String disclaimer) { this.disclaimer = disclaimer; }

    public Map<String, Long> getFoodDailyEstimate() { return foodDailyEstimate; }
    public void setFoodDailyEstimate(Map<String, Long> foodDailyEstimate) { this.foodDailyEstimate = foodDailyEstimate; }
}
