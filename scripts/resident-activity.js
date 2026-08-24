/* ==========================================================================
   RAFARA GATEPASS — RESIDENT ACTIVITY PAGE
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
    fullName: "Rahmah Ogunlaja"
  };

  // Fixed reference date for this demo, so "Today"/"Yesterday"/"This Week"
  // filters line up with the mock data below regardless of the real date.
  const DEMO_TODAY = "2026-08-23";
  const DEMO_YESTERDAY = "2026-08-22";

  const CATEGORY_LABELS = {
    visitors: "Visitor",
    passes: "Pass",
    security: "Security",
    account: "Account"
  };

  const CATEGORY_ICONS = {
    visitors: "fa-solid fa-user-group",
    passes: "fa-solid fa-id-card",
    security: "fa-solid fa-shield-halved",
    account: "fa-solid fa-user"
  };

  const TYPE_ICONS = {
    "visitor-check-in": "fa-solid fa-right-to-bracket",
    "visitor-check-out": "fa-solid fa-right-from-bracket",
    "pass-created": "fa-solid fa-id-card",
    "pass-updated": "fa-solid fa-pen",
    "pass-expired": "fa-regular fa-clock",
    "security-verified": "fa-solid fa-shield-halved",
    "security-gate": "fa-solid fa-shield",
    "account-profile": "fa-solid fa-user",
    "account-notifications": "fa-solid fa-bell"
  };

  // status: "recorded" | "completed" | "active" | "expired"
  const activities = [
    // ---------------- TODAY ----------------
    {
      id: "ACT-014",
      type: "visitor-check-in",
      category: "visitors",
      title: "Visitor checked in",
      description: "Sarah Ade entered the estate using her active multi-day pass.",
      visitorName: "Sarah Ade",
      visitorPhone: "0803 214 7765",
      visitType: "Multi-Day Visitor",
      host: resident.fullName,
      passReference: "RFP-20482",
      passValidity: "Aug 22 – Aug 26, 2026",
      security: "Access verified at the estate gate.",
      date: DEMO_TODAY,
      time: "18:30",
      status: "recorded"
    },
    {
      id: "ACT-013",
      type: "security-gate",
      category: "security",
      title: "Gate access recorded",
      description: "Sarah Ade's entry was recorded at the estate gate.",
      visitorName: "Sarah Ade",
      passReference: "RFP-20482",
      date: DEMO_TODAY,
      time: "18:29",
      status: "recorded"
    },
    {
      id: "ACT-012",
      type: "pass-created",
      category: "passes",
      title: "Visitor pass created",
      description: "Rahmah created a one-day visitor pass for John Doe.",
      visitorName: "John Doe",
      visitorPhone: "0806 552 1190",
      visitType: "One-Day Visitor",
      host: resident.fullName,
      passReference: "RFP-20481",
      passValidity: "Aug 23, 2026",
      date: DEMO_TODAY,
      time: "16:20",
      status: "completed"
    },
    {
      id: "ACT-011",
      type: "pass-updated",
      category: "passes",
      title: "Visitor pass updated",
      description: "The validity period for Sarah Ade's visitor pass was extended.",
      visitorName: "Sarah Ade",
      visitType: "Multi-Day Visitor",
      passReference: "RFP-20482",
      passValidity: "Aug 22 – Aug 26, 2026",
      date: DEMO_TODAY,
      time: "10:05",
      status: "completed"
    },
    {
      id: "ACT-010",
      type: "security-verified",
      category: "security",
      title: "Access verification completed",
      description: "Security verified John Doe's visitor pass at the main gate.",
      visitorName: "John Doe",
      passReference: "RFP-20481",
      date: DEMO_TODAY,
      time: "14:13",
      status: "recorded"
    },
    {
      id: "ACT-009",
      type: "visitor-check-in",
      category: "visitors",
      title: "Visitor checked in",
      description: "John Doe entered the estate using pass RFP-20481.",
      visitorName: "John Doe",
      visitorPhone: "0806 552 1190",
      visitType: "One-Day Visitor",
      host: resident.fullName,
      passReference: "RFP-20481",
      passValidity: "Aug 23, 2026",
      security: "Access verified at estate gate.",
      date: DEMO_TODAY,
      time: "14:14",
      status: "recorded"
    },
    {
      id: "ACT-008",
      type: "account-profile",
      category: "account",
      title: "Profile updated",
      description: "Your resident profile information was updated.",
      date: DEMO_TODAY,
      time: "09:02",
      status: "completed"
    },

    // ---------------- YESTERDAY ----------------
    {
      id: "ACT-007",
      type: "visitor-check-out",
      category: "visitors",
      title: "Visitor checked out",
      description: "Sarah Ade left the estate.",
      visitorName: "Sarah Ade",
      visitType: "Multi-Day Visitor",
      host: resident.fullName,
      passReference: "RFP-20482",
      date: DEMO_YESTERDAY,
      time: "09:15",
      status: "recorded"
    },
    {
      id: "ACT-006",
      type: "visitor-check-in",
      category: "visitors",
      title: "Visitor checked in",
      description: "Sarah Ade entered the estate using her active multi-day pass.",
      visitorName: "Sarah Ade",
      visitType: "Multi-Day Visitor",
      host: resident.fullName,
      passReference: "RFP-20482",
      passValidity: "Aug 22 – Aug 26, 2026",
      security: "Access verified at estate gate.",
      date: DEMO_YESTERDAY,
      time: "16:40",
      status: "recorded"
    },
    {
      id: "ACT-005",
      type: "pass-created",
      category: "passes",
      title: "Artisan pass created",
      description: "Rahmah created an artisan pass for Emeka Okoye, an electrician.",
      visitorName: "Emeka Okoye",
      visitorPhone: "0701 884 3320",
      visitType: "Artisan",
      host: resident.fullName,
      passReference: "RFP-20479",
      passValidity: "Aug 22, 2026",
      date: DEMO_YESTERDAY,
      time: "08:30",
      status: "completed"
    },
    {
      id: "ACT-004",
      type: "visitor-check-out",
      category: "visitors",
      title: "Visitor checked out",
      description: "Emeka Okoye left the estate after completing artisan work.",
      visitorName: "Emeka Okoye",
      visitType: "Artisan",
      passReference: "RFP-20479",
      date: DEMO_YESTERDAY,
      time: "13:05",
      status: "recorded"
    },

    // ---------------- EARLIER THIS WEEK ----------------
    {
      id: "ACT-003",
      type: "pass-expired",
      category: "passes",
      title: "Visitor pass expired",
      description: "The one-day visitor pass issued for Tunde Bakare reached its expiration date.",
      visitorName: "Tunde Bakare",
      visitType: "One-Day Visitor",
      passReference: "RFP-20470",
      date: "2026-08-20",
      time: "23:59",
      status: "expired"
    },
    {
      id: "ACT-002",
      type: "visitor-check-in",
      category: "visitors",
      title: "Visitor checked in",
      description: "Tunde Bakare entered the estate using pass RFP-20470.",
      visitorName: "Tunde Bakare",
      visitorPhone: "0813 002 9981",
      visitType: "One-Day Visitor",
      host: resident.fullName,
      passReference: "RFP-20470",
      passValidity: "Aug 20, 2026",
      security: "Access verified at estate gate.",
      date: "2026-08-20",
      time: "11:20",
      status: "recorded"
    },
    {
      id: "ACT-001B",
      type: "security-gate",
      category: "security",
      title: "Gate access recorded",
      description: "Tunde Bakare's entry was recorded at the estate gate.",
      visitorName: "Tunde Bakare",
      passReference: "RFP-20470",
      date: "2026-08-20",
      time: "11:19",
      status: "recorded"
    },

    // ---------------- EARLIER THIS MONTH ----------------
    {
      id: "ACT-001A",
      type: "pass-created",
      category: "passes",
      title: "Multi-day visitor pass created",
      description: "Rahmah created a multi-day visitor pass for Sarah Ade.",
      visitorName: "Sarah Ade",
      visitorPhone: "0803 214 7765",
      visitType: "Multi-Day Visitor",
      host: resident.fullName,
      passReference: "RFP-20482",
      passValidity: "Aug 22 – Aug 26, 2026",
      date: "2026-08-15",
      time: "12:00",
      status: "completed"
    },
    {
      id: "ACT-000",
      type: "account-notifications",
      category: "account",
      title: "Notification preferences updated",
      description: "You updated your notification preferences for visitor activity.",
      date: "2026-08-09",
      time: "19:45",
      status: "completed"
    }
  ];

  window.RafaraActivity = {
    resident,
    DEMO_TODAY,
    DEMO_YESTERDAY,
    CATEGORY_LABELS,
    CATEGORY_ICONS,
    TYPE_ICONS,
    get activities() { return activities; },
    findActivity: (id) => activities.find((a) => a.id === id)
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
      case "recorded": return "badge--recorded";
      case "completed": return "badge--closed";
      case "active": return "badge--active";
      case "expired": return "badge--expired";
      default: return "badge--closed";
    }
  }

  function statusIcon(status) {
    switch (status) {
      case "recorded": return "fa-solid fa-circle-dot";
      case "completed": return "fa-solid fa-circle-check";
      case "active": return "fa-solid fa-circle";
      case "expired": return "fa-solid fa-circle-minus";
      default: return "fa-solid fa-circle";
    }
  }

  function statusLabel(status) {
    const map = {
      recorded: "Recorded",
      completed: "Completed",
      active: "Active",
      expired: "Expired"
    };
    return map[status] || status;
  }

  function formatDate(dateStr, opts) {
    if (!dateStr) return "—";
    const d = new Date(dateStr + "T00:00:00");
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString(undefined, opts || { month: "long", day: "numeric", year: "numeric" });
  }

  function formatTimeFromHHMM(hhmm) {
    if (!hhmm) return "";
    const [h, m] = hhmm.split(":").map(Number);
    if (isNaN(h)) return hhmm;
    const d = new Date();
    d.setHours(h, m || 0);
    return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }

  window.RafaraActivity.helpers = {
    escapeHtml,
    statusBadgeClass,
    statusIcon,
    statusLabel,
    formatDate,
    formatTimeFromHHMM
  };
})();

/* ==========================================================================
   FILTER STATE + STATISTICS
   ======================================================================== */

(function () {
  "use strict";

  const D = window.RafaraActivity;

  const state = {
    search: "",
    category: "all",
    date: "all",
    status: "all",
    sort: "newest"
  };

  function renderStats() {
    const today = D.activities.filter((a) => a.date === D.DEMO_TODAY);
    document.getElementById("stat-today").textContent = today.length;
    document.getElementById("stat-visitors").textContent = today.filter((a) => a.category === "visitors").length;
    document.getElementById("stat-passes").textContent = today.filter((a) => a.category === "passes").length;
    document.getElementById("stat-security").textContent = today.filter((a) => a.category === "security").length;
  }

  D.state = state;
  D.renderStats = renderStats;
})();

/* ==========================================================================
   FILTERING / SEARCH / SORT / GROUPING + RENDERING
   ======================================================================== */

(function () {
  "use strict";

  const D = window.RafaraActivity;
  const H = D.helpers;

  function matchesSearch(a, q) {
    q = q.toLowerCase();
    return (
      (a.title && a.title.toLowerCase().includes(q)) ||
      (a.description && a.description.toLowerCase().includes(q)) ||
      (a.visitorName && a.visitorName.toLowerCase().includes(q)) ||
      (a.passReference && a.passReference.toLowerCase().includes(q)) ||
      (D.CATEGORY_LABELS[a.category] && D.CATEGORY_LABELS[a.category].toLowerCase().includes(q))
    );
  }

  function isWithinDateFilter(a, filter) {
    if (filter === "all") return true;
    if (filter === "today") return a.date === D.DEMO_TODAY;
    if (filter === "yesterday") return a.date === D.DEMO_YESTERDAY;

    const today = new Date(D.DEMO_TODAY + "T00:00:00");
    const target = new Date(a.date + "T00:00:00");
    const diffDays = Math.round((today - target) / 86400000);

    if (filter === "week") return diffDays >= 0 && diffDays < 7;
    if (filter === "month") return target.getFullYear() === today.getFullYear() && target.getMonth() === today.getMonth();
    return true;
  }

  function applyFilters(list) {
    let out = list;
    if (D.state.search.trim()) out = out.filter((a) => matchesSearch(a, D.state.search.trim()));
    if (D.state.category !== "all") out = out.filter((a) => a.category === D.state.category);
    if (D.state.status !== "all") out = out.filter((a) => a.status === D.state.status);
    if (D.state.date !== "all") out = out.filter((a) => isWithinDateFilter(a, D.state.date));
    return out;
  }

  function sortKey(a) {
    return new Date(`${a.date}T${a.time}:00`);
  }

  function applySort(list) {
    const sorted = list.slice();
    sorted.sort((a, b) => {
      const diff = sortKey(b) - sortKey(a);
      return D.state.sort === "newest" ? diff : -diff;
    });
    return sorted;
  }

  function dateGroupLabel(dateStr) {
    if (dateStr === D.DEMO_TODAY) return "Today";
    if (dateStr === D.DEMO_YESTERDAY) return "Yesterday";
    return H.formatDate(dateStr);
  }

  function groupByDate(list) {
    const groups = [];
    const map = new Map();
    list.forEach((a) => {
      if (!map.has(a.date)) {
        const group = { date: a.date, items: [] };
        map.set(a.date, group);
        groups.push(group);
      }
      map.get(a.date).items.push(a);
    });
    return groups;
  }

  function actionLabel(a) {
    return a.category === "passes" ? "View Pass" : "View Details";
  }

  function tagsHtml(a) {
    const tags = [
      `<span class="tag"><i class="${D.CATEGORY_ICONS[a.category]}" aria-hidden="true"></i>${D.CATEGORY_LABELS[a.category]}</span>`
    ];
    if (a.passReference) {
      tags.push(`<span class="tag tag--ref"><i class="fa-solid fa-id-card" aria-hidden="true"></i>${H.escapeHtml(a.passReference)}</span>`);
    }
    tags.push(`<span class="badge ${H.statusBadgeClass(a.status)}"><i class="${H.statusIcon(a.status)}" aria-hidden="true"></i>${H.statusLabel(a.status)}</span>`);
    return tags.join("");
  }

  function activityItemHtml(a) {
    return `
      <div class="activity-item" data-activity-id="${a.id}">
        <span class="activity-icon" aria-hidden="true"><i class="${D.TYPE_ICONS[a.type] || "fa-solid fa-circle-info"}"></i></span>
        <div class="activity-body">
          <strong>${H.escapeHtml(a.title)}</strong>
          <p>${H.escapeHtml(a.description)}</p>
          <div class="activity-tags">${tagsHtml(a)}</div>
          <div class="activity-item-actions">
            <button type="button" class="btn btn--ghost btn--sm" data-activity-action="${escapeAttr(actionLabel(a))}" data-activity-id="${a.id}">${actionLabel(a)}</button>
          </div>
        </div>
        <span class="activity-time">${H.formatTimeFromHHMM(a.time)}</span>
      </div>`;
  }

  function escapeAttr(str) {
    return String(str).replace(/"/g, "&quot;");
  }

  function render() {
    D.renderStats();

    const wrap = document.getElementById("activity-panel-body");
    const countLabel = document.getElementById("result-count-label");

    if (D.activities.length === 0) {
      wrap.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-clock-rotate-left" aria-hidden="true"></i>
          <strong>No Activity Yet</strong>
          <span>Your access and security activity will appear here once events are recorded.</span>
          <a href="resident-passes.html" class="btn btn--primary">View Passes</a>
        </div>`;
      countLabel.textContent = "";
      return;
    }

    let filtered = applyFilters(D.activities);
    filtered = applySort(filtered);

    if (filtered.length === 0) {
      wrap.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
          <strong>No Activity Found</strong>
          <span>Try adjusting your search or filters.</span>
          <button type="button" class="btn btn--secondary" id="clear-filters-btn">Clear Filters</button>
        </div>`;
      countLabel.textContent = "No results";
      document.getElementById("clear-filters-btn").addEventListener("click", D.clearFilters);
      return;
    }

    const isDefault = !D.state.search && D.state.category === "all" && D.state.date === "all" && D.state.status === "all";
    countLabel.textContent = isDefault ? "" : `${filtered.length} ${filtered.length === 1 ? "event" : "events"}`;

    const groups = groupByDate(filtered);
    wrap.innerHTML = groups
      .map(
        (g) => `
        <div class="date-group">
          <p class="date-group-label">${dateGroupLabel(g.date).toUpperCase()}</p>
          <div class="activity-timeline">${g.items.map(activityItemHtml).join("")}</div>
        </div>`
      )
      .join("");
  }

  D.render = render;
  D.clearFilters = function clearFilters() {
    D.state.search = "";
    D.state.category = "all";
    D.state.date = "all";
    D.state.status = "all";
    D.state.sort = "newest";

    document.getElementById("activity-search").value = "";
    document.getElementById("filter-category").value = "all";
    document.getElementById("filter-date").value = "all";
    document.getElementById("filter-status").value = "all";
    document.getElementById("filter-sort").value = "newest";

    render();
    D.toast("Filters cleared.", "fa-filter-circle-xmark");
  };

  document.addEventListener("DOMContentLoaded", render);
})();

/* ==========================================================================
   FILTER CONTROLS WIRING
   ======================================================================== */

(function () {
  "use strict";
  const D = window.RafaraActivity;

  const searchInput = document.getElementById("activity-search");
  const categorySelect = document.getElementById("filter-category");
  const dateSelect = document.getElementById("filter-date");
  const statusSelect = document.getElementById("filter-status");
  const sortSelect = document.getElementById("filter-sort");

  let debounceTimer = null;
  searchInput.addEventListener("input", (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      D.state.search = e.target.value;
      D.render();
    }, 150);
  });

  categorySelect.addEventListener("change", (e) => {
    D.state.category = e.target.value;
    D.render();
  });
  dateSelect.addEventListener("change", (e) => {
    D.state.date = e.target.value;
    D.render();
  });
  statusSelect.addEventListener("change", (e) => {
    D.state.status = e.target.value;
    D.render();
  });
  sortSelect.addEventListener("change", (e) => {
    D.state.sort = e.target.value;
    D.render();
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

  window.RafaraActivity.toast = showToast;
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

  window.RafaraActivity.modal = { open: openModal, close: closeModal };
})();

/* ==========================================================================
   ACTIVITY DETAILS MODAL
   ======================================================================== */

(function () {
  "use strict";

  const D = window.RafaraActivity;
  const H = D.helpers;
  const M = D.modal;

  function detailRow(label, value) {
    return `<div class="details-row"><span>${label}</span><span>${value}</span></div>`;
  }

  function openActivityDetails(activityId) {
    const a = D.findActivity(activityId);
    if (!a) return;

    document.getElementById("modal-activity-details-title").textContent = a.title;

    let html = `
      <p class="modal-lede">${H.escapeHtml(a.description)}</p>
      <div class="details-section">
        <div class="details-section-title">Activity Details</div>
        ${detailRow("Category", D.CATEGORY_LABELS[a.category])}
        ${detailRow("Date", H.formatDate(a.date))}
        ${detailRow("Time", H.formatTimeFromHHMM(a.time))}
        ${detailRow("Status", `<span class="badge ${H.statusBadgeClass(a.status)}"><i class="${H.statusIcon(a.status)}" aria-hidden="true"></i>${H.statusLabel(a.status)}</span>`)}
      </div>
    `;

    if (a.visitorName) {
      html += `
        <div class="details-section">
          <div class="details-section-title">Related Visitor</div>
          ${detailRow("Name", H.escapeHtml(a.visitorName))}
          ${a.visitType ? detailRow("Visit Type", H.escapeHtml(a.visitType)) : ""}
          ${a.visitorPhone ? detailRow("Phone", H.escapeHtml(a.visitorPhone)) : ""}
          ${a.host ? detailRow("Host", H.escapeHtml(a.host)) : ""}
        </div>`;
    }

    if (a.passReference) {
      html += `
        <div class="details-section">
          <div class="details-section-title">Related Pass</div>
          ${detailRow("Pass Reference", H.escapeHtml(a.passReference))}
          ${a.passValidity ? detailRow("Valid", H.escapeHtml(a.passValidity)) : ""}
        </div>`;
    }

    if (a.security) {
      html += `<p class="details-note"><i class="fa-solid fa-shield-halved" aria-hidden="true"></i> ${H.escapeHtml(a.security)}</p>`;
    }

    document.getElementById("modal-activity-details-body").innerHTML = html;
    M.open("modal-activity-details");
    D.toast("Activity details opened.", "fa-clock-rotate-left");
  }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-activity-id][data-activity-action]");
    if (!btn) return;

    const activityId = btn.getAttribute("data-activity-id");
    const action = btn.getAttribute("data-activity-action");

    if (action === "View Pass") {
      D.toast("Opening pass details...", "fa-id-card");
      setTimeout(() => {
        window.location.href = "resident-passes.html";
      }, 500);
    } else {
      openActivityDetails(activityId);
    }
  });
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

  window.RafaraActivity.closeAllDropdowns = closeAllDropdowns;
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

  document.getElementById("mobile-logout-btn").addEventListener("click", () => {
    closeSheet();
    window.RafaraActivity.modal.open("modal-logout");
  });
})();

/* ==========================================================================
   LOGOUT
   ======================================================================== */

(function () {
  "use strict";
  const M = window.RafaraActivity.modal;

  document.getElementById("logout-btn").addEventListener("click", () => M.open("modal-logout"));
  document.getElementById("dropdown-logout-btn").addEventListener("click", () => {
    window.RafaraActivity.closeAllDropdowns();
    M.open("modal-logout");
  });

  document.getElementById("confirm-logout-btn").addEventListener("click", () => {
    window.RafaraActivity.toast("Logging you out…", "fa-arrow-right-from-bracket");
    setTimeout(() => {
      window.location.href = "resident-login.html";
    }, 700);
  });
})();
