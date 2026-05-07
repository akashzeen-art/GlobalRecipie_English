import path from "path";
import "dotenv/config";
import * as express from "express";
import express__default from "express";
import cors from "cors";
const handleDemo = (req, res) => {
  const response = {
    message: "Hello from Express server"
  };
  res.status(200).json(response);
};
const BASE = "http://oncook.co/adpoke/cnt";
const PRODUCT = "RCT";
const handleSubStatus = async (req, res) => {
  const id = req.query.msisdn || req.query.subid;
  if (!id) return res.status(400).json({ status: 0, msisdn: null });
  try {
    const r = await fetch(`${BASE}/sub/status?msisdn=${encodeURIComponent(id)}&productcode=${PRODUCT}`);
    const data = await r.json();
    res.json(data);
  } catch {
    res.status(500).json({ status: 0, msisdn: null });
  }
};
const handleSubDetail = async (req, res) => {
  const id = req.query.msisdn || req.query.subid;
  if (!id) return res.status(400).json({ status: 0 });
  try {
    const r = await fetch(`${BASE}/sub/detail?msisdn=${encodeURIComponent(id)}&productcode=${PRODUCT}`);
    const data = await r.json();
    res.json(data);
  } catch {
    res.status(500).json({ status: 0 });
  }
};
const handleDeactivate = async (req, res) => {
  const id = req.query.msisdn || req.query.subid;
  if (!id) return res.status(400).json({ status: false, msg: "Missing identifier" });
  try {
    const r = await fetch(`${BASE}/deact?msisdn=${encodeURIComponent(id)}&productcode=${PRODUCT}`);
    const text = await r.text();
    if (text.includes("<!doctype") || text.includes("<html")) {
      res.json({ status: true, msg: "Unsubscribed successfully." });
    } else {
      res.json(JSON.parse(text));
    }
  } catch {
    res.status(500).json({ status: false, msg: "Server error" });
  }
};
function createServer() {
  const app2 = express__default();
  app2.use(cors());
  app2.use(express__default.json());
  app2.use(express__default.urlencoded({ extended: true }));
  app2.get("/api/ping", (_req, res) => {
    res.json({ message: process.env.PING_MESSAGE ?? "ping" });
  });
  app2.get("/api/demo", handleDemo);
  app2.get("/api/sub/status", handleSubStatus);
  app2.get("/api/sub/detail", handleSubDetail);
  app2.get("/api/sub/deactivate", handleDeactivate);
  return app2;
}
const app = createServer();
const port = process.env.PORT || 3e3;
const __dirname$1 = import.meta.dirname;
const distPath = path.join(__dirname$1, ".");
app.use(express.static(distPath));
app.get("/{*path}", (req, res) => {
  if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }
  res.sendFile(path.join(distPath, "index.html"));
});
app.listen(port, () => {
  console.log(`🚀 Fusion Starter server running on port ${port}`);
  console.log(`📱 Frontend: http://localhost:${port}`);
  console.log(`🔧 API: http://localhost:${port}/api`);
});
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully");
  process.exit(0);
});
process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully");
  process.exit(0);
});
//# sourceMappingURL=node-build.mjs.map
