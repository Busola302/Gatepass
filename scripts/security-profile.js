/* =========================================================
   RAFARA GATEPASS — SECURITY OFFICER PROFILE
   Frontend-only demo logic. Mock data, no backend calls.
   ========================================================= */

(function () {
  "use strict";

  /* =======================================================
     MOCK DATA
     ======================================================= */

  const DATA = {

    officer: {
      fullName: "Emeka Nwosu",
      phone: "0803 456 7890",
      email: "emekanwosu@rafara.org",
      securityId: "RAF-SEC-018",
      role: "Security Officer",
      status: "Active",
      estate: "Millenium Housing Estate Ijaiye Ojokoro, Lagos",
      gate: "Main Gate",
      shift: "Morning Shift",
      supervisor: "Estate Manager",
      passwordLastChanged: "24 days ago"
    },

    notifications: [
      {
        icon: "fa-bullhorn",
        title: "Estate announcement",
        desc: "A new security announcement was posted.",
        time: "45m ago",
        unread: true
      },
      {
        icon: "fa-id-card",
        title: "Pass policy updated",
        desc: "The Estate Manager updated the visitor pass policy.",
        time: "3h ago",
        unread: false
      }
    ],

    loginActivity: [
      { time: "Today, 05:48 AM", device: "Main Gate Device", location: "Millenium Housing Estate", status: "success" },
      { time: "Yesterday, 06:02 AM", device: "Main Gate Device", location: "Millenium Housing Estate", status: "success" },
      { time: "Sep 2, 05:55 AM", device: "Main Gate Device", location: "Millenium Housing Estate", status: "success" },
      { time: "Sep 1, 06:01 AM", device: "Main Gate Device", location: "Millenium Housing Estate", status: "success" }
    ]

  };

  function initials(name) {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map(word => word[0].toUpperCase())
      .join("");
  }

  /* =======================================================
     TOAST
     ======================================================= */

  function showToast(message, icon) {

    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast toast--success";
    toast.innerHTML = `
      <i class="fa-solid ${icon || "fa-circle-check"}" aria-hidden="true"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3200);
  }

  /* =======================================================
     NOTIFICATIONS PANEL
     ======================================================= */

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
      list.innerHTML = DATA.notifications.map(n => `
        <div class="notif-item${n.unread ? " is-unread" : ""}">
          <span class="notif-icon">
            <i class="fa-solid ${n.icon}"></i>
          </span>
          <div class="notif-body">
            <strong>${n.title}</strong>
            <p>${n.desc}</p>
            <span class="notif-time">${n.time}</span>
          </div>
          ${n.unread ? `<span class="notif-unread-dot"></span>` : ""}
        </div>
      `).join("");
    }

    if (dot) dot.hidden = unread === 0;
    if (sidebarCount) {
      sidebarCount.textContent = unread;
      sidebarCount.hidden = unread === 0;
    }
  }

  const markAllReadBtn = document.getElementById("mark-all-read-btn");
  if (markAllReadBtn) {
    markAllReadBtn.addEventListener("click", () => {
      DATA.notifications.forEach(n => { n.unread = false; });
      renderNotifications();
    });
  }

  /* =======================================================
     LOGIN ACTIVITY
     ======================================================= */

  function statusBadge(status) {
    if (status === "success") {
      return `<span class="badge badge--active"><i class="fa-solid fa-circle" aria-hidden="true"></i> Successful</span>`;
    }
    return `<span class="badge badge--revoked"><i class="fa-solid fa-circle" aria-hidden="true"></i> Failed</span>`;
  }

  function renderLoginActivity() {

    const wrap = document.getElementById("login-activity-list");
    if (!wrap) return;

    if (!DATA.loginActivity.length) {
      wrap.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-clock-rotate-left"></i>
          <strong>No login activity yet</strong>
          <span>Your recent sign-ins will appear here.</span>
        </div>
      `;
      return;
    }

    wrap.innerHTML = DATA.loginActivity.map(row => `
      <div class="login-table-row">
        <div data-label="Date & Time"><strong>${row.time}</strong></div>
        <div data-label="Device" class="login-table-cell--muted">${row.device}</div>
        <div data-label="Location" class="login-table-cell--muted">${row.location}</div>
        <div data-label="Status">${statusBadge(row.status)}</div>
      </div>
    `).join("");
  }

  /* =======================================================
     SIDEBAR DRAWER
     ======================================================= */

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

  /* =======================================================
     DROPDOWNS (notifications + profile trigger)
     ======================================================= */

  (function () {
    const dropdowns = document.querySelectorAll("[data-dropdown]");
    if (!dropdowns.length) return;

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

      button.addEventListener("click", event => {
        event.stopPropagation();
        const wasOpen = !panel.hidden;
        closeAll();
        panel.hidden = wasOpen;
        button.setAttribute("aria-expanded", String(!wasOpen));
      });
    });

    document.addEventListener("click", event => {
      const inside = [...dropdowns].some(d => d.contains(event.target));
      if (!inside) closeAll();
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeAll();
    });
  })();

  /* =======================================================
     MOBILE MORE SHEET
     ======================================================= */

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

  /* =======================================================
     EDIT PROFILE
     ======================================================= */

  (function () {

    const editBtn = document.getElementById("edit-profile-btn");
    const cancelBtn = document.getElementById("cancel-edit-btn");
    const saveBtn = document.getElementById("save-edit-btn");

    const view = document.getElementById("personal-info-view");
    const form = document.getElementById("personal-info-form");
    const actions = document.getElementById("personal-info-actions");

    const phoneInput = document.getElementById("edit-phone");
    const emailInput = document.getElementById("edit-email");
    const phoneError = document.getElementById("edit-phone-error");
    const emailError = document.getElementById("edit-email-error");

    const viewPhone = document.getElementById("view-phone");
    const viewEmail = document.getElementById("view-email");

    if (!editBtn || !view || !form || !actions) return;

    function enterEditMode() {
      phoneInput.value = DATA.officer.phone;
      emailInput.value = DATA.officer.email;
      phoneError.textContent = "";
      emailError.textContent = "";

      view.hidden = true;
      form.hidden = false;
      actions.hidden = false;
      editBtn.hidden = true;

      phoneInput.focus();
    }

    function exitEditMode() {
      view.hidden = false;
      form.hidden = true;
      actions.hidden = true;
      editBtn.hidden = false;
    }

    editBtn.addEventListener("click", enterEditMode);

    cancelBtn.addEventListener("click", () => {
      exitEditMode();
      showToast("Changes cancelled.", "fa-rotate-left");
    });

    saveBtn.addEventListener("click", () => {

      let valid = true;
      phoneError.textContent = "";
      emailError.textContent = "";

      const phoneVal = phoneInput.value.trim();
      const emailVal = emailInput.value.trim();

      if (!phoneVal || phoneVal.replace(/\D/g, "").length < 7) {
        phoneError.textContent = "Enter a valid phone number.";
        valid = false;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal || !emailPattern.test(emailVal)) {
        emailError.textContent = "Enter a valid email address.";
        valid = false;
      }

      if (!valid) return;

      DATA.officer.phone = phoneVal;
      DATA.officer.email = emailVal;

      viewPhone.textContent = phoneVal;
      viewEmail.textContent = emailVal;

      exitEditMode();
      showToast("Profile updated successfully.");
    });

  })();

  /* =======================================================
     CHANGE PASSWORD MODAL
     ======================================================= */

  (function () {

    const modal = document.getElementById("password-modal");
    const openBtn = document.getElementById("change-password-btn");
    const closeTriggers = document.querySelectorAll("[data-close-password-modal]");
    const form = document.getElementById("password-form");

    const currentInput = document.getElementById("current-password");
    const newInput = document.getElementById("new-password");
    const confirmInput = document.getElementById("confirm-password");

    const currentError = document.getElementById("current-password-error");
    const newError = document.getElementById("new-password-error");
    const confirmError = document.getElementById("confirm-password-error");

    const lastChanged = document.getElementById("password-last-changed");

    if (!modal || !openBtn || !form) return;

    function openModal() {
      form.reset();
      currentError.textContent = "";
      newError.textContent = "";
      confirmError.textContent = "";

      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";

      currentInput.focus();
    }

    function closeModal() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    openBtn.addEventListener("click", openModal);

    closeTriggers.forEach(trigger => trigger.addEventListener("click", closeModal));

    modal.addEventListener("click", event => {
      if (event.target === modal) closeModal();
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && modal.classList.contains("is-open")) closeModal();
    });

    form.addEventListener("submit", event => {

      event.preventDefault();

      let valid = true;
      currentError.textContent = "";
      newError.textContent = "";
      confirmError.textContent = "";

      if (!currentInput.value) {
        currentError.textContent = "Enter your current password.";
        valid = false;
      }

      if (!newInput.value || newInput.value.length < 8) {
        newError.textContent = "New password must be at least 8 characters.";
        valid = false;
      }

      if (!confirmInput.value) {
        confirmError.textContent = "Confirm your new password.";
        valid = false;
      } else if (newInput.value && confirmInput.value !== newInput.value) {
        confirmError.textContent = "Passwords do not match.";
        valid = false;
      }

      if (!valid) return;

      // Frontend-only mock submission — no backend call.
      DATA.officer.passwordLastChanged = "Today";
      if (lastChanged) lastChanged.textContent = "Today";

      closeModal();
      showToast("Password updated successfully.");
    });

  })();

  /* =======================================================
     LOGOUT CONFIRMATION
     ======================================================= */

  (function () {

    const modal = document.getElementById("logout-modal");
    const confirmBtn = document.getElementById("confirm-logout-btn");
    const closeTriggers = document.querySelectorAll("[data-close-logout-modal]");

    const openTriggers = [
      document.getElementById("logout-btn"),
      document.getElementById("mobile-logout-btn"),
      document.getElementById("dropdown-logout-btn"),
      document.getElementById("page-logout-btn")
    ].filter(Boolean);

    if (!modal || !confirmBtn) return;

    function openModal() {
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }

    function closeModal() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    openTriggers.forEach(trigger => {
      trigger.addEventListener("click", event => {
        event.preventDefault();
        openModal();
      });
    });

    closeTriggers.forEach(trigger => trigger.addEventListener("click", closeModal));

    modal.addEventListener("click", event => {
      if (event.target === modal) closeModal();
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && modal.classList.contains("is-open")) closeModal();
    });

    confirmBtn.addEventListener("click", () => {
      window.location.href = "security-login.html";
    });

  })();

  /* =======================================================
     INIT
     ======================================================= */

  document.addEventListener("DOMContentLoaded", () => {
    renderNotifications();
    renderLoginActivity();
  });

})();
