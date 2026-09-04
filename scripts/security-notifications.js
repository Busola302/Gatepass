/* =========================================================
   RAFARA GATEPASS — SECURITY NOTIFICATIONS PAGE
   Frontend demo logic
   ========================================================= */

(function () {
  "use strict";

  window.RafaraSecurity = window.RafaraSecurity || {};

  /* =======================================================
     MOCK DATA
     ======================================================= */

  window.RafaraSecurity.NOTIF_DATA = [

    {
      id: "n1",
      category: "visitor",
      priority: "normal",
      icon: "fa-user-clock",
      title: "New visitor expected",
      desc: "Aisha Bello is expected to arrive at 10:30 AM to visit Rahmah Ogunlaja in B5-F8.",
      time: "10 minutes ago",
      dateLabel: "Today · 10:20 AM",
      unread: true,
      related: {
        visitor: "Aisha Bello",
        resident: "Rahmah Ogunlaja",
        unit: "B5-F8",
        passType: "One-Day Visitor"
      },
      action: { label: "View Visitor", href: "security-visitors.html" }
    },

    {
      id: "n2",
      category: "pass",
      priority: "important",
      icon: "fa-ban",
      title: "Pass cancelled",
      desc: "Pass #RF4827 for Aisha Bello has been cancelled by the resident.",
      time: "Today · 9:42 AM",
      dateLabel: "Today · 9:42 AM",
      unread: true,
      related: {
        visitor: "Aisha Bello",
        passCode: "RF4827",
        passType: "One-Day Visitor"
      },
      action: { label: "View Pass", href: "security-passes.html" }
    },

    {
      id: "n3",
      category: "alert",
      priority: "alert",
      icon: "fa-circle-xmark",
      title: "Access denied — expired pass",
      desc: "A visitor was denied entry at Gate 2 because their pass had expired.",
      time: "Today · 7:58 AM",
      dateLabel: "Today · 7:58 AM",
      unread: true,
      related: {
        gate: "Gate 2"
      },
      action: { label: "View Activity", href: "security-activity.html" }
    },

    {
      id: "n4",
      category: "manager",
      priority: "important",
      icon: "fa-bullhorn",
      title: "Estate Manager notice",
      desc: "Security officers are reminded to verify all visitor passes before granting access.",
      time: "Today · 8:15 AM",
      dateLabel: "Today · 8:15 AM",
      unread: false,
      isOfficial: true,
      related: {
        postedBy: "Estate Manager"
      },
      action: null
    },

    {
      id: "n5",
      category: "pass",
      priority: "normal",
      icon: "fa-hourglass-half",
      title: "Pass expiring soon",
      desc: "Pass #RF1655 for Grace Nnamdi will expire in 30 minutes.",
      time: "Today · 7:30 AM",
      dateLabel: "Today · 7:30 AM",
      unread: false,
      related: {
        visitor: "Grace Nnamdi",
        passCode: "RF1655",
        passType: "One-Day Visitor"
      },
      action: { label: "View Pass", href: "security-passes.html" }
    },

    {
      id: "n6",
      category: "visitor",
      priority: "normal",
      icon: "fa-door-open",
      title: "Visitor checked in",
      desc: "Samuel Iortyer checked in to visit N. Chukwu in BC1-F7.",
      time: "Today · 9:58 AM",
      dateLabel: "Today · 9:58 AM",
      unread: false,
      related: {
        visitor: "Samuel Iortyer",
        resident: "N. Chukwu",
        unit: "BC1-F7"
      },
      action: { label: "View Visitor", href: "security-visitors.html" }
    },

    {
      id: "n7",
      category: "alert",
      priority: "alert",
      icon: "fa-triangle-exclamation",
      title: "Repeated invalid pass attempts",
      desc: "Gate 2 recorded 3 invalid pass code attempts within 10 minutes.",
      time: "Yesterday · 6:40 PM",
      dateLabel: "Yesterday · 6:40 PM",
      unread: true,
      related: {
        gate: "Gate 2"
      },
      action: { label: "View Activity", href: "security-activity.html" }
    },

    {
      id: "n8",
      category: "manager",
      priority: "normal",
      icon: "fa-bullhorn",
      title: "Estate Manager notice",
      desc: "The weekend shift schedule has been updated. Check the new roster on the noticeboard.",
      time: "Yesterday · 5:00 PM",
      dateLabel: "Yesterday · 5:00 PM",
      unread: false,
      isOfficial: true,
      related: {
        postedBy: "Estate Manager"
      },
      action: null
    },

    {
      id: "n9",
      category: "visitor",
      priority: "normal",
      icon: "fa-right-from-bracket",
      title: "Visitor checked out",
      desc: "David Adeyemi checked out after visiting F. Eze in B20-F5.",
      time: "Yesterday · 4:12 PM",
      dateLabel: "Yesterday · 4:12 PM",
      unread: false,
      related: {
        visitor: "David Adeyemi",
        resident: "F. Eze",
        unit: "B20-F5"
      },
      action: { label: "View Visitor", href: "security-visitors.html" }
    },

    {
      id: "n10",
      category: "pass",
      priority: "normal",
      icon: "fa-id-card",
      title: "Pass becoming active",
      desc: "Pass #RF2210 for Ibrahim Musa becomes active today at 9:00 AM.",
      time: "Yesterday · 8:00 AM",
      dateLabel: "Yesterday · 8:00 AM",
      unread: true,
      related: {
        visitor: "Ibrahim Musa",
        passCode: "RF2210",
        passType: "Multi-Day"
      },
      action: { label: "View Pass", href: "security-passes.html" }
    }

  ];

})();


/* =========================================================
   RENDERING
   ========================================================= */

(function () {

  "use strict";

  const NS = window.RafaraSecurity;
  const DATA = NS.NOTIF_DATA;

  const CATEGORY_LABEL = {
    visitor: "Visitor Update",
    pass: "Pass Update",
    alert: "Security Alert",
    manager: "Manager Notice"
  };

  const FILTERS = [
    { key: "all", label: "All" },
    { key: "unread", label: "Unread" },
    { key: "alert", label: "Security Alerts" },
    { key: "visitor", label: "Visitor Updates" },
    { key: "pass", label: "Pass Updates" },
    { key: "manager", label: "Manager Notices" }
  ];

  let activeFilter = "all";
  let activeNotifId = null;

  function iconToneClass(priority, category) {
    if (category === "manager") return "notif-feed-icon--manager";
    if (priority === "alert") return "notif-feed-icon--alert";
    if (priority === "important") return "notif-feed-icon--important";
    return "";
  }

  function matchesFilter(notification, filter) {
    if (filter === "all") return true;
    if (filter === "unread") return notification.unread;
    return notification.category === filter;
  }

  function unreadCount() {
    return DATA.filter(notification => notification.unread).length;
  }

  function alertCount() {
    return DATA.filter(notification => notification.category === "alert").length;
  }

  function filterCount(key) {
    if (key === "all") return DATA.length;
    if (key === "unread") return unreadCount();
    return DATA.filter(notification => notification.category === key).length;
  }


  /* =======================================================
     SUMMARY STRIP
     ======================================================= */

  function renderSummary() {

    const wrap = document.getElementById("notif-summary-grid");
    if (!wrap) return;

    const cards = [
      {
        icon: "fa-bell",
        cls: "notif-summary-icon--all",
        value: DATA.length,
        label: "All Notifications"
      },
      {
        icon: "fa-envelope",
        cls: "notif-summary-icon--unread",
        value: unreadCount(),
        label: "Unread"
      },
      {
        icon: "fa-triangle-exclamation",
        cls: "notif-summary-icon--alerts",
        value: alertCount(),
        label: "Security Alerts"
      }
    ];

    wrap.innerHTML = cards.map(card => `

      <article class="notif-summary-card">

        <span class="notif-summary-icon ${card.cls}">
          <i class="fa-solid ${card.icon}" aria-hidden="true"></i>
        </span>

        <span>
          <span class="notif-summary-number">${card.value}</span>
          <span class="notif-summary-label">${card.label}</span>
        </span>

      </article>

    `).join("");
  }


  /* =======================================================
     FILTERS
     ======================================================= */

  function renderFilters() {

    const wrap = document.getElementById("notif-filters");
    if (!wrap) return;

    wrap.innerHTML = FILTERS.map(filter => `

      <button
        type="button"
        class="notif-filter-chip${filter.key === activeFilter ? " is-active" : ""}"
        data-filter="${filter.key}"
      >
        ${filter.label}
        <span class="notif-filter-count">${filterCount(filter.key)}</span>
      </button>

    `).join("");

    wrap.querySelectorAll(".notif-filter-chip").forEach(chip => {

      chip.addEventListener("click", () => {
        activeFilter = chip.dataset.filter;
        renderFilters();
        renderList();
      });

    });
  }


  /* =======================================================
     TOP-LEVEL MARK-ALL BUTTON VISIBILITY
     ======================================================= */

  function syncMarkAllButton() {

    const btn = document.getElementById("mark-all-read-page-btn");
    if (!btn) return;

    btn.hidden = unreadCount() === 0;
  }


  /* =======================================================
     FEED LIST
     ======================================================= */

  function emptyStateFor(filter) {

    if (filter === "unread") {
      return {
        icon: "fa-envelope-open-text",
        title: "No unread notifications",
        body: "You've read all your notifications."
      };
    }

    if (filter === "alert") {
      return {
        icon: "fa-shield",
        title: "No security alerts",
        body: "There are currently no security alerts requiring your attention."
      };
    }

    if (filter === "all") {
      return {
        icon: "fa-bell-slash",
        title: "You're all caught up",
        body: "There are no notifications to display right now."
      };
    }

    return {
      icon: "fa-filter",
      title: "No notifications found",
      body: "Try another filter."
    };
  }

  function renderList() {

    const wrap = document.getElementById("notif-feed-list");
    if (!wrap) return;

    const visible = DATA.filter(notification => matchesFilter(notification, activeFilter));

    if (!visible.length) {

      const empty = emptyStateFor(activeFilter);

      wrap.innerHTML = `
        <div class="empty-state empty-state--page">
          <i class="fa-solid ${empty.icon}"></i>
          <strong>${empty.title}</strong>
          <span>${empty.body}</span>
        </div>
      `;

      return;
    }

    wrap.innerHTML = visible.map(notification => `

      <button
        type="button"
        class="notif-feed-card${notification.unread ? " is-unread" : ""}"
        data-priority="${notification.priority}"
        data-id="${notification.id}"
      >

        <span class="notif-feed-icon ${iconToneClass(notification.priority, notification.category)}">
          <i class="fa-solid ${notification.icon}" aria-hidden="true"></i>
        </span>

        <span class="notif-feed-body">

          <span class="notif-feed-top">

            <span class="notif-feed-title-row">
              <span class="notif-feed-title">${notification.title}</span>
              ${notification.unread ? `<span class="notif-feed-unread-dot"></span>` : ""}
            </span>

            ${notification.isOfficial
              ? `<span class="notif-official-tag"><i class="fa-solid fa-building-shield" aria-hidden="true"></i> Official</span>`
              : ""
            }

          </span>

          <span class="notif-feed-desc">${notification.desc}</span>

          <span class="notif-feed-meta">
            <span class="notif-cat-pill">${CATEGORY_LABEL[notification.category]}</span>
            <span class="notif-feed-time">${notification.time}</span>
          </span>

        </span>

      </button>

    `).join("");

    wrap.querySelectorAll(".notif-feed-card").forEach(card => {

      card.addEventListener("click", () => {
        openDrawer(card.dataset.id);
      });

    });
  }


  /* =======================================================
     DETAIL DRAWER
     ======================================================= */

  const PRIORITY_LABEL = {
    normal: "Normal",
    important: "Important",
    alert: "Alert"
  };

  const RELATED_ROW_LABEL = {
    visitor: "Visitor",
    resident: "Resident",
    unit: "Unit",
    passCode: "Pass Code",
    passType: "Pass Type",
    gate: "Gate",
    postedBy: "Posted By"
  };

  function findNotification(id) {
    return DATA.find(notification => notification.id === id);
  }

  function markAsRead(id) {

    const notification = findNotification(id);
    if (!notification || !notification.unread) return;

    notification.unread = false;

    renderSummary();
    renderFilters();
    renderList();
    syncMarkAllButton();
  }

  function openDrawer(id) {

    const notification = findNotification(id);
    if (!notification) return;

    activeNotifId = id;

    const backdrop = document.getElementById("notif-drawer-backdrop");
    const drawer = document.getElementById("notif-drawer");
    const titleEl = document.getElementById("notif-drawer-title");
    const eyebrowEl = document.getElementById("notif-drawer-eyebrow");
    const messageEl = document.getElementById("notif-drawer-message");
    const dateEl = document.getElementById("notif-drawer-date");
    const relatedWrap = document.getElementById("notif-drawer-related");
    const relatedLabel = document.getElementById("notif-drawer-related-label");
    const footer = document.getElementById("notif-drawer-footer");

    if (!backdrop || !drawer) return;

    titleEl.textContent = notification.title;

    eyebrowEl.innerHTML = `
      <span class="priority-pill priority-pill--${notification.priority}">
        <i class="fa-solid fa-circle" aria-hidden="true"></i>
        ${PRIORITY_LABEL[notification.priority]}
      </span>
      <span>${CATEGORY_LABEL[notification.category]}</span>
    `;

    messageEl.textContent = notification.desc;
    dateEl.textContent = notification.dateLabel;

    const relatedEntries = Object.entries(notification.related || {});

    if (relatedEntries.length) {

      relatedLabel.hidden = false;

      relatedWrap.hidden = false;
      relatedWrap.innerHTML = relatedEntries.map(([key, value]) => `
        <div class="details-row">
          <span>${RELATED_ROW_LABEL[key] || key}</span>
          <span>${value}</span>
        </div>
      `).join("");

    } else {

      relatedLabel.hidden = true;
      relatedWrap.hidden = true;
      relatedWrap.innerHTML = "";
    }

    footer.innerHTML = "";

    if (notification.unread) {

      const markBtn = document.createElement("button");
      markBtn.type = "button";
      markBtn.className = "btn btn--secondary";
      markBtn.innerHTML = `<i class="fa-solid fa-check" aria-hidden="true"></i> Mark as read`;

      markBtn.addEventListener("click", () => {
        markAsRead(notification.id);
        markBtn.remove();
      });

      footer.appendChild(markBtn);
    }

    if (notification.action) {

      const actionLink = document.createElement("a");
      actionLink.className = "btn btn--primary";
      actionLink.href = notification.action.href;
      actionLink.innerHTML = `${notification.action.label} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>`;

      footer.appendChild(actionLink);
    }

    backdrop.classList.add("is-open");
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    // Opening a notification marks it read, per the Rafara read-state rule.
    if (notification.unread) {
      markAsRead(notification.id);
    }
  }

  function closeDrawer() {

    const backdrop = document.getElementById("notif-drawer-backdrop");
    const drawer = document.getElementById("notif-drawer");

    if (!backdrop || !drawer) return;

    backdrop.classList.remove("is-open");
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    activeNotifId = null;
  }

  function initDrawer() {

    const backdrop = document.getElementById("notif-drawer-backdrop");
    const closeBtn = document.getElementById("notif-drawer-close-btn");

    if (backdrop) {
      backdrop.addEventListener("click", closeDrawer);
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", closeDrawer);
    }

    document.addEventListener("keydown", event => {

      if (event.key === "Escape" && activeNotifId) {
        closeDrawer();
      }

    });
  }


  /* =======================================================
     MARK ALL AS READ (page-level)
     ======================================================= */

  function initMarkAllButton() {

    const btn = document.getElementById("mark-all-read-page-btn");
    if (!btn) return;

    btn.addEventListener("click", () => {

      DATA.forEach(notification => {
        notification.unread = false;
      });

      renderSummary();
      renderFilters();
      renderList();
      syncMarkAllButton();
    });
  }


  /* =======================================================
     TOPBAR NOTIFICATION DROPDOWN (shared component)
     ======================================================= */

  function renderTopbarNotifDropdown() {

    const list = document.getElementById("notif-panel-list");
    const dot = document.getElementById("notif-dot");
    const sidebarCount = document.getElementById("sidebar-notif-count");

    const unread = unreadCount();

    if (list) {

      const preview = DATA.slice(0, 4);

      list.innerHTML = preview.map(notification => `

        <div class="notif-item${notification.unread ? " is-unread" : ""}">

          <span class="notif-icon">
            <i class="fa-solid ${notification.icon}"></i>
          </span>

          <div class="notif-body">
            <strong>${notification.title}</strong>
            <p>${notification.desc}</p>
            <span class="notif-time">${notification.time}</span>
          </div>

          ${notification.unread ? `<span class="notif-unread-dot"></span>` : ""}

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

  const originalRenderList = renderList;

  NS.notifRenderAll = function () {
    renderSummary();
    renderFilters();
    renderList();
    syncMarkAllButton();
    renderTopbarNotifDropdown();
  };

  NS.notifInit = function () {
    initDrawer();
    initMarkAllButton();
    NS.notifRenderAll();
  };

})();


/* =========================================================
   TOPBAR "MARK ALL READ" (mini dropdown button)
   ========================================================= */

(function () {

  const button = document.getElementById("mark-all-read-btn");
  if (!button) return;

  button.addEventListener("click", () => {

    window.RafaraSecurity.NOTIF_DATA.forEach(notification => {
      notification.unread = false;
    });

    window.RafaraSecurity.notifRenderAll();
  });

})();


/* =========================================================
   SIDEBAR DRAWER (tablet)
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
    if (event.key === "Escape") {
      closeSidebar();
    }
  });

})();


/* =========================================================
   DROPDOWNS (notifications bell / profile)
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
    if (event.key === "Escape" && !sheet.hidden) {
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
  window.RafaraSecurity.notifInit();
});
