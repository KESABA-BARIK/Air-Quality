const { predictAQINextYears } = require("../services/prediction.service");

exports.predictAQI = (req, res) => {
    const { currentAQI, emissionsLevel } = req.body;

    if (!currentAQI || !emissionsLevel) {
        return res.status(400).json({ error: "Please provide currentAQI and emissionsLevel" });
    }

    const predictions = predictAQINextYears(currentAQI, emissionsLevel);
    res.json({ predictions });
};
