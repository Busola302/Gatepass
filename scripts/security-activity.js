/* =========================================================
   RAFARA GATEPASS — SECURITY ACTIVITY PAGE
   Frontend demo logic (mock data, no backend)
   ========================================================= */

(function () {
  "use strict";

  window.RafaraSecurity = window.RafaraSecurity || {};

  /* =======================================================
     ACTIVITY TYPE CONFIG
     ======================================================= */

  const TYPE_CONFIG = {
    verified: {
      label: "Pass Verified",
      icon: "fa-shield-halved",
      tone: "success",
      resultLabel: "Verified",
      badgeClass: "badge--verified"
    },
    entry: {
      label: "Entry Granted",
      icon: "fa-door-open",
      tone: "success",
      resultLabel: "Successful",
      badgeClass: "badge--active"
    },
    exit: {
      label: "Exit Recorded",
      icon: "fa-right-from-bracket",
      tone: "",
      resultLabel: "Completed",
      badgeClass: "badge--checkedout"
    },
    denied: {
      label: "Access Denied",
      icon: "fa-circle-xmark",
      tone: "danger",
      resultLabel: "Denied",
      badgeClass: "badge--revoked"
    },
    expired: {
      label: "Pass Expired",
      icon: "fa-hourglass-end",
      tone: "warning",
      resultLabel: "Expired",
      badgeClass: "badge--pending"
    },
    cancelled: {
      label: "Pass Cancelled",
      icon: "fa-ban",
      tone: "danger",
      resultLabel: "Cancelled",
      badgeClass: "badge--revoked"
    }
  };

  /* =======================================================
     MOCK DATA
     ======================================================= */

  window.RafaraSecurity.ACTIVITY = {

    overview: {
      totalToday: 86,
      entries: 42,
      exits: 38,
      denied: 6
    },

    officer: "Emeka Nwosu",

    events: [
      {
        id: "EV1001", type: "entry", visitor: "Aisha Bello", resident: "Rahmah Ogunlaja",
        unit: "B8-F5", passCode: "RF4827", passType: "One-Day Visitor",
        dateLabel: "Today", dateSort: 3, time: "10:42 AM"
      },
      {
        id: "EV1002", type: "verified", visitor: "Ibrahim Musa", resident: "T. Adeyemi",
        unit: "BA-F12", passCode: "RF1934", passType: "Multi-Day",
        dateLabel: "Today", dateSort: 3, time: "10:31 AM"
      },
      {
        id: "EV1003", type: "denied", visitor: "David Adeyemi", resident: "K. Johnson",
        unit: "BA1-F7", passCode: "RF7812", passType: "One-Day Visitor",
        dateLabel: "Today", dateSort: 3, time: "10:18 AM",
        denialReason: "Pass expired"
      },
      {
        id: "EV1004", type: "exit", visitor: "Maryam Yusuf", resident: "S. Bello",
        unit: "B20-F5", passCode: "RF6281", passType: "Multi-Day",
        dateLabel: "Today", dateSort: 3, time: "9:56 AM"
      },
      {
        id: "EV1005", type: "expired", visitor: "Grace Nnamdi", resident: "K. Balogun",
        unit: "C-311", passCode: "RF1655", passType: "One-Day Visitor",
        dateLabel: "Today", dateSort: 3, time: "9:20 AM"
      },
      {
        id: "EV1006", type: "entry", visitor: "Samuel Iortyer", resident: "N. Chukwu",
        unit: "D-402", passCode: "RF3390", passType: "Multi-Day",
        dateLabel: "Today", dateSort: 3, time: "8:58 AM"
      },
      {
        id: "EV1007", type: "cancelled", visitor: "Femi Ojo", resident: "A. Nwachukwu",
        unit: "A-117", passCode: "RF1902", passType: "Delivery",
        dateLabel: "Today", dateSort: 3, time: "8:40 AM",
        denialReason: "Pass cancelled by resident"
      },
      {
        id: "EV1008", type: "verified", visitor: "Chuka Okafor", resident: "F. Eze",
        unit: "A-117", passCode: "RF2210", passType: "Delivery",
        dateLabel: "Today", dateSort: 3, time: "8:12 AM"
      },
      {
        id: "EV1009", type: "exit", visitor: "David Adeyemi", resident: "K. Johnson",
        unit: "BA1-F7", passCode: "RF7801", passType: "One-Day Visitor",
        dateLabel: "Yesterday", dateSort: 2, time: "6:42 PM"
      },
      {
        id: "EV1010", type: "entry", visitor: "Blessing Eze", resident: "O. Adeyemi",
        unit: "C-208", passCode: "RF5541", passType: "One-Day Visitor",
        dateLabel: "Yesterday", dateSort: 2, time: "5:31 PM"
      },
      {
        id: "EV1011", type: "verified", visitor: "Tunde Bakare", resident: "M. Okon",
        unit: "D-114", passCode: "RF6603", passType: "Multi-Day",
        dateLabel: "Yesterday", dateSort: 2, time: "4:15 PM"
      },
      {
        id: "EV1012", type: "denied", visitor: "Uche Chibuzor", resident: "J. Anya",
        unit: "B-315", passCode: "RF9910", passType: "One-Day Visitor",
        dateLabel: "Yesterday", dateSort: 2, time: "3:47 PM",
        denialReason: "Visitor details don't match"
      },
      {
        id: "EV1013", type: "exit", visitor: "Grace Nnamdi", resident: "K. Balogun",
        unit: "C-311", passCode: "RF1600", passType: "One-Day Visitor",
        dateLabel: "Yesterday", dateSort: 2, time: "2:20 PM"
      },
      {
        id: "EV1014", type: "entry", visitor: "Halima Suleiman", resident: "R. Okafor",
        unit: "A-402", passCode: "RF4471", passType: "Multi-Day",
        dateLabel: "Yesterday", dateSort: 2, time: "11:05 AM"
      },
      {
        id: "EV1015", type: "expired", visitor: "Peter Nwosu", resident: "C. Uba",
        unit: "B-119", passCode: "RF3302", passType: "One-Day Visitor",
        dateLabel: "Yesterday", dateSort: 2, time: "9:38 AM"
      },
      {
        id: "EV1016", type: "verified", visitor: "Rahmah Ogunlaja", resident: "—",
        unit: "B8-F5", passCode: "RF4820", passType: "Resident",
        dateLabel: "Sep 1", dateSort: 1, time: "7:12 PM"
      },
      {
        id: "EV1017", type: "entry", visitor: "Kelechi Obi", resident: "F. Musa",
        unit: "C-118", passCode: "RF7719", passType: "One-Day Visitor",
        dateLabel: "Sep 1", dateSort: 1, time: "5:50 PM"
      },
      {
        id: "EV1018", type: "denied", visitor: "Unknown Visitor", resident: "—",
        unit: "—", passCode: "RF0000", passType: "—",
        dateLabel: "Sep 1", dateSort: 1, time: "4:03 PM",
        denialReason: "Invalid pass"
      },
      {
        id: "EV1019", type: "exit", visitor: "Halima Suleiman", resident: "R. Okafor",
        unit: "A-402", passCode: "RF4471", passType: "Multi-Day",
        dateLabel: "Sep 1", dateSort: 1, time: "2:11 PM"
      },
      {
        id: "EV1020", type: "cancelled", visitor: "Ngozi Eze", resident: "B. Nnamdi",
        unit: "D-207", passCode: "RF6120", passType: "One-Day Visitor",
        dateLabel: "Sep 1", dateSort: 1, time: "1:04 PM",
        denialReason: "Pass cancelled by resident"
      }
    ]

  };

  window.RafaraSecurity.ACTIVITY_TYPE_CONFIG = TYPE_CONFIG;

})();


/* =========================================================
   RENDERING
   ========================================================= */

(function () {

  "use strict";

  const NS = window.RafaraSecurity;
  const DATA = NS.ACTIVITY;
  const TYPES = NS.ACTIVITY_TYPE_CONFIG;

  const PAGE_SIZE = 6;

  const state = {
    query: "",
    type: "all",
    date: "",
    status: "all",
    visibleCount: PAGE_SIZE
  };

  /* =======================================================
     HELPERS
     ======================================================= */

  function statusOf(type) {
    if (type === "denied" || type === "cancelled" || type === "expired") return "denied";
    if (type === "entry" || type === "exit" || type === "verified") return "successful";
    return "successful";
  }

  function matchesFilters(event) {

    const q = state.query.trim().toLowerCase();

    if (q) {
      const haystack = [
        event.visitor,
        event.resident,
        event.passCode,
        event.unit
      ].join(" ").toLowerCase();

      if (!haystack.includes(q)) return false;
    }

    if (state.type !== "all" && event.type !== state.type) return false;

    if (state.status !== "all" && statusOf(event.type) !== state.status) return false;

    if (state.date && event.isoDate !== state.date) return false;

    return true;
  }

  function groupByDate(events) {

    const groups = [];
    const map = new Map();

    events.forEach(event => {

      if (!map.has(event.dateLabel)) {

        const group = { label: event.dateLabel, sort: event.dateSort, items: [] };

        map.set(event.dateLabel, group);
        groups.push(group);
      }

      map.get(event.dateLabel).items.push(event);

    });

    groups.sort((a, b) => b.sort - a.sort);

    return groups;
  }

  /* =======================================================
     STATS
     ======================================================= */

  function renderStats() {

    const grid = document.getElementById("activity-stats-grid");

    if (!grid) return;

    const cards = [
      {
        icon: "fa-list-check",
        iconClass: "stat-icon--upcoming",
        value: DATA.overview.totalToday,
        label: "Total Events Today",
        context: "All activity"
      },
      {
        icon: "fa-door-open",
        iconClass: "stat-icon--inside",
        value: DATA.overview.entries,
        label: "Entries",
        context: "Visitors checked in"
      },
      {
        icon: "fa-right-from-bracket",
        iconClass: "stat-icon--passes",
        value: DATA.overview.exits,
        label: "Exits",
        context: "Visitors checked out"
      },
      {
        icon: "fa-circle-xmark",
        iconClass: "stat-icon--pending",
        value: DATA.overview.denied,
        label: "Denied",
        context: "Access attempts denied"
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
     LOG
     ======================================================= */

  function logItemMarkup(event) {

    const cfg = TYPES[event.type];

    const metaParts = [];

    if (event.resident && event.resident !== "—") {
      metaParts.push(`Visiting ${event.resident}`);
    }

    if (event.unit && event.unit !== "—") {
      metaParts.push(event.unit);
    }

    const meta = metaParts
      .map(part => `<span>${part}</span>`)
      .join(`<span class="dot-sep" aria-hidden="true"></span>`);

    return `
      <button
        type="button"
        class="log-item"
        data-event-id="${event.id}"
      >
        <span class="activity-icon${cfg.tone ? ` activity-icon--${cfg.tone}` : ""}">
          <i class="fa-solid ${cfg.icon}" aria-hidden="true"></i>
        </span>

        <span class="log-item-body">
          <span class="log-item-action">${cfg.label}</span>
          <span class="log-item-person">${event.visitor}</span>
          ${meta ? `<span class="log-item-meta">${meta}<span class="dot-sep" aria-hidden="true"></span><span>Pass #${event.passCode}</span></span>` : `<span class="log-item-meta"><span>Pass #${event.passCode}</span></span>`}
          ${event.denialReason ? `<span class="log-item-reason">Reason: ${event.denialReason}</span>` : ""}
        </span>

        <span class="log-item-side">
          <span class="log-item-time">${event.time}</span>
          <span class="badge ${cfg.badgeClass}">
            <i class="fa-solid fa-circle" aria-hidden="true"></i>
            ${cfg.resultLabel}
          </span>
        </span>
      </button>
    `;
  }

  function renderLog() {

    const wrap = document.getElementById("activity-log");
    const emptyWrap = document.getElementById("activity-empty");
    const loadMoreRow = document.getElementById("load-more-row");
    const loadMoreBtn = document.getElementById("load-more-btn");

    if (!wrap) return;

    const filtered = DATA.events.filter(matchesFilters);

    if (!filtered.length) {

      wrap.innerHTML = "";
      wrap.hidden = true;
      if (loadMoreRow) loadMoreRow.hidden = true;

      if (emptyWrap) {

        emptyWrap.hidden = false;

        const hasQuery = state.query.trim().length > 0;
        const hasDate = !!state.date;

        let heading = "No activity yet";
        let sub = "Security activity will appear here as visitors are verified and access events occur.";

        if (hasQuery) {
          heading = "No activity found";
          sub = "Try searching with a different visitor, resident, pass code, or unit.";
        } else if (hasDate) {
          heading = "No activity for this date";
          sub = "There are no recorded security events for the selected date.";
        } else if (state.type !== "all" || state.status !== "all") {
          heading = "No activity found";
          sub = "Try a different activity type or result filter.";
        }

        emptyWrap.innerHTML = `
          <i class="fa-solid fa-clock-rotate-left" aria-hidden="true"></i>
          <strong>${heading}</strong>
          <span>${sub}</span>
        `;
      }

      return;
    }

    wrap.hidden = false;
    if (emptyWrap) emptyWrap.hidden = true;

    const visible = filtered.slice(0, state.visibleCount);
    const groups = groupByDate(visible);

    wrap.innerHTML = groups.map(group => `
      <div class="log-date-group">
        <h3 class="log-date-heading">${group.label}</h3>
        <div class="log-list">
          ${group.items.map(logItemMarkup).join("")}
        </div>
      </div>
    `).join("");

    if (loadMoreRow && loadMoreBtn) {

      const remaining = filtered.length - visible.length;

      if (remaining > 0) {
        loadMoreRow.hidden = false;
        loadMoreBtn.textContent = `Load more (${remaining} more)`;
      } else {
        loadMoreRow.hidden = true;
      }
    }
  }

  /* =======================================================
     DRAWER
     ======================================================= */

  function openDrawer(eventId) {

    const event = DATA.events.find(item => item.id === eventId);

    if (!event) return;

    const cfg = TYPES[event.type];

    const backdrop = document.getElementById("drawer-backdrop");
    const body = document.getElementById("drawer-body");

    if (!backdrop || !body) return;

    const rows = [
      ["Activity Type", cfg.label],
      ["Visitor", event.visitor],
      ["Resident", event.resident || "—"],
      ["Unit", event.unit || "—"],
      ["Pass Code", `#${event.passCode}`],
      ["Pass Type", event.passType || "—"],
      ["Date", event.dateLabel],
      ["Time", event.time],
      ["Security Officer", DATA.officer],
      ["Result", cfg.resultLabel]
    ];

    body.innerHTML = `
      <div class="drawer-top-status">
        <span class="activity-icon${cfg.tone ? ` activity-icon--${cfg.tone}` : ""}">
          <i class="fa-solid ${cfg.icon}" aria-hidden="true"></i>
        </span>
        <span class="drawer-top-status-text">
          <strong>${cfg.label}</strong>
          <span>${event.dateLabel} · ${event.time}</span>
        </span>
      </div>

      <div class="details-block">
        ${rows.map(([label, value]) => `
          <div class="details-row">
            <span>${label}</span>
            <span>${value}</span>
          </div>
        `).join("")}
      </div>

      ${event.denialReason ? `
        <div class="denial-box">
          <strong><i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i> Reason for Denial</strong>
          <p>${event.denialReason}</p>
        </div>
      ` : ""}
    `;

    backdrop.hidden = false;

    requestAnimationFrame(() => {
      backdrop.classList.add("is-open");
    });

    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {

    const backdrop = document.getElementById("drawer-backdrop");

    if (!backdrop) return;

    backdrop.classList.remove("is-open");
    document.body.style.overflow = "";

    setTimeout(() => {
      backdrop.hidden = true;
    }, 250);
  }

  /* =======================================================
     EVENT WIRING
     ======================================================= */

  function wireToolbar() {

    const searchInput = document.getElementById("activity-search");
    const typeSelect = document.getElementById("activity-type-filter");
    const dateInput = document.getElementById("activity-date-filter");
    const statusSelect = document.getElementById("activity-status-filter");
    const clearBtn = document.getElementById("clear-filters-btn");

    if (searchInput) {
      searchInput.addEventListener("input", () => {
        state.query = searchInput.value;
        state.visibleCount = PAGE_SIZE;
        renderLog();
      });
    }

    if (typeSelect) {
      typeSelect.addEventListener("change", () => {
        state.type = typeSelect.value;
        state.visibleCount = PAGE_SIZE;
        renderLog();
      });
    }

    if (dateInput) {
      dateInput.addEventListener("change", () => {
        // Demo dataset uses relative labels, not real ISO dates,
        // so date filtering is treated as "Today" when a date is chosen.
        state.date = dateInput.value ? "today" : "";
        state.visibleCount = PAGE_SIZE;
        renderLog();
      });
    }

    if (statusSelect) {
      statusSelect.addEventListener("change", () => {
        state.status = statusSelect.value;
        state.visibleCount = PAGE_SIZE;
        renderLog();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {

        state.query = "";
        state.type = "all";
        state.date = "";
        state.status = "all";
        state.visibleCount = PAGE_SIZE;

        if (searchInput) searchInput.value = "";
        if (typeSelect) typeSelect.value = "all";
        if (dateInput) dateInput.value = "";
        if (statusSelect) statusSelect.value = "all";

        renderLog();
      });
    }
  }

  function wireLoadMore() {

    const btn = document.getElementById("load-more-btn");

    if (!btn) return;

    btn.addEventListener("click", () => {
      state.visibleCount += PAGE_SIZE;
      renderLog();
    });
  }

  function wireLog() {

    const wrap = document.getElementById("activity-log");

    if (!wrap) return;

    wrap.addEventListener("click", event => {

      const item = event.target.closest(".log-item");

      if (!item) return;

      openDrawer(item.getAttribute("data-event-id"));
    });
  }

  function wireDrawer() {

    const backdrop = document.getElementById("drawer-backdrop");
    const closeBtn = document.getElementById("drawer-close-btn");

    if (backdrop) {

      backdrop.addEventListener("click", event => {
        if (event.target === backdrop) closeDrawer();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", closeDrawer);
    }

    document.addEventListener("keydown", event => {

      if (event.key === "Escape" && backdrop && !backdrop.hidden) {
        closeDrawer();
      }

    });
  }

  /* =======================================================
     INIT
     ======================================================= */

  document.addEventListener("DOMContentLoaded", () => {

    // "today" isoDate tag on today's mock events, to support the
    // demo date-filter behavior described in wireToolbar().
    DATA.events.forEach(event => {
      event.isoDate = event.dateLabel === "Today" ? "today" : event.dateLabel;
    });

    renderStats();
    renderLog();
    wireToolbar();
    wireLoadMore();
    wireLog();
    wireDrawer();

  });

})();


/* =========================================================
   SIDEBAR DRAWER (mobile nav shell — shared behavior)
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
   DROPDOWNS (profile / notifications)
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

    const inside = [...dropdowns].some(dropdown => dropdown.contains(event.target));

    if (!inside) closeAll();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeAll();
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

    requestAnimationFrame(() => {
      sheet.classList.add("is-open");
    });

    button.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeSheet() {

    sheet.classList.remove("is-open");
    button.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";

    setTimeout(() => {
      sheet.hidden = true;
    }, 220);
  }

  button.addEventListener("click", () => {
    if (sheet.hidden) {
      openSheet();
    } else {
      closeSheet();
    }
  });

  closeTriggers.forEach(trigger => {
    trigger.addEventListener("click", closeSheet);
  });

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
