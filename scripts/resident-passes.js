/* ==========================================================================
   RAFARA GATEPASS — RESIDENT PASSES PAGE
   Frontend-only demo logic. All data below is mock data.
   Structured so a backend/API layer can replace the "MOCK DATA" section
   later without touching the rendering/UI code.
   ========================================================================== */

(function () {
  "use strict";

  /* ========================================================================
     MOCK DATA
     ======================================================================== */

  const resident = {
    fullName: "Rahmah Ogunlaja",
    initials: "RO"
  };

  // Pass lifecycle reference (demo only — never implies backend verification)
  const PASS_LIFECYCLES = {
    "one-day-visitor": ["Created", "Approved", "Checked In", "Checked Out", "Closed"],
    "multi-day-visitor": ["Created", "Active", "Multiple Entry/Exit", "Ended / Expired", "Closed"],
    artisan: ["Created", "Approved", "Checked In", "Checked Out", "Closed"],
    "property-exit": ["Created", "Pending", "Verified by Security", "Property Exited", "Closed"]
  };

  const PASS_TYPE_LABELS = {
    "one-day-visitor": "One-Day Visitor",
    "multi-day-visitor": "Multi-Day Visitor",
    artisan: "Artisan Pass",
    "property-exit": "Property Exit Pass"
  };

  const PASS_TYPE_ICONS = {
    "one-day-visitor": "fa-regular fa-calendar-check",
    "multi-day-visitor": "fa-solid fa-calendar-week",
    artisan: "fa-solid fa-screwdriver-wrench",
    "property-exit": "fa-solid fa-dolly"
  };

  let passes = [
    {
      id: "RFP-20481",
      type: "one-day-visitor",
      name: "John Doe",
      phone: "+234 802 111 2233",
      status: "active",
      date: "2026-08-23",
      arrival: "4:00 PM",
      host: resident.fullName,
      vehicle: "Toyota Camry · LSD 234 XY",
      createdAt: "2026-08-21"
    },
    {
      id: "RFP-20482",
      type: "multi-day-visitor",
      name: "Sarah Ade",
      phone: "+234 803 444 5566",
      status: "active",
      startDate: "2026-08-23",
      endDate: "2026-08-30",
      host: resident.fullName,
      createdAt: "2026-08-20",
      history: [
        { time: "Aug 23 · 4:20 PM", event: "Visitor checked in" },
        { time: "Aug 24 · 9:15 AM", event: "Visitor checked out" },
        { time: "Aug 24 · 6:30 PM", event: "Visitor checked in" },
        { time: "Aug 25 · 11:40 AM", event: "Visitor checked out" }
      ]
    },
    {
      id: "RFP-20483",
      type: "artisan",
      name: "Michael Plumbing Services",
      phone: "+234 805 777 8899",
      status: "pending",
      service: "Plumbing Repair",
      date: "2026-08-23",
      arrival: "10:00 AM",
      createdAt: "2026-08-22"
    },
    {
      id: "RFP-20484",
      type: "property-exit",
      name: "Samsung Refrigerator",
      quantity: 1,
      reason: "Moving property out of the estate",
      status: "pending",
      date: "2026-08-23",
      notes: "Movers will arrive with a small truck around midday.",
      createdAt: "2026-08-22"
    },
    {
      id: "RFP-20470",
      type: "one-day-visitor",
      name: "Chidinma Obi",
      phone: "+234 807 222 3344",
      status: "checked-in",
      date: "2026-08-23",
      arrival: "1:30 PM",
      host: resident.fullName,
      vehicle: "",
      createdAt: "2026-08-23"
    },
    {
      id: "RFP-20465",
      type: "artisan",
      name: "Bright Spark Electricals",
      phone: "+234 810 555 1212",
      status: "checked-out",
      service: "Electrical Work",
      date: "2026-08-20",
      arrival: "9:00 AM",
      createdAt: "2026-08-18"
    },
    {
      id: "RFP-20460",
      type: "one-day-visitor",
      name: "Emeka Nwosu",
      phone: "+234 806 999 1010",
      status: "expired",
      date: "2026-08-15",
      arrival: "5:00 PM",
      host: resident.fullName,
      vehicle: "",
      createdAt: "2026-08-13"
    },
    {
      id: "RFP-20455",
      type: "multi-day-visitor",
      name: "Grace Etim",
      phone: "+234 809 333 4455",
      status: "expired",
      startDate: "2026-08-01",
      endDate: "2026-08-05",
      host: resident.fullName,
      createdAt: "2026-07-29",
      history: [
        { time: "Aug 1 · 2:00 PM", event: "Visitor checked in" },
        { time: "Aug 3 · 10:00 AM", event: "Visitor checked out" }
      ]
    },
    {
      id: "RFP-20450",
      type: "property-exit",
      name: "Generator (Mikano 6.5KVA)",
      quantity: 1,
      reason: "Sending for servicing",
      status: "closed",
      date: "2026-08-10",
      notes: "",
      createdAt: "2026-08-09"
    },
    {
      id: "RFP-20448",
      type: "artisan",
      name: "CleanPro Services",
      phone: "+234 812 666 7788",
      status: "closed",
      service: "Cleaning",
      date: "2026-08-08",
      arrival: "8:00 AM",
      createdAt: "2026-08-07"
    },
    {
      id: "RFP-20440",
      type: "one-day-visitor",
      name: "Tunde Bakare",
      phone: "+234 813 121 3141",
      status: "revoked",
      date: "2026-08-05",
      arrival: "3:00 PM",
      host: resident.fullName,
      vehicle: "",
      createdAt: "2026-08-04"
    },
    {
      id: "RFP-20432",
      type: "property-exit",
      name: "Sofa Set (3-piece)",
      quantity: 1,
      reason: "Donating to family member",
      status: "closed",
      date: "2026-07-30",
      notes: "",
      createdAt: "2026-07-29"
    }
  ];

  let recentActivity = [
    {
      icon: "fa-id-card",
      title: "Visitor pass created",
      detail: "John Doe · Today, 2:14 PM"
    },
    {
      icon: "fa-circle-check",
      title: "Artisan pass approved",
      detail: "Michael Plumbing Services · Yesterday"
    },
    {
      icon: "fa-calendar-plus",
      title: "Multi-day visit extended",
      detail: "Sarah Ade · Yesterday"
    },
    {
      icon: "fa-right-from-bracket",
      title: "Artisan checked out",
      detail: "Bright Spark Electricals · 3 days ago"
    }
  ];

  let passIdCounter = 20485;

  /* ========================================================================
     SHARED NAMESPACE
     ======================================================================== */

  window.RafaraPasses = {
    resident,
    PASS_LIFECYCLES,
    PASS_TYPE_LABELS,
    PASS_TYPE_ICONS,
    get passes() { return passes; },
    get recentActivity() { return recentActivity; },
    nextPassId: () => `RFP-${++passIdCounter}`,
    addPass: (pass) => passes.unshift(pass),
    removePass: (id) => { passes = passes.filter((p) => p.id !== id); },
    findPass: (id) => passes.find((p) => p.id === id),
    addActivity: (entry) => recentActivity.unshift(entry)
  };
})();

/* ==========================================================================
   HELPERS
   ======================================================================== */

(function () {
  "use strict";

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str == null ? "" : String(str);
    return div.innerHTML;
  }

  function statusBadgeClass(status) {
    switch (status) {
      case "active": return "badge--active";
      case "pending": return "badge--pending";
      case "checked-in": return "badge--checkedin";
      case "checked-out": return "badge--checkedout";
      case "expired": return "badge--expired";
      case "revoked": return "badge--revoked";
      case "closed": return "badge--closed";
      default: return "badge--closed";
    }
  }

  function statusLabel(status) {
    const map = {
      active: "Active",
      pending: "Pending",
      "checked-in": "Checked In",
      "checked-out": "Checked Out",
      expired: "Expired",
      revoked: "Revoked",
      closed: "Closed"
    };
    return map[status] || status;
  }

  function statusIcon(status) {
    switch (status) {
      case "active":
      case "checked-in":
        return "fa-solid fa-circle";
      case "pending":
        return "fa-solid fa-clock";
      case "checked-out":
      case "closed":
        return "fa-solid fa-circle-check";
      case "expired":
        return "fa-solid fa-circle-minus";
      case "revoked":
        return "fa-solid fa-circle-xmark";
      default:
        return "fa-solid fa-circle";
    }
  }

  function formatDate(dateStr, opts) {
    if (!dateStr) return "TBD";
    const d = new Date(dateStr + "T00:00:00");
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString(undefined, opts || { month: "long", day: "numeric", year: "numeric" });
  }

  function formatDateShort(dateStr) {
    return formatDate(dateStr, { month: "short", day: "numeric" });
  }

  function nowTime() {
    return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }

  window.RafaraPasses.helpers = {
    escapeHtml,
    statusBadgeClass,
    statusLabel,
    statusIcon,
    formatDate,
    formatDateShort,
    nowTime
  };
})();

/* ==========================================================================
   FILTER STATE + RENDERING
   ======================================================================== */

(function () {
  "use strict";

  const D = window.RafaraPasses;
  const H = D.helpers;

  const state = {
    search: "",
    type: "all",
    status: "all",
    sort: "newest"
  };

  /* ---------- Statistics ---------- */
  function renderStats() {
    const all = D.passes;
    document.getElementById("stat-all").textContent = all.length;
    document.getElementById("stat-active").textContent =
      all.filter((p) => p.status === "active" || p.status === "checked-in").length;
    document.getElementById("stat-pending").textContent =
      all.filter((p) => p.status === "pending").length;
    document.getElementById("stat-closed").textContent =
      all.filter((p) => p.status === "closed" || p.status === "expired" || p.status === "revoked").length;
  }

  /* ---------- Pass card meta rows (type-specific) ---------- */
  function metaRowsForPass(p) {
    const rows = [];
    if (p.type === "one-day-visitor") {
      rows.push(["Visit Date", H.formatDate(p.date)]);
      if (p.arrival) rows.push(["Expected Arrival", p.arrival]);
    } else if (p.type === "multi-day-visitor") {
      rows.push(["Valid", `${H.formatDateShort(p.startDate)} – ${H.formatDateShort(p.endDate)}`]);
    } else if (p.type === "artisan") {
      if (p.service) rows.push(["Service", p.service]);
      rows.push(["Valid", H.formatDate(p.date)]);
    } else if (p.type === "property-exit") {
      rows.push(["Reason", p.reason || "—"]);
      rows.push(["Date", H.formatDate(p.date)]);
    }
    return rows;
  }

  function nameOrItemForPass(p) {
    return p.name;
  }

  function actionsForPass(p) {
    const btns = [];
    const isMultiDay = p.type === "multi-day-visitor";

    if (p.status === "pending") {
      btns.push(`<button type="button" class="btn btn--ghost btn--sm" data-view-pass="${p.id}">View Details</button>`);
      btns.push(`<button type="button" class="btn btn--danger btn--sm" data-cancel-pass="${p.id}">Cancel Request</button>`);
      return btns.join("");
    }

    if (p.status === "expired" || p.status === "closed" || p.status === "revoked") {
      btns.push(`<button type="button" class="btn btn--ghost btn--sm" data-view-pass="${p.id}">View Details</button>`);
      return btns.join("");
    }

    // active / checked-in / checked-out
    if (isMultiDay) {
      btns.push(`<button type="button" class="btn btn--secondary btn--sm" data-view-pass="${p.id}">Manage Visit</button>`);
      btns.push(`<button type="button" class="btn btn--ghost btn--sm" data-extend-visit="${p.id}">Extend Visit</button>`);
      if (p.status === "active" || p.status === "checked-in") {
        btns.push(`<button type="button" class="btn btn--danger btn--sm" data-end-visit="${p.id}">End Visit</button>`);
      }
    } else {
      btns.push(`<button type="button" class="btn btn--ghost btn--sm" data-view-pass="${p.id}">View Details</button>`);
      if (p.type !== "property-exit" && (p.status === "active" || p.status === "checked-in")) {
        btns.push(`<button type="button" class="btn btn--danger btn--sm" data-end-visit="${p.id}">End Visit</button>`);
      }
    }
    return btns.join("");
  }

  function passCardHtml(p) {
    const typeLabel = D.PASS_TYPE_LABELS[p.type];
    const icon = D.PASS_TYPE_ICONS[p.type];
    const rows = metaRowsForPass(p)
      .map(([label, val]) => `<div class="pass-card-meta-row"><span>${label}</span><span>${H.escapeHtml(val)}</span></div>`)
      .join("");

    const multiDayNote = p.type === "multi-day-visitor"
      ? `<div class="pass-card-note"><i class="fa-solid fa-circle-info" aria-hidden="true"></i> Multiple entry/exit allowed during validity period</div>`
      : "";

    return `
      <article class="pass-card" data-pass-id="${p.id}">
        <div class="pass-card-top">
          <div class="pass-card-type">
            <span class="pass-card-icon"><i class="${icon}" aria-hidden="true"></i></span>
            <span class="pass-card-type-label">${typeLabel}</span>
          </div>
          <span class="badge ${H.statusBadgeClass(p.status)}"><i class="${H.statusIcon(p.status)}" aria-hidden="true"></i>${H.statusLabel(p.status)}</span>
        </div>
        <div class="pass-card-name">${H.escapeHtml(nameOrItemForPass(p))}</div>
        <div class="pass-card-meta-list">${rows}</div>
        ${multiDayNote}
        <div class="pass-card-foot">
          <div class="pass-card-foot-left">
            <span class="pass-ref">${p.id}</span>
            <span class="pass-created">Created ${H.formatDateShort(p.createdAt)}</span>
          </div>
          <div class="pass-card-actions">${actionsForPass(p)}</div>
        </div>
      </article>`;
  }

  /* ---------- Filtering / search / sort ---------- */
  function getExpiryDate(p) {
    if (p.type === "multi-day-visitor") return p.endDate;
    return p.date;
  }

  function applyFilters() {
    let list = D.passes.slice();

    if (state.search.trim()) {
      const q = state.search.trim().toLowerCase();
      list = list.filter((p) => {
        return (
          (p.name && p.name.toLowerCase().includes(q)) ||
          (p.id && p.id.toLowerCase().includes(q))
        );
      });
    }

    if (state.type !== "all") {
      list = list.filter((p) => p.type === state.type);
    }

    if (state.status !== "all") {
      list = list.filter((p) => p.status === state.status);
    }

    if (state.sort === "newest") {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (state.sort === "oldest") {
      list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (state.sort === "expiring") {
      list.sort((a, b) => new Date(getExpiryDate(a)) - new Date(getExpiryDate(b)));
    }

    return list;
  }

  function renderGrid() {
    const grid = document.getElementById("pass-grid");
    const meta = document.getElementById("pass-results-meta");
    const filtered = applyFilters();

    if (D.passes.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-id-card" aria-hidden="true"></i>
          <strong>Your passes will appear here</strong>
          <span>Create a visitor, artisan or property exit pass to get started.</span>
          <button type="button" class="btn btn--primary" data-open-modal="modal-pass-type">Create Your First Pass</button>
        </div>`;
      meta.textContent = "";
      return;
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
          <strong>No passes found</strong>
          <span>You don't have any passes matching your current filters.</span>
          <button type="button" class="btn btn--primary" data-open-modal="modal-pass-type">Create New Pass</button>
        </div>`;
      meta.textContent = "No passes match your filters.";
      return;
    }

    grid.innerHTML = filtered.map(passCardHtml).join("");
    meta.textContent = `Showing ${filtered.length} of ${D.passes.length} pass${D.passes.length === 1 ? "" : "es"}`;
  }

  /* ---------- Recent activity ---------- */
  function renderRecentActivity() {
    const list = document.getElementById("recent-pass-activity");
    if (!D.recentActivity.length) {
      list.innerHTML = `<div class="empty-state" style="padding:24px;"><span>No recent pass activity yet.</span></div>`;
      return;
    }
    list.innerHTML = D.recentActivity
      .slice(0, 6)
      .map(
        (a) => `
        <li class="activity-item">
          <span class="activity-icon" aria-hidden="true"><i class="fa-solid ${a.icon}"></i></span>
          <div class="activity-body">
            <strong>${H.escapeHtml(a.title)}</strong>
            <p>${H.escapeHtml(a.detail)}</p>
          </div>
        </li>`
      )
      .join("");
  }

  function renderAll() {
    renderStats();
    renderGrid();
    renderRecentActivity();
  }

  D.state = state;
  D.render = renderAll;
  D.renderGrid = renderGrid;
  D.renderStats = renderStats;
  D.renderRecentActivity = renderRecentActivity;

  document.addEventListener("DOMContentLoaded", renderAll);
})();

/* ==========================================================================
   FILTER CONTROLS WIRING
   ======================================================================== */

(function () {
  "use strict";
  const D = window.RafaraPasses;

  const searchInput = document.getElementById("pass-search");
  const typeSelect = document.getElementById("filter-type");
  const statusSelect = document.getElementById("filter-status");
  const sortSelect = document.getElementById("filter-sort");

  let debounceTimer = null;
  searchInput.addEventListener("input", (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      D.state.search = e.target.value;
      D.renderGrid();
    }, 150);
  });

  typeSelect.addEventListener("change", (e) => {
    D.state.type = e.target.value;
    D.renderGrid();
  });

  statusSelect.addEventListener("change", (e) => {
    D.state.status = e.target.value;
    D.renderGrid();
  });

  sortSelect.addEventListener("change", (e) => {
    D.state.sort = e.target.value;
    D.renderGrid();
  });
})();

/* ==========================================================================
   TOASTS
   ======================================================================== */

(function () {
  "use strict";

  function showToast(message, icon) {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    toast.innerHTML = `<i class="fa-solid ${icon || "fa-circle-check"}" aria-hidden="true"></i><span></span>`;
    toast.querySelector("span").textContent = message;
    container.appendChild(toast);

    const timer = setTimeout(() => dismiss(), 3200);

    function dismiss() {
      clearTimeout(timer);
      toast.classList.add("is-leaving");
      toast.addEventListener("animationend", () => toast.remove(), { once: true });
    }
  }

  window.RafaraPasses.toast = showToast;
})();

/* ==========================================================================
   MODALS
   ======================================================================== */

(function () {
  "use strict";

  let lastFocusedEl = null;

  function openModal(id) {
    document.querySelectorAll(".modal-overlay:not([hidden])").forEach((m) => {
      if (m.id !== id) m.hidden = true;
    });

    const overlay = document.getElementById(id);
    if (!overlay) return;

    lastFocusedEl = document.activeElement;
    overlay.hidden = false;
    document.body.style.overflow = "hidden";

    const focusable = overlay.querySelector("input, select, textarea, button, [href]");
    if (focusable) focusable.focus();

    overlay.addEventListener("keydown", trapKeydown);
  }

  function closeModal(overlay) {
    if (!overlay || overlay.hidden) return;
    overlay.hidden = true;
    overlay.removeEventListener("keydown", trapKeydown);

    const anyOpen = document.querySelector(".modal-overlay:not([hidden])");
    if (!anyOpen) document.body.style.overflow = "";

    if (lastFocusedEl && document.body.contains(lastFocusedEl)) {
      lastFocusedEl.focus();
    }
  }

  function trapKeydown(e) {
    const overlay = e.currentTarget;
    if (e.key === "Escape") {
      closeModal(overlay);
      return;
    }
    if (e.key !== "Tab") return;
    const focusables = overlay.querySelectorAll("input, select, textarea, button, [href]");
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  document.addEventListener("click", (e) => {
    const opener = e.target.closest("[data-open-modal]");
    if (opener) {
      e.preventDefault();
      openModal(opener.getAttribute("data-open-modal"));
    }
  });

  document.addEventListener("click", (e) => {
    const closer = e.target.closest("[data-close-modal]");
    if (closer) {
      closeModal(closer.closest(".modal-overlay"));
      return;
    }
    if (e.target.classList.contains("modal-overlay")) {
      closeModal(e.target);
    }
  });

  window.RafaraPasses.modal = { open: openModal, close: closeModal };
})();

/* ==========================================================================
   DROPDOWNS (notification bell + profile menu)
   ======================================================================== */

(function () {
  "use strict";

  function toggleDropdown(btn, panel) {
    const isOpen = !panel.hidden;
    closeAllDropdowns();
    if (!isOpen) {
      panel.hidden = false;
      btn.setAttribute("aria-expanded", "true");
    }
  }

  function closeAllDropdowns() {
    document.querySelectorAll(".dropdown-panel").forEach((p) => (p.hidden = true));
    document.querySelectorAll("[aria-haspopup='true']").forEach((b) => b.setAttribute("aria-expanded", "false"));
  }

  document.getElementById("notif-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    toggleDropdown(e.currentTarget, document.getElementById("notif-panel"));
  });

  document.getElementById("profile-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    toggleDropdown(e.currentTarget, document.getElementById("profile-panel"));
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest("[data-dropdown]")) closeAllDropdowns();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllDropdowns();
  });

  window.RafaraPasses.closeAllDropdowns = closeAllDropdowns;
})();

/* ==========================================================================
   SIDEBAR TOGGLE + MOBILE "MORE" SHEET
   ======================================================================== */

(function () {
  "use strict";

  const sidebar = document.getElementById("sidebar");
  const backdrop = document.getElementById("sidebar-backdrop");
  const toggleBtn = document.getElementById("sidebar-toggle-btn");

  function openSidebar() {
    sidebar.classList.add("is-open");
    backdrop.hidden = false;
    toggleBtn.setAttribute("aria-expanded", "true");
  }
  function closeSidebar() {
    sidebar.classList.remove("is-open");
    backdrop.hidden = true;
    toggleBtn.setAttribute("aria-expanded", "false");
  }

  toggleBtn.addEventListener("click", () => {
    sidebar.classList.contains("is-open") ? closeSidebar() : openSidebar();
  });
  backdrop.addEventListener("click", closeSidebar);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSidebar();
  });

  const sheet = document.getElementById("mobile-menu-sheet");
  const menuBtn = document.getElementById("mobile-menu-btn");

  function openSheet() {
    sheet.hidden = false;
    requestAnimationFrame(() => sheet.classList.add("is-open"));
    menuBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  function closeSheet() {
    sheet.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    setTimeout(() => (sheet.hidden = true), 150);
  }

  menuBtn.addEventListener("click", () => {
    sheet.hidden ? openSheet() : closeSheet();
  });
  sheet.querySelectorAll("[data-close-mobile-sheet]").forEach((el) => el.addEventListener("click", closeSheet));

  document.getElementById("mobile-quick-create-btn").addEventListener("click", () => {
    window.RafaraPasses.modal.open("modal-pass-type");
  });

  document.getElementById("mobile-logout-btn").addEventListener("click", () => {
    closeSheet();
    window.RafaraPasses.modal.open("modal-logout");
  });
})();

/* ==========================================================================
   HEADER "CREATE NEW PASS" + LOGOUT
   ======================================================================== */

(function () {
  "use strict";
  const M = window.RafaraPasses.modal;

  document.getElementById("create-pass-btn").addEventListener("click", () => {
    M.open("modal-pass-type");
  });

  document.getElementById("logout-btn").addEventListener("click", () => M.open("modal-logout"));
  document.getElementById("dropdown-logout-btn").addEventListener("click", () => {
    window.RafaraPasses.closeAllDropdowns();
    M.open("modal-logout");
  });

  document.getElementById("confirm-logout-btn").addEventListener("click", () => {
    window.RafaraPasses.toast("Logging you out…", "fa-arrow-right-from-bracket");
    setTimeout(() => {
      window.location.href = "resident-login.html";
    }, 700);
  });
})();

/* ==========================================================================
   FORM SUBMISSIONS — CREATE PASSES (mock, frontend only)
   ======================================================================== */

(function () {
  "use strict";

  const D = window.RafaraPasses;
  const H = D.helpers;
  const M = D.modal;

  function todayISO() {
    return new Date().toISOString().slice(0, 10);
  }

  function resetAndClose(form, modalId) {
    form.reset();
    M.close(document.getElementById(modalId));
  }

  /* ---- One-Day Visitor ---- */
  document.getElementById("form-one-day").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form["od-name"].value.trim();
    const phone = form["od-phone"].value.trim();
    const date = form["od-date"].value;
    const arrival = form["od-arrival"].value;
    const vehicle = form["od-vehicle"].value.trim();
    if (!name || !phone || !date) return;

    const id = D.nextPassId();
    D.addPass({
      id,
      type: "one-day-visitor",
      name,
      phone,
      status: "active",
      date,
      arrival: arrival ? formatTime(arrival) : "",
      host: D.resident.fullName,
      vehicle,
      createdAt: todayISO()
    });
    D.addActivity({ icon: "fa-id-card", title: "Visitor pass created", detail: `${name} · ${H.nowTime()}` });

    D.render();
    resetAndClose(form, "modal-one-day");
    D.toast("Pass created successfully.", "fa-circle-check");
  });

  /* ---- Multi-Day Visitor ---- */
  document.getElementById("form-multi-day").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form["md-name"].value.trim();
    const start = form["md-start"].value;
    const end = form["md-end"].value;
    const phone = form["md-phone"].value.trim();
    if (!name || !start || !end || !phone) return;

    const id = D.nextPassId();
    D.addPass({
      id,
      type: "multi-day-visitor",
      name,
      phone,
      status: "active",
      startDate: start,
      endDate: end,
      host: D.resident.fullName,
      createdAt: todayISO(),
      history: []
    });
    D.addActivity({ icon: "fa-id-card", title: "Visitor pass created", detail: `${name} · ${H.nowTime()}` });

    D.render();
    resetAndClose(form, "modal-multi-day");
    D.toast("Pass created successfully.", "fa-circle-check");
  });

  /* ---- Artisan Pass ---- */
  document.getElementById("form-artisan").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form["ar-name"].value.trim();
    const service = form["ar-service"].value;
    const date = form["ar-date"].value;
    const phone = form["ar-phone"].value.trim();
    const arrival = form["ar-arrival"].value;
    if (!name || !service || !date || !phone) return;

    const id = D.nextPassId();
    D.addPass({
      id,
      type: "artisan",
      name,
      phone,
      status: "active",
      service,
      date,
      arrival: arrival ? formatTime(arrival) : "",
      createdAt: todayISO()
    });
    D.addActivity({ icon: "fa-screwdriver-wrench", title: "Artisan pass created", detail: `${name} · ${H.nowTime()}` });

    D.render();
    resetAndClose(form, "modal-artisan");
    D.toast("Pass created successfully.", "fa-circle-check");
  });

  /* ---- Property Exit Pass ---- */
  document.getElementById("form-exit").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    const item = form["ex-item"].value.trim();
    const qty = parseInt(form["ex-qty"].value, 10) || 1;
    const date = form["ex-date"].value;
    const reason = form["ex-reason"].value.trim();
    const notes = form["ex-notes"].value.trim();
    if (!item || !date || !reason) return;

    const id = D.nextPassId();
    D.addPass({
      id,
      type: "property-exit",
      name: item,
      quantity: qty,
      status: "pending",
      date,
      reason,
      notes,
      createdAt: todayISO()
    });
    D.addActivity({ icon: "fa-dolly", title: "Property exit requested", detail: `${item} · ${H.nowTime()}` });

    D.render();
    resetAndClose(form, "modal-exit");
    D.toast("Pass created successfully.", "fa-circle-check");
  });

  function formatTime(timeStr) {
    // timeStr like "16:00" -> "4:00 PM"
    const [h, m] = timeStr.split(":").map(Number);
    if (isNaN(h)) return timeStr;
    const d = new Date();
    d.setHours(h, m || 0);
    return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
})();

/* ==========================================================================
   PASS DETAILS MODAL
   ======================================================================== */

(function () {
  "use strict";

  const D = window.RafaraPasses;
  const H = D.helpers;
  const M = D.modal;

  function infoRows(p) {
    return [
      ["Pass Type", D.PASS_TYPE_LABELS[p.type]],
      ["Pass Reference", p.id],
      ["Status", null], // rendered specially below
      ["Created Date", H.formatDate(p.createdAt)]
    ];
  }

  function detailRow(label, value) {
    return `<div class="details-row"><span>${label}</span><span>${value}</span></div>`;
  }

  function statusBadgeHtml(status) {
    return `<span class="badge ${H.statusBadgeClass(status)}"><i class="${H.statusIcon(status)}" aria-hidden="true"></i>${H.statusLabel(status)}</span>`;
  }

  function typeSpecificSectionHtml(p) {
    if (p.type === "one-day-visitor") {
      return `
        <div class="details-section">
          <div class="details-section-title">Visitor</div>
          ${detailRow("Name", H.escapeHtml(p.name))}
          ${detailRow("Phone", H.escapeHtml(p.phone || "—"))}
          ${detailRow("Visit Date", H.formatDate(p.date))}
          ${p.arrival ? detailRow("Expected Arrival", p.arrival) : ""}
          ${detailRow("Host", H.escapeHtml(p.host || D.resident.fullName))}
          ${p.vehicle ? detailRow("Vehicle", H.escapeHtml(p.vehicle)) : ""}
        </div>`;
    }
    if (p.type === "multi-day-visitor") {
      const history = (p.history || [])
        .map(
          (h) => `
          <div class="details-history-item">
            <i class="fa-solid fa-circle-dot" aria-hidden="true"></i>
            <div><strong>${H.escapeHtml(h.event)}</strong><span>${h.time}</span></div>
          </div>`
        )
        .join("");
      return `
        <div class="details-section">
          <div class="details-section-title">Visitor</div>
          ${detailRow("Name", H.escapeHtml(p.name))}
          ${detailRow("Phone", H.escapeHtml(p.phone || "—"))}
          ${detailRow("Start Date", H.formatDate(p.startDate))}
          ${detailRow("End Date", H.formatDate(p.endDate))}
          ${detailRow("Host", H.escapeHtml(p.host || D.resident.fullName))}
        </div>
        <div class="details-section">
          <div class="details-section-title">Entry / Exit History</div>
          ${history || `<p class="details-note"><i class="fa-solid fa-circle-info" aria-hidden="true"></i> No check-in activity recorded yet.</p>`}
        </div>`;
    }
    if (p.type === "artisan") {
      return `
        <div class="details-section">
          <div class="details-section-title">Artisan</div>
          ${detailRow("Name / Company", H.escapeHtml(p.name))}
          ${detailRow("Service Type", H.escapeHtml(p.service || "—"))}
          ${detailRow("Contact", H.escapeHtml(p.phone || "—"))}
          ${detailRow("Visit Date", H.formatDate(p.date))}
          ${p.arrival ? detailRow("Expected Arrival", p.arrival) : ""}
        </div>`;
    }
    if (p.type === "property-exit") {
      return `
        <div class="details-section">
          <div class="details-section-title">Property</div>
          ${detailRow("Item", H.escapeHtml(p.name))}
          ${detailRow("Quantity", p.quantity || 1)}
          ${detailRow("Reason", H.escapeHtml(p.reason || "—"))}
          ${detailRow("Date", H.formatDate(p.date))}
        </div>
        ${p.notes ? `<div class="details-section"><div class="details-section-title">Additional Notes</div><p class="details-note"><i class="fa-solid fa-note-sticky" aria-hidden="true"></i> ${H.escapeHtml(p.notes)}</p></div>` : ""}`;
    }
    return "";
  }

  function openPassDetails(passId) {
    const p = D.findPass(passId);
    if (!p) return;

    document.getElementById("modal-details-title").textContent = D.PASS_TYPE_LABELS[p.type];
    document.getElementById("modal-details-body").innerHTML = `
      <div class="details-section">
        <div class="details-section-title">Pass Information</div>
        ${detailRow("Pass Type", D.PASS_TYPE_LABELS[p.type])}
        ${detailRow("Pass Reference", p.id)}
        ${detailRow("Status", statusBadgeHtml(p.status))}
        ${detailRow("Created Date", H.formatDate(p.createdAt))}
      </div>
      ${typeSpecificSectionHtml(p)}
      <p class="details-note" style="margin-top:14px;"><i class="fa-solid fa-circle-info" aria-hidden="true"></i> This pass is demo data and has not been verified by a backend.</p>
    `;
    M.open("modal-details");
    D.toast("Pass details opened.", "fa-id-card");
  }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-view-pass]");
    if (btn) openPassDetails(btn.getAttribute("data-view-pass"));
  });
})();

/* ==========================================================================
   END VISIT
   ======================================================================== */

(function () {
  "use strict";
  const D = window.RafaraPasses;
  const H = D.helpers;
  const M = D.modal;

  let endingPassId = null;

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-end-visit]");
    if (btn) {
      endingPassId = btn.getAttribute("data-end-visit");
      M.open("modal-end-visit");
    }
  });

  document.getElementById("confirm-end-visit-btn").addEventListener("click", () => {
    if (!endingPassId) return;
    const p = D.findPass(endingPassId);
    if (p) {
      p.status = "checked-out";
      D.addActivity({ icon: "fa-right-from-bracket", title: "Visit ended", detail: `${p.name} · ${H.nowTime()}` });
    }
    D.render();
    M.close(document.getElementById("modal-end-visit"));
    D.toast("Visit ended successfully.", "fa-circle-check");
    endingPassId = null;
  });
})();

/* ==========================================================================
   EXTEND MULTI-DAY VISIT
   ======================================================================== */

(function () {
  "use strict";
  const D = window.RafaraPasses;
  const H = D.helpers;
  const M = D.modal;

  let extendingPassId = null;

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-extend-visit]");
    if (btn) {
      extendingPassId = btn.getAttribute("data-extend-visit");
      const p = D.findPass(extendingPassId);
      if (!p) return;
      document.getElementById("extend-current-end").value = H.formatDate(p.endDate);
      document.getElementById("extend-date").value = "";
      document.getElementById("extend-error").hidden = true;
      M.open("modal-extend");
    }
  });

  document.getElementById("form-extend").addEventListener("submit", (e) => {
    e.preventDefault();
    if (!extendingPassId) return;
    const p = D.findPass(extendingPassId);
    if (!p) return;

    const newEnd = document.getElementById("extend-date").value;
    const errorEl = document.getElementById("extend-error");

    if (!newEnd || new Date(newEnd) <= new Date(p.endDate)) {
      errorEl.hidden = false;
      return;
    }
    errorEl.hidden = true;

    p.endDate = newEnd;
    p.status = "active";
    D.addActivity({
      icon: "fa-calendar-plus",
      title: "Multi-day visit extended",
      detail: `${p.name} · ${H.nowTime()}`
    });

    D.render();
    e.target.reset();
    M.close(document.getElementById("modal-extend"));
    D.toast("Visit extended successfully.", "fa-circle-check");
    extendingPassId = null;
  });
})();

/* ==========================================================================
   CANCEL PENDING PASS
   ======================================================================== */

(function () {
  "use strict";
  const D = window.RafaraPasses;
  const H = D.helpers;
  const M = D.modal;

  let cancelingPassId = null;

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-cancel-pass]");
    if (btn) {
      cancelingPassId = btn.getAttribute("data-cancel-pass");
      M.open("modal-cancel-pass");
    }
  });

  document.getElementById("confirm-cancel-pass-btn").addEventListener("click", () => {
    if (!cancelingPassId) return;
    const p = D.findPass(cancelingPassId);
    if (p) {
      D.removePass(cancelingPassId);
      D.addActivity({ icon: "fa-ban", title: "Pass request cancelled", detail: `${p.name} · ${H.nowTime()}` });
    }
    D.render();
    M.close(document.getElementById("modal-cancel-pass"));
    D.toast("Pass cancelled successfully.", "fa-circle-check");
    cancelingPassId = null;
  });
})();
