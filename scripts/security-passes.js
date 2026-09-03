/* =========================================================
   RAFARA GATEPASS — SECURITY: PASSES PAGE
   Frontend-only demo logic. No backend/API.
   ========================================================= */

(function () {
  "use strict";

  window.RafaraSecurity = window.RafaraSecurity || {};

  /* =======================================================
     MOCK DATA
     ======================================================= */

  const PASS_TYPE_ICONS = {
    "One-Day Visitor": "fa-user-clock",
    "Multi-Day Visitor": "fa-calendar-days",
    "Artisan": "fa-screwdriver-wrench",
    "Property Exit": "fa-box-open",
    "Ride / Delivery": "fa-motorcycle"
  };

  const PASSES = [
    {
      code: "RF4827",
      type: "One-Day Visitor",
      status: "active",
      visitor: { name: "Aisha Bello", phone: "0803 214 7765" },
      resident: { name: "Rahmah Ogunlaja" },
      unit: "B8-F5",
      issueDate: "Sep 3, 2026 · 7:55 AM",
      validFrom: "Sep 3, 2026 · 10:00 AM",
      validUntil: "Sep 3, 2026 · 6:00 PM",
      validityLabel: "Today",
      validityRange: "10 AM – 6 PM",
      arrival: "10:30 AM",
      checkIn: "10:42 AM",
      checkOut: "—",
      uses: "Single entry · used once",
      history: [
        { icon: "fa-circle-plus", tone: "", title: "Pass created", desc: "Issued by Rahmah Ogunlaja", time: "7:55 AM" },
        { icon: "fa-shield-halved", tone: "success", title: "Pass verified", desc: "Verified at Gate 2", time: "10:41 AM" },
        { icon: "fa-door-open", tone: "success", title: "Entry granted", desc: "Aisha Bello checked in", time: "10:42 AM" }
      ]
    },
    {
      code: "RF1934",
      type: "Multi-Day Visitor",
      status: "active",
      visitor: { name: "Ibrahim Musa", phone: "0705 991 2231" },
      resident: { name: "T. Adeyemi" },
      unit: "BA-F12",
      issueDate: "Sep 1, 2026 · 6:10 PM",
      validFrom: "Sep 3, 2026 · 12:00 AM",
      validUntil: "Sep 5, 2026 · 11:59 PM",
      validityLabel: "Sep 3 – Sep 5",
      validityRange: "All day",
      arrival: "11:00 AM",
      checkIn: "10:58 AM",
      checkOut: "—",
      uses: "Multiple entries · 2 of unlimited",
      history: [
        { icon: "fa-circle-plus", tone: "", title: "Pass created", desc: "Issued by T. Adeyemi", time: "Sep 1 · 6:10 PM" },
        { icon: "fa-shield-halved", tone: "success", title: "Pass verified", desc: "Verified at Gate 2", time: "Sep 3 · 10:57 AM" },
        { icon: "fa-door-open", tone: "success", title: "Entry granted", desc: "Ibrahim Musa checked in", time: "Sep 3 · 10:58 AM" }
      ]
    },
    {
      code: "RF7812",
      type: "One-Day Visitor",
      status: "expired",
      visitor: { name: "David Adeyemi", phone: "0813 402 5518" },
      resident: { name: "K. Johnson" },
      unit: "BA1-F7",
      issueDate: "Sep 2, 2026 · 7:40 AM",
      validFrom: "Sep 2, 2026 · 8:00 AM",
      validUntil: "Sep 2, 2026 · 5:00 PM",
      validityLabel: "Sep 2",
      validityRange: "8 AM – 5 PM",
      arrival: "8:10 AM",
      checkIn: "8:12 AM",
      checkOut: "4:55 PM",
      uses: "Single entry · used once",
      history: [
        { icon: "fa-circle-plus", tone: "", title: "Pass created", desc: "Issued by K. Johnson", time: "Sep 2 · 7:40 AM" },
        { icon: "fa-shield-halved", tone: "success", title: "Pass verified", desc: "Verified at Gate 2", time: "Sep 2 · 8:11 AM" },
        { icon: "fa-door-open", tone: "success", title: "Entry granted", desc: "David Adeyemi checked in", time: "Sep 2 · 8:12 AM" },
        { icon: "fa-right-from-bracket", tone: "", title: "Exit recorded", desc: "David Adeyemi checked out", time: "Sep 2 · 4:55 PM" },
        { icon: "fa-hourglass-end", tone: "warning", title: "Pass expired", desc: "Validity window closed", time: "Sep 2 · 5:00 PM" }
      ]
    },
    {
      code: "RF6281",
      type: "Ride / Delivery",
      status: "active",
      visitor: { name: "Fathia Ismail", phone: "0902 774 3390" },
      resident: { name: "S. Bello" },
      unit: "B20-F5",
      issueDate: "Sep 3, 2026 · 11:20 AM",
      validFrom: "Sep 3, 2026 · 12:00 PM",
      validUntil: "Sep 3, 2026 · 2:00 PM",
      validityLabel: "Today",
      validityRange: "12 PM – 2 PM",
      arrival: "12:05 PM",
      checkIn: "—",
      checkOut: "—",
      uses: "Single entry · not yet used",
      history: [
        { icon: "fa-circle-plus", tone: "", title: "Pass created", desc: "Issued by S. Bello", time: "11:20 AM" }
      ]
    },
    {
      code: "RF3390",
      type: "Artisan",
      status: "upcoming",
      visitor: { name: "Peter Okonkwo", phone: "0816 220 4471" },
      resident: { name: "M. Uche" },
      unit: "C4-F2",
      issueDate: "Sep 3, 2026 · 9:05 AM",
      validFrom: "Sep 4, 2026 · 9:00 AM",
      validUntil: "Sep 4, 2026 · 3:00 PM",
      validityLabel: "Sep 4",
      validityRange: "9 AM – 3 PM",
      arrival: "9:00 AM",
      checkIn: "—",
      checkOut: "—",
      uses: "Single entry · not yet used",
      history: [
        { icon: "fa-circle-plus", tone: "", title: "Pass created", desc: "Issued by M. Uche", time: "9:05 AM" }
      ]
    },
    {
      code: "RF9034",
      type: "Property Exit",
      status: "used",
      visitor: { name: "Grace Nnamdi", phone: "0708 663 1129" },
      resident: { name: "K. Balogun" },
      unit: "C3-F11",
      issueDate: "Sep 3, 2026 · 8:00 AM",
      validFrom: "Sep 3, 2026 · 8:00 AM",
      validUntil: "Sep 3, 2026 · 11:00 AM",
      validityLabel: "Today",
      validityRange: "8 AM – 11 AM",
      arrival: "9:20 AM",
      checkIn: "9:22 AM",
      checkOut: "9:24 AM",
      uses: "Single exit · completed",
      history: [
        { icon: "fa-circle-plus", tone: "", title: "Pass created", desc: "Issued by K. Balogun", time: "8:00 AM" },
        { icon: "fa-shield-halved", tone: "success", title: "Pass verified", desc: "Verified at Gate 2", time: "9:22 AM" },
        { icon: "fa-box-open", tone: "success", title: "Exit recorded", desc: "Item exit confirmed for Grace Nnamdi", time: "9:24 AM" }
      ]
    },
    {
      code: "RF1902",
      type: "Multi-Day Visitor",
      status: "cancelled",
      visitor: { name: "Tunde Bakare", phone: "0810 556 2098" },
      resident: { name: "O. Fashola" },
      unit: "A-204",
      issueDate: "Sep 1, 2026 · 4:12 PM",
      validFrom: "Sep 2, 2026 · 12:00 AM",
      validUntil: "Sep 4, 2026 · 11:59 PM",
      validityLabel: "Sep 2 – Sep 4",
      validityRange: "All day",
      arrival: "—",
      checkIn: "—",
      checkOut: "—",
      uses: "Not used",
      history: [
        { icon: "fa-circle-plus", tone: "", title: "Pass created", desc: "Issued by O. Fashola", time: "Sep 1 · 4:12 PM" },
        { icon: "fa-ban", tone: "danger", title: "Pass cancelled", desc: "Cancelled by O. Fashola", time: "Sep 2 · 7:40 AM" }
      ]
    },
    {
      code: "RF5518",
      type: "One-Day Visitor",
      status: "denied",
      visitor: { name: "Unknown Visitor", phone: "—" },
      resident: { name: "—" },
      unit: "—",
      issueDate: "—",
      validFrom: "—",
      validUntil: "—",
      validityLabel: "Sep 3",
      validityRange: "9:47 AM attempt",
      arrival: "—",
      checkIn: "—",
      checkOut: "—",
      uses: "Access attempt only",
      history: [
        { icon: "fa-circle-xmark", tone: "danger", title: "Access denied", desc: "Unrecognized code attempted at Gate 2", time: "9:47 AM" }
      ]
    },
    {
      code: "RF2265",
      type: "One-Day Visitor",
      status: "active",
      visitor: { name: "Chuka Okafor", phone: "0901 337 8842" },
      resident: { name: "F. Eze" },
      unit: "A-117",
      issueDate: "Sep 3, 2026 · 8:30 AM",
      validFrom: "Sep 3, 2026 · 1:00 PM",
      validUntil: "Sep 3, 2026 · 7:00 PM",
      validityLabel: "Today",
      validityRange: "1 PM – 7 PM",
      arrival: "1:00 PM",
      checkIn: "—",
      checkOut: "—",
      uses: "Single entry · not yet used",
      history: [
        { icon: "fa-circle-plus", tone: "", title: "Pass created", desc: "Issued by F. Eze", time: "8:30 AM" }
      ]
    },
    {
      code: "RF8871",
      type: "Ride / Delivery",
      status: "expired",
      visitor: { name: "Samuel Iortyer", phone: "0812 004 5563" },
      resident: { name: "N. Chukwu" },
      unit: "D-402",
      issueDate: "Sep 2, 2026 · 3:00 PM",
      validFrom: "Sep 2, 2026 · 3:00 PM",
      validUntil: "Sep 2, 2026 · 4:00 PM",
      validityLabel: "Sep 2",
      validityRange: "3 PM – 4 PM",
      arrival: "3:10 PM",
      checkIn: "3:12 PM",
      checkOut: "3:35 PM",
      uses: "Single entry · used once",
      history: [
        { icon: "fa-circle-plus", tone: "", title: "Pass created", desc: "Issued by N. Chukwu", time: "3:00 PM" },
        { icon: "fa-shield-halved", tone: "success", title: "Pass verified", desc: "Verified at Gate 2", time: "3:11 PM" },
        { icon: "fa-door-open", tone: "success", title: "Entry granted", desc: "Samuel Iortyer checked in", time: "3:12 PM" },
        { icon: "fa-right-from-bracket", tone: "", title: "Exit recorded", desc: "Samuel Iortyer checked out", time: "3:35 PM" }
      ]
    },
    {
      code: "RF6640",
      type: "Artisan",
      status: "cancelled",
      visitor: { name: "Emmanuel Udo", phone: "0705 118 6602" },
      resident: { name: "R. Adeyemi" },
      unit: "B12-F3",
      issueDate: "Aug 30, 2026 · 2:15 PM",
      validFrom: "Sep 1, 2026 · 9:00 AM",
      validUntil: "Sep 1, 2026 · 1:00 PM",
      validityLabel: "Sep 1",
      validityRange: "9 AM – 1 PM",
      arrival: "—",
      checkIn: "—",
      checkOut: "—",
      uses: "Not used",
      history: [
        { icon: "fa-circle-plus", tone: "", title: "Pass created", desc: "Issued by R. Adeyemi", time: "Aug 30 · 2:15 PM" },
        { icon: "fa-ban", tone: "danger", title: "Pass cancelled", desc: "Cancelled by R. Adeyemi", time: "Aug 31 · 6:02 PM" }
      ]
    },
    {
      code: "RF3007",
      type: "Multi-Day Visitor",
      status: "upcoming",
      visitor: { name: "Blessing Eze", phone: "0909 442 7710" },
      resident: { name: "A. Nwachukwu" },
      unit: "C9-F6",
      issueDate: "Sep 3, 2026 · 10:00 AM",
      validFrom: "Sep 6, 2026 · 12:00 AM",
      validUntil: "Sep 8, 2026 · 11:59 PM",
      validityLabel: "Sep 6 – Sep 8",
      validityRange: "All day",
      arrival: "—",
      checkIn: "—",
      checkOut: "—",
      uses: "Not used",
      history: [
        { icon: "fa-circle-plus", tone: "", title: "Pass created", desc: "Issued by A. Nwachukwu", time: "10:00 AM" }
      ]
    }
  ];

  const NOTIFICATIONS = [
    {
      icon: "fa-ban",
      title: "Pass cancelled",
      desc: "Pass #RF1902 was cancelled by the resident.",
      time: "8m ago",
      unread: true
    },
    {
      icon: "fa-bullhorn",
      title: "Estate announcement",
      desc: "A new security announcement was posted.",
      time: "45m ago",
      unread: true
    }
  ];

  window.RafaraSecurity.PASSES_DATA = {
    passes: PASSES,
    notifications: NOTIFICATIONS,
    stats: {
      active: 24,
      today: 18,
      expiringSoon: 4,
      cancelled: 3
    }
  };

  window.RafaraSecurity.PASS_TYPE_ICONS = PASS_TYPE_ICONS;

})();


/* =========================================================
   STATUS BADGE HELPERS
   ========================================================= */

(function () {
  "use strict";

  const STATUS_MAP = {
    active: { cls: "badge--active", label: "Active" },
    upcoming: { cls: "badge--upcoming", label: "Upcoming" },
    expired: { cls: "badge--expired", label: "Expired" },
    cancelled: { cls: "badge--revoked", label: "Cancelled" },
    used: { cls: "badge--used", label: "Used" },
    denied: { cls: "badge--denied", label: "Denied" }
  };

  window.RafaraSecurity.statusBadge = function (status) {
    const s = STATUS_MAP[status] || { cls: "badge--expired", label: status };
    return `<span class="badge ${s.cls}"><i class="fa-solid fa-circle" aria-hidden="true"></i>${s.label}</span>`;
  };

  window.RafaraSecurity.STATUS_MAP = STATUS_MAP;

})();


/* =========================================================
   FILTER STATE + RENDERING
   ======================================================= */

(function () {
  "use strict";

  const NS = window.RafaraSecurity;
  const DATA = NS.PASSES_DATA;

  const state = {
    query: "",
    status: "all",
    type: "all",
    date: ""
  };

  function actionLabel(status) {
    if (status === "active" || status === "upcoming") {
      return { label: "Verify Pass", icon: "fa-shield-halved" };
    }
    if (status === "used" && false) { /* placeholder, "View Visitor" reserved for inside-visitor detection */ }
    return { label: "View Details", icon: "fa-eye" };
  }

  function matchesFilters(pass) {

    const q = state.query.trim().toLowerCase();

    if (q) {
      const haystack = [
        pass.code,
        pass.visitor.name,
        pass.resident.name,
        pass.unit
      ].join(" ").toLowerCase();

      if (!haystack.includes(q)) return false;
    }

    if (state.status !== "all" && pass.status !== state.status) {
      return false;
    }

    if (state.type !== "all" && pass.type !== state.type) {
      return false;
    }

    if (state.date) {
      // Simple demo check: only passes explicitly valid "Today" (Sep 3, 2026)
      // are matched against today's date; others are matched loosely by
      // whether the date filter falls within the pass's labeled range text.
      const chosen = state.date;
      const isToday = chosen === "2026-09-03";
      if (isToday && pass.validityLabel !== "Today") return false;
      if (!isToday && pass.validityLabel === "Today") return false;
    }

    return true;
  }

  function emptyStateFor() {

    if (state.query || state.type !== "all" || state.date) {
      return {
        icon: "fa-magnifying-glass",
        title: "No passes found",
        desc: "Try searching with a different pass code, visitor name, resident, or unit."
      };
    }

    const map = {
      active: {
        icon: "fa-id-card",
        title: "No active passes",
        desc: "There are currently no active passes for this estate."
      },
      upcoming: {
        icon: "fa-calendar-days",
        title: "No upcoming passes",
        desc: "There are no future passes available for the selected period."
      },
      expired: {
        icon: "fa-hourglass-end",
        title: "No expired passes",
        desc: "There are no expired passes for the selected period."
      }
    };

    return map[state.status] || {
      icon: "fa-id-card",
      title: "No passes found",
      desc: "Try searching with a different pass code, visitor name, resident, or unit."
    };
  }

  function rowActionButton(pass) {
    const action = actionLabel(pass.status);
    return `
      <button
        type="button"
        class="row-action-btn"
        data-view-pass="${pass.code}"
      >
        <i class="fa-solid ${action.icon}" aria-hidden="true"></i>
        ${action.label}
      </button>
    `;
  }

  function renderList() {

    const wrap = document.getElementById("passes-list-wrap");
    const countLabel = document.getElementById("passes-count-label");

    if (!wrap) return;

    const filtered = DATA.passes.filter(matchesFilters);

    if (countLabel) {
      countLabel.textContent = `${filtered.length} pass${filtered.length === 1 ? "" : "es"}`;
    }

    if (!filtered.length) {
      const empty = emptyStateFor();
      wrap.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid ${empty.icon}"></i>
          <strong>${empty.title}</strong>
          <span>${empty.desc}</span>
        </div>
      `;
      return;
    }

    const head = `
      <div class="passes-table-head">
        <span>Pass</span>
        <span>Visitor</span>
        <span>Resident</span>
        <span>Unit</span>
        <span>Type</span>
        <span>Validity</span>
        <span>Status</span>
        <span>Action</span>
      </div>
    `;

    const rows = filtered.map(pass => {

      const icon = NS.PASS_TYPE_ICONS[pass.type] || "fa-id-card";

      return `
        <div class="passes-table-row">
          <div class="pass-code-cell">#${pass.code}</div>
          <div><strong>${pass.visitor.name}</strong></div>
          <div class="cell-muted">${pass.resident.name}</div>
          <div class="cell-muted">${pass.unit}</div>
          <div><span class="type-chip"><i class="fa-solid ${icon}" aria-hidden="true"></i>${pass.type}</span></div>
          <div class="validity-cell">
            <strong>${pass.validityLabel}</strong>
            <span>${pass.validityRange}</span>
          </div>
          <div>${NS.statusBadge(pass.status)}</div>
          <div>${rowActionButton(pass)}</div>
        </div>
      `;
    }).join("");

    const cards = filtered.map(pass => {

      const icon = NS.PASS_TYPE_ICONS[pass.type] || "fa-id-card";
      const action = actionLabel(pass.status);

      return `
        <div class="pass-card">
          <div class="pass-card-top">
            <span class="pass-card-code">#${pass.code}</span>
            ${NS.statusBadge(pass.status)}
          </div>
          <div class="pass-card-rows">
            <div class="pass-card-row"><span>Visitor</span><span>${pass.visitor.name}</span></div>
            <div class="pass-card-row"><span>Resident</span><span>${pass.resident.name}</span></div>
            <div class="pass-card-row"><span>Unit</span><span>${pass.unit}</span></div>
            <div class="pass-card-row"><span>Type</span><span><i class="fa-solid ${icon}" aria-hidden="true"></i> ${pass.type}</span></div>
            <div class="pass-card-row"><span>Validity</span><span>${pass.validityLabel} · ${pass.validityRange}</span></div>
          </div>
          <div class="pass-card-foot">
            <button type="button" class="row-action-btn" data-view-pass="${pass.code}">
              <i class="fa-solid ${action.icon}" aria-hidden="true"></i>
              ${action.label}
            </button>
          </div>
        </div>
      `;
    }).join("");

    wrap.innerHTML = `<div class="passes-table">${head}${rows}</div>${cards}`;
  }


  /* =======================================================
     STATS
     ======================================================= */

  function renderStats() {

    const grid = document.getElementById("passes-stats-grid");

    if (!grid) return;

    const cards = [
      {
        icon: "fa-id-card",
        iconClass: "stat-icon--passes",
        value: DATA.stats.active,
        label: "Active Passes",
        context: "Currently active"
      },
      {
        icon: "fa-calendar-day",
        iconClass: "stat-icon--upcoming",
        value: DATA.stats.today,
        label: "Today's Passes",
        context: "Valid today"
      },
      {
        icon: "fa-hourglass-half",
        iconClass: "stat-icon--pending",
        value: DATA.stats.expiringSoon,
        label: "Expiring Soon",
        context: "Expiring today"
      },
      {
        icon: "fa-ban",
        iconClass: "stat-icon--inside",
        value: DATA.stats.cancelled,
        label: "Cancelled",
        context: "Cancelled passes"
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
     NOTIFICATIONS (shared topbar chrome)
     ======================================================= */

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
        </div>
      `;
    } else {
      list.innerHTML = DATA.notifications.map(n => `
        <div class="notif-item${n.unread ? " is-unread" : ""}">
          <span class="notif-icon"><i class="fa-solid ${n.icon}"></i></span>
          <div class="notif-body">
            <strong>${n.title}</strong>
            <p>${n.desc}</p>
            <span class="notif-time">${n.time}</span>
          </div>
          ${n.unread ? `<span class="notif-unread-dot"></span>` : ""}
        </div>
      `).join("");
    }

    if (dot) dot.hidden = unread === 0;

    if (sidebarCount) {
      sidebarCount.textContent = unread;
      sidebarCount.hidden = unread === 0;
    }
  }


  NS.renderPasses = {
    all() {
      renderStats();
      renderList();
      renderNotifications();
    },
    list: renderList
  };

  NS.passesState = state;

})();


/* =========================================================
   FILTER CONTROLS
   ========================================================= */

(function () {
  "use strict";

  const NS = window.RafaraSecurity;

  const searchInput = document.getElementById("passes-search-input");
  const statusFilter = document.getElementById("status-filter");
  const typeFilter = document.getElementById("type-filter");
  const dateFilter = document.getElementById("date-filter");
  const clearBtn = document.getElementById("filters-clear-btn");

  if (!searchInput) return;

  let debounceTimer = null;

  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      NS.passesState.query = searchInput.value;
      NS.renderPasses.list();
    }, 150);
  });

  statusFilter.addEventListener("change", () => {
    NS.passesState.status = statusFilter.value;
    NS.renderPasses.list();
  });

  typeFilter.addEventListener("change", () => {
    NS.passesState.type = typeFilter.value;
    NS.renderPasses.list();
  });

  dateFilter.addEventListener("change", () => {
    NS.passesState.date = dateFilter.value;
    NS.renderPasses.list();
  });

  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    statusFilter.value = "all";
    typeFilter.value = "all";
    dateFilter.value = "";

    NS.passesState.query = "";
    NS.passesState.status = "all";
    NS.passesState.type = "all";
    NS.passesState.date = "";

    NS.renderPasses.list();
  });

})();


/* =========================================================
   PASS DETAILS DRAWER
   ========================================================= */

(function () {
  "use strict";

  const NS = window.RafaraSecurity;
  const DATA = NS.PASSES_DATA;

  const drawer = document.getElementById("pass-drawer");
  const drawerBody = document.getElementById("drawer-body");
  const drawerTitle = document.getElementById("drawer-pass-code");
  const closeTriggers = document.querySelectorAll("[data-close-drawer]");

  if (!drawer || !drawerBody) return;

  function findPass(code) {
    return DATA.passes.find(p => p.code === code);
  }

  function renderHistory(history) {

    if (!history.length) {
      return `
        <div class="empty-state">
          <i class="fa-solid fa-clock-rotate-left"></i>
          <strong>No events yet</strong>
          <span>Verification events will appear here.</span>
        </div>
      `;
    }

    return `
      <ol class="activity-timeline">
        ${history.map(item => `
          <li class="activity-item">
            <span class="activity-icon${item.tone ? ` activity-icon--${item.tone}` : ""}">
              <i class="fa-solid ${item.icon}"></i>
            </span>
            <div class="activity-body">
              <strong>${item.title}</strong>
              <p>${item.desc}</p>
            </div>
            <span class="activity-time">${item.time}</span>
          </li>
        `).join("")}
      </ol>
    `;
  }

  function open(code) {

    const pass = findPass(code);

    if (!pass) return;

    drawerTitle.textContent = `#${pass.code}`;

    const icon = NS.PASS_TYPE_ICONS[pass.type] || "fa-id-card";
    const canVerify = pass.status === "active" || pass.status === "upcoming";

    drawerBody.innerHTML = `

      <div class="drawer-status-row">
        <span class="type-chip"><i class="fa-solid ${icon}" aria-hidden="true"></i>${pass.type}</span>
        ${NS.statusBadge(pass.status)}
      </div>

      <div class="drawer-section">
        <div class="drawer-section-head">Pass Information</div>
        <div class="details-block">
          <div class="details-row"><span>Pass code</span><span>#${pass.code}</span></div>
          <div class="details-row"><span>Pass type</span><span>${pass.type}</span></div>
          <div class="details-row"><span>Issue date</span><span>${pass.issueDate}</span></div>
          <div class="details-row"><span>Valid from</span><span>${pass.validFrom}</span></div>
          <div class="details-row"><span>Valid until</span><span>${pass.validUntil}</span></div>
        </div>
      </div>

      <div class="drawer-section">
        <div class="drawer-section-head">Visitor</div>
        <div class="details-block">
          <div class="details-row"><span>Full name</span><span>${pass.visitor.name}</span></div>
          <div class="details-row"><span>Phone number</span><span>${pass.visitor.phone}</span></div>
        </div>
      </div>

      <div class="drawer-section">
        <div class="drawer-section-head">Resident</div>
        <div class="details-block">
          <div class="details-row"><span>Resident</span><span>${pass.resident.name}</span></div>
          <div class="details-row"><span>Unit</span><span>${pass.unit}</span></div>
        </div>
      </div>

      <div class="drawer-section">
        <div class="drawer-section-head">Access Information</div>
        <div class="details-block">
          <div class="details-row"><span>Expected arrival</span><span>${pass.arrival}</span></div>
          <div class="details-row"><span>Check-in time</span><span>${pass.checkIn}</span></div>
          <div class="details-row"><span>Check-out time</span><span>${pass.checkOut}</span></div>
          <div class="details-row"><span>Usage</span><span>${pass.uses}</span></div>
        </div>
      </div>

      <div class="drawer-section">
        <div class="drawer-section-head">Verification History</div>
        ${renderHistory(pass.history)}
      </div>

      ${canVerify ? `
        <div class="drawer-actions">
          <a href="security-verify.html" class="btn btn--primary">
            <i class="fa-solid fa-shield-halved" aria-hidden="true"></i>
            Verify This Pass
          </a>
        </div>
      ` : ""}
    `;

    drawer.hidden = false;

    requestAnimationFrame(() => {
      drawer.classList.add("is-open");
    });

    document.body.style.overflow = "hidden";
  }

  function close() {

    drawer.classList.remove("is-open");
    document.body.style.overflow = "";

    setTimeout(() => {
      drawer.hidden = true;
    }, 240);
  }

  document.addEventListener("click", event => {

    const trigger = event.target.closest("[data-view-pass]");

    if (trigger) {
      open(trigger.getAttribute("data-view-pass"));
      return;
    }

  });

  closeTriggers.forEach(trigger => {
    trigger.addEventListener("click", close);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !drawer.hidden) {
      close();
    }
  });

})();


/* =========================================================
   SIDEBAR DRAWER (mobile/tablet)
   ========================================================= */

(function () {

  const sidebar = document.getElementById("sidebar");
  const backdrop = document.getElementById("sidebar-backdrop");
  const toggle = document.getElementById("sidebar-toggle-btn");

  if (!sidebar || !backdrop || !toggle) return;

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
    if (sidebar.classList.contains("is-open")) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });

  backdrop.addEventListener("click", closeSidebar);

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeSidebar();
  });

})();


/* =========================================================
   DROPDOWNS (notifications / profile)
   ========================================================= */

(function () {

  const dropdowns = document.querySelectorAll("[data-dropdown]");

  if (!dropdowns.length) return;

  function closeAll(except = null) {
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

    button.addEventListener("click", event => {
      event.stopPropagation();
      const wasOpen = !panel.hidden;
      closeAll();
      panel.hidden = wasOpen;
      button.setAttribute("aria-expanded", String(!wasOpen));
    });

  });

  document.addEventListener("click", event => {
    const inside = [...dropdowns].some(d => d.contains(event.target));
    if (!inside) closeAll();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeAll();
  });

})();


/* =========================================================
   MARK ALL NOTIFICATIONS READ
   ========================================================= */

(function () {

  const button = document.getElementById("mark-all-read-btn");

  if (!button) return;

  button.addEventListener("click", () => {
    window.RafaraSecurity.PASSES_DATA.notifications.forEach(n => {
      n.unread = false;
    });
    window.RafaraSecurity.renderPasses.all();
  });

})();


/* =========================================================
   MOBILE MORE SHEET
   ========================================================= */

(function () {

  const sheet = document.getElementById("mobile-menu-sheet");
  const button = document.getElementById("mobile-menu-btn");
  const closeTriggers = document.querySelectorAll("[data-close-mobile-sheet]");

  if (!sheet || !button) return;

  function openSheet() {
    sheet.hidden = false;
    requestAnimationFrame(() => sheet.classList.add("is-open"));
    button.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeSheet() {
    sheet.classList.remove("is-open");
    button.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    setTimeout(() => { sheet.hidden = true; }, 220);
  }

  button.addEventListener("click", () => {
    if (sheet.hidden) openSheet(); else closeSheet();
  });

  closeTriggers.forEach(trigger => trigger.addEventListener("click", closeSheet));

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !sheet.hidden) closeSheet();
  });

})();


/* =========================================================
   LOGOUT
   ========================================================= */

(function () {

  const triggers = [
    document.getElementById("logout-btn"),
    document.getElementById("mobile-logout-btn"),
    document.getElementById("dropdown-logout-btn")
  ].filter(Boolean);

  triggers.forEach(button => {
    button.addEventListener("click", () => {
      window.location.href = "security-login.html";
    });
  });

})();


/* =========================================================
   INIT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  window.RafaraSecurity.renderPasses.all();
});
