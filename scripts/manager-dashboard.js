/* =========================================================
   RAFARA GATEPASS — ESTATE MANAGER DASHBOARD
   Frontend demo logic
   ========================================================= */

(function () {
  "use strict";

  window.RafaraManager = window.RafaraManager || {};

  /* =======================================================
     MOCK DATA
     ======================================================= */

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
      {
        visitor: "David Ade",
        resident: "Flat A12",
        passType: "Visitor",
        time: "8:42 AM",
        status: "inside"
      },
      {
        visitor: "Sarah O.",
        resident: "Flat B07",
        passType: "Artisan",
        time: "8:31 AM",
        status: "verified"
      },
      {
        visitor: "Michael K.",
        resident: "Flat C21",
        passType: "Visitor",
        time: "8:12 AM",
        status: "exited"
      },
      {
        visitor: "Amina T.",
        resident: "Flat D09",
        passType: "Visitor",
        time: "7:56 AM",
        status: "inside"
      }
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
      {
        icon: "fa-user-check",
        title: "Resident verified",
        desc: "A resident account was successfully verified.",
        time: "12m ago"
      },
      {
        icon: "fa-shield-halved",
        title: "Security staff added",
        desc: "A new security personnel account was added.",
        time: "38m ago"
      },
      {
        icon: "fa-id-card",
        title: "Visitor pass created",
        desc: "A new visitor pass was generated.",
        time: "1h ago"
      },
      {
        icon: "fa-helmet-safety",
        title: "Artisan pass approved",
        desc: "An artisan access request was approved.",
        time: "2h ago"
      },
      {
        icon: "fa-user-pen",
        title: "Resident profile updated",
        desc: "A resident updated their account information.",
        time: "3h ago"
      }
    ],

    notifications: [
      {
        icon: "fa-user-clock",
        title: "New resident verification",
        desc: "A resident is waiting for approval.",
        time: "12m ago",
        unread: true
      },
      {
        icon: "fa-shield-halved",
        title: "Security invitation",
        desc: "A security staff invitation is pending.",
        time: "1h ago",
        unread: true
      }
    ],

    quickActions: [
      {
        icon: "fa-user-plus",
        label: "Add Resident",
        sub: "Register a new resident",
        href: "manager-residents.html",
        primary: true
      },
      {
        icon: "fa-shield-halved",
        label: "Add Security",
        sub: "Onboard personnel",
        href: "manager-security.html"
      },
      {
        icon: "fa-building",
        label: "Manage Units",
        sub: "Estate unit list",
        href: "manager-units.html"
      },
      {
        icon: "fa-id-card",
        label: "View Passes",
        sub: "All active passes",
        href: "manager-passes.html"
      },
      {
        icon: "fa-clipboard-check",
        label: "Review Requests",
        sub: "Pending approvals",
        href: "manager-residents.html"
      }
    ]
  };

})();


/* =========================================================
   RENDERING
   ========================================================= */

(function () {

  "use strict";

  const NS = window.RafaraManager;
  const DATA = NS.DATA;

  function initials(name) {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map(word => word[0].toUpperCase())
      .join("");
  }


  function statusBadge(status) {

    const map = {

      inside: {
        cls: "badge--active",
        label: "Inside"
      },

      verified: {
        cls: "badge--verified",
        label: "Verified"
      },

      exited: {
        cls: "badge--checkedout",
        label: "Exited"
      },

      pending: {
        cls: "badge--pending",
        label: "Pending"
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
        iconClass: "stat-icon--passes",
        value: DATA.overview.residents,
        label: "Total Residents",
        context: "Active residents"
      },

      {
        icon: "fa-id-card",
        iconClass: "stat-icon--passes",
        value: DATA.overview.activePasses,
        label: "Active Passes",
        context: "Currently active"
      },

      {
        icon: "fa-person-walking-arrow-right",
        iconClass: "stat-icon--inside",
        value: DATA.overview.visitorsInside,
        label: "Visitors Inside",
        context: "Currently inside"
      },

      {
        icon: "fa-shield-halved",
        iconClass: "stat-icon--upcoming",
        value: DATA.overview.securityStaff,
        label: "Security Staff",
        context: "Registered personnel"
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
     GATE ACTIVITY
     ======================================================= */

  function renderGateActivity() {

    const wrap =
      document.getElementById("gate-activity-list");

    if (!wrap) return;

    if (!DATA.gateActivity.length) {

      wrap.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-door-open"></i>
          <strong>No gate activity yet</strong>
          <span>
            Entries and exits across the estate will appear here.
          </span>
        </div>
      `;

      return;
    }

    wrap.innerHTML = DATA.gateActivity.map(row => `

      <div class="visitor-card">

        <span class="visitor-avatar" aria-hidden="true">
          ${initials(row.visitor)}
        </span>

        <div class="visitor-info">

          <strong>${row.visitor}</strong>

          <span class="visitor-meta">
            <span>${row.resident}</span>
            <span>•</span>
            <span>${row.passType}</span>
            <span>•</span>
            <span>${row.time}</span>
          </span>

        </div>

        <div class="visitor-actions">
          ${statusBadge(row.status)}
        </div>

      </div>

    `).join("");
  }


  /* =======================================================
     ALERTS
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

        <span class="alert-icon">
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
     SUMMARY ROWS
     ======================================================= */

  function renderSummary(elementId, rows) {

    const wrap = document.getElementById(elementId);

    if (!wrap) return;

    wrap.innerHTML = rows.map(row => `

      <div class="details-row">

        <span>
          <span
            class="details-dot"
            style="background:${row.dot}"
          ></span>

          ${row.label}
        </span>

        <span>
          ${row.value}
        </span>

      </div>

    `).join("");
  }


  function renderResidentsSummary() {

    renderSummary("residents-summary", [

      {
        label: "Active",
        value: DATA.residents.active,
        dot: "var(--green)"
      },

      {
        label: "Pending Verification",
        value: DATA.residents.pending,
        dot: "var(--orange)"
      },

      {
        label: "Suspended",
        value: DATA.residents.suspended,
        dot: "var(--red)"
      }

    ]);
  }


  function renderSecuritySummary() {

    renderSummary("security-summary", [

      {
        label: "On Duty",
        value: DATA.security.onDuty,
        dot: "var(--green)"
      },

      {
        label: "Off Duty",
        value: DATA.security.offDuty,
        dot: "var(--text-muted)"
      },

      {
        label: "Pending Invitations",
        value: DATA.security.pendingInvitations,
        dot: "var(--orange)"
      }

    ]);
  }


  function renderPassesSummary() {

    renderSummary("passes-summary", [

      {
        label: "Active",
        value: DATA.passes.active,
        dot: "var(--green)"
      },

      {
        label: "Upcoming",
        value: DATA.passes.upcoming,
        dot: "var(--blue)"
      },

      {
        label: "Expired",
        value: DATA.passes.expired,
        dot: "var(--text-muted)"
      },

      {
        label: "Pending",
        value: DATA.passes.pending,
        dot: "var(--orange)"
      }

    ]);
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
            Estate-wide actions will show up here.
          </span>
        </li>
      `;

      return;
    }

    wrap.innerHTML = DATA.recentActivity.map(item => `

      <li class="activity-item">

        <span class="activity-icon">
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
      renderGateActivity();
      renderAlerts();
      renderResidentsSummary();
      renderSecuritySummary();
      renderPassesSummary();
      renderRecentActivity();
      renderQuickActions();
      renderNotifications();
    }

  };

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

    window.RafaraManager.DATA.notifications.forEach(
      notification => {
        notification.unread = false;
      }
    );

    window.RafaraManager.render.all();

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
        "manager-login.html";

    });

  });

})();


/* =========================================================
   INIT
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    window.RafaraManager.render.all();

  }
);