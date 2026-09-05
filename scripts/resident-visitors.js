/* ==========================================================================
   RAFARA GATEPASS — RESIDENT VISITORS PAGE
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

  // Fixed reference date for this demo, so "Today"/"Tomorrow"/"This Week"
  // filters line up with the mock data below regardless of the real date.
  const DEMO_TODAY = "2026-08-23";

  const VISIT_TYPE_LABELS = {
    "one-day": "One-Day Visitor",
    "multi-day": "Multi-Day Visitor",
    artisan: "Artisan"
  };

  const VISIT_TYPE_ICONS = {
    "one-day": "fa-regular fa-calendar-check",
    "multi-day": "fa-solid fa-calendar-week",
    artisan: "fa-solid fa-screwdriver-wrench"
  };

  // One-Day Visitor Pass sub-types: regular | ride | delivery
  const ONE_DAY_TYPE_META = {
    regular: { label: "Regular Visitor", icon: "fa-solid fa-user-group" },
    ride: { label: "Ride", icon: "fa-solid fa-car" },
    delivery: { label: "Delivery", icon: "fa-solid fa-box" }
  };

  let visitorIdCounter = 118;

  // status: "inside" | "expected" | "checked-out" | "expired"
  let visitors = [
    {
      id: "VIS-001",
      name: "John Doe",
      phone: "0800 000 0000",
      type: "one-day",
      host: resident.fullName,
      passReference: "RFP-20481",
      status: "inside",
      date: "2026-08-23",
      checkedIn: "2026-08-23T14:14:00",
      checkedOut: null
    },
    {
      id: "VIS-002",
      name: "Sarah Ade",
      phone: "0800 000 0001",
      type: "multi-day",
      host: resident.fullName,
      passReference: "RFP-20482",
      status: "inside",
      startDate: "2026-08-23",
      endDate: "2026-08-30",
      activity: [
        { action: "checked-in", date: "2026-08-23", time: "16:20" },
        { action: "checked-out", date: "2026-08-24", time: "09:15" },
        { action: "checked-in", date: "2026-08-24", time: "18:30" }
      ]
    },
    {
      id: "VIS-003",
      name: "Chidinma Obi",
      phone: "0807 222 3344",
      type: "one-day",
      host: resident.fullName,
      passReference: "RFP-20470",
      status: "inside",
      date: "2026-08-23",
      checkedIn: "2026-08-23T13:30:00",
      checkedOut: null
    },

    // Expected / upcoming
    {
      id: "VIS-004",
      name: "David Johnson",
      phone: "0803 456 7890",
      type: "one-day",
      host: resident.fullName,
      passReference: "RFP-20485",
      status: "expected",
      date: "2026-08-23",
      expectedTime: "16:00",
      checkedIn: null,
      checkedOut: null
    },
    {
      id: "VIS-005",
      name: "Michael Ade",
      phone: "0805 111 2233",
      type: "multi-day",
      host: resident.fullName,
      passReference: "RFP-20486",
      status: "expected",
      startDate: "2026-08-25",
      endDate: "2026-08-30",
      activity: []
    },
    {
      id: "VIS-006",
      name: "Ngozi Umeh",
      phone: "0806 555 1122",
      type: "one-day",
      host: resident.fullName,
      passReference: "RFP-20487",
      status: "expected",
      date: "2026-08-24",
      expectedTime: "11:00",
      checkedIn: null,
      checkedOut: null
    },
    {
      id: "VIS-007",
      name: "Femi Alao",
      phone: "0812 333 4455",
      type: "artisan",
      host: resident.fullName,
      passReference: "RFP-20488",
      status: "expected",
      date: "2026-08-26",
      expectedTime: "09:00",
      checkedIn: null,
      checkedOut: null
    },

    // Checked out / completed (history)
    {
      id: "VIS-008",
      name: "Mike James",
      phone: "0813 777 8899",
      type: "artisan",
      host: resident.fullName,
      passReference: "RFP-20465",
      status: "checked-out",
      date: "2026-08-22",
      checkedIn: "2026-08-22T10:20:00",
      checkedOut: "2026-08-22T13:45:00"
    },
    {
      id: "VIS-009",
      name: "Grace Etim",
      phone: "0809 333 4455",
      type: "multi-day",
      host: resident.fullName,
      passReference: "RFP-20455",
      status: "checked-out",
      startDate: "2026-08-01",
      endDate: "2026-08-05",
      activity: [
        { action: "checked-in", date: "2026-08-01", time: "14:00" },
        { action: "checked-out", date: "2026-08-03", time: "10:00" }
      ]
    },
    {
      id: "VIS-010",
      name: "Tunde Bakare",
      phone: "0813 121 3141",
      type: "one-day",
      host: resident.fullName,
      passReference: "RFP-20440",
      status: "checked-out",
      date: "2026-08-20",
      checkedIn: "2026-08-20T15:00:00",
      checkedOut: "2026-08-20T18:10:00"
    },
    {
      id: "VIS-011",
      name: "Bright Spark Electricals",
      phone: "0810 555 1212",
      type: "artisan",
      host: resident.fullName,
      passReference: "RFP-20460",
      status: "checked-out",
      date: "2026-08-18",
      checkedIn: "2026-08-18T09:00:00",
      checkedOut: "2026-08-18T12:30:00"
    },

    // Expired
    {
      id: "VIS-012",
      name: "Emeka Nwosu",
      phone: "0806 999 1010",
      type: "one-day",
      host: resident.fullName,
      passReference: "RFP-20430",
      status: "expired",
      date: "2026-08-15",
      checkedIn: null,
      checkedOut: null
    }
  ];

  /* ========================================================================
     SHARED NAMESPACE
     ======================================================================== */

  window.RafaraVisitors = {
    resident,
    DEMO_TODAY,
    VISIT_TYPE_LABELS,
    VISIT_TYPE_ICONS,
    ONE_DAY_TYPE_META,
    get visitors() { return visitors; },
    nextVisitorId: () => `VIS-${String(++visitorIdCounter).padStart(3, "0")}`,
    addVisitor: (v) => visitors.unshift(v),
    findVisitor: (id) => visitors.find((v) => v.id === id)
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

  function initials(name) {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0].toUpperCase())
      .join("");
  }

  function statusBadgeClass(status) {
    switch (status) {
      case "inside": return "badge--checkedin";
      case "expected": return "badge--pending";
      case "checked-out": return "badge--checkedout";
      case "expired": return "badge--expired";
      default: return "badge--closed";
    }
  }

  function statusLabel(status) {
    const map = {
      inside: "Inside Estate",
      expected: "Expected",
      "checked-out": "Checked Out",
      expired: "Expired"
    };
    return map[status] || status;
  }

  function statusIcon(status) {
    switch (status) {
      case "inside": return "fa-solid fa-circle";
      case "expected": return "fa-solid fa-clock";
      case "checked-out": return "fa-solid fa-circle-check";
      case "expired": return "fa-solid fa-circle-minus";
      default: return "fa-solid fa-circle";
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

  function formatTimeFromISO(isoStr) {
    if (!isoStr) return "";
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }

  function formatTimeFromHHMM(hhmm) {
    if (!hhmm) return "";
    const [h, m] = hhmm.split(":").map(Number);
    if (isNaN(h)) return hhmm;
    const d = new Date();
    d.setHours(h, m || 0);
    return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }

  function dateFromISO(isoStr) {
    if (!isoStr) return "";
    return isoStr.slice(0, 10);
  }

  function nowTime() {
    return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }

  function todayISO() {
    return new Date().toISOString().slice(0, 10);
  }

  window.RafaraVisitors.helpers = {
    escapeHtml,
    initials,
    statusBadgeClass,
    statusLabel,
    statusIcon,
    formatDate,
    formatDateShort,
    formatTimeFromISO,
    formatTimeFromHHMM,
    dateFromISO,
    nowTime,
    todayISO
  };
})();

/* ==========================================================================
   FILTER STATE + STATISTICS
   ======================================================================== */

(function () {
  "use strict";

  const D = window.RafaraVisitors;
  const H = D.helpers;

  const state = {
    search: "",
    status: "all",
    type: "all",
    date: "all",
    sort: "newest"
  };

  function renderStats() {
    const all = D.visitors;
    document.getElementById("stat-inside").textContent = all.filter((v) => v.status === "inside").length;

    const today = D.DEMO_TODAY;
    document.getElementById("stat-today").textContent = all.filter((v) => {
      const d = v.type === "multi-day" ? v.startDate : v.date;
      return v.status === "expected" && d === today;
    }).length;

    document.getElementById("stat-upcoming").textContent = all.filter((v) => v.status === "expected").length;
    document.getElementById("stat-completed").textContent = all.filter((v) => v.status === "checked-out").length;
  }

  D.state = state;
  D.renderStats = renderStats;
})();

/* ==========================================================================
   VISITOR CARD TEMPLATES
   ======================================================================== */

(function () {
  "use strict";

  const D = window.RafaraVisitors;
  const H = D.helpers;

  function cardTypeLabel(v) {
    if (v.type === "one-day" && v.oneDaySubType && D.ONE_DAY_TYPE_META[v.oneDaySubType]) {
      return `One-Day · ${D.ONE_DAY_TYPE_META[v.oneDaySubType].label}`;
    }
    return D.VISIT_TYPE_LABELS[v.type];
  }

  function metaRowsForInside(v) {
    const rows = [];
    if (v.type === "multi-day") {
      rows.push(["Checked in", v.activity && v.activity.length ? formatLastCheckIn(v) : "—"]);
      rows.push(["Valid until", H.formatDateShort(v.endDate)]);
    } else {
      rows.push(["Checked in", H.formatTimeFromISO(v.checkedIn)]);
      rows.push(["Visiting", v.host]);
    }
    rows.push(["Pass", v.passReference]);
    return rows;
  }

  function formatLastCheckIn(v) {
    const lastIn = [...(v.activity || [])].reverse().find((a) => a.action === "checked-in");
    if (!lastIn) return "—";
    return H.formatTimeFromHHMM(lastIn.time);
  }

  function metaRowsForUpcoming(v) {
    const rows = [];
    if (v.type === "multi-day") {
      rows.push(["Valid", `${H.formatDateShort(v.startDate)} – ${H.formatDateShort(v.endDate)}`]);
    } else {
      const when = v.date === D.DEMO_TODAY ? "Today" : H.formatDateShort(v.date);
      rows.push(["Expected", `${when}${v.expectedTime ? " · " + H.formatTimeFromHHMM(v.expectedTime) : ""}`]);
    }
    rows.push(["Visiting", v.host]);
    rows.push(["Pass", v.passReference]);
    return rows;
  }

  function actionsForVisitor(v) {
    const btns = [`<button type="button" class="btn btn--ghost btn--sm" data-view-visitor="${v.id}">View Details</button>`];
    if (v.status === "inside") {
      btns.push(`<button type="button" class="btn btn--secondary btn--sm" data-manage-visit="${v.id}">Manage Visit</button>`);
    }
    return btns.join("");
  }

  function visitorCardHtml(v, rows) {
    const typeLabel = cardTypeLabel(v);
    return `
      <article class="visitor-card" data-visitor-id="${v.id}">
        <div class="visitor-card-top">
          <span class="visitor-avatar" aria-hidden="true">${H.initials(v.name)}</span>
          <div class="visitor-card-heading">
            <span class="visitor-card-name">${H.escapeHtml(v.name)}</span>
            <span class="visitor-card-type">${typeLabel}</span>
          </div>
          <span class="badge ${H.statusBadgeClass(v.status)}"><i class="${H.statusIcon(v.status)}" aria-hidden="true"></i>${H.statusLabel(v.status)}</span>
        </div>
        <div class="visitor-card-meta-list">
          ${rows.map(([l, val]) => `<div class="visitor-card-meta-row"><span>${l}</span><span>${H.escapeHtml(val)}</span></div>`).join("")}
        </div>
        <div class="visitor-card-foot">
          <div class="visitor-card-actions">${actionsForVisitor(v)}</div>
        </div>
      </article>`;
  }

  window.RafaraVisitors.cardTemplates = {
    metaRowsForInside,
    metaRowsForUpcoming,
    visitorCardHtml,
    formatLastCheckIn,
    cardTypeLabel
  };
})();

/* ==========================================================================
   FILTERING / SEARCH / SORT + SECTION RENDERING
   ======================================================================== */

(function () {
  "use strict";

  const D = window.RafaraVisitors;
  const H = D.helpers;
  const CT = D.cardTemplates;

  function matchesSearch(v, q) {
    q = q.toLowerCase();
    return (
      (v.name && v.name.toLowerCase().includes(q)) ||
      (v.phone && v.phone.toLowerCase().includes(q)) ||
      (v.passReference && v.passReference.toLowerCase().includes(q)) ||
      (v.host && v.host.toLowerCase().includes(q)) ||
      (D.VISIT_TYPE_LABELS[v.type] && D.VISIT_TYPE_LABELS[v.type].toLowerCase().includes(q))
    );
  }

  function isWithinDateFilter(v, filter) {
    if (filter === "all") return true;
    const primaryDate = v.type === "multi-day" ? v.startDate : v.date;
    if (!primaryDate) return false;
    const today = new Date(D.DEMO_TODAY + "T00:00:00");
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const weekEnd = new Date(today);
    weekEnd.setDate(today.getDate() + 7);
    const d = new Date(primaryDate + "T00:00:00");

    if (filter === "today") return d.getTime() === today.getTime();
    if (filter === "tomorrow") return d.getTime() === tomorrow.getTime();
    if (filter === "week") return d.getTime() >= today.getTime() && d.getTime() <= weekEnd.getTime();
    return true;
  }

  function sortKey(v) {
    if (v.type === "multi-day") return v.startDate;
    return v.date || H.dateFromISO(v.checkedIn) || "";
  }

  function arrivalKey(v) {
    if (v.checkedIn) return v.checkedIn;
    if (v.expectedTime) return `${v.date || ""}T${v.expectedTime}`;
    if (v.startDate) return `${v.startDate}T00:00`;
    return "";
  }

  function applyCommonFilters(list) {
    let out = list;
    if (D.state.search.trim()) out = out.filter((v) => matchesSearch(v, D.state.search.trim()));
    if (D.state.type !== "all") out = out.filter((v) => v.type === D.state.type);
    if (D.state.date !== "all") out = out.filter((v) => isWithinDateFilter(v, D.state.date));
    return out;
  }

  function applySort(list) {
    const sorted = list.slice();
    if (D.state.sort === "newest") {
      sorted.sort((a, b) => new Date(sortKey(b)) - new Date(sortKey(a)));
    } else if (D.state.sort === "oldest") {
      sorted.sort((a, b) => new Date(sortKey(a)) - new Date(sortKey(b)));
    } else if (D.state.sort === "arrival") {
      sorted.sort((a, b) => new Date(arrivalKey(a)) - new Date(arrivalKey(b)));
    } else if (D.state.sort === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    return sorted;
  }

  /* ---------- Currently Inside ---------- */
  function renderInside() {
    const grid = document.getElementById("inside-visitors-grid");
    const label = document.getElementById("inside-count-label");

    let list = D.visitors.filter((v) => v.status === "inside");
    if (D.state.status !== "all" && D.state.status !== "inside") {
      grid.innerHTML = "";
      label.textContent = "";
      return;
    }
    list = applyCommonFilters(list);
    list = applySort(list);

    label.textContent = list.length ? `${list.length} visitor${list.length === 1 ? "" : "s"} inside` : "";

    if (!list.length) {
      const noneAtAll = D.visitors.filter((v) => v.status === "inside").length === 0;
      grid.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-user-group" aria-hidden="true"></i>
          <strong>${noneAtAll ? "No Visitors Inside" : "No Visitors Found"}</strong>
          <span>${noneAtAll
            ? "There are currently no active visitors associated with your household."
            : "Try adjusting your search or filters."}</span>
          ${noneAtAll ? `<button type="button" class="btn btn--primary" data-open-modal="modal-visitor-type">Create Visitor Pass</button>` : ""}
        </div>`;
      return;
    }

    grid.innerHTML = list.map((v) => CT.visitorCardHtml(v, CT.metaRowsForInside(v))).join("");
  }

  /* ---------- Upcoming Visitors ---------- */
  function renderUpcoming() {
    const grid = document.getElementById("upcoming-visitors-grid");

    let list = D.visitors.filter((v) => v.status === "expected");
    if (D.state.status !== "all" && D.state.status !== "expected") {
      grid.innerHTML = "";
      return;
    }
    list = applyCommonFilters(list);
    list = applySort(list);

    if (!list.length) {
      const noneAtAll = D.visitors.filter((v) => v.status === "expected").length === 0;
      grid.innerHTML = `
        <div class="empty-state">
          <i class="fa-regular fa-calendar" aria-hidden="true"></i>
          <strong>${noneAtAll ? "No Upcoming Visitors" : "No Visitors Found"}</strong>
          <span>${noneAtAll ? "Visitors expected to arrive will appear here." : "Try adjusting your search or filters."}</span>
        </div>`;
      return;
    }

    grid.innerHTML = list.map((v) => CT.visitorCardHtml(v, CT.metaRowsForUpcoming(v))).join("");
  }

  /* ---------- Visit History ---------- */
  function historyRow(v) {
    const entry = v.type === "multi-day"
      ? (v.activity && v.activity.length ? H.formatTimeFromHHMM(v.activity[0].time) : "—")
      : H.formatTimeFromISO(v.checkedIn);
    const exit = v.type === "multi-day"
      ? (v.activity && v.activity.length ? H.formatTimeFromHHMM(v.activity[v.activity.length - 1].time) : "—")
      : H.formatTimeFromISO(v.checkedOut);

    return { entry, exit };
  }

  function renderHistory() {
    const wrap = document.getElementById("history-table-wrap");

    let list = D.visitors.filter((v) => v.status === "checked-out");
    if (D.state.status !== "all" && D.state.status !== "checked-out") {
      wrap.innerHTML = "";
      return;
    }
    list = applyCommonFilters(list);
    list = applySort(list);

    if (!list.length) {
      const noneAtAll = D.visitors.filter((v) => v.status === "checked-out").length === 0;
      wrap.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-box-archive" aria-hidden="true"></i>
          <strong>${noneAtAll ? "No Visit History" : "No Visitors Found"}</strong>
          <span>${noneAtAll
            ? "Completed visits will appear here after your visitors leave the estate."
            : "Try adjusting your search or filters."}</span>
        </div>`;
      return;
    }

    const rowsHtml = list
      .map((v) => {
        const { entry, exit } = historyRow(v);
        return `
        <tr data-visitor-id="${v.id}">
          <td>
            <div class="history-visitor-cell">
              <span class="visitor-avatar" aria-hidden="true" style="width:30px;height:30px;font-size:11px;">${H.initials(v.name)}</span>
              ${H.escapeHtml(v.name)}
            </div>
          </td>
          <td>${CT.cardTypeLabel(v)}</td>
          <td>${entry || "—"}</td>
          <td>${exit || "—"}</td>
          <td><span class="badge ${H.statusBadgeClass(v.status)}"><i class="${H.statusIcon(v.status)}" aria-hidden="true"></i>${H.statusLabel(v.status)}</span></td>
          <td><button type="button" class="btn btn--ghost btn--sm" data-view-visitor="${v.id}">View Details</button></td>
        </tr>`;
      })
      .join("");

    const cardsHtml = list
      .map((v) => {
        const { entry, exit } = historyRow(v);
        return `
        <div class="history-card" data-visitor-id="${v.id}">
          <div class="history-card-top">
            <div class="visitor-card-heading">
              <span class="visitor-card-name">${H.escapeHtml(v.name)}</span>
              <span class="visitor-card-type">${CT.cardTypeLabel(v)}</span>
            </div>
            <span class="badge ${H.statusBadgeClass(v.status)}"><i class="${H.statusIcon(v.status)}" aria-hidden="true"></i>${H.statusLabel(v.status)}</span>
          </div>
          <div class="history-card-meta">
            <span>Entry: <strong>${entry || "—"}</strong></span>
            <span>Exit: <strong>${exit || "—"}</strong></span>
          </div>
          <button type="button" class="btn btn--ghost btn--sm" data-view-visitor="${v.id}">View Details</button>
        </div>`;
      })
      .join("");

    wrap.innerHTML = `
      <table class="history-table">
        <thead>
          <tr>
            <th scope="col">Visitor</th>
            <th scope="col">Type</th>
            <th scope="col">Entry</th>
            <th scope="col">Exit</th>
            <th scope="col">Status</th>
            <th scope="col"><span class="visually-hidden">Actions</span></th>
          </tr>
        </thead>
        <tbody>${rowsHtml}</tbody>
      </table>
      <div class="history-card-list">${cardsHtml}</div>
    `;
  }

  function renderAll() {
    D.renderStats();
    renderInside();
    renderUpcoming();
    renderHistory();
  }

  D.render = renderAll;
  D.renderInside = renderInside;
  D.renderUpcoming = renderUpcoming;
  D.renderHistory = renderHistory;

  document.addEventListener("DOMContentLoaded", renderAll);
})();

/* ==========================================================================
   FILTER CONTROLS WIRING
   ======================================================================== */

(function () {
  "use strict";
  const D = window.RafaraVisitors;

  const searchInput = document.getElementById("visitor-search");
  const statusSelect = document.getElementById("filter-status");
  const typeSelect = document.getElementById("filter-type");
  const dateSelect = document.getElementById("filter-date");
  const sortSelect = document.getElementById("filter-sort");

  let debounceTimer = null;
  searchInput.addEventListener("input", (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      D.state.search = e.target.value;
      D.render();
    }, 150);
  });

  statusSelect.addEventListener("change", (e) => {
    D.state.status = e.target.value;
    D.render();
  });
  typeSelect.addEventListener("change", (e) => {
    D.state.type = e.target.value;
    D.render();
  });
  dateSelect.addEventListener("change", (e) => {
    D.state.date = e.target.value;
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

  window.RafaraVisitors.toast = showToast;
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

  window.RafaraVisitors.modal = { open: openModal, close: closeModal };
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

  window.RafaraVisitors.closeAllDropdowns = closeAllDropdowns;
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
    window.RafaraVisitors.modal.open("modal-visitor-type");
  });

  document.getElementById("mobile-logout-btn").addEventListener("click", () => {
    closeSheet();
    window.RafaraVisitors.modal.open("modal-logout");
  });
})();

/* ==========================================================================
   HEADER "CREATE VISITOR PASS" + LOGOUT
   ======================================================================== */

(function () {
  "use strict";
  const M = window.RafaraVisitors.modal;

  document.getElementById("create-visitor-pass-btn").addEventListener("click", () => {
    M.open("modal-visitor-type");
  });

  document.getElementById("logout-btn").addEventListener("click", () => M.open("modal-logout"));
  document.getElementById("dropdown-logout-btn").addEventListener("click", () => {
    window.RafaraVisitors.closeAllDropdowns();
    M.open("modal-logout");
  });

  document.getElementById("confirm-logout-btn").addEventListener("click", () => {
    window.RafaraVisitors.toast("Logging you out…", "fa-arrow-right-from-bracket");
    setTimeout(() => {
      window.location.href = "resident-login.html";
    }, 700);
  });
})();

/* ==========================================================================
   FORM SUBMISSIONS — MULTI-DAY VISITOR PASS (mock, frontend only)
   (One-Day Pass now runs through the dedicated multi-step flow below.)
   ======================================================================== */

(function () {
  "use strict";

  const D = window.RafaraVisitors;
  const H = D.helpers;
  const M = D.modal;

  function resetAndClose(form, modalId) {
    form.reset();
    M.close(document.getElementById(modalId));
  }

  document.getElementById("form-multi-day").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form["md-name"].value.trim();
    const start = form["md-start"].value;
    const end = form["md-end"].value;
    const phone = form["md-phone"].value.trim();
    if (!name || !start || !end || !phone) return;

    D.addVisitor({
      id: D.nextVisitorId(),
      name,
      phone,
      type: "multi-day",
      host: D.resident.fullName,
      passReference: `RFP-2${Math.floor(1000 + Math.random() * 8999)}`,
      status: "expected",
      startDate: start,
      endDate: end,
      activity: []
    });

    D.render();
    resetAndClose(form, "modal-multi-day");
    D.toast("Visitor pass created.", "fa-circle-check");
  });
})();

/* ==========================================================================
   ONE-DAY VISITOR PASS — PASS TYPE SELECTION → DYNAMIC FORM →
   REVIEW → GENERATE (mock, frontend only)
   ======================================================================== */

(function () {
  "use strict";

  const D = window.RafaraVisitors;
  const H = D.helpers;
  const M = D.modal;
  const META = D.ONE_DAY_TYPE_META;

  const odState = {
    type: null,
    formData: null
  };

  function val(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : "";
  }

  function collectFormData(type) {
    if (type === "regular") {
      return {
        name: val("od-r-name"),
        phone: val("od-r-phone"),
        date: val("od-r-date"),
        arrival: val("od-r-arrival"),
        purpose: val("od-r-purpose"),
        vehicle: val("od-r-vehicle")
      };
    }
    if (type === "ride") {
      return {
        name: val("od-k-name"),
        phone: val("od-k-phone"),
        service: val("od-k-service"),
        vehicleType: val("od-k-vehicle-type"),
        plate: val("od-k-plate"),
        arrival: val("od-k-arrival"),
        direction: val("od-k-direction"),
        note: val("od-k-note")
      };
    }
    if (type === "delivery") {
      return {
        name: val("od-d-name"),
        phone: val("od-d-phone"),
        platform: val("od-d-platform"),
        deliveryType: val("od-d-type"),
        vehicle: val("od-d-vehicle"),
        arrival: val("od-d-arrival"),
        recipient: val("od-d-recipient"),
        note: val("od-d-note")
      };
    }
    return {};
  }

  const REQUIRED_FIELDS = {
    regular: ["name", "phone", "date", "arrival", "purpose"],
    ride: ["name", "phone", "service", "vehicleType", "plate", "arrival", "direction"],
    delivery: ["name", "phone", "platform", "deliveryType", "arrival", "recipient"]
  };

  function validateFormData(type, data) {
    return (REQUIRED_FIELDS[type] || []).every((key) => data[key]);
  }

  function reviewRowsHtml(type, data) {
    const rows = [];
    if (type === "regular") {
      rows.push(["Visitor", data.name]);
      rows.push(["Phone", data.phone]);
      rows.push(["Date of visit", H.formatDate(data.date)]);
      if (data.arrival) rows.push(["Expected arrival", H.formatTimeFromHHMM(data.arrival)]);
      rows.push(["Purpose", data.purpose]);
      if (data.vehicle) rows.push(["Vehicle", data.vehicle]);
    } else if (type === "ride") {
      rows.push(["Driver/rider", data.name]);
      rows.push(["Phone", data.phone]);
      rows.push(["Service", data.service]);
      rows.push(["Vehicle type", data.vehicleType]);
      rows.push(["Plate number", data.plate]);
      if (data.arrival) rows.push(["Expected arrival", H.formatTimeFromHHMM(data.arrival)]);
      rows.push(["Pickup/Drop-off", data.direction]);
      if (data.note) rows.push(["Note", data.note]);
    } else if (type === "delivery") {
      rows.push(["Delivery person", data.name]);
      rows.push(["Phone", data.phone]);
      rows.push(["Platform", data.platform]);
      rows.push(["Delivery type", data.deliveryType]);
      if (data.vehicle) rows.push(["Vehicle/plate", data.vehicle]);
      if (data.arrival) rows.push(["Expected arrival", H.formatTimeFromHHMM(data.arrival)]);
      rows.push(["Recipient", data.recipient]);
      if (data.note) rows.push(["Note", data.note]);
    }
    return rows
      .map(([l, v]) => `<div class="details-row"><span>${l}</span><span>${H.escapeHtml(v || "—")}</span></div>`)
      .join("");
  }

  function goToStep(step) {
    document.querySelectorAll(".od-step").forEach((el) => (el.hidden = true));
    document.getElementById(`od-step-${step}`).hidden = false;
    setBackHandler(step);
  }

  function setBackHandler(step) {
    const backBtn = document.getElementById("od-back-btn");
    if (step === "type") {
      backBtn.hidden = false;
      backBtn.onclick = () => M.open("modal-visitor-type");
    } else if (step === "form") {
      backBtn.hidden = false;
      backBtn.onclick = () => goToStep("type");
    } else if (step === "review") {
      backBtn.hidden = false;
      backBtn.onclick = () => goToStep("form");
    } else if (step === "generated") {
      backBtn.hidden = true;
    }
  }

  function renderTypeBanner() {
    const meta = META[odState.type];
    document.getElementById("od-type-banner").innerHTML =
      `<span class="pass-type-badge"><i class="${meta.icon}" aria-hidden="true"></i> ${meta.label.toUpperCase()}</span>`;
  }

  function showFieldGroupFor(type) {
    document.querySelectorAll("[data-od-fields]").forEach((group) => {
      group.hidden = group.getAttribute("data-od-fields") !== type;
    });
  }

  function resetOneDayFlow() {
    odState.type = null;
    odState.formData = null;
    const form = document.getElementById("od-step-form");
    form.reset();
    document.getElementById("od-form-error").hidden = true;
    document.querySelectorAll("[data-od-fields]").forEach((g) => (g.hidden = true));
    goToStep("type");
  }

  function renderReview() {
    const meta = META[odState.type];
    document.getElementById("od-review-body").innerHTML = `
      <span class="pass-type-badge"><i class="${meta.icon}" aria-hidden="true"></i> ${meta.label.toUpperCase()}</span>
      <div class="od-review-card" style="margin-top:14px;">
        ${reviewRowsHtml(odState.type, odState.formData)}
      </div>`;
  }

  function renderGeneratedPass(v) {
    const meta = META[v.oneDaySubType];
    document.getElementById("od-generated-body").innerHTML = `
      <div class="generated-pass">
        <span class="pass-type-badge"><i class="${meta.icon}" aria-hidden="true"></i> ${meta.label.toUpperCase()}</span>
        <h3 class="generated-pass-name">${H.escapeHtml(v.name)}</h3>
        <p class="generated-pass-sub">One-Day Visitor Pass · ${H.formatDate(v.date)}</p>
        <div class="generated-pass-qr" aria-hidden="true"><i class="fa-solid fa-qrcode"></i></div>
        <p class="generated-pass-code-label">4-digit verification code</p>
        <div class="generated-pass-code">${v.verificationCode}</div>
        <div class="od-review-card" style="text-align:left; margin-top:18px;">
          <div class="details-row"><span>Pass reference</span><span>${v.passReference}</span></div>
          ${reviewRowsHtml(v.oneDaySubType, v.oneDayDetails)}
        </div>
        <p class="details-note" style="margin-top:14px; text-align:left;">
          <i class="fa-solid fa-circle-info" aria-hidden="true"></i>
          Valid for one day only. This is demo data and has not been verified by a backend.
        </p>
      </div>`;
  }

  // Reset the flow to Step 1 every time it's opened fresh from the
  // "Create Visitor Pass" → "One-Day Visitor" option.
  document.querySelectorAll('[data-open-modal="modal-one-day"]').forEach((btn) => {
    btn.addEventListener("click", resetOneDayFlow);
  });

  // Step 1 → Step 2: choosing a pass type
  document.querySelectorAll("#od-step-type [data-od-type]").forEach((card) => {
    card.addEventListener("click", () => {
      const newType = card.getAttribute("data-od-type");
      odState.type = newType;
      odState.formData = null;

      // Reset the dynamic form so fields from a previously selected
      // type are never carried over or submitted by mistake.
      document.getElementById("od-step-form").reset();
      document.getElementById("od-form-error").hidden = true;

      showFieldGroupFor(newType);
      renderTypeBanner();
      goToStep("form");
    });
  });

  // Step 2 → Step 3: submitting the dynamic form
  document.getElementById("od-step-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = collectFormData(odState.type);
    if (!validateFormData(odState.type, data)) {
      document.getElementById("od-form-error").hidden = false;
      return;
    }
    document.getElementById("od-form-error").hidden = true;
    odState.formData = data;
    renderReview();
    goToStep("review");
  });

  // Step 3: edit details → back to Step 2 (keeps entered values)
  document.getElementById("od-review-edit-btn").addEventListener("click", () => {
    goToStep("form");
  });

  // Step 3 → Step 4: generate the pass
  document.getElementById("od-generate-btn").addEventListener("click", () => {
    const type = odState.type;
    const data = odState.formData;
    if (!type || !data) return;

    const passReference = `RFP-2${Math.floor(1000 + Math.random() * 8999)}`;
    const verificationCode = String(Math.floor(1000 + Math.random() * 9000)).padStart(4, "0");
    // Regular visitors pick their own visit date; Ride/Delivery passes are
    // same-day by nature, so they follow the existing one-day validity
    // rules using today's date — no separate validity system is created.
    const visitDate = type === "regular" && data.date ? data.date : D.DEMO_TODAY;

    const visitor = {
      id: D.nextVisitorId(),
      name: data.name,
      phone: data.phone,
      type: "one-day",
      oneDaySubType: type,
      host: D.resident.fullName,
      passReference,
      verificationCode,
      status: "expected",
      date: visitDate,
      expectedTime: data.arrival || "",
      checkedIn: null,
      checkedOut: null,
      oneDayDetails: data
    };

    D.addVisitor(visitor);
    D.render();
    renderGeneratedPass(visitor);
    goToStep("generated");
    D.toast("One-day pass generated.", "fa-circle-check");
  });
})();

/* ==========================================================================
   VISITOR DETAILS MODAL
   ======================================================================== */

(function () {
  "use strict";

  const D = window.RafaraVisitors;
  const H = D.helpers;
  const M = D.modal;
  const META = D.ONE_DAY_TYPE_META;

  function detailRow(label, value) {
    return `<div class="details-row"><span>${label}</span><span>${value}</span></div>`;
  }

  function statusBadgeHtml(status) {
    return `<span class="badge ${H.statusBadgeClass(status)}"><i class="${H.statusIcon(status)}" aria-hidden="true"></i>${H.statusLabel(status)}</span>`;
  }

  function passTypeBadgeHtml(v) {
    if (v.type !== "one-day" || !v.oneDaySubType || !META[v.oneDaySubType]) return null;
    const meta = META[v.oneDaySubType];
    return `<span class="pass-type-badge"><i class="${meta.icon}" aria-hidden="true"></i> ${meta.label.toUpperCase()}</span>`;
  }

  function oneDaySubTypeDetailsHtml(v) {
    if (v.type !== "one-day" || !v.oneDayDetails) return "";
    const d = v.oneDayDetails;
    const rows = [];
    if (v.oneDaySubType === "regular") {
      if (d.purpose) rows.push(detailRow("Purpose", H.escapeHtml(d.purpose)));
      if (d.vehicle) rows.push(detailRow("Vehicle", H.escapeHtml(d.vehicle)));
    } else if (v.oneDaySubType === "ride") {
      if (d.service) rows.push(detailRow("Service", H.escapeHtml(d.service)));
      if (d.vehicleType) rows.push(detailRow("Vehicle type", H.escapeHtml(d.vehicleType)));
      if (d.plate) rows.push(detailRow("Plate number", H.escapeHtml(d.plate)));
      if (d.direction) rows.push(detailRow("Pickup/Drop-off", H.escapeHtml(d.direction)));
      if (d.note) rows.push(detailRow("Note", H.escapeHtml(d.note)));
    } else if (v.oneDaySubType === "delivery") {
      if (d.platform) rows.push(detailRow("Platform", H.escapeHtml(d.platform)));
      if (d.deliveryType) rows.push(detailRow("Delivery type", H.escapeHtml(d.deliveryType)));
      if (d.vehicle) rows.push(detailRow("Vehicle/plate", H.escapeHtml(d.vehicle)));
      if (d.recipient) rows.push(detailRow("Recipient", H.escapeHtml(d.recipient)));
      if (d.note) rows.push(detailRow("Note", H.escapeHtml(d.note)));
    }
    if (!rows.length) return "";
    return `
      <div class="details-section">
        <div class="details-section-title">Pass Type Details</div>
        ${rows.join("")}
      </div>`;
  }

  function activityTimelineHtml(activity) {
    if (!activity || !activity.length) {
      return `<p class="details-note"><i class="fa-solid fa-circle-info" aria-hidden="true"></i> No check-in activity recorded yet.</p>`;
    }
    return `
      <div class="visit-timeline">
        ${activity
          .map((a, i) => {
            const isLast = i === activity.length - 1;
            const isOut = a.action === "checked-out";
            const label = isOut ? "Checked Out" : "Checked In";
            const dateLabel = H.formatDateShort(a.date);
            return `
            <div class="visit-timeline-item">
              <div class="visit-timeline-marker">
                <span class="visit-timeline-dot ${isOut ? "visit-timeline-dot--out" : ""}" aria-hidden="true"></span>
                ${isLast ? "" : `<span class="visit-timeline-line" aria-hidden="true"></span>`}
              </div>
              <div class="visit-timeline-body">
                <strong>${dateLabel} · ${H.formatTimeFromHHMM(a.time)}</strong>
                <span>${label}</span>
              </div>
            </div>`;
          })
          .join("")}
      </div>`;
  }

  function passValidityHtml(v) {
    if (v.type === "multi-day") {
      return `${H.formatDate(v.startDate)} – ${H.formatDate(v.endDate)}`;
    }
    return H.formatDate(v.date);
  }

  function openVisitorDetails(visitorId) {
    const v = D.findVisitor(visitorId);
    if (!v) return;

    const typeBadge = passTypeBadgeHtml(v);

    document.getElementById("modal-details-title").textContent = v.name;
    document.getElementById("modal-details-body").innerHTML = `
      <div class="details-section">
        <div class="details-section-title">Visitor Information</div>
        ${detailRow("Name", H.escapeHtml(v.name))}
        ${detailRow("Phone", H.escapeHtml(v.phone || "—"))}
        ${detailRow("Visit Type", D.VISIT_TYPE_LABELS[v.type])}
        ${typeBadge ? detailRow("Pass Type", typeBadge) : ""}
        ${detailRow("Host", H.escapeHtml(v.host || D.resident.fullName))}
        ${detailRow("Pass Reference", v.passReference)}
        ${v.verificationCode ? detailRow("Verification Code", v.verificationCode) : ""}
      </div>
      <div class="details-section">
        <div class="details-section-title">Visit Status</div>
        ${detailRow("Current status", statusBadgeHtml(v.status))}
      </div>
      <div class="details-section">
        <div class="details-section-title">Pass Validity</div>
        ${detailRow(v.type === "multi-day" ? "Valid" : "Visit date", passValidityHtml(v))}
      </div>
      ${oneDaySubTypeDetailsHtml(v)}
      <div class="details-section">
        <div class="details-section-title">Visit Activity</div>
        ${v.type === "multi-day"
          ? activityTimelineHtml(v.activity)
          : activityTimelineHtml(
              v.checkedIn
                ? [
                    { action: "checked-in", date: H.dateFromISO(v.checkedIn), time: new Date(v.checkedIn).toTimeString().slice(0, 5) },
                    ...(v.checkedOut
                      ? [{ action: "checked-out", date: H.dateFromISO(v.checkedOut), time: new Date(v.checkedOut).toTimeString().slice(0, 5) }]
                      : [])
                  ]
                : []
            )}
      </div>
      <p class="details-note" style="margin-top:6px;"><i class="fa-solid fa-circle-info" aria-hidden="true"></i> This visitor record is demo data and has not been verified by a backend.</p>
    `;
    M.open("modal-details");
    D.toast("Visitor details opened.", "fa-user");
  }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-view-visitor]");
    if (btn) openVisitorDetails(btn.getAttribute("data-view-visitor"));
  });
})();

/* ==========================================================================
   MANAGE VISIT
   ======================================================================== */

(function () {
  "use strict";
  const D = window.RafaraVisitors;
  const H = D.helpers;
  const M = D.modal;

  let managingVisitorId = null;

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-manage-visit]");
    if (btn) {
      managingVisitorId = btn.getAttribute("data-manage-visit");
      const v = D.findVisitor(managingVisitorId);
      if (!v) return;
      document.getElementById("manage-visitor-name").textContent = v.name;
      document.getElementById("manage-visitor-status").textContent = H.statusLabel(v.status);
      document.getElementById("manage-visitor-valid").textContent =
        v.type === "multi-day" ? H.formatDate(v.endDate) : H.formatDate(v.date);

      // Only multi-day visitors can be extended
      document.getElementById("manage-extend-btn").hidden = v.type !== "multi-day";
      M.open("modal-manage-visit");
    }
  });

  document.getElementById("manage-extend-btn").addEventListener("click", () => {
    if (!managingVisitorId) return;
    const v = D.findVisitor(managingVisitorId);
    if (!v || v.type !== "multi-day") return;
    M.close(document.getElementById("modal-manage-visit"));
    document.getElementById("extend-current-end").value = H.formatDate(v.endDate);
    document.getElementById("extend-date").value = "";
    document.getElementById("extend-error").hidden = true;
    M.open("modal-extend");
  });

  document.getElementById("manage-end-btn").addEventListener("click", () => {
    if (!managingVisitorId) return;
    M.close(document.getElementById("modal-manage-visit"));
    M.open("modal-end-visit");
  });

  window.RafaraVisitorsManageState = {
    get id() { return managingVisitorId; },
    clear() { managingVisitorId = null; }
  };
})();

/* ==========================================================================
   EXTEND MULTI-DAY VISIT
   ======================================================================== */

(function () {
  "use strict";
  const D = window.RafaraVisitors;
  const H = D.helpers;
  const M = D.modal;

  document.getElementById("form-extend").addEventListener("submit", (e) => {
    e.preventDefault();
    const managingId = window.RafaraVisitorsManageState.id;
    if (!managingId) return;
    const v = D.findVisitor(managingId);
    if (!v) return;

    const newEnd = document.getElementById("extend-date").value;
    const errorEl = document.getElementById("extend-error");

    if (!newEnd || new Date(newEnd) <= new Date(v.endDate)) {
      errorEl.hidden = false;
      return;
    }
    errorEl.hidden = true;

    v.endDate = newEnd;
    v.status = "inside";

    D.render();
    e.target.reset();
    M.close(document.getElementById("modal-extend"));
    D.toast("Visit extended successfully.", "fa-circle-check");
    window.RafaraVisitorsManageState.clear();
  });
})();

/* ==========================================================================
   END VISIT
   ======================================================================== */

(function () {
  "use strict";
  const D = window.RafaraVisitors;
  const H = D.helpers;
  const M = D.modal;

  document.getElementById("confirm-end-visit-btn").addEventListener("click", () => {
    const managingId = window.RafaraVisitorsManageState.id;
    if (!managingId) return;
    const v = D.findVisitor(managingId);
    if (v) {
      const now = new Date().toISOString();
      v.status = "checked-out";
      if (v.type === "multi-day") {
        v.activity = v.activity || [];
        v.activity.push({ action: "checked-out", date: H.todayISO(), time: new Date().toTimeString().slice(0, 5) });
      } else {
        v.checkedOut = now;
      }
    }
    D.render();
    M.close(document.getElementById("modal-end-visit"));
    D.toast("Visit ended successfully.", "fa-circle-check");
    window.RafaraVisitorsManageState.clear();
  });
})();
