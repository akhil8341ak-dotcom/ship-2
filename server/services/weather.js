/**
 * Microclimate and Agricultural Weather Service
 * Simulates or fetches hyper-local weather vectors, drought/flood risk metrics, and 7-day forecast.
 */

export function getFieldWeather(latitude, longitude, locationName = 'Regional Zone') {
  // Deterministic seed based on location coordinates or name hash
  const lat = latitude ? Number(latitude) : 38.5816;
  const lon = longitude ? Number(longitude) : -121.4944;
  
  const tempBase = 24 + Math.sin(lat) * 5;
  const humidityBase = 62 + Math.cos(lon) * 15;
  const rainfallMm = Math.max(0, Math.round(18 + Math.sin(lat + lon) * 12));

  // Determine drought or flood risk level based on rainfall & humidity
  let droughtRisk = "Low";
  let floodRisk = "Low";
  let climateAnomaly = "Normal seasonal conditions";

  if (rainfallMm < 8 && humidityBase < 50) {
    droughtRisk = "Moderate to High";
    climateAnomaly = "Extended dry spell detected. Soil moisture deficit alert.";
  } else if (rainfallMm > 25) {
    floodRisk = "Moderate";
    climateAnomaly = "High convective precipitation expected. Watch field drainage.";
  }

  const forecast = [
    { day: 'Mon', tempMax: Math.round(tempBase + 2), tempMin: Math.round(tempBase - 6), rainProb: 10, condition: 'Sunny' },
    { day: 'Tue', tempMax: Math.round(tempBase + 3), tempMin: Math.round(tempBase - 5), rainProb: 15, condition: 'Partly Cloudy' },
    { day: 'Wed', tempMax: Math.round(tempBase + 1), tempMin: Math.round(tempBase - 4), rainProb: 40, condition: 'Light Rain' },
    { day: 'Thu', tempMax: Math.round(tempBase - 1), tempMin: Math.round(tempBase - 7), rainProb: 65, condition: 'Showers' },
    { day: 'Fri', tempMax: Math.round(tempBase + 2), tempMin: Math.round(tempBase - 6), rainProb: 20, condition: 'Clearing' },
    { day: 'Sat', tempMax: Math.round(tempBase + 4), tempMin: Math.round(tempBase - 4), rainProb: 0, condition: 'Sunny' },
    { day: 'Sun', tempMax: Math.round(tempBase + 3), tempMin: Math.round(tempBase - 5), rainProb: 5, condition: 'Clear' },
  ];

  return {
    locationName,
    latitude: lat,
    longitude: lon,
    current: {
      temperatureC: Math.round(tempBase),
      humidityPct: Math.round(humidityBase),
      rainfall24hMm: rainfallMm,
      windSpeedKmH: 14,
      soilMoisturePct: 34,
      uvIndex: 7
    },
    riskProfile: {
      droughtRisk,
      floodRisk,
      climateAnomaly,
      heatStressRisk: tempBase > 32 ? "High" : "Low"
    },
    forecast
  };
}

export function getMarketInsights() {
  return {
    lastUpdated: new Date().toISOString(),
    commodityPrices: [
      { crop: 'Sweet Corn (Yellow #2)', currentPriceUSD: 185.50, unit: 'Metric Ton', changePct: 2.4, trend: 'up' },
      { crop: 'Roma Tomatoes (Grade A)', currentPriceUSD: 420.00, unit: 'Metric Ton', changePct: 5.1, trend: 'up' },
      { crop: 'Soybeans (Non-GMO)', currentPriceUSD: 530.00, unit: 'Metric Ton', changePct: -1.2, trend: 'down' },
      { crop: 'Wheat (Hard Red Winter)', currentPriceUSD: 245.00, unit: 'Metric Ton', changePct: 0.8, trend: 'up' },
      { crop: 'Basmati Rice', currentPriceUSD: 610.00, unit: 'Metric Ton', changePct: 1.5, trend: 'up' },
      { crop: 'Potatoes (Russet)', currentPriceUSD: 310.00, unit: 'Metric Ton', changePct: -0.4, trend: 'down' }
    ],
    marketAlerts: [
      { title: 'Tomato Fresh Market Surge', description: 'Regional demand up 14% due to processing shortages. High profitability for upcoming harvest.' },
      { title: 'Fertilizer Price Stabilization', description: 'Urea and DAP global prices have stabilized over the past 30 days.' }
    ]
  };
}
