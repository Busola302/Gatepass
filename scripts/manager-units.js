/* =========================================================
   RAFARA GATEPASS — ESTATE MANAGER · UNITS PAGE
   Frontend demo logic (mock data, no backend)
   ========================================================= */

(function () {
  "use strict";

  window.RafaraUnits = window.RafaraUnits || {};

  /* =======================================================
     SEEDED RANDOM (deterministic mock data)
     ======================================================= */

  function mulberry32(seed) {
    return function () {
      seed |= 0;
      seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const rand = mulberry32(20260831);

  function randInt(min, max) {
    return Math.floor(rand() * (max - min + 1)) + min;
  }

  function pick(list) {
    return list[Math.floor(rand() * list.length)];
  }

  /* =======================================================
     MOCK DATA POOLS
     ======================================================= */

  const BLOCKS = [
    "Block A", "Block B", "Block C", "Block D",
    "Block 5", "Block 7", "Block 9", "Block 12",
    "Block 15", "Block 20", "Block 24", "Block 28", "Block 32",
    "Palm Street", "Cedar Street", "Rafara Close", "Lakeside Crescent"
  ];

  const UNIT_TYPES = ["Apartment", "Duplex", "Terrace", "Detached House", "Other"];

  const FIRST_NAMES = [
    "Aisha", "Mariam", "David", "Sarah", "Michael", "Amina", "Ibrahim", "Chidinma",
    "Tunde", "Ngozi", "Femi", "Blessing", "Yusuf", "Grace", "Emeka", "Fatima",
    "Kunle", "Halima", "Chinedu", "Zainab", "Ade", "Success", "Musa", "Adaeze"
  ];

  const LAST_NAMES = [
    "Bello", "Okafor", "Adeyemi", "Ibrahim", "Eze", "Balogun", "Musa", "Okonkwo",
    "Abubakar", "Nwosu", "Yusuf", "Adegoke", "Suleiman", "Chukwu", "Lawal", "Uche"
  ];

  const RESIDENT_TYPES = ["Primary Resident", "Family Member", "Tenant"];

  function randomName() {
    return `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
  }

  function randomPhone() {
    return `+234 ${randInt(700, 909)} ${randInt(100, 999)} ${randInt(1000, 9999)}`;
  }

  function initials(name) {
    return name.split(" ").filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join("");
  }

  /* =======================================================
     BUILD UNITS DATASET
     ======================================================= */

  const TOTAL_UNITS = 600;
  const TARGET_AVAILABLE = 16;
  const TARGET_MULTI_RESIDENT = 42;

  function buildResidents(count) {
    const residents = [];
    for (let i = 0; i < count; i++) {
      residents.push({
        name: randomName(),
        phone: randomPhone(),
        type: i === 0 ? "Primary Resident" : pick(RESIDENT_TYPES),
        verified: rand() > 0.12
      });
    }
    return residents;
  }

  function relativeActivity(index) {
    const roll = index % 5;
    if (roll === 0) return `Today, ${String(randInt(6, 11)).padStart(2, "0")}:${String(randInt(0, 59)).padStart(2, "0")} AM`;
    if (roll === 1) return `Today, ${String(randInt(1, 7)).padStart(2, "0")}:${String(randInt(0, 59)).padStart(2, "0")} PM`;
    if (roll === 2) return `Yesterday, ${String(randInt(1, 7)).padStart(2, "0")}:${String(randInt(0, 59)).padStart(2, "0")} PM`;
    if (roll === 3) return `${randInt(2, 6)} days ago`;
    return "—";
  }

  function buildUnits() {
    const units = [];

    // Explicit example units drawn from the product spec.
    const seeded = [
      { unit: "Flat 9", block: "Block 5", status: "Occupied", residentCount: 2, passes: 3, lastActivity: "Today, 08:42 AM" },
      { unit: "Flat 2", block: "Block A", status: "Occupied", residentCount: 1, passes: 1, lastActivity: "Today, 07:18 AM" },
      { unit: "Flat 3", block: "Block 20", status: "Available", residentCount: 0, passes: 0, lastActivity: "—" },
      { unit: "Flat 8", block: "Block 32", status: "Occupied", residentCount: 4, passes: 5, lastActivity: "Yesterday, 06:32 PM" }
    ];

    let multiCount = seeded.filter(s => s.residentCount > 1).length;
    let availableCount = seeded.filter(s => s.status === "Available").length;

    seeded.forEach((s, i) => {
      units.push(makeUnit(i, s.unit, s.block, s.status, s.residentCount, s.passes, s.lastActivity));
    });

    for (let i = seeded.length; i < TOTAL_UNITS; i++) {
      const remaining = TOTAL_UNITS - i;

      // Decide status, making sure we land on exactly TARGET_AVAILABLE available units.
      const availableLeftToAssign = TARGET_AVAILABLE - availableCount;
      const forceAvailable = availableLeftToAssign > 0 && availableLeftToAssign >= remaining;
      const status = forceAvailable || (availableLeftToAssign > 0 && rand() < 0.03)
        ? "Available"
        : "Occupied";

      if (status === "Available") availableCount++;

      let residentCount = 0;
      let passes = 0;

      if (status === "Occupied") {
        const multiLeftToAssign = TARGET_MULTI_RESIDENT - multiCount;
        const occupiedRemaining = remaining; // rough upper bound, fine for deterministic seed
        const forceMulti = multiLeftToAssign > 0 && multiLeftToAssign >= occupiedRemaining;
        const makeMulti = forceMulti || (multiLeftToAssign > 0 && rand() < 0.08);

        residentCount = makeMulti ? randInt(2, 5) : 1;
        if (residentCount > 1) multiCount++;

        passes = randInt(0, 5);
      }

      const blockIndex = i % BLOCKS.length;
      const flatNumber = Math.floor(i / BLOCKS.length) + 1;

      units.push(
        makeUnit(
          i,
          `Flat ${flatNumber}`,
          BLOCKS[blockIndex],
          status,
          residentCount,
          passes,
          relativeActivity(i)
        )
      );
    }

    return units;
  }

  function makeUnit(index, unitName, block, status, residentCount, passes, lastActivity) {
    return {
      id: `unit-${index + 1}`,
      unit: unitName,
      block: block,
      address: `${randInt(1, 40)} ${block}, Millenium Housing Estate`,
      unitType: pick(UNIT_TYPES),
      maxResidents: Math.max(residentCount, randInt(2, 6)),
      status: status,
      dateAdded: `${randInt(1, 28)} ${pick(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"])} 2025`,
      residents: buildResidents(residentCount),
      activePasses: passes,
      visitorsInside: status === "Occupied" ? randInt(0, 2) : 0,
      lastActivity: lastActivity,
      disabled: false
    };
  }

  window.RafaraUnits.DATA = buildUnits();

  window.RafaraUnits.state = {
    page: 1,
    pageSize: 10,
    search: "",
    status: "all",
    block: "all",
    residentCount: "all",
    sort: "unit-asc"
  };

})();


/* =========================================================
   TOAST UTILITY
   ========================================================= */

(function () {
  "use strict";

  function showToast(message, tone) {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toneMap = {
      success: { icon: "fa-circle-check", cls: "toast--success" },
      danger: { icon: "fa-triangle-exclamation", cls: "toast--danger" },
      info: { icon: "fa-circle-info", cls: "toast--info" }
    };

    const config = toneMap[tone] || toneMap.info;

    const toast = document.createElement("div");
    toast.className = `toast ${config.cls}`;
    toast.setAttribute("role", "status");
    toast.innerHTML = `
      <i class="fa-solid ${config.icon}" aria-hidden="true"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add("is-visible"));

    setTimeout(() => {
      toast.classList.remove("is-visible");
      setTimeout(() => toast.remove(), 220);
    }, 3200);
  }

  window.RafaraUnits.showToast = showToast;

})();


/* =========================================================
   RENDERING
   ========================================================= */

(function () {
  "use strict";

  const NS = window.RafaraUnits;

  function statusBadge(status) {
    if (status === "Occupied") {
      return `<span class="badge badge--active"><i class="fa-solid fa-circle" aria-hidden="true"></i> Occupied</span>`;
    }
    return `<span class="badge badge--verified"><i class="fa-solid fa-circle" aria-hidden="true"></i> Available</span>`;
  }

  /* =======================================================
     STATS
     ======================================================= */

  function renderStats() {
    const grid = document.getElementById("units-stats-grid");
    if (!grid) return;

    const total = NS.DATA.length;
    const occupied = NS.DATA.filter(u => u.status === "Occupied").length;
    const available = NS.DATA.filter(u => u.status === "Available").length;
    const multi = NS.DATA.filter(u => u.residents.length > 1).length;

    const cards = [
      { icon: "fa-building", iconClass: "stat-icon--passes", value: total, label: "Total Units / Flats", context: "Across the estate" },
      { icon: "fa-house-circle-check", iconClass: "stat-icon--inside", value: occupied, label: "Occupied", context: "Currently occupied" },
      { icon: "fa-house", iconClass: "stat-icon--upcoming", value: available, label: "Available", context: "Ready for assignment" },
      { icon: "fa-people-roof", iconClass: "stat-icon--pending", value: multi, label: "Multiple Residents", context: "Units with 2+ residents" }
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
     FILTER / SORT / PAGINATE
     ======================================================= */

  function getFiltered() {
    const s = NS.state;
    const query = s.search.trim().toLowerCase();

    let list = NS.DATA.filter(unit => {
      if (query) {
        const residentMatch = unit.residents.some(r => r.name.toLowerCase().includes(query));
        const textMatch =
          unit.unit.toLowerCase().includes(query) ||
          unit.block.toLowerCase().includes(query) ||
          residentMatch;
        if (!textMatch) return false;
      }

      if (s.status !== "all" && unit.status.toLowerCase() !== s.status) return false;

      if (s.block !== "all" && unit.block !== s.block) return false;

      if (s.residentCount !== "all") {
        const count = unit.residents.length;
        if (s.residentCount === "0" && count !== 0) return false;
        if (s.residentCount === "1" && count !== 1) return false;
        if (s.residentCount === "2-3" && !(count >= 2 && count <= 3)) return false;
        if (s.residentCount === "4+" && count < 4) return false;
      }

      return true;
    });

    list = list.slice().sort((a, b) => {
      switch (s.sort) {
        case "unit-desc":
          return b.unit.localeCompare(a.unit, undefined, { numeric: true });
        case "residents-desc":
          return b.residents.length - a.residents.length;
        case "passes-desc":
          return b.activePasses - a.activePasses;
        case "recent":
          return (a.lastActivity === "—" ? 1 : 0) - (b.lastActivity === "—" ? 1 : 0);
        case "unit-asc":
        default:
          return a.unit.localeCompare(b.unit, undefined, { numeric: true });
      }
    });

    return list;
  }

  function avatarStack(residents) {
    if (!residents.length) return "";
    const shown = residents.slice(0, 3);
    const extra = residents.length - shown.length;

    const items = shown.map(r => `<span class="avatar-stack-item" title="${r.name}">${initials(r.name)}</span>`).join("");
    const more = extra > 0 ? `<span class="avatar-stack-more">+${extra}</span>` : "";

    return `<span class="avatar-stack">${items}${more}</span>`;
  }

  function initials(name) {
    return name.split(" ").filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join("");
  }

  /* =======================================================
     TABLE + CARDS
     ======================================================= */

  function renderTable(pageItems) {
    const tbody = document.getElementById("units-table-body");
    if (!tbody) return;

    tbody.innerHTML = pageItems.map(unit => `
      <tr data-unit-id="${unit.id}">
        <td>
          <div class="units-unit-cell" data-open-unit="${unit.id}">
            <span class="units-unit-icon"><i class="fa-solid fa-door-closed" aria-hidden="true"></i></span>
            <span class="units-unit-name">${unit.unit}</span>
          </div>
        </td>
        <td class="units-block-cell">${unit.block}</td>
        <td>${statusBadge(unit.status)}</td>
        <td>
          <div class="units-residents-cell">
            ${avatarStack(unit.residents)}
            <span class="units-residents-count">${unit.residents.length} Resident${unit.residents.length === 1 ? "" : "s"}</span>
          </div>
        </td>
        <td class="units-passes-cell">${unit.activePasses} Active Pass${unit.activePasses === 1 ? "" : "es"}</td>
        <td class="units-last-activity-cell">${unit.lastActivity}</td>
        <td>
          <button type="button" class="row-menu-trigger" data-row-menu-trigger="${unit.id}" aria-haspopup="true" aria-expanded="false" aria-label="Unit actions">
            <i class="fa-solid fa-ellipsis-vertical" aria-hidden="true"></i>
          </button>
        </td>
      </tr>
    `).join("");
  }

  function renderCards(pageItems) {
    const wrap = document.getElementById("units-cards");
    if (!wrap) return;

    wrap.innerHTML = pageItems.map(unit => `
      <article class="unit-card" data-unit-id="${unit.id}">
        <div class="unit-card-top">
          <div class="unit-card-id" data-open-unit="${unit.id}">
            <span class="units-unit-icon"><i class="fa-solid fa-door-closed" aria-hidden="true"></i></span>
            <div>
              <div class="unit-card-name">${unit.unit}</div>
              <div class="unit-card-block">${unit.block}</div>
            </div>
          </div>
          <button type="button" class="row-menu-trigger" data-row-menu-trigger="${unit.id}" aria-haspopup="true" aria-expanded="false" aria-label="Unit actions">
            <i class="fa-solid fa-ellipsis-vertical" aria-hidden="true"></i>
          </button>
        </div>
        <div class="unit-card-rows">
          <div class="unit-card-row"><span>Status</span>${statusBadge(unit.status)}</div>
          <div class="unit-card-row"><span>Residents</span><span>${unit.residents.length}</span></div>
          <div class="unit-card-row"><span>Active Passes</span><span>${unit.activePasses}</span></div>
          <div class="unit-card-row"><span>Last Activity</span><span>${unit.lastActivity}</span></div>
        </div>
      </article>
    `).join("");
  }

  /* =======================================================
     PAGINATION
     ======================================================= */

  function pageRange(current, total) {
    const pages = [];
    const window = 1;

    pages.push(1);

    if (current - window > 2) pages.push("ellipsis");

    for (let p = Math.max(2, current - window); p <= Math.min(total - 1, current + window); p++) {
      pages.push(p);
    }

    if (current + window < total - 1) pages.push("ellipsis");

    if (total > 1) pages.push(total);

    return pages;
  }

  function renderPagination(totalItems) {
    const s = NS.state;
    const summary = document.getElementById("units-pagination-summary");
    const controls = document.getElementById("units-pagination-controls");
    const paginationBar = document.getElementById("units-pagination");
    if (!summary || !controls) return;

    const totalPages = Math.max(1, Math.ceil(totalItems / s.pageSize));

    if (s.page > totalPages) s.page = totalPages;

    if (totalItems === 0) {
      summary.textContent = "Showing 0 units";
      controls.innerHTML = "";
      if (paginationBar) paginationBar.style.display = "none";
      return;
    }

    if (paginationBar) paginationBar.style.display = "";

    const start = (s.page - 1) * s.pageSize + 1;
    const end = Math.min(totalItems, s.page * s.pageSize);
    summary.textContent = `Showing ${start}–${end} of ${totalItems} units`;

    const pages = pageRange(s.page, totalPages);

    const buttons = [
      `<button type="button" class="page-btn" data-page-nav="prev" ${s.page === 1 ? "disabled" : ""}>Previous</button>`
    ];

    pages.forEach(p => {
      if (p === "ellipsis") {
        buttons.push(`<span class="page-btn-ellipsis">…</span>`);
      } else {
        buttons.push(`<button type="button" class="page-btn ${p === s.page ? "is-active" : ""}" data-page="${p}">${p}</button>`);
      }
    });

    buttons.push(`<button type="button" class="page-btn" data-page-nav="next" ${s.page === totalPages ? "disabled" : ""}>Next</button>`);

    controls.innerHTML = buttons.join("");
  }

  /* =======================================================
     MASTER RENDER
     ======================================================= */

  function render() {
    const filtered = getFiltered();
    const s = NS.state;

    const emptyState = document.getElementById("units-empty-state");
    const tableWrap = document.querySelector(".units-table-wrap");
    const cardsWrap = document.getElementById("units-cards");
    const paginationBar = document.getElementById("units-pagination");

    if (!filtered.length) {
      if (emptyState) emptyState.hidden = false;
      if (tableWrap) tableWrap.style.display = "none";
      if (cardsWrap) cardsWrap.style.display = "none";
      if (paginationBar) paginationBar.style.display = "none";
      return;
    }

    if (emptyState) emptyState.hidden = true;
    if (tableWrap) tableWrap.style.display = "";
    if (cardsWrap) cardsWrap.style.display = "";

    const totalPages = Math.max(1, Math.ceil(filtered.length / s.pageSize));
    if (s.page > totalPages) s.page = totalPages;

    const startIndex = (s.page - 1) * s.pageSize;
    const pageItems = filtered.slice(startIndex, startIndex + s.pageSize);

    renderTable(pageItems);
    renderCards(pageItems);
    renderPagination(filtered.length);
  }

  function populateBlockFilter() {
    const select = document.getElementById("units-block-filter");
    if (!select) return;

    const blocks = Array.from(new Set(NS.DATA.map(u => u.block))).sort();

    blocks.forEach(block => {
      const option = document.createElement("option");
      option.value = block;
      option.textContent = block;
      select.appendChild(option);
    });
  }

  NS.render = render;
  NS.renderStats = renderStats;
  NS.getFiltered = getFiltered;
  NS.populateBlockFilter = populateBlockFilter;

})();


/* =========================================================
   TOOLBAR WIRING
   ======================================================= */

(function () {
  "use strict";

  const NS = window.RafaraUnits;

  let searchDebounce = null;

  function wire() {
    const searchInput = document.getElementById("units-search-input");
    const statusFilter = document.getElementById("units-status-filter");
    const blockFilter = document.getElementById("units-block-filter");
    const residentFilter = document.getElementById("units-resident-count-filter");
    const sortSelect = document.getElementById("units-sort");
    const filterBtn = document.getElementById("units-filter-btn");
    const clearBtn = document.getElementById("units-clear-filters-btn");
    const globalSearchBtn = document.getElementById("global-search-btn");

    if (searchInput) {
      searchInput.addEventListener("input", () => {
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(() => {
          NS.state.search = searchInput.value;
          NS.state.page = 1;
          NS.render();
        }, 180);
      });
    }

    if (statusFilter) {
      statusFilter.addEventListener("change", () => {
        NS.state.status = statusFilter.value;
        NS.state.page = 1;
        NS.render();
      });
    }

    if (blockFilter) {
      blockFilter.addEventListener("change", () => {
        NS.state.block = blockFilter.value;
        NS.state.page = 1;
        NS.render();
      });
    }

    if (residentFilter) {
      residentFilter.addEventListener("change", () => {
        NS.state.residentCount = residentFilter.value;
        NS.state.page = 1;
        NS.render();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener("change", () => {
        NS.state.sort = sortSelect.value;
        NS.render();
      });
    }

    if (filterBtn) {
      filterBtn.addEventListener("click", () => {
        NS.state.page = 1;
        NS.render();
        NS.showToast("Filters applied.", "info");
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        NS.state.search = "";
        NS.state.status = "all";
        NS.state.block = "all";
        NS.state.residentCount = "all";
        NS.state.sort = "unit-asc";
        NS.state.page = 1;

        if (searchInput) searchInput.value = "";
        if (statusFilter) statusFilter.value = "all";
        if (blockFilter) blockFilter.value = "all";
        if (residentFilter) residentFilter.value = "all";
        if (sortSelect) sortSelect.value = "unit-asc";

        NS.render();
      });
    }

    if (globalSearchBtn && searchInput) {
      globalSearchBtn.addEventListener("click", () => {
        searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
        searchInput.focus();
      });
    }

    const paginationControls = document.getElementById("units-pagination-controls");
    if (paginationControls) {
      paginationControls.addEventListener("click", event => {
        const pageBtn = event.target.closest("[data-page]");
        const navBtn = event.target.closest("[data-page-nav]");

        if (pageBtn) {
          NS.state.page = parseInt(pageBtn.getAttribute("data-page"), 10);
          NS.render();
          document.querySelector(".units-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
        } else if (navBtn) {
          const dir = navBtn.getAttribute("data-page-nav");
          NS.state.page += dir === "next" ? 1 : -1;
          NS.render();
          document.querySelector(".units-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    NS.populateBlockFilter();
    wire();
  });

})();


/* =========================================================
   ROW ACTION MENU
   ======================================================= */

(function () {
  "use strict";

  const NS = window.RafaraUnits;

  let activeUnitId = null;
  let activeTrigger = null;

  function findUnit(id) {
    return NS.DATA.find(u => u.id === id);
  }

  function closeMenu() {
    const menu = document.getElementById("row-menu");
    if (!menu) return;
    menu.hidden = true;
    if (activeTrigger) activeTrigger.setAttribute("aria-expanded", "false");
    activeTrigger = null;
    activeUnitId = null;
  }

  function openMenu(trigger, unitId) {
    const menu = document.getElementById("row-menu");
    if (!menu) return;

    const wasOpenForSame = !menu.hidden && activeUnitId === unitId;
    closeMenu();
    if (wasOpenForSame) return;

    activeUnitId = unitId;
    activeTrigger = trigger;

    const rect = trigger.getBoundingClientRect();
    menu.hidden = false;

    const menuWidth = menu.offsetWidth || 200;
    let left = rect.right - menuWidth;
    let top = rect.bottom + 6;

    if (left < 8) left = 8;
    if (top + menu.offsetHeight > window.innerHeight - 8) {
      top = rect.top - menu.offsetHeight - 6;
    }

    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;

    trigger.setAttribute("aria-expanded", "true");
  }

  document.addEventListener("click", event => {
    const trigger = event.target.closest("[data-row-menu-trigger]");
    if (trigger) {
      const unitId = trigger.getAttribute("data-row-menu-trigger");
      openMenu(trigger, unitId);
      return;
    }

    const openTrigger = event.target.closest("[data-open-unit]");
    if (openTrigger) {
      const unitId = openTrigger.getAttribute("data-open-unit");
      window.RafaraUnits.openUnitDrawer(unitId);
      return;
    }

    const actionBtn = event.target.closest("[data-row-action]");
    if (actionBtn) {
      const action = actionBtn.getAttribute("data-row-action");
      const unit = findUnit(activeUnitId);
      handleRowAction(action, unit);
      closeMenu();
      return;
    }

    if (!event.target.closest("#row-menu")) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("scroll", closeMenu, true);
  window.addEventListener("resize", closeMenu);

  function handleRowAction(action, unit) {
    if (!unit) return;

    switch (action) {
      case "view-unit":
        window.RafaraUnits.openUnitDrawer(unit.id);
        break;
      case "view-residents":
        window.RafaraUnits.openUnitDrawer(unit.id);
        NS.showToast(`Showing residents for ${unit.unit}.`, "info");
        break;
      case "view-passes":
        NS.showToast(`Showing active passes for ${unit.unit}.`, "info");
        break;
      case "edit-unit":
        window.RafaraUnits.openEditUnitModal(unit.id);
        break;
      case "disable-unit":
        window.RafaraUnits.openDisableUnitModal(unit.id);
        break;
      default:
        break;
    }
  }

})();


/* =========================================================
   VIEW UNIT DRAWER
   ======================================================= */

(function () {
  "use strict";

  const NS = window.RafaraUnits;

  function initials(name) {
    return name.split(" ").filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join("");
  }

  function statusBadgeHTML(status) {
    if (status === "Occupied") {
      return `<span class="badge badge--active"><i class="fa-solid fa-circle" aria-hidden="true"></i> Occupied</span>`;
    }
    return `<span class="badge badge--verified"><i class="fa-solid fa-circle" aria-hidden="true"></i> Available</span>`;
  }

  function openUnitDrawer(unitId) {
    const unit = NS.DATA.find(u => u.id === unitId);
    if (!unit) return;

    const overlay = document.getElementById("unit-drawer-overlay");
    if (!overlay) return;

    document.getElementById("unit-drawer-title").textContent = unit.unit;
    document.getElementById("unit-drawer-sub").textContent = unit.block;
    document.getElementById("unit-drawer-status-badge").innerHTML = statusBadgeHTML(unit.status);

    document.getElementById("unit-drawer-info").innerHTML = `
      <div class="details-row"><span>Unit Number</span><span>${unit.unit}</span></div>
      <div class="details-row"><span>Block / Street</span><span>${unit.block}</span></div>
      <div class="details-row"><span>Address</span><span>${unit.address}</span></div>
      <div class="details-row"><span>Unit Type</span><span>${unit.unitType}</span></div>
      <div class="details-row"><span>Date Added</span><span>${unit.dateAdded}</span></div>
    `;

    const residentsWrap = document.getElementById("unit-drawer-residents");
    if (!unit.residents.length) {
      residentsWrap.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-user-slash" aria-hidden="true"></i>
          <strong>No residents assigned</strong>
          <span>This unit is currently available for assignment.</span>
        </div>
      `;
    } else {
      residentsWrap.innerHTML = unit.residents.map(r => `
        <div class="resident-card">
          <span class="visitor-avatar" aria-hidden="true">${initials(r.name)}</span>
          <div class="resident-card-info">
            <strong>${r.name}</strong>
            <span class="resident-card-meta">
              <span>${r.phone}</span>
              <span>•</span>
              <span>${r.type}</span>
            </span>
          </div>
          <span class="badge ${r.verified ? "badge--verified" : "badge--pending"}">
            <i class="fa-solid fa-circle" aria-hidden="true"></i>
            ${r.verified ? "Verified" : "Pending"}
          </span>
        </div>
      `).join("");
    }

    document.getElementById("unit-drawer-access").innerHTML = `
      <div class="details-row"><span>Active Passes</span><span>${unit.activePasses}</span></div>
      <div class="details-row"><span>Visitors Currently Inside</span><span>${unit.visitorsInside}</span></div>
      <div class="details-row"><span>Last Access Activity</span><span>${unit.lastActivity}</span></div>
    `;

    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add("is-open"));
    document.body.style.overflow = "hidden";

    overlay.dataset.unitId = unitId;
  }

  function closeUnitDrawer() {
    const overlay = document.getElementById("unit-drawer-overlay");
    if (!overlay) return;

    overlay.classList.remove("is-open");
    document.body.style.overflow = "";

    setTimeout(() => {
      overlay.hidden = true;
    }, 250);
  }

  window.RafaraUnits.openUnitDrawer = openUnitDrawer;
  window.RafaraUnits.closeUnitDrawer = closeUnitDrawer;

  document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("unit-drawer-overlay");
    if (!overlay) return;

    overlay.querySelectorAll("[data-close-drawer]").forEach(el => {
      el.addEventListener("click", closeUnitDrawer);
    });

    document.getElementById("unit-drawer-close").addEventListener("click", closeUnitDrawer);

    document.getElementById("unit-drawer-view-residents").addEventListener("click", () => {
      NS.showToast("Opening resident list…", "info");
    });

    document.getElementById("unit-drawer-view-passes").addEventListener("click", () => {
      NS.showToast("Opening active passes…", "info");
    });

    document.getElementById("unit-drawer-edit").addEventListener("click", () => {
      const unitId = overlay.dataset.unitId;
      closeUnitDrawer();
      setTimeout(() => window.RafaraUnits.openEditUnitModal(unitId), 260);
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && overlay.classList.contains("is-open")) {
        closeUnitDrawer();
      }
    });
  });

})();


/* =========================================================
   ADD / EDIT UNIT MODAL
   ======================================================= */

(function () {
  "use strict";

  const NS = window.RafaraUnits;
  let editingUnitId = null;

  const FIELD_IDS = ["unit-number", "unit-block", "unit-address", "unit-type", "unit-max-residents", "unit-status"];

  function el(id) {
    return document.getElementById(`add-${id}`);
  }

  function resetForm() {
    const form = document.getElementById("add-unit-form");
    if (form) form.reset();

    FIELD_IDS.forEach(id => {
      const field = el(id)?.closest(".form-field");
      const error = document.getElementById(`add-${id}-error`);
      if (field) field.classList.remove("has-error");
      if (error) error.textContent = "";
    });
  }

  function openModal(mode, unitId) {
    const overlay = document.getElementById("add-unit-modal-overlay");
    const title = document.getElementById("add-unit-modal-title");
    const submitBtn = document.getElementById("add-unit-submit-btn");
    if (!overlay) return;

    resetForm();
    editingUnitId = mode === "edit" ? unitId : null;

    if (mode === "edit") {
      const unit = NS.DATA.find(u => u.id === unitId);
      if (unit) {
        title.textContent = "Edit Unit";
        submitBtn.textContent = "Save Changes";

        el("unit-number").value = unit.unit;
        el("unit-block").value = unit.block;
        el("unit-address").value = unit.address;
        el("unit-type").value = unit.unitType;
        el("unit-max-residents").value = unit.maxResidents;
        el("unit-status").value = unit.status;
      }
    } else {
      title.textContent = "Add Unit";
      submitBtn.textContent = "Add Unit";
    }

    overlay.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    const overlay = document.getElementById("add-unit-modal-overlay");
    if (!overlay) return;
    overlay.hidden = true;
    document.body.style.overflow = "";
    editingUnitId = null;
  }

  function setError(id, message) {
    const field = el(id)?.closest(".form-field");
    const errorEl = document.getElementById(`add-${id}-error`);
    if (field) field.classList.toggle("has-error", Boolean(message));
    if (errorEl) errorEl.textContent = message || "";
  }

  function validate() {
    let valid = true;

    const unitNumber = el("unit-number").value.trim();
    const block = el("unit-block").value.trim();
    const address = el("unit-address").value.trim();
    const unitType = el("unit-type").value;
    const maxResidents = el("unit-max-residents").value;
    const status = el("unit-status").value;

    if (!unitNumber) { setError("unit-number", "Enter a flat or unit number."); valid = false; } else { setError("unit-number", ""); }
    if (!block) { setError("unit-block", "Enter a block or street."); valid = false; } else { setError("unit-block", ""); }
    if (!address) { setError("unit-address", "Enter an address."); valid = false; } else { setError("unit-address", ""); }
    if (!unitType) { setError("unit-type", "Select a unit type."); valid = false; } else { setError("unit-type", ""); }

    if (!maxResidents || Number(maxResidents) < 1 || Number(maxResidents) > 20) {
      setError("unit-max-residents", "Enter a number between 1 and 20.");
      valid = false;
    } else {
      setError("unit-max-residents", "");
    }

    if (!status) { setError("unit-status", "Select a status."); valid = false; } else { setError("unit-status", ""); }

    return valid ? { unitNumber, block, address, unitType, maxResidents: Number(maxResidents), status } : null;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const values = validate();
    if (!values) return;

    if (editingUnitId) {
      const unit = NS.DATA.find(u => u.id === editingUnitId);
      if (unit) {
        unit.unit = values.unitNumber;
        unit.block = values.block;
        unit.address = values.address;
        unit.unitType = values.unitType;
        unit.maxResidents = values.maxResidents;
        unit.status = values.status;
      }
      NS.showToast(`${values.unitNumber} was updated.`, "success");
    } else {
      NS.DATA.unshift({
        id: `unit-${Date.now()}`,
        unit: values.unitNumber,
        block: values.block,
        address: values.address,
        unitType: values.unitType,
        maxResidents: values.maxResidents,
        status: values.status,
        dateAdded: "Today",
        residents: [],
        activePasses: 0,
        visitorsInside: 0,
        lastActivity: "—",
        disabled: false
      });
      NS.showToast(`${values.unitNumber} was added successfully.`, "success");
    }

    closeModal();
    NS.populateBlockFilter && refreshBlockOptions();
    NS.state.page = 1;
    NS.renderStats();
    NS.render();
  }

  function refreshBlockOptions() {
    const select = document.getElementById("units-block-filter");
    if (!select) return;
    const existing = new Set(Array.from(select.options).map(o => o.value));
    const blocks = Array.from(new Set(NS.DATA.map(u => u.block)));
    blocks.forEach(block => {
      if (!existing.has(block)) {
        const option = document.createElement("option");
        option.value = block;
        option.textContent = block;
        select.appendChild(option);
      }
    });
  }

  window.RafaraUnits.openAddUnitModal = () => openModal("add");
  window.RafaraUnits.openEditUnitModal = unitId => openModal("edit", unitId);
  window.RafaraUnits.closeAddUnitModal = closeModal;

  document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.getElementById("units-add-btn");
    if (addBtn) addBtn.addEventListener("click", () => openModal("add"));

    document.querySelectorAll('[data-close-modal="add-unit"]').forEach(el2 => {
      el2.addEventListener("click", closeModal);
    });

    const form = document.getElementById("add-unit-form");
    if (form) form.addEventListener("submit", handleSubmit);

    document.addEventListener("keydown", event => {
      const overlay = document.getElementById("add-unit-modal-overlay");
      if (event.key === "Escape" && overlay && !overlay.hidden) closeModal();
    });
  });

})();


/* =========================================================
   DISABLE UNIT MODAL
   ======================================================= */

(function () {
  "use strict";

  const NS = window.RafaraUnits;
  let pendingUnitId = null;

  function openModal(unitId) {
    const unit = NS.DATA.find(u => u.id === unitId);
    if (!unit) return;

    pendingUnitId = unitId;

    document.getElementById("disable-unit-name").textContent = `${unit.unit}, ${unit.block}`;

    const overlay = document.getElementById("disable-unit-modal-overlay");
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    const overlay = document.getElementById("disable-unit-modal-overlay");
    if (!overlay) return;
    overlay.hidden = true;
    document.body.style.overflow = "";
    pendingUnitId = null;
  }

  function confirmDisable() {
    const unit = NS.DATA.find(u => u.id === pendingUnitId);
    if (unit) {
      unit.disabled = true;
      unit.status = "Available";
      unit.residents = [];
      unit.activePasses = 0;
      unit.visitorsInside = 0;
      NS.showToast(`${unit.unit} has been disabled.`, "danger");
    }

    closeModal();
    NS.renderStats();
    NS.render();
  }

  window.RafaraUnits.openDisableUnitModal = openModal;

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('[data-close-modal="disable-unit"]').forEach(el => {
      el.addEventListener("click", closeModal);
    });

    const confirmBtn = document.getElementById("disable-unit-confirm-btn");
    if (confirmBtn) confirmBtn.addEventListener("click", confirmDisable);

    document.addEventListener("keydown", event => {
      const overlay = document.getElementById("disable-unit-modal-overlay");
      if (event.key === "Escape" && overlay && !overlay.hidden) closeModal();
    });
  });

})();


/* =========================================================
   INIT
   ======================================================= */

document.addEventListener("DOMContentLoaded", () => {
  window.RafaraUnits.renderStats();
  window.RafaraUnits.render();
});
