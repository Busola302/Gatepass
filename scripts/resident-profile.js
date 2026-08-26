/* ==========================================================================
   RAFARA GATEPASS — RESIDENT PROFILE
   Frontend-only logic. No backend, no API calls.
   Structured so mock data can later be swapped for real backend data
   without rewriting the rendering / interaction layer.
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------
     MOCK DATA
     Kept isolated from UI logic so it can be replaced by a real
     resident record fetched from a backend later.
     ------------------------------------------------------------------ */
  const resident = {
    id: "RAF-RES-00124",
    fullName: "Rahmah Ogunlaja",
    email: "rahmah@example.com",
    phone: "08012345678",
    role: "Primary Resident",
    estate: "Millenium Housing Estate",
    house: "Block A · Flat 12",
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
    householdModalOpen: false,
    passwordModalOpen: false,
    logoutModalOpen: false,
    notificationPreferences: { ...resident.notificationPreferences },
    profileDraft: null, // snapshot used to restore on cancel
    lastFocusedElement: null
  };

  /* ------------------------------------------------------------------
     ELEMENT REFERENCES
     ------------------------------------------------------------------ */
  const el = {
    // overview
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
    viewHouseholdBtn: document.getElementById("view-household-btn"),
    householdModalOverlay: document.getElementById("household-modal-overlay"),
    householdModal: document.getElementById("household-modal"),
    householdList: document.getElementById("household-list"),

    // notification preferences
    notificationPrefList: document.getElementById("notification-pref-list"),

    // security
    securityEmail: document.getElementById("security-email"),
    changePasswordBtn: document.getElementById("change-password-btn"),
    passwordModalOverlay: document.getElementById("password-modal-overlay"),
    passwordModal: document.getElementById("password-modal"),
    passwordForm: document.getElementById("password-form"),
    currentPassword: document.getElementById("current-password"),
    newPassword: document.getElementById("new-password"),
    confirmPassword: document.getElementById("confirm-password"),
    errorCurrentPassword: document.getElementById("error-current-password"),
    errorNewPassword: document.getElementById("error-new-password"),
    errorConfirmPassword: document.getElementById("error-confirm-password"),
    updatePasswordBtn: document.getElementById("update-password-btn"),

    // account activity
    activityProfileUpdate: document.getElementById("activity-profile-update"),
    activityPasswordUpdate: document.getElementById("activity-password-update"),
    activityCreated: document.getElementById("activity-created"),

    // account actions / logout
    logoutBtn: document.getElementById("logout-btn"),
    sidebarLogoutTrigger: document.getElementById("sidebar-logout-trigger"),
    logoutModalOverlay: document.getElementById("logout-modal-overlay"),
    logoutModal: document.getElementById("logout-modal"),
    confirmLogoutBtn: document.getElementById("confirm-logout-btn"),

    // mobile nav
    mobileMenuBtn: document.getElementById("mobile-menu-btn"),
    mobileDrawer: document.getElementById("mobile-drawer"),
    mobileDrawerOverlay: document.getElementById("mobile-drawer-overlay"),
    mobileDrawerClose: document.getElementById("mobile-drawer-close"),
    bottomNavMoreBtn: document.getElementById("bottom-nav-more-btn"),
    bottomMoreSheet: document.getElementById("bottom-more-sheet"),
    bottomSheetOverlay: document.getElementById("bottom-sheet-overlay"),

    // toast
    toastRegion: document.getElementById("toast-region")
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
      '<i class="' + iconClass + '" aria-hidden="true"></i><span>' +
      message +
      "</span>";

    el.toastRegion.appendChild(toast);

    // Force reflow so the transition triggers
    requestAnimationFrame(() => {
      toast.classList.add("is-visible");
    });

    setTimeout(() => {
      toast.classList.remove("is-visible");
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  }

  /* ------------------------------------------------------------------
     RENDER: PROFILE (overview + form + household + security)
     ------------------------------------------------------------------ */
  function renderProfile() {
    // Overview card
    el.overviewName.textContent = resident.fullName;
    el.overviewRole.textContent = resident.role;
    el.overviewEstate.textContent = resident.estate;
    el.overviewResidentId.textContent = resident.id;
    el.avatarInitials.textContent = getInitials(resident.fullName);

    // Personal information form
    el.fieldFullName.value = resident.fullName;
    el.fieldEmail.value = resident.email;
    el.fieldPhone.value = resident.phone;
    el.fieldResidentId.value = resident.id;
    el.fieldJoined.value = formatDateLong(resident.dateJoined);

    // Household
    el.householdEstate.textContent = resident.estate;
    el.householdHouse.textContent = resident.house;
    el.householdType.textContent = resident.role;
    el.householdCount.textContent = resident.householdMembers.length + " Members";

    // Security
    el.securityEmail.textContent = resident.email;

    // Account activity
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

    // Nigerian phone number formats: 080..., 070..., 090..., 081...
    // 11 digits starting with 0, or +234 followed by 10 digits.
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

    if (!validateProfile()) {
      return;
    }

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
     MODAL HELPERS (generic open/close with focus management)
     ------------------------------------------------------------------ */
  function openModal(name) {
    const overlay = {
      household: el.householdModalOverlay,
      password: el.passwordModalOverlay,
      logout: el.logoutModalOverlay
    }[name];
    const dialog = {
      household: el.householdModal,
      password: el.passwordModal,
      logout: el.logoutModal
    }[name];

    if (!overlay) return;

    // Only one modal can be open at a time. If another modal is already
    // open, close it first so overlays never stack on top of each other.
    ["household", "password", "logout"].forEach((otherName) => {
      if (otherName !== name && isModalOpen(otherName)) {
        closeModal(otherName, { restoreFocus: false });
      }
    });

    state.lastFocusedElement = document.activeElement;
    overlay.hidden = false;

    // populate content specific to the modal being opened
    if (name === "household") {
      renderHouseholdList();
      state.householdModalOpen = true;
    } else if (name === "password") {
      resetPasswordForm();
      state.passwordModalOpen = true;
    } else if (name === "logout") {
      state.logoutModalOpen = true;
    }

    // Move focus into the dialog
    const focusTarget = dialog.querySelector("input, button");
    if (focusTarget) focusTarget.focus();

    document.addEventListener("keydown", handleModalKeydown);
  }

  function isModalOpen(name) {
    if (name === "household") return state.householdModalOpen;
    if (name === "password") return state.passwordModalOpen;
    if (name === "logout") return state.logoutModalOpen;
    return false;
  }

  function closeModal(name, options) {
    const opts = options || {};
    const restoreFocus = opts.restoreFocus !== false;

    const overlay = {
      household: el.householdModalOverlay,
      password: el.passwordModalOverlay,
      logout: el.logoutModalOverlay
    }[name];

    if (!overlay) return;

    overlay.hidden = true;

    if (name === "household") state.householdModalOpen = false;
    if (name === "password") state.passwordModalOpen = false;
    if (name === "logout") state.logoutModalOpen = false;

    const anyOpen =
      state.householdModalOpen || state.passwordModalOpen || state.logoutModalOpen;
    if (!anyOpen) {
      document.removeEventListener("keydown", handleModalKeydown);
    }

    if (restoreFocus && state.lastFocusedElement) {
      state.lastFocusedElement.focus();
      state.lastFocusedElement = null;
    }
  }

  function handleModalKeydown(e) {
    if (e.key === "Escape") {
      if (state.householdModalOpen) closeModal("household");
      else if (state.passwordModalOpen) closeModal("password");
      else if (state.logoutModalOpen) closeModal("logout");
    }
  }

  /* ------------------------------------------------------------------
     HOUSEHOLD MODAL
     ------------------------------------------------------------------ */
  function renderHouseholdList() {
    el.householdList.innerHTML = "";
    resident.householdMembers.forEach((member) => {
      const li = document.createElement("li");
      li.className = "household-member";
      li.innerHTML =
        '<span class="household-avatar" aria-hidden="true">' +
        getInitials(member.name) +
        '</span>' +
        '<span class="household-member-info">' +
        '<span class="household-member-name">' + member.name + '</span>' +
        '<span class="household-member-role">' + member.role + '</span>' +
        '</span>';
      el.householdList.appendChild(li);
    });
  }

  /* ------------------------------------------------------------------
     NOTIFICATION PREFERENCE TOGGLES
     ------------------------------------------------------------------ */
  const prefLabels = {
    visitorUpdates: "Visitor Updates",
    passUpdates: "Pass Updates",
    securityUpdates: "Security Updates",
    estateAnnouncements: "Estate Announcements"
  };

  function updatePreference(key, toggleEl) {
    const newValue = !state.notificationPreferences[key];
    state.notificationPreferences[key] = newValue;
    resident.notificationPreferences[key] = newValue;

    toggleEl.setAttribute("aria-checked", String(newValue));
    const stateLabel = toggleEl.querySelector(".toggle-state");
    if (stateLabel) stateLabel.textContent = newValue ? "On" : "Off";

    showToast("Notification preference updated.");
  }

  function initNotificationToggles() {
    const toggles = el.notificationPrefList.querySelectorAll(".toggle-switch");
    toggles.forEach((toggle) => {
      const key = toggle.getAttribute("data-pref");
      toggle.addEventListener("click", () => updatePreference(key, toggle));
    });
  }

  /* ------------------------------------------------------------------
     CHANGE PASSWORD MODAL
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

    // Frontend-only simulation. Nothing is stored or transmitted.
    resident.activity.lastPasswordUpdate = "Just now";
    el.activityPasswordUpdate.textContent = resident.activity.lastPasswordUpdate;

    closeModal("password");
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
    };
    reader.readAsDataURL(file);
  }

  function handleRemovePhoto() {
    el.avatarImage.hidden = true;
    el.avatarImage.src = "";
    el.avatarInitials.hidden = false;
    el.removePhotoBtn.hidden = true;
    el.avatarInput.value = "";
  }

  /* ------------------------------------------------------------------
     LOGOUT
     ------------------------------------------------------------------ */
  function handleLogout() {
    closeModal("logout");
    showToast("Logging out...", "fa-solid fa-arrow-right-from-bracket");
    setTimeout(() => {
      window.location.href = "resident-login.html";
    }, 900);
  }

  /* ------------------------------------------------------------------
     MOBILE NAVIGATION
     ------------------------------------------------------------------ */
  function openMobileDrawer() {
    el.mobileDrawer.classList.add("is-open");
    el.mobileDrawer.setAttribute("aria-hidden", "false");
    el.mobileDrawerOverlay.hidden = false;
    el.mobileMenuBtn.setAttribute("aria-expanded", "true");
    const firstLink = el.mobileDrawer.querySelector(".nav-link");
    if (firstLink) firstLink.focus();
    document.addEventListener("keydown", handleMobileDrawerKeydown);
  }

  function closeMobileDrawer() {
    el.mobileDrawer.classList.remove("is-open");
    el.mobileDrawer.setAttribute("aria-hidden", "true");
    el.mobileDrawerOverlay.hidden = true;
    el.mobileMenuBtn.setAttribute("aria-expanded", "false");
    document.removeEventListener("keydown", handleMobileDrawerKeydown);
    el.mobileMenuBtn.focus();
  }

  function handleMobileDrawerKeydown(e) {
    if (e.key === "Escape") closeMobileDrawer();
  }

  function openBottomSheet() {
    el.bottomMoreSheet.hidden = false;
    el.bottomSheetOverlay.hidden = false;
    el.bottomNavMoreBtn.setAttribute("aria-expanded", "true");
  }

  function closeBottomSheet() {
    el.bottomMoreSheet.hidden = true;
    el.bottomSheetOverlay.hidden = true;
    el.bottomNavMoreBtn.setAttribute("aria-expanded", "false");
  }

  /* ------------------------------------------------------------------
     EVENT WIRING
     ------------------------------------------------------------------ */
  function bindEvents() {
    // Profile edit flow
    el.editProfileBtn.addEventListener("click", enterEditMode);
    el.profileForm.addEventListener("submit", saveProfile);
    el.cancelProfileBtn.addEventListener("click", cancelEdit);

    // Household modal
    el.viewHouseholdBtn.addEventListener("click", () => openModal("household"));

    // Password modal
    el.changePasswordBtn.addEventListener("click", () => openModal("password"));
    el.passwordForm.addEventListener("submit", handlePasswordSubmit);

    // Logout modal
    el.logoutBtn.addEventListener("click", () => openModal("logout"));
    if (el.sidebarLogoutTrigger) {
      el.sidebarLogoutTrigger.addEventListener("click", (e) => {
        e.preventDefault();
        openModal("logout");
      });
    }
    el.confirmLogoutBtn.addEventListener("click", handleLogout);

    // Generic modal close buttons + overlay click
    document.querySelectorAll("[data-close-modal]").forEach((btn) => {
      btn.addEventListener("click", () => closeModal(btn.getAttribute("data-close-modal")));
    });
    [el.householdModalOverlay, el.passwordModalOverlay, el.logoutModalOverlay].forEach(
      (overlay) => {
        overlay.addEventListener("click", (e) => {
          if (e.target === overlay) {
            if (overlay === el.householdModalOverlay) closeModal("household");
            if (overlay === el.passwordModalOverlay) closeModal("password");
            if (overlay === el.logoutModalOverlay) closeModal("logout");
          }
        });
      }
    );

    // Avatar
    el.changePhotoBtn.addEventListener("click", () => el.avatarInput.click());
    el.avatarInput.addEventListener("change", handleAvatarSelect);
    el.removePhotoBtn.addEventListener("click", handleRemovePhoto);

    // Notification toggles
    initNotificationToggles();

    // Mobile drawer
    el.mobileMenuBtn.addEventListener("click", openMobileDrawer);
    el.mobileDrawerClose.addEventListener("click", closeMobileDrawer);
    el.mobileDrawerOverlay.addEventListener("click", closeMobileDrawer);

    // Bottom sheet ("More")
    el.bottomNavMoreBtn.addEventListener("click", () => {
      const isOpen = !el.bottomMoreSheet.hidden;
      if (isOpen) closeBottomSheet();
      else openBottomSheet();
    });
    el.bottomSheetOverlay.addEventListener("click", closeBottomSheet);
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
