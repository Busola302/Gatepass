/* ==========================================================================
   RAFARA GATEPASS — MANAGER RESIDENTS
   scripts/manager-residents.js
   ========================================================================== */

(function () {
  "use strict";

  window.RafaraManagerResidents = window.RafaraManagerResidents || {};

  /* ========================================================================
     1. MOCK DATA
     Structured to be swapped for a real API response later:
     e.g. GET /api/manager/residents  ->  RESIDENTS_DATA
     ======================================================================== */

  const FIRST_NAMES = [
    "Amina", "Chidera", "Tunde", "Ngozi", "Emeka", "Yusuf", "Folake", "Ifeoma",
    "Bola", "Segun", "Halima", "Chinedu", "Aisha", "Obinna", "Zainab", "Kunle",
    "Adaeze", "Musa", "Temitope", "Grace", "Ibrahim", "Chiamaka", "Wale", "Fatima",
    "Uche", "Damilola", "Rasheed", "Blessing", "Ahmed", "Nkechi",
  ];

  const LAST_NAMES = [
    "Yusuf", "Okafor", "Balogun", "Eze", "Adeyemi", "Bello", "Nwosu", "Lawal",
    "Okonkwo", "Abdullahi", "Fashola", "Ibrahim", "Adebayo", "Chukwu", "Sani",
    "Olawale", "Nnamdi", "Suleiman", "Afolabi", "Umeh",
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
    const now = new Date(2026, 7, 29); // 29 Aug 2026, matches "today"

    // Target distribution to match the brief's example stats:
    // 392 verified, 24 pending, remainder rejected; 12 suspended overall.
    const verifiedCount = Math.min(392, total);
    const pendingCount = Math.min(24, total - verifiedCount);
    const suspendedCount = Math.min(12, total);

    for (let i = 0; i < total; i++) {
      const first = pick(FIRST_NAMES, rand);
      const last = pick(LAST_NAMES, rand);
      const block = pick(BLOCKS, rand);
      const unitNumber = 100 + Math.floor(rand() * 320);
      const daysAgo = Math.floor(rand() * 540);
      const joinedDate = new Date(now);
      joinedDate.setDate(joinedDate.getDate() - daysAgo);

      let verification;
      if (i < verifiedCount) verification = "verified";
      else if (i < verifiedCount + pendingCount) verification = "pending";
      else verification = "rejected";

      const status = i < suspendedCount && verification === "verified" ? "suspended" : "active";

      const submittedDate = new Date(joinedDate);
      submittedDate.setDate(submittedDate.getDate() + Math.floor(rand() * 3));

      residents.push({
        id: `RFP-${pad(10000 + i, 5)}`,
        name: `${first} ${last}`,
        block,
        unit: unitNumber,
        phone: `080${Math.floor(rand() * 4)} ${pad(Math.floor(rand() * 900) + 100, 3)} ${pad(Math.floor(rand() * 9000) + 1000, 4)}`,
        email: `${first.toLowerCase()}.${last.toLowerCase()}@example.com`,
        verification,
        status,
        joined: joinedDate,
        submitted: submittedDate,
        activePasses: verification === "verified" ? Math.floor(rand() * 4) : 0,
        visitorsInside: verification === "verified" && status === "active" ? Math.floor(rand() * 3) : 0,
      });
    }

    // Shuffle lightly so verification states aren't visually grouped in the table.
    for (let i = residents.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [residents[i], residents[j]] = [residents[j], residents[i]];
    }

    return residents;
  }

  const RESIDENTS_DATA = generateResidents(428);

  /* ========================================================================
     2. STATE
     ======================================================================== */

  const state = {
    search: "",
    filters: { verification: "all", status: "all", unit: "" },
    sort: "newest",
    page: 1,
    pageSize: 10,
    activeResident: null,
    activeMenuId: null,
  };

  /* ========================================================================
     3. DOM REFERENCES
     ======================================================================== */

  const dom = {
    statTotal: document.getElementById("statTotal"),
    statVerified: document.getElementById("statVerified"),
    statVerifiedLabel: document.getElementById("statVerifiedLabel"),
    statPending: document.getElementById("statPending"),
    statSuspended: document.getElementById("statSuspended"),

    search: document.getElementById("residentSearch"),
    sortSelect: document.getElementById("sortSelect"),
    filterToggleBtn: document.getElementById("filterToggleBtn"),
    filterPanel: document.getElementById("filterPanel"),
    filterBadge: document.getElementById("filterBadge"),
    unitFilterInput: document.getElementById("unitFilterInput"),
    clearFiltersBtn: document.getElementById("clearFiltersBtn"),

    tableBody: document.getElementById("residentsTableBody"),
    cardsWrap: document.getElementById("residentCards"),
    emptyState: document.getElementById("residentsEmptyState"),
    tableWrap: document.querySelector(".table-wrap"),

    paginationSummary: document.getElementById("paginationSummary"),
    paginationControls: document.getElementById("paginationControls"),

    verificationList: document.getElementById("verificationList"),
    verificationEmptyState: document.getElementById("verificationEmptyState"),

    summaryText: document.getElementById("summaryText"),

    inviteResidentBtn: document.getElementById("inviteResidentBtn"),
    inviteModalOverlay: document.getElementById("inviteModalOverlay"),
    inviteResidentForm: document.getElementById("inviteResidentForm"),

    residentModalOverlay: document.getElementById("residentModalOverlay"),
    modalAvatar: document.getElementById("modalAvatar"),
    residentModalTitle: document.getElementById("residentModalTitle"),
    modalResidentId: document.getElementById("modalResidentId"),
    modalUnit: document.getElementById("modalUnit"),
    modalPhone: document.getElementById("modalPhone"),
    modalEmail: document.getElementById("modalEmail"),
    modalVerification: document.getElementById("modalVerification"),
    modalStatus: document.getElementById("modalStatus"),
    modalJoined: document.getElementById("modalJoined"),
    modalPasses: document.getElementById("modalPasses"),
    modalVisitors: document.getElementById("modalVisitors"),
    modalProfileActions: document.getElementById("modalProfileActions"),

    verifyModalOverlay: document.getElementById("verifyModalOverlay"),
    verifyName: document.getElementById("verifyName"),
    verifyUnit: document.getElementById("verifyUnit"),
    verifyPhone: document.getElementById("verifyPhone"),
    verifyEmail: document.getElementById("verifyEmail"),
    verifySubmitted: document.getElementById("verifySubmitted"),
    approveResidentBtn: document.getElementById("approveResidentBtn"),
    rejectResidentBtn: document.getElementById("rejectResidentBtn"),

    suspendModalOverlay: document.getElementById("suspendModalOverlay"),
    confirmSuspendBtn: document.getElementById("confirmSuspendBtn"),

    toastContainer: document.getElementById("toastContainer"),

    menuBtn: document.getElementById("menuBtn"),
    moreBtn: document.getElementById("moreBtn"),
    moreSheet: document.getElementById("moreSheet"),
    moreSheetOverlay: document.getElementById("moreSheetOverlay"),
  };

  let verifyTargetId = null;
  let suspendTargetId = null;

  /* ========================================================================
     4. HELPERS
     ======================================================================== */

  function initials(name) {
    return name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  function findResident(id) {
    return RESIDENTS_DATA.find((r) => r.id === id);
  }

  function verificationBadge(v) {
    const map = {
      verified: { cls: "badge-verified", label: "Verified" },
      pending: { cls: "badge-pending", label: "Pending" },
      rejected: { cls: "badge-rejected", label: "Rejected" },
    };
    const m = map[v];
    return `<span class="badge ${m.cls}">${m.label}</span>`;
  }

  function statusBadge(s) {
    const map = {
      active: { cls: "badge-active", label: "Active" },
      suspended: { cls: "badge-suspended", label: "Suspended" },
    };
    const m = map[s];
    return `<span class="badge ${m.cls}">${m.label}</span>`;
  }

  /* ========================================================================
     5. TOASTS
     ======================================================================== */

  function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast${type === "error" ? " toast-error" : ""}`;
    const icon = type === "error" ? "fa-circle-exclamation" : "fa-circle-check";
    toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`;
    dom.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.transition = "opacity 0.2s ease";
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 200);
    }, 3200);
  }

  /* ========================================================================
     6. STATS
     ======================================================================== */

  function renderStats() {
    const total = RESIDENTS_DATA.length;
    const verified = RESIDENTS_DATA.filter((r) => r.verification === "verified").length;
    const pending = RESIDENTS_DATA.filter((r) => r.verification === "pending").length;
    const suspended = RESIDENTS_DATA.filter((r) => r.status === "suspended").length;

    dom.statTotal.textContent = total.toLocaleString();
    dom.statVerified.textContent = verified.toLocaleString();
    dom.statVerifiedLabel.textContent = `${((verified / total) * 100).toFixed(1)}% verified`;
    dom.statPending.textContent = pending.toLocaleString();
    dom.statSuspended.textContent = suspended.toLocaleString();

    dom.summaryText.textContent =
      `${verified.toLocaleString()} verified residents currently have access to resident services. ` +
      `${pending.toLocaleString()} account${pending === 1 ? " is" : "s are"} awaiting verification.`;
  }

  /* ========================================================================
     7. FILTER + SORT + SEARCH (pure functions over RESIDENTS_DATA)
     ======================================================================== */

  function filterResidents() {
    const q = state.search.trim().toLowerCase();
    const { verification, status, unit } = state.filters;
    const unitQuery = unit.trim().toLowerCase();

    return RESIDENTS_DATA.filter((r) => {
      if (verification !== "all" && r.verification !== verification) return false;
      if (status !== "all" && r.status !== status) return false;

      const unitLabel = `block ${r.block} unit ${r.unit}`;
      if (unitQuery && !unitLabel.includes(unitQuery)) return false;

      if (q) {
        const haystack = [
          r.name,
          `block ${r.block} unit ${r.unit}`,
          r.phone,
          r.email,
          r.id,
        ]
          .join(" ")
          .toLowerCase();
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

  function getVisibleResidents() {
    return sortResidents(filterResidents());
  }

  /* ========================================================================
     8. RENDER: TABLE + CARDS + PAGINATION
     ======================================================================== */

  function renderResidents() {
    const all = getVisibleResidents();
    const totalCount = all.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / state.pageSize));
    if (state.page > totalPages) state.page = totalPages;

    const start = (state.page - 1) * state.pageSize;
    const pageItems = all.slice(start, start + state.pageSize);

    dom.emptyState.hidden = totalCount !== 0;
    dom.tableWrap.style.display = totalCount === 0 ? "none" : "";
    dom.cardsWrap.style.display = totalCount === 0 ? "none" : "";

    renderTableRows(pageItems);
    renderResidentCards(pageItems);
    renderPagination(totalCount, totalPages, start, pageItems.length);
  }

  function actionsForResident(r) {
    const actions = [];
    actions.push({ label: "View Profile", icon: "fa-id-card", action: "view" });
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

  function renderTableRows(items) {
    if (items.length === 0) {
      dom.tableBody.innerHTML = "";
      return;
    }
    dom.tableBody.innerHTML = items
      .map((r) => {
        const actions = actionsForResident(r);
        return `
        <tr data-id="${r.id}">
          <td>
            <div class="cell-resident">
              <span class="avatar avatar-md">${initials(r.name)}</span>
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
            <button class="action-btn" type="button" data-action-toggle="${r.id}" aria-haspopup="true" aria-expanded="false" aria-label="Actions for ${r.name}">
              <i class="fa-solid fa-ellipsis-vertical"></i>
            </button>
            ${renderActionMenu(r.id, actions)}
          </td>
        </tr>`;
      })
      .join("");
  }

  function renderActionMenu(id, actions) {
    const isOpen = state.activeMenuId === id;
    return `
      <div class="action-menu" data-menu-for="${id}" ${isOpen ? "" : "hidden"}>
        ${actions
          .map(
            (a) =>
              `<button type="button" data-resident-action="${a.action}" data-id="${id}" class="${a.danger ? "danger" : ""}">
                <i class="fa-solid ${a.icon}"></i><span>${a.label}</span>
              </button>`
          )
          .join("")}
      </div>`;
  }

  function renderResidentCards(items) {
    if (items.length === 0) {
      dom.cardsWrap.innerHTML = "";
      return;
    }
    dom.cardsWrap.innerHTML = items
      .map((r) => {
        const actions = actionsForResident(r);
        return `
        <article class="resident-card" data-id="${r.id}">
          <div class="resident-card-top">
            <span class="avatar avatar-md">${initials(r.name)}</span>
            <div class="resident-card-name">
              <strong>${r.name}</strong>
              ${verificationBadge(r.verification)}
            </div>
          </div>
          <div class="resident-card-meta">
            <span><i class="fa-solid fa-building"></i>Block ${r.block} · Unit ${r.unit}</span>
            <span><i class="fa-solid fa-phone"></i>${r.phone}</span>
          </div>
          <div class="resident-card-bottom">
            <div class="resident-card-status">
              <span>${statusBadge(r.status)}</span>
              <span>Joined ${formatDateReadable(r.joined)}</span>
            </div>
            <div class="resident-card-actions">
              <button class="view-resident-btn" type="button" data-resident-action="view" data-id="${r.id}">View Resident</button>
              <button class="action-btn" type="button" data-action-toggle="${r.id}" aria-haspopup="true" aria-expanded="false" aria-label="Actions for ${r.name}">
                <i class="fa-solid fa-ellipsis-vertical"></i>
              </button>
              ${renderActionMenu(r.id, actions)}
            </div>
          </div>
        </article>`;
      })
      .join("");
  }

  function renderPagination(totalCount, totalPages, start, shownCount) {
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
      `<button class="page-btn" type="button" data-page="prev" ${state.page === 1 ? "disabled" : ""} aria-label="Previous page"><i class="fa-solid fa-chevron-left"></i></button>`
    );

    const pageNumbers = getPageNumbers(state.page, totalPages);
    pageNumbers.forEach((p) => {
      if (p === "...") {
        buttons.push(`<span class="page-ellipsis">…</span>`);
      } else {
        buttons.push(
          `<button class="page-btn ${p === state.page ? "active" : ""}" type="button" data-page="${p}" aria-current="${p === state.page ? "page" : "false"}">${p}</button>`
        );
      }
    });

    buttons.push(
      `<button class="page-btn" type="button" data-page="next" ${state.page === totalPages ? "disabled" : ""} aria-label="Next page"><i class="fa-solid fa-chevron-right"></i></button>`
    );

    dom.paginationControls.innerHTML = buttons.join("");
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

  /* ========================================================================
     9. RENDER: VERIFICATION QUEUE
     ======================================================================== */

  function renderPendingVerification() {
    const pending = RESIDENTS_DATA.filter((r) => r.verification === "pending")
      .sort((a, b) => a.submitted - b.submitted)
      .slice(0, 5);

    dom.verificationEmptyState.hidden = pending.length !== 0;
    dom.verificationList.style.display = pending.length === 0 ? "none" : "";

    dom.verificationList.innerHTML = pending
      .map(
        (r) => `
        <div class="verification-item" data-id="${r.id}">
          <span class="avatar avatar-sm">${initials(r.name)}</span>
          <div class="verification-item-text">
            <strong>${r.name}</strong>
            <small>Block ${r.block} · Unit ${r.unit}</small>
          </div>
          <span class="verification-item-date">Submitted ${formatDateReadable(r.submitted)}</span>
          ${verificationBadge("pending")}
          <button class="review-btn" type="button" data-review="${r.id}">Review</button>
        </div>`
      )
      .join("");
  }

  /* ========================================================================
     10. MODAL HANDLING
     ======================================================================== */

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
    if (!r) return;
    state.activeResident = id;

    dom.modalAvatar.textContent = initials(r.name);
    dom.residentModalTitle.textContent = r.name;
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
      actionButtons.push(`<button class="btn btn-primary" type="button" data-modal-action="verify">Verify Resident</button>`);
    }
    if (r.status === "active") {
      actionButtons.push(`<button class="btn btn-danger-outline" type="button" data-modal-action="suspend">Suspend Account</button>`);
    } else {
      actionButtons.push(`<button class="btn btn-primary" type="button" data-modal-action="reactivate">Reactivate Account</button>`);
    }
    actionButtons.push(`<button class="btn btn-outline" type="button" data-close-modal>Close</button>`);
    dom.modalProfileActions.innerHTML = actionButtons.join("");

    openModal(dom.residentModalOverlay);
  }

  dom.modalProfileActions.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-modal-action]");
    if (!btn || !state.activeResident) return;
    const action = btn.dataset.modalAction;
    if (action === "verify") {
      closeModal(dom.residentModalOverlay);
      openVerificationModal(state.activeResident);
    } else if (action === "suspend") {
      closeModal(dom.residentModalOverlay);
      openSuspendModal(state.activeResident);
    } else if (action === "reactivate") {
      reactivateResident(state.activeResident);
      closeModal(dom.residentModalOverlay);
    }
  });

  function openVerificationModal(id) {
    const r = findResident(id);
    if (!r) return;
    verifyTargetId = id;
    dom.verifyName.textContent = r.name;
    dom.verifyUnit.textContent = `Block ${r.block} · Unit ${r.unit}`;
    dom.verifyPhone.textContent = r.phone;
    dom.verifyEmail.textContent = r.email;
    dom.verifySubmitted.textContent = formatDateReadable(r.submitted);
    openModal(dom.verifyModalOverlay);
  }

  function openSuspendModal(id) {
    suspendTargetId = id;
    openModal(dom.suspendModalOverlay);
  }

  function openInviteModal() {
    openModal(dom.inviteModalOverlay);
  }

  /* ========================================================================
     11. RESIDENT ACTIONS (mutate mock data, re-render)
     ======================================================================== */

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

  /* ========================================================================
     12. EVENT LISTENERS
     ======================================================================== */

  // Search
  let searchTimer;
  dom.search.addEventListener("input", (e) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      state.search = e.target.value;
      state.page = 1;
      renderResidents();
    }, 120);
  });

  // Sort
  dom.sortSelect.addEventListener("change", (e) => {
    state.sort = e.target.value;
    renderResidents();
  });

  // Filter panel toggle
  dom.filterToggleBtn.addEventListener("click", () => {
    const isHidden = dom.filterPanel.hidden;
    dom.filterPanel.hidden = !isHidden;
    dom.filterToggleBtn.setAttribute("aria-expanded", String(isHidden));
  });

  // Filter chips
  document.querySelectorAll(".chip-row").forEach((row) => {
    row.addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      const group = row.dataset.filterGroup;
      row.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      state.filters[group] = chip.dataset.value;
      state.page = 1;
      updateFilterBadge();
      renderResidents();
    });
  });

  // Unit filter input
  let unitTimer;
  dom.unitFilterInput.addEventListener("input", (e) => {
    clearTimeout(unitTimer);
    unitTimer = setTimeout(() => {
      state.filters.unit = e.target.value;
      state.page = 1;
      updateFilterBadge();
      renderResidents();
    }, 150);
  });

  // Clear filters
  dom.clearFiltersBtn.addEventListener("click", () => {
    state.filters = { verification: "all", status: "all", unit: "" };
    dom.unitFilterInput.value = "";
    document.querySelectorAll(".chip-row").forEach((row) => {
      row.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
      row.querySelector('[data-value="all"]').classList.add("active");
    });
    state.page = 1;
    updateFilterBadge();
    renderResidents();
  });

  function updateFilterBadge() {
    let count = 0;
    if (state.filters.verification !== "all") count++;
    if (state.filters.status !== "all") count++;
    if (state.filters.unit.trim()) count++;
    dom.filterBadge.hidden = count === 0;
    dom.filterBadge.textContent = count;
  }

  // Pagination
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

  // Table + card row action delegation (view / verify / suspend / reactivate / passes)
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

  dom.tableBody.addEventListener("click", handleResidentActionClick);
  dom.cardsWrap.addEventListener("click", handleResidentActionClick);

  // Close action menus when clicking elsewhere
  document.addEventListener("click", (e) => {
    if (!e.target.closest("[data-action-toggle]") && !e.target.closest(".action-menu")) {
      if (state.activeMenuId !== null) {
        state.activeMenuId = null;
        renderResidents();
      }
    }
  });

  // Verification queue "Review" buttons
  dom.verificationList.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-review]");
    if (!btn) return;
    openVerificationModal(btn.dataset.review);
  });

  // Verify modal actions
  dom.approveResidentBtn.addEventListener("click", () => {
    if (verifyTargetId) verifyResident(verifyTargetId, true);
    closeModal(dom.verifyModalOverlay);
  });

  dom.rejectResidentBtn.addEventListener("click", () => {
    if (verifyTargetId) verifyResident(verifyTargetId, false);
    closeModal(dom.verifyModalOverlay);
  });

  // Suspend modal confirm
  dom.confirmSuspendBtn.addEventListener("click", () => {
    if (suspendTargetId) suspendResident(suspendTargetId);
    closeModal(dom.suspendModalOverlay);
  });

  // Invite modal
  dom.inviteResidentBtn.addEventListener("click", openInviteModal);

  dom.inviteResidentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    closeModal(dom.inviteModalOverlay);
    dom.inviteResidentForm.reset();
    showToast("Resident invitation sent successfully.");
  });

  // Generic modal close (overlay click + close buttons)
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
    if (e.key === "Escape") {
      closeAllModals();
      closeMoreSheet();
    }
  });

  /* ========================================================================
     13. MOBILE NAV — MORE SHEET
     ======================================================================== */

  function openMoreSheet() {
    dom.moreSheetOverlay.hidden = false;
    dom.moreSheet.hidden = false;
    dom.moreBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeMoreSheet() {
    dom.moreSheetOverlay.hidden = true;
    dom.moreSheet.hidden = true;
    dom.moreBtn.setAttribute("aria-expanded", "false");
    if ([...document.querySelectorAll(".modal-overlay")].every((o) => o.hidden)) {
      document.body.style.overflow = "";
    }
  }

  dom.moreBtn.addEventListener("click", () => {
    dom.moreSheet.hidden ? openMoreSheet() : closeMoreSheet();
  });

  dom.moreSheetOverlay.addEventListener("click", closeMoreSheet);

  if (dom.menuBtn) {
    dom.menuBtn.addEventListener("click", () => {
      dom.moreSheet.hidden ? openMoreSheet() : closeMoreSheet();
    });
  }

  /* ========================================================================
     14. INIT
     ======================================================================== */

  function init() {
    updateFilterBadge();
    renderStats();
    renderResidents();
    renderPendingVerification();
  }

  document.addEventListener("DOMContentLoaded", init);
  if (document.readyState !== "loading") init();
})();
