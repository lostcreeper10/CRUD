const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 5000;

app.use(express.json());

let profile = require("./profiles.json");

let nextId = profile.length > 0 ? Math.max(...profile.map(u => u.id || 0)) + 1 : 1;

app.get("/api/get-profile", (req, res) => {
  res.json(profile);
});

app.get("/api/get-profile/:id", (req, res) => {
  const { id } = req.params;
  const user = profile.find(u => u.id === parseInt(id));
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

app.post("/api/add-profile", (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  const newUser = { id: nextId++, name, email };
  profile.push(newUser);
  fs.writeFileSync("./profiles.json", JSON.stringify(profile, null, 2));
  res.status(201).json(newUser);
});

app.put("/api/update-profile/:id", (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const user = profile.find(u => u.id === parseInt(id));
  if (!user) return res.status(404).json({ message: "User not found" });

  user.name = name;
  user.email = email;
  fs.writeFileSync("./profiles.json", JSON.stringify(profile, null, 2));
  res.json(user);
});

app.delete("/api/delete-profile/:id", (req, res) => {
  const { id } = req.params;
  const index = profile.findIndex(u => u.id === parseInt(id));
  if (index === -1) return res.status(404).json({ message: "User not found" });

  const deletedUser = profile.splice(index, 1)[0];
  fs.writeFileSync("./profiles.json", JSON.stringify(profile, null, 2));
  res.json(deletedUser);
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
