const express = require("express");
const router = express.Router();
const userService = require("../services/user.service");

router.get("/", async (req, res) => {
  const users = await userService.getAllUsers();
  res.json(users);
});

router.post("/", async (req, res) => {
  const user = await userService.createUser(req.body);
  res.json(user);
});

router.get("/:id", async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.json(user);
});

router.put("/:id", async (req, res) => {
  const updated = await userService.updateUser(req.params.id, req.body);
  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  await userService.deleteUser(req.params.id);
  res.json({ message: "User deleted" });
});

module.exports = router;
