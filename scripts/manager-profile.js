/* =========================================================
   RAFARA GATEPASS — ESTATE MANAGER PROFILE
   Frontend demo logic (HTML5 / CSS3 / vanilla JS, no backend)
   ========================================================= */

(function () {
  "use strict";

  /* =======================================================
     MOCK STATE
     ======================================================= */

  const state = {

    profile: {
      fullName: "Aisha Bello",
      email: "manager@rafara.example",
      phone: "080X XXX XXXX",
      role: "Estate Manager",
      managerId: "MGR-001",
      estate: "Millenium Housing Estate Ijaiye Ojokoro, Lagos",
      avatarDataUrl: null
    },

    security: {
      passwordLastChangedLabel: "Last changed 30 days ago",
      twoFactorEnabled: true,
      loginVerificationEnabled: true
    },

    sessions: [
      {
        id: "session-current",
        device: "Windows",
        browser: "Chrome",
        location: "Lagos, Nigeria",
        activity: "Active now",
        current: true
      },
      {
        id: "session-2",
        device: "Android",
        browser: "Chrome",
        location: null,
        activity: "Last active 2 hours ago",
        current: false
      }
    ],

    notificationPrefs: [
      {
        id: "passRequests",
        title: "Pass Requests",
        desc: "Receive notifications for pending pass requests",
        enabled: true
      },
      {
        id: "securityAlerts",
        title: "Security Alerts",
        desc: "Receive security and access alerts",
        enabled: true
      },
      {
        id: "artisanVerification",
        title: "Artisan Verification",
        desc: "Receive artisan verification requests",
        enabled: true
      },
      {
        id: "systemUpdates",
        title: "System Updates",
        desc: "Receive Rafara system announcements",
        enabled: false
      },
      {
        id: "dailySummary",
        title: "Daily Summary",
        desc: "Receive daily estate activity summary",
        enabled: true
      }
    ],

    preferences: {
      startPage: "Dashboard",
      dateFormat: "DD/MM/YYYY",
      timeFormat: "12-hour",
      compactMode: false
    },

    activity: [
      { icon: "fa-right-to-bracket", title: "Signed in", desc: "", time: "Today, 08:12 AM" },
      { icon: "fa-bell", title: "Updated notification preferences", desc: "", time: "Yesterday, 06:42 PM" },
      { icon: "fa-key", title: "Changed password", desc: "", time: "August 30, 04:18 PM" },
      { icon: "fa-user-pen", title: "Updated profile information", desc: "", time: "August 29, 09:31 AM" }
    ],

    estateSummary: {
      residents: 584,
      units: 644,
      securityOfficers: 18,
      artisans: 86
    }
  };

  function initials(name) {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map(w => w[0].toUpperCase())
      .join("");
  }

  /* =======================================================
     TOAST
     ======================================================= */

  function showToast(message, icon) {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "rafara-profile-toast";
    toast.innerHTML = `<i class="fa-solid ${icon || "fa-circle-check"}" aria-hidden="true"></i><span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("is-leaving");
      setTimeout(() => toast.remove(), 200);
    }, 3200);
  }

  /* =======================================================
     ERROR STATE HELPER
     ======================================================= */

  function renderErrorState(container, retryFn) {
    if (!container) return;
    container.innerHTML = `
      <div class="empty-state rafara-profile-error-state">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <strong>Information unavailable</strong>
        <span>We couldn't load this information right now.</span>
      </div>
    `;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn--ghost btn--sm";
    btn.style.marginTop = "10px";
    btn.textContent = "Try Again";
    btn.addEventListener("click", retryFn);
    container.querySelector(".empty-state").appendChild(btn);
  }

  /* =======================================================
     RENDER: PROFILE HEADER + PERSONAL INFO
     ======================================================= */

  function applyAvatar() {
    const heroAvatar = document.getElementById("hero-avatar");
    const sidebarAvatar = document.getElementById("sidebar-avatar");
    const topbarAvatar = document.getElementById("topbar-avatar");
    const label = initials(state.profile.fullName);

    [heroAvatar, sidebarAvatar, topbarAvatar].forEach(el => {
      if (!el) return;
      if (state.profile.avatarDataUrl) {
        el.style.backgroundImage = `url(${state.profile.avatarDataUrl})`;
        el.classList.add("has-image");
        el.textContent = "";
      } else {
        el.style.backgroundImage = "";
        el.classList.remove("has-image");
        el.textContent = label;
      }
    });
  }

  function renderProfileHeader() {
    document.getElementById("hero-name").textContent = state.profile.fullName;
    document.getElementById("hero-role").textContent = state.profile.role;
    document.getElementById("hero-estate").textContent = state.profile.estate;
    document.getElementById("hero-id").textContent = state.profile.managerId;

    document.querySelectorAll(".sidebar-bottom .profile-name, .topbar-profile .profile-name")
      .forEach(el => { el.textContent = state.profile.fullName; });

    applyAvatar();
  }

  function renderPersonalInfo() {
    document.getElementById("info-name").textContent = state.profile.fullName;
    document.getElementById("info-email").textContent = state.profile.email;
    document.getElementById("info-phone").textContent = state.profile.phone;
    document.getElementById("info-role").textContent = state.profile.role;
    document.getElementById("info-managerid").textContent = state.profile.managerId;
    document.getElementById("info-estate").textContent = state.profile.estate;
  }

  /* =======================================================
     RENDER: SECURITY
     ======================================================= */

  function renderSecurity() {
    document.getElementById("password-last-changed").textContent = state.security.passwordLastChangedLabel;

    const twofaToggle = document.getElementById("twofa-toggle");
    const twofaBadge = document.getElementById("twofa-badge");
    const twofaStatusText = document.getElementById("twofa-status-text");
    const manage2faBtn = document.getElementById("manage-2fa-btn");

    twofaToggle.checked = state.security.twoFactorEnabled;

    if (state.security.twoFactorEnabled) {
      twofaBadge.className = "badge badge--active";
      twofaBadge.innerHTML = `<i class="fa-solid fa-circle" aria-hidden="true"></i> Enabled`;
      twofaStatusText.textContent = "Two-factor authentication is enabled.";
      manage2faBtn.textContent = "Manage 2FA";
    } else {
      twofaBadge.className = "badge badge--checkedout";
      twofaBadge.innerHTML = `<i class="fa-solid fa-circle" aria-hidden="true"></i> Disabled`;
      twofaStatusText.textContent = "Add an extra layer of protection to your account.";
      manage2faBtn.textContent = "Enable 2FA";
    }

    document.getElementById("loginverify-toggle").checked = state.security.loginVerificationEnabled;

    const count = state.sessions.length;
    document.getElementById("sessions-count-text").textContent =
      `${count} active session${count === 1 ? "" : "s"}`;
  }

  /* =======================================================
     RENDER: NOTIFICATION PREFERENCES
     ======================================================= */

  function renderNotificationPrefs() {
    const wrap = document.getElementById("notif-prefs-list");
    if (!wrap) return;

    wrap.innerHTML = state.notificationPrefs.map(pref => `
      <div class="rafara-profile-toggle-row">
        <div class="rafara-profile-toggle-row-text">
          <strong>${pref.title}</strong>
          <span>${pref.desc}</span>
        </div>
        <label class="rafara-profile-switch" for="notif-${pref.id}">
          <input type="checkbox" id="notif-${pref.id}" data-pref-id="${pref.id}" ${pref.enabled ? "checked" : ""}>
          <span class="rafara-profile-switch-track" aria-hidden="true"></span>
          <span class="sr-only">Toggle ${pref.title}</span>
        </label>
      </div>
    `).join("");

    wrap.querySelectorAll("input[data-pref-id]").forEach(input => {
      input.addEventListener("change", () => {
        const pref = state.notificationPrefs.find(p => p.id === input.dataset.prefId);
        if (pref) pref.enabled = input.checked;
      });
    });
  }

  /* =======================================================
     RENDER: PREFERENCES
     ======================================================= */

  function renderPreferences() {
    document.getElementById("pref-startpage").value = state.preferences.startPage;
    document.getElementById("pref-dateformat").value = state.preferences.dateFormat;
    document.getElementById("pref-timeformat").value = state.preferences.timeFormat;
    document.getElementById("compact-mode-toggle").checked = state.preferences.compactMode;
    document.body.classList.toggle("rafara-profile-compact", state.preferences.compactMode);
  }

  /* =======================================================
     RENDER: ACCOUNT ACTIVITY
     ======================================================= */

  function renderActivity() {
    const wrap = document.getElementById("account-activity-list");
    if (!wrap) return;

    if (!state.activity.length) {
      wrap.innerHTML = `
        <li class="empty-state">
          <i class="fa-solid fa-clock-rotate-left"></i>
          <strong>No recent account activity</strong>
        </li>
      `;
      return;
    }

    wrap.innerHTML = state.activity.map(item => `
      <li class="activity-item">
        <span class="activity-icon"><i class="fa-solid ${item.icon}"></i></span>
        <div class="activity-body">
          <strong>${item.title}</strong>
        </div>
        <span class="activity-time">${item.time}</span>
      </li>
    `).join("");
  }

  /* =======================================================
     RENDER: SUMMARY CARD
     ======================================================= */

  function renderSummary() {
    const body = document.getElementById("summary-body");
    if (!body) return;

    const s = state.estateSummary;

    body.innerHTML = `
      <div class="rafara-profile-summary-estate">
        <span class="avatar" aria-hidden="true">${initials(state.profile.fullName)}</span>
        <div>
          <strong>${state.profile.fullName}</strong>
          <span>${state.profile.estate}</span>
        </div>
      </div>
      <div class="rafara-profile-summary-stats">
        <div class="rafara-profile-summary-stat">
          <strong>${s.residents}</strong>
          <span>Residents</span>
        </div>
        <div class="rafara-profile-summary-stat">
          <strong>${s.units}</strong>
          <span>Units</span>
        </div>
        <div class="rafara-profile-summary-stat">
          <strong>${s.securityOfficers}</strong>
          <span>Security Officers</span>
        </div>
        <div class="rafara-profile-summary-stat">
          <strong>${s.artisans}</strong>
          <span>Registered Artisans</span>
        </div>
      </div>
    `;
  }

  function renderAll() {
    renderProfileHeader();
    renderPersonalInfo();
    renderSecurity();
    renderNotificationPrefs();
    renderPreferences();
    renderActivity();
    renderSummary();
  }

  /* =======================================================
     MODAL HELPERS
     ======================================================= */

  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    const firstField = modal.querySelector("input:not([disabled]), select, button");
    if (firstField) firstField.focus();
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = "";
  }

  document.querySelectorAll("[data-close-modal]").forEach(btn => {
    btn.addEventListener("click", () => closeModal(btn.dataset.closeModal));
  });

  document.querySelectorAll(".rafara-profile-modal-backdrop").forEach(backdrop => {
    backdrop.addEventListener("click", event => {
      if (event.target === backdrop) closeModal(backdrop.id);
    });
  });

  document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    document.querySelectorAll(".rafara-profile-modal-backdrop:not([hidden])").forEach(m => closeModal(m.id));
    closeSessionsDrawer();
  });

  /* =======================================================
     AVATAR / CHANGE PHOTO
     ======================================================= */

  const changePhotoBtn = document.getElementById("change-photo-btn");
  const avatarFileInput = document.getElementById("avatar-file-input");

  if (changePhotoBtn && avatarFileInput) {
    changePhotoBtn.addEventListener("click", () => avatarFileInput.click());

    avatarFileInput.addEventListener("change", () => {
      const file = avatarFileInput.files && avatarFileInput.files[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        showToast("Please choose an image file.", "fa-triangle-exclamation");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        state.profile.avatarDataUrl = reader.result;
        applyAvatar();
        showToast("Photo updated.", "fa-camera");
      };
      reader.readAsDataURL(file);
    });
  }

  /* =======================================================
     EDIT PROFILE MODAL
     ======================================================= */

  const editProfileBtn = document.getElementById("edit-profile-btn");
  const editProfileForm = document.getElementById("edit-profile-form");

  if (editProfileBtn) {
    editProfileBtn.addEventListener("click", () => {
      document.getElementById("edit-fullname").value = state.profile.fullName;
      document.getElementById("edit-email").value = state.profile.email;
      document.getElementById("edit-phone").value = state.profile.phone;
      document.getElementById("edit-managerid").value = state.profile.managerId;
      document.getElementById("edit-estate").value = state.profile.estate;

      ["edit-fullname", "edit-email", "edit-phone"].forEach(id => {
        document.getElementById(id).classList.remove("has-error");
        document.getElementById(id + "-error").textContent = "";
      });

      openModal("edit-profile-modal");
    });
  }

  function setFieldError(inputId, message) {
    const input = document.getElementById(inputId);
    const errorEl = document.getElementById(inputId + "-error");
    if (message) {
      input.classList.add("has-error");
      errorEl.textContent = message;
    } else {
      input.classList.remove("has-error");
      errorEl.textContent = "";
    }
  }

  if (editProfileForm) {
    editProfileForm.addEventListener("submit", event => {
      event.preventDefault();

      const fullName = document.getElementById("edit-fullname").value.trim();
      const email = document.getElementById("edit-email").value.trim();
      const phone = document.getElementById("edit-phone").value.trim();

      let valid = true;

      if (!fullName) {
        setFieldError("edit-fullname", "Full name is required.");
        valid = false;
      } else {
        setFieldError("edit-fullname", "");
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailPattern.test(email)) {
        setFieldError("edit-email", "Enter a valid email address.");
        valid = false;
      } else {
        setFieldError("edit-email", "");
      }

      if (!phone || phone.replace(/\D/g, "").length < 7) {
        setFieldError("edit-phone", "Enter a valid phone number.");
        valid = false;
      } else {
        setFieldError("edit-phone", "");
      }

      if (!valid) return;

      state.profile.fullName = fullName;
      state.profile.email = email;
      state.profile.phone = phone;

      renderProfileHeader();
      renderPersonalInfo();
      renderSummary();

      closeModal("edit-profile-modal");
      showToast("Profile updated successfully.", "fa-circle-check");
    });
  }

  /* =======================================================
     CHANGE PASSWORD MODAL
     ======================================================= */

  const changePasswordBtn = document.getElementById("change-password-btn");
  const changePasswordForm = document.getElementById("change-password-form");
  const newPasswordInput = document.getElementById("new-password");

  if (changePasswordBtn) {
    changePasswordBtn.addEventListener("click", () => {
      changePasswordForm.reset();
      setFieldError("current-password", "");
      setFieldError("confirm-password", "");
      updatePasswordRequirements("");
      openModal("change-password-modal");
    });
  }

  document.querySelectorAll("[data-toggle-password]").forEach(btn => {
    btn.addEventListener("click", () => {
      const input = document.getElementById(btn.dataset.togglePassword);
      const icon = btn.querySelector("i");
      const isHidden = input.type === "password";
      input.type = isHidden ? "text" : "password";
      icon.classList.toggle("fa-eye", !isHidden);
      icon.classList.toggle("fa-eye-slash", isHidden);
      btn.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
    });
  });

  function updatePasswordRequirements(value) {
    const rules = {
      length: value.length >= 8,
      number: /\d/.test(value),
      uppercase: /[A-Z]/.test(value)
    };

    Object.keys(rules).forEach(key => {
      const li = document.querySelector(`#password-requirements li[data-rule="${key}"]`);
      if (li) li.classList.toggle("is-met", rules[key]);
    });

    return rules;
  }

  if (newPasswordInput) {
    newPasswordInput.addEventListener("input", () => updatePasswordRequirements(newPasswordInput.value));
  }

  if (changePasswordForm) {
    changePasswordForm.addEventListener("submit", event => {
      event.preventDefault();

      const current = document.getElementById("current-password").value;
      const next = document.getElementById("new-password").value;
      const confirm = document.getElementById("confirm-password").value;

      let valid = true;

      if (!current) {
        setFieldError("current-password", "Enter your current password.");
        valid = false;
      } else {
        setFieldError("current-password", "");
      }

      const rules = updatePasswordRequirements(next);
      if (!rules.length || !rules.number || !rules.uppercase) {
        valid = false;
      }

      if (!confirm || confirm !== next) {
        setFieldError("confirm-password", "Passwords do not match.");
        valid = false;
      } else {
        setFieldError("confirm-password", "");
      }

      if (!valid) return;

      const submitBtn = document.getElementById("update-password-submit");
      submitBtn.disabled = true;
      submitBtn.textContent = "Updating...";

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = "Update Password";

        state.security.passwordLastChangedLabel = "Last changed just now";
        renderSecurity();

        closeModal("change-password-modal");
        showToast("Password updated successfully.", "fa-lock");
      }, 700);
    });
  }

  /* =======================================================
     TWO-FACTOR AUTHENTICATION
     ======================================================= */

  const twofaToggle = document.getElementById("twofa-toggle");
  const manage2faBtn = document.getElementById("manage-2fa-btn");

  if (twofaToggle) {
    twofaToggle.addEventListener("change", () => {
      state.security.twoFactorEnabled = twofaToggle.checked;
      renderSecurity();
      showToast(
        state.security.twoFactorEnabled ? "Two-factor authentication enabled." : "Two-factor authentication disabled.",
        "fa-shield-halved"
      );
    });
  }

  const loginVerifyToggle = document.getElementById("loginverify-toggle");
  if (loginVerifyToggle) {
    loginVerifyToggle.addEventListener("change", () => {
      state.security.loginVerificationEnabled = loginVerifyToggle.checked;
      showToast(
        state.security.loginVerificationEnabled ? "Login verification enabled." : "Login verification disabled.",
        "fa-user-shield"
      );
    });
  }

  if (manage2faBtn) {
    manage2faBtn.addEventListener("click", () => {
      const body = document.getElementById("twofa-modal-body");
      if (state.security.twoFactorEnabled) {
        body.innerHTML = `
          <div class="rafara-profile-2fa-state">
            <span class="rafara-profile-2fa-icon"><i class="fa-solid fa-shield-halved"></i></span>
            <p><strong>Two-factor authentication is enabled</strong> for your account. You'll be asked for a one-time verification code the next time you sign in from a new device.</p>
            <p>This is a frontend prototype — no live verification code is being sent or checked here.</p>
          </div>
        `;
      } else {
        body.innerHTML = `
          <div class="rafara-profile-2fa-state">
            <span class="rafara-profile-2fa-icon"><i class="fa-solid fa-lock"></i></span>
            <p>Add an extra layer of protection to your account. Once enabled, you'll be asked for a one-time verification code in addition to your password when signing in.</p>
            <p>This is a frontend prototype — the actual setup and verification flow is not implemented here.</p>
          </div>
        `;
      }
      openModal("twofa-modal");
    });
  }

  /* =======================================================
     ACTIVE SESSIONS DRAWER
     ======================================================= */

  const viewSessionsBtn = document.getElementById("view-sessions-btn");
  const sessionsDrawerBackdrop = document.getElementById("sessions-drawer-backdrop");
  const closeSessionsDrawerBtn = document.getElementById("close-sessions-drawer");

  function renderSessions() {
    const body = document.getElementById("sessions-drawer-body");
    if (!body) return;

    if (!state.sessions.length) {
      body.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-laptop"></i>
          <strong>No active sessions</strong>
        </div>
      `;
      return;
    }

    body.innerHTML = state.sessions.map(session => `
      <div class="rafara-profile-session-card" data-session-id="${session.id}">
        <span class="rafara-profile-session-icon">
          <i class="fa-solid ${session.device === "Windows" ? "fa-desktop" : "fa-mobile-screen-button"}"></i>
        </span>
        <div class="rafara-profile-session-body">
          <div class="rafara-profile-session-top">
            <strong>${session.device} · ${session.browser}</strong>
            ${session.current ? `<span class="badge badge--active">Current</span>` : ""}
          </div>
          <p>${session.location ? session.location + " · " : ""}${session.activity}</p>
          ${session.current ? "" : `<button type="button" class="btn btn--ghost btn--sm" data-signout-session="${session.id}">Sign Out</button>`}
        </div>
      </div>
    `).join("");

    body.querySelectorAll("[data-signout-session]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.signoutSession;
        state.sessions = state.sessions.filter(s => s.id !== id);
        renderSessions();
        renderSecurity();
        showToast("Signed out of that session.", "fa-right-from-bracket");
      });
    });
  }

  function openSessionsDrawer() {
    renderSessions();
    sessionsDrawerBackdrop.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeSessionsDrawer() {
    if (!sessionsDrawerBackdrop || sessionsDrawerBackdrop.hidden) return;
    sessionsDrawerBackdrop.hidden = true;
    document.body.style.overflow = "";
  }

  if (viewSessionsBtn) {
    viewSessionsBtn.addEventListener("click", openSessionsDrawer);
  }

  if (closeSessionsDrawerBtn) {
    closeSessionsDrawerBtn.addEventListener("click", closeSessionsDrawer);
  }

  if (sessionsDrawerBackdrop) {
    sessionsDrawerBackdrop.addEventListener("click", event => {
      if (event.target === sessionsDrawerBackdrop) closeSessionsDrawer();
    });
  }

  /* =======================================================
     NOTIFICATION PREFERENCES — SAVE
     ======================================================= */

  const saveNotifPrefsBtn = document.getElementById("save-notif-prefs-btn");
  if (saveNotifPrefsBtn) {
    saveNotifPrefsBtn.addEventListener("click", () => {
      showToast("Notification preferences updated.", "fa-bell");
    });
  }

  /* =======================================================
     MANAGER PREFERENCES
     ======================================================= */

  ["pref-startpage", "pref-dateformat", "pref-timeformat"].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("change", () => {
      state.preferences.startPage = document.getElementById("pref-startpage").value;
      state.preferences.dateFormat = document.getElementById("pref-dateformat").value;
      state.preferences.timeFormat = document.getElementById("pref-timeformat").value;
      showToast("Preferences updated.", "fa-sliders");
    });
  });

  const compactModeToggle = document.getElementById("compact-mode-toggle");
  if (compactModeToggle) {
    compactModeToggle.addEventListener("change", () => {
      state.preferences.compactMode = compactModeToggle.checked;
      document.body.classList.toggle("rafara-profile-compact", state.preferences.compactMode);
      showToast(
        state.preferences.compactMode ? "Compact layout enabled." : "Compact layout disabled.",
        "fa-table-cells"
      );
    });
  }

  /* =======================================================
     ACCOUNT ACTIONS — SIGN OUT
     ======================================================= */

  const signoutBtn = document.getElementById("signout-btn");
  const confirmSignoutBtn = document.getElementById("confirm-signout-btn");

  if (signoutBtn) {
    signoutBtn.addEventListener("click", () => openModal("signout-modal"));
  }

  if (confirmSignoutBtn) {
    confirmSignoutBtn.addEventListener("click", () => {
      closeModal("signout-modal");
      showToast("Signing out...", "fa-right-from-bracket");
      setTimeout(() => {
        window.location.href = "manager-login.html";
      }, 600);
    });
  }

  /* =======================================================
     INIT
     ======================================================= */

  document.addEventListener("DOMContentLoaded", () => {
    try {
      renderAll();
    } catch (err) {
      renderErrorState(document.getElementById("main-content"), () => {
        try {
          renderAll();
        } catch (e) {
          /* leave error state in place */
        }
      });
    }
  });

})();
