/* =========================================================
   RAFARA GATEPASS — SECURITY OFFICER DASHBOARD
   Frontend demo logic
   ========================================================= */

(function () {
  "use strict";

  window.RafaraSecurity = window.RafaraSecurity || {};

  /* =======================================================
     MOCK DATA
     ======================================================= */

  window.RafaraSecurity.DATA = {

    overview: {
      expectedToday: 24,
      visitorsInside: 12,
      activePasses: 18,
      needsAttention: 3
    },

    expectedVisitors: [
      {
        visitor: "Aisha Bello",
        resident: "Rahmah Ogunlaja",
        unit: "B5-F8",
        passType: "One-Day Visitor",
        arrival: "10:30 AM",
        status: "expected"
      },
      {
        visitor: "Ibrahim Musa",
        resident: "T. Adeyemi",
        unit: "BA1-F12",
        passType: "Multi-Day",
        arrival: "11:00 AM",
        status: "expected"
      },
      {
        visitor: "Grace Nnamdi",
        resident: "K. Balogun",
        unit: "B32-F7",
        passType: "One-Day Visitor",
        arrival: "12:15 PM",
        status: "expected"
      },
      {
        visitor: "Chuka Okafor",
        resident: "F. Eze",
        unit: "B20-F5",
        passType: "Delivery",
        arrival: "1:00 PM",
        status: "delayed"
      }
    ],

    visitorsInside: [
      {
        visitor: "Aisha Bello",
        resident: "Rahmah Ogunlaja",
        unit: "B5-F8",
        checkedIn: "10:42 AM",
        passType: "One-Day Visitor"
      },
      {
        visitor: "Samuel Iortyer",
        resident: "N. Chukwu",
        unit: "BC1-F7",
        checkedIn: "9:58 AM",
        passType: "Multi-Day"
      }
    ],

    recentActivity: [
      {
        icon: "fa-door-open",
        tone: "success",
        title: "Visitor checked in",
        desc: "Aisha Bello · Pass #RF2048",
        time: "10:42 AM"
      },
      {
        icon: "fa-shield-halved",
        tone: "success",
        title: "Pass verified",
        desc: "Ibrahim Musa · Pass #RF1832",
        time: "10:31 AM"
      },
      {
        icon: "fa-right-from-bracket",
        tone: "",
        title: "Visitor checked out",
        desc: "David Adeyemi · Pass #RF1721",
        time: "10:18 AM"
      },
      {
        icon: "fa-circle-xmark",
        tone: "danger",
        title: "Access denied",
        desc: "Unknown code attempted at Gate 2",
        time: "9:47 AM"
      },
      {
        icon: "fa-hourglass-end",
        tone: "warning",
        title: "Pass expired",
        desc: "Grace Nnamdi · Pass #RF1655",
        time: "9:20 AM"
      }
    ],

    alerts: [
      {
        icon: "fa-ban",
        tone: "danger",
        title: "Pass cancelled",
        desc: "Pass #RF1902 was cancelled by the resident.",
        cta: "Review",
        href: "security-passes.html"
      },
      {
        icon: "fa-hourglass-end",
        tone: "",
        title: "Pass expired",
        desc: "Pass #RF1655 has expired at the gate.",
        cta: "Review",
        href: "security-passes.html"
      },
      {
        icon: "fa-bullhorn",
        tone: "info",
        title: "Estate announcement",
        desc: "The estate manager sent a security announcement.",
        cta: "View",
        href: "security-notifications.html"
      }
    ],

    notifications: [
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
    ],

    quickActions: [
      {
        icon: "fa-shield-halved",
        label: "Verify Pass",
        sub: "Check a 4-digit code",
        href: "security-verify.html",
        primary: true
      },
      {
        icon: "fa-users",
        label: "View Visitors",
        sub: "Expected and on-site",
        href: "security-visitors.html"
      },
      {
        icon: "fa-id-card",
        label: "View Active Passes",
        sub: "All valid passes",
        href: "security-passes.html"
      },
      {
        icon: "fa-clock-rotate-left",
        label: "View Activity",
        sub: "Latest gate actions",
        href: "security-activity.html"
      }
    ]
  };

})();


/* =========================================================
   RENDERING
   ========================================================= */

(function () {

  "use strict";

  const NS = window.RafaraSecurity;
  const DATA = NS.DATA;

  function initials(name) {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map(word => word[0].toUpperCase())
      .join("");
  }


  function expectedStatusBadge(status) {

    const map = {

      expected: {
        cls: "badge--checkedin",
        label: "Expected"
      },

      delayed: {
        cls: "badge--pending",
        label: "Delayed"
      }

    };

    const result =
      map[status] ||
      {
        cls: "badge--checkedout",
        label: status
      };

    return `
      <span class="badge ${result.cls}">
        <i class="fa-solid fa-circle" aria-hidden="true"></i>
        ${result.label}
      </span>
    `;
  }


  /* =======================================================
     STATS
     ======================================================= */

  function renderStats() {

    const grid = document.getElementById("stats-grid");

    if (!grid) return;

    const cards = [

      {
        icon: "fa-users",
        iconClass: "stat-icon--upcoming",
        value: DATA.overview.expectedToday,
        label: "Visitors Expected",
        context: "Expected today"
      },

      {
        icon: "fa-door-open",
        iconClass: "stat-icon--inside",
        value: DATA.overview.visitorsInside,
        label: "Visitors Inside",
        context: "Currently inside"
      },

      {
        icon: "fa-id-card",
        iconClass: "stat-icon--passes",
        value: DATA.overview.activePasses,
        label: "Active Passes",
        context: "Currently valid"
      },

      {
        icon: "fa-triangle-exclamation",
        iconClass: "stat-icon--pending",
        value: DATA.overview.needsAttention,
        label: "Needs Attention",
        context: "Flagged or pending"
      }

    ];

    grid.innerHTML = cards.map(card => `

      <article class="stat-card">

        <span class="stat-icon ${card.iconClass}">
          <i class="fa-solid ${card.icon}" aria-hidden="true"></i>
        </span>

        <div class="stat-body">

          <span class="stat-number">
            ${card.value}
          </span>

          <span class="stat-label">
            ${card.label}
          </span>

          <span class="stat-context">
            ${card.context}
          </span>

        </div>

      </article>

    `).join("");
  }


  /* =======================================================
     EXPECTED VISITORS (table)
     ======================================================= */

  function renderExpectedVisitors() {

    const wrap =
      document.getElementById("expected-visitors-list");

    if (!wrap) return;

    if (!DATA.expectedVisitors.length) {

      wrap.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-calendar-xmark"></i>
          <strong>No visitors scheduled</strong>
          <span>
            There are no visitors expected at your gate today.
          </span>
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
      </div>
    `;

    const rows = DATA.expectedVisitors.map(row => `

      <div class="gate-table-row">
        <div data-label="Visitor"><strong>${row.visitor}</strong></div>
        <div data-label="Resident" class="gate-table-cell--muted">${row.resident}</div>
        <div data-label="Unit" class="gate-table-cell--muted">${row.unit}</div>
        <div data-label="Pass Type" class="gate-table-cell--muted">${row.passType}</div>
        <div data-label="Arrival" class="gate-table-cell--muted">${row.arrival}</div>
        <div data-label="Status">${expectedStatusBadge(row.status)}</div>
      </div>

    `).join("");

    wrap.innerHTML = `<div class="gate-table">${head}${rows}</div>`;
  }


  /* =======================================================
     VISITORS INSIDE
     ======================================================= */

  function renderVisitorsInside() {

    const wrap =
      document.getElementById("visitors-inside-list");

    if (!wrap) return;

    if (!DATA.visitorsInside.length) {

      wrap.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-door-closed"></i>
          <strong>No visitors currently inside</strong>
          <span>
            All visitors have checked out.
          </span>
        </div>
      `;

      return;
    }

    wrap.innerHTML = DATA.visitorsInside.map(row => `

      <div class="visitor-card">

        <span class="visitor-avatar" aria-hidden="true">
          ${initials(row.visitor)}
        </span>

        <div class="visitor-info">

          <strong>${row.visitor}</strong>

          <span class="visitor-meta">
            <span>Visiting ${row.resident}</span>
            <span>•</span>
            <span>${row.unit}</span>
            <span>•</span>
            <span>Since ${row.checkedIn}</span>
          </span>

        </div>

        <div class="visitor-actions">
          <span class="badge badge--active">
            <i class="fa-solid fa-circle" aria-hidden="true"></i>
            Inside
          </span>
        </div>

      </div>

    `).join("");
  }


  /* =======================================================
     RECENT ACTIVITY
     ======================================================= */

  function renderRecentActivity() {

    const wrap =
      document.getElementById("recent-activity-list");

    if (!wrap) return;

    if (!DATA.recentActivity.length) {

      wrap.innerHTML = `
        <li class="empty-state">
          <i class="fa-solid fa-clock-rotate-left"></i>
          <strong>No recent activity</strong>
          <span>
            Gate activity will appear here as visitors are verified.
          </span>
        </li>
      `;

      return;
    }

    wrap.innerHTML = DATA.recentActivity.map(item => `

      <li class="activity-item">

        <span class="activity-icon${item.tone ? ` activity-icon--${item.tone}` : ""}">
          <i class="fa-solid ${item.icon}"></i>
        </span>

        <div class="activity-body">

          <strong>
            ${item.title}
          </strong>

          <p>
            ${item.desc}
          </p>

        </div>

        <span class="activity-time">
          ${item.time}
        </span>

      </li>

    `).join("");
  }


  /* =======================================================
     SECURITY ALERTS
     ======================================================= */

  function renderAlerts() {

    const wrap =
      document.getElementById("alerts-list");

    if (!wrap) return;

    if (!DATA.alerts.length) {

      wrap.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-circle-check"></i>
          <strong>All caught up</strong>
          <span>
            Nothing needs your attention right now.
          </span>
        </div>
      `;

      return;
    }

    wrap.innerHTML = DATA.alerts.map(alert => `

      <div class="alert-item">

        <span class="alert-icon${alert.tone ? ` alert-icon--${alert.tone}` : ""}">
          <i class="fa-solid ${alert.icon}"></i>
        </span>

        <div class="alert-body">

          <strong>
            ${alert.title}
          </strong>

          <p>
            ${alert.desc}
          </p>

          <a
            class="text-link"
            href="${alert.href}"
          >
            ${alert.cta}
          </a>

        </div>

      </div>

    `).join("");
  }


  /* =======================================================
     QUICK ACTIONS
     ======================================================= */

  function renderQuickActions() {

    const wrap =
      document.getElementById("quick-actions-grid");

    if (!wrap) return;

    wrap.innerHTML = DATA.quickActions.map(action => `

      <a
        class="quick-action-card${action.primary
          ? " quick-action-card--primary"
          : ""
        }"
        href="${action.href}"
      >

        <span class="qa-icon">
          <i class="fa-solid ${action.icon}"></i>
        </span>

        <span class="qa-text">

          <strong>
            ${action.label}
          </strong>

          <span>
            ${action.sub}
          </span>

        </span>

      </a>

    `).join("");
  }


  /* =======================================================
     NOTIFICATIONS
     ======================================================= */

  function renderNotifications() {

    const list =
      document.getElementById("notif-panel-list");

    const dot =
      document.getElementById("notif-dot");

    const sidebarCount =
      document.getElementById("sidebar-notif-count");

    if (!list) return;

    const unread =
      DATA.notifications.filter(notification => notification.unread).length;

    if (!DATA.notifications.length) {

      list.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-bell-slash"></i>
          <strong>No notifications</strong>
          <span>
            You're all caught up.
          </span>
        </div>
      `;

    } else {

      list.innerHTML = DATA.notifications.map(notification => `

        <div class="notif-item${notification.unread ? " is-unread" : ""}">

          <span class="notif-icon">
            <i class="fa-solid ${notification.icon}"></i>
          </span>

          <div class="notif-body">

            <strong>
              ${notification.title}
            </strong>

            <p>
              ${notification.desc}
            </p>

            <span class="notif-time">
              ${notification.time}
            </span>

          </div>

          ${
            notification.unread
              ? `<span class="notif-unread-dot"></span>`
              : ""
          }

        </div>

      `).join("");
    }

    if (dot) {
      dot.hidden = unread === 0;
    }

    if (sidebarCount) {
      sidebarCount.textContent = unread;
      sidebarCount.hidden = unread === 0;
    }
  }


  NS.render = {

    all() {
      renderStats();
      renderExpectedVisitors();
      renderVisitorsInside();
      renderRecentActivity();
      renderAlerts();
      renderQuickActions();
      renderNotifications();
    }

  };

})();


/* =========================================================
   VERIFY PASS (frontend-only mock verification)
   ========================================================= */

(function () {

  const form =
    document.getElementById("verify-form");

  const input =
    document.getElementById("pass-code");

  const submitBtn =
    document.getElementById("verify-submit-btn");

  const feedback =
    document.getElementById("verify-feedback");

  if (!form || !input || !submitBtn || !feedback) return;

  let feedbackTimer = null;

  input.addEventListener("input", () => {

    input.value = input.value
      .replace(/\D/g, "")
      .slice(0, 4);

    submitBtn.disabled = input.value.length !== 4;

  });

  form.addEventListener("submit", event => {

    event.preventDefault();

    if (input.value.length !== 4) return;

    // No backend — mock verification for demo purposes only.
    const digitSum = input.value
      .split("")
      .reduce((sum, digit) => sum + Number(digit), 0);

    const isValid = digitSum % 2 === 0;

    clearTimeout(feedbackTimer);

    feedback.hidden = false;
    feedback.className = isValid
      ? "verify-feedback verify-feedback--success"
      : "verify-feedback verify-feedback--error";

    feedback.innerHTML = isValid
      ? `<i class="fa-solid fa-circle-check" aria-hidden="true"></i> Pass verified — access granted.`
      : `<i class="fa-solid fa-circle-xmark" aria-hidden="true"></i> Code not recognized — access denied.`;

    feedbackTimer = setTimeout(() => {
      feedback.hidden = true;
    }, 3200);

  });

})();


/* =========================================================
   SIDEBAR DRAWER
   ========================================================= */

(function () {

  const sidebar =
    document.getElementById("sidebar");

  const backdrop =
    document.getElementById("sidebar-backdrop");

  const toggle =
    document.getElementById("sidebar-toggle-btn");

  if (!sidebar || !backdrop || !toggle) return;


  function openSidebar() {

    sidebar.classList.add("is-open");

    backdrop.hidden = false;

    toggle.setAttribute(
      "aria-expanded",
      "true"
    );

    document.body.style.overflow = "hidden";
  }


  function closeSidebar() {

    sidebar.classList.remove("is-open");

    backdrop.hidden = true;

    toggle.setAttribute(
      "aria-expanded",
      "false"
    );

    document.body.style.overflow = "";
  }


  toggle.addEventListener("click", () => {

    if (sidebar.classList.contains("is-open")) {
      closeSidebar();
    } else {
      openSidebar();
    }

  });


  backdrop.addEventListener(
    "click",
    closeSidebar
  );


  document.addEventListener(
    "keydown",
    event => {

      if (event.key === "Escape") {
        closeSidebar();
      }

    }
  );

})();


/* =========================================================
   DROPDOWNS
   ========================================================= */

(function () {

  const dropdowns =
    document.querySelectorAll("[data-dropdown]");

  if (!dropdowns.length) return;


  function closeAll(except = null) {

    dropdowns.forEach(wrapper => {

      if (wrapper === except) return;

      const panel =
        wrapper.querySelector(".dropdown-panel");

      const button =
        wrapper.querySelector("button");

      if (panel) {
        panel.hidden = true;
      }

      if (button) {
        button.setAttribute(
          "aria-expanded",
          "false"
        );
      }

    });

  }


  dropdowns.forEach(wrapper => {

    const button =
      wrapper.querySelector("button");

    const panel =
      wrapper.querySelector(".dropdown-panel");

    if (!button || !panel) return;


    button.addEventListener("click", event => {

      event.stopPropagation();

      const wasOpen = !panel.hidden;

      closeAll();

      panel.hidden = wasOpen;

      button.setAttribute(
        "aria-expanded",
        String(!wasOpen)
      );

    });

  });


  document.addEventListener("click", event => {

    const inside =
      [...dropdowns].some(
        dropdown => dropdown.contains(event.target)
      );

    if (!inside) {
      closeAll();
    }

  });


  document.addEventListener("keydown", event => {

    if (event.key === "Escape") {
      closeAll();
    }

  });

})();


/* =========================================================
   MARK ALL NOTIFICATIONS READ
   ========================================================= */

(function () {

  const button =
    document.getElementById("mark-all-read-btn");

  if (!button) return;

  button.addEventListener("click", () => {

    window.RafaraSecurity.DATA.notifications.forEach(
      notification => {
        notification.unread = false;
      }
    );

    window.RafaraSecurity.render.all();

  });

})();


/* =========================================================
   MOBILE MORE SHEET
   ========================================================= */

(function () {

  const sheet =
    document.getElementById("mobile-menu-sheet");

  const button =
    document.getElementById("mobile-menu-btn");

  const closeTriggers =
    document.querySelectorAll(
      "[data-close-mobile-sheet]"
    );

  if (!sheet || !button) return;


  function openSheet() {

    sheet.hidden = false;

    requestAnimationFrame(() => {
      sheet.classList.add("is-open");
    });

    button.setAttribute(
      "aria-expanded",
      "true"
    );

    document.body.style.overflow = "hidden";
  }


  function closeSheet() {

    sheet.classList.remove("is-open");

    button.setAttribute(
      "aria-expanded",
      "false"
    );

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

    trigger.addEventListener(
      "click",
      closeSheet
    );

  });


  document.addEventListener("keydown", event => {

    if (
      event.key === "Escape" &&
      !sheet.hidden
    ) {
      closeSheet();
    }

  });

})();


/* =========================================================
   LOGOUT
   ========================================================= */

(function () {

  const triggers = [

    document.getElementById("logout-btn"),

    document.getElementById(
      "mobile-logout-btn"
    ),

    document.getElementById(
      "dropdown-logout-btn"
    )

  ].filter(Boolean);


  triggers.forEach(button => {

    button.addEventListener("click", () => {

      window.location.href =
        "security-login.html";

    });

  });

})();


/* =========================================================
   INIT
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    window.RafaraSecurity.render.all();

  }
);
