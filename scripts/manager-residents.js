/* =========================================================
   RAFARA GATEPASS — ESTATE MANAGER RESIDENTS
   Frontend demo logic
   ========================================================= */

(function () {
  "use strict";

  window.RafaraManagerResidents = window.RafaraManagerResidents || {};

  /* =======================================================
     MOCK DATA
     Structured so a real API response can replace it later,
     e.g. GET /api/manager/residents -> RESIDENTS
     ======================================================= */

  const FIRST_NAMES = [
    "Amina", "Chidera", "Tunde", "Ngozi", "Emeka", "Yusuf", "Folake", "Ifeoma",
    "Bola", "Segun", "Halima", "Chinedu", "Aisha", "Obinna", "Zainab", "Kunle",
    "Adaeze", "Musa", "Temitope", "Grace", "Ibrahim", "Chiamaka", "Wale", "Fatima",
    "Uche", "Damilola", "Rasheed", "Blessing", "Ahmed", "Nkechi"
  ];

  const LAST_NAMES = [
    "Yusuf", "Okafor", "Balogun", "Eze", "Adeyemi", "Bello", "Nwosu", "Lawal",
    "Okonkwo", "Abdullahi", "Fashola", "Ibrahim", "Adebayo", "Chukwu", "Sani",
    "Olawale", "Nnamdi", "Suleiman", "Afolabi", "Umeh"
  ];

  const BLOCKS = ["A", "B", "C", "D", "E", "F"];

  function seededRandom(seed) {
    let value = seed;
    return function () {
      value = (value * 9301 + 49297) % 233280;
      return value / 233280;
    };
  }

  function pick(arr, rand) {
    return arr[Math.floor(rand() * arr.length)];
  }

  function pad(num, len) {
    return String(num).padStart(len, "0");
  }

  function formatDateReadable(date) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  function generateResidents(total) {
    const rand = seededRandom(42);
    const residents = [];
    const now = new Date(2026, 7, 29); // 29 Aug 2026

    const verifiedCount = Math.min(392, total);
    const pendingCount = Math.min(24, total - verifiedCount);
    const suspendedCount = Math.min(12, total);

    for (let i = 0; i < total; i++) {
      const first = pick(FIRST_NAMES, rand);
      const last = pick(LAST_NAMES, rand);
      const block = pick(BLOCKS, rand);
      const unitNumber = 100 + Math.floor(rand() * 320);
      const daysAgo = Math.floor(rand() * 540);
      const joined = new Date(now);
      joined.setDate(joined.getDate() - daysAgo);

      let verification;
      if (i < verifiedCount) verification = "verified";
      else if (i < verifiedCount + pendingCount) verification = "pending";
      else verification = "rejected";

      const status = i < suspendedCount && verification === "verified" ? "suspended" : "active";

      const submitted = new Date(joined);
      submitted.setDate(submitted.getDate() + Math.floor(rand() * 3));

      residents.push({
        id: `RFP-${pad(10000 + i, 5)}`,
        name: `${first} ${last}`,
        block,
        unit: unitNumber,
        phone: `080${Math.floor(rand() * 4)} ${pad(Math.floor(rand() * 900) + 100, 3)} ${pad(Math.floor(rand() * 9000) + 1000, 4)}`,
        email: `${first.toLowerCase()}.${last.toLowerCase()}@example.com`,
        verification,
        status,
        joined,
        submitted,
        activePasses: verification === "verified" ? Math.floor(rand() * 4) : 0,
        visitorsInside: verification === "verified" && status === "active" ? Math.floor(rand() * 3) : 0
      });
    }

    for (let i = residents.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [residents[i], residents[j]] = [residents[j], residents[i]];
    }

    return residents;
  }

  window.RafaraManagerResidents.DATA = {
    residents: generateResidents(428)
  };

})();


/* =========================================================
   STATE + RENDERING
   ========================================================= */

(function () {
  "use strict";

  const NS = window.RafaraManagerResidents;
  const RESIDENTS = NS.DATA.residents;

  const state = {
    search: "",
    filters: { verification: "all", status: "all", unit: "" },
    sort: "newest",
    page: 1,
    pageSize: 10,
    activeMenuId: null
  };

  let verifyTargetId = null;
  let suspendTargetId = null;
  let activeResidentId = null;

  const dom = {};

  function cacheDom() {
    Object.assign(dom, {
      statsGrid: document.getElementById("stats-grid"),

      search: document.getElementById("resident-search"),
      sortSelect: document.getElementById("sort-select"),
      filterToggleBtn: document.getElementById("filter-toggle-btn"),
      filterPanel: document.getElementById("filter-panel"),
      filterCountBadge: document.getElementById("filter-count-badge"),
      unitFilterInput: document.getElementById("unit-filter-input"),
      clearFiltersBtn: document.getElementById("clear-filters-btn"),

      tableWrap: document.getElementById("table-wrap"),
      tableBody: document.getElementById("residents-table-body"),
      cardsWrap: document.getElementById("resident-cards"),
      emptyState: document.getElementById("residents-empty-state"),

      paginationSummary: document.getElementById("pagination-summary"),
      paginationControls: document.getElementById("pagination-controls"),

      verificationList: document.getElementById("verification-list"),
      overviewSummary: document.getElementById("residents-overview-summary"),
      summaryBandText: document.getElementById("summary-band-text"),

      inviteBtn: document.getElementById("invite-resident-btn"),
      inviteOverlay: document.getElementById("invite-modal-overlay"),
      inviteForm: document.getElementById("invite-resident-form"),

      residentOverlay: document.getElementById("resident-modal-overlay"),
      modalAvatar: document.getElementById("modal-avatar"),
      modalTitle: document.getElementById("resident-modal-title"),
      modalResidentId: document.getElementById("modal-resident-id"),
      modalUnit: document.getElementById("modal-unit"),
      modalPhone: document.getElementById("modal-phone"),
      modalEmail: document.getElementById("modal-email"),
      modalVerification: document.getElementById("modal-verification"),
      modalStatus: document.getElementById("modal-status"),
      modalJoined: document.getElementById("modal-joined"),
      modalPasses: document.getElementById("modal-passes"),
      modalVisitors: document.getElementById("modal-visitors"),
      modalProfileActions: document.getElementById("modal-profile-actions"),

      verifyOverlay: document.getElementById("verify-modal-overlay"),
      verifyName: document.getElementById("verify-name"),
      verifyUnit: document.getElementById("verify-unit"),
      verifyPhone: document.getElementById("verify-phone"),
      verifyEmail: document.getElementById("verify-email"),
      verifySubmitted: document.getElementById("verify-submitted"),
      approveBtn: document.getElementById("approve-resident-btn"),
      rejectBtn: document.getElementById("reject-resident-btn"),

      suspendOverlay: document.getElementById("suspend-modal-overlay"),
      confirmSuspendBtn: document.getElementById("confirm-suspend-btn"),

      toastContainer: document.getElementById("toast-container")
    });
  }

  /* ---------------- helpers ---------------- */

  function initials(name) {
    return name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
  }

  function findResident(id) {
    return RESIDENTS.find((r) => r.id === id);
  }

  function verificationBadge(v) {
    const map = {
      verified: { cls: "badge--verified", label: "Verified" },
      pending: { cls: "badge--pending", label: "Pending" },
      rejected: { cls: "badge--revoked", label: "Rejected" }
    };
    const m = map[v];
    return `<span class="badge ${m.cls}"><i class="fa-solid fa-circle" aria-hidden="true"></i>${m.label}</span>`;
  }

  function statusBadge(s) {
    const map = {
      active: { cls: "badge--active", label: "Active" },
      suspended: { cls: "badge--revoked", label: "Suspended" }
    };
    const m = map[s];
    return `<span class="badge ${m.cls}"><i class="fa-solid fa-circle" aria-hidden="true"></i>${m.label}</span>`;
  }

  /* ---------------- toasts ---------------- */

  function showToast(message, type = "success") {
    if (!dom.toastContainer) return;
    const toast = document.createElement("div");
    toast.className = `toast${type === "error" ? " toast--error" : ""}`;
    const icon = type === "error" ? "fa-circle-exclamation" : "fa-circle-check";
    toast.innerHTML = `<i class="fa-solid ${icon}" aria-hidden="true"></i><span>${message}</span>`;
    dom.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.transition = "opacity 0.2s ease";
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 200);
    }, 3200);
  }

  /* ---------------- stats ---------------- */

  function renderStats() {
    if (!dom.statsGrid) return;

    const total = RESIDENTS.length;
    const verified = RESIDENTS.filter((r) => r.verification === "verified").length;
    const pending = RESIDENTS.filter((r) => r.verification === "pending").length;
    const suspended = RESIDENTS.filter((r) => r.status === "suspended").length;

    const cards = [
      {
        icon: "fa-users",
        iconClass: "stat-icon--passes",
        value: total.toLocaleString(),
        label: "Total Residents",
        context: "Registered residents"
      },
      {
        icon: "fa-user-check",
        iconClass: "stat-icon--inside",
        value: verified.toLocaleString(),
        label: "Verified Residents",
        context: `${((verified / total) * 100).toFixed(1)}% verified`
      },
      {
        icon: "fa-clock",
        iconClass: "stat-icon--pending",
        value: pending.toLocaleString(),
        label: "Pending Verification",
        context: "Requires review"
      },
      {
        icon: "fa-user-lock",
        iconClass: "stat-icon--danger",
        value: suspended.toLocaleString(),
        label: "Suspended",
        context: "Restricted accounts"
      }
    ];

    dom.statsGrid.innerHTML = cards
      .map(
        (card) => `
      <article class="stat-card">
        <span class="stat-icon ${card.iconClass}">
          <i class="fa-solid ${card.icon}" aria-hidden="true"></i>
        </span>
        <div class="stat-body">
          <span class="stat-number">${card.value}</span>
          <span class="stat-label">${card.label}</span>
          <span class="stat-context">${card.context}</span>
        </div>
      </article>`
      )
      .join("");

    if (dom.overviewSummary) {
      dom.overviewSummary.innerHTML = `
        <div class="details-row">
          <span><span class="details-dot" style="background:var(--green)"></span>Active</span>
          <span>${(total - suspended).toLocaleString()}</span>
        </div>
        <div class="details-row">
          <span><span class="details-dot" style="background:var(--orange)"></span>Pending Verification</span>
          <span>${pending.toLocaleString()}</span>
        </div>
        <div class="details-row">
          <span><span class="details-dot" style="background:var(--red)"></span>Suspended</span>
          <span>${suspended.toLocaleString()}</span>
        </div>`;
    }

    if (dom.summaryBandText) {
      dom.summaryBandText.textContent =
        `${verified.toLocaleString()} verified residents currently have access to resident services. ` +
        `${pending.toLocaleString()} account${pending === 1 ? " is" : "s are"} awaiting verification.`;
    }
  }

  /* ---------------- filter + sort ---------------- */

  function filterResidents() {
    const q = state.search.trim().toLowerCase();
    const { verification, status, unit } = state.filters;
    const unitQuery = unit.trim().toLowerCase();

    return RESIDENTS.filter((r) => {
      if (verification !== "all" && r.verification !== verification) return false;
      if (status !== "all" && r.status !== status) return false;

      const unitLabel = `block ${r.block} unit ${r.unit}`;
      if (unitQuery && !unitLabel.includes(unitQuery)) return false;

      if (q) {
        const haystack = [r.name, unitLabel, r.phone, r.email, r.id].join(" ").toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }

  function sortResidents(list) {
    const sorted = [...list];
    switch (state.sort) {
      case "oldest":
        sorted.sort((a, b) => a.joined - b.joined);
        break;
      case "nameAsc":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "nameDesc":
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "unitAsc":
        sorted.sort((a, b) => (a.block + pad(a.unit, 4)).localeCompare(b.block + pad(b.unit, 4)));
        break;
      case "newest":
      default:
        sorted.sort((a, b) => b.joined - a.joined);
        break;
    }
    return sorted;
  }

  function pad(num, len) {
    return String(num).padStart(len, "0");
  }

  function formatDateReadable(date) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  function getVisibleResidents() {
    return sortResidents(filterResidents());
  }

  /* ---------------- table + cards + pagination ---------------- */

  function actionsForResident(r) {
    const actions = [{ label: "View Profile", icon: "fa-id-card", action: "view" }];
    if (r.verification === "pending") {
      actions.push({ label: "Verify Resident", icon: "fa-user-check", action: "verify" });
    }
    if (r.status === "active") {
      actions.push({ label: "Suspend Account", icon: "fa-user-lock", action: "suspend", danger: true });
    } else {
      actions.push({ label: "Reactivate Account", icon: "fa-user-check", action: "reactivate" });
    }
    actions.push({ label: "View Passes", icon: "fa-id-badge", action: "passes" });
    return actions;
  }

  function renderActionMenu(id, actions) {
    const isOpen = state.activeMenuId === id;
    return `
      <div class="action-menu" data-menu-for="${id}" ${isOpen ? "" : "hidden"}>
        ${actions
          .map(
            (a) => `
          <button type="button" data-resident-action="${a.action}" data-id="${id}" class="${a.danger ? "is-danger" : ""}">
            <i class="fa-solid ${a.icon}" aria-hidden="true"></i><span>${a.label}</span>
          </button>`
          )
          .join("")}
      </div>`;
  }

  function renderTableRows(items) {
    if (!dom.tableBody) return;
    dom.tableBody.innerHTML = items
      .map((r) => {
        const actions = actionsForResident(r);
        return `
        <tr data-id="${r.id}">
          <td>
            <div class="cell-resident">
              <span class="avatar" aria-hidden="true">${initials(r.name)}</span>
              <div class="cell-resident-text">
                <strong>${r.name}</strong>
                <small>Resident ID: ${r.id}</small>
              </div>
            </div>
          </td>
          <td class="cell-muted">Block ${r.block} · Unit ${r.unit}</td>
          <td class="cell-muted">${r.phone}</td>
          <td>${verificationBadge(r.verification)}</td>
          <td>${statusBadge(r.status)}</td>
          <td class="cell-muted">${formatDateReadable(r.joined)}</td>
          <td class="actions-cell">
            <button class="row-action-btn" type="button" data-action-toggle="${r.id}" aria-haspopup="true" aria-expanded="false" aria-label="Actions for ${r.name}">
              <i class="fa-solid fa-ellipsis-vertical" aria-hidden="true"></i>
            </button>
            ${renderActionMenu(r.id, actions)}
          </td>
        </tr>`;
      })
      .join("");
  }

  function renderResidentCards(items) {
    if (!dom.cardsWrap) return;
    dom.cardsWrap.innerHTML = items
      .map((r) => {
        const actions = actionsForResident(r);
        return `
        <article class="resident-card" data-id="${r.id}">
          <div class="resident-card-top">
            <span class="avatar" aria-hidden="true">${initials(r.name)}</span>
            <div class="resident-card-name">
              <strong>${r.name}</strong>
              ${verificationBadge(r.verification)}
            </div>
          </div>
          <div class="resident-card-meta">
            <span><i class="fa-solid fa-building" aria-hidden="true"></i>Block ${r.block} · Unit ${r.unit}</span>
            <span><i class="fa-solid fa-phone" aria-hidden="true"></i>${r.phone}</span>
          </div>
          <div class="resident-card-bottom">
            <div class="resident-card-status">
              <span>${statusBadge(r.status)}</span>
              <span>Joined ${formatDateReadable(r.joined)}</span>
            </div>
            <div class="resident-card-actions">
              <button class="text-link" type="button" data-resident-action="view" data-id="${r.id}">View Resident</button>
              <button class="row-action-btn" type="button" data-action-toggle="${r.id}" aria-haspopup="true" aria-expanded="false" aria-label="Actions for ${r.name}">
                <i class="fa-solid fa-ellipsis-vertical" aria-hidden="true"></i>
              </button>
              ${renderActionMenu(r.id, actions)}
            </div>
          </div>
        </article>`;
      })
      .join("");
  }

  function getPageNumbers(current, total) {
    const pages = [];
    const windowSize = 1;
    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= current - windowSize && i <= current + windowSize)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  }

  function renderPagination(totalCount, totalPages, start, shownCount) {
    if (!dom.paginationSummary || !dom.paginationControls) return;

    if (totalCount === 0) {
      dom.paginationSummary.textContent = "Showing 0–0 of 0 residents";
      dom.paginationControls.innerHTML = "";
      return;
    }

    const from = start + 1;
    const to = start + shownCount;
    dom.paginationSummary.textContent = `Showing ${from}–${to} of ${totalCount.toLocaleString()} residents`;

    const buttons = [];
    buttons.push(
      `<button class="page-btn" type="button" data-page="prev" ${state.page === 1 ? "disabled" : ""} aria-label="Previous page"><i class="fa-solid fa-chevron-left" aria-hidden="true"></i></button>`
    );

    getPageNumbers(state.page, totalPages).forEach((p) => {
      if (p === "...") {
        buttons.push(`<span class="page-ellipsis">…</span>`);
      } else {
        buttons.push(
          `<button class="page-btn ${p === state.page ? "is-active" : ""}" type="button" data-page="${p}" aria-current="${p === state.page ? "page" : "false"}">${p}</button>`
        );
      }
    });

    buttons.push(
      `<button class="page-btn" type="button" data-page="next" ${state.page === totalPages ? "disabled" : ""} aria-label="Next page"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button>`
    );

    dom.paginationControls.innerHTML = buttons.join("");
  }

  function renderResidents() {
    const all = getVisibleResidents();
    const totalCount = all.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / state.pageSize));
    if (state.page > totalPages) state.page = totalPages;

    const start = (state.page - 1) * state.pageSize;
    const pageItems = all.slice(start, start + state.pageSize);

    if (dom.emptyState) dom.emptyState.hidden = totalCount !== 0;
    if (dom.tableWrap) dom.tableWrap.style.display = totalCount === 0 ? "none" : "";
    if (dom.cardsWrap) dom.cardsWrap.style.display = totalCount === 0 ? "none" : "";

    renderTableRows(pageItems);
    renderResidentCards(pageItems);
    renderPagination(totalCount, totalPages, start, pageItems.length);
  }

  /* ---------------- verification queue ---------------- */

  function renderPendingVerification() {
    if (!dom.verificationList) return;

    const pending = RESIDENTS.filter((r) => r.verification === "pending")
      .sort((a, b) => a.submitted - b.submitted)
      .slice(0, 5);

    if (!pending.length) {
      dom.verificationList.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-circle-check" aria-hidden="true"></i>
          <strong>No pending verification</strong>
          <span>All residents are verified. Nice and tidy.</span>
        </div>`;
      return;
    }

    dom.verificationList.innerHTML = pending
      .map(
        (r) => `
      <div class="visitor-card" data-id="${r.id}">
        <span class="visitor-avatar" aria-hidden="true">${initials(r.name)}</span>
        <div class="visitor-info">
          <strong>${r.name}</strong>
          <span class="visitor-meta">
            <span>Block ${r.block} · Unit ${r.unit}</span>
            <span>•</span>
            <span>Submitted ${formatDateReadable(r.submitted)}</span>
          </span>
        </div>
        <div class="visitor-actions">
          ${verificationBadge("pending")}
          <button class="btn btn--secondary btn--sm" type="button" data-review="${r.id}">Review</button>
        </div>
      </div>`
      )
      .join("");
  }

  /* ---------------- modals ---------------- */

  function openModal(overlay) {
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeModal(overlay) {
    overlay.hidden = true;
    if (![...document.querySelectorAll(".modal-overlay")].some((o) => !o.hidden)) {
      document.body.style.overflow = "";
    }
  }

  function closeAllModals() {
    document.querySelectorAll(".modal-overlay").forEach((o) => (o.hidden = true));
    document.body.style.overflow = "";
  }

  function openResidentModal(id) {
    const r = findResident(id);
    if (!r || !dom.residentOverlay) return;
    activeResidentId = id;

    dom.modalAvatar.textContent = initials(r.name);
    dom.modalTitle.textContent = r.name;
    dom.modalResidentId.textContent = `Resident ID: ${r.id}`;
    dom.modalUnit.textContent = `Block ${r.block} · Unit ${r.unit}`;
    dom.modalPhone.textContent = r.phone;
    dom.modalEmail.textContent = r.email;
    dom.modalVerification.innerHTML = verificationBadge(r.verification);
    dom.modalStatus.innerHTML = statusBadge(r.status);
    dom.modalJoined.textContent = formatDateReadable(r.joined);
    dom.modalPasses.textContent = r.activePasses;
    dom.modalVisitors.textContent = r.visitorsInside;

    const actionButtons = [];
    if (r.verification === "pending") {
      actionButtons.push(`<button class="btn btn--primary" type="button" data-modal-action="verify">Verify Resident</button>`);
    }
    if (r.status === "active") {
      actionButtons.push(`<button class="btn btn--danger" type="button" data-modal-action="suspend">Suspend Account</button>`);
    } else {
      actionButtons.push(`<button class="btn btn--primary" type="button" data-modal-action="reactivate">Reactivate Account</button>`);
    }
    actionButtons.push(`<button class="btn btn--ghost" type="button" data-close-modal>Close</button>`);
    dom.modalProfileActions.innerHTML = actionButtons.join("");

    openModal(dom.residentOverlay);
  }

  function openVerificationModal(id) {
    const r = findResident(id);
    if (!r || !dom.verifyOverlay) return;
    verifyTargetId = id;
    dom.verifyName.textContent = r.name;
    dom.verifyUnit.textContent = `Block ${r.block} · Unit ${r.unit}`;
    dom.verifyPhone.textContent = r.phone;
    dom.verifyEmail.textContent = r.email;
    dom.verifySubmitted.textContent = formatDateReadable(r.submitted);
    openModal(dom.verifyOverlay);
  }

  function openSuspendModal(id) {
    suspendTargetId = id;
    openModal(dom.suspendOverlay);
  }

  /* ---------------- actions ---------------- */

  function verifyResident(id, approve) {
    const r = findResident(id);
    if (!r) return;
    r.verification = approve ? "verified" : "rejected";
    renderStats();
    renderResidents();
    renderPendingVerification();
    showToast(approve ? "Resident verified successfully." : "Resident registration rejected.", approve ? "success" : "error");
  }

  function suspendResident(id) {
    const r = findResident(id);
    if (!r) return;
    r.status = "suspended";
    renderStats();
    renderResidents();
    showToast(`${r.name.split(" ")[0]}'s account has been suspended.`);
  }

  function reactivateResident(id) {
    const r = findResident(id);
    if (!r) return;
    r.status = "active";
    renderStats();
    renderResidents();
    showToast(`${r.name.split(" ")[0]}'s account has been reactivated.`);
  }

  /* ---------------- events ---------------- */

  function updateFilterBadge() {
    let count = 0;
    if (state.filters.verification !== "all") count++;
    if (state.filters.status !== "all") count++;
    if (state.filters.unit.trim()) count++;
    if (dom.filterCountBadge) {
      dom.filterCountBadge.hidden = count === 0;
      dom.filterCountBadge.textContent = count;
    }
  }

  function handleResidentActionClick(e) {
    const toggleBtn = e.target.closest("[data-action-toggle]");
    if (toggleBtn) {
      const id = toggleBtn.dataset.actionToggle;
      state.activeMenuId = state.activeMenuId === id ? null : id;
      renderResidents();
      return;
    }

    const actionBtn = e.target.closest("[data-resident-action]");
    if (actionBtn) {
      const id = actionBtn.dataset.id;
      const action = actionBtn.dataset.residentAction;
      state.activeMenuId = null;

      if (action === "view") openResidentModal(id);
      else if (action === "verify") openVerificationModal(id);
      else if (action === "suspend") openSuspendModal(id);
      else if (action === "reactivate") reactivateResident(id);
      else if (action === "passes") {
        closeAllModals();
        showToast("Opening this resident's passes…");
      }
      renderResidents();
    }
  }

  function bindEvents() {
    let searchTimer;
    if (dom.search) {
      dom.search.addEventListener("input", (e) => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => {
          state.search = e.target.value;
          state.page = 1;
          renderResidents();
        }, 120);
      });
    }

    if (dom.sortSelect) {
      dom.sortSelect.addEventListener("change", (e) => {
        state.sort = e.target.value;
        renderResidents();
      });
    }

    if (dom.filterToggleBtn && dom.filterPanel) {
      dom.filterToggleBtn.addEventListener("click", () => {
        const isHidden = dom.filterPanel.hidden;
        dom.filterPanel.hidden = !isHidden;
        dom.filterToggleBtn.setAttribute("aria-expanded", String(isHidden));
      });
    }

    document.querySelectorAll(".chip-row").forEach((row) => {
      row.addEventListener("click", (e) => {
        const chip = e.target.closest(".chip");
        if (!chip) return;
        const group = row.dataset.filterGroup;
        row.querySelectorAll(".chip").forEach((c) => c.classList.remove("is-active"));
        chip.classList.add("is-active");
        state.filters[group] = chip.dataset.value;
        state.page = 1;
        updateFilterBadge();
        renderResidents();
      });
    });

    let unitTimer;
    if (dom.unitFilterInput) {
      dom.unitFilterInput.addEventListener("input", (e) => {
        clearTimeout(unitTimer);
        unitTimer = setTimeout(() => {
          state.filters.unit = e.target.value;
          state.page = 1;
          updateFilterBadge();
          renderResidents();
        }, 150);
      });
    }

    if (dom.clearFiltersBtn) {
      dom.clearFiltersBtn.addEventListener("click", () => {
        state.filters = { verification: "all", status: "all", unit: "" };
        if (dom.unitFilterInput) dom.unitFilterInput.value = "";
        document.querySelectorAll(".chip-row").forEach((row) => {
          row.querySelectorAll(".chip").forEach((c) => c.classList.remove("is-active"));
          row.querySelector('[data-value="all"]').classList.add("is-active");
        });
        state.page = 1;
        updateFilterBadge();
        renderResidents();
      });
    }

    if (dom.paginationControls) {
      dom.paginationControls.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-page]");
        if (!btn || btn.disabled) return;
        const value = btn.dataset.page;
        if (value === "prev") state.page -= 1;
        else if (value === "next") state.page += 1;
        else state.page = Number(value);
        renderResidents();
        dom.tableWrap.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    }

    if (dom.tableBody) dom.tableBody.addEventListener("click", handleResidentActionClick);
    if (dom.cardsWrap) dom.cardsWrap.addEventListener("click", handleResidentActionClick);

    document.addEventListener("click", (e) => {
      if (!e.target.closest("[data-action-toggle]") && !e.target.closest(".action-menu")) {
        if (state.activeMenuId !== null) {
          state.activeMenuId = null;
          renderResidents();
        }
      }
    });

    if (dom.verificationList) {
      dom.verificationList.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-review]");
        if (!btn) return;
        openVerificationModal(btn.dataset.review);
      });
    }

    if (dom.modalProfileActions) {
      dom.modalProfileActions.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-modal-action]");
        if (!btn || !activeResidentId) return;
        const action = btn.dataset.modalAction;
        if (action === "verify") {
          closeModal(dom.residentOverlay);
          openVerificationModal(activeResidentId);
        } else if (action === "suspend") {
          closeModal(dom.residentOverlay);
          openSuspendModal(activeResidentId);
        } else if (action === "reactivate") {
          reactivateResident(activeResidentId);
          closeModal(dom.residentOverlay);
        }
      });
    }

    if (dom.approveBtn) {
      dom.approveBtn.addEventListener("click", () => {
        if (verifyTargetId) verifyResident(verifyTargetId, true);
        closeModal(dom.verifyOverlay);
      });
    }

    if (dom.rejectBtn) {
      dom.rejectBtn.addEventListener("click", () => {
        if (verifyTargetId) verifyResident(verifyTargetId, false);
        closeModal(dom.verifyOverlay);
      });
    }

    if (dom.confirmSuspendBtn) {
      dom.confirmSuspendBtn.addEventListener("click", () => {
        if (suspendTargetId) suspendResident(suspendTargetId);
        closeModal(dom.suspendOverlay);
      });
    }

    if (dom.inviteBtn && dom.inviteOverlay) {
      dom.inviteBtn.addEventListener("click", () => openModal(dom.inviteOverlay));
    }

    if (dom.inviteForm) {
      dom.inviteForm.addEventListener("submit", (e) => {
        e.preventDefault();
        closeModal(dom.inviteOverlay);
        dom.inviteForm.reset();
        showToast("Resident invitation sent successfully.");
      });
    }

    document.querySelectorAll(".modal-overlay").forEach((overlay) => {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeModal(overlay);
      });
    });

    document.querySelectorAll("[data-close-modal]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const overlay = btn.closest(".modal-overlay");
        if (overlay) closeModal(overlay);
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeAllModals();
    });
  }

  NS.render = {
    all() {
      cacheDom();
      bindEvents();
      updateFilterBadge();
      renderStats();
      renderResidents();
      renderPendingVerification();
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
   NOTIFICATIONS (shared shell — no unread items on this page)
   ========================================================= */

(function () {

  const list =
    document.getElementById("notif-panel-list");

  if (!list) return;

  list.innerHTML = `
    <div class="empty-state">
      <i class="fa-solid fa-bell-slash" aria-hidden="true"></i>
      <strong>No notifications</strong>
      <span>You're all caught up.</span>
    </div>
  `;

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

    window.RafaraManagerResidents.render.all();

  }
);
