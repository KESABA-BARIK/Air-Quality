// Simulated prediction logic using a trend formula (can be replaced with ML later)
function predictAQINextYears(currentAQI, emissionsLevel) {
    const predictions = [];

    let aqi = currentAQI;
    for (let i = 1; i <= 10; i++) {
        const growthFactor = emissionsLevel * 0.01; // Basic growth logic
        aqi += growthFactor;
        predictions.push({ year: new Date().getFullYear() + i, predictedAQI: Math.round(aqi) });
    }

    return predictions;
}

module.exports = { predictAQINextYears };
