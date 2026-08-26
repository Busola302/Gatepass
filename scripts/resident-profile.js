/* ==========================================================================
   RAFARA GATEPASS — RESIDENT PROFILE
   Frontend-only logic. No backend, no API calls.
   Interaction patterns (modal open/close, sidebar toggle, dropdowns,
   mobile sheet) mirror resident-dashboard.js so behaviour is consistent
   across every resident page.
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------
     MOCK DATA
     ------------------------------------------------------------------ */
  const resident = {
    id: "RAF-RES-00124",
    fullName: "Rahmah Ogunlaja",
    email: "rahmah@example.com",
    phone: "08012345678",
    role: "Primary Resident",
    estate: "Millenium Housing Estate",
    house: "Block A · Flat 9",
    dateJoined: "2026-08-12",
    status: "active",
    householdMembers: [
      { name: "Rahmah Ogunlaja", role: "Primary Resident" },
      { name: "Amina Ogunlaja", role: "Household Member" },
      { name: "Yusuf Ogunlaja", role: "Household Member" },
      { name: "Mariam Ogunlaja", role: "Household Member" }
    ],
    notificationPreferences: {
      visitorUpdates: true,
      passUpdates: true,
      securityUpdates: true,
      estateAnnouncements: true
    },
    activity: {
      lastProfileUpdate: "August 24, 2026 · 10:42 AM",
      lastPasswordUpdate: "August 20, 2026 · 4:18 PM",
      accountCreated: "August 12, 2026"
    }
  };

  /* ------------------------------------------------------------------
     STATE
     ------------------------------------------------------------------ */
  const state = {
    isEditingProfile: false,
    profileDraft: null,
    lastFocusedElement: null
  };

  /* ------------------------------------------------------------------
     ELEMENT REFERENCES
     ------------------------------------------------------------------ */
  const el = {
    // sidebar / shell
    sidebar: document.getElementById("sidebar"),
    sidebarToggleBtn: document.getElementById("sidebar-toggle-btn"),
    sidebarBackdrop: document.getElementById("sidebar-backdrop"),
    mobileMenuBtn: document.getElementById("mobile-menu-btn"),
    mobileMenuSheet: document.getElementById("mobile-menu-sheet"),

    // topbar
    topbarAvatar: document.getElementById("topbar-avatar"),
    topbarProfileName: document.getElementById("topbar-profile-name"),
    topbarProfileRole: document.getElementById("topbar-profile-role"),

    // profile hero
    avatarInitials: document.getElementById("avatar-initials"),
    avatarImage: document.getElementById("avatar-image"),
    avatarInput: document.getElementById("avatar-input"),
    changePhotoBtn: document.getElementById("change-photo-btn"),
    removePhotoBtn: document.getElementById("remove-photo-btn"),
    overviewName: document.getElementById("overview-name"),
    overviewRole: document.getElementById("overview-role"),
    overviewEstate: document.getElementById("overview-estate"),
    overviewResidentId: document.getElementById("overview-resident-id"),

    // personal info form
    profileForm: document.getElementById("profile-form"),
    fieldFullName: document.getElementById("field-fullname"),
    fieldEmail: document.getElementById("field-email"),
    fieldPhone: document.getElementById("field-phone"),
    fieldResidentId: document.getElementById("field-resident-id"),
    fieldJoined: document.getElementById("field-joined"),
    errorFullName: document.getElementById("error-fullname"),
    errorEmail: document.getElementById("error-email"),
    errorPhone: document.getElementById("error-phone"),
    editProfileBtn: document.getElementById("edit-profile-btn"),
    saveProfileBtn: document.getElementById("save-profile-btn"),
    cancelProfileBtn: document.getElementById("cancel-profile-btn"),

    // household
    householdEstate: document.getElementById("household-estate"),
    householdHouse: document.getElementById("household-house"),
    householdType: document.getElementById("household-type"),
    householdCount: document.getElementById("household-count"),
    householdList: document.getElementById("household-list"),

    // security
    securityEmail: document.getElementById("security-email"),
    passwordForm: document.getElementById("password-form"),
    currentPassword: document.getElementById("current-password"),
    newPassword: document.getElementById("new-password"),
    confirmPassword: document.getElementById("confirm-password"),
    errorCurrentPassword: document.getElementById("error-current-password"),
    errorNewPassword: document.getElementById("error-new-password"),
    errorConfirmPassword: document.getElementById("error-confirm-password"),

    // account activity
    activityProfileUpdate: document.getElementById("activity-profile-update"),
    activityPasswordUpdate: document.getElementById("activity-password-update"),
    activityCreated: document.getElementById("activity-created"),

    // logout
    confirmLogoutBtn: document.getElementById("confirm-logout-btn"),

    // toast
    toastContainer: document.getElementById("toast-container")
  };

  /* ------------------------------------------------------------------
     UTILITIES
     ------------------------------------------------------------------ */
  function getInitials(fullName) {
    return fullName
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  function formatDateLong(isoDate) {
    const d = new Date(isoDate + "T00:00:00");
    if (isNaN(d.getTime())) return isoDate;
    return d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  }

  /* ------------------------------------------------------------------
     TOASTS
     ------------------------------------------------------------------ */
  function showToast(message, iconClass) {
    iconClass = iconClass || "fa-solid fa-circle-check";
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    toast.innerHTML =
      '<i class="' + iconClass + '" aria-hidden="true"></i><span>' + message + "</span>";

    el.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("is-leaving");
      setTimeout(() => toast.remove(), 200);
    }, 3200);
  }

  /* ------------------------------------------------------------------
     RENDER PROFILE
     ------------------------------------------------------------------ */
  function renderProfile() {
    const initials = getInitials(resident.fullName);

    el.overviewName.textContent = resident.fullName;
    el.overviewRole.textContent = resident.role;
    el.overviewEstate.textContent = resident.estate;
    el.overviewResidentId.textContent = resident.id;
    el.avatarInitials.textContent = initials;

    el.topbarAvatar.querySelector ? null : null;
    if (el.avatarImage.hidden) {
      el.topbarAvatar.textContent = initials;
    }
    el.topbarProfileName.textContent = resident.fullName;
    el.topbarProfileRole.textContent = resident.role;

    el.fieldFullName.value = resident.fullName;
    el.fieldEmail.value = resident.email;
    el.fieldPhone.value = resident.phone;
    el.fieldResidentId.value = resident.id;
    el.fieldJoined.value = formatDateLong(resident.dateJoined);

    el.householdEstate.textContent = resident.estate;
    el.householdHouse.textContent = resident.house;
    el.householdType.textContent = resident.role;
    el.householdCount.textContent = resident.householdMembers.length + " Members";

    el.securityEmail.textContent = resident.email;

    el.activityProfileUpdate.textContent = resident.activity.lastProfileUpdate;
    el.activityPasswordUpdate.textContent = resident.activity.lastPasswordUpdate;
    el.activityCreated.textContent = formatDateLong(resident.dateJoined);
  }

  /* ------------------------------------------------------------------
     PROFILE EDIT / SAVE / CANCEL
     ------------------------------------------------------------------ */
  function enterEditMode() {
    state.isEditingProfile = true;
    state.profileDraft = {
      fullName: resident.fullName,
      email: resident.email,
      phone: resident.phone
    };

    [el.fieldFullName, el.fieldEmail, el.fieldPhone].forEach((input) => {
      input.disabled = false;
    });
    el.fieldFullName.focus();

    el.editProfileBtn.hidden = true;
    el.saveProfileBtn.hidden = false;
    el.cancelProfileBtn.hidden = false;

    clearFieldErrors();
  }

  function exitEditMode() {
    state.isEditingProfile = false;
    state.profileDraft = null;

    [el.fieldFullName, el.fieldEmail, el.fieldPhone].forEach((input) => {
      input.disabled = true;
    });

    el.editProfileBtn.hidden = false;
    el.saveProfileBtn.hidden = true;
    el.cancelProfileBtn.hidden = true;

    clearFieldErrors();
  }

  function clearFieldErrors() {
    [el.errorFullName, el.errorEmail, el.errorPhone].forEach((n) => (n.textContent = ""));
    [el.fieldFullName, el.fieldEmail, el.fieldPhone].forEach((n) =>
      n.classList.remove("has-error")
    );
  }

  function validateProfile() {
    let isValid = true;
    clearFieldErrors();

    const fullName = el.fieldFullName.value.trim();
    const email = el.fieldEmail.value.trim();
    const phone = el.fieldPhone.value.trim();

    if (!fullName) {
      el.errorFullName.textContent = "Please enter your full name.";
      el.fieldFullName.classList.add("has-error");
      isValid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      el.errorEmail.textContent = "Please enter your email address.";
      el.fieldEmail.classList.add("has-error");
      isValid = false;
    } else if (!emailPattern.test(email)) {
      el.errorEmail.textContent = "Please enter a valid email address.";
      el.fieldEmail.classList.add("has-error");
      isValid = false;
    }

    const phoneDigits = phone.replace(/[\s-]/g, "");
    const localPattern = /^0[7-9][01]\d{8}$/;
    const intlPattern = /^\+234[7-9][01]\d{8}$/;

    if (!phone) {
      el.errorPhone.textContent = "Please enter your phone number.";
      el.fieldPhone.classList.add("has-error");
      isValid = false;
    } else if (!localPattern.test(phoneDigits) && !intlPattern.test(phoneDigits)) {
      el.errorPhone.textContent = "Please enter a valid phone number.";
      el.fieldPhone.classList.add("has-error");
      isValid = false;
    }

    return isValid;
  }

  function saveProfile(event) {
    if (event) event.preventDefault();
    if (!validateProfile()) return;

    resident.fullName = el.fieldFullName.value.trim();
    resident.email = el.fieldEmail.value.trim();
    resident.phone = el.fieldPhone.value.trim();
    resident.activity.lastProfileUpdate = "Just now";

    renderProfile();
    exitEditMode();
    showToast("Profile updated successfully.");
  }

  function cancelEdit() {
    if (state.profileDraft) {
      el.fieldFullName.value = state.profileDraft.fullName;
      el.fieldEmail.value = state.profileDraft.email;
      el.fieldPhone.value = state.profileDraft.phone;
    }
    exitEditMode();
    showToast("Changes discarded.", "fa-solid fa-rotate-left");
  }

  /* ------------------------------------------------------------------
     GENERIC MODAL HELPERS (id-based, matches data-open-modal / data-close-modal)
     ------------------------------------------------------------------ */
  function openModalById(id) {
    const overlay = document.getElementById(id);
    if (!overlay) return;

    // Only one modal at a time.
    document.querySelectorAll(".modal-overlay").forEach((o) => {
      if (o !== overlay && !o.hidden) o.hidden = true;
    });

    state.lastFocusedElement = document.activeElement;
    overlay.hidden = false;

    if (id === "modal-household") renderHouseholdList();
    if (id === "modal-password") resetPasswordForm();

    const focusTarget = overlay.querySelector("input, button");
    if (focusTarget) focusTarget.focus();

    document.addEventListener("keydown", handleModalKeydown);
  }

  function closeModal(overlay) {
    if (!overlay) return;
    overlay.hidden = true;

    const anyOpen = document.querySelector(".modal-overlay:not([hidden])");
    if (!anyOpen) {
      document.removeEventListener("keydown", handleModalKeydown);
    }

    if (state.lastFocusedElement) {
      state.lastFocusedElement.focus();
      state.lastFocusedElement = null;
    }
  }

  function handleModalKeydown(e) {
    if (e.key === "Escape") {
      const openOverlay = document.querySelector(".modal-overlay:not([hidden])");
      if (openOverlay) closeModal(openOverlay);
    }
  }

  /* ------------------------------------------------------------------
     HOUSEHOLD MODAL CONTENT
     ------------------------------------------------------------------ */
  function renderHouseholdList() {
    el.householdList.innerHTML = "";
    resident.householdMembers.forEach((member) => {
      const li = document.createElement("li");
      li.className = "option-card";
      li.innerHTML =
        '<span class="option-icon" aria-hidden="true">' + getInitials(member.name) + "</span>" +
        '<span class="option-text">' +
        "<strong>" + member.name + "</strong>" +
        "<span>" + member.role + "</span>" +
        "</span>";
      el.householdList.appendChild(li);
    });
  }

  /* ------------------------------------------------------------------
     NOTIFICATION PREFERENCE TOGGLES
     ------------------------------------------------------------------ */
  function updatePreference(key, toggleEl) {
    const newValue = !resident.notificationPreferences[key];
    resident.notificationPreferences[key] = newValue;

    toggleEl.setAttribute("aria-checked", String(newValue));
    const stateLabel = toggleEl.querySelector(".toggle-state");
    if (stateLabel) stateLabel.textContent = newValue ? "On" : "Off";

    showToast("Notification preference updated.");
  }

  function initNotificationToggles() {
    document.querySelectorAll("#notification-pref-list .toggle-switch").forEach((toggle) => {
      const key = toggle.getAttribute("data-pref");
      toggle.addEventListener("click", () => updatePreference(key, toggle));
    });
  }

  /* ------------------------------------------------------------------
     CHANGE PASSWORD
     ------------------------------------------------------------------ */
  function resetPasswordForm() {
    el.passwordForm.reset();
    [el.errorCurrentPassword, el.errorNewPassword, el.errorConfirmPassword].forEach(
      (n) => (n.textContent = "")
    );
    [el.currentPassword, el.newPassword, el.confirmPassword].forEach((n) =>
      n.classList.remove("has-error")
    );
  }

  function validatePassword() {
    let isValid = true;
    [el.errorCurrentPassword, el.errorNewPassword, el.errorConfirmPassword].forEach(
      (n) => (n.textContent = "")
    );
    [el.currentPassword, el.newPassword, el.confirmPassword].forEach((n) =>
      n.classList.remove("has-error")
    );

    const current = el.currentPassword.value;
    const next = el.newPassword.value;
    const confirm = el.confirmPassword.value;

    if (!current) {
      el.errorCurrentPassword.textContent = "Please enter your current password.";
      el.currentPassword.classList.add("has-error");
      isValid = false;
    }

    if (!next) {
      el.errorNewPassword.textContent = "Please enter a new password.";
      el.newPassword.classList.add("has-error");
      isValid = false;
    } else if (next.length < 8) {
      el.errorNewPassword.textContent = "Password must be at least 8 characters.";
      el.newPassword.classList.add("has-error");
      isValid = false;
    }

    if (!confirm) {
      el.errorConfirmPassword.textContent = "Please confirm your new password.";
      el.confirmPassword.classList.add("has-error");
      isValid = false;
    } else if (next && confirm !== next) {
      el.errorConfirmPassword.textContent = "Passwords do not match.";
      el.confirmPassword.classList.add("has-error");
      isValid = false;
    }

    return isValid;
  }

  function handlePasswordSubmit(event) {
    event.preventDefault();
    if (!validatePassword()) return;

    resident.activity.lastPasswordUpdate = "Just now";
    el.activityPasswordUpdate.textContent = resident.activity.lastPasswordUpdate;

    closeModal(document.getElementById("modal-password"));
    showToast("Password updated successfully.");
  }

  /* ------------------------------------------------------------------
     AVATAR PREVIEW
     ------------------------------------------------------------------ */
  function handleAvatarSelect(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      el.avatarImage.src = e.target.result;
      el.avatarImage.hidden = false;
      el.avatarInitials.hidden = true;
      el.removePhotoBtn.hidden = false;
      el.topbarAvatar.textContent = "";
      el.topbarAvatar.innerHTML = '<img src="' + e.target.result + '" alt="" />';
    };
    reader.readAsDataURL(file);
  }

  function handleRemovePhoto() {
    el.avatarImage.hidden = true;
    el.avatarImage.src = "";
    el.avatarInitials.hidden = false;
    el.removePhotoBtn.hidden = true;
    el.avatarInput.value = "";
    el.topbarAvatar.innerHTML = "";
    el.topbarAvatar.textContent = getInitials(resident.fullName);
  }

  /* ------------------------------------------------------------------
     LOGOUT
     ------------------------------------------------------------------ */
  function handleLogout() {
    closeModal(document.getElementById("modal-logout"));
    showToast("Logging out...", "fa-solid fa-arrow-right-from-bracket");
    setTimeout(() => {
      window.location.href = "resident-login.html";
    }, 900);
  }

  /* ------------------------------------------------------------------
     SIDEBAR TOGGLE (≤900px overlay drawer)
     ------------------------------------------------------------------ */
  function openSidebar() {
    el.sidebar.classList.add("is-open");
    el.sidebarBackdrop.hidden = false;
    el.sidebarToggleBtn.setAttribute("aria-expanded", "true");
  }

  function closeSidebar() {
    el.sidebar.classList.remove("is-open");
    el.sidebarBackdrop.hidden = true;
    el.sidebarToggleBtn.setAttribute("aria-expanded", "false");
  }

  /* ------------------------------------------------------------------
     MOBILE "MORE" SHEET
     ------------------------------------------------------------------ */
  function openMobileSheet() {
    el.mobileMenuSheet.hidden = false;
    requestAnimationFrame(() => el.mobileMenuSheet.classList.add("is-open"));
    el.mobileMenuBtn.setAttribute("aria-expanded", "true");
  }

  function closeMobileSheet() {
    el.mobileMenuSheet.classList.remove("is-open");
    el.mobileMenuSheet.hidden = true;
    el.mobileMenuBtn.setAttribute("aria-expanded", "false");
  }

  /* ------------------------------------------------------------------
     TOPBAR PROFILE DROPDOWN
     ------------------------------------------------------------------ */
  function closeAllDropdowns() {
    document.querySelectorAll(".dropdown-panel").forEach((p) => (p.hidden = true));
    document.querySelectorAll("[data-dropdown] > button[aria-expanded]").forEach((b) =>
      b.setAttribute("aria-expanded", "false")
    );
  }

  function initDropdowns() {
    document.querySelectorAll("[data-dropdown]").forEach((wrapper) => {
      const trigger = wrapper.querySelector("button");
      const panel = wrapper.querySelector(".dropdown-panel");
      if (!trigger || !panel) return;

      trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = !panel.hidden;
        closeAllDropdowns();
        if (!isOpen) {
          panel.hidden = false;
          trigger.setAttribute("aria-expanded", "true");
        }
      });
    });

    document.addEventListener("click", closeAllDropdowns);
  }

  /* ------------------------------------------------------------------
     EVENT WIRING
     ------------------------------------------------------------------ */
  function bindEvents() {
    // Profile edit flow
    el.editProfileBtn.addEventListener("click", enterEditMode);
    el.profileForm.addEventListener("submit", saveProfile);
    el.cancelProfileBtn.addEventListener("click", cancelEdit);

    // Generic modal open/close (data-open-modal / data-close-modal)
    document.querySelectorAll("[data-open-modal]").forEach((btn) => {
      btn.addEventListener("click", () => openModalById(btn.getAttribute("data-open-modal")));
    });
    document.querySelectorAll("[data-close-modal]").forEach((btn) => {
      btn.addEventListener("click", () => closeModal(btn.closest(".modal-overlay")));
    });
    document.querySelectorAll(".modal-overlay").forEach((overlay) => {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeModal(overlay);
      });
    });

    // Password form
    el.passwordForm.addEventListener("submit", handlePasswordSubmit);

    // Logout confirm
    el.confirmLogoutBtn.addEventListener("click", handleLogout);

    // Avatar
    el.changePhotoBtn.addEventListener("click", () => el.avatarInput.click());
    el.avatarInput.addEventListener("change", handleAvatarSelect);
    el.removePhotoBtn.addEventListener("click", handleRemovePhoto);

    // Notification toggles
    initNotificationToggles();

    // Sidebar toggle (mobile/tablet drawer)
    el.sidebarToggleBtn.addEventListener("click", () => {
      const isOpen = el.sidebar.classList.contains("is-open");
      if (isOpen) closeSidebar();
      else openSidebar();
    });
    el.sidebarBackdrop.addEventListener("click", closeSidebar);

    // Mobile "More" sheet
    el.mobileMenuBtn.addEventListener("click", () => {
      const isOpen = el.mobileMenuSheet.classList.contains("is-open");
      if (isOpen) closeMobileSheet();
      else openMobileSheet();
    });
    document.querySelectorAll("[data-close-mobile-sheet]").forEach((btn) => {
      btn.addEventListener("click", closeMobileSheet);
    });

    // Topbar profile dropdown
    initDropdowns();
  }

  /* ------------------------------------------------------------------
     INIT
     ------------------------------------------------------------------ */
  function init() {
    renderProfile();
    bindEvents();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
