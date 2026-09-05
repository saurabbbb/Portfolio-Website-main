/**
 * animations.js — Saurabh Giri Portfolio 2.0
 * Preloader, hero entrance sequence, GSAP scroll reveals,
 * parallax, timeline draw animation.
 * Uses GSAP (loaded globally via CDN in index.html).
 */

'use strict';

/* ── REDUCED MOTION CHECK ────────────────────────────────── */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ══════════════════════════════════════════════════════════
   PRELOADER
   ══════════════════════════════════════════════════════════ */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  function hidePreloader() {
    preloader.classList.add('hidden');
    // Start hero entrance after preloader fades out
    setTimeout(playHeroEntrance, 150);
  }

  if (prefersReducedMotion) {
    preloader.classList.add('hidden');
    return;
  }

  // Hide on page load, or 1.8s max — whichever is sooner
  // Slightly longer so glitch animation plays
  if (document.readyState === 'complete') {
    setTimeout(hidePreloader, 900);
  } else {
    window.addEventListener('load', () => setTimeout(hidePreloader, 700));
    setTimeout(hidePreloader, 1800); // safety cap
  }
}

/* ══════════════════════════════════════════════════════════
   HERO ENTRANCE — staggered word reveals
   ══════════════════════════════════════════════════════════ */
function playHeroEntrance() {
  if (prefersReducedMotion) {
    // Just make everything visible immediately
    document.querySelectorAll('.hero-word-inner').forEach(el => {
      el.style.transform = 'translateY(0)';
      el.style.opacity   = '1';
    });
    document.querySelectorAll('.hero-status, .hero-role-typing, .hero-desc, .hero-cta, .case-tag, .scroll-cue, .hero-coords').forEach(el => {
      el.style.opacity   = '1';
      el.style.transform = 'none';
    });
    return;
  }

  if (typeof gsap === 'undefined') {
    // GSAP not loaded — CSS fallback
    document.querySelectorAll('.hero-word').forEach(el => el.classList.add('revealed'));
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  // 1. Nav slides down
  tl.from('.site-nav', {
    y: -48, opacity: 0, duration: 0.9, ease: 'expo.out'
  }, 0);

  // 2. Case tag
  tl.from('#home .case-tag', {
    y: 20, opacity: 0, duration: 0.7
  }, 0.2);

  // 2b. Status badge
  tl.from('.hero-status', {
    y: 14, opacity: 0, duration: 0.5
  }, 0.3);

  // 3. Hero words reveal upward (staggered)
  tl.to('.hero-word-inner', {
    y: '0%',
    opacity: 1,
    duration: 1.1,
    stagger: 0.08,
    ease: 'expo.out'
  }, 0.4);

  // 4. Typing role row
  tl.from('.hero-role-typing', {
    y: 14, opacity: 0, duration: 0.6
  }, 0.75);

  // 5. Description
  tl.from('.hero-desc', {
    y: 16, opacity: 0, duration: 0.7
  }, 0.88);

  // 6. CTAs
  tl.from('.hero-cta .btn', {
    y: 20, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'back.out(1.4)'
  }, 0.98);

  // 7. Scroll cue + coords
  tl.from('.scroll-cue, .hero-coords', {
    opacity: 0, duration: 0.8, stagger: 0.1
  }, 1.2);
}

/* ══════════════════════════════════════════════════════════
   PARALLAX — hero background on scroll
   ══════════════════════════════════════════════════════════ */
function initParallax() {
  if (prefersReducedMotion) return;

  const heroGrid = document.querySelector('.hero-grid');
  const heroAmb  = document.querySelector('.hero-ambient');
  if (!heroGrid) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const max     = window.innerHeight;
      if (scrollY > max) { ticking = false; return; }
      const ratio = scrollY / max;
      heroGrid.style.transform = `translateY(${ratio * 40}px)`;
      if (heroAmb) heroAmb.style.transform = `translateY(${ratio * 24}px)`;
      ticking = false;
    });
    ticking = true;
  }, { passive: true });
}

/* ══════════════════════════════════════════════════════════
   GSAP SCROLL TRIGGERS — Section reveals with GSAP
   ══════════════════════════════════════════════════════════ */
function initGSAPScrollEffects() {
  if (prefersReducedMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Section headings — clip-path style reveal (already handled by CSS but GSAP overrides for richer animation)
  gsap.utils.toArray('.section-head h2').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      clipPath: 'inset(0 0 100% 0)',
      y: 24,
      opacity: 0,
      duration: 1.2,
      ease: 'expo.out'
    });
  });

  // Eyebrow rows
  gsap.utils.toArray('.section-head .eyebrow').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      x: -20,
      opacity: 0,
      duration: 0.8,
      ease: 'expo.out'
    });
  });

  // Staggered grids (board nodes, beyond cards, cred cards)
  gsap.utils.toArray('.board, .beyond-grid, .cred-grid').forEach(grid => {
    const children = grid.querySelectorAll('.node, .beyond-card, .cred-card');
    if (!children.length) return;
    gsap.from(children, {
      scrollTrigger: { trigger: grid, start: 'top 80%', once: true },
      y: 32, opacity: 0, duration: 0.75, stagger: 0.08, ease: 'expo.out'
    });
  });

  // Project list items
  gsap.utils.toArray('.project-list-item').forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: { trigger: item, start: 'top 88%', once: true },
      x: -24, opacity: 0, duration: 0.7, delay: i * 0.05, ease: 'expo.out'
    });
  });

  // Ruler lines grow on scroll
  gsap.utils.toArray('.ruler').forEach(ruler => {
    gsap.from(ruler, {
      scrollTrigger: { trigger: ruler, start: 'top 90%', once: true },
      scaleX: 0,
      transformOrigin: 'left',
      duration: 1.0,
      ease: 'expo.out'
    });
  });
}

/* ══════════════════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initParallax();
  // GSAP effects run slightly after content is rendered
  requestAnimationFrame(initGSAPScrollEffects);
});
