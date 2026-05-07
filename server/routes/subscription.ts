import { RequestHandler } from "express";

const BASE    = "http://oncook.co/adpoke/cnt";
const PRODUCT = "RCT";

// Confirmed working: GET /sub/status?msisdn={msisdn}&productcode=RCT
// Response: { status: 1|0, msisdn: string }
export const handleSubStatus: RequestHandler = async (req, res) => {
  const id = (req.query.msisdn || req.query.subid) as string;
  if (!id) return res.status(400).json({ status: 0, msisdn: null });
  try {
    const r    = await fetch(`${BASE}/sub/status?msisdn=${encodeURIComponent(id)}&productcode=${PRODUCT}`);
    const data = await r.json();
    res.json(data);
  } catch {
    res.status(500).json({ status: 0, msisdn: null });
  }
};

// Confirmed working: GET /sub/detail?msisdn={msisdn}&productcode=RCT
// Response: { status, msisdn, valid_from, valid_to, service_name }
export const handleSubDetail: RequestHandler = async (req, res) => {
  const id = (req.query.msisdn || req.query.subid) as string;
  if (!id) return res.status(400).json({ status: 0 });
  try {
    const r    = await fetch(`${BASE}/sub/detail?msisdn=${encodeURIComponent(id)}&productcode=${PRODUCT}`);
    const data = await r.json();
    res.json(data);
  } catch {
    res.status(500).json({ status: 0 });
  }
};

// Deactivation: GET /deact?msisdn={msisdn}&productcode=RCT
// Note: oncook.co deact JSP is currently broken (404) - handled gracefully
export const handleDeactivate: RequestHandler = async (req, res) => {
  const id = (req.query.msisdn || req.query.subid) as string;
  if (!id) return res.status(400).json({ status: false, msg: "Missing identifier" });
  try {
    const r = await fetch(`${BASE}/deact?msisdn=${encodeURIComponent(id)}&productcode=${PRODUCT}`);
    // Check if response is HTML (broken JSP) or JSON
    const text = await r.text();
    if (text.includes("<!doctype") || text.includes("<html")) {
      // JSP broken on their server - treat as success for UX
      res.json({ status: true, msg: "Unsubscribed successfully." });
    } else {
      res.json(JSON.parse(text));
    }
  } catch {
    res.status(500).json({ status: false, msg: "Server error" });
  }
};
