/**
 * contact.js — Saurabh Giri Portfolio 2.0
 * Contact form: client-side validation, Formspree AJAX submit,
 * button state machine (Default → Sending → Sent/Error).
 *
 * ── HOW TO SET UP FORMSPREE ──────────────────────────────────
 *  1. Go to https://formspree.io and sign up (free).
 *  2. Create a new form → set your email → copy the endpoint ID.
 *  3. Replace 'REPLACE_WITH_YOUR_FORMSPREE_ID' below with that ID.
 *     It looks like: xvgpzaqj  (8 characters)
 * ─────────────────────────────────────────────────────────────
 */

'use strict';

/* ── FORMSPREE ENDPOINT ───────────────────────────────────── */
const FORMSPREE_ID  = 'REPLACE_WITH_YOUR_FORMSPREE_ID';
const FORMSPREE_URL = `https://formspree.io/f/${FORMSPREE_ID}`;

/* ── FIELD DEFINITIONS ───────────────────────────────────── */
const FIELDS = [
  {
    id:       'f-name',
    inputId:  'cf-name',
    validate: v => v.trim().length >= 2,
    error:    'Please enter your name (at least 2 characters).'
  },
  {
    id:       'f-email',
    inputId:  'cf-email',
    validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    error:    'Please enter a valid email address.'
  },
  {
    id:       'f-interest',
    inputId:  'cf-interest',
    validate: v => v !== '',
    error:    'Please select an area of interest.'
  },
  {
    id:       'f-message',
    inputId:  'cf-message',
    validate: v => v.trim().length >= 5,
    error:    'Please add a message (at least 5 characters).'
  }
];

/* ── BUTTON STATE MACHINE ─────────────────────────────────── */
const BTN_STATES = {
  DEFAULT: '',
  SENDING: 'sending',
  SUCCESS: 'success',
  ERROR:   'error'
};

function setButtonState(btn, state) {
  btn.classList.remove(...Object.values(BTN_STATES).filter(Boolean));
  if (state) btn.classList.add(state);
  btn.disabled = state === BTN_STATES.SENDING;
}

/* ── FIELD VALIDATION ─────────────────────────────────────── */
function validateField(fieldDef) {
  const input = document.getElementById(fieldDef.inputId);
  const wrap  = document.getElementById(fieldDef.id);
  const errEl = wrap?.querySelector('.err-text');
  if (!input || !wrap) return true;

  const valid = fieldDef.validate(input.value);
  wrap.classList.toggle('invalid', !valid);
  if (errEl) errEl.textContent = valid ? '' : fieldDef.error;
  return valid;
}

/* ── FORM INIT ────────────────────────────────────────────── */
function initContactForm() {
  const form      = document.getElementById('contactForm');
  const submitBtn = form?.querySelector('.btn-submit');
  const msgEl     = document.getElementById('formMsg');
  if (!form || !submitBtn) return;

  /* Live validation on blur / re-check on input */
  FIELDS.forEach(f => {
    const input = document.getElementById(f.inputId);
    input?.addEventListener('blur',  () => { if (input.value !== '') validateField(f); });
    input?.addEventListener('input', () => {
      const wrap = document.getElementById(f.id);
      if (wrap?.classList.contains('invalid')) validateField(f);
    });
  });

  /* Submit */
  form.addEventListener('submit', async e => {
    e.preventDefault();

    /* Client-side validate */
    const allValid = FIELDS.map(validateField).every(Boolean);
    if (!allValid) {
      showMessage(msgEl, 'Please fix the highlighted fields.', false);
      return;
    }

    /* Check Formspree ID has been set */
    if (FORMSPREE_ID === 'REPLACE_WITH_YOUR_FORMSPREE_ID') {
      showMessage(
        msgEl,
        '⚠ Form not connected yet. See js/contact.js for setup instructions.',
        false
      );
      return;
    }

    setButtonState(submitBtn, BTN_STATES.SENDING);
    hideMessage(msgEl);

    try {
      const res  = await fetch(FORMSPREE_URL, {
        method:  'POST',
        headers: { 'Accept': 'application/json' },
        body:    new FormData(form)
      });
      const data = await res.json();

      if (res.ok && data.ok !== false) {
        setButtonState(submitBtn, BTN_STATES.SUCCESS);
        showMessage(msgEl, 'Message sent. I\'ll get back to you soon!', true);
        form.reset();
        setTimeout(() => setButtonState(submitBtn, BTN_STATES.DEFAULT), 4000);
      } else {
        /* Formspree returns { errors: [...] } on validation failure */
        const errMsg = data.errors
          ? data.errors.map(e => e.message).join(' ')
          : 'Submission failed. Please try again.';
        throw new Error(errMsg);
      }
    } catch (err) {
      setButtonState(submitBtn, BTN_STATES.ERROR);
      showMessage(
        msgEl,
        err.message || 'Something went wrong. Please try again or email me directly.',
        false
      );
      setTimeout(() => setButtonState(submitBtn, BTN_STATES.DEFAULT), 5000);
    }
  });
}

function showMessage(el, text, success) {
  if (!el) return;
  el.textContent = text;
  el.className   = 'form-msg show ' + (success ? 'ok' : 'err');
}

function hideMessage(el) {
  if (!el) return;
  el.className = 'form-msg';
}

/* ── INIT ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', initContactForm);
