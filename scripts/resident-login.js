/* ==========================================================================
   RAFARA GATEPASS — Resident Login
   Frontend-only. No backend, no real authentication.
   Replace `mockAuthService.signIn` with a real API call when a backend
   is available — the rest of this file (validation, UI states) does not
   need to change.
   ========================================================================== */

(function () {
  "use strict";

  /* ----------------------------------------------------------------------
     Mock auth service — swap this out for a real API call later.
     Simulates three resident account states based on the "demo state"
     selector in the UI, so verification flows can be reviewed without a
     backend. Also simulates an invalid-credentials response for short
     passwords, as a stand-in for a real failed login check.
  ---------------------------------------------------------------------- */
  const mockAuthService = {
    signIn(identifier, password, demoState) {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (password.length < 4) {
            resolve({ ok: false, reason: "invalid-credentials" });
            return;
          }
          if (demoState === "pending") {
            resolve({ ok: false, reason: "pending-verification" });
            return;
          }
          if (demoState === "rejected") {
            resolve({ ok: false, reason: "rejected" });
            return;
          }
          resolve({ ok: true, reason: "verified" });
        }, 1100);
      });
    },
  };

  /* ---------------------------------------------------------------------- */

  const form = document.getElementById("login-form");
  const identifierInput = document.getElementById("identifier");
  const passwordInput = document.getElementById("password");
  const identifierError = document.getElementById("identifier-error");
  const passwordError = document.getElementById("password-error");
  const submitBtn = document.getElementById("submit-btn");
  const statusBanner = document.getElementById("status-banner");
  const togglePasswordBtn = document.getElementById("toggle-password");
  const forgotPasswordBtn = document.getElementById("forgot-password");
  const demoPills = document.querySelectorAll(".demo-pill");

  let selectedDemoState = "verified";

  /* ---------- Demo account-state selector ---------- */

  demoPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      demoPills.forEach((p) => {
        p.classList.remove("is-active");
        p.setAttribute("aria-checked", "false");
      });
      pill.classList.add("is-active");
      pill.setAttribute("aria-checked", "true");
      selectedDemoState = pill.dataset.state;
      hideStatusBanner();
    });
  });

  /* ---------- Password visibility toggle ---------- */

  togglePasswordBtn.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    togglePasswordBtn.setAttribute("aria-pressed", String(isPassword));
    togglePasswordBtn.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
    togglePasswordBtn.querySelector(".icon-eye").hidden = isPassword;
    togglePasswordBtn.querySelector(".icon-eye-off").hidden = !isPassword;
  });

  /* ---------- Forgot password (frontend-only demo) ---------- */

  forgotPasswordBtn.addEventListener("click", () => {
    showStatusBanner("info", "Password recovery will be available soon.");
  });

  /* ---------- Validation ---------- */

  function setFieldError(input, errorEl, message) {
    if (message) {
      input.setAttribute("aria-invalid", "true");
      errorEl.textContent = message;
    } else {
      input.setAttribute("aria-invalid", "false");
      errorEl.textContent = "";
    }
  }

  function validate() {
    let valid = true;

    if (!identifierInput.value.trim()) {
      setFieldError(identifierInput, identifierError, "Please enter your email or phone number.");
      valid = false;
    } else {
      setFieldError(identifierInput, identifierError, "");
    }

    if (!passwordInput.value) {
      setFieldError(passwordInput, passwordError, "Please enter your password.");
      valid = false;
    } else {
      setFieldError(passwordInput, passwordError, "");
    }

    return valid;
  }

  identifierInput.addEventListener("input", () => {
    if (identifierInput.getAttribute("aria-invalid") === "true") {
      setFieldError(identifierInput, identifierError, "");
    }
  });
  passwordInput.addEventListener("input", () => {
    if (passwordInput.getAttribute("aria-invalid") === "true") {
      setFieldError(passwordInput, passwordError, "");
    }
  });

  /* ---------- Status banner ---------- */

  function showStatusBanner(kind, message, actions) {
    statusBanner.innerHTML = "";
    statusBanner.className = "status-banner is-" + kind;

    const text = document.createElement("p");
    text.textContent = message;
    text.style.margin = "0";
    statusBanner.appendChild(text);

    if (actions && actions.length) {
      const actionsWrap = document.createElement("div");
      actionsWrap.className = "status-banner-actions";
      actions.forEach(({ label, onClick }) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = label;
        btn.addEventListener("click", onClick);
        actionsWrap.appendChild(btn);
      });
      statusBanner.appendChild(actionsWrap);
    }

    statusBanner.hidden = false;
  }

  function hideStatusBanner() {
    statusBanner.hidden = true;
    statusBanner.innerHTML = "";
  }

  /* ---------- Loading state ---------- */

  function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    submitBtn.classList.toggle("is-loading", isLoading);
    submitBtn.querySelector(".btn-label").textContent = isLoading ? "Signing in..." : "Sign In";
  }

  /* ---------- Submit ---------- */

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    hideStatusBanner();

    if (!validate()) {
      return;
    }

    setLoading(true);

    const result = await mockAuthService.signIn(
      identifierInput.value.trim(),
      passwordInput.value,
      selectedDemoState
    );

    setLoading(false);

    if (result.ok) {
      showStatusBanner("success", "Login successful. Redirecting to your dashboard...");
      window.setTimeout(() => {
        window.location.href = "resident-dashboard.html";
      }, 900);
      return;
    }

    switch (result.reason) {
      case "invalid-credentials":
        setFieldError(passwordInput, passwordError, "");
        showStatusBanner("rejected", "The email/phone number or password is incorrect.");
        break;

      case "pending-verification":
        showStatusBanner(
          "pending",
          "Your account is still awaiting verification from your estate management team.",
          [
            {
              label: "Check Verification Status",
              onClick: () => {
                showStatusBanner(
                  "pending",
                  "Still pending. Your estate management team has not verified your account yet."
                );
              },
            },
            {
              label: "Back to Login",
              onClick: () => hideStatusBanner(),
            },
          ]
        );
        break;

      case "rejected":
        showStatusBanner(
          "rejected",
          "We couldn't verify your resident account. Please contact your estate management team."
        );
        break;

      default:
        showStatusBanner("rejected", "Something went wrong. Please try again.");
    }
  });
})();
