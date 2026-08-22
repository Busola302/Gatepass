/**
 * Rafara GatePass — Resident Onboarding
 * Frontend-only demo logic. No backend, no persistence, no network calls.
 * Structured so a real API can be wired in later at the marked integration points.
 */

(function () {
  "use strict";

  /* ----------------------------------------------------------------------
     Mock data — replace with a real estates API later
     ---------------------------------------------------------------------- */
  const MOCK_ESTATES = [
    { id: "est-001", name: "Millennium Housing Estate", location: "Lekki, Lagos", units: 412 },
    { id: "est-002", name: "Greenview Estate", location: "Ikoyi, Lagos", units: 186 },
    { id: "est-003", name: "Royal Gardens Estate", location: "Abuja", units: 264 },
    { id: "est-004", name: "Harmony Residences", location: "Port Harcourt", units: 138 },
  ];

  /* ----------------------------------------------------------------------
     State
     ---------------------------------------------------------------------- */
  const state = {
    currentStep: 1,
    totalSteps: 5,
    selectedEstate: null,
    resident: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      unit: "",
      block: "",
      residentType: "",
    },
    account: {
      email: "",
      password: "",
    },
  };

  /* ----------------------------------------------------------------------
     Element references
     ---------------------------------------------------------------------- */
  const form = document.getElementById("onboardingForm");
  const progressSteps = Array.from(document.querySelectorAll(".progress-step"));
  const stepPanels = Array.from(document.querySelectorAll("[data-step-panel]"));
  const backBtn = document.getElementById("backBtn");
  const continueBtn = document.getElementById("continueBtn");
  const submitBtn = document.getElementById("submitBtn");

  const estateSearch = document.getElementById("estateSearch");
  const estateList = document.getElementById("estateList");
  const estateEmpty = document.getElementById("estateEmpty");
  const selectedEstateIdInput = document.getElementById("selectedEstateId");
  const estateError = document.getElementById("estateError");

  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const strengthFill = document.getElementById("passwordStrengthFill");
  const strengthLabel = document.getElementById("passwordStrengthLabel");
  const requirementItems = Array.from(document.querySelectorAll("#passwordRequirements li"));

  const registrationRefEl = document.getElementById("registrationRef");

  /* ----------------------------------------------------------------------
     Utilities
     ---------------------------------------------------------------------- */
  function qs(id) {
    return document.getElementById(id);
  }

  function showError(fieldName, message) {
    const el = document.querySelector(`[data-error-for="${fieldName}"]`);
    if (el) {
      if (message) el.textContent = message;
      el.hidden = false;
    }
    const input = form.elements[fieldName];
    if (input && input.classList) {
      if (input.length !== undefined) {
        Array.from(input).forEach((i) => i.classList && i.classList.add("is-invalid"));
      } else {
        input.classList.add("is-invalid");
      }
    }
  }

  function clearError(fieldName) {
    const el = document.querySelector(`[data-error-for="${fieldName}"]`);
    if (el) el.hidden = true;
    const input = form.elements[fieldName];
    if (input) {
      if (input.length !== undefined) {
        Array.from(input).forEach((i) => i.classList && i.classList.remove("is-invalid"));
      } else if (input.classList) {
        input.classList.remove("is-invalid");
      }
    }
  }

  function clearAllErrorsIn(panel) {
    panel.querySelectorAll(".field-error").forEach((el) => (el.hidden = true));
    panel.querySelectorAll(".is-invalid").forEach((el) => el.classList.remove("is-invalid"));
  }

  /* ----------------------------------------------------------------------
     Estate list rendering (Step 1)
     ---------------------------------------------------------------------- */
  function renderEstateList(filterText) {
    const query = (filterText || "").trim().toLowerCase();
    const matches = MOCK_ESTATES.filter((estate) =>
      estate.name.toLowerCase().includes(query)
    );

    estateList.innerHTML = "";

    if (matches.length === 0) {
      estateEmpty.hidden = false;
      return;
    }
    estateEmpty.hidden = true;

    matches.forEach((estate) => {
      const isSelected = state.selectedEstate && state.selectedEstate.id === estate.id;

      const option = document.createElement("button");
      option.type = "button";
      option.className = "estate-option" + (isSelected ? " is-selected" : "");
      option.setAttribute("role", "option");
      option.setAttribute("aria-selected", String(isSelected));
      option.dataset.estateId = estate.id;

      option.innerHTML = `
        <span class="estate-option__text">
          <span class="estate-option__name">${escapeHtml(estate.name)}</span>
          <span class="estate-option__meta">${escapeHtml(estate.location)} · ${estate.units} units</span>
        </span>
        <span class="estate-option__check" aria-hidden="true">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
            <path d="M5 12.5L10 17.5L19.5 7" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
      `;

      option.addEventListener("click", () => selectEstate(estate.id));
      estateList.appendChild(option);
    });
  }

  function selectEstate(estateId) {
    const estate = MOCK_ESTATES.find((e) => e.id === estateId);
    if (!estate) return;
    state.selectedEstate = estate;
    selectedEstateIdInput.value = estate.id;
    clearError("selectedEstateId");
    estateError.hidden = true;
    renderEstateList(estateSearch.value);
    updateContinueState();
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  estateSearch.addEventListener("input", () => {
    renderEstateList(estateSearch.value);
  });

  /* ----------------------------------------------------------------------
     Validation
     ---------------------------------------------------------------------- */
  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  function isValidPhone(value) {
    const digits = value.replace(/[^\d]/g, "");
    return digits.length >= 10 && digits.length <= 14;
  }

  function passwordRuleResults(password) {
    return {
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };
  }

  function updatePasswordUI() {
    const rules = passwordRuleResults(passwordInput.value);
    let metCount = 0;

    requirementItems.forEach((item) => {
      const rule = item.dataset.rule;
      const met = rules[rule];
      item.classList.toggle("is-met", met);
      if (met) metCount++;
    });

    const percent = (metCount / 5) * 100;
    strengthFill.style.width = percent + "%";

    let label = "Weak";
    let color = "var(--error)";
    if (metCount >= 5) {
      label = "Strong";
      color = "var(--success)";
    } else if (metCount >= 3) {
      label = "Fair";
      color = "#DE9A2C";
    } else if (metCount === 0) {
      label = "Password strength";
      color = "var(--line)";
    }
    strengthFill.style.background = color;
    strengthLabel.textContent = passwordInput.value ? label : "Password strength";

    return rules;
  }

  function allRulesMet(rules) {
    return Object.values(rules).every(Boolean);
  }

  passwordInput.addEventListener("input", () => {
    updatePasswordUI();
    if (passwordInput.value) clearError("password");
    if (confirmPasswordInput.value) validateConfirmPassword();
    updateContinueState();
  });

  function validateConfirmPassword() {
    if (!confirmPasswordInput.value) return true;
    const matches = confirmPasswordInput.value === passwordInput.value;
    if (matches) {
      clearError("confirmPassword");
    } else {
      showError("confirmPassword", "Passwords don't match.");
    }
    return matches;
  }

  confirmPasswordInput.addEventListener("input", () => {
    validateConfirmPassword();
    updateContinueState();
  });

  /* Password visibility toggles */
  document.querySelectorAll(".password-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.toggleFor;
      const input = qs(targetId);
      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";
      btn.querySelector(".eye-open").hidden = isPassword;
      btn.querySelector(".eye-closed").hidden = !isPassword;
      btn.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
    });
  });

  /* ----------------------------------------------------------------------
     Step-specific validation used to gate the Continue button
     ---------------------------------------------------------------------- */
  function stepIsValid(step) {
    if (step === 1) {
      return Boolean(state.selectedEstate);
    }

    if (step === 2) {
      const firstName = qs("firstName").value.trim();
      const lastName = qs("lastName").value.trim();
      const email = qs("residentEmail").value.trim();
      const phone = qs("phoneNumber").value.trim();
      const unit = qs("unitNumber").value.trim();
      const block = qs("blockName").value.trim();
      const residentType = form.elements["residentType"].value;

      return (
        firstName.length > 0 &&
        lastName.length > 0 &&
        isValidEmail(email) &&
        isValidPhone(phone) &&
        unit.length > 0 &&
        block.length > 0 &&
        Boolean(residentType)
      );
    }

    if (step === 3) {
      const email = qs("accountEmail").value.trim();
      const rules = passwordRuleResults(passwordInput.value);
      const passwordOk = allRulesMet(rules);
      const confirmOk =
        confirmPasswordInput.value.length > 0 &&
        confirmPasswordInput.value === passwordInput.value;

      return isValidEmail(email) && passwordOk && confirmOk;
    }

    if (step === 4) {
      return true;
    }

    return false;
  }

  function updateContinueState() {
    continueBtn.disabled = !stepIsValid(state.currentStep);
  }

  /* Live-validate step 2 fields as the user types/blurs */
  ["firstName", "lastName", "residentEmail", "phoneNumber", "unitNumber", "blockName"].forEach(
    (name) => {
      const input = qs(name);
      input.addEventListener("input", () => {
        clearError(name);
        updateContinueState();
      });
      input.addEventListener("blur", () => {
        validateFieldOnBlur(name);
      });
    }
  );

  function validateFieldOnBlur(name) {
    const value = qs(name).value.trim();
    if (name === "residentEmail" && value && !isValidEmail(value)) {
      showError(name, "Enter a valid email address.");
    } else if (name === "phoneNumber" && value && !isValidPhone(value)) {
      showError(name, "Enter a valid phone number.");
    } else if (["firstName", "lastName", "unitNumber", "blockName"].includes(name) && !value) {
      showError(name);
    }
  }

  document.querySelectorAll('input[name="residentType"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      clearError("residentType");
      updateContinueState();
    });
  });

  qs("accountEmail").addEventListener("input", () => {
    clearError("accountEmail");
    updateContinueState();
  });

  qs("accountEmail").addEventListener("blur", () => {
    const value = qs("accountEmail").value.trim();
    if (value && !isValidEmail(value)) {
      showError("accountEmail", "Enter a valid email address.");
    }
  });

  /* ----------------------------------------------------------------------
     Step navigation
     ---------------------------------------------------------------------- */
  function goToStep(stepNumber) {
    state.currentStep = stepNumber;

    stepPanels.forEach((panel) => {
      panel.hidden = Number(panel.dataset.stepPanel) !== stepNumber;
    });

    progressSteps.forEach((item) => {
      const itemStep = Number(item.dataset.step);
      item.classList.toggle("is-active", itemStep === stepNumber);
      item.classList.toggle("is-complete", itemStep < stepNumber);
    });

    backBtn.hidden = stepNumber === 1 || stepNumber === 5;
    continueBtn.hidden = stepNumber === 4 || stepNumber === 5;
    submitBtn.hidden = stepNumber !== 4;

    if (stepNumber === 4) {
      populateReview();
    }

    updateContinueState();

    const card = document.querySelector(".onboarding-card");
    if (card) card.scrollTop = 0;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  continueBtn.addEventListener("click", () => {
    if (!stepIsValid(state.currentStep)) {
      revealStepErrors(state.currentStep);
      return;
    }
    persistCurrentStepData();
    if (state.currentStep < state.totalSteps) {
      goToStep(state.currentStep + 1);
    }
  });

  backBtn.addEventListener("click", () => {
    if (state.currentStep > 1) {
      goToStep(state.currentStep - 1);
    }
  });

  document.querySelectorAll("[data-edit-step]").forEach((btn) => {
    btn.addEventListener("click", () => {
      goToStep(Number(btn.dataset.editStep));
    });
  });

  function revealStepErrors(step) {
    if (step === 1 && !state.selectedEstate) {
      estateError.hidden = false;
    }
    if (step === 2) {
      ["firstName", "lastName", "unitNumber", "blockName"].forEach((name) => {
        if (!qs(name).value.trim()) showError(name);
      });
      if (!isValidEmail(qs("residentEmail").value.trim())) {
        showError("residentEmail", "Enter a valid email address.");
      }
      if (!isValidPhone(qs("phoneNumber").value.trim())) {
        showError("phoneNumber", "Enter a valid phone number.");
      }
      if (!form.elements["residentType"].value) {
        showError("residentType");
      }
    }
    if (step === 3) {
      if (!isValidEmail(qs("accountEmail").value.trim())) {
        showError("accountEmail", "Enter a valid email address.");
      }
      if (!allRulesMet(passwordRuleResults(passwordInput.value))) {
        showError("password");
      }
      if (confirmPasswordInput.value !== passwordInput.value) {
        showError("confirmPassword", "Passwords don't match.");
      }
    }
  }

  /* ----------------------------------------------------------------------
     Persist step data into state
     ---------------------------------------------------------------------- */
  function persistCurrentStepData() {
    if (state.currentStep === 2) {
      state.resident.firstName = qs("firstName").value.trim();
      state.resident.lastName = qs("lastName").value.trim();
      state.resident.email = qs("residentEmail").value.trim();
      state.resident.phone = qs("phoneNumber").value.trim();
      state.resident.unit = qs("unitNumber").value.trim();
      state.resident.block = qs("blockName").value.trim();
      state.resident.residentType = form.elements["residentType"].value;
    }
    if (state.currentStep === 3) {
      state.account.email = qs("accountEmail").value.trim();
      state.account.password = passwordInput.value;
    }
  }

  /* ----------------------------------------------------------------------
     Review (Step 4)
     ---------------------------------------------------------------------- */
  function populateReview() {
    qs("reviewEstate").textContent = state.selectedEstate ? state.selectedEstate.name : "—";
    qs("reviewName").textContent =
      `${state.resident.firstName} ${state.resident.lastName}`.trim() || "—";
    qs("reviewType").textContent = state.resident.residentType || "—";
    qs("reviewUnit").textContent = state.resident.unit || "—";
    qs("reviewBlock").textContent = state.resident.block || "—";
    qs("reviewEmail").textContent = state.account.email || state.resident.email || "—";
    qs("reviewPhone").textContent = state.resident.phone || "—";
  }

  /* ----------------------------------------------------------------------
     Submission (mock only — no network calls)
     ---------------------------------------------------------------------- */
  function generateRegistrationReference() {
    const randomDigits = Math.floor(10000 + Math.random() * 89999);
    return `RAF-RES-${randomDigits}`;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (state.currentStep !== 4) return;

    submitBtn.classList.add("is-loading");
    submitBtn.disabled = true;
    backBtn.disabled = true;

    // Simulated network delay — replace with a real API call later.
    // Integration point: POST resident registration payload to backend here.
    window.setTimeout(() => {
      const reference = generateRegistrationReference();
      registrationRefEl.textContent = reference;

      submitBtn.classList.remove("is-loading");
      submitBtn.disabled = false;
      backBtn.disabled = false;

      goToStep(5);
    }, 1400);
  });

  /* ----------------------------------------------------------------------
     Init
     ---------------------------------------------------------------------- */
  function init() {
    renderEstateList("");
    updatePasswordUI();
    goToStep(1);
  }

  init();
})();
