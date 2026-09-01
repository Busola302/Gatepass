/* =========================================================
   RAFARA GATEPASS — MANAGER PASSES PAGE
   Frontend-only prototype logic (mock data, no backend)
   ========================================================= */

(function () {
  "use strict";

  /* =======================================================
     MOCK DATA GENERATION
     ======================================================= */

  const VISITOR_NAMES = [
    "Amina Yusuf", "Daniel Okafor", "Fatima Bello", "Tobi Adeyemi", "Grace Effiong",
    "Chika Obinna", "Blessing Nnamdi", "Yusuf Aliyu", "Kelechi Uba", "Zainab Suleiman",
    "Segun Fashola", "Ijeoma Anya", "Peter Okonkwo", "Halima Bako", "Emeka Onyema",
    "Rita Chukwu", "Tunde Bakare", "Ngozi Okeke", "Femi Adisa", "Aisha Garba"
  ];

  const ARTISAN_NAMES = [
    "Musa Ibrahim", "Ade Plumbing Services", "Chidi Electrics", "Blessing AC Repairs",
    "Kunle Carpentry", "Ola Interiors", "Kabiru Tiling Co.", "Emeka Generators Ltd"
  ];

  const RIDE_HOLDERS = [
    "Uber Delivery", "Bolt Rider — Chinedu", "Jumia Express", "Chowdeck — Ngozi",
    "Glovo Rider — Femi", "DHL Courier", "Bolt Food — Ibrahim", "Kwik Delivery"
  ];

  const RESIDENTS = [
    "Aisha Bello", "David Ade", "Sarah Okon", "Tunde Balogun", "Ngozi Umeh",
    "Chinedu Obi", "Fatima Bello", "Emeka Nwosu", "Grace Effiong", "Ibrahim Musa"
  ];

  const UNITS = [
    "Flat 9", "Flat 21", "Flat 14", "Flat 32", "Flat 18", "Flat 3",
    "Flat 27", "Flat 11", "Flat 40", "Flat 6", "Flat 24", "Flat 17"
  ];

  const BLOCKS = ["Block A", "Block B", "Block C", "Block D"];

  const OFFICERS = [
    { name: "Abdulrahman Musa", id: "SEC-0018" },
    { name: "Ibrahim Sule", id: "SEC-0007" },
    { name: "Grace Eze", id: "SEC-0022" },
    { name: "Sadiq Bello", id: "SEC-0014" }
  ];

  const GATES = ["Main Gate", "Back Gate", "Estate Gate 2"];

  const TYPE_META = {
    "One-Day Visitor": { badge: "Visitor", icon: "fa-user" },
    "Multi-Day Visitor": { badge: "Visitor", icon: "fa-user-group" },
    "Artisan": { badge: "Artisan", icon: "fa-helmet-safety" },
    "Property Exit": { badge: "Property Exit", icon: "fa-right-from-bracket" },
    "Ride / Delivery": { badge: "Delivery", icon: "fa-motorcycle" }
  };

  const STATUS_META = {
    Active: { cls: "badge--active", label: "Active" },
    Pending: { cls: "badge--pending", label: "Pending" },
    Used: { cls: "badge--checkedout", label: "Used" },
    Expired: { cls: "badge--expired", label: "Expired" },
    Denied: { cls: "badge--revoked", label: "Denied" },
    Cancelled: { cls: "badge--revoked", label: "Cancelled" }
  };

  const VALID_UNTIL_POOL = {
    Active: ["Today, 06:00 PM", "Today, 05:30 PM", "Today, 08:00 PM", "Today, 09:15 PM", "Tomorrow, 10:00 AM"],
    Pending: ["Today, 08:00 PM", "Today, 07:00 PM", "Tomorrow, 12:00 PM"],
    Used: ["Today, 02:30 PM", "Today, 11:00 AM", "Yesterday"],
    Expired: ["Yesterday", "2 days ago", "3 days ago", "Last week"],
    Denied: ["Today, 04:00 PM", "Yesterday"],
    Cancelled: ["Today, 03:00 PM", "Yesterday"]
  };

  function pick(arr, seed) {
    return arr[seed % arr.length];
  }

  function buildTimeline(pass) {
    const items = [
      {
        time: pass.createdTime,
        action: `Pass created by ${pass.issuedBy === "Resident" ? pass.hostResident : pass.issuedBy}`,
        location: null,
        person: null
      }
    ];

    if (["Used", "Active", "Expired"].includes(pass.status) && pass.access !== "Not Used") {
      items.push({
        time: pass.checkedInTime || "—",
        action: "Pass scanned",
        location: pass.entryPoint,
        person: null
      });
      items.push({
        time: pass.checkedInTime || "—",
        action: `${pass.holderLabel} entered estate`,
        location: pass.entryPoint,
        person: `Verified by ${pass.verifiedBy}`
      });
    }

    if (pass.status === "Used") {
      items.push({
        time: pass.checkedOutTime || "—",
        action: `${pass.holderLabel} exited estate`,
        location: pass.entryPoint,
        person: `Verified by ${pass.verifiedBy}`
      });
    }

    if (pass.status === "Denied") {
      items.push({
        time: pass.createdTime,
        action: "Pass denied at gate",
        location: pass.entryPoint,
        person: `Reviewed by ${pass.verifiedBy}`
      });
    }

    if (pass.status === "Cancelled") {
      items.push({
        time: "Just now",
        action: "Pass cancelled by Estate Manager",
        location: null,
        person: null
      });
    }

    return items.reverse();
  }

  function generatePasses(count) {
    const types = Object.keys(TYPE_META);
    const statuses = ["Active", "Active", "Pending", "Used", "Expired", "Expired", "Denied", "Cancelled"];
    const issuers = ["Resident", "Resident", "Estate Manager", "Security"];
    const list = [];
    let idCounter = 24081;

    for (let i = 0; i < count; i++) {
      const type = pick(types, i * 3 + 1);
      const meta = TYPE_META[type];
      const status = pick(statuses, i * 5 + 2);
      const issuedBy = pick(issuers, i * 7 + 1);
      const unit = pick(UNITS, i * 2 + 3);
      const block = pick(BLOCKS, i);
      const hostResident = pick(RESIDENTS, i * 4 + 2);
      const officer = pick(OFFICERS, i);
      const gate = pick(GATES, i);

      let holderName;
      let phone = `080${(10000000 + (i * 137) % 89999999)}`;
      if (type === "Artisan") {
        holderName = pick(ARTISAN_NAMES, i);
      } else if (type === "Ride / Delivery") {
        holderName = pick(RIDE_HOLDERS, i);
      } else if (type === "Property Exit") {
        holderName = hostResident;
      } else {
        holderName = pick(VISITOR_NAMES, i);
      }

      let access;
      if (status === "Active") {
        access = (i % 3 === 0) ? "Inside" : "Outside";
      } else if (status === "Used") {
        access = "Outside";
      } else if (status === "Expired") {
        access = "Outside";
      } else {
        access = "Not Used";
      }

      const validUntil = pick(VALID_UNTIL_POOL[status], i);

      const pass = {
        id: `RFP-${idCounter - i}`,
        type,
        badgeLabel: meta.badge,
        icon: meta.icon,
        holderName,
        holderLabel: type === "Artisan" ? "Artisan" : (type === "Ride / Delivery" ? "Holder" : "Visitor"),
        phone,
        unit,
        block,
        hostResident,
        status,
        access,
        validUntil,
        validFrom: "Today, 08:00 AM",
        createdDate: "Today",
        createdTime: `0${7 + (i % 3)}:${(10 + i * 3) % 60 < 10 ? "0" : ""}${(10 + i * 3) % 60} AM`,
        checkedInTime: `0${8 + (i % 2)}:${(15 + i * 5) % 60 < 10 ? "0" : ""}${(15 + i * 5) % 60} AM`,
        checkedOutTime: `0${1 + (i % 4)}:${(20 + i * 5) % 60 < 10 ? "0" : ""}${(20 + i * 5) % 60} PM`,
        entryPoint: gate,
        verifiedBy: officer.name,
        securityId: officer.id,
        numberOfUses: status === "Used" ? 1 : (status === "Active" && access === "Inside" ? 1 : 0),
        accessType: type.includes("Multi") ? "Multiple Entries" : "Single Entry",
        issuedBy,
        reviewed: status !== "Pending",
        category: type.includes("Visitor") ? "Guest" : (type === "Artisan" ? "Service Provider" : (type === "Ride / Delivery" ? "Delivery / Ride" : "Resident"))
      };

      pass.timeline = buildTimeline(pass);
      list.push(pass);
      idCounter += (i % 4 === 0) ? 1 : 0;
    }

    return list;
  }

  const RECENT_ACTIVITY_SEED = [
    { icon: "fa-shield-halved", passId: "RFP-24081", text: "was verified at Main Gate", time: "08:42 AM" },
    { icon: "fa-qrcode", passId: "RFP-24080", text: "was scanned", time: "08:31 AM" },
    { icon: "fa-hourglass-end", passId: "RFP-24079", text: "expired", time: "08:18 AM" },
    { icon: "fa-id-card", passId: "RFP-24078", text: "was created by a resident", time: "08:05 AM" },
    { icon: "fa-door-open", passId: "RFP-24076", text: "holder exited the estate", time: "07:52 AM" },
    { icon: "fa-ban", passId: "RFP-24071", text: "was denied at the gate", time: "07:30 AM" }
  ];

  /* =======================================================
     STATE
     ======================================================= */

  const state = {
    passes: generatePasses(96),
    recentActivity: RECENT_ACTIVITY_SEED.slice(),
    filters: {
      search: "",
      type: "all",
      status: "all",
      access: "all",
      issuer: "all",
      date: ""
    },
    page: 1,
    pageSize: 10,
    createType: "Visitor",
    activeDrawerPassId: null,
    cancelTargetId: null,
    openActionMenuId: null
  };

  /* =======================================================
     HELPERS
     ======================================================= */

  function $(id) {
    return document.getElementById(id);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function nextPassId() {
    const numbers = state.passes.map(p => parseInt(p.id.replace("RFP-", ""), 10)).filter(n => !isNaN(n));
    const max = numbers.length ? Math.max(...numbers) : 24081;
    return `RFP-${max + 1}`;
  }

  function showToast(message, type) {
    const container = $("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "manager-pass-toast" + (type === "error" ? " manager-pass-toast--error" : "");
    toast.innerHTML = `
      <i class="fa-solid ${type === "error" ? "fa-circle-exclamation" : "fa-circle-check"}" aria-hidden="true"></i>
      <span>${escapeHtml(message)}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 2900);
  }

  function copyPassId(id) {
    const finish = () => showToast("Pass ID copied.");

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(id).then(finish).catch(finish);
    } else {
      finish();
    }
  }

  function addActivity(icon, passId, text) {
    state.recentActivity.unshift({ icon, passId, text, time: "Just now" });
    state.recentActivity = state.recentActivity.slice(0, 8);
    renderRecentActivity();
  }

  function findPass(id) {
    return state.passes.find(p => p.id === id);
  }

  /* =======================================================
     STATS
     ======================================================= */

  function renderStats() {
    const grid = $("pass-stats-grid");
    if (!grid) return;

    const total = state.passes.length;
    const active = state.passes.filter(p => p.status === "Active").length;
    const inside = state.passes.filter(p => p.access === "Inside").length;
    const pending = state.passes.filter(p => p.status === "Pending").length;

    const cards = [
      { icon: "fa-id-card", cls: "stat-icon--passes", value: total.toLocaleString(), label: "Total Passes", ctx: "All passes issued" },
      { icon: "fa-shield-halved", cls: "stat-icon--upcoming", value: active, label: "Active Passes", ctx: "Currently valid" },
      { icon: "fa-person-walking-arrow-right", cls: "stat-icon--inside", value: inside, label: "Visitors Inside", ctx: "Currently inside the estate" },
      { icon: "fa-hourglass-half", cls: "stat-icon--pending", value: pending, label: "Pending Review", ctx: "Require manager attention" }
    ];

    grid.innerHTML = cards.map(card => `
      <article class="stat-card">
        <span class="stat-icon ${card.cls}"><i class="fa-solid ${card.icon}" aria-hidden="true"></i></span>
        <div class="stat-body">
          <span class="stat-number">${card.value}</span>
          <span class="stat-label">${card.label}</span>
          <span class="stat-context">${card.ctx}</span>
        </div>
      </article>
    `).join("");
  }

  /* =======================================================
     LIVE ACCESS STATUS
     ======================================================= */

  function renderLiveStatus() {
    const grid = $("live-status-grid");
    if (!grid) return;

    const inside = state.passes.filter(p => p.access === "Inside").length;
    const checkedInToday = state.passes.filter(p => p.access === "Inside" || p.status === "Used").length;
    const checkedOutToday = state.passes.filter(p => p.status === "Used").length;

    const items = [
      { value: inside, label: "Currently Inside", cls: "manager-pass-live-stat--inside" },
      { value: checkedInToday, label: "Checked In Today", cls: "" },
      { value: checkedOutToday, label: "Checked Out Today", cls: "" }
    ];

    grid.innerHTML = items.map(item => `
      <div class="manager-pass-live-stat ${item.cls}">
        <strong>${item.value}</strong>
        <span>${item.label}</span>
      </div>
    `).join("");
  }

  /* =======================================================
     PASS TYPE BREAKDOWN
     ======================================================= */

  function renderBreakdown() {
    const wrap = $("pass-type-breakdown");
    if (!wrap) return;

    const activePasses = state.passes.filter(p => p.status === "Active");
    const groups = [
      { label: "Visitor", icon: "fa-user", match: p => p.type.includes("Visitor") },
      { label: "Artisan", icon: "fa-helmet-safety", match: p => p.type === "Artisan" },
      { label: "Ride / Delivery", icon: "fa-motorcycle", match: p => p.type === "Ride / Delivery" },
      { label: "Property Exit", icon: "fa-right-from-bracket", match: p => p.type === "Property Exit" }
    ];

    const counted = groups.map(g => ({ ...g, count: activePasses.filter(g.match).length }));
    const max = Math.max(1, ...counted.map(g => g.count));

    wrap.innerHTML = counted.map(g => `
      <div class="manager-pass-breakdown-row">
        <div class="manager-pass-breakdown-row-top">
          <span><i class="fa-solid ${g.icon}" aria-hidden="true"></i> ${g.label}</span>
          <span>${g.count}</span>
        </div>
        <div class="manager-pass-breakdown-bar">
          <div class="manager-pass-breakdown-bar-fill" style="width:${(g.count / max) * 100}%"></div>
        </div>
      </div>
    `).join("");
  }

  /* =======================================================
     FILTERING
     ======================================================= */

  function getFilteredPasses() {
    const f = state.filters;
    const search = f.search.trim().toLowerCase();

    return state.passes.filter(p => {
      if (f.type !== "all" && p.type !== f.type) return false;
      if (f.status !== "all" && p.status !== f.status) return false;
      if (f.access !== "all" && p.access !== f.access) return false;
      if (f.issuer !== "all" && p.issuedBy !== f.issuer) return false;

      if (search) {
        const haystack = `${p.id} ${p.holderName} ${p.hostResident} ${p.unit} ${p.phone}`.toLowerCase();
        if (!haystack.includes(search)) return false;
      }

      return true;
    });
  }

  /* =======================================================
     TABLE + CARDS + PAGINATION
     ======================================================= */

  function accessCellHtml(access) {
    const isInside = access === "Inside";
    const dotCls = isInside ? "manager-pass-access-dot manager-pass-access-dot--inside" : "manager-pass-access-dot";
    const textCls = isInside ? "manager-pass-access-cell manager-pass-access-cell--inside" : "manager-pass-access-cell";
    return `<span class="${textCls}"><span class="${dotCls}" aria-hidden="true"></span>${access}</span>`;
  }

  function statusBadgeHtml(status) {
    const meta = STATUS_META[status] || { cls: "badge--checkedout", label: status };
    return `<span class="badge ${meta.cls}"><i class="fa-solid fa-circle" aria-hidden="true"></i>${meta.label}</span>`;
  }

  function actionMenuOptions(pass) {
    const isClosed = ["Expired", "Used", "Cancelled", "Denied"].includes(pass.status);
    const opts = [
      { key: "view", icon: "fa-eye", label: "View Pass" },
      { key: "holder", icon: "fa-id-badge", label: pass.type === "Artisan" ? "View Holder" : "View Visitor" },
      { key: "resident", icon: "fa-house-user", label: "View Resident" },
      { key: "activity", icon: "fa-clock-rotate-left", label: "View Activity" },
      { key: "copy", icon: "fa-copy", label: "Copy Pass ID" }
    ];

    if (!isClosed) {
      opts.push({ key: "divider" });
      if (pass.status === "Pending" && !pass.reviewed) {
        opts.push({ key: "review", icon: "fa-check", label: "Mark as Reviewed" });
      }
      opts.push({ key: "cancel", icon: "fa-ban", label: "Cancel Pass", danger: true });
    }

    return opts;
  }

  function renderTableAndCards() {
    const tbody = $("passes-table-body");
    const cardsWrap = $("passes-card-list");
    const emptyState = $("passes-empty-state");
    if (!tbody || !cardsWrap) return;

    const filtered = getFilteredPasses();
    const totalPages = Math.max(1, Math.ceil(filtered.length / state.pageSize));
    if (state.page > totalPages) state.page = totalPages;

    const start = (state.page - 1) * state.pageSize;
    const pageItems = filtered.slice(start, start + state.pageSize);

    const noData = state.passes.length === 0;
    const noMatches = filtered.length === 0;

    emptyState.hidden = !noMatches;
    if (noMatches) {
      $("passes-empty-heading").textContent = noData ? "No access passes yet" : "No passes found";
      $("passes-empty-desc").textContent = noData
        ? "Access passes created by residents, managers, and approved workflows will appear here."
        : "Try adjusting your search or filters.";
    }

    tbody.innerHTML = pageItems.map(pass => `
      <tr data-pass-id="${pass.id}" tabindex="0">
        <td>
          <span class="manager-pass-id-cell">
            ${pass.id}
            <button type="button" class="manager-pass-id-copy" data-copy-id="${pass.id}" aria-label="Copy pass ID ${pass.id}">
              <i class="fa-regular fa-copy" aria-hidden="true"></i>
            </button>
          </span>
        </td>
        <td><span class="manager-pass-type-chip"><i class="fa-solid ${pass.icon}" aria-hidden="true"></i>${pass.badgeLabel}</span></td>
        <td>
          <span class="manager-pass-holder-cell">
            ${escapeHtml(pass.holderName)}
            <span>${pass.phone}</span>
          </span>
        </td>
        <td>${pass.unit}</td>
        <td>${statusBadgeHtml(pass.status)}</td>
        <td>${accessCellHtml(pass.access)}</td>
        <td>${pass.validUntil}</td>
        <td>
          <div class="manager-pass-action-wrap">
            <button type="button" class="manager-pass-action-btn" data-action-toggle="${pass.id}" aria-haspopup="true" aria-expanded="false" aria-label="Actions for ${pass.id}">
              <i class="fa-solid fa-ellipsis-vertical" aria-hidden="true"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join("");

    cardsWrap.innerHTML = pageItems.map(pass => `
      <article class="manager-pass-card" data-pass-id="${pass.id}">
        <div class="manager-pass-card-top">
          <div class="manager-pass-card-holder">
            <strong>${escapeHtml(pass.holderName)}</strong>
            <span>${pass.id} · ${pass.unit}</span>
          </div>
          <div class="manager-pass-action-wrap">
            <button type="button" class="manager-pass-action-btn" data-action-toggle="${pass.id}" aria-haspopup="true" aria-expanded="false" aria-label="Actions for ${pass.id}">
              <i class="fa-solid fa-ellipsis-vertical" aria-hidden="true"></i>
            </button>
          </div>
        </div>
        <div class="manager-pass-card-meta">
          <span class="manager-pass-type-chip"><i class="fa-solid ${pass.icon}" aria-hidden="true"></i>${pass.badgeLabel}</span>
          ${statusBadgeHtml(pass.status)}
          ${accessCellHtml(pass.access)}
        </div>
        <div class="manager-pass-card-foot">
          <span class="manager-pass-card-valid">Valid until ${pass.validUntil}</span>
        </div>
      </article>
    `).join("");

    $("result-count-label").textContent = filtered.length
      ? `Showing ${start + 1}–${Math.min(start + state.pageSize, filtered.length)} of ${filtered.length.toLocaleString()} passes`
      : "Showing 0 passes";

    renderPagination(totalPages, filtered.length);
  }

  function renderPagination(totalPages, totalCount) {
    const wrap = $("pass-pagination");
    if (!wrap) return;

    if (totalCount === 0) {
      wrap.innerHTML = "";
      return;
    }

    const page = state.page;
    let pages = [];

    if (totalPages <= 7) {
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      for (let p = Math.max(2, page - 1); p <= Math.min(totalPages - 1, page + 1); p++) pages.push(p);
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    const pageBtns = pages.map(p => {
      if (p === "...") return `<span class="manager-pass-page-ellipsis">…</span>`;
      return `<button type="button" class="manager-pass-page-btn${p === page ? " is-active" : ""}" data-page="${p}">${p}</button>`;
    }).join("");

    wrap.innerHTML = `
      <button type="button" class="manager-pass-page-btn" data-page="prev" ${page === 1 ? "disabled" : ""}>Previous</button>
      ${pageBtns}
      <button type="button" class="manager-pass-page-btn" data-page="next" ${page === totalPages ? "disabled" : ""}>Next</button>
    `;
  }

  /* =======================================================
     PENDING PASSES
     ======================================================= */

  function renderPendingPasses() {
    const wrap = $("pending-passes-list");
    if (!wrap) return;

    const pending = state.passes.filter(p => p.status === "Pending");
    $("pending-count-label").textContent = `${pending.length} passes awaiting review`;

    if (!pending.length) {
      wrap.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-circle-check"></i>
          <strong>All caught up</strong>
          <span>No passes are currently awaiting review.</span>
        </div>
      `;
      return;
    }

    wrap.innerHTML = pending.slice(0, 6).map(pass => `
      <div class="manager-pass-pending-row" data-pass-id="${pass.id}">
        <span class="manager-pass-pending-icon"><i class="fa-solid ${pass.icon}" aria-hidden="true"></i></span>
        <div class="manager-pass-pending-info">
          <strong>${escapeHtml(pass.holderName)} · ${pass.id}</strong>
          <span>${pass.unit} · ${pass.badgeLabel} · Requested ${pass.createdTime}</span>
        </div>
        <button type="button" class="btn btn--secondary btn--sm" data-review-id="${pass.id}">Review</button>
      </div>
    `).join("");
  }

  /* =======================================================
     RECENT PASS ACTIVITY
     ======================================================= */

  function renderRecentActivity() {
    const wrap = $("recent-pass-activity-list");
    if (!wrap) return;

    if (!state.recentActivity.length) {
      wrap.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-clock-rotate-left"></i>
          <strong>No recent activity</strong>
          <span>Pass activity across the estate will show up here.</span>
        </div>
      `;
      return;
    }

    wrap.innerHTML = state.recentActivity.map(item => `
      <div class="activity-item">
        <span class="activity-icon"><i class="fa-solid ${item.icon}" aria-hidden="true"></i></span>
        <div class="activity-body">
          <strong>${item.passId}</strong>
          <p>${escapeHtml(item.text)}</p>
        </div>
        <span class="activity-time">${item.time}</span>
      </div>
    `).join("");
  }

  /* =======================================================
     DRAWER
     ======================================================= */

  function openDrawer(passId) {
    const pass = findPass(passId);
    if (!pass) return;

    state.activeDrawerPassId = passId;

    $("drawer-pass-id").textContent = pass.id;
    $("drawer-pass-type").textContent = `${pass.type} Pass`;
    $("cancel-modal-pass-id") && ($("cancel-modal-pass-id").textContent = pass.id);

    const isClosed = ["Expired", "Used", "Cancelled", "Denied"].includes(pass.status);
    $("drawer-cancel-btn").hidden = isClosed;

    const timelineHtml = pass.timeline.map(item => `
      <div class="manager-pass-timeline-item">
        <div class="manager-pass-timeline-dot-wrap">
          <span class="manager-pass-timeline-dot" aria-hidden="true"></span>
          <span class="manager-pass-timeline-line" aria-hidden="true"></span>
        </div>
        <div class="manager-pass-timeline-body" style="flex:1; display:flex; justify-content:space-between; gap:8px;">
          <div>
            <strong>${escapeHtml(item.action)}</strong>
            <p>${item.location ? item.location : ""}${item.person ? (item.location ? " · " : "") + item.person : ""}</p>
          </div>
          <span class="manager-pass-timeline-time">${item.time}</span>
        </div>
      </div>
    `).join("");

    const verifiedHtml = pass.access === "Not Used"
      ? `
        <div class="manager-pass-verify-box is-pending">
          <i class="fa-solid fa-hourglass-half" aria-hidden="true"></i>
          <div>
            <strong>Awaiting first scan</strong>
            <span>This pass has not yet been used for estate access.</span>
          </div>
        </div>
      `
      : `
        <div class="manager-pass-verify-box">
          <i class="fa-solid fa-shield-check" aria-hidden="true"></i>
          <div>
            <strong>Verified by ${pass.verifiedBy}</strong>
            <span>${pass.securityId} · ${pass.entryPoint} · ${pass.checkedInTime}</span>
          </div>
        </div>
      `;

    $("drawer-body").innerHTML = `
      <div class="manager-pass-drawer-status-badge">${statusBadgeHtml(pass.status)}</div>

      <div class="manager-pass-drawer-section">
        <h3>${pass.type === "Artisan" ? "Artisan Information" : (pass.type === "Ride / Delivery" ? "Holder Information" : "Visitor Information")}</h3>
        <div class="details-block">
          <div class="details-row"><span>Full Name</span><span>${escapeHtml(pass.holderName)}</span></div>
          <div class="details-row"><span>Phone Number</span><span>${pass.phone}</span></div>
          <div class="details-row"><span>Pass Type</span><span>${pass.type}</span></div>
          <div class="details-row"><span>Category</span><span>${pass.category}</span></div>
        </div>
      </div>

      <div class="manager-pass-drawer-section">
        <h3>Resident Information</h3>
        <div class="details-block">
          <div class="details-row"><span>Host Resident</span><span>${escapeHtml(pass.hostResident)}</span></div>
          <div class="details-row"><span>Unit</span><span>${pass.unit}</span></div>
          <div class="details-row"><span>Block</span><span>${pass.block}</span></div>
          <div class="details-row"><span>Created By</span><span>${pass.issuedBy}</span></div>
        </div>
      </div>

      <div class="manager-pass-drawer-section">
        <h3>Pass Information</h3>
        <div class="details-block">
          <div class="details-row"><span>Pass ID</span><span>${pass.id}</span></div>
          <div class="details-row"><span>Created</span><span>${pass.createdDate}, ${pass.createdTime}</span></div>
          <div class="details-row"><span>Valid From</span><span>${pass.validFrom}</span></div>
          <div class="details-row"><span>Valid Until</span><span>${pass.validUntil}</span></div>
          <div class="details-row"><span>Number of Uses</span><span>${pass.numberOfUses}</span></div>
          <div class="details-row"><span>Access Type</span><span>${pass.accessType}</span></div>
        </div>
      </div>

      <div class="manager-pass-drawer-section">
        <h3>Live Access</h3>
        <div class="details-block" style="margin-bottom:12px;">
          <div class="details-row"><span>Current Status</span><span>${pass.access === "Inside" ? "Inside Estate" : (pass.access === "Not Used" ? "Not Used" : "Outside Estate")}</span></div>
          <div class="details-row"><span>Entry Point</span><span>${pass.entryPoint}</span></div>
        </div>
        ${verifiedHtml}
      </div>

      <div class="manager-pass-drawer-section">
        <h3>Access Pass QR</h3>
        <div class="manager-pass-qr">
          <div class="manager-pass-qr-code"><i class="fa-solid fa-qrcode" aria-hidden="true"></i></div>
          <strong>${pass.id}</strong>
          <span>Scan to verify access</span>
          <button type="button" class="btn btn--ghost btn--sm" id="drawer-qr-download-btn"><i class="fa-solid fa-download" aria-hidden="true"></i> Download / Print</button>
        </div>
      </div>

      <div class="manager-pass-drawer-section">
        <h3>Activity Timeline</h3>
        <div class="manager-pass-timeline">${timelineHtml}</div>
      </div>
    `;

    const downloadBtn = $("drawer-qr-download-btn");
    if (downloadBtn) {
      downloadBtn.addEventListener("click", () => showToast(`QR for ${pass.id} sent to print.`));
    }

    document.body.style.overflow = "hidden";
    $("drawer-backdrop").hidden = false;
    $("pass-drawer").hidden = false;
    requestAnimationFrame(() => {
      $("drawer-backdrop").classList.add("is-open");
      $("pass-drawer").classList.add("is-open");
    });
  }

  function closeDrawer() {
    $("drawer-backdrop").classList.remove("is-open");
    $("pass-drawer").classList.remove("is-open");
    document.body.style.overflow = "";
    setTimeout(() => {
      $("drawer-backdrop").hidden = true;
      $("pass-drawer").hidden = true;
    }, 260);
    state.activeDrawerPassId = null;
  }

  /* =======================================================
     CANCEL PASS MODAL
     ======================================================= */

  function openCancelModal(passId) {
    const pass = findPass(passId);
    if (!pass) return;
    state.cancelTargetId = passId;
    $("cancel-modal-pass-id").textContent = pass.id;

    $("cancel-modal-backdrop").hidden = false;
    $("cancel-pass-modal").hidden = false;
    requestAnimationFrame(() => {
      $("cancel-modal-backdrop").classList.add("is-open");
      $("cancel-pass-modal").classList.add("is-open");
    });
  }

  function closeCancelModal() {
    $("cancel-modal-backdrop").classList.remove("is-open");
    $("cancel-pass-modal").classList.remove("is-open");
    setTimeout(() => {
      $("cancel-modal-backdrop").hidden = true;
      $("cancel-pass-modal").hidden = true;
    }, 200);
    state.cancelTargetId = null;
  }

  function confirmCancelPass() {
    const pass = findPass(state.cancelTargetId);
    if (!pass) return;

    pass.status = "Cancelled";
    pass.access = "Not Used";
    pass.timeline.unshift({ time: "Just now", action: "Pass cancelled by Estate Manager", location: null, person: null });

    closeCancelModal();
    if (state.activeDrawerPassId === pass.id) closeDrawer();

    showToast("Pass cancelled successfully.");
    addActivity("fa-ban", pass.id, "was cancelled by the Estate Manager");
    renderAll();
  }

  /* =======================================================
     CREATE PASS MODAL
     ======================================================= */

  const CREATE_FIELDS = {
    "Visitor": [
      { key: "name", label: "Visitor Full Name", type: "text", full: true },
      { key: "phone", label: "Phone Number", type: "tel" },
      { key: "unit", label: "Host Unit", type: "text" },
      { key: "visitDate", label: "Visit Date", type: "date" },
      { key: "validFrom", label: "Valid From", type: "time" },
      { key: "validUntil", label: "Valid Until", type: "time" },
      { key: "purpose", label: "Purpose", type: "textarea", full: true }
    ],
    "Artisan": [
      { key: "name", label: "Artisan", type: "text", full: true },
      { key: "unit", label: "Associated Unit", type: "text" },
      { key: "visitDate", label: "Visit Date", type: "date" },
      { key: "validFrom", label: "Valid From", type: "time" },
      { key: "validUntil", label: "Valid Until", type: "time" },
      { key: "purpose", label: "Work Purpose", type: "textarea", full: true }
    ],
    "Ride / Delivery": [
      { key: "name", label: "Driver / Company Name", type: "text", full: true },
      { key: "phone", label: "Phone Number", type: "tel" },
      { key: "unit", label: "Destination Unit", type: "text" },
      { key: "purpose", label: "Vehicle / Service Description", type: "text", full: true },
      { key: "validUntil", label: "Valid Until", type: "time" }
    ],
    "Property Exit": [
      { key: "name", label: "Resident", type: "text", full: true },
      { key: "unit", label: "Unit", type: "text" },
      { key: "visitDate", label: "Exit Date", type: "date" },
      { key: "validUntil", label: "Expected Return", type: "time" },
      { key: "purpose", label: "Reason", type: "textarea", full: true }
    ]
  };

  function renderCreateFields() {
    const wrap = $("create-form-fields");
    const fields = CREATE_FIELDS[state.createType];

    wrap.innerHTML = fields.map(f => `
      <div class="manager-pass-field${f.full ? " full-width" : ""}">
        <label for="create-field-${f.key}">${f.label}</label>
        ${f.type === "textarea"
          ? `<textarea id="create-field-${f.key}" name="${f.key}" required></textarea>`
          : `<input id="create-field-${f.key}" name="${f.key}" type="${f.type}" required>`
        }
      </div>
    `).join("");
  }

  function openCreateModal() {
    state.createType = "Visitor";
    document.querySelectorAll(".manager-pass-type-option").forEach(btn => {
      btn.classList.toggle("is-active", btn.dataset.type === "Visitor");
    });
    renderCreateFields();
    $("create-form-error").hidden = true;
    $("create-pass-form").reset();

    $("create-modal-backdrop").hidden = false;
    $("create-pass-modal").hidden = false;
    requestAnimationFrame(() => {
      $("create-modal-backdrop").classList.add("is-open");
      $("create-pass-modal").classList.add("is-open");
    });
  }

  function closeCreateModal() {
    $("create-modal-backdrop").classList.remove("is-open");
    $("create-pass-modal").classList.remove("is-open");
    setTimeout(() => {
      $("create-modal-backdrop").hidden = true;
      $("create-pass-modal").hidden = true;
    }, 200);
  }

  function handleCreateSubmit(event) {
    event.preventDefault();

    const fields = CREATE_FIELDS[state.createType];
    const values = {};
    let missing = false;

    fields.forEach(f => {
      const el = $(`create-field-${f.key}`);
      const val = el ? el.value.trim() : "";
      values[f.key] = val;
      if (!val) missing = true;
    });

    if (missing) {
      $("create-form-error").hidden = false;
      $("create-form-error").textContent = "Please fill in all required fields before creating this pass.";
      return;
    }

    $("create-form-error").hidden = true;

    const typeMap = { "Visitor": "One-Day Visitor", "Artisan": "Artisan", "Ride / Delivery": "Ride / Delivery", "Property Exit": "Property Exit" };
    const type = typeMap[state.createType];
    const meta = TYPE_META[type];
    const id = nextPassId();

    const newPass = {
      id,
      type,
      badgeLabel: meta.badge,
      icon: meta.icon,
      holderName: values.name,
      holderLabel: state.createType === "Artisan" ? "Artisan" : (state.createType === "Ride / Delivery" ? "Holder" : "Visitor"),
      phone: values.phone || "—",
      unit: values.unit || "—",
      block: "—",
      hostResident: state.createType === "Property Exit" ? values.name : "—",
      status: "Active",
      access: "Not Used",
      validUntil: values.validUntil ? `Today, ${values.validUntil}` : "Today",
      validFrom: values.validFrom ? `Today, ${values.validFrom}` : "Today",
      createdDate: "Today",
      createdTime: "Just now",
      checkedInTime: "—",
      checkedOutTime: "—",
      entryPoint: "Main Gate",
      verifiedBy: "—",
      securityId: "—",
      numberOfUses: 0,
      accessType: "Single Entry",
      issuedBy: "Estate Manager",
      reviewed: true,
      category: state.createType === "Artisan" ? "Service Provider" : (state.createType === "Ride / Delivery" ? "Delivery / Ride" : (state.createType === "Property Exit" ? "Resident" : "Guest"))
    };
    newPass.timeline = buildTimeline(newPass);

    state.passes.unshift(newPass);
    closeCreateModal();
    showToast("Access pass created successfully.");
    addActivity("fa-id-card", newPass.id, "was created by the Estate Manager");
    state.page = 1;
    renderAll();
  }

  /* =======================================================
     ACTION MENU
     ======================================================= */

  function closeActionMenus() {
    document.querySelectorAll(".manager-pass-action-menu").forEach(el => el.remove());
    document.querySelectorAll("[data-action-toggle]").forEach(btn => btn.setAttribute("aria-expanded", "false"));
    state.openActionMenuId = null;
  }

  function toggleActionMenu(passId, anchorBtn) {
    if (state.openActionMenuId === passId) {
      closeActionMenus();
      return;
    }
    closeActionMenus();

    const pass = findPass(passId);
    if (!pass) return;

    const menu = document.createElement("div");
    menu.className = "manager-pass-action-menu";
    menu.innerHTML = actionMenuOptions(pass).map(opt => {
      if (opt.key === "divider") return `<hr>`;
      return `<button type="button" data-menu-action="${opt.key}" data-pass-id="${pass.id}" class="${opt.danger ? "manager-pass-action-danger" : ""}"><i class="fa-solid ${opt.icon}" aria-hidden="true"></i>${opt.label}</button>`;
    }).join("");

    anchorBtn.parentElement.appendChild(menu);
    anchorBtn.setAttribute("aria-expanded", "true");
    state.openActionMenuId = passId;
  }

  function handleMenuAction(action, passId) {
    const pass = findPass(passId);
    if (!pass) return;

    closeActionMenus();

    switch (action) {
      case "view":
        openDrawer(passId);
        break;
      case "holder":
        showToast(`Viewing ${pass.holderName}'s profile.`);
        break;
      case "resident":
        showToast(`Viewing resident profile for ${pass.hostResident}.`);
        break;
      case "activity":
        openDrawer(passId);
        break;
      case "copy":
        copyPassId(pass.id);
        break;
      case "review":
        pass.reviewed = true;
        showToast("Pass marked as reviewed.");
        addActivity("fa-check", pass.id, "was marked as reviewed");
        renderAll();
        break;
      case "cancel":
        openCancelModal(passId);
        break;
    }
  }

  /* =======================================================
     FILTER CONTROLS
     ======================================================= */

  function bindFilterControls() {
    $("pass-search-input").addEventListener("input", e => {
      state.filters.search = e.target.value;
      state.page = 1;
      renderTableAndCards();
    });

    $("header-search-input").addEventListener("input", e => {
      $("pass-search-input").value = e.target.value;
      state.filters.search = e.target.value;
      state.page = 1;
      renderTableAndCards();
      document.getElementById("passes-table-body").closest("section").scrollIntoView({ behavior: "smooth", block: "start" });
    });

    $("filter-type").addEventListener("change", e => {
      state.filters.type = e.target.value;
      state.page = 1;
      renderTableAndCards();
    });

    $("filter-status").addEventListener("change", e => {
      state.filters.status = e.target.value;
      state.page = 1;
      renderTableAndCards();
    });

    $("filter-access").addEventListener("change", e => {
      state.filters.access = e.target.value;
      state.page = 1;
      renderTableAndCards();
    });

    $("filter-issuer").addEventListener("change", e => {
      state.filters.issuer = e.target.value;
      state.page = 1;
      renderTableAndCards();
    });

    $("filter-date").addEventListener("change", e => {
      state.filters.date = e.target.value;
      state.page = 1;
      renderTableAndCards();
    });

    function clearFilters() {
      state.filters = { search: "", type: "all", status: "all", access: "all", issuer: "all", date: "" };
      $("pass-search-input").value = "";
      $("header-search-input").value = "";
      $("filter-type").value = "all";
      $("filter-status").value = "all";
      $("filter-access").value = "all";
      $("filter-issuer").value = "all";
      $("filter-date").value = "";
      state.page = 1;
      renderTableAndCards();
      showToast("Filters cleared.");
    }

    $("clear-filters-btn").addEventListener("click", clearFilters);
    $("empty-clear-filters-btn").addEventListener("click", clearFilters);
  }

  /* =======================================================
     TABLE / CARD EVENT DELEGATION
     ======================================================= */

  function bindTableEvents() {
    document.addEventListener("click", event => {
      const copyBtn = event.target.closest("[data-copy-id]");
      if (copyBtn) {
        event.stopPropagation();
        copyPassId(copyBtn.dataset.copyId);
        return;
      }

      const toggleBtn = event.target.closest("[data-action-toggle]");
      if (toggleBtn) {
        event.stopPropagation();
        toggleActionMenu(toggleBtn.dataset.actionToggle, toggleBtn);
        return;
      }

      const menuAction = event.target.closest("[data-menu-action]");
      if (menuAction) {
        event.stopPropagation();
        handleMenuAction(menuAction.dataset.menuAction, menuAction.dataset.passId);
        return;
      }

      const reviewBtn = event.target.closest("[data-review-id]");
      if (reviewBtn) {
        event.stopPropagation();
        openDrawer(reviewBtn.dataset.reviewId);
        return;
      }

      const row = event.target.closest("tr[data-pass-id]");
      if (row && !event.target.closest(".manager-pass-action-wrap")) {
        openDrawer(row.dataset.passId);
        return;
      }

      const card = event.target.closest(".manager-pass-card[data-pass-id]");
      if (card && !event.target.closest(".manager-pass-action-wrap")) {
        openDrawer(card.dataset.passId);
        return;
      }

      if (!event.target.closest(".manager-pass-action-menu") && !event.target.closest("[data-action-toggle]")) {
        closeActionMenus();
      }
    });

    document.addEventListener("keydown", event => {
      const row = event.target.closest("tr[data-pass-id]");
      if (row && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        openDrawer(row.dataset.passId);
      }
    });

    $("pass-pagination").addEventListener("click", event => {
      const btn = event.target.closest("[data-page]");
      if (!btn || btn.disabled) return;

      const val = btn.dataset.page;
      const filtered = getFilteredPasses();
      const totalPages = Math.max(1, Math.ceil(filtered.length / state.pageSize));

      if (val === "prev") state.page = Math.max(1, state.page - 1);
      else if (val === "next") state.page = Math.min(totalPages, state.page + 1);
      else state.page = parseInt(val, 10);

      renderTableAndCards();
      $("passes-table-body").closest("section").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  /* =======================================================
     DRAWER + MODAL EVENTS
     ======================================================= */

  function bindDrawerEvents() {
    $("drawer-close-btn").addEventListener("click", closeDrawer);
    $("drawer-backdrop").addEventListener("click", closeDrawer);

    $("drawer-copy-btn").addEventListener("click", () => {
      if (state.activeDrawerPassId) copyPassId(state.activeDrawerPassId);
    });

    $("drawer-cancel-btn").addEventListener("click", () => {
      if (state.activeDrawerPassId) openCancelModal(state.activeDrawerPassId);
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        if (!$("pass-drawer").hidden) closeDrawer();
        if (!$("cancel-pass-modal").hidden) closeCancelModal();
        if (!$("create-pass-modal").hidden) closeCreateModal();
        closeActionMenus();
      }
    });
  }

  function bindCancelModalEvents() {
    $("cancel-modal-close-btn").addEventListener("click", closeCancelModal);
    $("cancel-modal-keep-btn").addEventListener("click", closeCancelModal);
    $("cancel-modal-backdrop").addEventListener("click", closeCancelModal);
    $("cancel-modal-confirm-btn").addEventListener("click", confirmCancelPass);
  }

  function bindCreateModalEvents() {
    $("open-create-pass-btn").addEventListener("click", openCreateModal);
    $("create-modal-close-btn").addEventListener("click", closeCreateModal);
    $("create-modal-cancel-btn").addEventListener("click", closeCreateModal);
    $("create-modal-backdrop").addEventListener("click", closeCreateModal);
    $("create-pass-form").addEventListener("submit", handleCreateSubmit);

    document.querySelectorAll(".manager-pass-type-option").forEach(btn => {
      btn.addEventListener("click", () => {
        state.createType = btn.dataset.type;
        document.querySelectorAll(".manager-pass-type-option").forEach(b => b.classList.toggle("is-active", b === btn));
        renderCreateFields();
      });
    });
  }

  /* =======================================================
     RENDER ALL
     ======================================================= */

  function renderAll() {
    renderStats();
    renderLiveStatus();
    renderBreakdown();
    renderTableAndCards();
    renderPendingPasses();
    renderRecentActivity();
  }

  /* =======================================================
     INIT
     ======================================================= */

  document.addEventListener("DOMContentLoaded", () => {
    bindFilterControls();
    bindTableEvents();
    bindDrawerEvents();
    bindCancelModalEvents();
    bindCreateModalEvents();
    renderAll();
  });

})();
