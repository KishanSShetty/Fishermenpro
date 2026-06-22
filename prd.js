const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  LevelFormat, PageNumber, PageBreak, Header, Footer, TabStopType,
  TabStopPosition, PositionalTab, PositionalTabAlignment, PositionalTabRelativeTo,
  PositionalTabLeader
} = require('docx');
const fs = require('fs');

// ── Color palette ──────────────────────────────────────────────────────────
const BLUE_DARK   = "1A3C6E";
const BLUE_MID    = "2E6DB4";
const BLUE_LIGHT  = "D6E4F7";
const BLUE_ACCENT = "4A90D9";
const GREY_TEXT   = "444444";
const GREY_LIGHT  = "F4F7FB";
const WHITE       = "FFFFFF";
const ORANGE      = "E07B20";

// ── Shared border helper ───────────────────────────────────────────────────
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const thinBorder = { style: BorderStyle.SINGLE, size: 4, color: "C5D8F0" };

function cellBorders(top, bottom, left, right) {
  return { top, bottom, left, right };
}

// ── Helpers ────────────────────────────────────────────────────────────────
function spacer(pt = 8) {
  return new Paragraph({ spacing: { before: 0, after: 0, line: pt * 20 } });
}

function hrParagraph(color = BLUE_MID) {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color, space: 1 } },
    spacing: { before: 80, after: 160 }
  });
}

function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 120 },
    children: [new TextRun({ text, bold: true, size: 34, color: BLUE_DARK, font: "Arial" })]
  });
}

function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 80 },
    children: [new TextRun({ text, bold: true, size: 26, color: BLUE_MID, font: "Arial" })]
  });
}

function heading3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 60 },
    children: [new TextRun({ text, bold: true, size: 22, color: BLUE_DARK, font: "Arial" })]
  });
}

function body(text, options = {}) {
  return new Paragraph({
    spacing: { before: 60, after: 100 },
    children: [new TextRun({ text, size: 22, color: GREY_TEXT, font: "Arial", ...options })]
  });
}

function bullet(text, level = 0) {
  return new Paragraph({
    numbering: { reference: "bullets", level },
    spacing: { before: 40, after: 60 },
    children: [new TextRun({ text, size: 22, color: GREY_TEXT, font: "Arial" })]
  });
}

function labelValue(label, value) {
  return new Paragraph({
    spacing: { before: 40, after: 60 },
    children: [
      new TextRun({ text: label + ": ", bold: true, size: 22, color: BLUE_DARK, font: "Arial" }),
      new TextRun({ text: value, size: 22, color: GREY_TEXT, font: "Arial" })
    ]
  });
}

// ── Shaded info box ────────────────────────────────────────────────────────
function infoBox(lines, fillColor = BLUE_LIGHT) {
  const border = { style: BorderStyle.SINGLE, size: 4, color: BLUE_ACCENT };
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: { top: border, bottom: border, left: { style: BorderStyle.SINGLE, size: 16, color: BLUE_MID }, right: border },
            shading: { fill: fillColor, type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 200, right: 120 },
            width: { size: 9360, type: WidthType.DXA },
            children: lines.map(l =>
              new Paragraph({
                spacing: { before: 20, after: 40 },
                children: [new TextRun({ text: l, size: 22, color: GREY_TEXT, font: "Arial" })]
              })
            )
          })
        ]
      })
    ]
  });
}

// ── 2-column table (header row) ────────────────────────────────────────────
function twoColTable(headers, rows) {
  const hdrBg = BLUE_DARK;
  const hdrBorder = { style: BorderStyle.SINGLE, size: 4, color: BLUE_DARK };
  const rowBorder = { style: BorderStyle.SINGLE, size: 4, color: "C5D8F0" };

  function hdrCell(text, width) {
    return new TableCell({
      borders: cellBorders(hdrBorder, hdrBorder, hdrBorder, hdrBorder),
      shading: { fill: hdrBg, type: ShadingType.CLEAR },
      margins: { top: 100, bottom: 100, left: 160, right: 120 },
      width: { size: width, type: WidthType.DXA },
      verticalAlign: "center",
      children: [new Paragraph({
        children: [new TextRun({ text, bold: true, size: 22, color: WHITE, font: "Arial" })]
      })]
    });
  }

  function dataCell(text, width, shade = false) {
    return new TableCell({
      borders: cellBorders(rowBorder, rowBorder, rowBorder, rowBorder),
      shading: { fill: shade ? GREY_LIGHT : WHITE, type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 160, right: 120 },
      width: { size: width, type: WidthType.DXA },
      children: [new Paragraph({
        children: [new TextRun({ text, size: 22, color: GREY_TEXT, font: "Arial" })]
      })]
    });
  }

  const [w1, w2] = [4320, 5040];
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [w1, w2],
    rows: [
      new TableRow({ children: [hdrCell(headers[0], w1), hdrCell(headers[1], w2)] }),
      ...rows.map((r, i) => new TableRow({
        children: [dataCell(r[0], w1, i % 2 === 1), dataCell(r[1], w2, i % 2 === 1)]
      }))
    ]
  });
}

// ── 3-column table ─────────────────────────────────────────────────────────
function threeColTable(headers, rows) {
  const hdrBorder = { style: BorderStyle.SINGLE, size: 4, color: BLUE_DARK };
  const rowBorder = { style: BorderStyle.SINGLE, size: 4, color: "C5D8F0" };
  const [w1, w2, w3] = [2800, 3280, 3280];

  function hdrCell(text, w) {
    return new TableCell({
      borders: cellBorders(hdrBorder, hdrBorder, hdrBorder, hdrBorder),
      shading: { fill: BLUE_DARK, type: ShadingType.CLEAR },
      margins: { top: 100, bottom: 100, left: 140, right: 100 },
      width: { size: w, type: WidthType.DXA },
      children: [new Paragraph({ children: [new TextRun({ text, bold: true, size: 20, color: WHITE, font: "Arial" })] })]
    });
  }

  function dataCell(text, w, shade) {
    return new TableCell({
      borders: cellBorders(rowBorder, rowBorder, rowBorder, rowBorder),
      shading: { fill: shade ? GREY_LIGHT : WHITE, type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 140, right: 100 },
      width: { size: w, type: WidthType.DXA },
      children: [new Paragraph({ children: [new TextRun({ text, size: 20, color: GREY_TEXT, font: "Arial" })] })]
    });
  }

  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [w1, w2, w3],
    rows: [
      new TableRow({ children: [hdrCell(headers[0], w1), hdrCell(headers[1], w2), hdrCell(headers[2], w3)] }),
      ...rows.map((r, i) => new TableRow({
        children: [
          dataCell(r[0], w1, i % 2 === 1),
          dataCell(r[1], w2, i % 2 === 1),
          dataCell(r[2], w3, i % 2 === 1)
        ]
      }))
    ]
  });
}

// ══════════════════════════════════════════════════════════════════════════
// DOCUMENT BUILD
// ══════════════════════════════════════════════════════════════════════════

const children = [];

// ── COVER / TITLE BLOCK ────────────────────────────────────────────────────
function coverBlock() {
  const topBorder = { style: BorderStyle.SINGLE, size: 24, color: BLUE_MID };
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: { top: topBorder, bottom: noBorder, left: noBorder, right: noBorder },
            shading: { fill: BLUE_DARK, type: ShadingType.CLEAR },
            margins: { top: 480, bottom: 480, left: 480, right: 480 },
            width: { size: 9360, type: WidthType.DXA },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 120, after: 80 },
                children: [new TextRun({ text: "PRODUCT REQUIREMENTS DOCUMENT", size: 20, color: BLUE_ACCENT, font: "Arial", bold: true, allCaps: true })]
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 40, after: 80 },
                children: [new TextRun({ text: "Fisherman Safety &", size: 52, bold: true, color: WHITE, font: "Arial" })]
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 0, after: 160 },
                children: [new TextRun({ text: "Emergency Alert System", size: 52, bold: true, color: WHITE, font: "Arial" })]
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 0, after: 80 },
                children: [new TextRun({ text: "ESP32  ·  GPS Tracking  ·  Real-Time Web Monitoring", size: 22, color: BLUE_ACCENT, font: "Arial" })]
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 80, after: 120 },
                children: [new TextRun({ text: "Version 1.0  |  June 2026", size: 20, color: "A0BFE0", font: "Arial" })]
              })
            ]
          })
        ]
      })
    ]
  });
}

children.push(coverBlock());
children.push(spacer(24));

// ── META TABLE ─────────────────────────────────────────────────────────────
const metaBorder = { style: BorderStyle.SINGLE, size: 4, color: "C5D8F0" };
function metaCell(label, value, w) {
  return new TableCell({
    borders: cellBorders(metaBorder, metaBorder, metaBorder, metaBorder),
    shading: { fill: GREY_LIGHT, type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 160, right: 120 },
    width: { size: w, type: WidthType.DXA },
    children: [
      new Paragraph({ children: [new TextRun({ text: label, size: 18, color: BLUE_MID, font: "Arial", bold: true })] }),
      new Paragraph({ children: [new TextRun({ text: value, size: 22, color: GREY_TEXT, font: "Arial" })] })
    ]
  });
}
children.push(new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [2340, 2340, 2340, 2340],
  rows: [
    new TableRow({
      children: [
        metaCell("Document Status", "Draft", 2340),
        metaCell("Version", "1.0", 2340),
        metaCell("Author", "IoT Systems Team", 2340),
        metaCell("Last Updated", "June 2026", 2340)
      ]
    })
  ]
}));
children.push(spacer(20));

// ── PAGE BREAK before content ─────────────────────────────────────────────
children.push(new Paragraph({ children: [new PageBreak()] }));

// ══════════════════════════════════════════════════════════════════════════
// 1. EXECUTIVE SUMMARY
// ══════════════════════════════════════════════════════════════════════════
children.push(heading1("1. Executive Summary"));
children.push(hrParagraph());
children.push(body(
  "The Fisherman Safety and Emergency Alert System is an IoT-based real-time monitoring solution designed to dramatically reduce rescue response times for fishermen at sea. By combining an ESP32 microcontroller, a NEO-6M GPS module, and a float (water-immersion) sensor, the system continuously streams location and safety-status data to a FastAPI backend and a React-based web dashboard."
));
children.push(spacer(6));
children.push(infoBox([
  "Core Value Proposition",
  "",
  "When a fisherman enters the water — whether by accident or emergency — the float sensor triggers an EMERGENCY state, the upload interval drops from 30 seconds to 5 seconds, and the dashboard immediately highlights the boat in red with the precise GPS coordinates. A single click opens Google Maps navigation so rescue teams can reach the fisherman without delay.",
]));
children.push(spacer(10));
children.push(body("The solution is fully self-hosted (no third-party IoT platform dependency), low-cost, and scalable from a single boat to a fleet of 100+ vessels."));
children.push(spacer(16));

// ══════════════════════════════════════════════════════════════════════════
// 2. PROBLEM STATEMENT
// ══════════════════════════════════════════════════════════════════════════
children.push(heading1("2. Problem Statement"));
children.push(hrParagraph());

children.push(heading2("2.1  Background"));
children.push(body("Fishermen routinely operate in remote offshore areas where cellular coverage may be limited and immediate human assistance is unavailable. In the event of an overboard incident, hypothermia and drowning risks escalate rapidly — the critical rescue window is typically under 30 minutes in warm tropical waters and under 10 minutes in colder seas."));
children.push(spacer(8));

children.push(heading2("2.2  Current Gaps"));
children.push(bullet("Rescue teams have no automatic notification of a fisherman's distress — they rely on manual radio calls that may never be made."));
children.push(bullet("Even when distress is reported, providing exact GPS coordinates verbally introduces error."));
children.push(bullet("Existing commercial maritime tracking devices are expensive (INR 20,000–80,000 per unit) and require paid subscription platforms."));
children.push(bullet("Small fishing communities in India lack access to affordable, locally deployable monitoring infrastructure."));
children.push(spacer(8));

children.push(heading2("2.3  Impact"));
children.push(body("According to FAO data, artisanal and small-scale fishing accounts for the majority of fishing-related fatalities globally. A fast, affordable, self-hosted solution can meaningfully reduce preventable deaths at sea."));
children.push(spacer(16));

// ══════════════════════════════════════════════════════════════════════════
// 3. GOALS & SUCCESS METRICS
// ══════════════════════════════════════════════════════════════════════════
children.push(heading1("3. Goals & Success Metrics"));
children.push(hrParagraph());

children.push(heading2("3.1  Goals"));
children.push(bullet("Provide real-time GPS location of every registered boat on a web dashboard."));
children.push(bullet("Automatically detect a fisherman-overboard emergency via float sensor and escalate alert frequency."));
children.push(bullet("Allow rescue operators to initiate Google Maps navigation to the distressed boat in one click."));
children.push(bullet("Keep the per-unit hardware cost under INR 2,000."));
children.push(bullet("Support at least 50 simultaneous boats without infrastructure changes."));
children.push(spacer(10));

children.push(heading2("3.2  Success Metrics"));
children.push(twoColTable(
  ["Metric", "Target"],
  [
    ["Emergency alert displayed on dashboard", "< 10 seconds from float sensor trigger"],
    ["Location accuracy (GPS)", "± 2.5 metres (NEO-6M spec)"],
    ["Dashboard uptime", "≥ 99.5% during fishing hours"],
    ["Time-to-navigate (rescue click to maps open)", "< 3 seconds"],
    ["Per-boat hardware BOM cost", "< INR 2,000"],
    ["Maximum simultaneous boats supported (v1)", "50 boats"],
    ["Data loss under poor Wi-Fi (retry mechanism)", "0 missed alerts"],
  ]
));
children.push(spacer(16));

// ══════════════════════════════════════════════════════════════════════════
// 4. STAKEHOLDERS
// ══════════════════════════════════════════════════════════════════════════
children.push(heading1("4. Stakeholders"));
children.push(hrParagraph());
children.push(twoColTable(
  ["Stakeholder", "Role / Needs"],
  [
    ["Fishermen", "Wear or attach the device; need it to be waterproof, lightweight, and require zero manual operation."],
    ["Rescue / Coast Guard Operators", "Primary users of the web dashboard; need clear visual alerts, live map, and one-click navigation."],
    ["Fishing Boat Owners / Cooperatives", "Fund deployment; need cost-efficiency and reliability."],
    ["Local Port Authorities", "May integrate data with existing maritime management systems."],
    ["IoT / Embedded Developer (Builder)", "Responsible for ESP32 firmware, FastAPI backend, and React dashboard."],
    ["System Administrator", "Manages server, database, and network configuration at the shore station."],
  ]
));
children.push(spacer(16));

// ══════════════════════════════════════════════════════════════════════════
// 5. SYSTEM ARCHITECTURE
// ══════════════════════════════════════════════════════════════════════════
children.push(heading1("5. System Architecture"));
children.push(hrParagraph());

children.push(heading2("5.1  Architecture Overview"));
children.push(body("The system is composed of three physical tiers and four logical layers."));
children.push(spacer(8));

children.push(threeColTable(
  ["Layer", "Component", "Technology"],
  [
    ["Edge / Device", "Sensor Node", "ESP32 + NEO-6M GPS + Float Sensor"],
    ["Transport", "Wi-Fi (shore Wi-Fi or mobile hotspot)", "IEEE 802.11 b/g/n — HTTP POST (JSON)"],
    ["Backend", "REST API Server", "Python FastAPI, SQLite"],
    ["Presentation", "Web Dashboard", "React, Google Maps Embed API"],
  ]
));
children.push(spacer(10));

children.push(heading2("5.2  Data Flow"));
children.push(body("The sequence below describes the end-to-end data path from sensor reading to rescue navigation:"));
children.push(spacer(6));
children.push(infoBox([
  "① Float Sensor + GPS Module  →  ESP32 reads sensor state and NMEA sentences",
  "② ESP32  →  POST /update  {boat_no, status, latitude, longitude}",
  "③ FastAPI  →  Validates JSON, writes/updates SQLite record, returns HTTP 200",
  "④ React Dashboard  →  Polls /boats every 5 s, re-renders map pins & status cards",
  "⑤ Rescue Operator  →  Clicks 'Navigate' button",
  "⑥ Browser  →  Opens google.com/maps/dir/?destination=<lat>,<lng>",
]));
children.push(spacer(10));

children.push(heading2("5.3  Upload Interval Logic"));
children.push(twoColTable(
  ["System State", "Upload Frequency"],
  [
    ["Normal (SAFE)", "Every 30 seconds"],
    ["Emergency (EMERGENCY)", "Every 5 seconds"],
    ["GPS fix not yet acquired", "No upload — ESP32 logs to Serial and waits"],
    ["Wi-Fi disconnected", "ESP32 buffers latest packet, retries on reconnect"],
  ]
));
children.push(spacer(16));

// ══════════════════════════════════════════════════════════════════════════
// 6. HARDWARE COMPONENTS
// ══════════════════════════════════════════════════════════════════════════
children.push(heading1("6. Hardware Components"));
children.push(hrParagraph());

children.push(threeColTable(
  ["Component", "Model / Spec", "Function"],
  [
    ["Microcontroller", "ESP32 Dev Board (38-pin)", "Wi-Fi, sensor I/O, HTTP client"],
    ["GPS Module", "NEO-6M (UART @ GPIO16/17)", "Satellite location at ± 2.5 m accuracy"],
    ["Float Sensor", "Normally Open, Digital (GPIO18)", "Detects water immersion → EMERGENCY"],
    ["Power Source", "USB Power Bank (5V 2A, ≥ 5000 mAh)", "Provides 8–12 hours field operation"],
    ["Enclosure", "IP65-rated ABS Box", "Weatherproofing for marine environment"],
    ["Server / Hub", "Laptop / Raspberry Pi 4", "Runs FastAPI + SQLite, serves dashboard"],
  ]
));
children.push(spacer(10));

children.push(infoBox([
  "Pin Mapping",
  "",
  "  GPS TX  →  ESP32 GPIO16 (RX2)",
  "  GPS RX  →  ESP32 GPIO17 (TX2)",
  "  Float Sensor  →  ESP32 GPIO18  (INPUT_PULLUP — LOW = triggered)",
  "  Power  →  USB 5V via power bank",
]));
children.push(spacer(16));

// ══════════════════════════════════════════════════════════════════════════
// 7. SOFTWARE COMPONENTS
// ══════════════════════════════════════════════════════════════════════════
children.push(heading1("7. Software Components"));
children.push(hrParagraph());

children.push(heading2("7.1  ESP32 Firmware"));
children.push(body("Written in C++ using the Arduino framework (Arduino IDE). Core libraries:"));
children.push(bullet("TinyGPS++ — parses NMEA sentences from NEO-6M over HardwareSerial."));
children.push(bullet("WiFi.h + HTTPClient.h — included with the ESP32 Arduino core; handles connection and HTTP POST."));
children.push(bullet("ArduinoJson — constructs the JSON payload sent to the server."));
children.push(spacer(6));
children.push(body("Key firmware behaviours:", { bold: true }));
children.push(bullet("Reads GPS continuously in loop() regardless of upload timing."));
children.push(bullet("Reads float sensor state on every loop iteration."));
children.push(bullet("Calculates upload interval dynamically based on emergency state."));
children.push(bullet("Only uploads when gps.location.isValid() returns true."));
children.push(bullet("Prints structured diagnostic output to Serial at 115200 baud."));
children.push(spacer(10));

children.push(heading2("7.2  FastAPI Backend"));
children.push(body("Python 3.10+. Single-file application (main.py) with the following endpoints:"));
children.push(twoColTable(
  ["Endpoint", "Description"],
  [
    ["POST /update", "Receives JSON payload from ESP32; upserts boat record in SQLite."],
    ["GET /boats", "Returns list of all boats with latest status, lat, lng, and timestamp."],
    ["GET /boats/{boat_no}", "Returns data for a single boat (used by dashboard detail view)."],
    ["GET /health", "Health check — returns {status: ok} for uptime monitoring."],
  ]
));
children.push(spacer(6));
children.push(body("Database: SQLite (boats.db) with a single table boats(boat_no PK, status, latitude, longitude, updated_at). Zero external DB dependencies."));
children.push(spacer(10));

children.push(heading2("7.3  React Dashboard"));
children.push(body("Single-page application. Key UI components:"));
children.push(twoColTable(
  ["Component", "Behaviour"],
  [
    ["Boat Status Card", "Displays boat number, SAFE (green) or EMERGENCY (red) badge, lat/lng."],
    ["Live Map (Google Maps Embed)", "Pins each boat; EMERGENCY boats shown with red marker."],
    ["Auto-Refresh Poller", "Calls GET /boats every 5 seconds; updates state without full reload."],
    ["Navigate Button", "Opens google.com/maps/dir/?destination=<lat>,<lng> in new tab."],
    ["Emergency Banner", "Full-width red banner when any boat is in EMERGENCY state."],
    ["Last-Updated Timestamp", "Shows last successful data receipt per boat."],
  ]
));
children.push(spacer(16));

// ══════════════════════════════════════════════════════════════════════════
// 8. FUNCTIONAL REQUIREMENTS
// ══════════════════════════════════════════════════════════════════════════
children.push(heading1("8. Functional Requirements"));
children.push(hrParagraph());

const funcReqs = [
  ["FR-01", "Device — GPS Acquisition", "The ESP32 shall continuously parse NMEA data from the NEO-6M GPS module and must not transmit a location payload until gps.location.isValid() is true.", "Must Have"],
  ["FR-02", "Device — Float Sensor Detection", "The firmware shall read the float sensor on GPIO18 using INPUT_PULLUP. A LOW reading shall set status = EMERGENCY.", "Must Have"],
  ["FR-03", "Device — Adaptive Upload Rate", "Upload interval shall be 30,000 ms when SAFE and 5,000 ms when EMERGENCY.", "Must Have"],
  ["FR-04", "Device — JSON Payload", "Each upload shall include boat_no (int), status (0=SAFE / 1=EMERGENCY), latitude (float, 6 dp), longitude (float, 6 dp).", "Must Have"],
  ["FR-05", "Device — Wi-Fi Retry", "If Wi-Fi drops, the device shall attempt reconnection and queue the latest payload for retry.", "Must Have"],
  ["FR-06", "Backend — Data Ingestion", "POST /update shall validate the JSON schema and return HTTP 422 on missing/invalid fields.", "Must Have"],
  ["FR-07", "Backend — Persistence", "The server shall persist the most recent record per boat_no in SQLite; historical records are out of scope for v1.", "Must Have"],
  ["FR-08", "Backend — Boat List API", "GET /boats shall return all registered boats with status, coordinates, and updated_at within 1 second.", "Must Have"],
  ["FR-09", "Dashboard — Live Map", "The dashboard shall render all boats on an embedded Google Map with distinct markers for SAFE and EMERGENCY.", "Must Have"],
  ["FR-10", "Dashboard — Emergency Alert", "A red full-width alert banner shall appear when status = EMERGENCY for any boat.", "Must Have"],
  ["FR-11", "Dashboard — Navigation", "Each boat card shall include a 'Navigate to Fisherman' button that opens Google Maps directions in a new tab.", "Must Have"],
  ["FR-12", "Dashboard — Auto-Refresh", "The dashboard shall poll the backend every 5 seconds and update without a full page reload.", "Must Have"],
  ["FR-13", "Dashboard — Stale Indicator", "If no update is received for a boat for > 60 seconds, display a 'Signal Lost' warning on the card.", "Should Have"],
  ["FR-14", "Future — WhatsApp / SMS Alert", "On EMERGENCY, the backend shall optionally call Twilio API to send a WhatsApp/SMS alert with boat number and maps link.", "Won't Have (v1)"],
  ["FR-15", "Future — Geofencing", "The backend shall optionally detect if a boat's coordinates cross a defined maritime boundary polygon and raise an alert.", "Won't Have (v1)"],
];

// 4-col table
function fourColTable(headers, rows) {
  const hdrBorder = { style: BorderStyle.SINGLE, size: 4, color: BLUE_DARK };
  const rowBorder = { style: BorderStyle.SINGLE, size: 4, color: "C5D8F0" };
  const widths = [1040, 1760, 4880, 1680];

  function hCell(text, w) {
    return new TableCell({
      borders: cellBorders(hdrBorder, hdrBorder, hdrBorder, hdrBorder),
      shading: { fill: BLUE_DARK, type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 120, right: 80 },
      width: { size: w, type: WidthType.DXA },
      children: [new Paragraph({ children: [new TextRun({ text, bold: true, size: 18, color: WHITE, font: "Arial" })] })]
    });
  }

  function dCell(text, w, shade, priority) {
    let color = GREY_TEXT;
    if (priority === "Must Have") color = "1A6E2E";
    if (priority === "Should Have") color = "7A5C00";
    if (priority === "Won't Have (v1)") color = "8B0000";
    const isBold = (priority !== undefined && false); // keep plain for readability
    return new TableCell({
      borders: cellBorders(rowBorder, rowBorder, rowBorder, rowBorder),
      shading: { fill: shade ? GREY_LIGHT : WHITE, type: ShadingType.CLEAR },
      margins: { top: 70, bottom: 70, left: 120, right: 80 },
      width: { size: w, type: WidthType.DXA },
      children: [new Paragraph({
        children: [new TextRun({
          text,
          size: priority !== undefined ? 18 : 18,
          color: priority !== undefined ? color : GREY_TEXT,
          font: "Arial",
          bold: priority !== undefined
        })]
      })]
    });
  }

  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: widths,
    rows: [
      new TableRow({ children: headers.map((h, i) => hCell(h, widths[i])) }),
      ...rows.map((r, i) => new TableRow({
        children: [
          dCell(r[0], widths[0], i % 2 === 1),
          dCell(r[1], widths[1], i % 2 === 1),
          dCell(r[2], widths[2], i % 2 === 1),
          dCell(r[3], widths[3], i % 2 === 1, r[3])
        ]
      }))
    ]
  });
}

children.push(fourColTable(["ID", "Feature Area", "Requirement", "Priority"], funcReqs));
children.push(spacer(16));

// ══════════════════════════════════════════════════════════════════════════
// 9. NON-FUNCTIONAL REQUIREMENTS
// ══════════════════════════════════════════════════════════════════════════
children.push(heading1("9. Non-Functional Requirements"));
children.push(hrParagraph());

children.push(twoColTable(
  ["Attribute", "Requirement"],
  [
    ["Performance", "Dashboard refresh cycle ≤ 5 seconds end-to-end. FastAPI /boats response time < 200 ms for up to 100 boats."],
    ["Reliability", "ESP32 firmware shall auto-reconnect to Wi-Fi within 30 seconds of signal restoration."],
    ["Availability", "Shore-side server targets 99.5% uptime during fishing hours (05:00 – 20:00 local time)."],
    ["Scalability", "Backend architecture shall support horizontal scaling to 100 concurrent boat connections without code changes."],
    ["Security", "POST /update shall require a shared API key header (X-API-Key) to prevent unauthorised data injection. Dashboard shall be served over HTTPS in production."],
    ["Durability (Hardware)", "Device enclosure shall meet IP65 rating minimum; GPS antenna must remain above water line."],
    ["Power", "System shall operate for ≥ 8 hours on a single 5000 mAh power bank charge."],
    ["Maintainability", "Firmware configuration (SSID, password, server URL, boat number) shall be at the top of main.cpp as named constants. No re-flashing required for server IP changes."],
    ["Usability", "Dashboard shall be operable by a non-technical rescue operator with zero training — emergency boats must be immediately visually distinct."],
    ["Cost", "Total hardware BOM per boat unit shall not exceed INR 2,000."],
  ]
));
children.push(spacer(16));

// ══════════════════════════════════════════════════════════════════════════
// 10. EMERGENCY SCENARIO FLOW
// ══════════════════════════════════════════════════════════════════════════
children.push(heading1("10. Emergency Scenario Flow"));
children.push(hrParagraph());

children.push(heading2("10.1  Normal Operation"));
children.push(body("The device powers on, connects to Wi-Fi, acquires a GPS fix, and begins uploading status = 0 (SAFE) with coordinates every 30 seconds. The dashboard shows a green SAFE badge."));
children.push(spacer(8));

children.push(heading2("10.2  Emergency Triggered"));
children.push(bullet("Float sensor contacts water → GPIO18 goes LOW."));
children.push(bullet("Firmware sets emergency = true; upload interval drops to 5,000 ms."));
children.push(bullet("JSON payload sent with status = 1 (EMERGENCY)."));
children.push(bullet("FastAPI updates SQLite record; next dashboard poll (≤ 5 s) retrieves new status."));
children.push(bullet("Dashboard renders red EMERGENCY badge, full-width alert banner, and zooms map to the distressed boat."));
children.push(bullet("Rescue operator clicks Navigate to Fisherman."));
children.push(bullet("Google Maps opens in a new tab with real-time directions to the boat's latest GPS coordinates."));
children.push(spacer(8));

children.push(heading2("10.3  Recovery"));
children.push(bullet("Float sensor exits water → GPIO18 returns HIGH → status = 0 (SAFE)."));
children.push(bullet("Upload interval returns to 30 seconds."));
children.push(bullet("Dashboard clears emergency banner when next SAFE packet is received."));
children.push(spacer(16));

// ══════════════════════════════════════════════════════════════════════════
// 11. API CONTRACT
// ══════════════════════════════════════════════════════════════════════════
children.push(heading1("11. API Contract"));
children.push(hrParagraph());

children.push(heading2("11.1  POST /update — Device → Server"));
children.push(infoBox([
  'Request Body (application/json):',
  '{',
  '  "boat_no"   : 1,              // integer, 1–9999',
  '  "status"    : 1,              // 0 = SAFE, 1 = EMERGENCY',
  '  "latitude"  : 12.971600,      // float, 6 decimal places',
  '  "longitude" : 77.594600       // float, 6 decimal places',
  '}',
  '',
  'Success Response: HTTP 200  {"message": "updated"}',
  'Validation Error: HTTP 422  {"detail": [{"loc": [...], "msg": "..."}]}',
]));
children.push(spacer(10));

children.push(heading2("11.2  GET /boats — Server → Dashboard"));
children.push(infoBox([
  'Response Body (application/json):',
  '[',
  '  {',
  '    "boat_no"    : 1,',
  '    "status"     : 1,',
  '    "latitude"   : 12.971600,',
  '    "longitude"  : 77.594600,',
  '    "updated_at" : "2026-06-22T08:14:05Z"',
  '  },',
  '  ...',
  ']',
]));
children.push(spacer(16));

// ══════════════════════════════════════════════════════════════════════════
// 12. RISKS & MITIGATIONS
// ══════════════════════════════════════════════════════════════════════════
children.push(heading1("12. Risks & Mitigations"));
children.push(hrParagraph());

children.push(threeColTable(
  ["Risk", "Likelihood", "Mitigation"],
  [
    ["GPS fix lost at sea (poor satellite visibility)", "Medium", "Firmware logs error to Serial; no upload until valid fix reacquired. Dashboard shows 'Signal Lost' if > 60 s without update."],
    ["Wi-Fi range insufficient (boat far from shore)", "High", "Scope v1 to shore-range use. v2 to add cellular (SIM800L / 4G) fallback."],
    ["Float sensor false positive (rain / waves)", "Medium", "Debounce in firmware: require sensor LOW for ≥ 3 consecutive readings (300 ms each) before triggering EMERGENCY."],
    ["Server goes offline during emergency", "Low", "Shore station uses UPS. Future: deploy to cloud VPS for higher availability."],
    ["Device enclosure not waterproof", "Medium", "Mandate IP65 enclosure in BOM; include silicone gasket seal checklist in deployment guide."],
    ["Dashboard unresponsive for rescue operator", "Low", "Progressive Web App (PWA) offline cache for dashboard shell; polling gracefully degrades."],
    ["Multiple boats with same boat_no", "Low", "POST /update documentation specifies boat_no is unique per device; registration process assigns unique IDs."],
  ]
));
children.push(spacer(16));

// ══════════════════════════════════════════════════════════════════════════
// 13. FUTURE ENHANCEMENTS
// ══════════════════════════════════════════════════════════════════════════
children.push(heading1("13. Future Enhancements"));
children.push(hrParagraph());

children.push(twoColTable(
  ["Enhancement", "Description"],
  [
    ["WhatsApp / SMS Alerts", "On EMERGENCY, backend calls Twilio to send a WhatsApp message with boat number and Google Maps link to registered coast guard numbers."],
    ["Cellular (4G) Connectivity", "Replace Wi-Fi with SIM800L or SIM7600 module for operation beyond shore Wi-Fi range."],
    ["Geofencing", "Define maritime boundary polygons; raise alert if boat crosses into restricted or danger zones."],
    ["Fleet Dashboard (50–100 boats)", "Paginated boat list, search by boat number, historical track playback."],
    ["Offline Map Tiles", "Cache map tiles for areas without internet; critical for offshore deployments."],
    ["AI Risk Prediction", "Analyse GPS movement patterns, speed anomalies, and sensor history to predict distress before the float sensor triggers."],
    ["Weather Integration", "Overlay real-time weather data on dashboard map; alert if boats are in high-wind / high-wave forecast zones."],
    ["Battery Monitoring", "ESP32 reads power bank voltage via ADC and transmits battery percentage in payload."],
    ["Two-Way Alert (Buzzer)", "Shore station can send acknowledgement signal that activates a buzzer on the boat, confirming rescue is in progress."],
    ["Cloud Deployment", "Deploy FastAPI + SQLite (or PostgreSQL) to a cloud VPS for 24/7 availability independent of shore laptop."],
  ]
));
children.push(spacer(16));

// ══════════════════════════════════════════════════════════════════════════
// GENERATE DOCUMENT
// ══════════════════════════════════════════════════════════════════════════
const doc = new Document({
  creator: "IoT Systems Team",
  title: "Fisherman Safety and Emergency Alert System PRD",
  description: "Product Requirements Document for Fisherman Safety System",
  styles: {
    paragraphStyles: [
      {
        id: "bullets",
        name: "Bullets",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { font: "Arial", size: 22, color: GREY_TEXT }
      }
    ]
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: "•",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } }
          }
        ]
      }
    ]
  },
  sections: [
    {
      properties: {
        page: {
          margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 }
        }
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({ text: "Fisherman Safety System PRD", color: "999999", size: 16, font: "Arial" })
              ]
            })
          ]
        })
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: "Page ", color: "999999", size: 16, font: "Arial" }),
                new TextRun({ children: [PageNumber.CURRENT], color: "999999", size: 16, font: "Arial" }),
                new TextRun({ text: " of ", color: "999999", size: 16, font: "Arial" }),
                new TextRun({ children: [PageNumber.TOTAL_PAGES], color: "999999", size: 16, font: "Arial" })
              ]
            })
          ]
        })
      },
      children: children
    }
  ]
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("Fisherman_Safety_System_PRD.docx", buffer);
  console.log("Document created successfully: Fisherman_Safety_System_PRD.docx");
}).catch((error) => {
  console.error("Error generating document:", error);
});
