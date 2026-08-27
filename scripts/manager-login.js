/* ============================================================
   RAFARA GATEPASS — ESTATE MANAGER LOGIN
   window.RafaraManagerAuth namespace

   NOTE: This is a FRONTEND-ONLY mock login flow.
   MANAGER_CREDENTIALS below are temporary demo values and
   MUST be replaced by real backend authentication
   (e.g. POST /api/manager/login) before production use.
   ============================================================ */

/* ---------------------------------------------------------
   1. MOCK CREDENTIALS (temporary — replace with backend auth)
--------------------------------------------------------- */
(function () {
  window.RafaraManagerAuth = window.RafaraManagerAuth || {};

  // TEMPORARY FRONTEND DEMO CREDENTIALS.
  // Do not treat this as real authentication or expose real
  // credentials here. Swap this whole module out once the
  // backend /api/manager/login endpoint exists.
  window.RafaraManagerAuth.MOCK_CREDENTIALS = {
    email: "manager@rafara.com",
    password: "Rafara123"
  };
})();

/* ---------------------------------------------------------
   2. VALIDATION HELPERS
--------------------------------------------------------- */
(function () {
  const NS = window.RafaraManagerAuth;

  NS.validators = {
    isEmailLike: function (value) {
      // Only treat as "email format" if it contains an "@" —
      // otherwise it's assumed to be a Manager ID, not an email.
      return value.includes("@");
    },
    isValidEmail: function (value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }
  };
})();

/* ---------------------------------------------------------
   3. FORM WIRING
--------------------------------------------------------- */
(function () {
  const NS = window.RafaraManagerAuth;
  const { isEmailLike, isValidEmail } = NS.validators;

  const form = document.getElementById("managerLoginForm");
  if (!form) return;

  const managerIdInput = document.getElementById("managerId");
  const passwordInput = document.getElementById("password");
  const managerIdError = document.getElementById("managerIdError");
  const passwordError = document.getElementById("passwordError");
  const formError = document.getElementById("formError");
  const submitBtn = document.getElementById("submitBtn");
  const submitLabel = submitBtn.querySelector(".submit-btn__label");

  function setFieldError(input, errorEl, message) {
    if (!message) {
      input.classList.remove("has-error");
      errorEl.textContent = "";
      errorEl.classList.remove("is-visible");
      return;
    }
    input.classList.add("has-error");
    errorEl.textContent = message;
    errorEl.classList.add("is-visible");
  }

  function setFormError(message) {
    if (!message) {
      formError.textContent = "";
      formError.hidden = true;
      formError.classList.remove("is-visible");
      return;
    }
    formError.textContent = message;
    formError.hidden = false;
    formError.classList.add("is-visible");
  }

  function clearAllErrors() {
    setFieldError(managerIdInput, managerIdError, "");
    setFieldError(passwordInput, passwordError, "");
    setFormError("");
  }

  function validate() {
    let isValid = true;
    const idValue = managerIdInput.value.trim();
    const passValue = passwordInput.value;

    if (!idValue) {
      setFieldError(managerIdInput, managerIdError, "Please enter your email or Manager ID.");
      isValid = false;
    } else if (isEmailLike(idValue) && !isValidEmail(idValue)) {
      setFieldError(managerIdInput, managerIdError, "Please enter a valid email address.");
      isValid = false;
    } else {
      setFieldError(managerIdInput, managerIdError, "");
    }

    if (!passValue) {
      setFieldError(passwordInput, passwordError, "Please enter your password.");
      isValid = false;
    } else {
      setFieldError(passwordInput, passwordError, "");
    }

    return isValid;
  }

  function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    submitBtn.classList.toggle("is-loading", isLoading);
    submitLabel.textContent = isLoading ? "Signing in..." : "Sign In";
  }

  function attemptMockLogin(idValue, passValue) {
    const creds = NS.MOCK_CREDENTIALS;
    return idValue.toLowerCase() === creds.email.toLowerCase() && passValue === creds.password;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    setFormError("");

    if (!validate()) return;

    setLoading(true);

    const idValue = managerIdInput.value.trim();
    const passValue = passwordInput.value;

    // Simulated network delay — replace this whole block with a
    // real fetch() call to the backend login endpoint.
    window.setTimeout(function () {
      const success = attemptMockLogin(idValue, passValue);

      if (success) {
        window.location.href = "manager-dashboard.html";
        return;
      }

      setLoading(false);
      setFormError("Incorrect email or password. Please try again.");
    }, 700);
  });

  // Clear field-level errors as the manager corrects input.
  managerIdInput.addEventListener("input", function () {
    if (managerIdInput.classList.contains("has-error")) {
      setFieldError(managerIdInput, managerIdError, "");
    }
    setFormError("");
  });

  passwordInput.addEventListener("input", function () {
    if (passwordInput.classList.contains("has-error")) {
      setFieldError(passwordInput, passwordError, "");
    }
    setFormError("");
  });
})();

/* ---------------------------------------------------------
   4. SHOW / HIDE PASSWORD
--------------------------------------------------------- */
(function () {
  const toggleBtn = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("password");
  if (!toggleBtn || !passwordInput) return;

  toggleBtn.addEventListener("click", function () {
    const isVisible = passwordInput.type === "text";
    passwordInput.type = isVisible ? "password" : "text";

    toggleBtn.setAttribute("aria-pressed", String(!isVisible));
    toggleBtn.setAttribute("aria-label", isVisible ? "Show password" : "Hide password");
    toggleBtn.innerHTML = `<i class="fa-solid ${isVisible ? "fa-eye" : "fa-eye-slash"}"></i>`;
  });
})();
