/* =========================================================
   RAFARA GATEPASS — SECURITY: VERIFY PASS
   Frontend-only demo logic. No backend — pass codes are
   matched against mock records to demonstrate every
   verification and access-decision state.
   ========================================================= */

(function () {
  "use strict";

  window.RafaraSecurity = window.RafaraSecurity || {};

  /* =======================================================
     MOCK DATA
     ======================================================= */

  window.RafaraSecurity.VERIFY_DATA = {

    // 4-digit pass code -> pass record. Any code not listed
    // here is treated as "invalid" (does not exist).
    passRecords: {

      "4827": {
        type: "valid",
        visitor: "Aisha Bello",
        resident: "Rahmah Ogunlaja",
        unit: "B5-F8",
        passType: "One-Day Visitor",
        validWindow: "Today · 10:00 AM – 6:00 PM",
        passCode: "4827"
      },

      "7812": {
        type: "expired",
        visitor: "David Adeyemi",
        resident: "O. Fashola",
        unit: "B32-F7",
        passType: "Multi-Day",
        expiredAt: "Yesterday · 6:00 PM",
        passCode: "7812"
      },

      "1934": {
        type: "cancelled",
        visitor: "Ibrahim Musa",
        resident: "T. Adeyemi",
        unit: "BG-F3",
        passType: "Multi-Day",
        passCode: "1934"
      },

      "2200": {
        type: "already_inside",
        visitor: "Samuel Iortyer",
        resident: "N. Chukwu",
        unit: "B20-F5",
        passType: "Multi-Day",
        checkedIn: "9:58 AM",
        passCode: "2200"
      }

    },

    notifications: [
      {
        icon: "fa-ban",
        title: "Pass cancelled",
        desc: "Pass #1934 was cancelled by the resident.",
        time: "8m ago",
        unread: true
      },
      {
        icon: "fa-bullhorn",
        title: "Estate announcement",
        desc: "A new security announcement was posted.",
        time: "45m ago",
        unread: true
      }
    ],

    recentVerifications: [
      {
        visitor: "Aisha Bello",
        passCode: "4827",
        result: "Access Granted",
        desc: "Visiting Rahmah Ogunlaja · Unit A-204",
        tone: "success",
        icon: "fa-door-open",
        time: "10:42 AM"
      },
      {
        visitor: "Ibrahim Musa",
        passCode: "1934",
        result: "Access Denied",
        desc: "Pass cancelled",
        tone: "danger",
        icon: "fa-circle-xmark",
        time: "10:31 AM"
      },
      {
        visitor: "David Adeyemi",
        passCode: "7812",
        result: "Pass Expired",
        desc: "Expired yesterday · 6:00 PM",
        tone: "warning",
        icon: "fa-hourglass-end",
        time: "10:18 AM"
      }
    ]

  };

})();


/* =========================================================
   SHARED HELPERS
   ========================================================= */

(function () {

  "use strict";

  const NS = window.RafaraSecurity;

  NS.util = {

    initials(name) {
      return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map(word => word[0].toUpperCase())
        .join("");
    },

    nowTime() {
      return new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit"
      });
    },

    escapeHtml(str) {
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }

  };

})();


/* =========================================================
   NOTIFICATIONS (topbar dropdown)
   ========================================================= */

(function () {

  "use strict";

  const NS = window.RafaraSecurity;
  const DATA = NS.VERIFY_DATA;

  function renderNotifications() {

    const list = document.getElementById("notif-panel-list");
    const dot = document.getElementById("notif-dot");
    const sidebarCount = document.getElementById("sidebar-notif-count");

    if (!list) return;

    const unread = DATA.notifications.filter(n => n.unread).length;

    if (!DATA.notifications.length) {

      list.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-bell-slash"></i>
          <strong>No notifications</strong>
          <span>You're all caught up.</span>
        </div>
      `;

    } else {

      list.innerHTML = DATA.notifications.map(notification => `
        <div class="notif-item${notification.unread ? " is-unread" : ""}">
          <span class="notif-icon"><i class="fa-solid ${notification.icon}"></i></span>
          <div class="notif-body">
            <strong>${notification.title}</strong>
            <p>${notification.desc}</p>
            <span class="notif-time">${notification.time}</span>
          </div>
          ${notification.unread ? `<span class="notif-unread-dot"></span>` : ""}
        </div>
      `).join("");

    }

    if (dot) dot.hidden = unread === 0;
    if (sidebarCount) {
      sidebarCount.textContent = unread;
      sidebarCount.hidden = unread === 0;
    }
  }

  const markAllBtn = document.getElementById("mark-all-read-btn");
  if (markAllBtn) {
    markAllBtn.addEventListener("click", () => {
      DATA.notifications.forEach(n => { n.unread = false; });
      renderNotifications();
    });
  }

  document.addEventListener("DOMContentLoaded", renderNotifications);

})();


/* =========================================================
   RECENT VERIFICATIONS LIST
   ======================================================= */

(function () {

  "use strict";

  const NS = window.RafaraSecurity;
  const DATA = NS.VERIFY_DATA;

  function render() {

    const wrap = document.getElementById("recent-verify-list");
    if (!wrap) return;

    if (!DATA.recentVerifications.length) {
      wrap.innerHTML = `
        <li class="empty-state">
          <i class="fa-solid fa-shield-halved"></i>
          <strong>No verifications yet</strong>
          <span>Verified passes will appear here.</span>
        </li>
      `;
      return;
    }

    wrap.innerHTML = DATA.recentVerifications.slice(0, 8).map(item => `
      <li class="activity-item">
        <span class="activity-icon activity-icon--${item.tone}">
          <i class="fa-solid ${item.icon}"></i>
        </span>
        <div class="activity-body">
          <strong>${NS.util.escapeHtml(item.visitor)} · Pass #${item.passCode}</strong>
          <p>${item.result} · ${NS.util.escapeHtml(item.desc)}</p>
        </div>
        <span class="activity-time">${item.time}</span>
      </li>
    `).join("");
  }

  NS.renderRecentVerifications = render;

  document.addEventListener("DOMContentLoaded", render);

})();


/* =========================================================
   VERIFY PASS WORKFLOW
   ======================================================= */

(function () {

  "use strict";

  const NS = window.RafaraSecurity;
  const DATA = NS.VERIFY_DATA;

  const entrySection = document.getElementById("verify-entry-section");
  const resultSection = document.getElementById("verify-result-section");
  const form = document.getElementById("verify-form");
  const input = document.getElementById("pass-code");
  const submitBtn = document.getElementById("verify-submit-btn");
  const submitLabel = document.getElementById("verify-submit-label");
  const feedback = document.getElementById("verify-feedback");

  if (!entrySection || !resultSection || !form || !input || !submitBtn) return;

  let currentRecord = null;

  /* ---------- helpers ---------- */

  function showToast(message, tone = "", icon = "fa-circle-check") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast${tone ? ` toast--${tone}` : ""}`;
    toast.innerHTML = `<i class="fa-solid ${icon}" aria-hidden="true"></i><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => toast.remove(), 3400);
  }

  function showEntry() {
    resultSection.hidden = true;
    resultSection.innerHTML = "";
    entrySection.hidden = false;

    input.value = "";
    submitBtn.disabled = true;
    feedback.hidden = true;
    input.classList.remove("has-error");
    input.focus();

    entrySection.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function showResult(html) {
    entrySection.hidden = true;
    resultSection.innerHTML = html;
    resultSection.hidden = false;
    resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
    bindResultActions();
  }

  function logVerification(entry) {
    DATA.recentVerifications.unshift(entry);
    NS.renderRecentVerifications();
  }

  /* ---------- result templates ---------- */

  function detailsRow(label, value, icon) {
    return `
      <div class="details-row">
        <span>${icon ? `<i class="fa-solid ${icon}" aria-hidden="true"></i> ` : ""}${label}</span>
        <span>${value}</span>
      </div>
    `;
  }

  function renderValid(record) {
    return `
      <div class="result-card" data-state="valid">
        <div class="result-head">
          <span class="result-icon result-icon--success"><i class="fa-solid fa-circle-check" aria-hidden="true"></i></span>
          <div class="result-head-text">
            <h2>Access Valid</h2>
            <p>This pass has been verified. Review the details below and make an access decision.</p>
          </div>
          <span class="result-status-badge badge badge--active"><i class="fa-solid fa-circle" aria-hidden="true"></i> Valid</span>
        </div>
        <div class="result-body">
          <div class="result-details">
            <div class="details-block">
              ${detailsRow("Visitor", NS.util.escapeHtml(record.visitor), "fa-user")}
              ${detailsRow("Visiting", NS.util.escapeHtml(record.resident), "fa-house-user")}
              ${detailsRow("Unit", record.unit, "fa-door-closed")}
            </div>
            <div class="details-block">
              ${detailsRow("Pass Type", record.passType, "fa-id-card")}
              ${detailsRow("Valid", record.validWindow, "fa-clock")}
              ${detailsRow("Pass Code", record.passCode, "fa-hashtag")}
            </div>
          </div>
        </div>
        <div class="result-footer">
          <button type="button" class="btn btn--success" id="allow-entry-btn">
            <i class="fa-solid fa-circle-check" aria-hidden="true"></i> Allow Entry
          </button>
          <button type="button" class="btn btn--danger-outline" id="deny-entry-btn">
            <i class="fa-solid fa-ban" aria-hidden="true"></i> Deny Entry
          </button>
        </div>
      </div>
    `;
  }

  function renderInvalid() {
    return `
      <div class="result-card" data-state="invalid">
        <div class="result-head">
          <span class="result-icon result-icon--danger"><i class="fa-solid fa-circle-xmark" aria-hidden="true"></i></span>
          <div class="result-head-text">
            <h2>Pass Not Valid</h2>
            <p>We couldn't verify this pass. Check the code and try again.</p>
          </div>
        </div>
        <div class="result-note">
          <i class="fa-solid fa-circle-info" aria-hidden="true"></i>
          <span>This code doesn't match any pass in our records.</span>
        </div>
        <div class="result-footer">
          <button type="button" class="btn btn--primary" id="try-again-btn">
            <i class="fa-solid fa-rotate-left" aria-hidden="true"></i> Try Again
          </button>
        </div>
      </div>
    `;
  }

  function renderExpired(record) {
    return `
      <div class="result-card" data-state="expired">
        <div class="result-head">
          <span class="result-icon result-icon--warning"><i class="fa-solid fa-hourglass-end" aria-hidden="true"></i></span>
          <div class="result-head-text">
            <h2>Pass Expired</h2>
            <p>This pass is no longer valid for entry.</p>
          </div>
          <span class="result-status-badge badge badge--expired"><i class="fa-solid fa-circle" aria-hidden="true"></i> Expired</span>
        </div>
        <div class="result-body">
          <div class="result-details">
            <div class="details-block">
              ${detailsRow("Visitor", NS.util.escapeHtml(record.visitor), "fa-user")}
              ${detailsRow("Resident", NS.util.escapeHtml(record.resident), "fa-house-user")}
              ${detailsRow("Unit", record.unit, "fa-door-closed")}
            </div>
            <div class="details-block">
              ${detailsRow("Pass Type", record.passType, "fa-id-card")}
              ${detailsRow("Expired", record.expiredAt, "fa-clock")}
            </div>
          </div>
        </div>
        <div class="result-footer">
          <button type="button" class="btn btn--primary" id="back-to-verify-btn">
            <i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Back to Verification
          </button>
        </div>
      </div>
    `;
  }

  function renderCancelled(record) {
    return `
      <div class="result-card" data-state="cancelled">
        <div class="result-head">
          <span class="result-icon result-icon--muted"><i class="fa-solid fa-ban" aria-hidden="true"></i></span>
          <div class="result-head-text">
            <h2>Pass Cancelled</h2>
            <p>This pass has been cancelled and cannot be used for entry.</p>
          </div>
          <span class="result-status-badge badge badge--revoked"><i class="fa-solid fa-circle" aria-hidden="true"></i> Cancelled</span>
        </div>
        <div class="result-body">
          <div class="result-details">
            <div class="details-block">
              ${detailsRow("Visitor", NS.util.escapeHtml(record.visitor), "fa-user")}
              ${detailsRow("Resident", NS.util.escapeHtml(record.resident), "fa-house-user")}
              ${detailsRow("Unit", record.unit, "fa-door-closed")}
            </div>
            <div class="details-block">
              ${detailsRow("Pass Type", record.passType, "fa-id-card")}
              ${detailsRow("Pass Code", record.passCode, "fa-hashtag")}
            </div>
          </div>
        </div>
        <div class="result-footer">
          <button type="button" class="btn btn--primary" id="back-to-verify-btn">
            <i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Back to Verification
          </button>
        </div>
      </div>
    `;
  }

  function renderAlreadyInside(record) {
    return `
      <div class="result-card" data-state="already_inside">
        <div class="result-head">
          <span class="result-icon result-icon--info"><i class="fa-solid fa-door-open" aria-hidden="true"></i></span>
          <div class="result-head-text">
            <h2>Visitor Already Inside</h2>
            <p>This visitor has already been checked in.</p>
          </div>
          <span class="result-status-badge badge badge--checkedin"><i class="fa-solid fa-circle" aria-hidden="true"></i> Inside</span>
        </div>
        <div class="result-body">
          <div class="result-details">
            <div class="details-block">
              ${detailsRow("Visitor", NS.util.escapeHtml(record.visitor), "fa-user")}
              ${detailsRow("Resident", NS.util.escapeHtml(record.resident), "fa-house-user")}
              ${detailsRow("Unit", record.unit, "fa-door-closed")}
            </div>
            <div class="details-block">
              ${detailsRow("Pass Type", record.passType, "fa-id-card")}
              ${detailsRow("Checked In", record.checkedIn, "fa-clock")}
            </div>
          </div>
        </div>
        <div class="result-footer">
          <a class="btn btn--ghost" href="security-visitors.html">
            <i class="fa-solid fa-users" aria-hidden="true"></i> View Visitor
          </a>
          <button type="button" class="btn btn--primary" id="back-to-verify-btn">
            <i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Back to Verification
          </button>
        </div>
      </div>
    `;
  }

  function renderGranted(record, time) {
    return `
      <div class="result-card" data-state="granted">
        <div class="result-head">
          <span class="result-icon result-icon--success"><i class="fa-solid fa-circle-check" aria-hidden="true"></i></span>
          <div class="result-head-text">
            <h2>Access Granted</h2>
            <p>${NS.util.escapeHtml(record.visitor)} has been granted entry.</p>
          </div>
        </div>
        <div class="result-body">
          <div class="result-details">
            <div class="details-block">
              ${detailsRow("Visitor", NS.util.escapeHtml(record.visitor), "fa-user")}
              ${detailsRow("Resident", NS.util.escapeHtml(record.resident), "fa-house-user")}
              ${detailsRow("Unit", record.unit, "fa-door-closed")}
            </div>
            <div class="details-block">
              ${detailsRow("Check-in Time", time, "fa-clock")}
              ${detailsRow("Pass Code", record.passCode, "fa-hashtag")}
              ${detailsRow("Pass Type", record.passType, "fa-id-card")}
            </div>
          </div>
        </div>
        <div class="result-footer">
          <button type="button" class="btn btn--primary" id="done-btn">
            <i class="fa-solid fa-check" aria-hidden="true"></i> Done
          </button>
          <a class="btn btn--ghost" href="security-visitors.html">
            <i class="fa-solid fa-users" aria-hidden="true"></i> View Visitor
          </a>
        </div>
      </div>
    `;
  }

  function renderDenied(record, reason) {
    return `
      <div class="result-card" data-state="denied">
        <div class="result-head">
          <span class="result-icon result-icon--danger"><i class="fa-solid fa-ban" aria-hidden="true"></i></span>
          <div class="result-head-text">
            <h2>Access Denied</h2>
            <p>${NS.util.escapeHtml(record.visitor)}'s entry has been denied and recorded in the activity log.</p>
          </div>
        </div>
        <div class="result-body">
          <div class="result-details">
            <div class="details-block">
              ${detailsRow("Visitor", NS.util.escapeHtml(record.visitor), "fa-user")}
              ${detailsRow("Unit", record.unit, "fa-door-closed")}
              ${detailsRow("Pass Code", record.passCode, "fa-hashtag")}
            </div>
            <div class="details-block">
              ${detailsRow("Reason", NS.util.escapeHtml(reason), "fa-circle-info")}
            </div>
          </div>
        </div>
        <div class="result-footer">
          <button type="button" class="btn btn--primary" id="done-btn">
            <i class="fa-solid fa-check" aria-hidden="true"></i> Done
          </button>
        </div>
      </div>
    `;
  }

  /* ---------- action bindings for whatever is currently rendered ---------- */

  function bindResultActions() {

    const tryAgain = document.getElementById("try-again-btn");
    const backToVerify = document.getElementById("back-to-verify-btn");
    const doneBtn = document.getElementById("done-btn");
    const allowBtn = document.getElementById("allow-entry-btn");
    const denyBtn = document.getElementById("deny-entry-btn");

    if (tryAgain) tryAgain.addEventListener("click", showEntry);
    if (backToVerify) backToVerify.addEventListener("click", showEntry);
    if (doneBtn) doneBtn.addEventListener("click", showEntry);

    if (allowBtn) {
      allowBtn.addEventListener("click", () => {
        const time = NS.util.nowTime();

        logVerification({
          visitor: currentRecord.visitor,
          passCode: currentRecord.passCode,
          result: "Access Granted",
          desc: `Visiting ${currentRecord.resident} · Unit ${currentRecord.unit}`,
          tone: "success",
          icon: "fa-door-open",
          time
        });

        showResult(renderGranted(currentRecord, time));
        showToast(`${currentRecord.visitor} checked in.`, "success", "fa-circle-check");
      });
    }

    if (denyBtn) {
      denyBtn.addEventListener("click", openDenyModal);
    }
  }

  /* ---------- deny modal ---------- */

  const denyModal = document.getElementById("deny-modal");
  const denyReasonSelect = document.getElementById("deny-reason");
  const denyCancelBtn = document.getElementById("deny-cancel-btn");
  const denyConfirmBtn = document.getElementById("deny-confirm-btn");

  function openDenyModal() {
    if (!denyModal) return;
    denyModal.hidden = false;
    requestAnimationFrame(() => denyModal.classList.add("is-open"));
    document.body.style.overflow = "hidden";
    if (denyReasonSelect) denyReasonSelect.focus();
  }

  function closeDenyModal() {
    if (!denyModal) return;
    denyModal.classList.remove("is-open");
    document.body.style.overflow = "";
    setTimeout(() => { denyModal.hidden = true; }, 200);
  }

  if (denyCancelBtn) denyCancelBtn.addEventListener("click", closeDenyModal);

  if (denyModal) {
    denyModal.addEventListener("click", event => {
      if (event.target === denyModal) closeDenyModal();
    });
  }

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && denyModal && !denyModal.hidden) {
      closeDenyModal();
    }
  });

  if (denyConfirmBtn) {
    denyConfirmBtn.addEventListener("click", () => {
      const reason = denyReasonSelect ? denyReasonSelect.value : "Invalid pass";

      logVerification({
        visitor: currentRecord.visitor,
        passCode: currentRecord.passCode,
        result: "Access Denied",
        desc: reason,
        tone: "danger",
        icon: "fa-circle-xmark",
        time: NS.util.nowTime()
      });

      closeDenyModal();
      showResult(renderDenied(currentRecord, reason));
      showToast("Access denied. Recorded in the activity log.", "danger", "fa-ban");
    });
  }

  /* ---------- input + submit ---------- */

  input.addEventListener("input", () => {
    input.value = input.value.replace(/\D/g, "").slice(0, 4);
    submitBtn.disabled = input.value.length !== 4;
    input.classList.remove("has-error");
    feedback.hidden = true;
  });

  form.addEventListener("submit", event => {
    event.preventDefault();

    if (input.value.length !== 4) return;

    const code = input.value;

    // Loading state
    submitBtn.disabled = true;
    input.disabled = true;
    submitLabel.textContent = "Verifying…";
    submitBtn.querySelector("i").className = "fa-solid fa-circle-notch";

    setTimeout(() => {

      input.disabled = false;
      submitLabel.textContent = "Verify Pass";
      submitBtn.querySelector("i").className = "fa-solid fa-shield-halved";
      submitBtn.disabled = input.value.length !== 4;

      const record = DATA.passRecords[code];

      if (!record) {
        currentRecord = null;
        input.classList.add("has-error");
        feedback.hidden = false;
        feedback.innerHTML = `<i class="fa-solid fa-circle-xmark" aria-hidden="true"></i> Code not recognized — check the digits and try again.`;

        logVerification({
          visitor: "Unknown visitor",
          passCode: code,
          result: "Access Denied",
          desc: "Code does not exist",
          tone: "danger",
          icon: "fa-circle-xmark",
          time: NS.util.nowTime()
        });

        return;
      }

      currentRecord = record;

      switch (record.type) {
        case "valid":
          showResult(renderValid(record));
          break;
        case "expired":
          showResult(renderExpired(record));
          logVerification({
            visitor: record.visitor,
            passCode: record.passCode,
            result: "Pass Expired",
            desc: `Expired ${record.expiredAt}`,
            tone: "warning",
            icon: "fa-hourglass-end",
            time: NS.util.nowTime()
          });
          break;
        case "cancelled":
          showResult(renderCancelled(record));
          logVerification({
            visitor: record.visitor,
            passCode: record.passCode,
            result: "Pass Cancelled",
            desc: "Cancelled by resident",
            tone: "danger",
            icon: "fa-ban",
            time: NS.util.nowTime()
          });
          break;
        case "already_inside":
          showResult(renderAlreadyInside(record));
          break;
        default:
          showResult(renderInvalid());
      }

    }, 650);
  });

})();


/* =========================================================
   SIDEBAR DRAWER
   ========================================================= */

(function () {

  "use strict";

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
   DROPDOWNS
   ========================================================= */

(function () {

  "use strict";

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

  "use strict";

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

  "use strict";

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
