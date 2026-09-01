/* =========================================================
   RAFARA GATEPASS — MANAGER ARTISANS PAGE
   Self-contained frontend demo logic (no dependencies on
   other Manager Dashboard scripts).
   ========================================================= */

(function () {
  "use strict";

  const NS = (window.RafaraArtisans = window.RafaraArtisans || {});

  /* =======================================================
     MOCK DATA GENERATION
     ======================================================= */

  const FIRST_NAMES = [
    "Musa", "Yusuf", "Chinedu", "Sani", "Emeka", "Tunde", "Ibrahim", "Kelechi",
    "Ahmed", "Segun", "Nnamdi", "Uche", "Abdullahi", "Chike", "Femi", "Bala",
    "Obinna", "Garba", "Chidi", "Rasheed", "Kayode", "Suleiman", "Emeka",
    "Aliyu", "Ejike", "Wale", "Musa", "Danjuma", "Chukwuemeka", "Lawal",
    "Ikenna", "Adamu", "Ola", "Habib", "Chinonso", "Yakubu", "Tobenna",
    "Nasir", "Sunday", "Kabiru"
  ];

  const LAST_NAMES = [
    "Ibrahim", "Abdullahi", "Okafor", "Bello", "Nwosu", "Balogun", "Adeyemi",
    "Eze", "Yusuf", "Okoro", "Musa", "Chukwu", "Suleiman", "Obi", "Adamu",
    "Ogundipe", "Umar", "Nwachukwu", "Aliyu", "Igwe", "Danjuma", "Okonkwo",
    "Garba", "Ekeh", "Sanni", "Mohammed", "Onyekwere", "Abubakar", "Ude",
    "Lawal", "Ojo", "Mustapha", "Anyanwu", "Isah", "Chikezie", "Rabiu"
  ];

  const SERVICES = [
    "Plumber", "Electrician", "Carpenter", "Painter", "AC Technician",
    "Cleaner", "Mechanic", "Technician", "Other"
  ];

  const SERVICE_ICONS = {
    "Plumber": "fa-faucet-drip",
    "Electrician": "fa-bolt",
    "Carpenter": "fa-hammer",
    "Painter": "fa-paint-roller",
    "AC Technician": "fa-fan",
    "Cleaner": "fa-broom",
    "Mechanic": "fa-wrench",
    "Technician": "fa-screwdriver-wrench",
    "Other": "fa-toolbox"
  };

  const GATES = ["Main Gate", "Estate Gate B", "Service Gate"];

  let unitCounter = 1;
  function nextUnit() {
    const n = unitCounter++;
    return n % 6 === 0 ? `House ${n}` : `Flat ${n}`;
  }

  function pad(n) {
    return String(n).padStart(4, "0");
  }

  function makeArtisan(overrides) {
    const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const base = {
      name: `${first} ${last}`,
      phone: `080${Math.floor(1000000 + Math.random() * 8999999)}`,
      service: SERVICES[Math.floor(Math.random() * (SERVICES.length - 1))],
      status: "verified",
      registeredBy: Math.random() < 0.15 ? "Resident" : "Estate Manager",
      units: [nextUnit()],
      activePass: "none",
      checkedIn: false,
      dateRegistered: "12 Jan 2026",
      lastAccess: "—",
      notes: "",
      passValidUntil: "Today, 06:00 PM",
      currentLocation: GATES[0]
    };
    return Object.assign(base, overrides);
  }

  function buildActivityTimeline(artisan) {
    if (artisan.status === "suspended") {
      return [
        { time: "Yesterday, 03:20 PM", label: "Artisan suspended by Estate Manager", loc: "—" },
        { time: "Yesterday, 09:05 AM", label: "Exited estate", loc: artisan.currentLocation }
      ];
    }
    if (artisan.status === "pending") {
      return [
        { time: artisan.lastAccess === "—" ? "Yesterday, 04:10 PM" : artisan.lastAccess, label: "Artisan profile submitted for verification", loc: "—" }
      ];
    }
    const entries = [
      { time: artisan.lastAccess, label: artisan.checkedIn ? "Entered estate" : "Exited estate", loc: artisan.currentLocation },
      { time: "Earlier today", label: "Artisan pass verified", loc: "Main Gate" },
      { time: "Yesterday, 04:18 PM", label: "Exited estate", loc: "Main Gate" },
      { time: "Yesterday, 08:10 AM", label: "Entered estate", loc: "Main Gate" }
    ];
    return entries;
  }

  function generateArtisans() {
    const list = [];

    // Named, explicit artisans from the brief
    list.push(makeArtisan({
      artisanId: "ART-0086",
      name: "Musa Ibrahim",
      phone: "0803 452 1187",
      service: "Plumber",
      status: "verified",
      registeredBy: "Estate Manager",
      units: ["Flat 9"],
      activePass: "active",
      checkedIn: true,
      lastAccess: "Today, 08:42 AM",
      dateRegistered: "04 Feb 2025",
      currentLocation: "Main Gate",
      passValidUntil: "Today, 06:00 PM"
    }));

    list.push(makeArtisan({
      artisanId: "ART-0085",
      name: "Yusuf Abdullahi",
      phone: "0806 219 7743",
      service: "Electrician",
      status: "verified",
      registeredBy: "Estate Manager",
      units: ["Flat 21"],
      activePass: "none",
      checkedIn: false,
      lastAccess: "Yesterday, 04:18 PM",
      dateRegistered: "18 Nov 2024",
      currentLocation: "Main Gate"
    }));

    list.push(makeArtisan({
      artisanId: "ART-0084",
      name: "Chinedu Okafor",
      phone: "0812 903 5561",
      service: "AC Technician",
      status: "pending",
      registeredBy: "Resident",
      units: ["Flat 14"],
      activePass: "pending",
      checkedIn: false,
      lastAccess: "—",
      dateRegistered: "Yesterday",
      currentLocation: "—"
    }));

    list.push(makeArtisan({
      artisanId: "ART-0083",
      name: "Sani Bello",
      phone: "0701 664 2298",
      service: "Carpenter",
      status: "verified",
      registeredBy: "Estate Manager",
      units: ["Flat 5", "Flat 12", "Flat 18"],
      activePass: "active",
      checkedIn: true,
      lastAccess: "Today, 07:51 AM",
      dateRegistered: "22 Aug 2024",
      currentLocation: "Main Gate",
      passValidUntil: "Today, 05:30 PM"
    }));

    // Generated remainder — 82 more, tuned so totals match the
    // summary stats: 86 registered, 78 verified, 6 pending, 2 suspended,
    // 31 with an active pass.
    let idNum = 87;
    let activeCount = 2; // Musa + Sani already active

    // 2 suspended
    for (let i = 0; i < 2; i++) {
      list.push(makeArtisan({
        artisanId: `ART-${pad(idNum++)}`,
        status: "suspended",
        activePass: "none",
        lastAccess: "2 days ago"
      }));
    }

    // 5 more pending (total pending = 6)
    for (let i = 0; i < 5; i++) {
      list.push(makeArtisan({
        artisanId: `ART-${pad(idNum++)}`,
        status: "pending",
        activePass: i < 3 ? "pending" : "none",
        lastAccess: "—",
        dateRegistered: "This week"
      }));
    }

    // 75 more verified (total verified = 78)
    for (let i = 0; i < 75; i++) {
      const giveActivePass = activeCount < 31;
      if (giveActivePass) activeCount++;
      const checkedIn = giveActivePass && activeCount <= 24;
      list.push(makeArtisan({
        artisanId: `ART-${pad(idNum++)}`,
        status: "verified",
        activePass: giveActivePass ? "active" : "none",
        checkedIn: checkedIn,
        lastAccess: checkedIn
          ? "Today, " + String(7 + (i % 3)).padStart(2, "0") + ":" + String(10 + (i % 40)).padStart(2, "0") + " AM"
          : (i % 4 === 0 ? "Yesterday, 03:15 PM" : "2 days ago"),
        currentLocation: GATES[i % GATES.length]
      }));
    }

    // Some artisans work across multiple units for variety
    list.forEach((a, idx) => {
      if (idx > 3 && idx % 11 === 0) {
        a.units = [a.units[0], nextUnit(), nextUnit()];
      }
    });

    // Attach access history + a few derived fields
    list.forEach(a => {
      a.history = buildActivityTimeline(a);
    });

    return list;
  }

  const ALL_UNITS = Array.from({ length: 60 }, (_, i) => (
    (i + 1) % 6 === 0 ? `House ${i + 1}` : `Flat ${i + 1}`
  ));

  NS.DATA = {
    stats: {
      registered: 86,
      verified: 78,
      activeToday: 24,
      activePasses: 31
    },

    artisans: generateArtisans(),

    activity: [
      { icon: "fa-right-to-bracket", title: "Musa Ibrahim entered the estate", desc: "Main Gate", time: "08:42 AM" },
      { icon: "fa-hourglass-end", title: "Yusuf Abdullahi's artisan pass expired", desc: "Flat 21", time: "08:18 AM" },
      { icon: "fa-right-to-bracket", title: "Sani Bello entered the estate", desc: "Main Gate", time: "07:51 AM" },
      { icon: "fa-clipboard-check", title: "Chinedu Okafor's artisan profile was submitted for verification", desc: "Flat 14", time: "Yesterday, 04:18 PM" }
    ],

    alerts: [
      {
        icon: "fa-user-clock",
        title: "Pending Verification",
        desc: "8 artisans are waiting for verification.",
        cta: "Review",
        action: "filter-pending"
      },
      {
        icon: "fa-id-card-clock",
        title: "Expiring Passes",
        desc: "5 artisan passes expire today.",
        cta: "View Passes",
        action: "goto-passes"
      },
      {
        icon: "fa-user-slash",
        title: "Suspended Artisan",
        desc: "2 suspended artisans currently have associated units.",
        cta: "Review",
        action: "filter-suspended"
      }
    ],

    notifications: [
      {
        icon: "fa-user-check",
        title: "Artisan verification pending",
        desc: "Chinedu Okafor is awaiting verification.",
        time: "18m ago",
        unread: true
      },
      {
        icon: "fa-id-card-clock",
        title: "Artisan pass expiring",
        desc: "Yusuf Abdullahi's pass expires today.",
        time: "1h ago",
        unread: true
      }
    ]
  };

  NS.state = {
    search: "",
    verification: "all",
    service: "all",
    access: "all",
    registeredBy: "all",
    page: 1,
    perPage: 10,
    activeArtisanId: null
  };

})();


/* =========================================================
   HELPERS
   ========================================================= */

(function () {
  "use strict";

  const NS = window.RafaraArtisans;

  NS.helpers = {

    initials(name) {
      return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map(w => w[0].toUpperCase())
        .join("");
    },

    findArtisan(id) {
      return NS.DATA.artisans.find(a => a.artisanId === id);
    },

    statusBadge(status) {
      const map = {
        verified: { cls: "badge--verified", icon: "fa-circle-check", label: "Verified" },
        pending: { cls: "badge--pending", icon: "fa-circle-exclamation", label: "Pending Verification" },
        suspended: { cls: "badge--suspended", icon: "fa-circle-minus", label: "Suspended" }
      };
      const s = map[status] || map.pending;
      return `<span class="badge ${s.cls}"><i class="fa-solid ${s.icon}" aria-hidden="true"></i>${s.label}</span>`;
    },

    passBadge(pass) {
      const map = {
        active: { cls: "badge--active", icon: "fa-circle", label: "Active" },
        pending: { cls: "badge--pending", icon: "fa-circle", label: "Pending" },
        none: { cls: "badge--none", icon: "fa-circle", label: "None" }
      };
      const s = map[pass] || map.none;
      return `<span class="badge ${s.cls}"><i class="fa-solid ${s.icon}" aria-hidden="true"></i>${s.label}</span>`;
    },

    registeredForLabel(artisan) {
      if (artisan.units.length > 1) return "Multiple Units";
      return artisan.units[0];
    },

    maskPhone(phone) {
      const digits = phone.replace(/\D/g, "");
      if (digits.length < 4) return phone;
      return digits.slice(0, 4) + " XXX XXXX";
    }

  };

})();


/* =========================================================
   TOASTS
   ======================================================= */

(function () {
  "use strict";

  const NS = window.RafaraArtisans;

  NS.toast = function (message, type) {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const icons = {
      success: "fa-circle-check",
      error: "fa-circle-exclamation",
      info: "fa-circle-info"
    };
    const kind = type || "success";

    const el = document.createElement("div");
    el.className = `toast toast--${kind}`;
    el.innerHTML = `
      <span class="toast-icon"><i class="fa-solid ${icons[kind] || icons.info}" aria-hidden="true"></i></span>
      <span>${message}</span>
    `;

    container.appendChild(el);

    setTimeout(() => {
      el.classList.add("is-leaving");
      setTimeout(() => el.remove(), 200);
    }, 3200);
  };

})();


/* =========================================================
   RENDERING — STATS, NOTICE, ACTIVITY, ALERTS
   ======================================================= */

(function () {
  "use strict";

  const NS = window.RafaraArtisans;
  const DATA = NS.DATA;

  function renderStats() {
    const grid = document.getElementById("stats-grid");
    if (!grid) return;

    const cards = [
      { icon: "fa-helmet-safety", cls: "stat-icon--passes", value: DATA.stats.registered, label: "Registered Artisans", context: "Artisans registered with the estate" },
      { icon: "fa-shield-halved", cls: "stat-icon--inside", value: DATA.stats.verified, label: "Verified", context: "Approved service providers" },
      { icon: "fa-person-walking-arrow-right", cls: "stat-icon--upcoming", value: DATA.stats.activeToday, label: "Active Today", context: "Currently working in the estate" },
      { icon: "fa-id-card", cls: "stat-icon--pending", value: DATA.stats.activePasses, label: "Active Passes", context: "Artisan passes currently active" }
    ];

    grid.innerHTML = cards.map(c => `
      <article class="stat-card">
        <span class="stat-icon ${c.cls}"><i class="fa-solid ${c.icon}" aria-hidden="true"></i></span>
        <div class="stat-body">
          <span class="stat-number">${c.value}</span>
          <span class="stat-label">${c.label}</span>
          <span class="stat-context">${c.context}</span>
        </div>
      </article>
    `).join("");
  }

  function renderActivity() {
    const wrap = document.getElementById("artisan-activity-list");
    if (!wrap) return;

    if (!DATA.activity.length) {
      wrap.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-clock-rotate-left"></i>
          <strong>No recent activity</strong>
          <span>Artisan gate activity will appear here.</span>
        </div>`;
      return;
    }

    wrap.innerHTML = DATA.activity.map(item => `
      <div class="activity-item">
        <span class="activity-icon"><i class="fa-solid ${item.icon}"></i></span>
        <div class="activity-body">
          <strong>${item.title}</strong>
          <p>${item.desc}</p>
        </div>
        <span class="activity-time">${item.time}</span>
      </div>
    `).join("");
  }

  function renderAlerts() {
    const wrap = document.getElementById("artisan-alerts-list");
    if (!wrap) return;

    if (!DATA.alerts.length) {
      wrap.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-circle-check"></i>
          <strong>All caught up</strong>
          <span>No artisan alerts right now.</span>
        </div>`;
      return;
    }

    wrap.innerHTML = DATA.alerts.map(alert => `
      <div class="alert-item">
        <span class="alert-icon"><i class="fa-solid ${alert.icon}"></i></span>
        <div class="alert-body">
          <strong>${alert.title}</strong>
          <p>${alert.desc}</p>
          <button type="button" class="text-link" data-alert-action="${alert.action}">${alert.cta}</button>
        </div>
      </div>
    `).join("");

    wrap.querySelectorAll("[data-alert-action]").forEach(btn => {
      btn.addEventListener("click", () => {
        const action = btn.getAttribute("data-alert-action");
        if (action === "filter-pending") {
          document.getElementById("filter-verification").value = "pending";
          NS.applyFilters();
          document.querySelector(".panel--table").scrollIntoView({ behavior: "smooth", block: "start" });
        } else if (action === "filter-suspended") {
          document.getElementById("filter-verification").value = "suspended";
          NS.applyFilters();
          document.querySelector(".panel--table").scrollIntoView({ behavior: "smooth", block: "start" });
        } else if (action === "goto-passes") {
          window.location.href = "manager-passes.html";
        }
      });
    });
  }

  function renderNotifications() {
    const list = document.getElementById("notif-panel-list");
    const dot = document.getElementById("notif-dot");
    const sidebarCount = document.getElementById("sidebar-notif-count");
    if (!list) return;

    const unread = DATA.notifications.filter(n => n.unread).length;

    if (!DATA.notifications.length) {
      list.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-bell-slash"></i>
          <strong>No notifications</strong>
          <span>You're all caught up.</span>
        </div>`;
    } else {
      list.innerHTML = DATA.notifications.map(n => `
        <div class="notif-item${n.unread ? " is-unread" : ""}">
          <span class="notif-icon"><i class="fa-solid ${n.icon}"></i></span>
          <div class="notif-body">
            <strong>${n.title}</strong>
            <p>${n.desc}</p>
            <span class="notif-time">${n.time}</span>
          </div>
          ${n.unread ? '<span class="notif-unread-dot"></span>' : ""}
        </div>
      `).join("");
    }

    if (dot) dot.hidden = unread === 0;
    if (sidebarCount) {
      sidebarCount.textContent = unread;
      sidebarCount.hidden = unread === 0;
    }
  }

  NS.renderChrome = function () {
    renderStats();
    renderActivity();
    renderAlerts();
    renderNotifications();
  };

})();


/* =========================================================
   FILTERING, SORTING, PAGINATION, TABLE RENDER
   ======================================================= */

(function () {
  "use strict";

  const NS = window.RafaraArtisans;
  const DATA = NS.DATA;
  const state = NS.state;
  const helpers = NS.helpers;

  function getFiltered() {
    const q = state.search.trim().toLowerCase();

    return DATA.artisans.filter(a => {
      if (q) {
        const haystack = `${a.name} ${a.service} ${a.phone} ${a.artisanId}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (state.verification !== "all" && a.status !== state.verification) return false;
      if (state.service !== "all" && a.service !== state.service) return false;
      if (state.access === "active" && a.activePass !== "active") return false;
      if (state.access === "none" && a.activePass === "active") return false;
      if (state.registeredBy !== "all" && a.registeredBy !== state.registeredBy) return false;
      return true;
    });
  }

  function rowActionsMenu(a) {
    const items = [
      { icon: "fa-eye", label: "View Artisan", action: "view" },
      { icon: "fa-id-card", label: "View Passes", action: "passes" },
      { icon: "fa-clock-rotate-left", label: "View Access History", action: "history" },
      { icon: "fa-pen", label: "Edit Artisan", action: "edit" }
    ];

    if (a.status === "pending") {
      items.push({ icon: "fa-circle-check", label: "Verify Artisan", action: "verify" });
    }
    if (a.status === "verified" || a.status === "pending") {
      items.push({ icon: "fa-ban", label: "Suspend Artisan", action: "suspend", danger: true });
    }
    if (a.status === "suspended") {
      items.push({ icon: "fa-rotate-left", label: "Reactivate Artisan", action: "reactivate" });
    }

    return `
      <div class="row-menu" data-row-menu="${a.artisanId}">
        <button type="button" class="row-menu-btn" aria-haspopup="true" aria-expanded="false" aria-label="Actions for ${a.name}">
          <i class="fa-solid fa-ellipsis-vertical" aria-hidden="true"></i>
        </button>
        <div class="row-menu-panel" role="menu" hidden>
          ${items.map(it => `
            <button type="button" role="menuitem" data-row-action="${it.action}" data-id="${a.artisanId}" class="${it.danger ? "danger-item" : ""}">
              <i class="fa-solid ${it.icon}" aria-hidden="true"></i> ${it.label}
            </button>
          `).join("")}
        </div>
      </div>
    `;
  }

  function profileCell(a) {
    return `
      <div class="artisan-profile-cell">
        <span class="artisan-avatar">${helpers.initials(a.name)}</span>
        <div class="artisan-profile-info">
          <span class="artisan-name-row">${a.name}</span>
          <span class="artisan-sub">${a.artisanId} · ${helpers.maskPhone(a.phone)}</span>
        </div>
      </div>
    `;
  }

  function renderDesktopRow(a) {
    return `
      <tr data-artisan-row="${a.artisanId}">
        <td>${profileCell(a)}</td>
        <td>
          <div class="artisan-service-cell">
            <span class="service-icon"><i class="fa-solid ${window.RafaraArtisans.serviceIcon(a.service)}" aria-hidden="true"></i></span>
            ${a.service}
          </div>
        </td>
        <td>${helpers.statusBadge(a.status)}</td>
        <td>${helpers.registeredForLabel(a)}</td>
        <td>${helpers.passBadge(a.activePass)}</td>
        <td>${a.lastAccess}</td>
        <td class="col-actions">${rowActionsMenu(a)}</td>
      </tr>
    `;
  }

  function renderMobileCard(a) {
    return `
      <div class="artisan-card" data-artisan-row="${a.artisanId}">
        <div class="artisan-card-top">
          ${profileCell(a)}
          ${rowActionsMenu(a)}
        </div>
        <div class="artisan-card-meta">
          <div><span>Service</span><span>${a.service}</span></div>
          <div><span>Status</span><span>${helpers.statusBadge(a.status)}</span></div>
          <div><span>Registered For</span><span>${helpers.registeredForLabel(a)}</span></div>
          <div><span>Active Pass</span><span>${helpers.passBadge(a.activePass)}</span></div>
          <div><span>Last Access</span><span>${a.lastAccess}</span></div>
        </div>
        <div class="artisan-card-actions">
          <button type="button" class="btn btn--secondary btn--sm" data-row-action="view" data-id="${a.artisanId}">View Artisan</button>
        </div>
      </div>
    `;
  }

  NS.serviceIcon = function (service) {
    const icons = {
      "Plumber": "fa-faucet-drip",
      "Electrician": "fa-bolt",
      "Carpenter": "fa-hammer",
      "Painter": "fa-paint-roller",
      "AC Technician": "fa-fan",
      "Cleaner": "fa-broom",
      "Mechanic": "fa-wrench",
      "Technician": "fa-screwdriver-wrench",
      "Other": "fa-toolbox"
    };
    return icons[service] || "fa-toolbox";
  };

  function renderPagination(totalItems) {
    const wrap = document.getElementById("table-pagination");
    if (!wrap) return;

    const totalPages = Math.max(1, Math.ceil(totalItems / state.perPage));
    if (state.page > totalPages) state.page = totalPages;

    if (totalItems === 0) {
      wrap.innerHTML = "";
      return;
    }

    const pages = [];
    const cur = state.page;

    pages.push(1);
    if (cur > 3) pages.push("...");
    for (let p = Math.max(2, cur - 1); p <= Math.min(totalPages - 1, cur + 1); p++) {
      pages.push(p);
    }
    if (cur < totalPages - 2) pages.push("...");
    if (totalPages > 1) pages.push(totalPages);

    let html = `<button type="button" class="page-btn" id="page-prev" ${cur === 1 ? "disabled" : ""}><i class="fa-solid fa-chevron-left" aria-hidden="true"></i> Previous</button>`;

    pages.forEach(p => {
      if (p === "...") {
        html += `<span class="page-btn-ellipsis">…</span>`;
      } else {
        html += `<button type="button" class="page-btn${p === cur ? " is-active" : ""}" data-page="${p}">${p}</button>`;
      }
    });

    html += `<button type="button" class="page-btn" id="page-next" ${cur === totalPages ? "disabled" : ""}>Next <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button>`;

    wrap.innerHTML = html;

    const prev = document.getElementById("page-prev");
    const next = document.getElementById("page-next");
    if (prev) prev.addEventListener("click", () => { state.page = Math.max(1, state.page - 1); NS.renderTable(); });
    if (next) next.addEventListener("click", () => { state.page = Math.min(totalPages, state.page + 1); NS.renderTable(); });

    wrap.querySelectorAll("[data-page]").forEach(btn => {
      btn.addEventListener("click", () => {
        state.page = Number(btn.getAttribute("data-page"));
        NS.renderTable();
      });
    });
  }

  NS.renderTable = function () {
    const tbody = document.getElementById("artisan-table-body");
    const cardList = document.getElementById("artisan-card-list");
    const emptyState = document.getElementById("table-empty-state");
    const resultCount = document.getElementById("table-result-count");
    if (!tbody || !cardList) return;

    const filtered = getFiltered();
    const isZeroRegistered = DATA.artisans.length === 0;

    const start = (state.page - 1) * state.perPage;
    const pageItems = filtered.slice(start, start + state.perPage);

    if (!filtered.length) {
      tbody.innerHTML = "";
      cardList.innerHTML = "";
      emptyState.hidden = false;
      emptyState.classList.add("is-visible-mobile");

      const heading = document.getElementById("empty-state-heading");
      const desc = document.getElementById("empty-state-desc");
      const btn = document.getElementById("empty-state-btn");

      if (isZeroRegistered) {
        heading.textContent = "No artisans registered yet";
        desc.textContent = "Register trusted service providers so they can be recognized by the estate.";
        btn.textContent = "Register Artisan";
        btn.onclick = () => NS.openArtisanForm();
      } else {
        heading.textContent = "No artisans found";
        desc.textContent = "Try adjusting your search or filters.";
        btn.textContent = "Clear Filters";
        btn.onclick = () => NS.clearFilters();
      }

      resultCount.textContent = `Showing 0 of ${DATA.artisans.length} artisans`;
      renderPagination(0);
      return;
    }

    emptyState.hidden = true;
    emptyState.classList.remove("is-visible-mobile");

    tbody.innerHTML = pageItems.map(renderDesktopRow).join("");
    cardList.innerHTML = pageItems.map(renderMobileCard).join("");

    const shownEnd = Math.min(start + state.perPage, filtered.length);
    resultCount.textContent = `Showing ${filtered.length ? start + 1 : 0}–${shownEnd} of ${filtered.length} artisans`;

    renderPagination(filtered.length);
    NS.bindRowEvents();
  };

  NS.applyFilters = function () {
    state.search = document.getElementById("artisan-search-input").value;
    state.verification = document.getElementById("filter-verification").value;
    state.service = document.getElementById("filter-service").value;
    state.access = document.getElementById("filter-access").value;
    state.registeredBy = document.getElementById("filter-registeredby").value;
    state.page = 1;
    NS.renderTable();
  };

  NS.clearFilters = function () {
    document.getElementById("artisan-search-input").value = "";
    document.getElementById("filter-verification").value = "all";
    document.getElementById("filter-service").value = "all";
    document.getElementById("filter-access").value = "all";
    document.getElementById("filter-registeredby").value = "all";
    state.search = "";
    state.verification = "all";
    state.service = "all";
    state.access = "all";
    state.registeredBy = "all";
    state.page = 1;
    NS.renderTable();
  };

})();


/* =========================================================
   ROW ACTION EVENTS + ROW MENUS
   ======================================================= */

(function () {
  "use strict";

  const NS = window.RafaraArtisans;

  function closeAllRowMenus(except) {
    document.querySelectorAll(".row-menu-panel").forEach(panel => {
      if (panel === except) return;
      panel.hidden = true;
      const btn = panel.previousElementSibling;
      if (btn) btn.setAttribute("aria-expanded", "false");
    });
  }

  NS.bindRowEvents = function () {
    document.querySelectorAll("[data-row-menu]").forEach(wrap => {
      const btn = wrap.querySelector(".row-menu-btn");
      const panel = wrap.querySelector(".row-menu-panel");
      if (!btn || !panel) return;

      btn.addEventListener("click", e => {
        e.stopPropagation();
        const wasOpen = !panel.hidden;
        closeAllRowMenus();
        panel.hidden = wasOpen;
        btn.setAttribute("aria-expanded", String(!wasOpen));
      });
    });

    document.querySelectorAll("[data-row-action]").forEach(btn => {
      btn.addEventListener("click", e => {
        e.stopPropagation();
        const id = btn.getAttribute("data-id");
        const action = btn.getAttribute("data-row-action");
        closeAllRowMenus();
        NS.handleRowAction(action, id);
      });
    });
  };

  document.addEventListener("click", () => closeAllRowMenus());
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeAllRowMenus();
  });

  NS.handleRowAction = function (action, id) {
    switch (action) {
      case "view":
        NS.openDrawer(id);
        break;
      case "passes":
        window.location.href = "manager-passes.html";
        break;
      case "history":
        NS.openDrawer(id);
        break;
      case "edit":
        NS.openArtisanForm(id);
        break;
      case "verify":
        NS.openVerifyModal(id);
        break;
      case "suspend":
        NS.openSuspendModal(id);
        break;
      case "reactivate":
        NS.openReactivateModal(id);
        break;
    }
  };

})();


/* =========================================================
   DRAWER
   ======================================================= */

(function () {
  "use strict";

  const NS = window.RafaraArtisans;
  const helpers = NS.helpers;

  const drawer = document.getElementById("artisan-drawer");
  const backdrop = document.getElementById("drawer-backdrop");
  const closeBtn = document.getElementById("drawer-close-btn");

  function renderProfile(a) {
    const wrap = document.getElementById("drawer-profile");
    wrap.innerHTML = `
      <div class="drawer-profile-top">
        <span class="drawer-avatar">${helpers.initials(a.name)}</span>
        <div>
          <div class="drawer-profile-name">${a.name}</div>
          <div class="drawer-profile-id">${a.artisanId} · ${a.service}</div>
        </div>
      </div>
      <div class="drawer-profile-badges">
        ${helpers.statusBadge(a.status)}
      </div>
    `;
  }

  function renderBody(a) {
    const wrap = document.getElementById("drawer-body");

    const unitsHtml = a.units.map(u => `
      <div class="unit-card">
        <div class="unit-card-text">
          <strong>${u}</strong>
          <span>${a.service} · Service assignment</span>
        </div>
        <span class="badge badge--active"><i class="fa-solid fa-circle" aria-hidden="true"></i>Active</span>
      </div>
    `).join("");

    const timelineHtml = a.history.map(h => `
      <div class="drawer-timeline-item">
        <span class="timeline-dot" aria-hidden="true"></span>
        <div class="timeline-content">
          <strong>${h.label}</strong>
          <span>${h.time} ${h.loc && h.loc !== "—" ? "· " + h.loc : ""}</span>
        </div>
      </div>
    `).join("");

    const passSection = a.activePass === "active" ? `
      <div class="pass-info-card">
        <div class="access-card-row"><span>Pass Type</span><span>Artisan Pass</span></div>
        <div class="access-card-row"><span>Issued by</span><span>Estate Manager</span></div>
        <div class="access-card-row"><span>Associated Unit</span><span>${helpers.registeredForLabel(a)}</span></div>
        <div class="access-card-row"><span>Valid Until</span><span>${a.passValidUntil}</span></div>
        <div class="access-card-row"><span>Check-in Status</span><span>${a.checkedIn ? "Currently Inside" : "Currently Outside"}</span></div>
        <button type="button" class="btn btn--secondary btn--sm drawer-full-width-btn" id="view-pass-btn">View Pass</button>
      </div>
    ` : `
      <div class="pass-info-card">
        <p style="color: var(--text-muted); font-size: 12px; margin: 0;">This artisan does not currently have an active pass.</p>
      </div>
    `;

    wrap.innerHTML = `
      <section>
        <div class="drawer-section-title"><h3>Personal Information</h3></div>
        <div class="info-grid">
          <div><span class="info-label">Full Name</span><span class="info-value">${a.name}</span></div>
          <div><span class="info-label">Phone Number</span><span class="info-value">${a.phone}</span></div>
          <div><span class="info-label">Artisan ID</span><span class="info-value">${a.artisanId}</span></div>
          <div><span class="info-label">Service Category</span><span class="info-value">${a.service}</span></div>
          <div><span class="info-label">Date Registered</span><span class="info-value">${a.dateRegistered}</span></div>
          <div><span class="info-label">Verification Status</span><span class="info-value">${a.status === "verified" ? "Verified" : a.status === "pending" ? "Pending Verification" : "Suspended"}</span></div>
        </div>
      </section>

      <section>
        <div class="drawer-section-title"><h3>Estate Registration</h3></div>
        <div class="info-grid">
          <div><span class="info-label">Registered By</span><span class="info-value">${a.registeredBy}</span></div>
          <div><span class="info-label">Registered For</span><span class="info-value">${helpers.registeredForLabel(a)}</span></div>
        </div>
      </section>

      <section>
        <div class="drawer-section-title"><h3>Current Access</h3></div>
        <div class="access-card">
          <div class="access-card-row"><span>Active Pass</span><span>${a.activePass === "active" ? "Yes" : a.activePass === "pending" ? "Pending" : "No"}</span></div>
          <div class="access-card-row"><span>Current Location</span><span>${a.currentLocation}</span></div>
          <div class="access-card-row"><span>Check-in Status</span><span>${a.checkedIn ? "Inside Estate" : "Outside Estate"}</span></div>
        </div>
      </section>

      <section>
        <div class="drawer-section-title"><h3>Artisan Pass</h3></div>
        ${passSection}
      </section>

      <section>
        <div class="drawer-section-title">
          <h3>Access History</h3>
        </div>
        <div class="drawer-timeline">${timelineHtml}</div>
        <button type="button" class="btn btn--ghost btn--sm drawer-full-width-btn" id="view-full-history-btn">View Full History</button>
      </section>

      <section>
        <div class="drawer-section-title"><h3>Associated Units</h3></div>
        ${unitsHtml}
        <button type="button" class="btn btn--secondary btn--sm drawer-full-width-btn" id="drawer-add-unit-btn">
          <i class="fa-solid fa-plus" aria-hidden="true"></i> Add Unit
        </button>
      </section>
    `;

    const viewPassBtn = document.getElementById("view-pass-btn");
    if (viewPassBtn) viewPassBtn.addEventListener("click", () => { window.location.href = "manager-passes.html"; });

    const historyBtn = document.getElementById("view-full-history-btn");
    if (historyBtn) historyBtn.addEventListener("click", () => { window.location.href = "manager-activity.html"; });

    const addUnitBtn = document.getElementById("drawer-add-unit-btn");
    if (addUnitBtn) addUnitBtn.addEventListener("click", () => {
      NS.closeDrawer();
      NS.openArtisanForm(a.artisanId, { focusUnits: true });
    });
  }

  NS.openDrawer = function (id) {
    const a = helpers.findArtisan(id);
    if (!a) return;

    NS.state.activeArtisanId = id;
    renderProfile(a);
    renderBody(a);

    drawer.hidden = false;
    backdrop.hidden = false;
    requestAnimationFrame(() => {
      drawer.classList.add("is-open");
      backdrop.classList.add("is-open");
    });
    document.body.style.overflow = "hidden";
  };

  NS.closeDrawer = function () {
    drawer.classList.remove("is-open");
    backdrop.classList.remove("is-open");
    document.body.style.overflow = "";
    setTimeout(() => {
      drawer.hidden = true;
      backdrop.hidden = true;
    }, 240);
  };

  closeBtn.addEventListener("click", NS.closeDrawer);
  backdrop.addEventListener("click", NS.closeDrawer);
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !drawer.hidden) NS.closeDrawer();
  });

})();


/* =========================================================
   ADD / EDIT ARTISAN MODAL
   ======================================================= */

(function () {
  "use strict";

  const NS = window.RafaraArtisans;
  const DATA = NS.DATA;

  const backdrop = document.getElementById("artisan-form-modal-backdrop");
  const title = document.getElementById("artisan-form-modal-title");
  const form = document.getElementById("artisan-form");
  const submitBtn = document.getElementById("artisan-form-submit-btn");
  const closeBtn = document.getElementById("artisan-form-close-btn");
  const cancelBtn = document.getElementById("artisan-form-cancel-btn");
  const generateIdBtn = document.getElementById("generate-id-btn");

  const fieldName = document.getElementById("field-fullname");
  const fieldPhone = document.getElementById("field-phone");
  const fieldService = document.getElementById("field-service");
  const fieldId = document.getElementById("field-artisanid");
  const fieldStatus = document.getElementById("field-status");
  const fieldNotes = document.getElementById("field-notes");
  const unitSearch = document.getElementById("field-unit-search");
  const unitOptions = document.getElementById("unit-options");
  const unitChipsWrap = document.getElementById("unit-chips");

  const ALL_UNITS = Array.from({ length: 60 }, (_, i) => (
    (i + 1) % 6 === 0 ? `House ${i + 1}` : `Flat ${i + 1}`
  ));

  let editingId = null;
  let selectedUnits = [];
  let nextIdCounter = 200;

  function openModal() {
    backdrop.hidden = false;
    requestAnimationFrame(() => backdrop.classList.add("is-open"));
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    backdrop.classList.remove("is-open");
    document.body.style.overflow = "";
    setTimeout(() => { backdrop.hidden = true; }, 200);
  }

  function clearErrors() {
    form.querySelectorAll(".form-field").forEach(f => f.classList.remove("has-error"));
  }

  function renderChips() {
    unitChipsWrap.innerHTML = selectedUnits.map(u => `
      <span class="unit-chip">${u} <button type="button" data-remove-unit="${u}" aria-label="Remove ${u}"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button></span>
    `).join("");

    unitChipsWrap.querySelectorAll("[data-remove-unit]").forEach(btn => {
      btn.addEventListener("click", () => {
        const u = btn.getAttribute("data-remove-unit");
        selectedUnits = selectedUnits.filter(x => x !== u);
        renderChips();
      });
    });
  }

  function showUnitOptions(query) {
    const q = (query || "").toLowerCase();
    const results = ALL_UNITS
      .filter(u => !selectedUnits.includes(u))
      .filter(u => u.toLowerCase().includes(q))
      .slice(0, 8);

    if (!results.length) {
      unitOptions.hidden = true;
      unitOptions.innerHTML = "";
      return;
    }

    unitOptions.innerHTML = results.map(u => `<button type="button" class="unit-option" data-unit="${u}">${u}</button>`).join("");
    unitOptions.hidden = false;

    unitOptions.querySelectorAll("[data-unit]").forEach(btn => {
      btn.addEventListener("click", () => {
        const u = btn.getAttribute("data-unit");
        if (!selectedUnits.includes(u)) selectedUnits.push(u);
        renderChips();
        unitSearch.value = "";
        unitOptions.hidden = true;
      });
    });
  }

  unitSearch.addEventListener("input", () => showUnitOptions(unitSearch.value));
  unitSearch.addEventListener("focus", () => showUnitOptions(unitSearch.value));
  document.addEventListener("click", e => {
    if (!e.target.closest(".unit-selector")) unitOptions.hidden = true;
  });

  generateIdBtn.addEventListener("click", () => {
    fieldId.value = `ART-0${nextIdCounter}`;
    nextIdCounter++;
  });

  NS.openArtisanForm = function (id, opts) {
    clearErrors();
    editingId = id || null;
    selectedUnits = [];

    if (editingId) {
      const a = NS.helpers.findArtisan(editingId);
      title.textContent = "Edit Artisan";
      submitBtn.textContent = "Save Changes";
      fieldName.value = a.name;
      fieldPhone.value = a.phone;
      fieldService.value = a.service;
      fieldId.value = a.artisanId;
      fieldStatus.value = a.status === "suspended" ? "pending" : a.status;
      fieldNotes.value = a.notes || "";
      selectedUnits = [...a.units];
    } else {
      title.textContent = "Register Artisan";
      submitBtn.textContent = "Register Artisan";
      form.reset();
      fieldId.value = `ART-0${nextIdCounter}`;
      nextIdCounter++;
      fieldStatus.value = "pending";
    }

    renderChips();
    openModal();

    if (opts && opts.focusUnits) {
      setTimeout(() => unitSearch.focus(), 260);
    }
  };

  closeBtn.addEventListener("click", closeModal);
  cancelBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", e => { if (e.target === backdrop) closeModal(); });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !backdrop.hidden) closeModal();
  });

  document.getElementById("add-artisan-btn").addEventListener("click", () => NS.openArtisanForm());

  form.addEventListener("submit", e => {
    e.preventDefault();
    clearErrors();

    let valid = true;
    if (!fieldName.value.trim()) {
      document.getElementById("field-fullname").closest(".form-field").classList.add("has-error");
      valid = false;
    }
    if (!fieldPhone.value.trim() || fieldPhone.value.trim().length < 7) {
      document.getElementById("field-phone").closest(".form-field").classList.add("has-error");
      valid = false;
    }
    if (!fieldService.value) {
      document.getElementById("field-service").closest(".form-field").classList.add("has-error");
      valid = false;
    }
    if (!selectedUnits.length) {
      document.getElementById("field-unit-search").closest(".form-field").classList.add("has-error");
      valid = false;
    }

    if (!valid) return;

    if (editingId) {
      const a = NS.helpers.findArtisan(editingId);
      a.name = fieldName.value.trim();
      a.phone = fieldPhone.value.trim();
      a.service = fieldService.value;
      a.status = fieldStatus.value;
      a.notes = fieldNotes.value.trim();
      a.units = [...selectedUnits];
      NS.toast("Artisan profile updated successfully.", "success");
    } else {
      const newArtisan = {
        artisanId: fieldId.value,
        name: fieldName.value.trim(),
        phone: fieldPhone.value.trim(),
        service: fieldService.value,
        status: fieldStatus.value,
        registeredBy: "Estate Manager",
        units: [...selectedUnits],
        activePass: "none",
        checkedIn: false,
        dateRegistered: "Today",
        lastAccess: "—",
        notes: fieldNotes.value.trim(),
        passValidUntil: "—",
        currentLocation: "—",
        history: [{ time: "Just now", label: "Artisan profile registered", loc: "—" }]
      };
      DATA.artisans.unshift(newArtisan);
      DATA.stats.registered++;
      if (newArtisan.status === "verified") DATA.stats.verified++;
      NS.toast("Artisan registered successfully.", "success");
    }

    closeModal();
    NS.renderChrome();
    NS.state.page = 1;
    NS.renderTable();
  });

})();


/* =========================================================
   VERIFY / SUSPEND / REACTIVATE MODALS
   ======================================================= */

(function () {
  "use strict";

  const NS = window.RafaraArtisans;
  const DATA = NS.DATA;
  const helpers = NS.helpers;

  function setupConfirmModal(config) {
    const backdrop = document.getElementById(config.backdropId);
    const closeBtn = document.getElementById(config.closeBtnId);
    const cancelBtn = document.getElementById(config.cancelBtnId);
    const confirmBtn = document.getElementById(config.confirmBtnId);
    const subjectEl = document.getElementById(config.subjectId);

    let currentId = null;

    function open(id) {
      currentId = id;
      const a = helpers.findArtisan(id);
      subjectEl.innerHTML = `
        <span class="artisan-avatar">${helpers.initials(a.name)}</span>
        <div class="artisan-profile-info">
          <span class="artisan-name-row">${a.name}</span>
          <span class="artisan-sub">${a.artisanId}</span>
        </div>
      `;
      backdrop.hidden = false;
      requestAnimationFrame(() => backdrop.classList.add("is-open"));
      document.body.style.overflow = "hidden";
    }

    function close() {
      backdrop.classList.remove("is-open");
      document.body.style.overflow = "";
      setTimeout(() => { backdrop.hidden = true; }, 200);
    }

    closeBtn.addEventListener("click", close);
    cancelBtn.addEventListener("click", close);
    backdrop.addEventListener("click", e => { if (e.target === backdrop) close(); });

    confirmBtn.addEventListener("click", () => {
      config.onConfirm(currentId);
      close();
    });

    return { open, close };
  }

  const verifyModal = setupConfirmModal({
    backdropId: "verify-modal-backdrop",
    closeBtnId: "verify-modal-close-btn",
    cancelBtnId: "verify-cancel-btn",
    confirmBtnId: "verify-confirm-btn",
    subjectId: "verify-modal-subject",
    onConfirm(id) {
      const a = helpers.findArtisan(id);
      const wasPending = a.status === "pending";
      a.status = "verified";
      if (wasPending) DATA.stats.verified++;
      NS.toast("Artisan verified successfully.", "success");
      NS.renderChrome();
      NS.renderTable();
    }
  });

  const suspendModal = setupConfirmModal({
    backdropId: "suspend-modal-backdrop",
    closeBtnId: "suspend-modal-close-btn",
    cancelBtnId: "suspend-cancel-btn",
    confirmBtnId: "suspend-confirm-btn",
    subjectId: "suspend-modal-subject",
    onConfirm(id) {
      const a = helpers.findArtisan(id);
      const wasVerified = a.status === "verified";
      a.status = "suspended";
      a.activePass = "none";
      if (wasVerified) DATA.stats.verified = Math.max(0, DATA.stats.verified - 1);
      NS.toast("Artisan has been suspended.", "error");
      NS.renderChrome();
      NS.renderTable();
    }
  });

  const reactivateModal = setupConfirmModal({
    backdropId: "reactivate-modal-backdrop",
    closeBtnId: "reactivate-modal-close-btn",
    cancelBtnId: "reactivate-cancel-btn",
    confirmBtnId: "reactivate-confirm-btn",
    subjectId: "reactivate-modal-subject",
    onConfirm(id) {
      const a = helpers.findArtisan(id);
      a.status = "verified";
      DATA.stats.verified++;
      NS.toast("Artisan has been reactivated.", "success");
      NS.renderChrome();
      NS.renderTable();
    }
  });

  NS.openVerifyModal = verifyModal.open;
  NS.openSuspendModal = suspendModal.open;
  NS.openReactivateModal = reactivateModal.open;

})();


/* =========================================================
   SEARCH & FILTER BINDINGS
   ======================================================= */

(function () {
  "use strict";

  const NS = window.RafaraArtisans;

  document.getElementById("artisan-search-input").addEventListener("input", NS.applyFilters);
  document.getElementById("filter-verification").addEventListener("change", NS.applyFilters);
  document.getElementById("filter-service").addEventListener("change", NS.applyFilters);
  document.getElementById("filter-access").addEventListener("change", NS.applyFilters);
  document.getElementById("filter-registeredby").addEventListener("change", NS.applyFilters);
  document.getElementById("clear-filters-btn").addEventListener("click", NS.clearFilters);

  const quickSearch = document.getElementById("quick-search-input");
  if (quickSearch) {
    quickSearch.addEventListener("input", () => {
      document.getElementById("artisan-search-input").value = quickSearch.value;
      NS.applyFilters();
    });
  }

})();


/* =========================================================
   SHELL: SIDEBAR / DROPDOWNS / MOBILE SHEET / LOGOUT
   ======================================================= */

(function () {
  "use strict";

  const sidebar = document.getElementById("sidebar");
  const backdrop = document.getElementById("sidebar-backdrop");
  const toggle = document.getElementById("sidebar-toggle-btn");

  if (sidebar && backdrop && toggle) {
    function openSidebar() {
      sidebar.classList.add("is-open");
      backdrop.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }
    function closeSidebar() {
      sidebar.classList.remove("is-open");
      backdrop.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
    toggle.addEventListener("click", () => {
      sidebar.classList.contains("is-open") ? closeSidebar() : openSidebar();
    });
    backdrop.addEventListener("click", closeSidebar);
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeSidebar(); });
  }

  // Dropdowns
  const dropdowns = document.querySelectorAll("[data-dropdown]");
  function closeAllDropdowns(except) {
    dropdowns.forEach(wrapper => {
      if (wrapper === except) return;
      const panel = wrapper.querySelector(".dropdown-panel");
      const button = wrapper.querySelector("button");
      if (panel) panel.hidden = true;
      if (button) button.setAttribute("aria-expanded", "false");
    });
  }
  dropdowns.forEach(wrapper => {
    const button = wrapper.querySelector("button");
    const panel = wrapper.querySelector(".dropdown-panel");
    if (!button || !panel) return;
    button.addEventListener("click", e => {
      e.stopPropagation();
      const wasOpen = !panel.hidden;
      closeAllDropdowns();
      panel.hidden = wasOpen;
      button.setAttribute("aria-expanded", String(!wasOpen));
      if (!wasOpen && panel.id === "search-panel") {
        setTimeout(() => document.getElementById("quick-search-input").focus(), 60);
      }
    });
  });
  document.addEventListener("click", e => {
    const inside = [...dropdowns].some(d => d.contains(e.target));
    if (!inside) closeAllDropdowns();
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeAllDropdowns(); });

  // Mark all read
  const markAllBtn = document.getElementById("mark-all-read-btn");
  if (markAllBtn) {
    markAllBtn.addEventListener("click", () => {
      window.RafaraArtisans.DATA.notifications.forEach(n => { n.unread = false; });
      window.RafaraArtisans.renderChrome();
    });
  }

  // Mobile "more" sheet
  const sheet = document.getElementById("mobile-menu-sheet");
  const sheetBtn = document.getElementById("mobile-menu-btn");
  const closeTriggers = document.querySelectorAll("[data-close-mobile-sheet]");

  if (sheet && sheetBtn) {
    function openSheet() {
      sheet.hidden = false;
      requestAnimationFrame(() => sheet.classList.add("is-open"));
      sheetBtn.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }
    function closeSheet() {
      sheet.classList.remove("is-open");
      sheetBtn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      setTimeout(() => { sheet.hidden = true; }, 220);
    }
    sheetBtn.addEventListener("click", () => { sheet.hidden ? openSheet() : closeSheet(); });
    closeTriggers.forEach(t => t.addEventListener("click", closeSheet));
    document.addEventListener("keydown", e => { if (e.key === "Escape" && !sheet.hidden) closeSheet(); });
  }

  // Logout
  const logoutTriggers = [
    document.getElementById("logout-btn"),
    document.getElementById("mobile-logout-btn"),
    document.getElementById("dropdown-logout-btn")
  ].filter(Boolean);

  logoutTriggers.forEach(btn => {
    btn.addEventListener("click", () => { window.location.href = "manager-login.html"; });
  });

})();


/* =========================================================
   INIT
   ======================================================= */

document.addEventListener("DOMContentLoaded", () => {
  window.RafaraArtisans.renderChrome();
  window.RafaraArtisans.renderTable();
});
