import React, { useState } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./TrafficAnalysis.css";

import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix leaflet's default icon paths
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const OPENROUTESERVICE_API_KEY = process.env.REACT_APP_OPENROUTESERVICE_API_KEY;

const TrafficAnalysis = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [routeCoords, setRouteCoords] = useState([]);
  const [aqiPoints, setAqiPoints] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [routeSafety, setRouteSafety] = useState("");

  const handleSourceChange = (e) => setSource(e.target.value);
  const handleDestinationChange = (e) => setDestination(e.target.value);

  const fetchRealAqi = async (lat, lon) => {
    const WAQI_API_KEY = process.env.REACT_APP_WAQI_API_KEY;
    const url = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${WAQI_API_KEY}`;

    try {
      const res = await axios.get(url);
      if (res.data.status === "ok") {
        return res.data.data.aqi; // AQI value
      } else {
        console.error("WAQI API error:", res.data.data);
        return null;
      }
    } catch (error) {
      console.error("Error fetching AQI from WAQI:", error);
      return null;
    }
  };

  const getAqiColor = (aqi) => {
    if (aqi <= 50) return "green";
    if (aqi > 50 && aqi <= 100) return "blue";
    if (aqi > 100 && aqi <= 150) return "orange";
    if (aqi > 150 && aqi <= 200) return "red";
    return "purple"; // for very poor
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!source || !destination) {
      setResponseMessage("Please provide both source and destination.");
      return;
    }

    setIsLoading(true);
    setResponseMessage("");
    setRouteSafety("");

    try {
      const sourceCoords = await geocodeLocation(source);
      const destinationCoords = await geocodeLocation(destination);

      if (!sourceCoords || !destinationCoords) {
        setResponseMessage(
          "Could not find coordinates for source or destination."
        );
        return;
      }

      const route = await fetchRoute(sourceCoords, destinationCoords);
      setRouteCoords(route);

      const sampledPoints = samplePoints(route, 10);
      const aqiData = await Promise.all(
        sampledPoints.map(async (point) => {
          const aqi = await fetchRealAqi(point[0], point[1]);
          return {
            latlng: point,
            aqi: aqi !== null ? aqi : "No data",
          };
        })
      );
      setAqiPoints(aqiData);

      const aqiValues = aqiData
        .map((p) => p.aqi)
        .filter((aqi) => typeof aqi === "number" && aqi >= 0);

      if (aqiValues.length < 5) {
        setRouteSafety("Insufficient data ⚠️");
      } else {
        const highAqiCount = aqiValues.filter((aqi) => aqi > 70).length;
        const safetyRatio = highAqiCount / aqiValues.length;

        if (safetyRatio >= 0.4) {
          setRouteSafety("NOT SAFE ❌");
        } else {
          setRouteSafety("SAFE ✅");
        }
      }

      setResponseMessage("Route analyzed successfully.");
    } catch (error) {
      console.error(error);
      setResponseMessage("Error analyzing the route.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="traffic-analysis">
      <h2>Traffic Route Analysis</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="source">Source:</label>
          <input
            type="text"
            id="source"
            value={source}
            onChange={handleSourceChange}
            placeholder="Enter source city"
            required
          />
        </div>

        <div>
          <label htmlFor="destination">Destination:</label>
          <input
            type="text"
            id="destination"
            value={destination}
            onChange={handleDestinationChange}
            placeholder="Enter destination city"
            required
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Analyzing..." : "Analyze Route"}
        </button>
      </form>

      {responseMessage && <p>{responseMessage}</p>}

      {routeCoords.length > 0 && (
        <>
          <MapContainer
            center={routeCoords[0]}
            zoom={6}
            style={{ height: "400px", marginTop: "20px" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <Polyline
              positions={routeCoords}
              color="blue"
              weight={5}
              opacity={0.7}
              dashArray="5, 10"
            />
            {aqiPoints.map((point, idx) => (
              <Marker key={idx} position={point.latlng}>
                <Popup>
                  {typeof point.aqi === "number" ? (
                    <>
                      <div style={{ color: getAqiColor(point.aqi) }}>
                        AQI: {point.aqi}
                        <br />
                        {point.aqi <= 50 && "Good 🍃"}
                        {point.aqi > 50 && point.aqi <= 100 && "Fair "}
                        {point.aqi > 100 && point.aqi <= 150 && "Moderate "}
                        {point.aqi > 150 && point.aqi <= 200 && "Poor "}
                        {point.aqi > 200 && "Very Poor "}
                      </div>
                    </>
                  ) : (
                    <>AQI data unavailable ❓</>
                  )}
                </Popup>
                {/* Customizing marker icon color based on AQI */}
                <Marker
                  key={idx}
                  position={point.latlng}
                  icon={
                    new L.Icon({
                      iconUrl:
                        point.aqi <= 50
                          ? "https://example.com/green-icon.png"
                          : point.aqi > 50 && point.aqi <= 100
                          ? "https://example.com/yellow-icon.png"
                          : point.aqi > 100 && point.aqi <= 150
                          ? "https://example.com/orange-icon.png"
                          : point.aqi > 150
                          ? "https://example.com/red-icon.png"
                          : "https://example.com/default-icon.png", // Fallback icon
                      iconSize: [25, 41],
                      iconAnchor: [12, 41],
                      popupAnchor: [1, -34],
                    })
                  }
                />
              </Marker>
            ))}
          </MapContainer>

          {routeSafety && (
            <p
              style={{
                marginTop: "15px",
                fontWeight: "bold",
                fontSize: "18px",
              }}
            >
              Overall Route Status: {routeSafety}
            </p>
          )}
        </>
      )}
    </div>
  );
};

const geocodeLocation = async (location) => {
  const url = `https://api.openrouteservice.org/geocode/search?api_key=${OPENROUTESERVICE_API_KEY}&text=${encodeURIComponent(
    location
  )}`;
  const res = await axios.get(url);
  const coords = res.data?.features?.[0]?.geometry?.coordinates;
  if (coords) {
    return [coords[1], coords[0]];
  }
  return null;
};

const fetchRoute = async (start, end) => {
  const url = `https://api.openrouteservice.org/v2/directions/driving-car/geojson`;
  const body = {
    coordinates: [
      [start[1], start[0]],
      [end[1], end[0]],
    ],
  };
  const res = await axios.post(url, body, {
    headers: {
      Authorization: OPENROUTESERVICE_API_KEY,
      "Content-Type": "application/json",
    },
  });
  const coords = res.data.features[0].geometry.coordinates;
  return coords.map(([lng, lat]) => [lat, lng]);
};

const samplePoints = (coords, numPoints) => {
  if (coords.length <= numPoints) return coords;
  const sampled = [];
  const step = Math.floor(coords.length / numPoints);
  for (let i = 0; i < coords.length; i += step) {
    sampled.push(coords[i]);
  }
  return sampled;
};

export default TrafficAnalysis;
