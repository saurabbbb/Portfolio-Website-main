'use strict';

const FORMSPREE_URL = 'https://formspree.io/f/myeydznl';

const FIELDS = [
  { id: 'f-name',     inputId: 'cf-name',     validate: v => v.trim().length >= 2,                          error: 'Please enter your name (at least 2 characters).'  },
  { id: 'f-email',    inputId: 'cf-email',    validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),  error: 'Please enter a valid email address.'               },
  { id: 'f-interest', inputId: 'cf-interest', validate: v => v !== '',                                      error: 'Please select an area of interest.'                },
  { id: 'f-message',  inputId: 'cf-message',  validate: v => v.trim().length >= 5,                          error: 'Please add a message (at least 5 characters).'    }
];

const BTN = { DEFAULT: '', SENDING: 'sending', SUCCESS: 'success', ERROR: 'error' };

function setBtn(btn, state) {
  btn.classList.remove('sending', 'success', 'error');
  if (state) btn.classList.add(state);
  btn.disabled = state === BTN.SENDING;
}

function validateField(f) {
  const input = document.getElementById(f.inputId);
  const wrap  = document.getElementById(f.id);
  const err   = wrap?.querySelector('.err-text');
  if (!input || !wrap) return true;
  const valid = f.validate(input.value);
  wrap.classList.toggle('invalid', !valid);
  if (err) err.textContent = valid ? '' : f.error;
  return valid;
}

function showMsg(el, text, ok) {
  if (!el) return;
  el.textContent = text;
  el.className = 'form-msg show ' + (ok ? 'ok' : 'err');
}

function hideMsg(el) {
  if (el) el.className = 'form-msg';
}

function initContactForm() {
  const form   = document.getElementById('contactForm');
  const btn    = form?.querySelector('.btn-submit');
  const msgEl  = document.getElementById('formMsg');
  if (!form || !btn) return;

  FIELDS.forEach(f => {
    const input = document.getElementById(f.inputId);
    input?.addEventListener('blur',  () => { if (input.value !== '') validateField(f); });
    input?.addEventListener('input', () => { if (document.getElementById(f.id)?.classList.contains('invalid')) validateField(f); });
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!FIELDS.map(validateField).every(Boolean)) {
      showMsg(msgEl, 'Please fix the highlighted fields.', false);
      return;
    }

    setBtn(btn, BTN.SENDING);
    hideMsg(msgEl);

    try {
      const res  = await fetch(FORMSPREE_URL, {
        method:  'POST',
        headers: { Accept: 'application/json' },
        body:    new FormData(form)
      });
      const data = await res.json();

      if (res.ok && data.ok !== false) {
        setBtn(btn, BTN.SUCCESS);
        showMsg(msgEl, "Message sent — I'll get back to you soon!", true);
        form.reset();
        setTimeout(() => setBtn(btn, BTN.DEFAULT), 4000);
      } else {
        throw new Error(data.errors?.map(e => e.message).join(' ') || 'Submission failed.');
      }
    } catch (err) {
      setBtn(btn, BTN.ERROR);
      showMsg(msgEl, err.message || 'Something went wrong. Please try again.', false);
      setTimeout(() => setBtn(btn, BTN.DEFAULT), 5000);
    }
  });
}

document.addEventListener('DOMContentLoaded', initContactForm);
