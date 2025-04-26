const cors = require("cors");
const express = require("express");
const sequelize = require("./config/db.config");
const dotenv = require("dotenv");
dotenv.config();
require("./model/user.model");
require("./model/userreport.model");
require("./model/trafficanalysis.model");
require("./model/factoryanalysis.model");
require("./model/admin.model");
require("./model/citypollution.model");
require("./model/chatbot.model");

// Import all routes
const userRoutes = require("./routes/user.routes");
const userReportRoutes = require("./routes/userreport.routes");
const trafficRoutes = require("./routes/trafficanalysis.routes");
const factoryRoutes = require("./routes/factoryanalysis.routes");
const adminRoutes = require("./routes/admin.routes");
const cityPollutionRoutes = require("./routes/citypollution.routes");
const chatbotRoutes = require("./routes/chatbot.routes");
const predictionRoutes = require("./routes/prediction.routes");
const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// Mount routes
app.use("/api/users", userRoutes);
// app.use("/api/reports", userReportRoutes);
app.use("/api/traffic", trafficRoutes);
app.use("/api/factories", factoryRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cities", cityPollutionRoutes);
app.use("/api/userreports", require("./routes/userreport.routes"));
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/prediction", predictionRoutes);



// Sync DB
sequelize.sync({ alter: true })  // alter:true updates schema without dropping tables
  .then(() => console.log("✅ Database synced successfully"))
  .catch(err => console.error("❌ Failed to sync DB:", err));

module.exports = app;
