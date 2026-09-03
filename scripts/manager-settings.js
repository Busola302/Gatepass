/* =========================================================
   RAFARA GATEPASS — ESTATE MANAGER SETTINGS
   Frontend demo logic (vanilla JS, IIFE-per-concern)
   ========================================================= */

window.RafaraSettings = window.RafaraSettings || {};

/* =========================================================
   1. DEFAULT STATE + DEFAULTS PER SECTION
   ========================================================= */

(function () {
  "use strict";

  const NS = window.RafaraSettings;

  NS.STORAGE_KEY = "rafara-manager-settings-state";

  NS.SECTION_KEYS = {
    general: ["estateName", "location", "contactPhone", "contactEmail"],
    access: ["requirePassVerification", "requireActivePass", "blockExpiredPasses", "blockCancelledPasses", "preventPassReuse", "gates"],
    pass: ["passIdPrefix", "qrVerification", "passSharing", "manualVerification", "passExpiryWarning",
      "deliveryAccess", "deliveryVerification", "deliveryDuration", "deliveryCheckout",
      "requirePropertyExitPass", "propertyExitSecurityVerification", "recordExpectedReturn", "managerReviewExit"],
    visitor: ["residentVisitorPasses", "sameDayVisitors", "multiDayPasses", "visitorCheckIn", "visitorCheckOut", "visitorMaxDuration"],
    artisan: ["artisanVerificationRequired", "residentArtisanRequests", "registeredArtisanAccess", "artisanDuration"],
    security: ["officerVerification", "recordGateActivity", "failedVerificationAlerts", "failedAttemptThreshold", "shiftTracking", "alertRules"],
    notifications: ["notifyPassRequests", "notifySecurityAlerts", "notifyArtisanRequests", "notifyExpiringPasses", "dailySummary", "notifRecipient"],
    managers: ["managers"],
    system: ["autoExpirePasses", "activityRetention", "dateFormat", "timeFormat"]
  };

  function defaultState() {
    return {
      estateName: "Ijaiye Ojokoro Estate",
      location: "Ijaiye Ojokoro, Lagos",
      contactPhone: "",
      contactEmail: "",
      estateStatus: "Active",

      requirePassVerification: true,
      requireActivePass: true,
      blockExpiredPasses: true,
      blockCancelledPasses: true,
      preventPassReuse: true,

      passIdPrefix: "RFP-",
      qrVerification: true,
      passSharing: false,
      manualVerification: true,
      passExpiryWarning: "1 hour before expiry",

      deliveryAccess: true,
      deliveryVerification: true,
      deliveryDuration: "30 Minutes",
      deliveryCheckout: true,

      requirePropertyExitPass: true,
      propertyExitSecurityVerification: true,
      recordExpectedReturn: true,
      managerReviewExit: false,

      residentVisitorPasses: true,
      sameDayVisitors: true,
      multiDayPasses: true,
      visitorCheckIn: true,
      visitorCheckOut: true,
      visitorMaxDuration: "7 Days",

      artisanVerificationRequired: true,
      residentArtisanRequests: true,
      registeredArtisanAccess: true,
      artisanDuration: "7 Days",

      officerVerification: true,
      recordGateActivity: true,
      failedVerificationAlerts: true,
      failedAttemptThreshold: "3 attempts",
      shiftTracking: true,
      alertRules: {
        expiredPassAttempt: true,
        cancelledPassAttempt: true,
        deniedAccess: true,
        repeatedFailedVerification: true,
        unrecognizedVisitor: false,
        suspiciousActivity: true,
        officerStatusChange: false
      },

      notifyPassRequests: true,
      notifySecurityAlerts: true,
      notifyArtisanRequests: true,
      notifyExpiringPasses: true,
      dailySummary: false,
      notifRecipient: "Estate Manager",

      autoExpirePasses: true,
      activityRetention: "1 Year",
      dateFormat: "DD/MM/YYYY",
      timeFormat: "12-hour",

      gates: [
        { id: "g1", name: "Main Gate", type: "Primary Entry", status: "Active", staff: 8, desc: "Primary vehicular and pedestrian entrance." },
        { id: "g2", name: "Service Gate", type: "Service Gate", status: "Active", staff: 4, desc: "Deliveries and service personnel access." },
        { id: "g3", name: "Back Gate", type: "Secondary Entry", status: "Inactive", staff: 0, desc: "Secondary entrance, currently closed." }
      ],

      managers: [
        { id: "m1", name: "Aisha Bello", role: "Estate Manager", status: "Active", permLabel: "Full Access", permissions: NS_ALL_TRUE() },
        { id: "m2", name: "Yusuf Ibrahim", role: "Assistant Manager", status: "Active", permLabel: "Operations", permissions: opsPermissions() },
        { id: "m3", name: "Mariam Adeyemi", role: "Security Supervisor", status: "Active", permLabel: "Security", permissions: securityPermissions() }
      ],

      auditLog: [
        { time: "Today, 09:14 AM", text: "Visitor pass duration changed from 3 days to 7 days.", by: "Aisha Bello" },
        { time: "Yesterday, 04:42 PM", text: "QR verification enabled.", by: "Aisha Bello" },
        { time: "August 30, 02:18 PM", text: "Security alert threshold changed to 3 attempts.", by: "Yusuf Ibrahim" }
      ]
    };
  }

  function NS_ALL_TRUE() {
    const p = {};
    permissionSchema().forEach(group => group.items.forEach(item => { p[item.key] = true; }));
    return p;
  }

  function opsPermissions() {
    const p = {};
    permissionSchema().forEach(group => group.items.forEach(item => {
      p[item.key] = ["viewResidents", "manageResidents", "viewUnits", "manageUnits", "viewPasses", "managePasses", "viewActivity"].includes(item.key);
    }));
    return p;
  }

  function securityPermissions() {
    const p = {};
    permissionSchema().forEach(group => group.items.forEach(item => {
      p[item.key] = ["viewSecurity", "manageSecurity", "viewActivity"].includes(item.key);
    }));
    return p;
  }

  NS.permissionSchema = permissionSchema;
  function permissionSchema() {
    return [
      { title: "Residents", items: [{ key: "viewResidents", label: "View Residents" }, { key: "manageResidents", label: "Manage Residents" }] },
      { title: "Units", items: [{ key: "viewUnits", label: "View Units" }, { key: "manageUnits", label: "Manage Units" }] },
      { title: "Security", items: [{ key: "viewSecurity", label: "View Security" }, { key: "manageSecurity", label: "Manage Security" }] },
      { title: "Artisans", items: [{ key: "viewArtisans", label: "View Artisans" }, { key: "manageArtisans", label: "Manage Artisans" }] },
      { title: "Passes", items: [{ key: "viewPasses", label: "View Passes" }, { key: "managePasses", label: "Manage Passes" }] },
      { title: "Activity", items: [{ key: "viewActivity", label: "View Activity" }, { key: "exportActivity", label: "Export Activity" }] },
      { title: "Settings", items: [{ key: "viewSettings", label: "View Settings" }, { key: "manageSettings", label: "Manage Settings" }] }
    ];
  }

  NS.defaultState = defaultState;

  function loadState() {
    try {
      const raw = localStorage.getItem(NS.STORAGE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      return Object.assign(defaultState(), parsed);
    } catch (err) {
      return defaultState();
    }
  }

  function persist() {
    try {
      localStorage.setItem(NS.STORAGE_KEY, JSON.stringify(NS.state));
    } catch (err) {
      /* storage unavailable — fail silently for this prototype */
    }
  }

  NS.state = loadState();
  NS.persist = persist;

  // draft holds pending (unsaved) changes per active section
  NS.draft = {};
  NS.dirty = false;

})();


/* =========================================================
   2. TOAST NOTIFICATIONS
   ========================================================= */

(function () {
  "use strict";
  const NS = window.RafaraSettings;

  NS.toast = function (message, icon) {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const el = document.createElement("div");
    el.className = "manager-settings-toast-item";
    el.style.cssText = "display:flex;align-items:center;gap:10px;padding:12px 16px;border-radius:12px;background:#050a30;color:#fff;font-size:12.5px;font-weight:600;box-shadow:0 14px 35px rgba(5,10,48,.25);transform:translateY(8px);opacity:0;transition:transform .2s ease,opacity .2s ease;";
    el.innerHTML = `<i class="fa-solid ${icon || 'fa-circle-check'}" style="color:#a998ff;"></i><span>${message}</span>`;
    container.appendChild(el);

    requestAnimationFrame(() => {
      el.style.transform = "translateY(0)";
      el.style.opacity = "1";
    });

    setTimeout(() => {
      el.style.transform = "translateY(8px)";
      el.style.opacity = "0";
      setTimeout(() => el.remove(), 220);
    }, 3200);
  };
})();


/* =========================================================
   3. SIDEBAR / DROPDOWNS / MOBILE SHEET / LOGOUT (shared chrome)
   ========================================================= */

(function () {
  "use strict";

  const sidebar = document.getElementById("sidebar");
  const backdrop = document.getElementById("sidebar-backdrop");
  const toggle = document.getElementById("sidebar-toggle-btn");

  if (sidebar && backdrop && toggle) {
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
      sidebar.classList.contains("is-open") ? closeSidebar() : openSidebar();
    });
    backdrop.addEventListener("click", closeSidebar);
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeSidebar(); });
  }

  const dropdowns = document.querySelectorAll("[data-dropdown]");
  if (dropdowns.length) {
    function closeAll(except) {
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
      button.addEventListener("click", e => {
        e.stopPropagation();
        const wasOpen = !panel.hidden;
        closeAll();
        panel.hidden = wasOpen;
        button.setAttribute("aria-expanded", String(!wasOpen));
      });
    });
    document.addEventListener("click", e => {
      const inside = [...dropdowns].some(d => d.contains(e.target));
      if (!inside) closeAll();
    });
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeAll(); });
  }

  const sheet = document.getElementById("mobile-menu-sheet");
  const sheetBtn = document.getElementById("mobile-menu-btn");
  const closeTriggers = document.querySelectorAll("[data-close-mobile-sheet]");
  if (sheet && sheetBtn) {
    function openSheet() {
      sheet.hidden = false;
      requestAnimationFrame(() => sheet.classList.add("is-open"));
      sheetBtn.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }
    function closeSheet() {
      sheet.classList.remove("is-open");
      sheetBtn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      setTimeout(() => { sheet.hidden = true; }, 220);
    }
    sheetBtn.addEventListener("click", () => { sheet.hidden ? openSheet() : closeSheet(); });
    closeTriggers.forEach(t => t.addEventListener("click", closeSheet));
    document.addEventListener("keydown", e => { if (e.key === "Escape" && !sheet.hidden) closeSheet(); });
  }

  const logoutTriggers = [
    document.getElementById("logout-btn"),
    document.getElementById("mobile-logout-btn"),
    document.getElementById("dropdown-logout-btn")
  ].filter(Boolean);
  logoutTriggers.forEach(btn => btn.addEventListener("click", () => { window.location.href = "manager-login.html"; }));

})();


/* =========================================================
   4. GENERIC MODAL HELPERS
   ========================================================= */

(function () {
  "use strict";
  const NS = window.RafaraSettings;

  NS.openModal = function (id) {
    const el = document.getElementById(id);
    if (el) el.hidden = false;
  };
  NS.closeModal = function (id) {
    const el = document.getElementById(id);
    if (el) el.hidden = true;
  };

  document.querySelectorAll("[data-close-modal]").forEach(btn => {
    btn.addEventListener("click", () => NS.closeModal(btn.getAttribute("data-close-modal")));
  });
  document.querySelectorAll(".manager-settings-modal-backdrop").forEach(backdrop => {
    backdrop.addEventListener("click", e => {
      if (e.target === backdrop) backdrop.hidden = true;
    });
  });
  document.addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    document.querySelectorAll(".manager-settings-modal-backdrop").forEach(m => { m.hidden = true; });
  });

})();


/* =========================================================
   5. UNSAVED-CHANGES BANNER
   ========================================================= */

(function () {
  "use strict";
  const NS = window.RafaraSettings;
  const banner = document.getElementById("unsaved-banner");

  NS.markDirty = function () {
    NS.dirty = true;
    if (banner) banner.hidden = false;
  };

  NS.clearDirty = function () {
    NS.dirty = false;
    NS.draft = {};
    if (banner) banner.hidden = true;
  };

  const discardBtn = document.getElementById("discard-changes-btn");
  const saveBtn = document.getElementById("save-changes-btn");

  if (discardBtn) {
    discardBtn.addEventListener("click", () => {
      NS.state = loadFromStorage();
      NS.clearDirty();
      NS.render.currentSection();
      NS.toast("Changes discarded.", "fa-rotate-left");
    });
  }
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      NS.persist();
      NS.clearDirty();
      NS.toast("Settings saved successfully.");
    });
  }

  function loadFromStorage() {
    try {
      const raw = localStorage.getItem(NS.STORAGE_KEY);
      return raw ? Object.assign(NS.defaultState(), JSON.parse(raw)) : NS.defaultState();
    } catch (e) {
      return NS.defaultState();
    }
  }

})();


/* =========================================================
   6. SETTINGS NAVIGATION + SEARCH
   ========================================================= */

(function () {
  "use strict";
  const NS = window.RafaraSettings;

  NS.currentSection = "general";

  const navButtons = document.querySelectorAll(".manager-settings-nav-item");
  const navSelect = document.getElementById("settings-nav-select");
  const panels = document.querySelectorAll(".manager-settings-panel");

  function showSection(key) {
    NS.currentSection = key;
    panels.forEach(p => { p.hidden = p.getAttribute("data-panel") !== key; });
    navButtons.forEach(b => b.classList.toggle("is-active", b.getAttribute("data-section") === key));
    if (navSelect) navSelect.value = key;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  NS.showSection = showSection;

  navButtons.forEach(btn => {
    btn.addEventListener("click", () => showSection(btn.getAttribute("data-section")));
  });
  if (navSelect) {
    navSelect.addEventListener("change", () => showSection(navSelect.value));
  }

  /* ---- search ---- */
  const searchInput = document.getElementById("settings-search");
  const noResults = document.getElementById("settings-no-results");

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const q = searchInput.value.trim().toLowerCase();

      if (!q) {
        document.querySelectorAll(".manager-settings-card").forEach(c => {
          c.classList.remove("is-hidden-by-search", "is-match");
        });
        navButtons.forEach(b => b.classList.remove("is-dimmed"));
        if (noResults) noResults.hidden = true;
        return;
      }

      let anyVisible = false;
      const matchedSections = new Set();

      document.querySelectorAll(".manager-settings-card").forEach(card => {
        const text = card.textContent.toLowerCase();
        const matches = text.includes(q);
        card.classList.toggle("is-hidden-by-search", !matches);
        card.classList.toggle("is-match", matches);
        if (matches) {
          anyVisible = true;
          const panel = card.closest(".manager-settings-panel");
          if (panel) matchedSections.add(panel.getAttribute("data-panel"));
        }
      });

      navButtons.forEach(b => {
        const key = b.getAttribute("data-section");
        b.classList.toggle("is-dimmed", q.length > 0 && !matchedSections.has(key));
      });

      // reveal all panels so matches across sections are visible while searching
      panels.forEach(p => {
        const key = p.getAttribute("data-panel");
        p.hidden = !matchedSections.has(key);
      });

      if (noResults) noResults.hidden = anyVisible;
    });
  }

})();


/* =========================================================
   7. TOGGLE SWITCHES (generic wiring)
   ========================================================= */

(function () {
  "use strict";
  const NS = window.RafaraSettings;

  function syncToggle(btn) {
    const key = btn.getAttribute("data-toggle");
    if (!key) return;
    const val = !!NS.state[key];
    btn.setAttribute("aria-checked", String(val));
  }

  NS.syncAllToggles = function () {
    document.querySelectorAll(".toggle-switch[data-toggle]").forEach(syncToggle);
  };

  document.querySelectorAll(".toggle-switch[data-toggle]").forEach(btn => {
    syncToggle(btn);
    if (btn.disabled) return;
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-toggle");
      NS.state[key] = !NS.state[key];
      btn.setAttribute("aria-checked", String(NS.state[key]));
      NS.markDirty();
    });
  });

})();


/* =========================================================
   8. RENDER FUNCTIONS
   ========================================================= */

(function () {
  "use strict";
  const NS = window.RafaraSettings;
  const S = () => NS.state;

  function renderGeneral() {
    const nameEl = document.getElementById("f-estate-name");
    const locEl = document.getElementById("f-location");
    const phoneEl = document.getElementById("f-contact-phone");
    const emailEl = document.getElementById("f-contact-email");
    if (nameEl) nameEl.value = S().estateName;
    if (locEl) locEl.value = S().location;
    if (phoneEl) phoneEl.value = S().contactPhone;
    if (emailEl) emailEl.value = S().contactEmail;

    const pill = document.getElementById("estate-status-pill");
    const desc = document.getElementById("estate-status-desc");
    const dangerBtn = document.getElementById("danger-zone-btn");
    const dangerTitle = document.getElementById("danger-title");
    const active = S().estateStatus === "Active";

    if (pill) {
      pill.classList.toggle("is-inactive", !active);
      pill.innerHTML = `<i class="fa-solid fa-circle" aria-hidden="true"></i> ${S().estateStatus}`;
    }
    if (desc) {
      desc.textContent = active
        ? "Rafara is currently managing access for this estate."
        : "Rafara access management is currently paused for this estate.";
    }
    if (dangerBtn && dangerTitle) {
      dangerTitle.textContent = active ? "Deactivate Estate Access" : "Reactivate Estate Access";
      dangerBtn.textContent = active ? "Deactivate Estate" : "Reactivate Estate";
      dangerBtn.classList.toggle("btn--danger", active);
      dangerBtn.classList.toggle("btn--secondary", !active);
    }
  }

  function renderPassFields() {
    const prefix = document.getElementById("pass-id-prefix");
    const warning = document.getElementById("pass-expiry-warning");
    const deliveryDuration = document.getElementById("delivery-duration");
    if (prefix) prefix.value = S().passIdPrefix;
    if (warning) warning.value = S().passExpiryWarning;
    if (deliveryDuration) deliveryDuration.value = S().deliveryDuration;
  }

  function renderVisitorFields() {
    const el = document.getElementById("visitor-max-duration");
    if (el) el.value = S().visitorMaxDuration;
  }

  function renderArtisanFields() {
    const el = document.getElementById("artisan-duration");
    if (el) el.value = S().artisanDuration;
  }

  function renderSecurityFields() {
    const el = document.getElementById("failed-attempt-threshold");
    if (el) el.value = S().failedAttemptThreshold;
    document.querySelectorAll("#alert-checkbox-grid input[data-alert]").forEach(cb => {
      cb.checked = !!S().alertRules[cb.getAttribute("data-alert")];
    });
  }

  function renderNotifFields() {
    const el = document.getElementById("notif-recipient");
    if (el) el.value = S().notifRecipient;
  }

  function renderSystemFields() {
    const retention = document.getElementById("activity-retention");
    const dateFmt = document.getElementById("date-format");
    const timeFmt = document.getElementById("time-format");
    if (retention) retention.value = S().activityRetention;
    if (dateFmt) dateFmt.value = S().dateFormat;
    if (timeFmt) timeFmt.value = S().timeFormat;
  }

  function renderGates() {
    const wrap = document.getElementById("gate-list");
    if (!wrap) return;
    wrap.innerHTML = S().gates.map(gate => `
      <div class="manager-settings-gate-card" data-gate-id="${gate.id}">
        <span class="manager-settings-gate-icon"><i class="fa-solid fa-door-closed" aria-hidden="true"></i></span>
        <div class="manager-settings-gate-info">
          <strong>${gate.name}</strong>
          <div class="manager-settings-gate-meta">
            <span class="badge ${gate.status === 'Active' ? 'badge--active' : 'badge--inactive'}"><i class="fa-solid fa-circle"></i> ${gate.status}</span>
            <span>${gate.type}</span>
            ${gate.staff ? `<span>${gate.staff} security staff</span>` : ""}
          </div>
        </div>
        <button type="button" class="btn btn--ghost btn--sm" data-manage-gate="${gate.id}">Manage</button>
      </div>
    `).join("");

    wrap.querySelectorAll("[data-manage-gate]").forEach(btn => {
      btn.addEventListener("click", () => NS.openGateModal(btn.getAttribute("data-manage-gate")));
    });
  }

  function renderManagers() {
    const wrap = document.getElementById("manager-list");
    if (!wrap) return;
    wrap.innerHTML = S().managers.map(mgr => `
      <div class="manager-settings-manager-card" data-manager-id="${mgr.id}">
        <span class="avatar" aria-hidden="true">${initials(mgr.name)}</span>
        <div class="manager-settings-manager-info">
          <strong>${mgr.name}</strong>
          <div class="manager-settings-manager-meta">
            <span>${mgr.role}</span>
            <span class="badge badge--active"><i class="fa-solid fa-circle"></i> ${mgr.status}</span>
            <span>${mgr.permLabel}</span>
          </div>
        </div>
        <button type="button" class="btn btn--ghost btn--sm" data-manage-manager="${mgr.id}">Manage</button>
      </div>
    `).join("");

    wrap.querySelectorAll("[data-manage-manager]").forEach(btn => {
      btn.addEventListener("click", () => NS.openPermissionsModal(btn.getAttribute("data-manage-manager")));
    });
  }

  function renderAudit() {
    const wrap = document.getElementById("audit-list");
    if (!wrap) return;
    wrap.innerHTML = S().auditLog.map(entry => `
      <div class="manager-settings-audit-item">
        <time>${entry.time}</time>
        <p>${entry.text}</p>
        <span>By: ${entry.by}</span>
      </div>
    `).join("");
  }

  function initials(name) {
    return name.split(" ").filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join("");
  }

  NS.render = {
    all() {
      renderGeneral();
      renderPassFields();
      renderVisitorFields();
      renderArtisanFields();
      renderSecurityFields();
      renderNotifFields();
      renderSystemFields();
      renderGates();
      renderManagers();
      renderAudit();
      NS.syncAllToggles();
    },
    currentSection() {
      NS.render.all();
    }
  };

})();


/* =========================================================
   9. GENERAL FORM SAVE / DISCARD
   ========================================================= */

(function () {
  "use strict";
  const NS = window.RafaraSettings;
  const form = document.getElementById("general-form");

  if (form) {
    form.addEventListener("input", () => NS.markDirty());
  }

  const saveBtn = document.getElementById("save-general-btn");
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      NS.state.estateName = document.getElementById("f-estate-name").value.trim() || NS.state.estateName;
      NS.state.location = document.getElementById("f-location").value.trim() || NS.state.location;
      NS.state.contactPhone = document.getElementById("f-contact-phone").value.trim();
      NS.state.contactEmail = document.getElementById("f-contact-email").value.trim();
      NS.persist();
      NS.clearDirty();
      NS.render.all();
      NS.toast("Estate settings updated successfully.");
    });
  }

  document.querySelectorAll("[data-discard-form]").forEach(btn => {
    btn.addEventListener("click", () => {
      NS.render.all();
      NS.clearDirty();
    });
  });

})();


/* =========================================================
   10. SECTION FIELD SAVES (pass / visitor / artisan / security / notifications / system)
   ========================================================= */

(function () {
  "use strict";
  const NS = window.RafaraSettings;

  // sync select/input values into state on change, mark dirty
  const bindings = [
    ["pass-id-prefix", "passIdPrefix"],
    ["pass-expiry-warning", "passExpiryWarning"],
    ["delivery-duration", "deliveryDuration"],
    ["visitor-max-duration", "visitorMaxDuration"],
    ["artisan-duration", "artisanDuration"],
    ["failed-attempt-threshold", "failedAttemptThreshold"],
    ["notif-recipient", "notifRecipient"],
    ["activity-retention", "activityRetention"],
    ["date-format", "dateFormat"],
    ["time-format", "timeFormat"]
  ];

  bindings.forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("change", () => {
      NS.state[key] = el.value;
      NS.markDirty();
    });
    el.addEventListener("input", () => {
      NS.state[key] = el.value;
      NS.markDirty();
    });
  });

  document.querySelectorAll("[data-save-section]").forEach(btn => {
    btn.addEventListener("click", () => {
      NS.persist();
      NS.clearDirty();
      const label = btn.getAttribute("data-toast") || "Settings saved successfully.";
      NS.toast(label);
    });
  });

  const saveAlertBtn = document.getElementById("save-alert-rules-btn");
  if (saveAlertBtn) {
    saveAlertBtn.addEventListener("click", () => {
      document.querySelectorAll("#alert-checkbox-grid input[data-alert]").forEach(cb => {
        NS.state.alertRules[cb.getAttribute("data-alert")] = cb.checked;
      });
      NS.persist();
      NS.clearDirty();
      NS.toast("Security alert settings updated.");
    });
  }
  document.querySelectorAll("#alert-checkbox-grid input[data-alert]").forEach(cb => {
    cb.addEventListener("change", () => NS.markDirty());
  });

})();


/* =========================================================
   11. GATE MANAGEMENT
   ========================================================= */

(function () {
  "use strict";
  const NS = window.RafaraSettings;

  let editingGateId = null;

  NS.openGateModal = function (gateId) {
    editingGateId = gateId || null;
    const gate = gateId ? NS.state.gates.find(g => g.id === gateId) : null;

    document.getElementById("gate-modal-title").textContent = gate ? "Manage Gate" : "Add Gate";
    document.getElementById("gate-name-input").value = gate ? gate.name : "";
    document.getElementById("gate-type-input").value = gate ? gate.type : "Primary Entry";
    document.getElementById("gate-status-input").value = gate ? gate.status : "Active";
    document.getElementById("gate-desc-input").value = gate ? gate.desc : "";

    NS.openModal("modal-gate");
  };

  const addGateBtn = document.getElementById("add-gate-btn");
  if (addGateBtn) addGateBtn.addEventListener("click", () => NS.openGateModal(null));

  const saveGateBtn = document.getElementById("save-gate-btn");
  if (saveGateBtn) {
    saveGateBtn.addEventListener("click", () => {
      const name = document.getElementById("gate-name-input").value.trim();
      if (!name) return;
      const type = document.getElementById("gate-type-input").value;
      const status = document.getElementById("gate-status-input").value;
      const desc = document.getElementById("gate-desc-input").value.trim();

      if (editingGateId) {
        const gate = NS.state.gates.find(g => g.id === editingGateId);
        if (gate) { gate.name = name; gate.type = type; gate.status = status; gate.desc = desc; }
      } else {
        NS.state.gates.push({
          id: "g" + Date.now(),
          name, type, status, desc,
          staff: 0
        });
      }

      NS.persist();
      NS.render.all();
      NS.closeModal("modal-gate");
      NS.toast(editingGateId ? "Gate settings updated." : "Gate added successfully.");
      editingGateId = null;
    });
  }

})();


/* =========================================================
   12. MANAGER PERMISSIONS
   ========================================================= */

(function () {
  "use strict";
  const NS = window.RafaraSettings;

  let editingManagerId = null;

  function renderPermissionGroups(permissions) {
    const wrap = document.getElementById("permission-groups");
    if (!wrap) return;
    wrap.innerHTML = NS.permissionSchema().map(group => `
      <div class="manager-settings-permission-group">
        <h4>${group.title}</h4>
        ${group.items.map(item => `
          <label>
            <input type="checkbox" data-perm="${item.key}" ${permissions[item.key] ? "checked" : ""}>
            ${item.label}
          </label>
        `).join("")}
      </div>
    `).join("");
  }

  NS.openPermissionsModal = function (managerId) {
    editingManagerId = managerId;
    const mgr = NS.state.managers.find(m => m.id === managerId);
    if (!mgr) return;

    document.getElementById("perm-manager-name").textContent = mgr.name;
    document.getElementById("perm-role-input").value = mgr.role;
    renderPermissionGroups(mgr.permissions);

    NS.openModal("modal-permissions");
  };

  const saveBtn = document.getElementById("save-permissions-btn");
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const mgr = NS.state.managers.find(m => m.id === editingManagerId);
      if (!mgr) return;

      mgr.role = document.getElementById("perm-role-input").value;

      const checks = document.querySelectorAll('#permission-groups input[data-perm]');
      let checkedCount = 0;
      checks.forEach(cb => {
        mgr.permissions[cb.getAttribute("data-perm")] = cb.checked;
        if (cb.checked) checkedCount++;
      });

      mgr.permLabel = checkedCount >= checks.length ? "Full Access" : (checkedCount === 0 ? "No Access" : "Custom");

      NS.persist();
      NS.render.all();
      NS.closeModal("modal-permissions");
      NS.toast("Manager permissions updated.");
      editingManagerId = null;
    });
  }

})();


/* =========================================================
   13. INVITE MANAGER
   ========================================================= */

(function () {
  "use strict";
  const NS = window.RafaraSettings;

  const inviteBtn = document.getElementById("invite-manager-btn");
  if (inviteBtn) {
    inviteBtn.addEventListener("click", () => {
      document.getElementById("invite-name-input").value = "";
      document.getElementById("invite-email-input").value = "";
      document.getElementById("invite-role-input").value = "Assistant Manager";
      NS.openModal("modal-invite");
    });
  }

  const sendBtn = document.getElementById("send-invite-btn");
  if (sendBtn) {
    sendBtn.addEventListener("click", () => {
      const name = document.getElementById("invite-name-input").value.trim();
      const email = document.getElementById("invite-email-input").value.trim();
      const role = document.getElementById("invite-role-input").value;

      if (!name || !email) return;

      const permissions = {};
      NS.permissionSchema().forEach(group => group.items.forEach(item => { permissions[item.key] = false; }));

      NS.state.managers.push({
        id: "m" + Date.now(),
        name,
        role,
        status: "Pending",
        permLabel: "No Access",
        permissions
      });

      NS.persist();
      NS.render.all();
      NS.closeModal("modal-invite");
      NS.toast("Manager invitation created successfully.");
    });
  }

})();


/* =========================================================
   14. EXPORT (mock CSV)
   ========================================================= */

(function () {
  "use strict";
  const NS = window.RafaraSettings;

  const exportData = {
    passes: [
      ["Pass ID", "Holder", "Type", "Status", "Expiry"],
      ["RFP-1042", "David Ade", "Visitor", "Active", "2026-09-05"],
      ["RFP-1039", "Sarah O.", "Artisan", "Verified", "2026-09-09"],
      ["RFP-1031", "Michael K.", "Visitor", "Expired", "2026-08-29"]
    ],
    activity: [
      ["Time", "Event", "Gate", "Actor"],
      ["2026-09-02 08:42", "Visitor checked in", "Main Gate", "Security: J. Okoye"],
      ["2026-09-02 08:31", "Artisan verified", "Service Gate", "Security: F. Musa"],
      ["2026-09-02 08:12", "Visitor checked out", "Main Gate", "Security: J. Okoye"]
    ],
    residents: [
      ["Name", "Unit", "Status", "Phone"],
      ["Chinedu Obi", "Flat A12", "Active", "080X XXX XXXX"],
      ["Grace Uche", "Flat B07", "Active", "080X XXX XXXX"],
      ["Femi Alade", "Flat C21", "Pending", "080X XXX XXXX"]
    ]
  };

  document.querySelectorAll("[data-export]").forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-export");
      const rows = exportData[key] || [];
      const csv = rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `rafara-${key}-export.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      NS.toast("Export prepared successfully.", "fa-file-arrow-down");
    });
  });

})();


/* =========================================================
   15. RESET TO DEFAULTS (current section)
   ========================================================= */

(function () {
  "use strict";
  const NS = window.RafaraSettings;

  const resetBtn = document.getElementById("reset-settings-btn");
  const confirmResetBtn = document.getElementById("confirm-reset-btn");

  if (resetBtn) {
    resetBtn.addEventListener("click", () => NS.openModal("modal-reset"));
  }

  if (confirmResetBtn) {
    confirmResetBtn.addEventListener("click", () => {
      const section = NS.currentSection;
      const keys = NS.SECTION_KEYS[section] || [];
      const defaults = NS.defaultState();

      keys.forEach(key => {
        NS.state[key] = JSON.parse(JSON.stringify(defaults[key]));
      });

      NS.persist();
      NS.render.all();
      NS.clearDirty();
      NS.closeModal("modal-reset");
      NS.toast("Settings restored to defaults.", "fa-rotate-left");
    });
  }

})();


/* =========================================================
   16. DEACTIVATE / REACTIVATE ESTATE
   ========================================================= */

(function () {
  "use strict";
  const NS = window.RafaraSettings;

  const dangerBtn = document.getElementById("danger-zone-btn");
  const confirmInput = document.getElementById("deactivate-confirm-input");
  const confirmBtn = document.getElementById("confirm-deactivate-btn");

  if (dangerBtn) {
    dangerBtn.addEventListener("click", () => {
      if (NS.state.estateStatus === "Active") {
        if (confirmInput) confirmInput.value = "";
        if (confirmBtn) confirmBtn.disabled = true;
        NS.openModal("modal-deactivate");
      } else {
        NS.state.estateStatus = "Active";
        NS.persist();
        NS.render.all();
        NS.toast("Estate access management has been reactivated.", "fa-circle-check");
      }
    });
  }

  if (confirmInput && confirmBtn) {
    confirmInput.addEventListener("input", () => {
      confirmBtn.disabled = confirmInput.value.trim() !== "DEACTIVATE";
    });
  }

  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      if (confirmBtn.disabled) return;
      NS.state.estateStatus = "Inactive";
      NS.persist();
      NS.render.all();
      NS.closeModal("modal-deactivate");
      NS.toast("Estate access management has been deactivated.", "fa-triangle-exclamation");
    });
  }

})();


/* =========================================================
   17. WARN BEFORE LEAVING WITH UNSAVED CHANGES
   ========================================================= */

(function () {
  "use strict";
  const NS = window.RafaraSettings;

  window.addEventListener("beforeunload", e => {
    if (!NS.dirty) return;
    e.preventDefault();
    e.returnValue = "";
  });

})();


/* =========================================================
   18. INIT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  window.RafaraSettings.render.all();
  window.RafaraSettings.showSection("general");
});
