package com.travelgo.external.weather;

import java.util.Map;

public interface OpenMeteoClient {
    double[] getCoordinates(String cityId);
    OpenMeteoResponse fetchForecast(double latitude, double longitude);
    OpenMeteoResponse fetchForecastForCity(String cityId);
    Map<String, double[]> getCityCoordinatesMap();
}
