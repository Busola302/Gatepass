/* ==========================================================================
   RAFARA GATEPASS — RESIDENT NOTIFICATIONS
   Frontend-only demo logic. All data below is mock data.
   Structured so a backend/API layer can replace the "DATA" section later
   without touching the rendering/UI code, mirroring resident-dashboard.js.
   ========================================================================== */

(function () {
  "use strict";

  /* ========================================================================
     MOCK DATA
     "Today" for this demo is fixed to 2026-08-24 so the static mock dataset
     always groups and filters sensibly. A real backend integration would
     use the actual clock instead of TODAY below.
     ======================================================================== */

  const TODAY = "2026-08-24";

  let notifications = [
    {
      id: "NOT-001",
      category: "visitors",
      icon: "fa-user-group",
      title: "Visitor Arrived",
      description: "Your visitor John Doe has entered the estate.",
      visitorName: "John Doe",
      visitorPhone: "0803 555 2010",
      visitType: "One-Day Visitor",
      host: "Rahmah Ogunlaja",
      passReference: "RFP-20481",
      date: "2026-08-24",
      time: "14:14",
      read: false
    },
    {
      id: "NOT-002",
      category: "passes",
      icon: "fa-id-card",
      title: "Visitor Pass Created",
      description: "Your visitor pass for John Doe has been created successfully.",
      visitorName: "John Doe",
      passType: "One-Day Visitor",
      passReference: "RFP-20481",
      validity: "24 Aug 2026 · single entry",
      date: "2026-08-24",
      time: "13:48",
      read: true
    },
    {
      id: "NOT-003",
      category: "security",
      icon: "fa-shield-halved",
      title: "Access Verified",
      description: "Security verified your visitor's pass at the estate gate.",
      eventType: "Gate check-in",
      visitorName: "John Doe",
      passReference: "RFP-20481",
      verificationStatus: "Verified",
      date: "2026-08-24",
      time: "14:12",
      read: false
    },
    {
      id: "NOT-004",
      category: "visitors",
      icon: "fa-user-clock",
      title: "Visitor Expected",
      description: "David Johnson is expected to arrive today at 4:00 PM.",
      visitorName: "David Johnson",
      visitorPhone: "0807 442 1190",
      visitType: "One-Day Visitor",
      host: "Rahmah Ogunlaja",
      passReference: "RFP-20502",
      date: "2026-08-24",
      time: "09:00",
      read: true
    },
    {
      id: "NOT-005",
      category: "account",
      icon: "fa-user",
      title: "Profile Updated",
      description: "Your resident profile was updated successfully.",
      date: "2026-08-24",
      time: "08:20",
      read: true
    },
    {
      id: "NOT-006",
      category: "passes",
      icon: "fa-hourglass-half",
      title: "Pass Expiring Soon",
      description: "Sarah Ade's visitor pass expires in 2 days.",
      visitorName: "Sarah Ade",
      passType: "Multi-Day Visitor",
      passReference: "RFP-20390",
      validity: "Expires 26 Aug 2026",
      date: "2026-08-23",
      time: "17:30",
      read: false
    },
    {
      id: "NOT-007",
      category: "visitors",
      icon: "fa-right-from-bracket",
      title: "Visitor Checked Out",
      description: "John Doe has left the estate.",
      visitorName: "John Doe",
      visitType: "One-Day Visitor",
      host: "Rahmah Ogunlaja",
      passReference: "RFP-20481",
      date: "2026-08-23",
      time: "18:02",
      read: true
    },
    {
      id: "NOT-008",
      category: "visitors",
      icon: "fa-calendar-week",
      title: "Multi-Day Visitor Update",
      description: "Sarah Ade has entered the estate using her active multi-day visitor pass.",
      visitorName: "Sarah Ade",
      visitType: "Multi-Day Visitor",
      host: "Rahmah Ogunlaja",
      passReference: "RFP-20390",
      date: "2026-08-23",
      time: "10:15",
      read: true
    },
    {
      id: "NOT-009",
      category: "estate",
      icon: "fa-building-shield",
      title: "Estate Announcement",
      description: "A scheduled maintenance activity will take place within the estate.",
      announcementTitle: "Water supply maintenance",
      date: "2026-08-23",
      time: "07:00",
      read: false
    },
    {
      id: "NOT-010",
      category: "security",
      icon: "fa-shield-halved",
      title: "Gate Access Recorded",
      description: "An access event associated with your visitor pass has been recorded.",
      eventType: "Gate check-out",
      visitorName: "Michael Ade",
      passReference: "RFP-20355",
      verificationStatus: "Verified",
      date: "2026-08-21",
      time: "16:40",
      read: true
    },
    {
      id: "NOT-011",
      category: "passes",
      icon: "fa-id-card",
      title: "Pass Expired",
      description: "The visitor pass for Michael Ade has expired.",
      visitorName: "Michael Ade",
      passType: "Artisan",
      passReference: "RFP-20355",
      validity: "Expired 21 Aug 2026",
      date: "2026-08-21",
      time: "23:59",
      read: true
    },
    {
      id: "NOT-012",
      category: "passes",
      icon: "fa-calendar-plus",
      title: "Pass Extended",
      description: "Sarah Ade's multi-day visitor pass has been extended until August 30.",
      visitorName: "Sarah Ade",
      passType: "Multi-Day Visitor",
      passReference: "RFP-20390",
      validity: "Now valid through 30 Aug 2026",
      date: "2026-08-20",
      time: "11:05",
      read: true
    },
    {
      id: "NOT-013",
      category: "estate",
      icon: "fa-building-shield",
      title: "Estate Update",
      description: "Residents are reminded of updated visitor access procedures.",
      announcementTitle: "Updated visitor access procedure",
      date: "2026-08-15",
      time: "09:00",
      read: true
    },
    {
      id: "NOT-014",
      category: "account",
      icon: "fa-user-shield",
      title: "Account Security",
      description: "Your account information has been updated.",
      date: "2026-08-15",
      time: "14:50",
      read: true
    },
    {
      id: "NOT-015",
      category: "visitors",
      icon: "fa-screwdriver-wrench",
      title: "Visitor Arrived",
      description: "Your visitor Grace Okon, an artisan, has entered the estate.",
      visitorName: "Grace Okon",
      visitorPhone: "0701 220 8834",
      visitType: "Artisan",
      host: "Rahmah Ogunlaja",
      passReference: "RFP-20210",
      date: "2026-08-10",
      time: "09:40",
      read: true
    },
    {
      id: "NOT-016",
      category: "passes",
      icon: "fa-id-card",
      title: "Visitor Pass Created",
      description: "Your visitor pass for Grace Okon has been created successfully.",
      visitorName: "Grace Okon",
      passType: "Artisan",
      passReference: "RFP-20210",
      validity: "10 Aug 2026 · single entry",
      date: "2026-08-10",
      time: "08:55",
      read: true
    }
  ];

  const categoryLabels = {
    visitors: "Visitor",
    passes: "Pass",
    security: "Security",
    estate: "Estate",
    account: "Account"
  };

  const actionByCategory = {
    visitors: { label: "View Visitor", href: "resident-visitors.html" },
    passes: { label: "View Pass", href: "resident-passes.html" },
    security: { label: "View Activity", href: "resident-activity.html" },
    account: { label: "View Profile", href: "resident-profile.html" }
    // "estate" intentionally omitted — its action opens the details modal
  };

  /* ========================================================================
     FILTER / SORT STATE
     ======================================================================== */

  const state = {
    searchTerm: "",
    status: "all",
    category: "all",
    dateRange: "all",
    sortOrder: "newest"
  };

  /* ========================================================================
     SMALL HELPERS
     ======================================================================== */

  function escapeHtml(str) {
    if (!str) return "";
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function parseDate(dateStr) {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d);
  }

  function dayDiff(dateStr) {
    return Math.round((parseDate(TODAY) - parseDate(dateStr)) / 86400000);
  }

  function formatLongDate(dateStr) {
    return parseDate(dateStr).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  }

  function formatTime(timeStr) {
    const [h, m] = timeStr.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
  }

  function relativeDateLabel(dateStr) {
    const diff = dayDiff(dateStr);
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    return formatLongDate(dateStr);
  }

  function shortMeta(n) {
    return `${relativeDateLabel(n.date)} · ${formatTime(n.time)}`;
  }

  /* Expose shared state on a namespace, mirroring window.RafaraDashboard */
  window.RafaraNotifications = {
    get notifications() { return notifications; },
    categoryLabels,
    actionByCategory,
    state,
    helpers: { escapeHtml, dayDiff, formatLongDate, formatTime, relativeDateLabel, shortMeta },
    mutators: {
      markRead: (id) => {
        const n = notifications.find((x) => x.id === id);
        if (n) n.read = true;
      },
      markUnread: (id) => {
        const n = notifications.find((x) => x.id === id);
        if (n) n.read = false;
      },
      markAllRead: () => notifications.forEach((n) => (n.read = true))
    }
  };
})();

/* ==========================================================================
   FILTERING, SORTING & GROUPING
   ========================================================================== */

(function () {
  "use strict";

  const D = window.RafaraNotifications;
  const H = D.helpers;

  function matchesSearch(n, term) {
    if (!term) return true;
    const haystack = [n.title, n.description, n.visitorName, n.passReference, n.category, n.announcementTitle]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(term.toLowerCase());
  }

  function matchesStatus(n, status) {
    if (status === "all") return true;
    return status === "unread" ? n.read === false : n.read === true;
  }

  function matchesCategory(n, category) {
    return category === "all" || n.category === category;
  }

  function matchesDateRange(n, range) {
    const diff = H.dayDiff(n.date);
    switch (range) {
      case "today": return diff === 0;
      case "yesterday": return diff === 1;
      case "week": return diff >= 0 && diff <= 7;
      case "month": return diff >= 0 && diff <= 31;
      default: return true;
    }
  }

  function filterNotifications() {
    return D.notifications.filter(
      (n) =>
        matchesSearch(n, D.state.searchTerm) &&
        matchesStatus(n, D.state.status) &&
        matchesCategory(n, D.state.category) &&
        matchesDateRange(n, D.state.dateRange)
    );
  }

  function sortNotifications(list) {
    const sorted = [...list].sort((a, b) => {
      const aKey = a.date + " " + a.time;
      const bKey = b.date + " " + b.time;
      return aKey < bKey ? -1 : aKey > bKey ? 1 : 0;
    });
    if (D.state.sortOrder === "newest") sorted.reverse();
    return sorted;
  }

  function groupByDate(list) {
    const groups = [];
    const map = new Map();
    list.forEach((n) => {
      if (!map.has(n.date)) {
        const group = { label: H.relativeDateLabel(n.date), date: n.date, items: [] };
        map.set(n.date, group);
        groups.push(group);
      }
      map.get(n.date).items.push(n);
    });
    return groups;
  }

  D.query = { filterNotifications, sortNotifications, groupByDate };
})();

/* ==========================================================================
   RENDERING
   ========================================================================== */

(function () {
  "use strict";

  const D = window.RafaraNotifications;
  const H = D.helpers;

  /* ---------- Statistics ---------- */
  function renderStats() {
    const unreadCount = D.notifications.filter((n) => !n.read).length;
    const todayCount = D.notifications.filter((n) => H.dayDiff(n.date) === 0).length;
    const visitorCount = D.notifications.filter((n) => n.category === "visitors").length;
    const securityCount = D.notifications.filter((n) => n.category === "security").length;

    document.getElementById("stat-unread").textContent = unreadCount;
    document.getElementById("stat-today").textContent = todayCount;
    document.getElementById("stat-visitors").textContent = visitorCount;
    document.getElementById("stat-security").textContent = securityCount;

    updateUnreadIndicators(unreadCount);
  }

  function updateUnreadIndicators(unreadCount) {
    const sidebarBadge = document.getElementById("sidebar-notif-count");
    const mobileDot = document.getElementById("mobile-notif-dot");

    sidebarBadge.hidden = unreadCount === 0;
    sidebarBadge.textContent = unreadCount;
    mobileDot.hidden = unreadCount === 0;
  }

  /* ---------- Notification card ---------- */
  function notificationCardHtml(n) {
    const categoryLabel = D.categoryLabels[n.category] || n.category;
    const action = D.actionByCategory[n.category];

    const actionHtml = action
      ? `<a class="notification-link-btn" href="${action.href}" data-notif-action="${n.id}">${action.label}</a>`
      : "";

    const unreadDotHtml = n.read
      ? ""
      : `<span class="notification-unread-dot" role="img" aria-label="Unread notification"></span>`;

    const refHtml = n.passReference
      ? `<span class="meta-dot" aria-hidden="true"></span><span class="notification-meta">${n.passReference}</span>`
      : "";

    return `
      <article class="notification-card ${n.read ? "" : "is-unread"}" data-id="${n.id}">
        <span class="notification-icon" aria-hidden="true"><i class="fa-solid ${n.icon}"></i></span>
        <div class="notification-body">
          <div class="notification-top-row">
            <h3 class="notification-title">${H.escapeHtml(n.title)}</h3>
            ${unreadDotHtml}
          </div>
          <p class="notification-desc">${H.escapeHtml(n.description)}</p>
          <div class="notification-meta-row">
            <span class="notification-meta">${H.shortMeta(n)}</span>
            <span class="meta-dot" aria-hidden="true"></span>
            <span class="category-badge">${categoryLabel}</span>
            ${refHtml}
          </div>
          <div class="notification-actions-row">
            <button type="button" class="notification-toggle-btn" data-toggle-read="${n.id}">
              ${n.read ? "Mark as unread" : "Mark as read"}
            </button>
            ${actionHtml}
            <button type="button" class="notification-link-btn" data-view-details="${n.id}">View Details</button>
          </div>
        </div>
      </article>`;
  }

  function emptyStateHtml() {
    const hasActiveFilter =
      D.state.searchTerm.trim() !== "" ||
      D.state.category !== "all" ||
      D.state.dateRange !== "all" ||
      (D.state.status !== "all" && D.state.status !== "unread");

    if (D.state.status === "unread" && !hasActiveFilter) {
      return `
        <div class="empty-state">
          <i class="fa-solid fa-bell" aria-hidden="true"></i>
          <strong>No Unread Notifications</strong>
          <span>You're all caught up. There are no unread notifications.</span>
          <button type="button" class="btn btn--secondary" id="view-all-from-unread-btn">View All Notifications</button>
        </div>`;
    }

    if (D.notifications.length === 0) {
      return `
        <div class="empty-state">
          <i class="fa-solid fa-bell" aria-hidden="true"></i>
          <strong>You're All Caught Up</strong>
          <span>New updates about your visitors, passes, security activity, and estate will appear here.</span>
          <a class="btn btn--secondary" href="resident-activity.html">View Activity</a>
        </div>`;
    }

    return `
      <div class="empty-state">
        <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
        <strong>No Notifications Found</strong>
        <span>Try adjusting your search or filters.</span>
        <button type="button" class="btn btn--secondary" id="clear-filters-btn">Clear Filters</button>
      </div>`;
  }

  function renderNotifications() {
    const filtered = D.query.sortNotifications(D.query.filterNotifications());
    const groups = D.query.groupByDate(filtered);
    const container = document.getElementById("notification-groups");
    const countEl = document.getElementById("notif-result-count");

    countEl.textContent = filtered.length
      ? `${filtered.length} ${filtered.length === 1 ? "notification" : "notifications"}`
      : "";

    if (!filtered.length) {
      container.innerHTML = emptyStateHtml();
      return;
    }

    container.innerHTML = groups
      .map(
        (group) => `
          <div class="date-group">
            <p class="date-group-label">${group.label.toUpperCase()}</p>
            <div class="notification-cards">
              ${group.items.map(notificationCardHtml).join("")}
            </div>
          </div>`
      )
      .join("");
  }

  D.render = function renderAll() {
    renderStats();
    renderNotifications();
  };
  D.renderStats = renderStats;
  D.renderNotifications = renderNotifications;

  document.addEventListener("DOMContentLoaded", D.render);
})();

/* ==========================================================================
   TOASTS
   ========================================================================== */

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

    const timer = setTimeout(dismiss, 3200);

    function dismiss() {
      clearTimeout(timer);
      toast.classList.add("is-leaving");
      toast.addEventListener("animationend", () => toast.remove(), { once: true });
    }
  }

  window.RafaraNotifications.toast = showToast;
})();

/* ==========================================================================
   MODALS
   ========================================================================== */

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

    if (!document.querySelector(".modal-overlay:not([hidden])")) {
      document.body.style.overflow = "";
    }
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

  window.RafaraNotifications.modal = { open: openModal, close: closeModal };
})();

/* ==========================================================================
   DROPDOWNS (profile menu)
   ========================================================================== */

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
})();

/* ==========================================================================
   SIDEBAR TOGGLE (tablet/small-desktop drawer) + MOBILE "MORE" SHEET
   ========================================================================== */

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
    window.RafaraNotifications.modal.open("modal-logout");
  });
})();

/* ==========================================================================
   LOGOUT
   ========================================================================== */

(function () {
  "use strict";
  const M = window.RafaraNotifications.modal;

  document.getElementById("logout-btn").addEventListener("click", () => M.open("modal-logout"));
  document.getElementById("dropdown-logout-btn").addEventListener("click", () => {
    document.querySelectorAll(".dropdown-panel").forEach((p) => (p.hidden = true));
    M.open("modal-logout");
  });

  document.getElementById("confirm-logout-btn").addEventListener("click", () => {
    window.RafaraNotifications.toast("Logging you out…", "fa-arrow-right-from-bracket");
    setTimeout(() => {
      window.location.href = "resident-login.html";
    }, 700);
  });
})();

/* ==========================================================================
   READ / UNREAD ACTIONS + MARK ALL AS READ
   ========================================================================== */

(function () {
  "use strict";

  const D = window.RafaraNotifications;

  function toggleRead(id) {
    const n = D.notifications.find((x) => x.id === id);
    if (!n) return;
    if (n.read) {
      D.mutators.markUnread(id);
      D.render();
      D.toast("Notification marked as unread.", "fa-envelope");
    } else {
      D.mutators.markRead(id);
      D.render();
      D.toast("Notification marked as read.", "fa-check");
    }
  }

  document.getElementById("mark-all-read-btn").addEventListener("click", () => {
    const anyUnread = D.notifications.some((n) => !n.read);
    if (!anyUnread) {
      D.toast("You're all caught up.", "fa-check-double");
      return;
    }
    D.mutators.markAllRead();
    D.render();
    D.toast("All notifications marked as read.", "fa-check-double");
  });

  document.getElementById("notification-groups").addEventListener("click", (e) => {
    const toggleBtn = e.target.closest("[data-toggle-read]");
    if (toggleBtn) {
      toggleRead(toggleBtn.getAttribute("data-toggle-read"));
      return;
    }
    const viewBtn = e.target.closest("[data-view-details]");
    if (viewBtn) {
      window.RafaraNotificationsDetails.open(viewBtn.getAttribute("data-view-details"));
    }
  });

  // Delegated because the empty state re-renders inside #notification-groups
  document.getElementById("notification-groups").addEventListener("click", (e) => {
    if (e.target.closest("#view-all-from-unread-btn")) {
      D.state.status = "all";
      document.getElementById("status-filter").value = "all";
      D.renderNotifications();
    }
    if (e.target.closest("#clear-filters-btn")) {
      window.RafaraNotificationsFilters.clearFilters();
    }
  });

})();

/* ==========================================================================
   NOTIFICATION DETAILS MODAL
   ========================================================================== */

(function () {
  "use strict";

  const D = window.RafaraNotifications;
  const H = D.helpers;
  const M = D.modal;

  function fact(label, value) {
    return `<div class="details-row"><span>${label}</span><span>${H.escapeHtml(String(value))}</span></div>`;
  }

  function relatedRows(n) {
    if (n.category === "visitors") {
      return [
        n.visitorName && fact("Visitor", n.visitorName),
        n.visitorPhone && fact("Phone", n.visitorPhone),
        n.visitType && fact("Visit type", n.visitType),
        n.host && fact("Host", n.host),
        n.passReference && fact("Pass", n.passReference)
      ];
    }
    if (n.category === "passes") {
      return [
        n.passReference && fact("Pass", n.passReference),
        n.passType && fact("Pass type", n.passType),
        n.validity && fact("Validity", n.validity),
        n.visitorName && fact("Visitor", n.visitorName)
      ];
    }
    if (n.category === "security") {
      return [
        n.eventType && fact("Event type", n.eventType),
        n.visitorName && fact("Visitor", n.visitorName),
        n.passReference && fact("Pass", n.passReference),
        fact("Time", H.formatTime(n.time)),
        n.verificationStatus && fact("Verification", n.verificationStatus)
      ];
    }
    if (n.category === "estate") {
      return [n.announcementTitle && fact("Announcement", n.announcementTitle), fact("Date", H.formatLongDate(n.date))];
    }
    return [];
  }

  function buildBody(n) {
    const categoryLabel = D.categoryLabels[n.category] || n.category;
    const rows = relatedRows(n).filter(Boolean);
    const action = D.actionByCategory[n.category];

    const footerAction = action
      ? `<a class="btn btn--secondary" href="${action.href}">${action.label}</a>`
      : "";

    return `
      <p class="modal-notif-title">${H.escapeHtml(n.title)}</p>
      <span class="modal-category-tag">${categoryLabel}</span>
      <p class="modal-message">${H.escapeHtml(n.description)}</p>
      <div class="details-block">
        ${fact("Date", H.formatLongDate(n.date))}
        ${fact("Time", H.formatTime(n.time))}
        ${fact("Status", n.read ? "Read" : "Unread")}
      </div>
      ${
        rows.length
          ? `<p class="modal-section-label">Related Information</p><div class="details-block modal-related-block">${rows.join("")}</div>`
          : ""
      }
      <div class="modal-actions">
        ${footerAction}
        <button type="button" class="btn btn--ghost" data-close-modal>Close</button>
      </div>`;
  }

  function open(id) {
    const n = D.notifications.find((x) => x.id === id);
    if (!n) return;

    document.getElementById("modal-notif-details-title").textContent = "Notification Details";
    document.getElementById("modal-notif-details-body").innerHTML = buildBody(n);
    M.open("modal-notif-details");

    if (!n.read) {
      D.mutators.markRead(id);
      D.render();
    }
  }

  window.RafaraNotificationsDetails = window.RafaraNotificationsDetails || {};
  window.RafaraNotificationsDetails.open = open;
})();

/* ==========================================================================
   SEARCH / FILTERS / SORT WIRING
   ========================================================================== */

(function () {
  "use strict";

  const D = window.RafaraNotifications;

  const searchInput = document.getElementById("search-input");
  const statusFilter = document.getElementById("status-filter");
  const categoryFilter = document.getElementById("category-filter");
  const dateFilter = document.getElementById("date-filter");
  const sortOrder = document.getElementById("sort-order");

  searchInput.addEventListener("input", (e) => {
    D.state.searchTerm = e.target.value;
    D.renderNotifications();
  });
  statusFilter.addEventListener("change", (e) => {
    D.state.status = e.target.value;
    D.renderNotifications();
  });
  categoryFilter.addEventListener("change", (e) => {
    D.state.category = e.target.value;
    D.renderNotifications();
  });
  dateFilter.addEventListener("change", (e) => {
    D.state.dateRange = e.target.value;
    D.renderNotifications();
  });
  sortOrder.addEventListener("change", (e) => {
    D.state.sortOrder = e.target.value;
    D.renderNotifications();
  });

  function clearFilters() {
    D.state.searchTerm = "";
    D.state.status = "all";
    D.state.category = "all";
    D.state.dateRange = "all";
    D.state.sortOrder = "newest";

    searchInput.value = "";
    statusFilter.value = "all";
    categoryFilter.value = "all";
    dateFilter.value = "all";
    sortOrder.value = "newest";

    D.renderNotifications();
    D.toast("Filters cleared.", "fa-filter-circle-xmark");
  }

  window.RafaraNotificationsFilters = { clearFilters };
})();
