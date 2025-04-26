const express = require('express');
const router = express.Router();
const admin = require('../config/firebase.config');

router.post('/register', async (req, res) => {
  const { email, password, displayName } = req.body;

  try {
    const user = await admin.auth().createUser({
      email,
      password,
      displayName,
    });
    res.status(201).json({ message: 'User created successfully', user });
  } catch (err) {
    res.status(400).json({ message: 'Error creating user', error: err });
  }
});

router.post('/verify-token', async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    res.status(200).json({ message: 'Token verified', user: decoded });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token', error: err });
  }
});

module.exports = router;
