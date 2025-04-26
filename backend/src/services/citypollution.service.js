// src/services/citypollution.service.js
const axios = require("axios");
const CityAQI = require("../model/citypollution.model");

const WAQI_TOKEN = process.env.WAQI_TOKEN;

// WAQI station slugs
const stationAreas = {
  delhi: {
    rohini: "rohini",
    narela: "narela",
    bawana: "bawana",
  },
  chennai: {
    manali: "manali",
    alandur: "alandur",
    perungudi: "perungudi"
  },  
  pondicherry: {
    puducherry_ucc: "puducherry"
    },
    london: {
      london : "london"
    },
    paris: {
      paris_1er: "Paris",
    },
    new_york: {
      New_york: "Newyork"
    }
};


const fetchAQIByStation = async (slug) => {
  try {
    const url = `https://api.waqi.info/feed/${slug}/?token=${WAQI_TOKEN}`;
    const response = await axios.get(url);

    if (response.data.status === "ok") {
      return {
        aqi: response.data.data.aqi,
        recordedTime: response.data.data.time.s,
        location: response.data.data.city.name,
      };
    } else {
      console.warn(`⚠️ No AQI data available for station slug: ${slug}`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Error fetching AQI for ${slug}:`, error.message);
    return null;
  }
};

const getAndSaveCityAQIData = async () => {
  for (const city in stationAreas) {
    const stations = stationAreas[city];

    for (const stationName in stations) {
      const slug = stations[stationName];
      const result = await fetchAQIByStation(slug);

      if (result) {
        try {
          await CityAQI.upsert({   //create for inserting
            city,
            station: stationName,
            aqi: result.aqi,
            recordedTime: result.recordedTime,
            location: result.location,
          });

          console.log(`✅ AQI saved: ${city} - ${stationName} (${slug})`);
        } catch (dbErr) {
          console.error(`❌ Error saving AQI data for ${stationName}:`, dbErr.message);
        }
      }
    }
  }
};

module.exports = { getAndSaveCityAQIData };


// const stationAreas = {
//   delhi: [
//     "anand vihar", "mandir marg", "punjabi bagh", "rk puram", "sirifort",
//     "dwarka", "delhi institute of tool engineering, wazirpur", "iti jahangirpuri",
//     "satyawati college", "loni, ghaziabad", "dilshad garden", "ito",
//     "shadipur", "delhi college of engineering"
//   ],
//   chennai: [
//     "alandur", "kodambakkam", "manali", "perungudi", "kodungaiyur",
//     "royapuram", "velachery residential area", "manali village", "pappankuppam", "anthoni pillai nagar"
//   ],
//   pondicherry: [
//     "indira gandhi square", "lawspet", "rajiv gandhi square", "jawahar nagar",
//     "arumparthapuram", "vaithikuppam", "vanur", "white town"
//   ]
// };


