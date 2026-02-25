const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = "wsc_weak_secret";

const dataDir = path.join(__dirname, "data");
const usersFile = path.join(dataDir, "users.json");
const projectsFile = path.join(dataDir, "projects.json");
const votesFile = path.join(dataDir, "votes.json");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const users = readJson(usersFile);

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    {
      email: user.email,
      role: user.role,
    },
    JWT_SECRET
  );

  return res.json({ token });
});

app.get("/api/projects", (_req, res) => {
  const projects = readJson(projectsFile);
  return res.json(projects);
});

app.post("/api/vote", (req, res) => {
  const votes = readJson(votesFile);

  const vote = {
    id: `V-${Date.now()}`,
    ...req.body,
    submittedAt: new Date().toISOString(),
  };

  votes.push(vote);
  writeJson(votesFile, votes);

  return res.status(201).json({ message: "Vote submitted", vote });
});

app.get("/api/admin/votes", authenticateToken, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }

  const votes = readJson(votesFile);
  return res.json(votes);
});

app.get("/api/debug/config", (_req, res) => {
  return res.json({
    adminEmail: "admin@wsc.local",
    note: "Remove before production",
  });
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`WSC Demo Lab running on port ${PORT}`);
});