const adminService = require("../services/admin.service");
const jwt = require("jsonwebtoken");

// Hardcoded city-email mapping
const emailToCityMap = {
  "delhiadmin@aqi.com": "Delhi",
  "chennaiadmin@aqi.com": "Chennai",
  "puducherryadmin@aqi.com": "Puducherry",
  "mumbaiadmin@aqi.com": "Mumbai",
};

const loginAdmin = (req, res) => {
  const { email, password } = req.body;

  const validPasswords = {
    "delhiadmin@aqi.com": "admin123",
    "chennaiadmin@aqi.com": "admin123",
    "puducherryadmin@aqi.com": "admin123",
    "mumbaiadmin@aqi.com": "admin123",
  };

  if (emailToCityMap[email] && validPasswords[email] === password) {
    const token = jwt.sign({ email, city: emailToCityMap[email] }, process.env.JWT_SECRET, { expiresIn: "2h" });
    return res.status(200).json({ token, city: emailToCityMap[email], message: "Login successful" });
  }

  return res.status(401).json({ error: "Invalid email or password" });
};

const getReportsByAdminEmail = async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const reports = await adminService.getReportsByAdminEmail(email);
    res.json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// ✅ EXPORT BOTH FUNCTIONS HERE
module.exports = {
  loginAdmin,
  getReportsByAdminEmail,
};
