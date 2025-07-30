const express = require("express");
const app = express();
const PORT = 5000;

let profile = require("./profiles.json");

app.use(express.json());

app.get("/api/get-profiles", (req, res) => {
  res.json(profile);
});

app.post("/api/profile", (req, res) => {
  const { name, email } = req.body;
  const newUser = { id: Date.now(), name, email };
  profile.push(newUser);
  res.json({
    message: "Profile created",
    data: newUser,
  });
});

app.put("/api/profile/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email } = req.body;
  const index = profile.findIndex((user) => user.id === id);
  if (index !== -1) {
    profile[index] = { ...profile[index], name, email };
    res.json({
      message: "Profile updated",
      data: profile[index],
    });
  } else {
    res.status(404).json({ message: "Profile not found" });
  }
});

app.delete("/api/profile/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = profile.findIndex((user) => user.id === id);
  if (index !== -1) {
    const deletedUser = profile.splice(index, 1)[0];
    res.json({
      message: "Profile deleted",
      data: deletedUser,
    });
  } else {
    res.status(404).json({ message: "Profile not found" });
  }
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
