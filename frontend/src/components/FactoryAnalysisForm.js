import React, { useState, useEffect } from "react";
import "./FactoryAnalysisForm.css";

const FactoryAnalysisForm = () => {
  const [factoryName, setFactoryName] = useState("");
  const [location, setLocation] = useState("");
  const [emissionsLevel, setEmissionsLevel] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentAnalyses, setRecentAnalyses] = useState([]);

  // Load recent analyses from localStorage on component mount
  useEffect(() => {
    const savedAnalyses = localStorage.getItem("factoryAnalyses");
    if (savedAnalyses) {
      setRecentAnalyses(JSON.parse(savedAnalyses));
    }
  }, []);

  const handleAnalyze = async (e) => {
    e.preventDefault();

    if (!factoryName || !location || !emissionsLevel) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Simulate API call with timeout
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            ok: true,
            json: () => ({
              factoryName,
              location,
              emissionsLevel: parseFloat(emissionsLevel),
              aqi: Math.floor(Math.random() * 300) + 50, // Random AQI for demo
              alert: getRandomAlertStatus(),
              timestamp: new Date().toISOString(),
            }),
          });
        }, 1500);
      });

      if (!response.ok) throw new Error("AI Analysis failed!");

      const data = await response.json();
      setResult(data);

      // Save to recent analyses
      const updatedAnalyses = [data, ...recentAnalyses.slice(0, 4)];
      setRecentAnalyses(updatedAnalyses);
      localStorage.setItem("factoryAnalyses", JSON.stringify(updatedAnalyses));
    } catch (err) {
      console.error("❌ Error:", err.message);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getRandomAlertStatus = () => {
    const alerts = [
      "Normal,Pollution levels are under control. Maintain current practices and continue regular monitoring.",
      "Warning,Pollution levels are approaching limits. Consider preventive measures.",
      "Danger,Moderate pollution detected. Upgrade equipment and optimize processes.",
      "Critical,High pollution levels! Take immediate action to reduce emissions.",
    ];
    return alerts[Math.floor(Math.random() * alerts.length)];
  };

  const getAlertColorClass = (alert) => {
    if (!alert) return "";
    const status = alert.split(",")[0].toLowerCase();
    return `alert-${status}`;
  };

  return (
    <div className="factory-form-container">
      <h2 className="form-title">Factory Pollution Risk Analyzer</h2>

      <form onSubmit={handleAnalyze} className="factory-form">
        <div className="form-group">
          <label>Factory Name:</label>
          <input
            type="text"
            value={factoryName}
            onChange={(e) => setFactoryName(e.target.value)}
            required
            className="form-input"
            placeholder="Enter factory name"
          />
        </div>

        <div className="form-group">
          <label>Location (City):</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="form-input"
            placeholder="Enter city location"
          />
        </div>

        <div className="form-group">
          <label>Emissions Level (ppm):</label>
          <input
            type="number"
            value={emissionsLevel}
            onChange={(e) => setEmissionsLevel(e.target.value)}
            required
            min="0"
            step="0.01"
            className="form-input"
            placeholder="Enter emissions level"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`submit-btn ${loading ? "loading" : ""}`}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Analyzing...
            </>
          ) : (
            "Submit for Analysis"
          )}
        </button>

        {error && <div className="error-message">{error}</div>}
      </form>

      {/* Result Section */}
      {result && (
        <div className="result-container fade-in">
          <h3>Analysis Result</h3>
          <div className="result-grid">
            <div className="result-item">
              <strong>Factory:</strong> {result.factoryName}
            </div>
            <div className="result-item">
              <strong>Location:</strong> {result.location}
            </div>
            <div className="result-item">
              <strong>Emissions:</strong> {result.emissionsLevel} ppm
            </div>
            <div className="result-item">
              <strong>Live AQI:</strong> {result.aqi}
            </div>
            <div className="result-item">
              <strong>Status:</strong>
              <span
                className={`alert-status ${getAlertColorClass(result.alert)}`}
              >
                {result.alert.split(",")[0]}
              </span>
            </div>
          </div>
          <div className="recommendation">
            <h4>Recommendation:</h4>
            <p>{result.alert.split(",")[1]}</p>
          </div>
        </div>
      )}

      {/* Recent Analyses Section */}
      {recentAnalyses.length > 0 && (
        <div className="recent-analyses">
          <h3>Recent Analyses</h3>
          <div className="analyses-grid">
            {recentAnalyses.map((analysis, index) => (
              <div key={index} className="analysis-card">
                <div className="card-header">
                  <span className="factory-name">{analysis.factoryName}</span>
                  <span
                    className={`status-badge ${getAlertColorClass(
                      analysis.alert
                    )}`}
                  >
                    {analysis.alert.split(",")[0]}
                  </span>
                </div>
                <div className="card-details">
                  <span>AQI: {analysis.aqi}</span>
                  <br></br>
                  <span>{new Date(analysis.timestamp).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FactoryAnalysisForm;
