/* ==========================================================================
   RAFARA GATEPASS — RESIDENT DASHBOARD
   Frontend-only demo logic. All data below is mock data.
   Structured so a backend/API layer can replace the "DATA" and "API-like"
   sections later without touching the rendering/UI code.
   ========================================================================== */

(function () {
  "use strict";

  /* ========================================================================
     MOCK DATA
     ======================================================================== */

  const resident = {
    firstName: "Rahmah",
    lastName: "Ogunlaja",
    fullName: "Rahmah Ogunlaja",
    initials: "RO",
    email: "rahmah.ogunlaja@example.com",
    phone: "+234 803 555 0192",
    estate: "Millennium Housing Estate",
    block: "C",
    unit: "Flat 4",
    residentType: "Family Member",
    verificationStatus: "Verified"
  };

  // Pass lifecycle reference (for details modal + product logic, demo only)
  const PASS_LIFECYCLES = {
    "one-day": ["Created", "Approved", "Checked In", "Checked Out", "Closed"],
    "multi-day": ["Created", "Active", "Checked In / Out (repeats)", "Expired or Ended", "Closed"],
    artisan: ["Created", "Approved", "Checked In", "Checked Out", "Closed"],
    exit: ["Created", "Pending", "Verified by Security", "Property Exited", "Closed"]
  };

  let passIdCounter = 1005;
  let visitorIdCounter = 3005;
  let notifIdCounter = 4005;
  let activityIdCounter = 5010;

  // Mock passes
  let passes = [
    {
      id: "RFP-1001",
      type: "one-day",
      typeLabel: "One-Day Visitor Pass",
      personOrItem: "John Doe",
      validText: "Aug 23, 2026",
      status: "active",
      currentStep: 2, // index into PASS_LIFECYCLES["one-day"]
      linkedVisitorId: "V-01"
    },
    {
      id: "RFP-1002",
      type: "multi-day",
      typeLabel: "Multi-Day Visitor Pass",
      personOrItem: "Sarah Ade",
      validText: "Aug 23 – Aug 30",
      status: "active",
      currentStep: 1,
      linkedVisitorId: "V-02"
    },
    {
      id: "RFP-1003",
      type: "artisan",
      typeLabel: "Artisan Pass",
      personOrItem: "Michael Plumbing Services",
      validText: "Aug 23, 2026",
      status: "active",
      currentStep: 2
    },
    {
      id: "RFP-1004",
      type: "exit",
      typeLabel: "Property Exit Pass",
      personOrItem: "Samsung Refrigerator",
      validText: "Today",
      status: "pending",
      currentStep: 1
    }
  ];

  // Mock visitors currently inside
  let activeVisitors = [
    {
      id: "V-01",
      name: "John Doe",
      host: resident.fullName,
      checkedInAt: "2:14 PM",
      status: "inside"
    },
    {
      id: "V-02",
      name: "Sarah Ade",
      host: resident.fullName,
      checkedInAt: "4:32 PM",
      status: "inside",
      multiDay: true,
      startDate: "Aug 23",
      endDate: "Aug 30"
    }
  ];

  // Mock upcoming visitors
  let upcomingVisitors = [
    {
      id: "V-03",
      name: "John Doe",
      visitType: "One-Day Visitor",
      expected: "Today · 4:00 PM",
      host: resident.fullName,
      passStatus: "active"
    },
    {
      id: "V-04",
      name: "Sarah Ade",
      visitType: "Multi-Day Visitor",
      expected: "Tomorrow · 11:30 AM",
      host: resident.fullName,
      passStatus: "active"
    }
  ];

  // Mock recent activity (most recent first)
  let activityLog = [
    {
      id: "A-01",
      icon: "fa-right-to-bracket",
      title: "Visitor checked in",
      detail: "John Doe entered the estate",
      time: "2:14 PM"
    },
    {
      id: "A-02",
      icon: "fa-id-card",
      title: "Visitor pass created",
      detail: "Pass created for Sarah Ade",
      time: "11:45 AM"
    },
    {
      id: "A-03",
      icon: "fa-right-from-bracket",
      title: "Artisan checked out",
      detail: "Michael Plumbing Services left the estate",
      time: "Yesterday · 5:20 PM"
    },
    {
      id: "A-04",
      icon: "fa-dolly",
      title: "Property exit verified",
      detail: "Refrigerator exit pass completed",
      time: "Yesterday · 3:15 PM"
    }
  ];

  // Mock notifications
  let notifications = [
    {
      id: "N-01",
      icon: "fa-right-to-bracket",
      title: "Visitor Checked In",
      detail: "John Doe has entered the estate.",
      time: "2:14 PM",
      read: false
    },
    {
      id: "N-02",
      icon: "fa-hourglass-half",
      title: "Pass Expiring",
      detail: "Your artisan pass expires today.",
      time: "10:05 AM",
      read: false
    },
    {
      id: "N-03",
      icon: "fa-calendar-plus",
      title: "Visit Extended",
      detail: "Sarah Ade's visit has been extended until Aug 30.",
      time: "Yesterday",
      read: true
    },
    {
      id: "N-04",
      icon: "fa-circle-check",
      title: "Verification",
      detail: "Your resident account has been verified by estate management.",
      time: "2 days ago",
      read: true
    }
  ];

  /* ========================================================================
     SMALL HELPERS
     ======================================================================== */

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
      case "active":
        return "badge--active";
      case "pending":
        return "badge--pending";
      case "checked-in":
      case "inside":
        return "badge--checkedin";
      case "checked-out":
        return "badge--checkedout";
      case "expired":
        return "badge--expired";
      case "revoked":
        return "badge--revoked";
      default:
        return "badge--checkedout";
    }
  }

  function statusLabel(status) {
    const map = {
      active: "Active",
      pending: "Pending",
      "checked-in": "Checked In",
      inside: "Inside Estate",
      "checked-out": "Checked Out",
      expired: "Expired",
      revoked: "Revoked",
      closed: "Closed"
    };
    return map[status] || status;
  }

  function statusDotIcon(status) {
    // Never rely on color alone — pair every badge with an icon.
    switch (status) {
      case "active":
      case "inside":
      case "checked-in":
        return "fa-solid fa-circle";
      case "pending":
        return "fa-solid fa-clock";
      case "checked-out":
        return "fa-solid fa-circle-check";
      case "expired":
        return "fa-solid fa-circle-minus";
      case "revoked":
        return "fa-solid fa-circle-xmark";
      default:
        return "fa-solid fa-circle";
    }
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function passTypeIcon(type) {
    switch (type) {
      case "one-day":
        return "fa-regular fa-calendar-check";
      case "multi-day":
        return "fa-solid fa-calendar-week";
      case "artisan":
        return "fa-solid fa-screwdriver-wrench";
      case "exit":
        return "fa-solid fa-dolly";
      default:
        return "fa-solid fa-id-card";
    }
  }

  /* Expose shared state on a namespace so later script chunks can use it */
  window.RafaraDashboard = {
    resident,
    PASS_LIFECYCLES,
    get passes() { return passes; },
    get activeVisitors() { return activeVisitors; },
    get upcomingVisitors() { return upcomingVisitors; },
    get activityLog() { return activityLog; },
    get notifications() { return notifications; },
    helpers: {
      initials,
      statusBadgeClass,
      statusLabel,
      statusDotIcon,
      escapeHtml,
      passTypeIcon
    },
    counters: {
      nextPassId: () => `RFP-${++passIdCounter}`,
      nextVisitorId: () => `V-${++visitorIdCounter}`,
      nextNotifId: () => `N-${++notifIdCounter}`,
      nextActivityId: () => `A-${++activityIdCounter}`
    },
    mutators: {
      addPass: (pass) => passes.unshift(pass),
      addActiveVisitor: (v) => activeVisitors.unshift(v),
      removeActiveVisitor: (id) => {
        activeVisitors = activeVisitors.filter((v) => v.id !== id);
      },
      addUpcomingVisitor: (v) => upcomingVisitors.unshift(v),
      addActivity: (entry) => activityLog.unshift(entry),
      addNotification: (n) => notifications.unshift(n),
      markNotificationRead: (id) => {
        const n = notifications.find((x) => x.id === id);
        if (n) n.read = true;
      },
      markAllNotificationsRead: () => {
        notifications.forEach((n) => (n.read = true));
      }
    }
  };
})();

/* ==========================================================================
   RENDERING
   ========================================================================== */

(function () {
  "use strict";

  const D = window.RafaraDashboard;
  const H = D.helpers;

  /* ---------- Statistics ---------- */
  function renderStats() {
    const activePassCount = D.passes.filter((p) => p.status === "active").length;
    document.getElementById("stat-active-passes").textContent = activePassCount;
    document.getElementById("stat-visitors-inside").textContent = D.activeVisitors.length;
    document.getElementById("stat-upcoming-visits").textContent = D.upcomingVisitors.length;
    document.getElementById("stat-pending-requests").textContent =
      D.passes.filter((p) => p.status === "pending").length;
  }

  /* ---------- Active Visitors ---------- */
  function visitorCardHtml(v) {
    return `
      <div class="visitor-card" data-visitor-id="${v.id}">
        <span class="visitor-avatar" aria-hidden="true">${H.initials(v.name)}</span>
        <div class="visitor-info">
          <strong>${H.escapeHtml(v.name)}</strong>
          <span class="visitor-meta">
            Visiting <strong>${H.escapeHtml(v.host)}</strong> · Checked in <strong>${v.checkedInAt}</strong>
          </span>
        </div>
        <div class="visitor-actions">
          <span class="badge ${H.statusBadgeClass(v.status)}"><i class="${H.statusDotIcon(v.status)}" aria-hidden="true"></i>${H.statusLabel(v.status)}</span>
          ${v.multiDay ? `<button type="button" class="btn btn--sm btn--secondary" data-manage-visit="${v.id}">Manage Visit</button>` : ""}
        </div>
      </div>`;
  }

  function renderActiveVisitors() {
    const container = document.getElementById("active-visitors-list");
    if (!D.activeVisitors.length) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-user-group" aria-hidden="true"></i>
          <strong>No visitors currently inside</strong>
          <span>Your active visitors will appear here after they check in.</span>
        </div>`;
      return;
    }
    container.innerHTML = D.activeVisitors.map(visitorCardHtml).join("");
  }

  /* ---------- Active Passes ---------- */
  function passCardHtml(p) {
    return `
      <div class="pass-card" data-pass-id="${p.id}">
        <div class="pass-card-top">
          <div>
            <span class="pass-type-tag"><i class="${H.passTypeIcon(p.type)}" aria-hidden="true"></i> ${p.typeLabel}</span>
            ${p.passCategoryLabel ? `<span class="badge badge--verified pass-category-badge">${p.passCategoryLabel}</span>` : ""}
            <div class="pass-card-name">${H.escapeHtml(p.personOrItem)}</div>
          </div>
          <span class="badge ${H.statusBadgeClass(p.status)}"><i class="${H.statusDotIcon(p.status)}" aria-hidden="true"></i>${H.statusLabel(p.status)}</span>
        </div>
        <div class="pass-card-meta">
          <span>Valid: <strong>${p.validText}</strong></span>
        </div>
        <div class="pass-card-foot">
          <span class="pass-ref">${p.id}</span>
          <button type="button" class="btn btn--sm btn--ghost" data-view-pass="${p.id}">View Details</button>
        </div>
      </div>`;
  }

  function renderActivePasses() {
    const container = document.getElementById("active-passes-list");
    const relevant = D.passes.filter((p) => p.status === "active" || p.status === "pending");
    if (!relevant.length) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-id-card" aria-hidden="true"></i>
          <strong>No active passes yet</strong>
          <span>Create a visitor, artisan or exit pass to see it here.</span>
        </div>`;
      return;
    }
    container.innerHTML = relevant.map(passCardHtml).join("");
  }

  /* ---------- Upcoming Visitors ---------- */
  function upcomingCardHtml(v) {
    return `
      <div class="visitor-card" data-upcoming-id="${v.id}">
        <span class="visitor-avatar" aria-hidden="true">${H.initials(v.name)}</span>
        <div class="visitor-info">
          <strong>${H.escapeHtml(v.name)}</strong>
          <span class="visitor-meta">${H.escapeHtml(v.visitType)} · Expected <strong>${v.expected}</strong></span>
        </div>
        <div class="visitor-actions">
          <span class="badge ${H.statusBadgeClass(v.passStatus)}"><i class="${H.statusDotIcon(v.passStatus)}" aria-hidden="true"></i>${H.statusLabel(v.passStatus)}</span>
          <button type="button" class="btn btn--sm btn--ghost" data-view-upcoming="${v.id}">View Pass</button>
        </div>
      </div>`;
  }

  function renderUpcomingVisitors() {
    const container = document.getElementById("upcoming-visitors-list");
    if (!D.upcomingVisitors.length) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fa-regular fa-calendar" aria-hidden="true"></i>
          <strong>No upcoming visitors</strong>
          <span>Visitors you've invited will appear here before they arrive.</span>
        </div>`;
      return;
    }
    container.innerHTML = D.upcomingVisitors.map(upcomingCardHtml).join("");
  }

  /* ---------- Recent Activity ---------- */
  function activityItemHtml(a) {
    return `
      <li class="activity-item">
        <span class="activity-icon" aria-hidden="true"><i class="fa-solid ${a.icon}"></i></span>
        <div class="activity-body">
          <strong>${H.escapeHtml(a.title)}</strong>
          <p>${H.escapeHtml(a.detail)}</p>
        </div>
        <span class="activity-time">${a.time}</span>
      </li>`;
  }

  function renderActivity() {
    const list = document.getElementById("activity-list");
    if (!D.activityLog.length) {
      list.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-clock-rotate-left" aria-hidden="true"></i>
          <strong>No activity yet</strong>
          <span>Check-ins, pass creation and exits will show up here.</span>
        </div>`;
      return;
    }
    list.innerHTML = D.activityLog.slice(0, 6).map(activityItemHtml).join("");
  }

  /* ---------- Notifications ---------- */
  function notifItemHtml(n) {
    return `
      <div class="notif-item ${n.read ? "" : "is-unread"}" data-notif-id="${n.id}" role="button" tabindex="0">
        <span class="notif-icon" aria-hidden="true"><i class="fa-solid ${n.icon}"></i></span>
        <div class="notif-body">
          <strong>${H.escapeHtml(n.title)}</strong>
          <p>${H.escapeHtml(n.detail)}</p>
          <span class="notif-time">${n.time}</span>
        </div>
        ${n.read ? "" : `<span class="notif-unread-dot" aria-hidden="true"></span>`}
      </div>`;
  }

  function renderNotifications() {
    const list = document.getElementById("notifications-list");
    const panelList = document.getElementById("notif-panel-list");
    const unreadCount = D.notifications.filter((n) => !n.read).length;

    if (!D.notifications.length) {
      const emptyHtml = `
        <div class="empty-state">
          <i class="fa-solid fa-bell" aria-hidden="true"></i>
          <strong>You're all caught up</strong>
          <span>New notifications about your passes and visitors will appear here.</span>
        </div>`;
      list.innerHTML = emptyHtml;
      panelList.innerHTML = emptyHtml;
    } else {
      list.innerHTML = D.notifications.slice(0, 4).map(notifItemHtml).join("");
      panelList.innerHTML = D.notifications.slice(0, 6).map(notifItemHtml).join("");
    }

    // Header bell dot + sidebar badge
    const notifDot = document.getElementById("notif-dot");
    const sidebarCount = document.getElementById("sidebar-notif-count");
    notifDot.hidden = unreadCount === 0;
    if (unreadCount > 0) {
      sidebarCount.hidden = false;
      sidebarCount.textContent = unreadCount;
    } else {
      sidebarCount.hidden = true;
    }
  }

  function renderAll() {
    renderStats();
    renderActiveVisitors();
    renderActivePasses();
    renderUpcomingVisitors();
    renderActivity();
    renderNotifications();
  }

  D.render = renderAll;
  D.renderStats = renderStats;
  D.renderActiveVisitors = renderActiveVisitors;
  D.renderActivePasses = renderActivePasses;
  D.renderUpcomingVisitors = renderUpcomingVisitors;
  D.renderActivity = renderActivity;
  D.renderNotifications = renderNotifications;

  document.addEventListener("DOMContentLoaded", renderAll);
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

    const timer = setTimeout(() => dismiss(), 3200);

    function dismiss() {
      clearTimeout(timer);
      toast.classList.add("is-leaving");
      toast.addEventListener("animationend", () => toast.remove(), { once: true });
    }
  }

  window.RafaraDashboard.toast = showToast;
})();

/* ==========================================================================
   MODALS
   ========================================================================== */

(function () {
  "use strict";

  let lastFocusedEl = null;

  function openModal(id) {
    // Close any other open modal first (e.g. going from type-select -> form)
    document.querySelectorAll(".modal-overlay:not([hidden])").forEach((m) => {
      if (m.id !== id) m.hidden = true;
    });

    const overlay = document.getElementById(id);
    if (!overlay) return;

    lastFocusedEl = document.activeElement;
    overlay.hidden = false;
    document.body.style.overflow = "hidden";

    const focusable = overlay.querySelector(
      "input, select, textarea, button, [href]"
    );
    if (focusable) focusable.focus();

    overlay.addEventListener("keydown", trapKeydown);
  }

  function closeModal(overlay) {
    if (!overlay || overlay.hidden) return;
    overlay.hidden = true;
    overlay.removeEventListener("keydown", trapKeydown);

    const anyOpen = document.querySelector(".modal-overlay:not([hidden])");
    if (!anyOpen) {
      document.body.style.overflow = "";
    }
    if (lastFocusedEl && document.body.contains(lastFocusedEl)) {
      lastFocusedEl.focus();
    }
  }

  function closeAllModals() {
    document.querySelectorAll(".modal-overlay:not([hidden])").forEach(closeModal);
  }

  function trapKeydown(e) {
    const overlay = e.currentTarget;
    if (e.key === "Escape") {
      closeModal(overlay);
      return;
    }
    if (e.key !== "Tab") return;
    const focusables = Array.from(
      overlay.querySelectorAll("input, select, textarea, button, [href]")
    ).filter((el) => el.offsetParent !== null);
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

  // Open triggers
  document.addEventListener("click", (e) => {
    const opener = e.target.closest("[data-open-modal]");
    if (opener) {
      e.preventDefault();
      openModal(opener.getAttribute("data-open-modal"));
    }
  });

  // Close triggers (X button, cancel button, backdrop click)
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

  window.RafaraDashboard.modal = { open: openModal, close: closeModal, closeAll: closeAllModals };
})();

/* ==========================================================================
   DROPDOWNS (notification bell + profile menu)
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
    document.querySelectorAll("[aria-haspopup='true']").forEach((b) =>
      b.setAttribute("aria-expanded", "false")
    );
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

  window.RafaraDashboard.closeAllDropdowns = closeAllDropdowns;
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

  // Mobile "More" sheet
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
  sheet.querySelectorAll("[data-close-mobile-sheet]").forEach((el) =>
    el.addEventListener("click", closeSheet)
  );

  // Mobile FAB opens the visitor-pass-type modal (same as "Create Visitor Pass")
  document.getElementById("mobile-quick-create-btn").addEventListener("click", () => {
    window.RafaraDashboard.modal.open("modal-visitor-type");
  });

  document.getElementById("mobile-logout-btn").addEventListener("click", () => {
    closeSheet();
    window.RafaraDashboard.modal.open("modal-logout");
  });
})();

/* ==========================================================================
   GREETING (time-aware)
   ========================================================================== */

(function () {
  "use strict";
  const hour = new Date().getHours();
  let greeting = "Good morning";
  if (hour >= 12 && hour < 17) greeting = "Good afternoon";
  else if (hour >= 17) greeting = "Good evening";

  const el = document.getElementById("greeting-heading");
  if (el) {
    el.innerHTML = `${greeting}, ${window.RafaraDashboard.resident.firstName} <span aria-hidden="true">👋</span>`;
  }
})();

/* ==========================================================================
   QUICK ACTIONS
   ========================================================================== */

(function () {
  "use strict";
  const M = window.RafaraDashboard.modal;

  document.getElementById("qa-visitor-pass").addEventListener("click", () => {
    M.open("modal-visitor-type");
  });
  document.getElementById("qa-artisan-pass").addEventListener("click", () => {
    M.open("modal-artisan");
  });
  document.getElementById("qa-exit-pass").addEventListener("click", () => {
    M.open("modal-exit");
  });
  // "View All Passes" is a real link (resident-passes.html) — no JS needed.
})();

/* ==========================================================================
   LOGOUT
   ========================================================================== */

(function () {
  "use strict";
  const M = window.RafaraDashboard.modal;

  document.getElementById("logout-btn").addEventListener("click", () => M.open("modal-logout"));
  document.getElementById("dropdown-logout-btn").addEventListener("click", () => {
    window.RafaraDashboard.closeAllDropdowns();
    M.open("modal-logout");
  });

  document.getElementById("confirm-logout-btn").addEventListener("click", () => {
    window.RafaraDashboard.toast("Logging you out…", "fa-arrow-right-from-bracket");
    setTimeout(() => {
      window.location.href = "resident-login.html";
    }, 700);
  });
})();

/* ==========================================================================
   FORM SUBMISSIONS — CREATE PASSES (mock, frontend only)
   ========================================================================== */

(function () {
  "use strict";

  const D = window.RafaraDashboard;
  const M = D.modal;

  function nowTime() {
    return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }

  function formatDate(dateStr) {
    if (!dateStr) return "TBD";
    const d = new Date(dateStr + "T00:00:00");
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  }

  function resetAndCloseAll(form, modalId) {
    form.reset();
    M.close(document.getElementById(modalId));
  }

  /* ---- One-Day Visitor Pass: Pass Type -> Dynamic Form -> Review -> Generate ---- */
  (function () {
    const M2 = D.modal;
    const backBtn = document.getElementById("od-back-btn");
    const titleEl = document.getElementById("modal-one-day-title");
    const stepType = document.getElementById("od-step-type");
    const formEl = document.getElementById("form-one-day");
    const stepReview = document.getElementById("od-step-review");
    const stepGenerated = document.getElementById("od-step-generated");
    const typeBanner = document.getElementById("od-type-banner-badge");
    const reviewBody = document.getElementById("od-review-body");
    const generatedBody = document.getElementById("od-generated-pass");

    const CATEGORIES = {
      regular: { label: "Regular Visitor", badgeLabel: "REGULAR VISITOR", icon: "fa-solid fa-user", fieldsId: "od-fields-regular" },
      ride: { label: "Ride", badgeLabel: "RIDE", icon: "fa-solid fa-car-side", fieldsId: "od-fields-ride" },
      delivery: { label: "Delivery", badgeLabel: "DELIVERY", icon: "fa-solid fa-box", fieldsId: "od-fields-delivery" }
    };

    let currentStep = "type";
    let currentCategory = null;
    let reviewData = null;

    function formatTimeStr(t) {
      if (!t) return "";
      const [h, m] = t.split(":").map(Number);
      if (Number.isNaN(h) || Number.isNaN(m)) return t;
      const d = new Date();
      d.setHours(h, m, 0, 0);
      return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    }

    function clearAllFieldValues() {
      formEl.querySelectorAll(".od-fields input, .od-fields select, .od-fields textarea").forEach((el) => {
        el.value = "";
      });
    }

    function showStep(step) {
      currentStep = step;
      stepType.hidden = step !== "type";
      formEl.hidden = step !== "form";
      stepReview.hidden = step !== "review";
      stepGenerated.hidden = step !== "generated";
      backBtn.hidden = step === "generated";
      titleEl.textContent =
        step === "review" ? "Review Pass Details" :
        step === "generated" ? "Pass Generated" :
        "One-Day Visitor Pass";
    }

    function resetWizard() {
      currentCategory = null;
      reviewData = null;
      formEl.reset();
      Object.values(CATEGORIES).forEach((c) => {
        document.getElementById(c.fieldsId).hidden = true;
      });
      showStep("type");
    }

    function selectCategory(catKey) {
      if (currentCategory && currentCategory !== catKey) clearAllFieldValues();
      currentCategory = catKey;
      Object.keys(CATEGORIES).forEach((key) => {
        document.getElementById(CATEGORIES[key].fieldsId).hidden = key !== catKey;
      });
      const info = CATEGORIES[catKey];
      typeBanner.innerHTML = `<i class="${info.icon}" aria-hidden="true"></i> ${info.label}`;
      showStep("form");
    }

    function collectFormData() {
      if (currentCategory === "regular") {
        return {
          name: formEl["od-reg-name"].value.trim(),
          phone: formEl["od-reg-phone"].value.trim(),
          date: formEl["od-reg-date"].value,
          time: formEl["od-reg-time"].value,
          purpose: formEl["od-reg-purpose"].value.trim(),
          vehicle: formEl["od-reg-vehicle"].value.trim()
        };
      }
      if (currentCategory === "ride") {
        return {
          name: formEl["od-ride-name"].value.trim(),
          phone: formEl["od-ride-phone"].value.trim(),
          service: formEl["od-ride-service"].value,
          vehicleType: formEl["od-ride-vehicle-type"].value.trim(),
          plate: formEl["od-ride-plate"].value.trim(),
          time: formEl["od-ride-time"].value,
          direction: formEl["od-ride-direction"].value,
          note: formEl["od-ride-note"].value.trim()
        };
      }
      // delivery
      return {
        name: formEl["od-del-name"].value.trim(),
        phone: formEl["od-del-phone"].value.trim(),
        company: formEl["od-del-company"].value.trim(),
        deliveryType: formEl["od-del-type"].value,
        plate: formEl["od-del-plate"].value.trim(),
        time: formEl["od-del-time"].value,
        recipient: formEl["od-del-recipient"].value.trim(),
        note: formEl["od-del-note"].value.trim()
      };
    }

    function requiredFieldsFilled(data) {
      if (currentCategory === "regular") {
        return data.name && data.phone && data.date && data.time && data.purpose;
      }
      if (currentCategory === "ride") {
        return data.name && data.phone && data.service && data.vehicleType && data.plate && data.time && data.direction;
      }
      return data.name && data.phone && data.company && data.deliveryType && data.time && data.recipient;
    }

    function reviewRow(label, value) {
      if (!value) return "";
      return `<div class="details-row"><span>${H.escapeHtml(label)}</span><span>${H.escapeHtml(value)}</span></div>`;
    }

    function buildReviewHtml(data) {
      const info = CATEGORIES[currentCategory];
      let rows = `<div class="details-row"><span>Pass type</span><span>${info.badgeLabel}</span></div>`;
      if (currentCategory === "regular") {
        rows += reviewRow("Visitor full name", data.name);
        rows += reviewRow("Visitor phone number", data.phone);
        rows += reviewRow("Date of visit", formatDate(data.date));
        rows += reviewRow("Expected arrival time", formatTimeStr(data.time));
        rows += reviewRow("Purpose of visit", data.purpose);
        rows += reviewRow("Vehicle information", data.vehicle || "—");
      } else if (currentCategory === "ride") {
        rows += reviewRow("Driver / rider name", data.name);
        rows += reviewRow("Phone number", data.phone);
        rows += reviewRow("Ride / service type", data.service);
        rows += reviewRow("Vehicle type", data.vehicleType);
        rows += reviewRow("Vehicle plate number", data.plate);
        rows += reviewRow("Expected arrival time", formatTimeStr(data.time));
        rows += reviewRow("Pickup or drop-off", data.direction);
        rows += reviewRow("Additional note", data.note || "—");
      } else {
        rows += reviewRow("Delivery person name", data.name);
        rows += reviewRow("Phone number", data.phone);
        rows += reviewRow("Delivery company / platform", data.company);
        rows += reviewRow("Delivery type", data.deliveryType);
        rows += reviewRow("Vehicle / plate number", data.plate || "—");
        rows += reviewRow("Expected arrival time", formatTimeStr(data.time));
        rows += reviewRow("Recipient / resident name", data.recipient);
        rows += reviewRow("Delivery note", data.note || "—");
      }
      return rows;
    }

    /* ---- Fake QR (demo-only, visually representative, not scannable) ---- */
    function hashStringToSeed(str) {
      let h = 0;
      for (let i = 0; i < str.length; i++) {
        h = (h << 5) - h + str.charCodeAt(i);
        h |= 0;
      }
      return h;
    }
    function mulberry32(seed) {
      return function () {
        seed |= 0;
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }
    function generateFakeQrSvg(seedStr) {
      const size = 21;
      const cell = 100 / size;
      const rand = mulberry32(hashStringToSeed(seedStr));
      const inFinderZone = (r, c) =>
        [[0, 0], [0, size - 7], [size - 7, 0]].some(
          ([zr, zc]) => r >= zr && r < zr + 7 && c >= zc && c < zc + 7
        );
      let cells = "";
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (inFinderZone(r, c)) continue;
          if (rand() > 0.55) {
            cells += `<rect x="${(c * cell).toFixed(2)}" y="${(r * cell).toFixed(2)}" width="${cell.toFixed(2)}" height="${cell.toFixed(2)}" fill="var(--rafara-navy)" />`;
          }
        }
      }
      function finder(r0, c0) {
        return (
          `<rect x="${(c0 * cell).toFixed(2)}" y="${(r0 * cell).toFixed(2)}" width="${(7 * cell).toFixed(2)}" height="${(7 * cell).toFixed(2)}" fill="var(--rafara-navy)" />` +
          `<rect x="${((c0 + 1) * cell).toFixed(2)}" y="${((r0 + 1) * cell).toFixed(2)}" width="${(5 * cell).toFixed(2)}" height="${(5 * cell).toFixed(2)}" fill="var(--white)" />` +
          `<rect x="${((c0 + 2) * cell).toFixed(2)}" y="${((r0 + 2) * cell).toFixed(2)}" width="${(3 * cell).toFixed(2)}" height="${(3 * cell).toFixed(2)}" fill="var(--rafara-navy)" />`
        );
      }
      const finders = finder(0, 0) + finder(0, size - 7) + finder(size - 7, 0);
      return `<svg viewBox="0 0 100 100" class="generated-pass-qr-svg" role="img" aria-label="Pass verification QR code">
        <rect x="0" y="0" width="100" height="100" fill="var(--white)" />
        ${cells}${finders}
      </svg>`;
    }

    function generatePassCode() {
      return String(Math.floor(1000 + Math.random() * 9000));
    }

    function renderGeneratedPass(pass) {
      const info = CATEGORIES[pass.passCategory];
      generatedBody.innerHTML = `
        <div class="generated-pass">
          <div class="generated-pass-top">
            <span class="badge badge--verified"><i class="${info.icon}" aria-hidden="true"></i> ${pass.passCategoryLabel}</span>
            <span class="badge ${H.statusBadgeClass(pass.status)}"><i class="${H.statusDotIcon(pass.status)}" aria-hidden="true"></i>${H.statusLabel(pass.status)}</span>
          </div>
          <h3 class="generated-pass-name">${H.escapeHtml(pass.personOrItem)}</h3>
          <p class="generated-pass-meta">One-Day Visitor Pass · Valid <strong>${pass.validText}</strong></p>
          <div class="generated-pass-body">
            <div class="generated-pass-qr">${generateFakeQrSvg(pass.id + "-" + pass.passCode)}</div>
            <div class="generated-pass-code">
              <span class="generated-pass-code-label">4-digit verification code</span>
              <span class="generated-pass-code-value">${pass.passCode}</span>
            </div>
          </div>
          <p class="pass-ref generated-pass-ref">${pass.id}</p>
        </div>`;
    }

    /* ---- Step navigation ---- */
    backBtn.addEventListener("click", () => {
      if (currentStep === "type") {
        M2.open("modal-visitor-type");
      } else if (currentStep === "form") {
        showStep("type");
      } else if (currentStep === "review") {
        showStep("form");
      }
    });

    stepType.querySelectorAll("[data-od-select-type]").forEach((btn) => {
      btn.addEventListener("click", () => selectCategory(btn.getAttribute("data-od-select-type")));
    });

    formEl.querySelectorAll('[data-od-goto="type"]').forEach((btn) => {
      btn.addEventListener("click", () => showStep("type"));
    });

    stepReview.querySelector('[data-od-goto="form"]').addEventListener("click", () => showStep("form"));

    formEl.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!formEl.reportValidity()) return;
      const data = collectFormData();
      if (!requiredFieldsFilled(data)) return;
      reviewData = data;
      reviewBody.innerHTML = buildReviewHtml(data);
      showStep("review");
    });

    document.getElementById("od-generate-btn").addEventListener("click", () => {
      if (!currentCategory || !reviewData) return;
      const info = CATEGORIES[currentCategory];
      const data = reviewData;
      const personOrItem =
        currentCategory === "regular" ? data.name :
        currentCategory === "ride" ? data.name :
        data.name;
      const validText =
        currentCategory === "regular"
          ? `${formatDate(data.date)}${data.time ? " · " + formatTimeStr(data.time) : ""}`
          : `Today${data.time ? " · " + formatTimeStr(data.time) : ""}`;

      const passId = D.counters.nextPassId();
      const pass = {
        id: passId,
        type: "one-day",
        typeLabel: "One-Day Visitor Pass",
        passCategory: currentCategory,
        passCategoryLabel: info.badgeLabel,
        personOrItem,
        validText,
        status: "active",
        currentStep: 1,
        passCode: generatePassCode()
      };

      D.mutators.addPass(pass);
      D.mutators.addUpcomingVisitor({
        id: D.counters.nextVisitorId(),
        name: personOrItem,
        visitType: `One-Day Visitor · ${info.label}`,
        expected: `${validText} · Expected`,
        host: D.resident.fullName,
        passStatus: "active"
      });
      D.mutators.addActivity({
        id: D.counters.nextActivityId(),
        icon: "fa-id-card",
        title: "Visitor pass created",
        detail: `One-day (${info.label}) pass created for ${personOrItem}`,
        time: nowTime()
      });
      D.mutators.addNotification({
        id: D.counters.nextNotifId(),
        icon: "fa-id-card",
        title: "Pass Created",
        detail: `A one-day ${info.label.toLowerCase()} pass was created for ${personOrItem}.`,
        time: nowTime(),
        read: false
      });

      D.render();
      renderGeneratedPass(pass);
      showStep("generated");
      D.toast("Visitor pass created successfully.", "fa-circle-check");
    });

    // Entry point: "One-Day Visitor" option card in the pass-type-choice modal
    // resets the wizard back to step 1 every time it's opened.
    const entryBtn = document.querySelector('#modal-visitor-type [data-open-modal="modal-one-day"]');
    if (entryBtn) entryBtn.addEventListener("click", resetWizard);
  })();

  /* ---- Multi-Day Visitor ---- */
  document.getElementById("form-multi-day").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form["md-name"].value.trim();
    const start = form["md-start"].value;
    const end = form["md-end"].value;
    if (!name || !start || !end) return;

    const passId = D.counters.nextPassId();
    D.mutators.addPass({
      id: passId,
      type: "multi-day",
      typeLabel: "Multi-Day Visitor Pass",
      personOrItem: name,
      validText: `${formatDate(start)} – ${formatDate(end)}`,
      status: "active",
      currentStep: 1
    });
    D.mutators.addUpcomingVisitor({
      id: D.counters.nextVisitorId(),
      name,
      visitType: "Multi-Day Visitor",
      expected: `${formatDate(start)} · Expected`,
      host: D.resident.fullName,
      passStatus: "active"
    });
    D.mutators.addActivity({
      id: D.counters.nextActivityId(),
      icon: "fa-id-card",
      title: "Visitor pass created",
      detail: `Multi-day pass created for ${name}`,
      time: nowTime()
    });
    D.mutators.addNotification({
      id: D.counters.nextNotifId(),
      icon: "fa-calendar-week",
      title: "Pass Created",
      detail: `A multi-day visitor pass was created for ${name}.`,
      time: nowTime(),
      read: false
    });

    D.render();
    resetAndCloseAll(form, "modal-multi-day");
    D.toast("Visitor pass created successfully.", "fa-circle-check");
  });

  /* ---- Artisan Pass ---- */
  document.getElementById("form-artisan").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form["ar-name"].value.trim();
    const date = form["ar-date"].value;
    if (!name || !date) return;

    D.mutators.addPass({
      id: D.counters.nextPassId(),
      type: "artisan",
      typeLabel: "Artisan Pass",
      personOrItem: name,
      validText: formatDate(date),
      status: "active",
      currentStep: 1
    });
    D.mutators.addActivity({
      id: D.counters.nextActivityId(),
      icon: "fa-screwdriver-wrench",
      title: "Artisan pass created",
      detail: `Pass created for ${name}`,
      time: nowTime()
    });
    D.mutators.addNotification({
      id: D.counters.nextNotifId(),
      icon: "fa-screwdriver-wrench",
      title: "Pass Created",
      detail: `An artisan pass was created for ${name}.`,
      time: nowTime(),
      read: false
    });

    D.render();
    resetAndCloseAll(form, "modal-artisan");
    D.toast("Artisan pass created successfully.", "fa-circle-check");
  });

  /* ---- Property Exit Pass ---- */
  document.getElementById("form-exit").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    const item = form["ex-item"].value.trim();
    const date = form["ex-date"].value;
    if (!item || !date) return;

    D.mutators.addPass({
      id: D.counters.nextPassId(),
      type: "exit",
      typeLabel: "Property Exit Pass",
      personOrItem: item,
      validText: formatDate(date),
      status: "pending",
      currentStep: 1
    });
    D.mutators.addActivity({
      id: D.counters.nextActivityId(),
      icon: "fa-dolly",
      title: "Property exit requested",
      detail: `Exit pass requested for ${item}`,
      time: nowTime()
    });
    D.mutators.addNotification({
      id: D.counters.nextNotifId(),
      icon: "fa-dolly",
      title: "Exit Pass Pending",
      detail: `Your exit pass for ${item} is awaiting verification by Security.`,
      time: nowTime(),
      read: false
    });

    D.render();
    resetAndCloseAll(form, "modal-exit");
    D.toast("Exit pass submitted for verification.", "fa-circle-check");
  });
})();

/* ==========================================================================
   VIEW DETAILS — passes & visitors (delegated clicks, since lists re-render)
   ========================================================================== */

(function () {
  "use strict";

  const D = window.RafaraDashboard;
  const H = D.helpers;
  const M = D.modal;

  function lifecycleHtml(steps, currentStep) {
    return `
      <div class="details-timeline">
        ${steps
          .map((step, i) => {
            const done = i < currentStep;
            const current = i === currentStep;
            const icon = done ? "fa-solid fa-circle-check" : current ? "fa-solid fa-circle-dot" : "fa-regular fa-circle";
            return `<div class="details-timeline-step ${done ? "is-done" : ""} ${current ? "is-current" : ""}">
              <i class="${icon}" aria-hidden="true"></i> ${H.escapeHtml(step)}
            </div>`;
          })
          .join("")}
      </div>`;
  }

  function openPassDetails(passId) {
    const pass = D.passes.find((p) => p.id === passId);
    if (!pass) return;
    const steps = D.PASS_LIFECYCLES[pass.type] || [];
    document.getElementById("modal-details-title").textContent = pass.typeLabel;
    document.getElementById("modal-details-body").innerHTML = `
      <div class="details-block">
        <div class="details-row"><span>Pass reference</span><span>${pass.id}</span></div>
        ${pass.passCategoryLabel ? `<div class="details-row"><span>Pass category</span><span>${pass.passCategoryLabel}</span></div>` : ""}
        <div class="details-row"><span>Person / item</span><span>${H.escapeHtml(pass.personOrItem)}</span></div>
        <div class="details-row"><span>Valid</span><span>${pass.validText}</span></div>
        ${pass.passCode ? `<div class="details-row"><span>Verification code</span><span>${pass.passCode}</span></div>` : ""}
        <div class="details-row"><span>Status</span><span><span class="badge ${H.statusBadgeClass(pass.status)}"><i class="${H.statusDotIcon(pass.status)}" aria-hidden="true"></i>${H.statusLabel(pass.status)}</span></span></div>
        <div>
          <p class="modal-lede" style="margin:14px 0 8px;">Pass lifecycle</p>
          ${lifecycleHtml(steps, pass.currentStep || 0)}
        </div>
        <p class="form-note" style="margin-top:14px;"><i class="fa-solid fa-circle-info" aria-hidden="true"></i> This pass is demo data and has not been verified by a backend.</p>
      </div>`;
    M.open("modal-details");
    D.toast("Pass details opened.", "fa-id-card");
  }

  function openVisitorDetails(visitorId, source) {
    const list = source === "upcoming" ? D.upcomingVisitors : D.activeVisitors;
    const v = list.find((x) => x.id === visitorId);
    if (!v) return;
    document.getElementById("modal-details-title").textContent = v.name;
    const rows = [
      `<div class="details-row"><span>Host</span><span>${H.escapeHtml(v.host)}</span></div>`
    ];
    if (source === "upcoming") {
      rows.push(`<div class="details-row"><span>Visit type</span><span>${H.escapeHtml(v.visitType)}</span></div>`);
      rows.push(`<div class="details-row"><span>Expected</span><span>${v.expected}</span></div>`);
      rows.push(`<div class="details-row"><span>Status</span><span><span class="badge ${H.statusBadgeClass(v.passStatus)}"><i class="${H.statusDotIcon(v.passStatus)}" aria-hidden="true"></i>${H.statusLabel(v.passStatus)}</span></span></div>`);
    } else {
      rows.push(`<div class="details-row"><span>Checked in</span><span>${v.checkedInAt}</span></div>`);
      if (v.multiDay) {
        rows.push(`<div class="details-row"><span>Stay period</span><span>${v.startDate} – ${v.endDate}</span></div>`);
      }
      rows.push(`<div class="details-row"><span>Status</span><span><span class="badge ${H.statusBadgeClass(v.status)}"><i class="${H.statusDotIcon(v.status)}" aria-hidden="true"></i>${H.statusLabel(v.status)}</span></span></div>`);
    }
    document.getElementById("modal-details-body").innerHTML = `<div class="details-block">${rows.join("")}</div>`;
    M.open("modal-details");
  }

  let extendingVisitorId = null;

  function openExtendVisit(visitorId) {
    const v = D.activeVisitors.find((x) => x.id === visitorId);
    if (!v) return;
    extendingVisitorId = visitorId;
    document.getElementById("extend-visitor-name").textContent =
      `Extend ${v.name}'s stay to a new end date. Current end date: ${v.endDate || "N/A"}.`;
    M.open("modal-extend");
  }

  document.getElementById("form-extend").addEventListener("submit", (e) => {
    e.preventDefault();
    const dateVal = document.getElementById("extend-date").value;
    if (!dateVal || !extendingVisitorId) return;

    const v = D.activeVisitors.find((x) => x.id === extendingVisitorId);
    const d = new Date(dateVal + "T00:00:00");
    const formatted = isNaN(d.getTime())
      ? dateVal
      : d.toLocaleDateString(undefined, { month: "short", day: "numeric" });

    if (v) {
      v.endDate = formatted;
      D.mutators.addActivity({
        id: D.counters.nextActivityId(),
        icon: "fa-calendar-plus",
        title: "Visit extended",
        detail: `${v.name}'s visit was extended to ${formatted}`,
        time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      });
      D.mutators.addNotification({
        id: D.counters.nextNotifId(),
        icon: "fa-calendar-plus",
        title: "Visit Extended",
        detail: `${v.name}'s visit has been extended until ${formatted}.`,
        time: "Just now",
        read: false
      });
    }

    D.render();
    e.target.reset();
    M.close(document.getElementById("modal-extend"));
    D.toast("Visit extended successfully.", "fa-circle-check");
    extendingVisitorId = null;
  });

  // Delegated clicks across re-rendered lists
  document.addEventListener("click", (e) => {
    const passBtn = e.target.closest("[data-view-pass]");
    if (passBtn) {
      openPassDetails(passBtn.getAttribute("data-view-pass"));
      return;
    }
    const upcomingBtn = e.target.closest("[data-view-upcoming]");
    if (upcomingBtn) {
      openVisitorDetails(upcomingBtn.getAttribute("data-view-upcoming"), "upcoming");
      return;
    }
    const manageBtn = e.target.closest("[data-manage-visit]");
    if (manageBtn) {
      openExtendVisit(manageBtn.getAttribute("data-manage-visit"));
      return;
    }
    const visitorCard = e.target.closest(".visitor-card[data-visitor-id]");
    if (visitorCard && !e.target.closest("[data-manage-visit]")) {
      openVisitorDetails(visitorCard.getAttribute("data-visitor-id"), "active");
    }
  });
})();

/* ==========================================================================
   NOTIFICATIONS — read / unread interactions
   ========================================================================== */

(function () {
  "use strict";
  const D = window.RafaraDashboard;

  function handleNotifClick(el) {
    const id = el.getAttribute("data-notif-id");
    const notif = D.notifications.find((n) => n.id === id);
    if (!notif) return;
    if (!notif.read) {
      D.mutators.markNotificationRead(id);
      D.renderNotifications();
      D.toast("Notification marked as read.", "fa-check");
    }
  }

  document.addEventListener("click", (e) => {
    const item = e.target.closest(".notif-item");
    if (item) handleNotifClick(item);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const item = e.target.closest(".notif-item");
    if (item) {
      e.preventDefault();
      handleNotifClick(item);
    }
  });

  document.getElementById("mark-all-read-btn").addEventListener("click", () => {
    D.mutators.markAllNotificationsRead();
    D.renderNotifications();
    D.toast("All notifications marked as read.", "fa-check-double");
  });
})();
