/**
 * interactions.js — Saurabh Giri Portfolio 2.0
 * Custom cursor, magnetic buttons, cursor state management.
 * Only active on pointer:fine (mouse) devices.
 */

'use strict';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(pointer: coarse)').matches;

/* ══════════════════════════════════════════════════════════
   CUSTOM CURSOR
   ══════════════════════════════════════════════════════════ */
function initCursor() {
  if (isTouch || prefersReducedMotion) return;

  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mouseX = -200, mouseY = -200;
  let ringX  = -200, ringY  = -200;
  let rafRunning = false;

  // Update dot position instantly
  document.addEventListener('pointermove', e => {
    if (e.pointerType === 'touch') return;
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
    if (!rafRunning) animateRing();
  }, { passive: true });

  // Ring follows with lerp (smooth trailing)
  function animateRing() {
    rafRunning = true;
    const lerpFactor = 0.12;
    ringX += (mouseX - ringX) * lerpFactor;
    ringY += (mouseY - ringY) * lerpFactor;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';

    if (Math.abs(mouseX - ringX) > 0.1 || Math.abs(mouseY - ringY) > 0.1) {
      requestAnimationFrame(animateRing);
    } else {
      rafRunning = false;
    }
  }

  // Cursor state management
  function setCursorState(state) {
    document.body.dataset.cursor = state || '';
  }

  // State: link
  document.querySelectorAll('a, button, .filter-btn, .theme-toggle, .nav-toggle, .back-top, [data-cursor-target="link"]').forEach(el => {
    el.addEventListener('mouseenter', () => setCursorState('link'));
    el.addEventListener('mouseleave', () => setCursorState(''));
  });

  // State: project (on project list items)
  document.addEventListener('mouseenter', e => {
    const item = e.target.closest('[data-cursor-target="project"]');
    if (item) {
      setCursorState('project');
      const label = ring.querySelector('.cursor-label');
      if (label) label.textContent = 'VIEW\nCASE';
    }
  }, true);
  document.addEventListener('mouseleave', e => {
    const item = e.target.closest('[data-cursor-target="project"]');
    if (item) setCursorState('');
  }, true);

  // State: image
  document.addEventListener('mouseenter', e => {
    const img = e.target.closest('.photo-item, [data-cursor-target="image"]');
    if (img) {
      setCursorState('image');
      const label = ring.querySelector('.cursor-label');
      if (label) label.textContent = 'VIEW';
    }
  }, true);
  document.addEventListener('mouseleave', e => {
    const img = e.target.closest('.photo-item, [data-cursor-target="image"]');
    if (img) setCursorState('');
  }, true);

  // Click feedback
  document.addEventListener('pointerdown', () => document.body.classList.add('cursor-clicking'));
  document.addEventListener('pointerup',   () => document.body.classList.remove('cursor-clicking'));

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '';
    ring.style.opacity = '';
  });
}

/* ══════════════════════════════════════════════════════════
   MAGNETIC BUTTONS
   ══════════════════════════════════════════════════════════ */
function initMagneticButtons() {
  if (isTouch || prefersReducedMotion) return;

  document.querySelectorAll('.btn-magnetic').forEach(btn => {
    const strength = 0.35;

    btn.addEventListener('mousemove', e => {
      const rect   = btn.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = e.clientX - cx;
      const dy     = e.clientY - cy;
      btn.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform .5s cubic-bezier(.34,1.56,.64,1)';
      setTimeout(() => { btn.style.transition = ''; }, 500);
    });
  });
}

/* ══════════════════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initMagneticButtons();
});

// Re-init magnetic after dynamic content renders (work panel changes etc.)
document.addEventListener('workPanelRendered', initMagneticButtons);
