/* =========================================================
   RAFARA GATEPASS — ESTATE MANAGER NOTIFICATIONS
   Frontend demo logic (no backend, mock data only)
   ========================================================= */

(function () {
  "use strict";

  window.RafaraNotifications = window.RafaraNotifications || {};

  /* =======================================================
     MOCK DATA
     ======================================================= */

  window.RafaraNotifications.DATA = [

    /* ---------------- TODAY (September 2, 2026) ---------------- */

    {
      id: "t1",
      category: "passes",
      title: "Pending Pass Request",
      desc: "A visitor pass for Flat 8 is awaiting review.",
      message: "A visitor pass for Flat 8 is awaiting your review before the visitor can be granted access.",
      ref: "RFP-24082",
      time: "8:42 AM",
      dateGroup: "Today",
      dateDisplay: "September 2, 2026",
      unread: true,
      important: false,
      actionLabel: "Review Pass",
      relatedPass: "RFP-24082",
      relatedUnit: "Flat 8",
      reviewed: false
    },
    {
      id: "t2",
      category: "security",
      title: "Security Alert",
      desc: "A visitor was denied access at the Main Gate.",
      message: "A visitor was denied access at the Main Gate. Reason: expired pass.",
      ref: null,
      time: "8:31 AM",
      dateGroup: "Today",
      dateDisplay: "September 2, 2026",
      unread: true,
      important: true,
      actionLabel: "View Activity",
      officer: "Ngozi Eze",
      location: "Main Gate",
      reviewed: false
    },
    {
      id: "t3",
      category: "artisans",
      title: "Artisan Verification",
      desc: "Chinedu Okafor has submitted an artisan profile for verification.",
      message: "Chinedu Okafor (Plumber) has submitted documents for artisan verification and is awaiting approval.",
      ref: "ART-0084",
      time: "8:18 AM",
      dateGroup: "Today",
      dateDisplay: "September 2, 2026",
      unread: true,
      important: false,
      actionLabel: "Review Artisan",
      reviewed: false
    },
    {
      id: "t4",
      category: "security",
      title: "Shift Update",
      desc: "Tunde Adeyemi has started his morning security shift.",
      message: "Tunde Adeyemi checked in for the morning shift at the Main Gate post.",
      ref: null,
      time: "7:58 AM",
      dateGroup: "Today",
      dateDisplay: "September 2, 2026",
      unread: false,
      important: false,
      actionLabel: "View Security",
      officer: "Tunde Adeyemi",
      location: "Main Gate",
      reviewed: true
    },
    {
      id: "t5",
      category: "passes",
      title: "Expiring Pass",
      desc: "Blessing Nwosu's artisan pass expires in 3 hours.",
      message: "Blessing Nwosu's artisan access pass is set to expire today. Renew or revoke access before it lapses.",
      ref: "ART-0079",
      time: "7:20 AM",
      dateGroup: "Today",
      dateDisplay: "September 2, 2026",
      unread: true,
      important: false,
      actionLabel: "View Pass",
      relatedPass: "ART-0079",
      relatedUnit: "Flat 12",
      reviewed: false
    },
    {
      id: "t6",
      category: "system",
      title: "System Announcement",
      desc: "Scheduled maintenance on the visitor check-in kiosks tonight.",
      message: "The visitor check-in kiosks at the Main and Service gates will undergo scheduled maintenance between 11:00 PM and 1:00 AM.",
      ref: null,
      time: "6:45 AM",
      dateGroup: "Today",
      dateDisplay: "September 2, 2026",
      unread: false,
      important: false,
      actionLabel: "View Details",
      reviewed: true
    },

    /* ---------------- YESTERDAY (September 1, 2026) ---------------- */

    {
      id: "y1",
      category: "security",
      title: "Security Alert",
      desc: "A visitor was denied access at the Main Gate because the pass had expired.",
      message: "A visitor was denied access at the Main Gate because the pass had expired.",
      ref: "RFP-24079",
      time: "08:31 AM",
      dateGroup: "Yesterday",
      dateDisplay: "September 1, 2026",
      unread: true,
      important: true,
      actionLabel: "View Activity",
      relatedPass: "RFP-24079",
      relatedUnit: "Flat 4",
      officer: "Abdulrahman Musa",
      location: "Main Gate",
      reviewed: false
    },
    {
      id: "y2",
      category: "passes",
      title: "Expiring Pass",
      desc: "David Chukwu's visitor pass expires in 2 hours.",
      message: "David Chukwu's visitor pass is close to expiry and will be automatically revoked if not renewed.",
      ref: "RFP-23990",
      time: "6:45 PM",
      dateGroup: "Yesterday",
      dateDisplay: "September 1, 2026",
      unread: false,
      important: true,
      actionLabel: "View Pass",
      relatedPass: "RFP-23990",
      relatedUnit: "Flat 19",
      reviewed: true
    },
    {
      id: "y3",
      category: "residents",
      title: "Resident Activity",
      desc: "A resident updated their household information.",
      message: "Mrs. Folake Bello updated the number of registered household members for Flat 6.",
      ref: null,
      time: "5:10 PM",
      dateGroup: "Yesterday",
      dateDisplay: "September 1, 2026",
      unread: false,
      important: false,
      actionLabel: "View Activity",
      relatedUnit: "Flat 6",
      reviewed: true
    },
    {
      id: "y4",
      category: "units",
      title: "Unit Update",
      desc: "Flat 15 was marked as vacant by the estate office.",
      message: "Flat 15 has been marked as vacant pending new tenant registration.",
      ref: null,
      time: "4:02 PM",
      dateGroup: "Yesterday",
      dateDisplay: "September 1, 2026",
      unread: false,
      important: false,
      actionLabel: "View Unit",
      relatedUnit: "Flat 15",
      reviewed: true
    },
    {
      id: "y5",
      category: "artisans",
      title: "Artisan Verification",
      desc: "Emeka Obi's artisan documents were auto-flagged for review.",
      message: "Emeka Obi's submitted ID document did not match estate records and requires manual review.",
      ref: "ART-0071",
      time: "2:36 PM",
      dateGroup: "Yesterday",
      dateDisplay: "September 1, 2026",
      unread: false,
      important: false,
      actionLabel: "Review Artisan",
      reviewed: true
    },
    {
      id: "y6",
      category: "security",
      title: "Shift Update",
      desc: "Kelechi Obi ended his afternoon security shift.",
      message: "Kelechi Obi checked out after completing the afternoon shift at the Service Gate.",
      ref: null,
      time: "1:15 PM",
      dateGroup: "Yesterday",
      dateDisplay: "September 1, 2026",
      unread: false,
      important: false,
      actionLabel: "View Security",
      officer: "Kelechi Obi",
      location: "Service Gate",
      reviewed: true
    },
    {
      id: "y7",
      category: "passes",
      title: "Pending Pass Request",
      desc: "A delivery pass for Flat 22 is awaiting review.",
      message: "A delivery pass request for Flat 22 is awaiting your review.",
      ref: "RFP-24065",
      time: "11:47 AM",
      dateGroup: "Yesterday",
      dateDisplay: "September 1, 2026",
      unread: true,
      important: false,
      actionLabel: "Review Pass",
      relatedPass: "RFP-24065",
      relatedUnit: "Flat 22",
      reviewed: false
    },
    {
      id: "y8",
      category: "system",
      title: "System Announcement",
      desc: "A new estate-wide security policy has been published.",
      message: "An updated visitor screening policy has been published and applies from next week.",
      ref: null,
      time: "9:00 AM",
      dateGroup: "Yesterday",
      dateDisplay: "September 1, 2026",
      unread: false,
      important: false,
      actionLabel: "View Details",
      reviewed: true
    },

    /* ---------------- EARLIER ---------------- */

    {
      id: "e1",
      category: "residents",
      title: "Resident Verification",
      desc: "A new resident registration is pending approval.",
      message: "A new resident registration for Flat 30 is pending your approval.",
      ref: null,
      time: "Aug 31 · 9:12 AM",
      dateGroup: "Earlier",
      dateDisplay: "August 31, 2026",
      unread: false,
      important: false,
      actionLabel: "View Activity",
      relatedUnit: "Flat 30",
      reviewed: true
    },
    {
      id: "e2",
      category: "passes",
      title: "Pass Approved",
      desc: "A visitor pass for Flat 3 was approved.",
      message: "The visitor pass request for Flat 3 was reviewed and approved.",
      ref: "RFP-23884",
      time: "Aug 31 · 8:05 AM",
      dateGroup: "Earlier",
      dateDisplay: "August 31, 2026",
      unread: false,
      important: false,
      actionLabel: "View Pass",
      relatedPass: "RFP-23884",
      relatedUnit: "Flat 3",
      reviewed: true
    },
    {
      id: "e3",
      category: "security",
      title: "Security Alert",
      desc: "Multiple failed access attempts recorded at the Service Gate.",
      message: "Three consecutive failed access attempts were recorded at the Service Gate using an invalid code.",
      ref: null,
      time: "Aug 30 · 10:22 PM",
      dateGroup: "Earlier",
      dateDisplay: "August 30, 2026",
      unread: false,
      important: false,
      actionLabel: "View Activity",
      location: "Service Gate",
      reviewed: true
    },
    {
      id: "e4",
      category: "units",
      title: "Unit Update",
      desc: "Ownership details for Flat 9 were updated.",
      message: "Ownership records for Flat 9 were updated by the estate office.",
      ref: null,
      time: "Aug 30 · 3:40 PM",
      dateGroup: "Earlier",
      dateDisplay: "August 30, 2026",
      unread: false,
      important: false,
      actionLabel: "View Unit",
      relatedUnit: "Flat 9",
      reviewed: true
    },
    {
      id: "e5",
      category: "artisans",
      title: "Artisan Verification",
      desc: "Ibrahim Sule's artisan profile was approved.",
      message: "Ibrahim Sule's artisan profile was reviewed and approved for estate access.",
      ref: "ART-0058",
      time: "Aug 30 · 11:05 AM",
      dateGroup: "Earlier",
      dateDisplay: "August 30, 2026",
      unread: false,
      important: false,
      actionLabel: "Review Artisan",
      reviewed: true
    },
    {
      id: "e6",
      category: "residents",
      title: "Resident Activity",
      desc: "A resident submitted a maintenance complaint.",
      message: "Mr. Samuel Adeoye submitted a maintenance complaint regarding estate lighting.",
      ref: null,
      time: "Aug 29 · 6:30 PM",
      dateGroup: "Earlier",
      dateDisplay: "August 29, 2026",
      unread: false,
      important: false,
      actionLabel: "View Activity",
      relatedUnit: "Flat 27",
      reviewed: true
    },
    {
      id: "e7",
      category: "system",
      title: "System Announcement",
      desc: "Rafara GatePass app updated to version 3.4.",
      message: "The Rafara GatePass mobile app was updated with performance improvements and bug fixes.",
      ref: null,
      time: "Aug 29 · 9:00 AM",
      dateGroup: "Earlier",
      dateDisplay: "August 29, 2026",
      unread: false,
      important: false,
      actionLabel: "View Details",
      reviewed: true
    },
    {
      id: "e8",
      category: "security",
      title: "Shift Update",
      desc: "Weekend security roster was published.",
      message: "The security roster for the upcoming weekend has been published and assigned.",
      ref: null,
      time: "Aug 28 · 4:15 PM",
      dateGroup: "Earlier",
      dateDisplay: "August 28, 2026",
      unread: false,
      important: false,
      actionLabel: "View Security",
      reviewed: true
    },
    {
      id: "e9",
      category: "passes",
      title: "Pass Revoked",
      desc: "A visitor pass for Flat 11 was revoked.",
      message: "A visitor pass for Flat 11 was revoked after the visit window elapsed.",
      ref: "RFP-23790",
      time: "Aug 28 · 1:50 PM",
      dateGroup: "Earlier",
      dateDisplay: "August 28, 2026",
      unread: false,
      important: false,
      actionLabel: "View Pass",
      relatedPass: "RFP-23790",
      relatedUnit: "Flat 11",
      reviewed: true
    },
    {
      id: "e10",
      category: "units",
      title: "Unit Update",
      desc: "Flat 2 completed estate onboarding.",
      message: "Flat 2 has completed the estate onboarding checklist.",
      ref: null,
      time: "Aug 27 · 10:00 AM",
      dateGroup: "Earlier",
      dateDisplay: "August 27, 2026",
      unread: false,
      important: false,
      actionLabel: "View Unit",
      relatedUnit: "Flat 2",
      reviewed: true
    }
  ];

})();


/* =========================================================
   CATEGORY META
   ========================================================= */

(function () {

  window.RafaraNotifications.CATEGORY_META = {
    passes: { icon: "fa-id-card", iconClass: "" },
    security: { icon: "fa-shield-halved", iconClass: "mn-item-icon--security" },
    artisans: { icon: "fa-helmet-safety", iconClass: "" },
    residents: { icon: "fa-user", iconClass: "" },
    units: { icon: "fa-building", iconClass: "" },
    system: { icon: "fa-gear", iconClass: "mn-item-icon--system" }
  };

})();


/* =========================================================
   STATE + RENDERING
   ========================================================= */

(function () {

  "use strict";

  const NS = window.RafaraNotifications;
  const CATEGORY_META = NS.CATEGORY_META;

  const PAGE_SIZE = 10;

  const state = {
    search: "",
    status: "all",
    category: "all",
    page: 1,
    openMenuId: null,
    drawerId: null
  };


  function escapeHtml(str) {
    if (str == null) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }


  function getFiltered() {

    const term = state.search.trim().toLowerCase();

    return NS.DATA.filter(item => {

      if (state.status === "unread" && !item.unread) return false;
      if (state.status === "read" && item.unread) return false;
      if (state.status === "important" && !item.important) return false;

      if (state.category !== "all" && item.category !== state.category) {
        return false;
      }

      if (term) {
        const haystack = [
          item.title,
          item.desc,
          item.ref || "",
          item.category
        ].join(" ").toLowerCase();

        if (!haystack.includes(term)) return false;
      }

      return true;
    });
  }


  /* =======================================================
     SUMMARY CARDS
     ======================================================= */

  function renderSummary() {

    const grid = document.getElementById("notif-summary-grid");
    if (!grid) return;

    const unreadCount = NS.DATA.filter(item => item.unread).length;
    const todayCount = NS.DATA.filter(item => item.dateGroup === "Today").length;
    const importantCount = NS.DATA.filter(item => item.important).length;

    const cards = [
      {
        icon: "fa-envelope",
        iconClass: "mn-summary-icon--unread",
        value: unreadCount,
        label: "Unread",
        context: "Notifications requiring your attention"
      },
      {
        icon: "fa-calendar-day",
        iconClass: "mn-summary-icon--today",
        value: todayCount,
        label: "Today",
        context: "Notifications received today"
      },
      {
        icon: "fa-star",
        iconClass: "mn-summary-icon--important",
        value: importantCount,
        label: "Important",
        context: "High-priority notifications"
      }
    ];

    grid.innerHTML = cards.map(card => `
      <article class="mn-summary-card">
        <span class="mn-summary-icon ${card.iconClass}">
          <i class="fa-solid ${card.icon}" aria-hidden="true"></i>
        </span>
        <div class="mn-summary-body">
          <span class="mn-summary-number">${card.value}</span>
          <span class="mn-summary-label">${card.label}</span>
          <span class="mn-summary-context">${card.context}</span>
        </div>
      </article>
    `).join("");
  }


  /* =======================================================
     NOTIFICATION ITEM MARKUP
     ======================================================= */

  function itemMarkup(item) {

    const meta = CATEGORY_META[item.category] || CATEGORY_META.system;

    return `
      <div
        class="manager-notification-item${item.unread ? " is-unread" : ""}"
        data-notif-id="${item.id}"
        role="button"
        tabindex="0"
        aria-label="Open notification: ${escapeHtml(item.title)}"
      >
        <span class="mn-item-rail">
          ${item.unread ? '<span class="mn-unread-dot" aria-hidden="true"></span>' : ""}
        </span>

        <span class="mn-item-icon ${meta.iconClass}">
          <i class="fa-solid ${meta.icon}" aria-hidden="true"></i>
        </span>

        <div class="mn-item-body">
          <div class="mn-item-top">
            <div class="mn-item-title-row">
              <span class="mn-item-title">${escapeHtml(item.title)}</span>
              ${item.important ? '<span class="mn-badge-important"><i class="fa-solid fa-star" aria-hidden="true"></i> Important</span>' : ""}
            </div>

            <div class="mn-item-actions">
              <button
                type="button"
                class="btn btn--secondary btn--sm mn-item-action-btn"
                data-action-notif-id="${item.id}"
              >
                ${escapeHtml(item.actionLabel)}
              </button>

              <div class="mn-item-menu" data-menu-wrap="${item.id}">
                <button
                  type="button"
                  class="mn-item-menu-btn"
                  data-menu-toggle="${item.id}"
                  aria-label="More options"
                  aria-haspopup="true"
                  aria-expanded="${state.openMenuId === item.id ? "true" : "false"}"
                >
                  <i class="fa-solid fa-ellipsis-vertical" aria-hidden="true"></i>
                </button>

                ${state.openMenuId === item.id ? `
                  <div class="mn-item-menu-panel" role="menu">
                    <button type="button" data-menu-action="toggle-read" data-menu-id="${item.id}" role="menuitem">
                      <i class="fa-solid ${item.unread ? "fa-envelope-open" : "fa-envelope"}" aria-hidden="true"></i>
                      ${item.unread ? "Mark as Read" : "Mark as Unread"}
                    </button>
                    <button type="button" data-menu-action="toggle-important" data-menu-id="${item.id}" role="menuitem">
                      <i class="fa-solid fa-star" aria-hidden="true"></i>
                      ${item.important ? "Unmark Important" : "Mark as Important"}
                    </button>
                    <button type="button" data-menu-action="view-details" data-menu-id="${item.id}" role="menuitem">
                      <i class="fa-solid fa-eye" aria-hidden="true"></i>
                      View Details
                    </button>
                    <hr>
                    <button type="button" class="mn-menu-danger" data-menu-action="dismiss" data-menu-id="${item.id}" role="menuitem">
                      <i class="fa-solid fa-trash-can" aria-hidden="true"></i>
                      Dismiss
                    </button>
                  </div>
                ` : ""}
              </div>
            </div>
          </div>

          <p class="mn-item-desc">${escapeHtml(item.desc)}</p>

          <div class="mn-item-meta">
            ${item.ref ? `<span class="mn-ref">${escapeHtml(item.ref)}</span>` : ""}
            <span>${escapeHtml(item.time)}</span>
          </div>
        </div>
      </div>
    `;
  }


  /* =======================================================
     LIST + PAGINATION
     ======================================================= */

  function renderList() {

    const wrap = document.getElementById("mn-list-wrap");
    const pagination = document.getElementById("mn-pagination");

    if (!wrap) return;

    const filtered = getFiltered();

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

    if (state.page > totalPages) state.page = totalPages;
    if (state.page < 1) state.page = 1;

    if (!filtered.length) {

      wrap.innerHTML = `
        <div class="mn-empty-state">
          <i class="fa-solid fa-bell" aria-hidden="true"></i>
          <strong>You're all caught up</strong>
          <span>Important estate updates and alerts will appear here.</span>
        </div>
      `;

      if (pagination) pagination.hidden = true;

      return;
    }

    const start = (state.page - 1) * PAGE_SIZE;
    const pageItems = filtered.slice(start, start + PAGE_SIZE);

    let html = "";
    let lastGroup = null;

    pageItems.forEach(item => {

      if (item.dateGroup !== lastGroup) {
        html += `<div class="mn-date-group-label">${escapeHtml(item.dateGroup)}</div>`;
        lastGroup = item.dateGroup;
      }

      html += itemMarkup(item);
    });

    wrap.innerHTML = html;

    renderPagination(filtered.length, totalPages, start);
  }


  function renderPagination(totalCount, totalPages, start) {

    const pagination = document.getElementById("mn-pagination");
    const info = document.getElementById("mn-pagination-info");
    const controls = document.getElementById("mn-pagination-controls");

    if (!pagination || !info || !controls) return;

    if (totalCount <= PAGE_SIZE && totalPages <= 1) {
      pagination.hidden = totalCount === 0;
    } else {
      pagination.hidden = false;
    }

    const shownStart = totalCount === 0 ? 0 : start + 1;
    const shownEnd = Math.min(start + PAGE_SIZE, totalCount);

    info.textContent = `Showing ${shownStart}–${shownEnd} of ${totalCount} notifications`;

    let buttons = `
      <button type="button" class="mn-page-btn" data-page-nav="prev" ${state.page === 1 ? "disabled" : ""}>
        Previous
      </button>
    `;

    for (let page = 1; page <= totalPages; page++) {
      buttons += `
        <button type="button" class="mn-page-btn${page === state.page ? " is-active" : ""}" data-page-go="${page}">
          ${page}
        </button>
      `;
    }

    buttons += `
      <button type="button" class="mn-page-btn" data-page-nav="next" ${state.page === totalPages ? "disabled" : ""}>
        Next
      </button>
    `;

    controls.innerHTML = buttons;
  }


  /* =======================================================
     TOPBAR NOTIFICATION DROPDOWN + SIDEBAR BADGE
     ======================================================= */

  function renderTopbar() {

    const list = document.getElementById("notif-panel-list");
    const dot = document.getElementById("notif-dot");
    const sidebarCount = document.getElementById("sidebar-notif-count");

    const unread = NS.DATA.filter(item => item.unread);

    if (list) {

      const preview = NS.DATA.slice(0, 5);

      if (!preview.length) {

        list.innerHTML = `
          <div class="empty-state">
            <i class="fa-solid fa-bell-slash"></i>
            <strong>No notifications</strong>
            <span>You're all caught up.</span>
          </div>
        `;

      } else {

        list.innerHTML = preview.map(item => {

          const meta = CATEGORY_META[item.category] || CATEGORY_META.system;

          return `
            <div class="notif-item${item.unread ? " is-unread" : ""}">
              <span class="notif-icon">
                <i class="fa-solid ${meta.icon}"></i>
              </span>
              <div class="notif-body">
                <strong>${escapeHtml(item.title)}</strong>
                <p>${escapeHtml(item.desc)}</p>
                <span class="notif-time">${escapeHtml(item.time)}</span>
              </div>
              ${item.unread ? '<span class="notif-unread-dot"></span>' : ""}
            </div>
          `;
        }).join("");
      }
    }

    if (dot) dot.hidden = unread.length === 0;

    if (sidebarCount) {
      sidebarCount.textContent = unread.length;
      sidebarCount.hidden = unread.length === 0;
    }
  }


  /* =======================================================
     RENDER ALL
     ======================================================= */

  function renderAll() {
    renderSummary();
    renderList();
    renderTopbar();
  }

  NS.renderAll = renderAll;
  NS.state = state;


  /* =======================================================
     TOAST
     ======================================================= */

  function showToast(message) {

    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");

    toast.style.cssText = [
      "min-width:220px",
      "max-width:320px",
      "padding:12px 16px",
      "border-radius:12px",
      "background:#050a30",
      "color:#fff",
      "font-family:Inter, sans-serif",
      "font-size:12.5px",
      "font-weight:600",
      "box-shadow:0 14px 35px rgba(5,10,48,0.25)",
      "opacity:0",
      "transform:translateY(8px)",
      "transition:opacity 0.2s ease, transform 0.2s ease"
    ].join(";");

    toast.textContent = message;

    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateY(0)";
    });

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(8px)";
      setTimeout(() => toast.remove(), 220);
    }, 2600);
  }

  NS.showToast = showToast;


  /* =======================================================
     ACTIONS ON DATA
     ======================================================= */

  function findItem(id) {
    return NS.DATA.find(item => item.id === id);
  }

  function markAsRead(id) {
    const item = findItem(id);
    if (item && item.unread) {
      item.unread = false;
      return true;
    }
    return false;
  }

  function toggleRead(id) {
    const item = findItem(id);
    if (!item) return;
    item.unread = !item.unread;
  }

  function toggleImportant(id) {
    const item = findItem(id);
    if (!item) return;
    item.important = !item.important;
  }

  function dismissItem(id) {
    const index = NS.DATA.findIndex(item => item.id === id);
    if (index === -1) return;
    NS.DATA.splice(index, 1);
  }

  function markAllRead() {
    NS.DATA.forEach(item => { item.unread = false; });
  }

  NS.actions = {
    findItem,
    markAsRead,
    toggleRead,
    toggleImportant,
    dismissItem,
    markAllRead
  };

})();


/* =========================================================
   DETAILS DRAWER
   ========================================================= */

(function () {

  "use strict";

  const NS = window.RafaraNotifications;

  const drawer = document.getElementById("mn-drawer");
  const backdrop = document.getElementById("mn-drawer-backdrop");
  const closeBtn = document.getElementById("mn-drawer-close");

  const categoryLabels = {
    passes: "Pass Notification",
    security: "Security Alert",
    artisans: "Artisan Notification",
    residents: "Resident Notification",
    units: "Unit Notification",
    system: "System Announcement"
  };

  function buildRelatedRow(label, value) {
    if (!value) return "";
    return `
      <div class="mn-drawer-field">
        <span class="mn-drawer-label">${label}</span>
        <span class="mn-drawer-value">${value}</span>
      </div>
    `;
  }

  function openDrawer(id) {

    const item = NS.actions.findItem(id);
    if (!item || !drawer || !backdrop) return;

    NS.state.drawerId = id;

    document.getElementById("mn-drawer-category").textContent =
      categoryLabels[item.category] || "Notification";

    document.getElementById("mn-drawer-title").textContent = item.title;
    document.getElementById("mn-drawer-message").textContent = item.message || item.desc;
    document.getElementById("mn-drawer-time").textContent = item.time;
    document.getElementById("mn-drawer-date").textContent = item.dateDisplay || item.dateGroup;

    const relatedGrid = document.getElementById("mn-drawer-related-grid");
    relatedGrid.innerHTML = [
      buildRelatedRow("Related Pass", item.relatedPass),
      buildRelatedRow("Related Unit", item.relatedUnit),
      buildRelatedRow("Security Officer", item.officer),
      buildRelatedRow("Location", item.location)
    ].join("");

    const statusBadge = document.getElementById("mn-drawer-status");
    statusBadge.textContent = item.reviewed ? "Reviewed" : "Unreviewed";
    statusBadge.classList.toggle("is-reviewed", !!item.reviewed);

    const actionBtn = document.getElementById("mn-drawer-action-btn");
    actionBtn.textContent = item.actionLabel;
    actionBtn.dataset.notifId = item.id;

    const markReadBtn = document.getElementById("mn-drawer-mark-read-btn");
    markReadBtn.textContent = item.unread ? "Mark as Read" : "Read";
    markReadBtn.disabled = !item.unread;
    markReadBtn.dataset.notifId = item.id;

    // Opening a notification marks it read automatically.
    if (item.unread) {
      NS.actions.markAsRead(item.id);
      NS.renderAll();
      markReadBtn.textContent = "Read";
      markReadBtn.disabled = true;
    }

    drawer.hidden = false;
    backdrop.hidden = false;

    requestAnimationFrame(() => {
      drawer.classList.add("is-open");
      backdrop.classList.add("is-open");
    });

    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {

    if (!drawer || !backdrop) return;

    drawer.classList.remove("is-open");
    backdrop.classList.remove("is-open");

    document.body.style.overflow = "";

    setTimeout(() => {
      drawer.hidden = true;
      backdrop.hidden = true;
    }, 240);

    NS.state.drawerId = null;
  }

  NS.drawer = { open: openDrawer, close: closeDrawer };

  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
  if (backdrop) backdrop.addEventListener("click", closeDrawer);

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && drawer && !drawer.hidden) {
      closeDrawer();
    }
  });

  const markReadBtn = document.getElementById("mn-drawer-mark-read-btn");
  if (markReadBtn) {
    markReadBtn.addEventListener("click", () => {
      const id = markReadBtn.dataset.notifId;
      if (!id) return;
      NS.actions.markAsRead(id);
      NS.renderAll();
      markReadBtn.textContent = "Read";
      markReadBtn.disabled = true;
      NS.showToast("Notification marked as read.");
    });
  }

  const actionBtn = document.getElementById("mn-drawer-action-btn");
  if (actionBtn) {
    actionBtn.addEventListener("click", () => {
      const id = actionBtn.dataset.notifId;
      const item = id ? NS.actions.findItem(id) : null;
      if (item) {
        NS.showToast(`Opening: ${item.actionLabel}`);
      }
    });
  }

})();


/* =========================================================
   CONTROLS: SEARCH, FILTERS, MARK ALL AS READ
   ========================================================= */

(function () {

  "use strict";

  const NS = window.RafaraNotifications;

  const searchInput = document.getElementById("mn-search-input");
  const statusFilter = document.getElementById("mn-status-filter");
  const categoryFilter = document.getElementById("mn-category-filter");
  const markAllBtn = document.getElementById("mn-mark-all-read-btn");
  const topbarMarkAllBtn = document.getElementById("topbar-mark-all-read-btn");

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      NS.state.search = searchInput.value;
      NS.state.page = 1;
      NS.renderAll();
    });
  }

  if (statusFilter) {
    statusFilter.addEventListener("change", () => {
      NS.state.status = statusFilter.value;
      NS.state.page = 1;
      NS.renderAll();
    });
  }

  if (categoryFilter) {
    categoryFilter.addEventListener("change", () => {
      NS.state.category = categoryFilter.value;
      NS.state.page = 1;
      NS.renderAll();
    });
  }

  function markAll() {
    NS.actions.markAllRead();
    NS.renderAll();
    NS.showToast("All notifications marked as read.");
  }

  if (markAllBtn) markAllBtn.addEventListener("click", markAll);
  if (topbarMarkAllBtn) topbarMarkAllBtn.addEventListener("click", markAll);

})();


/* =========================================================
   LIST DELEGATION: ITEM CLICK, ACTION BUTTON, MENU, PAGINATION
   ========================================================= */

(function () {

  "use strict";

  const NS = window.RafaraNotifications;
  const listWrap = document.getElementById("mn-list-wrap");
  const paginationControls = document.getElementById("mn-pagination-controls");

  if (!listWrap) return;

  listWrap.addEventListener("click", event => {

    const menuToggle = event.target.closest("[data-menu-toggle]");
    if (menuToggle) {
      event.stopPropagation();
      const id = menuToggle.getAttribute("data-menu-toggle");
      NS.state.openMenuId = NS.state.openMenuId === id ? null : id;
      NS.renderAll();
      return;
    }

    const menuAction = event.target.closest("[data-menu-action]");
    if (menuAction) {
      event.stopPropagation();

      const action = menuAction.getAttribute("data-menu-action");
      const id = menuAction.getAttribute("data-menu-id");
      const item = NS.actions.findItem(id);

      NS.state.openMenuId = null;

      if (action === "toggle-read" && item) {
        NS.actions.toggleRead(id);
        NS.showToast(item.unread ? "Notification marked as unread." : "Notification marked as read.");
      } else if (action === "toggle-important" && item) {
        NS.actions.toggleImportant(id);
        NS.showToast(item.important ? "Notification marked as important." : "Notification unmarked as important.");
      } else if (action === "view-details") {
        NS.renderAll();
        NS.drawer.open(id);
        return;
      } else if (action === "dismiss") {
        NS.actions.dismissItem(id);
        NS.showToast("Notification dismissed.");
      }

      NS.renderAll();
      return;
    }

    const actionBtn = event.target.closest("[data-action-notif-id]");
    if (actionBtn) {
      event.stopPropagation();
      const id = actionBtn.getAttribute("data-action-notif-id");
      NS.drawer.open(id);
      return;
    }

    const item = event.target.closest("[data-notif-id]");
    if (item) {
      const id = item.getAttribute("data-notif-id");
      NS.drawer.open(id);
    }
  });

  listWrap.addEventListener("keydown", event => {

    if (event.key !== "Enter" && event.key !== " ") return;

    const item = event.target.closest("[data-notif-id]");
    if (!item) return;

    event.preventDefault();
    NS.drawer.open(item.getAttribute("data-notif-id"));
  });

  document.addEventListener("click", event => {
    if (NS.state.openMenuId && !event.target.closest("[data-menu-wrap]")) {
      NS.state.openMenuId = null;
      NS.renderAll();
    }
  });

  if (paginationControls) {
    paginationControls.addEventListener("click", event => {

      const navBtn = event.target.closest("[data-page-nav]");
      const goBtn = event.target.closest("[data-page-go]");

      if (navBtn) {
        const dir = navBtn.getAttribute("data-page-nav");
        NS.state.page += dir === "next" ? 1 : -1;
        NS.renderAll();
        return;
      }

      if (goBtn) {
        NS.state.page = parseInt(goBtn.getAttribute("data-page-go"), 10);
        NS.renderAll();
      }
    });
  }

})();


/* =========================================================
   SIDEBAR DRAWER (mobile)
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
   TOPBAR DROPDOWNS
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
    requestAnimationFrame(() => sheet.classList.add("is-open"));
    button.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeSheet() {
    sheet.classList.remove("is-open");
    button.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    setTimeout(() => { sheet.hidden = true; }, 220);
  }

  button.addEventListener("click", () => {
    if (sheet.hidden) {
      openSheet();
    } else {
      closeSheet();
    }
  });

  closeTriggers.forEach(trigger => trigger.addEventListener("click", closeSheet));

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
      window.location.href = "manager-login.html";
    });
  });

})();


/* =========================================================
   INIT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  window.RafaraNotifications.renderAll();
});
