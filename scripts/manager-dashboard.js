/* ============================================================
   RAFARA GATEPASS — ESTATE MANAGER DASHBOARD
   window.RafaraManager namespace — one IIFE per concern
   ============================================================ */

/* ---------------------------------------------------------
   1. MOCK DATA
   Structured so a future backend/API can swap this in
   without touching the rendering layer below.
--------------------------------------------------------- */
(function () {
  window.RafaraManager = window.RafaraManager || {};

  window.RafaraManager.DATA = {
    overview: {
      residents: 584,
      activePasses: 24,
      visitorsInside: 12,
      securityStaff: 18
    },

    residents: {
      active: 584,
      pending: 8,
      suspended: 3
    },

    security: {
      onDuty: 12,
      offDuty: 6,
      pendingInvitations: 2
    },

    passes: {
      active: 24,
      upcoming: 17,
      expired: 31,
      pending: 4
    },

    gateActivity: [
      { visitor: "David Ade", resident: "Flat A12", passType: "Visitor", time: "8:42 AM", status: "inside" },
      { visitor: "Sarah O.", resident: "Flat B07", passType: "Artisan", time: "8:31 AM", status: "verified" },
      { visitor: "Michael K.", resident: "Flat C21", passType: "Visitor", time: "8:12 AM", status: "exited" },
      { visitor: "Amina T.", resident: "Flat D09", passType: "Visitor", time: "7:56 AM", status: "inside" }
    ],

    alerts: [
      {
        icon: "fa-user-clock",
        title: "Pending Resident Verification",
        desc: "8 residents are waiting for verification.",
        cta: "Review",
        href: "manager-residents.html"
      },
      {
        icon: "fa-shield-halved",
        title: "Security Invitation",
        desc: "2 security personnel have not accepted their invitations.",
        cta: "Review",
        href: "manager-security.html"
      },
      {
        icon: "fa-id-card",
        title: "Access Notice",
        desc: "A visitor pass requires attention.",
        cta: "View",
        href: "manager-passes.html"
      }
    ],

    recentActivity: [
      { icon: "fa-user-check", title: "Resident verified", desc: "A resident account was successfully verified.", time: "12m ago" },
      { icon: "fa-shield-halved", title: "Security staff added", desc: "A new security personnel account was added.", time: "38m ago" },
      { icon: "fa-id-card", title: "Visitor pass created", desc: "A new visitor pass was generated.", time: "1h ago" },
      { icon: "fa-helmet-safety", title: "Artisan pass approved", desc: "An artisan access request was approved.", time: "2h ago" },
      { icon: "fa-user-pen", title: "Resident profile updated", desc: "A resident updated their account information.", time: "3h ago" }
    ],

    notifications: [
      { icon: "fa-user-clock", title: "New resident verification", desc: "A resident is waiting for approval." },
      { icon: "fa-shield-halved", title: "Security invitation", desc: "A security staff invitation is pending." }
    ],

    quickActions: [
      { icon: "fa-user-plus", label: "Add Resident", href: "manager-residents.html" },
      { icon: "fa-shield-halved", label: "Add Security", href: "manager-security.html" },
      { icon: "fa-building", label: "Manage Units", href: "manager-units.html" },
      { icon: "fa-id-card", label: "View Passes", href: "manager-passes.html" },
      { icon: "fa-clipboard-check", label: "Review Requests", href: "manager-residents.html" }
    ],

    /* Flat searchable index — frontend-only for now */
    searchIndex: [
      { type: "Resident", label: "Chidinma Okafor — Flat A12", href: "manager-residents.html" },
      { type: "Resident", label: "Tunde Bakare — Flat B07", href: "manager-residents.html" },
      { type: "Unit", label: "Flat C21, Block C", href: "manager-units.html" },
      { type: "Unit", label: "Flat D09, Block D", href: "manager-units.html" },
      { type: "Pass", label: "One-Day Visitor — David Ade", href: "manager-passes.html" },
      { type: "Pass", label: "Artisan Pass — Sarah O.", href: "manager-passes.html" },
      { type: "Security", label: "Emeka Nwosu — On Duty", href: "manager-security.html" },
      { type: "Security", label: "Blessing Eze — Off Duty", href: "manager-security.html" }
    ]
  };
})();

/* ---------------------------------------------------------
   2. HELPERS
--------------------------------------------------------- */
(function () {
  window.RafaraManager = window.RafaraManager || {};

  window.RafaraManager.helpers = {
    statusLabel: function (status) {
      const map = { inside: "Inside", verified: "Verified", exited: "Exited", pending: "Pending" };
      return map[status] || status;
    },

    el: function (tag, className, html) {
      const node = document.createElement(tag);
      if (className) node.className = className;
      if (html !== undefined) node.innerHTML = html;
      return node;
    }
  };
})();

/* ---------------------------------------------------------
   3. RENDERING — stats, table, summaries, alerts, feed, actions
--------------------------------------------------------- */
(function () {
  const NS = window.RafaraManager;
  const DATA = NS.DATA;
  const { el, statusLabel } = NS.helpers;

  function renderStats() {
    const grid = document.getElementById("statsGrid");
    if (!grid) return;

    const cards = [
      { icon: "fa-users", label: "Total Residents", value: DATA.overview.residents, sub: "Active residents" },
      { icon: "fa-id-card", label: "Active Passes", value: DATA.overview.activePasses, sub: "Currently active" },
      { icon: "fa-person-walking-arrow-right", label: "Visitors Inside", value: DATA.overview.visitorsInside, sub: "Currently inside" },
      { icon: "fa-shield-halved", label: "Security Staff", value: DATA.overview.securityStaff, sub: "Registered personnel" }
    ];

    grid.innerHTML = "";
    cards.forEach(c => {
      const card = el("article", "stat-card");
      card.innerHTML = `
        <div class="stat-card__icon"><i class="fa-solid ${c.icon}"></i></div>
        <p class="stat-card__label">${c.label}</p>
        <p class="stat-card__value">${c.value}</p>
        <p class="stat-card__sub">${c.sub}</p>
      `;
      grid.appendChild(card);
    });
  }

  function renderGateActivity() {
    const tbody = document.getElementById("gateActivityBody");
    const cardsWrap = document.getElementById("gateActivityCards");
    if (!tbody || !cardsWrap) return;

    tbody.innerHTML = "";
    cardsWrap.innerHTML = "";

    DATA.gateActivity.forEach(row => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${row.visitor}</td>
        <td class="cell-muted">${row.resident}</td>
        <td class="cell-muted">${row.passType}</td>
        <td class="cell-muted">${row.time}</td>
        <td><span class="badge badge--${row.status}">${statusLabel(row.status)}</span></td>
      `;
      tbody.appendChild(tr);

      const card = el("div", "activity-card");
      card.innerHTML = `
        <div class="activity-card__top">
          <span class="activity-card__visitor">${row.visitor}</span>
          <span class="badge badge--${row.status}">${statusLabel(row.status)}</span>
        </div>
        <div class="activity-card__meta">
          <span><strong>${row.resident}</strong></span>
          <span>${row.passType}</span>
          <span>${row.time}</span>
        </div>
      `;
      cardsWrap.appendChild(card);
    });
  }

  function renderResidentsSummary() {
    const wrap = document.getElementById("residentsSummary");
    if (!wrap) return;
    const rows = [
      { label: "Active", value: DATA.residents.active, color: "var(--status-success-text)" },
      { label: "Pending Verification", value: DATA.residents.pending, color: "var(--status-warning-text)" },
      { label: "Suspended", value: DATA.residents.suspended, color: "#B23B3B" }
    ];
    wrap.innerHTML = "";
    rows.forEach(r => {
      const row = el("div", "summary-row");
      row.innerHTML = `
        <span class="summary-row__label"><span class="summary-row__dot" style="background:${r.color}"></span>${r.label}</span>
        <span class="summary-row__value">${r.value}</span>
      `;
      wrap.appendChild(row);
    });
  }

  function renderSecuritySummary() {
    const wrap = document.getElementById("securitySummary");
    if (!wrap) return;
    const rows = [
      { label: "On Duty", value: DATA.security.onDuty, color: "var(--status-success-text)" },
      { label: "Off Duty", value: DATA.security.offDuty, color: "var(--text-muted)" },
      { label: "Pending Invitations", value: DATA.security.pendingInvitations, color: "var(--status-warning-text)" }
    ];
    wrap.innerHTML = "";
    rows.forEach(r => {
      const row = el("div", "summary-row");
      row.innerHTML = `
        <span class="summary-row__label"><span class="summary-row__dot" style="background:${r.color}"></span>${r.label}</span>
        <span class="summary-row__value">${r.value}</span>
      `;
      wrap.appendChild(row);
    });
  }

  function renderPassSummary() {
    const wrap = document.getElementById("passSummary");
    if (!wrap) return;
    const cells = [
      { label: "Active", value: DATA.passes.active },
      { label: "Upcoming", value: DATA.passes.upcoming },
      { label: "Expired", value: DATA.passes.expired },
      { label: "Pending", value: DATA.passes.pending }
    ];
    wrap.innerHTML = "";
    cells.forEach(c => {
      const cell = el("div", "pass-cell");
      cell.innerHTML = `<div class="pass-cell__value">${c.value}</div><div class="pass-cell__label">${c.label}</div>`;
      wrap.appendChild(cell);
    });
  }

  function renderAlerts() {
    const wrap = document.getElementById("alertsList");
    if (!wrap) return;
    wrap.innerHTML = "";
    DATA.alerts.forEach(a => {
      const item = el("div", "alert-item");
      item.innerHTML = `
        <div class="alert-item__icon"><i class="fa-solid ${a.icon}"></i></div>
        <div class="alert-item__body">
          <p class="alert-item__title">${a.title}</p>
          <p class="alert-item__desc">${a.desc}</p>
          <a class="alert-item__btn" href="${a.href}">${a.cta} <i class="fa-solid fa-arrow-right"></i></a>
        </div>
      `;
      wrap.appendChild(item);
    });
  }

  function renderFeed() {
    const wrap = document.getElementById("feedList");
    if (!wrap) return;
    wrap.innerHTML = "";
    DATA.recentActivity.forEach(item => {
      const li = el("li", "feed-item");
      li.innerHTML = `
        <div class="feed-item__icon"><i class="fa-solid ${item.icon}"></i></div>
        <div class="feed-item__body">
          <p class="feed-item__title">${item.title}</p>
          <p class="feed-item__desc">${item.desc}</p>
        </div>
        <span class="feed-item__time">${item.time}</span>
      `;
      wrap.appendChild(li);
    });
  }

  function renderQuickActions() {
    const wrap = document.getElementById("quickActions");
    if (!wrap) return;
    wrap.innerHTML = "";
    DATA.quickActions.forEach(qa => {
      const btn = el("a", "qa-btn");
      btn.href = qa.href;
      btn.innerHTML = `<i class="fa-solid ${qa.icon}"></i><span>${qa.label}</span>`;
      wrap.appendChild(btn);
    });
  }

  function renderNotifications() {
    const wrap = document.getElementById("notifList");
    if (!wrap) return;
    wrap.innerHTML = "";
    DATA.notifications.forEach(n => {
      const item = el("div", "notif-item");
      item.innerHTML = `
        <div class="notif-item__icon"><i class="fa-solid ${n.icon}"></i></div>
        <div>
          <p class="notif-item__title">${n.title}</p>
          <p class="notif-item__desc">${n.desc}</p>
        </div>
      `;
      wrap.appendChild(item);
    });
    const badge = document.getElementById("notifBadge");
    if (badge) badge.textContent = String(DATA.notifications.length);
  }

  NS.render = {
    all: function () {
      renderStats();
      renderGateActivity();
      renderResidentsSummary();
      renderSecuritySummary();
      renderPassSummary();
      renderAlerts();
      renderFeed();
      renderQuickActions();
      renderNotifications();
    }
  };
})();

/* ---------------------------------------------------------
   4. SIDEBAR / MOBILE NAV
--------------------------------------------------------- */
(function () {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  const openBtn = document.getElementById("menuOpen");
  const closeBtn = document.getElementById("sidebarClose");

  if (!sidebar || !overlay || !openBtn || !closeBtn) return;

  function openSidebar() {
    sidebar.classList.add("is-open");
    overlay.classList.add("is-visible");
    document.body.style.overflow = "hidden";
  }

  function closeSidebar() {
    sidebar.classList.remove("is-open");
    overlay.classList.remove("is-visible");
    document.body.style.overflow = "";
  }

  openBtn.addEventListener("click", openSidebar);
  closeBtn.addEventListener("click", closeSidebar);
  overlay.addEventListener("click", closeSidebar);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeSidebar();
  });
})();

/* ---------------------------------------------------------
   5. NOTIFICATION DROPDOWN
--------------------------------------------------------- */
(function () {
  const bell = document.getElementById("notifBell");
  const panel = document.getElementById("notifPanel");
  if (!bell || !panel) return;

  function togglePanel(show) {
    panel.hidden = !show;
    bell.setAttribute("aria-expanded", String(show));
  }

  bell.addEventListener("click", function (e) {
    e.stopPropagation();
    togglePanel(panel.hidden);
  });

  document.addEventListener("click", function (e) {
    if (!panel.hidden && !panel.contains(e.target) && e.target !== bell) {
      togglePanel(false);
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") togglePanel(false);
  });
})();

/* ---------------------------------------------------------
   6. DASHBOARD SEARCH (frontend-only, structured for later API swap)
--------------------------------------------------------- */
(function () {
  const NS = window.RafaraManager;
  const input = document.getElementById("dashboardSearch");
  const results = document.getElementById("searchResults");
  if (!input || !results) return;

  const typeIcon = { Resident: "fa-user", Unit: "fa-building", Pass: "fa-id-card", Security: "fa-shield-halved" };

  function search(query) {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return NS.DATA.searchIndex.filter(item =>
      item.label.toLowerCase().includes(q) || item.type.toLowerCase().includes(q)
    ).slice(0, 6);
  }

  function renderResults(query) {
    const matches = search(query);
    results.innerHTML = "";

    if (!query.trim()) {
      results.hidden = true;
      return;
    }

    if (matches.length === 0) {
      results.innerHTML = `<div class="search-results__empty">No matches for "${query}"</div>`;
      results.hidden = false;
      return;
    }

    matches.forEach(m => {
      const item = document.createElement("a");
      item.href = m.href;
      item.className = "search-results__item";
      item.innerHTML = `<i class="fa-solid ${typeIcon[m.type] || "fa-circle"}"></i><span>${m.label}</span><small>${m.type}</small>`;
      results.appendChild(item);
    });
    results.hidden = false;
  }

  input.addEventListener("input", function () {
    renderResults(input.value);
  });

  input.addEventListener("focus", function () {
    if (input.value.trim()) renderResults(input.value);
  });

  document.addEventListener("click", function (e) {
    if (!results.contains(e.target) && e.target !== input) {
      results.hidden = true;
    }
  });
})();

/* ---------------------------------------------------------
   7. MORE SHEET (mobile bottom nav)
   Uses the shared data-open-modal / data-close-modal +
   [hidden] pattern used across Rafara modals.
--------------------------------------------------------- */
(function () {
  const openTriggers = document.querySelectorAll("[data-open-modal]");
  const closeTriggers = document.querySelectorAll("[data-close-modal]");
  if (!openTriggers.length) return;

  function getSheetParts(id) {
    const sheet = document.getElementById(id);
    const overlay = document.querySelector(`.more-sheet__overlay[data-close-modal="${id}"]`);
    return { sheet, overlay };
  }

  function openSheet(id) {
    const { sheet, overlay } = getSheetParts(id);
    if (!sheet) return;
    sheet.hidden = false;
    if (overlay) overlay.hidden = false;
    document.body.style.overflow = "hidden";
    const trigger = document.querySelector(`[data-open-modal="${id}"]`);
    if (trigger) trigger.setAttribute("aria-expanded", "true");
  }

  function closeSheet(id) {
    const { sheet, overlay } = getSheetParts(id);
    if (!sheet) return;
    sheet.hidden = true;
    if (overlay) overlay.hidden = true;
    document.body.style.overflow = "";
    const trigger = document.querySelector(`[data-open-modal="${id}"]`);
    if (trigger) trigger.setAttribute("aria-expanded", "false");
  }

  openTriggers.forEach(btn => {
    btn.addEventListener("click", function () {
      openSheet(btn.getAttribute("data-open-modal"));
    });
  });

  closeTriggers.forEach(btn => {
    btn.addEventListener("click", function () {
      closeSheet(btn.getAttribute("data-close-modal"));
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeSheet("moreSheet");
  });
})();

/* ---------------------------------------------------------
   8. INIT
--------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", function () {
  window.RafaraManager.render.all();
});
