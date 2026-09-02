/* =========================================================
   RAFARA GATEPASS — MANAGER ACTIVITY PAGE
   Activity & audit log — frontend demo logic
   ========================================================= */

(function () {
  "use strict";

  window.RafaraActivity = window.RafaraActivity || {};

  /* =======================================================
     SEEDED RNG (mulberry32 — same pattern used elsewhere)
     ======================================================= */

  function mulberry32(seed) {
    let a = seed;
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const rand = mulberry32(20260901);

  function randInt(min, max) {
    return Math.floor(rand() * (max - min + 1)) + min;
  }

  function pick(list) {
    return list[randInt(0, list.length - 1)];
  }

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  /* =======================================================
     REFERENCE DATA
     ======================================================= */

  const VISITORS = [
    "Amina Yusuf", "Daniel Okafor", "Aisha Bello", "Chukwuemeka Obi",
    "Fatima Suleiman", "Tunde Alabi", "Grace Nwosu", "Ibrahim Sani",
    "Ngozi Eze", "Peter Anya", "Halima Bako", "Segun Adeyemi",
    "Blessing Chukwu", "Yusuf Garba", "Chidinma Okoye"
  ];

  const RESIDENTS = [
    "Aisha Bello", "Tunde Alabi", "Grace Nwosu", "Ibrahim Sani",
    "Ngozi Eze", "Peter Anya", "Halima Bako", "Chidinma Okoye",
    "Emeka Nnamdi", "Bisi Fashola"
  ];

  const SECURITY_OFFICERS = [
    { name: "Abdulrahman Musa", id: "SEC-0018" },
    { name: "Chinedu Okafor", id: "SEC-0015" },
    { name: "Blessing Udo", id: "SEC-0021" },
    { name: "Yakubu Danladi", id: "SEC-0009" },
    { name: "Rita Osei", id: "SEC-0027" }
  ];

  const ARTISANS = [
    { name: "Musa Ibrahim", id: "ART-0086", service: "Plumber" },
    { name: "Emeka Uche", id: "ART-0041", service: "Electrician" },
    { name: "Bala Yusuf", id: "ART-0072", service: "AC Technician" },
    { name: "Kunle Bakare", id: "ART-0058", service: "Carpenter" },
    { name: "Sadiq Aliyu", id: "ART-0033", service: "Generator Technician" }
  ];

  const UNITS = [
    "Flat 3", "Flat 9", "Flat 12", "Flat 14", "Flat 18", "Flat 21",
    "Flat 24", "Flat 27", "Flat 31", "Flat 36", "Block B, Flat 4"
  ];

  const LOCATIONS = ["Main Gate", "Back Gate", "Control Room", "Estate Patrol"];

  const TYPE_META = {
    access: { label: "Access", icon: "fa-user" },
    passes: { label: "Passes", icon: "fa-ticket" },
    security: { label: "Security", icon: "fa-shield-halved" },
    residents: { label: "Residents", icon: "fa-house-user" },
    artisans: { label: "Artisans", icon: "fa-helmet-safety" },
    units: { label: "Units", icon: "fa-building" },
    manager: { label: "Manager", icon: "fa-user-tie" },
    system: { label: "System", icon: "fa-gear" }
  };

  const RESULT_META = {
    successful: { cls: "successful", label: "Successful", icon: "fa-circle-check" },
    denied: { cls: "denied", label: "Denied", icon: "fa-circle-xmark" },
    failed: { cls: "failed", label: "Failed", icon: "fa-triangle-exclamation" },
    warning: { cls: "warning", label: "Warning", icon: "fa-triangle-exclamation" },
    informational: { cls: "informational", label: "Informational", icon: "fa-circle-info" }
  };

  /* =======================================================
     DATE HELPERS
     ======================================================= */

  const TODAY = new Date(2026, 8, 1, 9, 5, 0); // Sep 1, 2026, "now"

  function dateOnly(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function daysAgo(n) {
    const d = new Date(TODAY);
    d.setDate(d.getDate() - n);
    return d;
  }

  function formatTime(d) {
    let h = d.getHours();
    const m = pad2(d.getMinutes());
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12;
    if (h === 0) h = 12;
    return `${h}:${m} ${ampm}`;
  }

  const MONTHS = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  function formatFullDate(d) {
    return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  }

  function dateGroupLabel(d) {
    const diff = Math.round((dateOnly(TODAY) - dateOnly(d)) / 86400000);
    if (diff === 0) return `TODAY — ${MONTHS[d.getMonth()].toUpperCase()} ${d.getDate()}`;
    if (diff === 1) return "YESTERDAY";
    return `${MONTHS[d.getMonth()].toUpperCase()} ${d.getDate()}`;
  }

  /* =======================================================
     EVENT BUILDER
     ======================================================= */

  let eventCounter = 0;

  function eventId(d) {
    eventCounter += 1;
    return `ACT-${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}-${pad2(d.getHours())}${pad2(d.getMinutes())}${pad2(eventCounter % 60)}`;
  }

  function makeEvent(fields) {
    const d = fields.date;
    return Object.assign({
      id: eventId(d),
      dateLabel: dateGroupLabel(d),
      timeLabel: formatTime(d),
      fullDate: formatFullDate(d),
      source: "Security Gate"
    }, fields);
  }

  /* =======================================================
     GENERATORS PER TYPE
     ======================================================= */

  function genAccessEvent(d) {
    const granted = rand() > 0.16;
    const visitor = pick(VISITORS);
    const resident = pick(RESIDENTS);
    const officer = pick(SECURITY_OFFICERS);
    const unit = pick(UNITS);
    const passId = `RFP-${randInt(24001, 24099)}`;

    if (granted) {
      return makeEvent({
        date: d, type: "access", action: "checked-in", result: "successful",
        title: "Visitor Access Granted",
        person: visitor, personRole: "Visitor",
        passId, passType: "One-Day Visitor", passStatus: "Active",
        unit, host: resident, location: pick(LOCATIONS),
        officer: officer.name, officerId: officer.id,
        meta: [visitor, `Pass ${passId}`, unit]
      });
    }

    const reasons = ["Pass expired", "Pass already used", "Unit mismatch", "Visitor declined by resident"];
    return makeEvent({
      date: d, type: "access", action: "denied", result: "denied",
      title: "Visitor Access Denied",
      person: visitor, personRole: "Visitor",
      passId, passType: "One-Day Visitor", passStatus: "Expired",
      unit, host: resident, location: pick(LOCATIONS),
      officer: pick(SECURITY_OFFICERS).name, officerId: pick(SECURITY_OFFICERS).id,
      reason: pick(reasons),
      meta: [visitor, `Pass ${passId}`, unit]
    });
  }

  function genPassEvent(d) {
    const resident = pick(RESIDENTS);
    const passId = `RFP-${randInt(24001, 24099)}`;
    const actions = [
      { action: "created", title: "Visitor Pass Created", result: "successful" },
      { action: "approved", title: "Visitor Pass Approved", result: "successful" },
      { action: "cancelled", title: "Visitor Pass Cancelled", result: "informational" }
    ];
    const a = pick(actions);
    return makeEvent({
      date: d, type: "passes", action: a.action, result: a.result,
      title: a.title,
      person: resident, personRole: "Resident",
      passId, passType: "One-Day Visitor", passStatus: a.action === "cancelled" ? "Cancelled" : "Active",
      unit: pick(UNITS), createdBy: resident, location: "—",
      meta: [resident, `Pass ${passId}`, pick(UNITS)]
    });
  }

  function genSecurityEvent(d) {
    const officer = pick(SECURITY_OFFICERS);
    const actions = [
      { action: "checked-in", title: "Security Officer Started Shift", result: "successful" },
      { action: "checked-out", title: "Security Officer Ended Shift", result: "successful" },
      { action: "scanned", title: "Pass Scanned at Gate", result: "successful" },
      { action: "verified", title: "Visitor Identity Verified", result: "successful" }
    ];
    const a = pick(actions);
    return makeEvent({
      date: d, type: "security", action: a.action, result: a.result,
      title: a.title,
      person: officer.name, personRole: "Security Officer",
      officer: officer.name, officerId: officer.id,
      location: pick(["Control Room", "Main Gate", "Back Gate"]),
      meta: [officer.name, officer.id]
    });
  }

  function genArtisanEvent(d) {
    const artisan = pick(ARTISANS);
    const granted = rand() > 0.1;
    return makeEvent({
      date: d, type: "artisans", action: granted ? "checked-in" : "denied",
      result: granted ? "successful" : "denied",
      title: granted ? "Artisan Checked In" : "Artisan Access Denied",
      person: artisan.name, personRole: "Artisan",
      artisanId: artisan.id, service: artisan.service,
      unit: pick(UNITS), location: pick(LOCATIONS),
      officer: pick(SECURITY_OFFICERS).name, officerId: pick(SECURITY_OFFICERS).id,
      reason: granted ? undefined : "No active work order",
      meta: [artisan.name, artisan.service, artisan.id]
    });
  }

  function genResidentEvent(d) {
    const resident = pick(RESIDENTS);
    const actions = [
      { action: "updated", title: "Resident Profile Updated", result: "informational" },
      { action: "verified", title: "Resident Verified", result: "successful" },
      { action: "created", title: "Resident Added to Estate", result: "successful" }
    ];
    const a = pick(actions);
    return makeEvent({
      date: d, type: "residents", action: a.action, result: a.result,
      title: a.title,
      person: resident, personRole: "Resident",
      unit: pick(UNITS), location: "—",
      meta: [resident, pick(UNITS)]
    });
  }

  function genUnitEvent(d) {
    const unit = pick(UNITS);
    return makeEvent({
      date: d, type: "units", action: "updated", result: "informational",
      title: "Unit Details Updated",
      person: "Estate Manager", personRole: "Manager",
      unit, location: "—",
      meta: [unit]
    });
  }

  function genManagerEvent(d) {
    const actions = [
      "Approved Security Invitation", "Suspended Resident Account",
      "Updated Estate Settings", "Approved Artisan Access Rule"
    ];
    const title = pick(actions);
    return makeEvent({
      date: d, type: "manager", action: "updated", result: "successful",
      title, person: "Estate Manager", personRole: "Manager",
      location: "—",
      meta: ["Estate Manager"]
    });
  }

  const GENERATORS = {
    access: genAccessEvent,
    passes: genPassEvent,
    security: genSecurityEvent,
    artisans: genArtisanEvent,
    residents: genResidentEvent,
    units: genUnitEvent,
    manager: genManagerEvent
  };

  const TYPE_WEIGHTS = [
    ["access", 8], ["security", 6], ["passes", 4],
    ["artisans", 3], ["residents", 2], ["units", 1], ["manager", 1]
  ];

  function weightedType() {
    const total = TYPE_WEIGHTS.reduce((sum, t) => sum + t[1], 0);
    let r = rand() * total;
    for (const [type, weight] of TYPE_WEIGHTS) {
      if (r < weight) return type;
      r -= weight;
    }
    return "access";
  }

  /* =======================================================
     SEED EVENTS — exact events described in the brief
     ======================================================= */

  function buildSeedEvents() {
    const list = [];

    list.push(makeEvent({
      date: new Date(2026, 8, 1, 8, 42), type: "access", action: "checked-in",
      result: "successful", title: "Visitor Access Granted",
      person: "Amina Yusuf", personRole: "Visitor",
      passId: "RFP-24081", passType: "One-Day Visitor", passStatus: "Active", validUntil: "06:00 PM",
      unit: "Flat 9", host: "Aisha Bello", location: "Main Gate",
      officer: "Abdulrahman Musa", officerId: "SEC-0018",
      meta: ["Amina Yusuf", "Pass RFP-24081", "Flat 9"]
    }));
    list[list.length - 1].id = "ACT-20260901-0842";

    list.push(makeEvent({
      date: new Date(2026, 8, 1, 8, 31), type: "access", action: "denied",
      result: "denied", title: "Visitor Access Denied",
      person: "Daniel Okafor", personRole: "Visitor",
      passId: "RFP-24079", passType: "One-Day Visitor", passStatus: "Expired",
      unit: "Flat 14", host: pick(RESIDENTS), location: "Main Gate",
      officer: "Abdulrahman Musa", officerId: "SEC-0018",
      reason: "Pass expired",
      meta: ["Daniel Okafor", "Pass RFP-24079", "Flat 14"]
    }));

    list.push(makeEvent({
      date: new Date(2026, 8, 1, 8, 18), type: "artisans", action: "checked-in",
      result: "successful", title: "Artisan Checked In",
      person: "Musa Ibrahim", personRole: "Artisan",
      artisanId: "ART-0086", service: "Plumber",
      unit: "Flat 21", location: "Main Gate",
      officer: "Abdulrahman Musa", officerId: "SEC-0018",
      meta: ["Musa Ibrahim", "Plumber", "ART-0086"]
    }));

    list.push(makeEvent({
      date: new Date(2026, 8, 1, 8, 5), type: "passes", action: "created",
      result: "successful", title: "Visitor Pass Created",
      person: "Aisha Bello", personRole: "Resident",
      passId: "RFP-24082", passType: "One-Day Visitor", passStatus: "Active",
      unit: "Flat 18", createdBy: "Aisha Bello", location: "—",
      meta: ["Aisha Bello", "Pass RFP-24082", "Flat 18"]
    }));

    list.push(makeEvent({
      date: new Date(2026, 8, 1, 7, 58), type: "security", action: "checked-in",
      result: "successful", title: "Security Officer Started Shift",
      person: "Chinedu Okafor", personRole: "Security Officer",
      officer: "Chinedu Okafor", officerId: "SEC-0015",
      location: "Control Room",
      meta: ["Chinedu Okafor", "SEC-0015"]
    }));

    list.push(makeEvent({
      date: new Date(2026, 8, 1, 7, 42), type: "access", action: "denied",
      result: "failed", title: "Failed Verification",
      person: "Unknown Visitor", personRole: "Visitor",
      passId: "—", passStatus: "Invalid",
      unit: "—", host: "—", location: "Back Gate",
      officer: "Rita Osei", officerId: "SEC-0027",
      reason: "Invalid pass ID",
      meta: ["Unknown Visitor", "Back Gate"]
    }));

    list.push(makeEvent({
      date: new Date(2026, 7, 31, 21, 14), type: "access", action: "scanned",
      result: "warning", title: "Suspicious Activity — Multiple Failed Scans",
      person: "Unknown Visitor", personRole: "Visitor",
      passId: "RFP-24055", passStatus: "Flagged",
      unit: "—", location: "Main Gate",
      officer: "Yakubu Danladi", officerId: "SEC-0009",
      reason: "Multiple failed pass scans",
      meta: ["Pass RFP-24055", "Main Gate"]
    }));

    return list;
  }

  /* =======================================================
     GENERATE FULL DATASET
     ======================================================= */

  function generateActivity() {
    const events = buildSeedEvents();

    // Today — additional events earlier than the seeded ones
    for (let i = 0; i < 24; i++) {
      const d = new Date(2026, 8, 1, randInt(0, 7), randInt(0, 59));
      events.push(GENERATORS[weightedType()](d));
    }

    // Yesterday
    for (let i = 0; i < 22; i++) {
      const d = daysAgo(1);
      d.setHours(randInt(6, 22), randInt(0, 59));
      events.push(GENERATORS[weightedType()](d));
    }

    // Last 7 days (days 2–6 ago)
    for (let day = 2; day <= 6; day++) {
      const count = randInt(10, 16);
      for (let i = 0; i < count; i++) {
        const d = daysAgo(day);
        d.setHours(randInt(6, 22), randInt(0, 59));
        events.push(GENERATORS[weightedType()](d));
      }
    }

    // Last 30 days (days 7–29 ago)
    for (let day = 7; day <= 29; day++) {
      const count = randInt(2, 6);
      for (let i = 0; i < count; i++) {
        const d = daysAgo(day);
        d.setHours(randInt(6, 22), randInt(0, 59));
        events.push(GENERATORS[weightedType()](d));
      }
    }

    events.sort((a, b) => b.date - a.date);
    return events;
  }

  const ALL_EVENTS = generateActivity();

  window.RafaraActivity.DATA = {
    events: ALL_EVENTS,
    stats: {
      today: 186,
      access: 74,
      security: 52,
      alerts: 8
    },
    breakdown: [
      { label: "Visitor Access", value: 74, max: 74 },
      { label: "Security", value: 52, max: 74 },
      { label: "Passes", value: 31, max: 74 },
      { label: "Artisans", value: 18, max: 74 },
      { label: "Residents", value: 11, max: 74 },
      { label: "System", value: 0, max: 74 }
    ]
  };

})();


/* =========================================================
   RENDERING + INTERACTIONS
   ========================================================= */

(function () {
  "use strict";

  const NS = window.RafaraActivity;
  const DATA = NS.DATA;

  const state = {
    search: "",
    type: "all",
    action: "all",
    result: "all",
    location: "all",
    date: "today",
    dateFrom: null,
    dateTo: null,
    page: 1,
    pageSize: 20,
    filtered: []
  };

  const TYPE_META = {
    access: { label: "Access", icon: "fa-user" },
    passes: { label: "Passes", icon: "fa-ticket" },
    security: { label: "Security", icon: "fa-shield-halved" },
    residents: { label: "Residents", icon: "fa-house-user" },
    artisans: { label: "Artisans", icon: "fa-helmet-safety" },
    units: { label: "Units", icon: "fa-building" },
    manager: { label: "Manager", icon: "fa-user-tie" },
    system: { label: "System", icon: "fa-gear" }
  };

  const RESULT_META = {
    successful: { cls: "successful", label: "Successful", icon: "fa-circle-check" },
    denied: { cls: "denied", label: "Denied", icon: "fa-circle-xmark" },
    failed: { cls: "failed", label: "Failed", icon: "fa-triangle-exclamation" },
    warning: { cls: "warning", label: "Warning", icon: "fa-triangle-exclamation" },
    informational: { cls: "informational", label: "Informational", icon: "fa-circle-info" }
  };

  function statusBadge(result) {
    const meta = RESULT_META[result] || RESULT_META.informational;
    return `<span class="badge badge--${meta.cls}"><i class="fa-solid ${meta.icon}" aria-hidden="true"></i> ${meta.label}</span>`;
  }

  function eventIconClass(result) {
    if (result === "denied" || result === "failed") return "manager-activity-event-icon--denied";
    if (result === "warning") return "manager-activity-event-icon--warning";
    if (result === "successful") return "manager-activity-event-icon--success";
    return "";
  }

  function locationSlug(loc) {
    if (!loc) return "";
    return loc.toLowerCase().replace(/\s+/g, "-");
  }

  /* =======================================================
     STATS
     ======================================================= */

  function renderStats() {
    const grid = document.getElementById("activity-stats-grid");
    if (!grid) return;

    const cards = [
      {
        icon: "fa-list-check", iconClass: "stat-icon--activity-today",
        value: DATA.stats.today, label: "Today's Activity", context: "Events recorded today"
      },
      {
        icon: "fa-right-left", iconClass: "stat-icon--activity-access",
        value: DATA.stats.access, label: "Access Events", context: "Entries and exits"
      },
      {
        icon: "fa-shield-halved", iconClass: "stat-icon--activity-security",
        value: DATA.stats.security, label: "Security Actions", context: "Actions by security personnel"
      },
      {
        icon: "fa-triangle-exclamation", iconClass: "stat-icon--activity-alerts",
        value: DATA.stats.alerts, label: "Alerts", context: "Events requiring attention"
      }
    ];

    grid.innerHTML = cards.map(card => `
      <article class="stat-card">
        <span class="stat-icon ${card.iconClass}">
          <i class="fa-solid ${card.icon}" aria-hidden="true"></i>
        </span>
        <div class="stat-body">
          <span class="stat-number">${card.value}</span>
          <span class="stat-label">${card.label}</span>
          <span class="stat-context">${card.context}</span>
        </div>
      </article>
    `).join("");
  }

  /* =======================================================
     LIVE BANNER
     ======================================================= */

  function renderLiveUpdated(text) {
    const el = document.getElementById("live-updated-text");
    if (el) el.textContent = `Last updated: ${text}`;
  }

  /* =======================================================
     BREAKDOWN
     ======================================================= */

  function renderBreakdown() {
    const wrap = document.getElementById("activity-breakdown-list");
    if (!wrap) return;

    wrap.innerHTML = DATA.breakdown.map(row => {
      const pct = row.max ? Math.round((row.value / row.max) * 100) : 0;
      return `
        <div class="manager-activity-breakdown-row">
          <div class="manager-activity-breakdown-top">
            <span>${row.label}</span>
            <span>${row.value}</span>
          </div>
          <div class="manager-activity-breakdown-track">
            <div class="manager-activity-breakdown-fill" style="width:${pct}%"></div>
          </div>
        </div>
      `;
    }).join("");
  }

  /* =======================================================
     EXCEPTIONS
     ======================================================= */

  function renderExceptions() {
    const wrap = document.getElementById("exceptions-list");
    if (!wrap) return;

    const exceptions = DATA.events
      .filter(e => e.result === "denied" || e.result === "failed" || e.result === "warning")
      .slice(0, 3);

    if (!exceptions.length) {
      wrap.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-circle-check"></i>
          <strong>No exceptions</strong>
          <span>Denied, failed, or unusual access events will appear here.</span>
        </div>
      `;
      return;
    }

    wrap.innerHTML = exceptions.map(e => {
      const meta = RESULT_META[e.result] || RESULT_META.informational;
      const buttonLabel = e.result === "warning" ? "Review" : "View Details";
      return `
        <div class="manager-activity-exception-card">
          <div class="manager-activity-exception-top">
            <span class="manager-activity-exception-title">${e.title}</span>
            <span class="badge badge--${meta.cls}"><i class="fa-solid ${meta.icon}" aria-hidden="true"></i> ${meta.label}</span>
          </div>
          <p><strong>${e.person}</strong>${e.reason ? ` — ${e.reason}` : ""}</p>
          <div class="manager-activity-exception-meta">
            <span>${e.dateLabel.startsWith("TODAY") ? e.timeLabel : (e.dateLabel === "YESTERDAY" ? `Yesterday, ${e.timeLabel}` : `${e.dateLabel}, ${e.timeLabel}`)}</span>
            ${e.location && e.location !== "—" ? `<span>•</span><span>${e.location}</span>` : ""}
          </div>
          <button type="button" class="btn btn--secondary btn--sm" data-view-exception="${e.id}">${buttonLabel}</button>
        </div>
      `;
    }).join("");

    wrap.querySelectorAll("[data-view-exception]").forEach(btn => {
      btn.addEventListener("click", () => {
        const ev = DATA.events.find(e => e.id === btn.getAttribute("data-view-exception"));
        if (ev) openDrawer(ev);
      });
    });
  }

  /* =======================================================
     FILTERING
     ======================================================= */

  function matchesDateFilter(e) {
    if (state.date === "all") return true;

    const d0 = new Date(e.date.getFullYear(), e.date.getMonth(), e.date.getDate());
    const today0 = new Date(2026, 8, 1);

    if (state.date === "today") return d0.getTime() === today0.getTime();

    if (state.date === "yesterday") {
      const y = new Date(today0);
      y.setDate(y.getDate() - 1);
      return d0.getTime() === y.getTime();
    }

    if (state.date === "7days") {
      const diff = Math.round((today0 - d0) / 86400000);
      return diff >= 0 && diff <= 6;
    }

    if (state.date === "30days") {
      const diff = Math.round((today0 - d0) / 86400000);
      return diff >= 0 && diff <= 29;
    }

    if (state.date === "custom") {
      if (!state.dateFrom && !state.dateTo) return true;
      const t = d0.getTime();
      if (state.dateFrom && t < new Date(state.dateFrom).getTime()) return false;
      if (state.dateTo && t > new Date(state.dateTo).getTime()) return false;
      return true;
    }

    return true;
  }

  function matchesSearch(e) {
    if (!state.search) return true;
    const q = state.search.toLowerCase();
    const haystack = [
      e.person, e.passId, e.unit, e.officerId, e.officer,
      e.artisanId, e.type, e.action, e.location, e.title
    ].filter(Boolean).join(" ").toLowerCase();
    return haystack.includes(q);
  }

  function applyFilters() {
    state.filtered = DATA.events.filter(e => {
      if (state.type !== "all" && e.type !== state.type) return false;
      if (state.action !== "all" && e.action !== state.action) return false;
      if (state.result !== "all" && e.result !== state.result) return false;
      if (state.location !== "all" && locationSlug(e.location) !== state.location) return false;
      if (!matchesDateFilter(e)) return false;
      if (!matchesSearch(e)) return false;
      return true;
    });

    state.page = 1;
    renderLog();
  }

  /* =======================================================
     LOG RENDERING
     ======================================================= */

  function renderLog() {
    const list = document.getElementById("activity-log-list");
    const countEl = document.getElementById("filter-result-count");
    if (!list) return;

    const total = state.filtered.length;

    if (countEl) {
      countEl.textContent = `Showing ${Math.min(total, state.pageSize)} of ${total} activities`;
    }

    if (!total) {
      const genuinelyNone = DATA.events.length === 0;
      list.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-clock-rotate-left"></i>
          <strong>${genuinelyNone ? "No activity yet" : "No activity found"}</strong>
          <span>${genuinelyNone
            ? "Access and security events will appear here as activity occurs."
            : "Try adjusting your filters or search terms."}</span>
          ${genuinelyNone ? "" : `<button type="button" class="btn btn--secondary btn--sm" id="empty-clear-filters-btn" style="margin-top:12px;">Clear Filters</button>`}
        </div>
      `;
      const emptyClear = document.getElementById("empty-clear-filters-btn");
      if (emptyClear) emptyClear.addEventListener("click", clearFilters);
      renderPagination(0);
      return;
    }

    const start = (state.page - 1) * state.pageSize;
    const pageItems = state.filtered.slice(start, start + state.pageSize);

    let html = "";
    let lastGroup = null;

    pageItems.forEach(e => {
      if (e.dateLabel !== lastGroup) {
        html += `<div class="manager-activity-date-divider">${e.dateLabel}</div>`;
        lastGroup = e.dateLabel;
      }

      const typeMeta = TYPE_META[e.type] || TYPE_META.system;
      const metaText = (e.meta || []).map((m, i) =>
        i === 0 ? `<span>${m}</span>` : `<span class="sep">•</span><span>${m}</span>`
      ).join("");

      html += `
        <button type="button" class="manager-activity-event" data-event-id="${e.id}">
          <span class="manager-activity-event-icon ${eventIconClass(e.result)}">
            <i class="fa-solid ${typeMeta.icon}" aria-hidden="true"></i>
          </span>
          <span class="manager-activity-event-body">
            <strong>${e.title}</strong>
            <span class="manager-activity-event-meta">${metaText}</span>
          </span>
          <span class="manager-activity-event-side">
            <span class="manager-activity-event-time">${e.timeLabel}</span>
            ${statusBadge(e.result)}
          </span>
        </button>
      `;
    });

    list.innerHTML = html;

    list.querySelectorAll("[data-event-id]").forEach(card => {
      card.addEventListener("click", () => {
        const ev = DATA.events.find(e => e.id === card.getAttribute("data-event-id"));
        if (ev) openDrawer(ev);
      });
    });

    renderPagination(total);
  }

  /* =======================================================
     PAGINATION
     ======================================================= */

  function renderPagination(total) {
    const label = document.getElementById("pagination-label");
    const controls = document.getElementById("pagination-controls");
    if (!controls) return;

    const pageCount = Math.max(1, Math.ceil(total / state.pageSize));

    if (!total) {
      if (label) label.textContent = "Showing 0 of 0 activities";
      controls.innerHTML = "";
      return;
    }

    const start = (state.page - 1) * state.pageSize + 1;
    const end = Math.min(state.page * state.pageSize, total);

    if (label) label.textContent = `Showing ${start}–${end} of ${total} activities`;

    let pages = [];
    for (let p = 1; p <= pageCount; p++) {
      if (p === 1 || p === pageCount || Math.abs(p - state.page) <= 1) {
        pages.push(p);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }

    let html = `<button type="button" class="manager-activity-page-btn" data-page="prev" ${state.page === 1 ? "disabled" : ""}>Previous</button>`;

    pages.forEach(p => {
      if (p === "...") {
        html += `<span class="manager-activity-page-ellipsis">…</span>`;
      } else {
        html += `<button type="button" class="manager-activity-page-btn${p === state.page ? " is-active" : ""}" data-page="${p}">${p}</button>`;
      }
    });

    html += `<button type="button" class="manager-activity-page-btn" data-page="next" ${state.page === pageCount ? "disabled" : ""}>Next</button>`;

    controls.innerHTML = html;

    controls.querySelectorAll("[data-page]").forEach(btn => {
      btn.addEventListener("click", () => {
        const val = btn.getAttribute("data-page");
        if (val === "prev") state.page = Math.max(1, state.page - 1);
        else if (val === "next") state.page = Math.min(pageCount, state.page + 1);
        else state.page = parseInt(val, 10);
        renderLog();
        document.getElementById("activity-log-list").scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    });
  }

  /* =======================================================
     DRAWER
     ======================================================= */

  function accessJourney(e) {
    if (e.result === "denied" || e.result === "failed") {
      return [
        { label: "Pass Scanned", status: "complete" },
        { label: "Validation Failed", status: "failed" },
        { label: "Access Denied", status: "failed" }
      ];
    }
    return [
      { label: "Pass Created", status: "complete" },
      { label: "Visitor Arrived", status: "complete" },
      { label: "Pass Scanned", status: "complete" },
      { label: "Identity Verified", status: "complete" },
      { label: "Access Granted", status: "current" }
    ];
  }

  function drawerRow(label, value, copyable) {
    if (value === undefined || value === null || value === "") return "";
    return `
      <div class="manager-activity-drawer-row">
        <span>${label}</span>
        <span>${value}${copyable ? `<button type="button" class="manager-activity-copy-btn" data-copy="${value}" aria-label="Copy ${label}"><i class="fa-solid fa-copy" aria-hidden="true"></i></button>` : ""}</span>
      </div>
    `;
  }

  function openDrawer(e) {
    const overlay = document.getElementById("activity-drawer-overlay");
    const body = document.getElementById("drawer-body");
    if (!overlay || !body) return;

    let html = `
      <div class="manager-activity-drawer-top">
        <h3>${e.title}</h3>
        <div class="manager-activity-drawer-top-meta">
          <span>${e.fullDate}</span>
          <span>•</span>
          <span>${e.timeLabel}</span>
          <span>•</span>
          ${statusBadge(e.result)}
        </div>
      </div>
    `;

    if (e.type === "access" || e.type === "artisans") {
      html += `
        <div class="manager-activity-drawer-section">
          <span class="manager-activity-drawer-section-title">Access Journey</span>
          <div class="manager-activity-journey">
            ${accessJourney(e).map(step => `
              <div class="manager-activity-journey-step is-${step.status}">
                <span class="manager-activity-journey-dot"><i class="fa-solid ${step.status === "failed" ? "fa-xmark" : "fa-check"}" aria-hidden="true"></i></span>
                <span class="manager-activity-journey-label">${step.label}</span>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }

    html += `
      <div class="manager-activity-drawer-section">
        <span class="manager-activity-drawer-section-title">Person Involved</span>
        ${drawerRow("Name", e.person)}
        ${drawerRow("Role", e.personRole)}
      </div>
    `;

    if (e.passId) {
      html += `
        <div class="manager-activity-drawer-section">
          <span class="manager-activity-drawer-section-title">Pass Information</span>
          ${drawerRow("Pass ID", e.passId, true)}
          ${drawerRow("Pass Type", e.passType)}
          ${drawerRow("Status", e.passStatus)}
          ${drawerRow("Valid Until", e.validUntil)}
        </div>
      `;
    }

    if (e.host || e.createdBy) {
      html += `
        <div class="manager-activity-drawer-section">
          <span class="manager-activity-drawer-section-title">Host Information</span>
          ${drawerRow("Resident", e.host || e.createdBy)}
          ${drawerRow("Unit", e.unit)}
        </div>
      `;
    }

    if (e.artisanId) {
      html += `
        <div class="manager-activity-drawer-section">
          <span class="manager-activity-drawer-section-title">Artisan Information</span>
          ${drawerRow("Artisan ID", e.artisanId, true)}
          ${drawerRow("Service", e.service)}
        </div>
      `;
    }

    if (e.officer) {
      html += `
        <div class="manager-activity-drawer-section">
          <span class="manager-activity-drawer-section-title">Security Information</span>
          ${drawerRow("Verified By", e.officer)}
          ${drawerRow("Security ID", e.officerId)}
          ${drawerRow("Location", e.location)}
        </div>
      `;
    }

    if (e.reason) {
      html += `
        <div class="manager-activity-drawer-section">
          <span class="manager-activity-drawer-section-title">Reason</span>
          ${drawerRow("Detail", e.reason)}
        </div>
      `;
    }

    html += `
      <div class="manager-activity-drawer-section">
        <span class="manager-activity-drawer-section-title">Event Information</span>
        ${drawerRow("Event ID", e.id, true)}
        ${drawerRow("Source", e.source)}
        ${drawerRow("Result", (RESULT_META[e.result] || RESULT_META.informational).label)}
      </div>
    `;

    const links = [];
    if (e.passId) links.push(`<button type="button" class="btn btn--ghost btn--sm" data-related="pass">View Related Pass</button>`);
    if (e.host) links.push(`<button type="button" class="btn btn--ghost btn--sm" data-related="resident">View Related Resident</button>`);
    if (e.officer) links.push(`<button type="button" class="btn btn--ghost btn--sm" data-related="officer">View Related Security Officer</button>`);
    if (e.artisanId) links.push(`<button type="button" class="btn btn--ghost btn--sm" data-related="artisan">View Related Artisan</button>`);

    if (links.length) {
      html += `<div class="manager-activity-drawer-links">${links.join("")}</div>`;
    }

    body.innerHTML = html;

    body.querySelectorAll("[data-copy]").forEach(btn => {
      btn.addEventListener("click", () => {
        const value = btn.getAttribute("data-copy");
        copyToClipboard(value);
        showToast(`Copied "${value}" to clipboard.`);
      });
    });

    body.querySelectorAll("[data-related]").forEach(btn => {
      btn.addEventListener("click", () => {
        const kind = btn.getAttribute("data-related");
        const labels = {
          pass: "pass", resident: "resident record", officer: "security officer profile", artisan: "artisan profile"
        };
        showToast(`Opening related ${labels[kind]}…`);
      });
    });

    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add("is-open"));
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    const overlay = document.getElementById("activity-drawer-overlay");
    if (!overlay) return;
    overlay.classList.remove("is-open");
    document.body.style.overflow = "";
    setTimeout(() => { overlay.hidden = true; }, 250);
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    } else {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch (err) { /* no-op */ }
      document.body.removeChild(ta);
    }
  }

  /* =======================================================
     TOAST
     ======================================================= */

  function showToast(message) {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "manager-activity-toast";
    toast.innerHTML = `<i class="fa-solid fa-circle-check" aria-hidden="true"></i><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("is-leaving");
      setTimeout(() => toast.remove(), 200);
    }, 3200);
  }

  /* =======================================================
     EXPORT (CSV simulation)
     ======================================================= */

  function exportActivity(range) {
    let items;
    const today0 = new Date(2026, 8, 1);

    if (range === "today") {
      items = DATA.events.filter(e => {
        const d0 = new Date(e.date.getFullYear(), e.date.getMonth(), e.date.getDate());
        return d0.getTime() === today0.getTime();
      });
    } else if (range === "7days") {
      items = DATA.events.filter(e => {
        const d0 = new Date(e.date.getFullYear(), e.date.getMonth(), e.date.getDate());
        return Math.round((today0 - d0) / 86400000) <= 6;
      });
    } else {
      items = DATA.events.filter(e => {
        const d0 = new Date(e.date.getFullYear(), e.date.getMonth(), e.date.getDate());
        return Math.round((today0 - d0) / 86400000) <= 29;
      });
    }

    const headers = ["Event ID", "Date", "Time", "Title", "Person", "Type", "Action", "Result", "Location"];
    const rows = items.map(e => [
      e.id, e.fullDate, e.timeLabel, e.title, e.person || "", e.type, e.action, e.result, e.location || ""
    ]);

    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    try {
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `rafara-activity-${range}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      /* Blob download not supported in this environment — still confirm the action */
    }

    showToast("Activity export prepared.");
  }

  /* =======================================================
     CLEAR FILTERS
     ======================================================= */

  function clearFilters() {
    state.search = "";
    state.type = "all";
    state.action = "all";
    state.result = "all";
    state.location = "all";
    state.date = "all";
    state.dateFrom = null;
    state.dateTo = null;

    const searchInput = document.getElementById("activity-search-input");
    if (searchInput) searchInput.value = "";

    ["filter-type", "filter-action", "filter-result", "filter-location"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = "all";
    });

    const dateSelect = document.getElementById("filter-date");
    if (dateSelect) dateSelect.value = "all";

    const customFields = document.getElementById("custom-date-fields");
    if (customFields) customFields.hidden = true;

    const from = document.getElementById("filter-date-from");
    const to = document.getElementById("filter-date-to");
    if (from) from.value = "";
    if (to) to.value = "";

    applyFilters();
  }

  /* =======================================================
     WIRE UP CONTROLS
     ======================================================= */

  function init() {
    renderStats();
    renderLiveUpdated("Just now");
    renderBreakdown();
    renderExceptions();
    applyFilters();

    const searchInput = document.getElementById("activity-search-input");
    if (searchInput) {
      let debounce;
      searchInput.addEventListener("input", () => {
        clearTimeout(debounce);
        debounce = setTimeout(() => {
          state.search = searchInput.value.trim();
          applyFilters();
        }, 180);
      });
    }

    const typeSelect = document.getElementById("filter-type");
    if (typeSelect) typeSelect.addEventListener("change", () => { state.type = typeSelect.value; applyFilters(); });

    const actionSelect = document.getElementById("filter-action");
    if (actionSelect) actionSelect.addEventListener("change", () => { state.action = actionSelect.value; applyFilters(); });

    const resultSelect = document.getElementById("filter-result");
    if (resultSelect) resultSelect.addEventListener("change", () => { state.result = resultSelect.value; applyFilters(); });

    const locationSelect = document.getElementById("filter-location");
    if (locationSelect) locationSelect.addEventListener("change", () => { state.location = locationSelect.value; applyFilters(); });

    const dateSelect = document.getElementById("filter-date");
    const customFields = document.getElementById("custom-date-fields");
    if (dateSelect) {
      dateSelect.addEventListener("change", () => {
        state.date = dateSelect.value;
        if (customFields) customFields.hidden = dateSelect.value !== "custom";
        applyFilters();
      });
    }

    const fromInput = document.getElementById("filter-date-from");
    const toInput = document.getElementById("filter-date-to");
    if (fromInput) fromInput.addEventListener("change", () => { state.dateFrom = fromInput.value || null; applyFilters(); });
    if (toInput) toInput.addEventListener("change", () => { state.dateTo = toInput.value || null; applyFilters(); });

    const clearBtn = document.getElementById("clear-filters-btn");
    if (clearBtn) clearBtn.addEventListener("click", clearFilters);

    // Export dropdown range buttons (panel open/close handled by shared dropdown script)
    document.querySelectorAll("[data-export-range]").forEach(btn => {
      btn.addEventListener("click", () => {
        exportActivity(btn.getAttribute("data-export-range"));
        const panel = document.getElementById("export-panel");
        if (panel) panel.hidden = true;
        const exportBtn = document.getElementById("export-activity-btn");
        if (exportBtn) exportBtn.setAttribute("aria-expanded", "false");
      });
    });

    // Drawer close triggers
    const drawerCloseBtn = document.getElementById("drawer-close-btn");
    if (drawerCloseBtn) drawerCloseBtn.addEventListener("click", closeDrawer);

    document.querySelectorAll("[data-close-drawer]").forEach(el => {
      el.addEventListener("click", closeDrawer);
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        const overlay = document.getElementById("activity-drawer-overlay");
        if (overlay && !overlay.hidden) closeDrawer();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  NS.state = state;
  NS.openDrawer = openDrawer;

})();
