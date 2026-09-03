/* =========================================================
   RAFARA GATEPASS — SECURITY VISITORS PAGE
   Frontend-only demo logic. Reuses window.RafaraSecurity from
   security-dashboard.js for the shared shell (sidebar drawer,
   dropdowns, mobile sheet, logout, notifications badge).
   ========================================================= */

(function () {
  "use strict";

  window.RafaraSecurity = window.RafaraSecurity || {};
  const NS = window.RafaraSecurity;

  /* =======================================================
     MOCK DATA
     ======================================================= */

  const VISITORS = [
    {
      id: "v1",
      visitor: "Aisha Bello",
      phone: "0803 214 7765",
      resident: "Rahmah Ogunlaja",
      unit: "B8-F5",
      passType: "One-Day Visitor",
      passCode: "2048",
      passValidity: "Today, until 8:00 PM",
      arrival: "10:30 AM",
      checkIn: "10:42 AM",
      checkOut: null,
      officer: "Emeka Nwosu",
      status: "inside",
      history: [
        { icon: "fa-shield-halved", tone: "success", title: "Pass verified", time: "10:41 AM" },
        { icon: "fa-door-open", tone: "success", title: "Entry granted", time: "10:42 AM" },
        { icon: "fa-hourglass-half", tone: "", title: "Currently inside", time: "" }
      ]
    },
    {
      id: "v2",
      visitor: "Ibrahim Musa",
      phone: "0807 552 9013",
      resident: "T. Adeyemi",
      unit: "BA-F12",
      passType: "Multi-Day Visitor",
      passCode: "1832",
      passValidity: "Valid through Sat, 6 Sep",
      arrival: "9:45 AM",
      checkIn: null,
      checkOut: null,
      officer: null,
      status: "expected",
      history: [
        { icon: "fa-id-card", tone: "", title: "Pass issued by resident", time: "Yesterday, 4:12 PM" }
      ]
    },
    {
      id: "v3",
      visitor: "David Adeyemi",
      phone: "0701 883 4420",
      resident: "K. Johnson",
      unit: "BA1-F7",
      passType: "One-Day Visitor",
      passCode: "1721",
      passValidity: "Today, until 6:00 PM",
      arrival: "8:20 AM",
      checkIn: "8:24 AM",
      checkOut: "10:18 AM",
      officer: "Emeka Nwosu",
      status: "checkedout",
      history: [
        { icon: "fa-shield-halved", tone: "success", title: "Pass verified", time: "8:23 AM" },
        { icon: "fa-door-open", tone: "success", title: "Entry granted", time: "8:24 AM" },
        { icon: "fa-right-from-bracket", tone: "", title: "Exit recorded", time: "10:18 AM" }
      ]
    },
    {
      id: "v4",
      visitor: "Fathia Ismail",
      phone: "0906 471 2298",
      resident: "S. Bello",
      unit: "B20-F5",
      passType: "One-Day Visitor",
      passCode: "3390",
      passValidity: "Expired today, 9:00 AM",
      arrival: "11:05 AM",
      checkIn: null,
      checkOut: null,
      officer: "Chidinma Obi",
      status: "denied",
      history: [
        { icon: "fa-circle-xmark", tone: "danger", title: "Access denied — pass expired", time: "11:05 AM" }
      ]
    },
    {
      id: "v5",
      visitor: "Grace Nnamdi",
      phone: "0812 004 5581",
      resident: "K. Balogun",
      unit: "B11-F3",
      passType: "One-Day Visitor",
      passCode: "1655",
      passValidity: "Expired today, 10:00 AM",
      arrival: "12:15 PM",
      checkIn: null,
      checkOut: null,
      officer: "Emeka Nwosu",
      status: "denied",
      history: [
        { icon: "fa-circle-xmark", tone: "danger", title: "Access denied — pass expired", time: "9:20 AM" }
      ]
    },
    {
      id: "v6",
      visitor: "Samuel Iortyer",
      phone: "0813 662 7714",
      resident: "N. Chukwu",
      unit: "B4-F2",
      passType: "Multi-Day Visitor",
      passCode: "0965",
      passValidity: "Valid through Fri, 5 Sep",
      arrival: "9:50 AM",
      checkIn: "9:58 AM",
      checkOut: null,
      officer: "Emeka Nwosu",
      status: "inside",
      history: [
        { icon: "fa-shield-halved", tone: "success", title: "Pass verified", time: "9:57 AM" },
        { icon: "fa-door-open", tone: "success", title: "Entry granted", time: "9:58 AM" },
        { icon: "fa-hourglass-half", tone: "", title: "Currently inside", time: "" }
      ]
    },
    {
      id: "v7",
      visitor: "Chuka Okafor",
      phone: "0705 118 3302",
      resident: "F. Eze",
      unit: "BA1-F7",
      passType: "Ride / Delivery",
      passCode: "2277",
      passValidity: "Today, until 1:30 PM",
      arrival: "1:00 PM",
      checkIn: null,
      checkOut: null,
      officer: null,
      status: "expected",
      history: [
        { icon: "fa-id-card", tone: "", title: "Pass issued by resident", time: "Today, 8:05 AM" }
      ]
    },
    {
      id: "v8",
      visitor: "Uche Eze",
      phone: "0909 227 6641",
      resident: "F. Eze",
      unit: "BA1-F7",
      passType: "Artisan",
      passCode: "4410",
      passValidity: "Today, until 5:00 PM",
      arrival: "8:00 AM",
      checkIn: "8:05 AM",
      checkOut: "3:18 PM",
      officer: "Chidinma Obi",
      status: "checkedout",
      history: [
        { icon: "fa-shield-halved", tone: "success", title: "Pass verified", time: "8:04 AM" },
        { icon: "fa-door-open", tone: "success", title: "Entry granted", time: "8:05 AM" },
        { icon: "fa-right-from-bracket", tone: "", title: "Exit recorded", time: "3:18 PM" }
      ]
    },
    {
      id: "v9",
      visitor: "Blessing Umeh",
      phone: "0814 390 5527",
      resident: "R. Ogunlaja",
      unit: "B8-F5",
      passType: "Property Exit",
      passCode: "5502",
      passValidity: "Today, until 7:00 PM",
      arrival: "2:30 PM",
      checkIn: null,
      checkOut: null,
      officer: null,
      status: "expected",
      history: [
        { icon: "fa-id-card", tone: "", title: "Pass issued by resident", time: "Today, 7:40 AM" }
      ]
    }
  ];

  const STATS = {
    expectedToday: 24,
    inside: 12,
    checkedOutToday: 31,
    deniedToday: 2
  };

  const STATUS_META = {
    expected: { label: "Expected", cls: "badge--checkedin", icon: "fa-clock" },
    inside: { label: "Inside", cls: "badge--active", icon: "fa-door-open" },
    checkedout: { label: "Checked Out", cls: "badge--checkedout", icon: "fa-right-from-bracket" },
    denied: { label: "Denied", cls: "badge--denied", icon: "fa-ban" }
  };

  NS.VISITORS_DATA = VISITORS;

  /* =======================================================
     STATE
     ======================================================= */

  const state = {
    query: "",
    status: "all",
    passType: "all",
    date: ""
  };

  /* =======================================================
     HELPERS
     ======================================================= */

  function initials(name) {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map(word => word[0].toUpperCase())
      .join("");
  }

  function statusBadge(status) {
    const meta = STATUS_META[status] || { label: status, cls: "badge--checkedout", icon: "fa-circle" };
    return `
      <span class="badge ${meta.cls}">
        <i class="fa-solid ${meta.icon}" aria-hidden="true"></i>
        ${meta.label}
      </span>
    `;
  }

  function matchesFilters(visitor) {
    if (state.status !== "all" && visitor.status !== state.status) return false;
    if (state.passType !== "all" && visitor.passType !== state.passType) return false;

    if (state.query) {
      const haystack = [
        visitor.visitor,
        visitor.resident,
        visitor.unit,
        visitor.passCode
      ].join(" ").toLowerCase();

      if (!haystack.includes(state.query.toLowerCase())) return false;
    }

    // Date filter is a demo-only stand-in: this mock dataset only models
    // "today", so any explicit date pick just narrows to visitors with data.
    if (state.date && !visitor.arrival) return false;

    return true;
  }

  function filteredVisitors() {
    return VISITORS.filter(matchesFilters);
  }

  /* =======================================================
     STATS
     ======================================================= */

  function renderStats() {
    const grid = document.getElementById("visitor-stats-grid");
    if (!grid) return;

    const cards = [
      {
        icon: "fa-user-clock",
        iconClass: "stat-icon--upcoming",
        value: STATS.expectedToday,
        label: "Expected Today",
        context: "Visitors expected today"
      },
      {
        icon: "fa-door-open",
        iconClass: "stat-icon--inside",
        value: STATS.inside,
        label: "Inside",
        context: "Currently inside"
      },
      {
        icon: "fa-right-from-bracket",
        iconClass: "stat-icon--passes",
        value: STATS.checkedOutToday,
        label: "Checked Out",
        context: "Checked out today"
      },
      {
        icon: "fa-ban",
        iconClass: "stat-icon--pending",
        value: STATS.deniedToday,
        label: "Denied",
        context: "Access denied today"
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
     ACTION BUTTON PER STATUS
     ======================================================= */

  function actionLabel(status) {
    if (status === "expected") return "View";
    if (status === "inside") return "View";
    return "View";
  }

  /* =======================================================
     TABLE / LIST
     ======================================================= */

  function emptyStateFor() {
    if (state.query) {
      return {
        icon: "fa-magnifying-glass",
        title: "No visitors found",
        desc: "Try searching with a different name, unit, or pass code."
      };
    }

    if (state.status === "expected") {
      return {
        icon: "fa-calendar-xmark",
        title: "No visitors expected",
        desc: "There are no visitors scheduled for the selected period."
      };
    }

    if (state.status === "inside") {
      return {
        icon: "fa-door-closed",
        title: "No visitors currently inside",
        desc: "All visitors have checked out."
      };
    }

    return {
      icon: "fa-clock-rotate-left",
      title: "No visitor activity yet",
      desc: "Visitor activity will appear here once a pass is verified."
    };
  }

  function renderTable() {
    const wrap = document.getElementById("visitors-table-wrap");
    const countEl = document.getElementById("visitor-result-count");
    if (!wrap) return;

    const rows = filteredVisitors();

    if (countEl) {
      countEl.textContent = `${rows.length} visitor${rows.length === 1 ? "" : "s"}`;
    }

    if (!rows.length) {
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
      <div class="gate-table-head">
        <span>Visitor</span>
        <span>Resident</span>
        <span>Unit</span>
        <span>Pass Type</span>
        <span>Arrival</span>
        <span>Status</span>
        <span>Action</span>
      </div>
    `;

    const body = rows.map(row => `
      <div class="gate-table-row">
        <div data-label="Visitor"><strong>${row.visitor}</strong></div>
        <div data-label="Resident" class="gate-table-cell--muted">${row.resident}</div>
        <div data-label="Unit" class="gate-table-cell--muted">${row.unit}</div>
        <div data-label="Pass Type" class="gate-table-cell--muted">${row.passType}</div>
        <div data-label="Arrival" class="gate-table-cell--muted">${row.arrival}</div>
        <div data-label="Status">${statusBadge(row.status)}</div>
        <div data-label="Action" class="gate-table-action">
          <button type="button" class="gate-table-view-btn" data-view-visitor="${row.id}">
            ${actionLabel(row.status)}
          </button>
        </div>
      </div>
    `).join("");

    wrap.innerHTML = `<div class="gate-table gate-table--visitors">${head}${body}</div>`;

    wrap.querySelectorAll("[data-view-visitor]").forEach(btn => {
      btn.addEventListener("click", () => openVisitorModal(btn.getAttribute("data-view-visitor")));
    });
  }

  /* =======================================================
     VISITOR DETAILS MODAL
     ======================================================= */

  function historyItem(entry) {
    let toneClass = "history-dot--muted";
    if (entry.tone === "success") toneClass = "history-dot--success";
    if (entry.tone === "danger") toneClass = "history-dot--danger";

    return `
      <div class="history-item">
        <span class="history-dot ${toneClass}">
          <i class="fa-solid ${entry.icon}" aria-hidden="true"></i>
        </span>
        <div class="history-body">
          <strong>${entry.title}</strong>
          ${entry.time ? `<span>${entry.time}</span>` : ""}
        </div>
      </div>
    `;
  }

  function footerActionsFor(visitor) {
    if (visitor.status === "inside") {
      return `
        <button type="button" class="btn btn--ghost" data-close-modal="visitor-modal">Close</button>
        <button type="button" class="btn btn--primary" id="modal-record-exit-btn">
          <i class="fa-solid fa-right-from-bracket" aria-hidden="true"></i>
          Record Exit
        </button>
      `;
    }

    if (visitor.status === "expected") {
      return `
        <button type="button" class="btn btn--ghost" data-close-modal="visitor-modal">Close</button>
        <a href="security-verify.html" class="btn btn--primary">
          <i class="fa-solid fa-shield-halved" aria-hidden="true"></i>
          Verify Pass
        </a>
      `;
    }

    return `
      <button type="button" class="btn btn--primary" data-close-modal="visitor-modal">Close</button>
    `;
  }

  function openVisitorModal(id) {
    const visitor = VISITORS.find(v => v.id === id);
    if (!visitor) return;

    const modal = document.getElementById("visitor-modal");
    const title = document.getElementById("visitor-modal-title");
    const body = document.getElementById("visitor-modal-body");
    const foot = document.getElementById("visitor-modal-foot");

    if (!modal || !title || !body || !foot) return;

    title.textContent = visitor.visitor;

    body.innerHTML = `
      <div>
        <span class="modal-section-label">Visitor Information</span>
        <div class="details-block">
          <div class="details-row"><span>Full name</span><span>${visitor.visitor}</span></div>
          ${visitor.phone ? `<div class="details-row"><span>Phone</span><span>${visitor.phone}</span></div>` : ""}
          <div class="details-row"><span>Pass type</span><span>${visitor.passType}</span></div>
          <div class="details-row"><span>Pass code</span><span>#${visitor.passCode}</span></div>
          <div class="details-row"><span>Pass validity</span><span>${visitor.passValidity}</span></div>
          <div class="details-row"><span>Status</span><span>${statusBadge(visitor.status)}</span></div>
        </div>
      </div>

      <div>
        <span class="modal-section-label">Visiting</span>
        <div class="details-block">
          <div class="details-row"><span>Resident</span><span>${visitor.resident}</span></div>
          <div class="details-row"><span>Unit</span><span>${visitor.unit}</span></div>
        </div>
      </div>

      <div>
        <span class="modal-section-label">Access Information</span>
        <div class="details-block">
          <div class="details-row"><span>Expected arrival</span><span>${visitor.arrival}</span></div>
          <div class="details-row"><span>Check-in</span><span>${visitor.checkIn || "—"}</span></div>
          <div class="details-row"><span>Check-out</span><span>${visitor.checkOut || "—"}</span></div>
          ${visitor.officer ? `<div class="details-row"><span>Recorded by</span><span>${visitor.officer}</span></div>` : ""}
        </div>
      </div>

      <div>
        <span class="modal-section-label">Access History</span>
        <div class="history-timeline">
          ${visitor.history.map(historyItem).join("")}
        </div>
      </div>
    `;

    foot.innerHTML = footerActionsFor(visitor);

    const recordExitBtn = document.getElementById("modal-record-exit-btn");
    if (recordExitBtn) {
      recordExitBtn.addEventListener("click", () => {
        closeModal("visitor-modal");
        openExitModal(visitor.id);
      });
    }

    openModal("visitor-modal");
  }

  /* =======================================================
     RECORD EXIT MODAL
     ======================================================= */

  let pendingExitId = null;

  function openExitModal(id) {
    const visitor = VISITORS.find(v => v.id === id);
    if (!visitor) return;

    pendingExitId = id;

    const details = document.getElementById("exit-modal-details");
    if (details) {
      details.innerHTML = `
        <div class="details-row"><span>Visitor</span><span>${visitor.visitor}</span></div>
        <div class="details-row"><span>Resident</span><span>${visitor.resident}</span></div>
        <div class="details-row"><span>Unit</span><span>${visitor.unit}</span></div>
        <div class="details-row"><span>Check-in time</span><span>${visitor.checkIn || "—"}</span></div>
      `;
    }

    openModal("exit-modal");
  }

  function confirmExit() {
    const visitor = VISITORS.find(v => v.id === pendingExitId);
    if (!visitor) {
      closeModal("exit-modal");
      return;
    }

    const now = new Date();
    const timeLabel = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

    visitor.status = "checkedout";
    visitor.checkOut = timeLabel;
    visitor.officer = visitor.officer || "Emeka Nwosu";
    visitor.history.pop(); // remove "Currently inside" placeholder entry
    visitor.history.push({ icon: "fa-right-from-bracket", tone: "", title: "Exit recorded", time: timeLabel });

    STATS.inside = Math.max(0, STATS.inside - 1);
    STATS.checkedOutToday += 1;

    closeModal("exit-modal");
    showToast(`${visitor.visitor}'s exit was recorded.`);

    renderStats();
    renderTable();

    pendingExitId = null;
  }

  /* =======================================================
     MODAL PLUMBING
     ======================================================= */

  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.hidden = true;
    if (document.getElementById("visitor-modal").hidden && document.getElementById("exit-modal").hidden) {
      document.body.style.overflow = "";
    }
  }

  function bindModalDismissers() {
    document.querySelectorAll("[data-close-modal]").forEach(el => {
      el.addEventListener("click", () => closeModal(el.getAttribute("data-close-modal")));
    });

    document.addEventListener("keydown", event => {
      if (event.key !== "Escape") return;
      closeModal("exit-modal");
      closeModal("visitor-modal");
    });
  }

  /* =======================================================
     TOAST
     ======================================================= */

  function showToast(message) {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    toast.style.cssText = `
      display:flex; align-items:center; gap:9px;
      padding:12px 16px; border-radius:12px;
      background:#14162b; color:#fff; font-size:12.5px; font-weight:600;
      box-shadow:0 14px 35px rgba(5,10,48,0.22);
      animation: modalPanelIn 0.2s ease;
    `;
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color:#8fe0b6;" aria-hidden="true"></i> ${message}`;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = "opacity 0.25s ease";
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 260);
    }, 3200);
  }

  /* =======================================================
     FILTER BINDINGS
     ======================================================= */

  function bindFilters() {
    const search = document.getElementById("visitor-search");
    const status = document.getElementById("filter-status");
    const passType = document.getElementById("filter-pass-type");
    const date = document.getElementById("filter-date");
    const reset = document.getElementById("filter-reset-btn");

    if (search) {
      search.addEventListener("input", () => {
        state.query = search.value.trim();
        renderTable();
      });
    }

    if (status) {
      status.addEventListener("change", () => {
        state.status = status.value;
        renderTable();
      });
    }

    if (passType) {
      passType.addEventListener("change", () => {
        state.passType = passType.value;
        renderTable();
      });
    }

    if (date) {
      date.addEventListener("change", () => {
        state.date = date.value;
        renderTable();
      });
    }

    if (reset) {
      reset.addEventListener("click", () => {
        state.query = "";
        state.status = "all";
        state.passType = "all";
        state.date = "";

        if (search) search.value = "";
        if (status) status.value = "all";
        if (passType) passType.value = "all";
        if (date) date.value = "";

        renderTable();
      });
    }
  }

  /* =======================================================
     PAGE HEADER DATE
     ======================================================= */

  function renderHeaderDate() {
    const el = document.getElementById("page-header-date-text");
    if (!el) return;
    const today = new Date();
    el.textContent = today.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
  }

  /* =======================================================
     REFRESH BUTTON (demo — no backend, just re-renders)
     ======================================================= */

  function bindRefresh() {
    const btn = document.getElementById("refresh-btn");
    if (!btn) return;
    btn.addEventListener("click", () => {
      renderStats();
      renderTable();
      showToast("Visitor list refreshed.");
    });
  }

  /* =======================================================
     INIT
     ======================================================= */

  document.addEventListener("DOMContentLoaded", () => {
    renderHeaderDate();
    renderStats();
    renderTable();
    bindFilters();
    bindModalDismissers();
    bindRefresh();

    const confirmExitBtn = document.getElementById("confirm-exit-btn");
    if (confirmExitBtn) {
      confirmExitBtn.addEventListener("click", confirmExit);
    }
  });

})();
