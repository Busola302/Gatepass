// Rafara GatePass — Security Login
// Mirrors the interaction patterns established on the Resident and Manager login pages:
// empty state, focus state, password visibility toggle, incorrect-credentials error,
// loading state, disabled Sign In state, and successful submission state.

(function () {
  const form = document.getElementById('securityLoginForm');
  const securityIdInput = document.getElementById('securityId');
  const passwordInput = document.getElementById('password');
  const securityIdError = document.getElementById('securityIdError');
  const passwordError = document.getElementById('passwordError');
  const formError = document.getElementById('formError');
  const submitBtn = document.getElementById('submitBtn');
  const submitLabel = submitBtn.querySelector('.submit-btn__label');
  const togglePasswordBtn = document.getElementById('togglePassword');

  // ---- Disabled Sign In state until both fields have content ----
  function updateSubmitState() {
    const hasId = securityIdInput.value.trim().length > 0;
    const hasPassword = passwordInput.value.length > 0;
    submitBtn.disabled = !(hasId && hasPassword);
  }

  [securityIdInput, passwordInput].forEach((input) => {
    input.addEventListener('input', () => {
      clearFieldError(input);
      updateSubmitState();
    });
  });

  updateSubmitState();

  // ---- Password visibility toggle ----
  togglePasswordBtn.addEventListener('click', () => {
    const isVisible = passwordInput.type === 'text';
    passwordInput.type = isVisible ? 'password' : 'text';
    togglePasswordBtn.setAttribute('aria-pressed', String(!isVisible));
    togglePasswordBtn.setAttribute('aria-label', isVisible ? 'Show password' : 'Hide password');
    togglePasswordBtn.querySelector('i').classList.toggle('fa-eye', isVisible);
    togglePasswordBtn.querySelector('i').classList.toggle('fa-eye-slash', !isVisible);
  });

  // ---- Field error helpers ----
  function setFieldError(input, errorEl, message) {
    errorEl.textContent = message;
    input.closest('.field').classList.add('field--error');
  }

  function clearFieldError(input) {
    const field = input.closest('.field');
    field.classList.remove('field--error');
    const errorEl = field.querySelector('.field__error');
    if (errorEl) errorEl.textContent = '';
  }

  function clearFormError() {
    formError.hidden = true;
    formError.textContent = '';
  }

  // ---- Submit handling ----
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearFormError();

    let hasError = false;
    if (!securityIdInput.value.trim()) {
      setFieldError(securityIdInput, securityIdError, 'Enter your security ID or email.');
      hasError = true;
    }
    if (!passwordInput.value) {
      setFieldError(passwordInput, passwordError, 'Enter your password.');
      hasError = true;
    }
    if (hasError) return;

    // ---- Loading state ----
    submitBtn.disabled = true;
    submitBtn.classList.add('submit-btn--loading');
    submitLabel.textContent = 'Signing in…';

    try {
      const result = await authenticateSecurityOfficer(securityIdInput.value.trim(), passwordInput.value);

      if (!result.success) {
        // ---- Incorrect credentials error ----
        formError.hidden = false;
        formError.textContent = result.message || 'Incorrect security ID/email or password. Please try again.';
        submitBtn.classList.remove('submit-btn--loading');
        submitLabel.textContent = 'Sign In';
        updateSubmitState();
        return;
      }

      // ---- Successful submission state ----
      submitLabel.textContent = 'Signed in';
      submitBtn.classList.remove('submit-btn--loading');
      submitBtn.classList.add('submit-btn--success');
      window.location.href = 'security-dashboard.html';
    } catch (err) {
      formError.hidden = false;
      formError.textContent = 'Something went wrong. Please try again.';
      submitBtn.classList.remove('submit-btn--loading');
      submitLabel.textContent = 'Sign In';
      updateSubmitState();
    }
  });

  // Placeholder for the real authentication call — wire this up to the Rafara auth API.
  // For now this simulates a successful login so the redirect flow can be demoed end-to-end.
  // Swap the body of this function for a real fetch() to your auth endpoint when it's ready,
  // and have it resolve { success: false, message: '...' } on bad credentials to see the
  // incorrect-credentials error state.
  function authenticateSecurityOfficer(securityId, password) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 900);
    });
  }
})();
