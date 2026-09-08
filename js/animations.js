/**
 * animations.js — Saurabh Giri Portfolio 3.0
 * Ultra-Premium Animation Engine:
 *  · Preloader with live counter
 *  · Hero entrance with 3D char split
 *  · Particle cursor trail
 *  · Click ripple effect
 *  · 3D card tilt with shine
 *  · Aurora hero background tracking
 *  · GSAP scroll reveals with advanced effects
 *  · Parallax multi-layer
 *  · Text scramble on hover
 *  · Magnetic nav links
 */

'use strict';

/* ── REDUCED MOTION CHECK ────────────────────────────────── */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ══════════════════════════════════════════════════════════
   INJECT BACKGROUND ORBS
   ══════════════════════════════════════════════════════════ */
function injectBgOrbs() {
  if (prefersReducedMotion) return;
  const orbs = document.createElement('div');
  orbs.className = 'bg-orbs';
  orbs.setAttribute('aria-hidden', 'true');
  orbs.innerHTML = `
    <div class="bg-orb bg-orb-1"></div>
    <div class="bg-orb bg-orb-2"></div>
    <div class="bg-orb bg-orb-3"></div>
  `;
  document.body.insertBefore(orbs, document.body.firstChild);
}

/* ══════════════════════════════════════════════════════════
   INJECT AURORA INTO HERO
   ══════════════════════════════════════════════════════════ */
function injectHeroAurora() {
  if (prefersReducedMotion) return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const aurora = document.createElement('div');
  aurora.className = 'hero-aurora';
  aurora.setAttribute('aria-hidden', 'true');
  hero.insertBefore(aurora, hero.firstChild);
}

/* ══════════════════════════════════════════════════════════
   PRELOADER — live counter + corner labels
   ══════════════════════════════════════════════════════════ */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  // Inject enhanced preloader elements
  if (!prefersReducedMotion) {
    // Wrap existing content in .pre-content
    const existingContent = preloader.innerHTML;
    preloader.innerHTML = `
      <div class="pre-orb-1" aria-hidden="true"></div>
      <div class="pre-orb-2" aria-hidden="true"></div>
      <div class="pre-content">
        <p class="pre-logo" data-text="S.G">S<span>.</span>G</p>
        <div class="pre-counter" aria-hidden="true"><span class="pre-counter-inner" id="preCounterInner">0</span></div>
        <p class="pre-status">System Initializing</p>
        <div class="pre-bar-wrap"><div class="pre-bar"></div></div>
      </div>
      <span class="pre-corner pre-corner-tl" aria-hidden="true">SG / Portfolio 3.0</span>
      <span class="pre-corner pre-corner-tr" aria-hidden="true">KTM / NPL</span>
      <span class="pre-corner pre-corner-bl" aria-hidden="true">EST. 2025</span>
      <span class="pre-corner pre-corner-br" aria-hidden="true">v3.0.0</span>
    `;

    // Animate counter from 0 → 100
    const counterEl = document.getElementById('preCounterInner');
    if (counterEl) {
      let count = 0;
      const duration = 1400;
      const step = 1000 / 60;
      const increment = 100 / (duration / step);
      const timer = setInterval(() => {
        count = Math.min(count + increment * (0.5 + Math.random()), 100);
        counterEl.textContent = Math.floor(count);
        if (count >= 100) {
          counterEl.textContent = '100';
          clearInterval(timer);
        }
      }, step);
    }
  }

  function hidePreloader() {
    preloader.classList.add('hidden');
    setTimeout(playHeroEntrance, 200);
  }

  if (prefersReducedMotion) {
    preloader.classList.add('hidden');
    return;
  }

  if (document.readyState === 'complete') {
    setTimeout(hidePreloader, 1400);
  } else {
    window.addEventListener('load', () => setTimeout(hidePreloader, 1000));
    setTimeout(hidePreloader, 2200);
  }
}

/* ══════════════════════════════════════════════════════════
   HERO ENTRANCE — staggered word reveals + char split
   ══════════════════════════════════════════════════════════ */
function playHeroEntrance() {
  if (prefersReducedMotion) {
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
    document.querySelectorAll('.hero-word').forEach(el => el.classList.add('revealed'));
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

  // 1. Nav slides down with blur
  tl.from('.site-nav', {
    y: -60, opacity: 0, duration: 1.0, ease: 'expo.out'
  }, 0);

  // 1b. Side nav fades in
  tl.from('#side-nav', {
    x: 20, opacity: 0, duration: 0.8
  }, 0.3);

  // 2. Case tag
  tl.from('#home .case-tag', {
    y: 24, opacity: 0, duration: 0.8, ease: 'back.out(1.2)'
  }, 0.25);

  // 2b. Status badge with spring
  tl.from('.hero-status', {
    y: 16, opacity: 0, duration: 0.6, ease: 'back.out(1.4)'
  }, 0.35);

  // 3. Hero words reveal upward (staggered) — more dramatic
  tl.to('.hero-word-inner', {
    y: '0%',
    opacity: 1,
    duration: 1.2,
    stagger: { each: 0.09, ease: 'power2.inOut' },
    ease: 'expo.out'
  }, 0.45);

  // 4. Typing role row
  tl.from('.hero-role-typing', {
    y: 18, opacity: 0, duration: 0.7, ease: 'back.out(1.2)'
  }, 0.82);

  // 5. Description — clip-path reveal
  tl.from('.hero-desc', {
    clipPath: 'inset(0 100% 0 0)',
    opacity: 0,
    duration: 0.9,
    ease: 'expo.out'
  }, 0.95);

  // 6. CTAs — spring pop
  tl.from('.hero-cta .btn', {
    y: 28, opacity: 0, duration: 0.75, stagger: 0.12, ease: 'back.out(1.6)'
  }, 1.05);

  // 7. Scroll cue + coords
  tl.from('.scroll-cue, .hero-coords', {
    opacity: 0, y: 10, duration: 0.9, stagger: 0.12
  }, 1.3);

  // 8. Hero grid fade in
  tl.from('.hero-grid', {
    opacity: 0, duration: 1.5
  }, 0.1);
}

/* ══════════════════════════════════════════════════════════
   PARTICLE CURSOR TRAIL
   ══════════════════════════════════════════════════════════ */
function initParticleTrail() {
  if (prefersReducedMotion || window.matchMedia('(pointer: coarse)').matches) return;

  let lastX = 0, lastY = 0;
  let throttle = 0;

  document.addEventListener('pointermove', e => {
    if (e.pointerType === 'touch') return;
    const now = Date.now();
    if (now - throttle < 60) return; // ~16fps for particles
    throttle = now;

    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    const speed = Math.sqrt(dx * dx + dy * dy);
    if (speed < 4) return; // Only when moving fast enough

    lastX = e.clientX;
    lastY = e.clientY;

    const particle = document.createElement('div');
    particle.className = 'cursor-particle';
    particle.style.left = e.clientX + 'px';
    particle.style.top  = e.clientY + 'px';

    // Random trajectory
    const angle = Math.random() * Math.PI * 2;
    const dist  = 8 + Math.random() * 16;
    particle.style.setProperty('--px', `${Math.cos(angle) * dist}px`);
    particle.style.setProperty('--py', `${Math.sin(angle) * dist}px`);
    particle.style.opacity = (0.3 + Math.random() * 0.4).toString();
    const size = 2 + Math.random() * 4;
    particle.style.width  = size + 'px';
    particle.style.height = size + 'px';

    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 620);
  }, { passive: true });
}

/* ══════════════════════════════════════════════════════════
   CLICK RIPPLE
   ══════════════════════════════════════════════════════════ */
function initClickRipple() {
  if (prefersReducedMotion || window.matchMedia('(pointer: coarse)').matches) return;

  document.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch') return;
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = e.clientX + 'px';
    ripple.style.top  = e.clientY + 'px';
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  });
}

/* ══════════════════════════════════════════════════════════
   3D CARD TILT
   ══════════════════════════════════════════════════════════ */
function initCardTilt() {
  if (prefersReducedMotion || window.matchMedia('(pointer: coarse)').matches) return;

  // Dynamically add tilt class to targetted cards
  const selectors = ['.node', '.beyond-card', '.cred-card', '.stat-item', '.contact-card'];
  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(card => {
      card.classList.add('tilt-card', 'shimmer-card', 'spotlight-hover');

      // Inject shine element
      if (!card.querySelector('.tilt-card-shine')) {
        const shine = document.createElement('div');
        shine.className = 'tilt-card-shine';
        card.appendChild(shine);
      }
    });
  });

  document.addEventListener('mousemove', e => {
    document.querySelectorAll('.tilt-card').forEach(card => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = e.clientX - cx;
      const dy     = e.clientY - cy;
      const dist   = Math.sqrt(dx * dx + dy * dy);
      const maxDist = Math.max(rect.width, rect.height) * 0.8;

      if (dist > maxDist) {
        // Out of range — reset
        card.style.transform = '';
        const shine = card.querySelector('.tilt-card-shine');
        if (shine) {
          shine.style.setProperty('--shine-x', '50%');
          shine.style.setProperty('--shine-y', '50%');
        }
        return;
      }

      const rotY = (dx / rect.width)  * 12;  // max ±12deg
      const rotX = -(dy / rect.height) * 10; // max ±10deg
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(8px)`;

      // Shine position
      const shineX = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1) + '%';
      const shineY = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1) + '%';
      const shine = card.querySelector('.tilt-card-shine');
      if (shine) {
        shine.style.setProperty('--shine-x', shineX);
        shine.style.setProperty('--shine-y', shineY);
      }
    });
  }, { passive: true });

  // Reset on mouse leave
  document.addEventListener('mouseleave', () => {
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.style.transform = '';
    });
  });
}

/* ══════════════════════════════════════════════════════════
   HERO SPOT — track mouse for ambient glow
   ══════════════════════════════════════════════════════════ */
function initHeroSpotTracking() {
  if (prefersReducedMotion) return;
  const spot = document.getElementById('heroSpot');
  const hero = document.querySelector('.hero');
  if (!spot || !hero) return;

  let targetX = 50, targetY = 40;
  let currentX = 50, currentY = 40;
  let raf;

  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    targetX = ((e.clientX - rect.left) / rect.width  * 100);
    targetY = ((e.clientY - rect.top)  / rect.height * 100);
    if (!raf) animate();
  }, { passive: true });

  hero.addEventListener('mouseleave', () => {
    targetX = 50; targetY = 40;
  });

  function animate() {
    currentX += (targetX - currentX) * 0.06;
    currentY += (targetY - currentY) * 0.06;
    spot.style.background = `radial-gradient(ellipse 70% 60% at ${currentX.toFixed(2)}% ${currentY.toFixed(2)}%,
      rgba(198,134,46,.11) 0%, transparent 65%)`;

    if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
      raf = requestAnimationFrame(animate);
    } else {
      raf = null;
    }
  }
}

/* ══════════════════════════════════════════════════════════
   TEXT SCRAMBLE on hover (for nav links, section labels)
   ══════════════════════════════════════════════════════════ */
const SCRAMBLE_CHARS = 'アイウエオカキクケコサシスセソタチツテト▓▒░█▄▀■□▪';

function scrambleText(el) {
  const original = el.dataset.scrambleOriginal || el.textContent.trim();
  if (!el.dataset.scrambleOriginal) el.dataset.scrambleOriginal = original;

  let frame = 0;
  const totalFrames = 12;
  let raf;

  function step() {
    const progress = frame / totalFrames;
    el.textContent = original
      .split('')
      .map((char, i) => {
        if (char === ' ') return ' ';
        if (i / original.length < progress) return char;
        return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      })
      .join('');
    frame++;
    if (frame <= totalFrames) {
      raf = requestAnimationFrame(step);
    } else {
      el.textContent = original;
    }
  }

  cancelAnimationFrame(raf);
  frame = 0;
  step();
}

function initTextScramble() {
  if (prefersReducedMotion) return;

  // Apply to nav links text (not the whole <a>, just the text node)
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('mouseenter', () => {
      const textNode = link.childNodes[link.childNodes.length - 1];
      if (textNode && textNode.nodeType === 3) {
        const span = document.createElement('span');
        span.textContent = textNode.textContent;
        link.replaceChild(span, textNode);
        scrambleText(span);
      }
    });
  });

  // Apply to eyebrow labels on hover
  document.querySelectorAll('.eyebrow').forEach(el => {
    el.addEventListener('mouseenter', () => scrambleText(el));
  });
}

/* ══════════════════════════════════════════════════════════
   MAGNETIC NAV LINKS
   ══════════════════════════════════════════════════════════ */
function initMagneticNavLinks() {
  if (prefersReducedMotion || window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.style.transition = 'transform .4s cubic-bezier(.34,1.56,.64,1), color .2s';

    link.addEventListener('mousemove', e => {
      const rect = link.getBoundingClientRect();
      const cx   = rect.left + rect.width / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) * 0.25;
      const dy   = (e.clientY - cy) * 0.25;
      link.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    link.addEventListener('mouseleave', () => {
      link.style.transform = '';
    });
  });
}

/* ══════════════════════════════════════════════════════════
   PARALLAX — hero background on scroll (multi-layer)
   ══════════════════════════════════════════════════════════ */
function initParallax() {
  if (prefersReducedMotion) return;

  const heroGrid   = document.querySelector('.hero-grid');
  const heroAmb    = document.querySelector('.hero-ambient');
  const heroAurora = document.querySelector('.hero-aurora');
  if (!heroGrid) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const max     = window.innerHeight;
      if (scrollY > max) { ticking = false; return; }
      const ratio = scrollY / max;

      heroGrid.style.transform  = `translateY(${ratio * 50}px)`;
      if (heroAmb)    heroAmb.style.transform    = `translateY(${ratio * 30}px)`;
      if (heroAurora) heroAurora.style.transform = `translateY(${ratio * 20}px)`;

      ticking = false;
    });
    ticking = true;
  }, { passive: true });
}

/* ══════════════════════════════════════════════════════════
   GSAP SCROLL TRIGGERS — Premium section reveals
   ══════════════════════════════════════════════════════════ */
function initGSAPScrollEffects() {
  if (prefersReducedMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Section headings — dramatic clip reveal with 3D
  gsap.utils.toArray('.section-head h2').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      clipPath: 'inset(0 0 100% 0)',
      y: 32,
      rotationX: -20,
      opacity: 0,
      duration: 1.4,
      ease: 'expo.out'
    });
  });

  // Eyebrow rows — slide from left with delay
  gsap.utils.toArray('.section-head .eyebrow').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      x: -30,
      opacity: 0,
      duration: 0.9,
      ease: 'expo.out'
    });
  });

  // Staggered grids — cascade with 3D pop
  gsap.utils.toArray('.board, .beyond-grid, .cred-grid').forEach(grid => {
    const children = grid.querySelectorAll('.node, .beyond-card, .cred-card');
    if (!children.length) return;
    gsap.from(children, {
      scrollTrigger: { trigger: grid, start: 'top 82%', once: true },
      y: 40,
      opacity: 0,
      scale: 0.94,
      duration: 0.8,
      stagger: { each: 0.09, from: 'start', ease: 'power2.inOut' },
      ease: 'expo.out'
    });
  });

  // Project list items — slide from left with stagger
  gsap.utils.toArray('.project-list-item').forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: { trigger: item, start: 'top 90%', once: true },
      x: -32,
      opacity: 0,
      duration: 0.75,
      delay: i * 0.04,
      ease: 'expo.out'
    });
  });

  // Ruler lines grow on scroll
  gsap.utils.toArray('.ruler').forEach(ruler => {
    gsap.from(ruler, {
      scrollTrigger: { trigger: ruler, start: 'top 90%', once: true },
      scaleX: 0,
      transformOrigin: 'left',
      duration: 1.1,
      ease: 'expo.out'
    });
  });

  // Stat/cred numbers — counter animation
  gsap.utils.toArray('.stat-item').forEach(item => {
    gsap.from(item, {
      scrollTrigger: { trigger: item, start: 'top 85%', once: true },
      y: 24,
      opacity: 0,
      scale: 0.88,
      duration: 0.85,
      ease: 'back.out(1.6)'
    });
  });

  // Contact section — stagger from bottom
  const contactCols = document.querySelectorAll('.contact-col, .contact-card');
  if (contactCols.length) {
    gsap.from(contactCols, {
      scrollTrigger: { trigger: contactCols[0], start: 'top 85%', once: true },
      y: 40,
      opacity: 0,
      duration: 0.9,
      stagger: 0.12,
      ease: 'expo.out'
    });
  }

  // Timeline items — subtle reveal with clearProps so items never get stuck invisible
  gsap.utils.toArray('.tl-item').forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: { trigger: item, start: 'top 92%', once: true },
      y: 20,
      opacity: 0,
      duration: 0.7,
      ease: 'expo.out',
      clearProps: 'opacity,transform'
    });
  });

  // Section wrappers — subtle scale reveal
  gsap.utils.toArray('section:not(#home)').forEach(section => {
    gsap.from(section.querySelector('.wrap, .section-inner'), {
      scrollTrigger: { trigger: section, start: 'top 95%', once: true, scrub: false },
      opacity: 0,
      duration: 0.4,
      ease: 'none'
    });
  });
}

/* ══════════════════════════════════════════════════════════
   NUMBER COUNTER — animates stat numbers when in view
   ══════════════════════════════════════════════════════════ */
function initCounterAnimation() {
  if (prefersReducedMotion) return;

  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      obs.unobserve(entry.target);
      const el     = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.countSuffix || '';
      const duration = 1800;
      const start  = Date.now();

      function tick() {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutExpo
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const value = target * ease;
        el.textContent = (Number.isInteger(target) ? Math.floor(value) : value.toFixed(1)) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      tick();
    });
  }, { threshold: 0.5 });

  counters.forEach(el => obs.observe(el));
}

/* ══════════════════════════════════════════════════════════
   STAGGER OBSERVER — for .stagger-item elements
   ══════════════════════════════════════════════════════════ */
function initStaggerObserver() {
  if (prefersReducedMotion) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.stagger-item').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.07}s`;
    obs.observe(el);
  });
}

/* ══════════════════════════════════════════════════════════
   SMOOTH SCROLL ACCELERATION
   Adds a subtle lerp to anchor scroll for a premium feel
   ══════════════════════════════════════════════════════════ */
function initSmoothScrollFeel() {
  if (prefersReducedMotion) return;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      // Flash the target section subtly
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(target, {
          opacity: 0.7
        }, {
          opacity: 1,
          duration: 0.6,
          delay: 0.4,
          ease: 'expo.out'
        });
      }

      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ══════════════════════════════════════════════════════════
   SECTION LABEL SCRAMBLE on scroll into view
   ══════════════════════════════════════════════════════════ */
function initSectionLabelScramble() {
  if (prefersReducedMotion) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => scrambleText(entry.target), 200);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.section-head .eyebrow').forEach(el => obs.observe(el));
}

/* ══════════════════════════════════════════════════════════
   NAV HOVER GLOW — colored underline on active
   ══════════════════════════════════════════════════════════ */
function initNavHoverGlow() {
  if (prefersReducedMotion) return;

  const links = document.querySelectorAll('.nav-links a');
  links.forEach(link => {
    link.addEventListener('mouseenter', () => {
      link.style.color = 'var(--text-1)';
      link.style.textShadow = '0 0 20px rgba(198,134,46,.3)';
    });
    link.addEventListener('mouseleave', () => {
      link.style.textShadow = '';
      if (!link.classList.contains('active')) {
        link.style.color = '';
      }
    });
  });
}

/* ══════════════════════════════════════════════════════════
   PRELOADER → PAGE transition wipe
   ══════════════════════════════════════════════════════════ */
function initPageLoadWipe() {
  if (prefersReducedMotion) return;
  if (typeof gsap === 'undefined') return;

  // After preloader hides, briefly animate body
  document.getElementById('preloader')?.addEventListener('transitionend', () => {
    gsap.from('main', {
      opacity: 0,
      duration: 0.4,
      ease: 'none'
    });
  }, { once: true });
}

/* ══════════════════════════════════════════════════════════
   INIT — All systems go
   ══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // Core animations
  initPreloader();
  initParallax();

  // Interaction effects
  initParticleTrail();
  initClickRipple();
  initCardTilt();
  initTextScramble();
  initMagneticNavLinks();
  initNavHoverGlow();

  // Scroll-based
  initCounterAnimation();
  initStaggerObserver();
  initSectionLabelScramble();
  initSmoothScrollFeel();

  // GSAP effects run slightly after content is rendered
  requestAnimationFrame(() => {
    setTimeout(initGSAPScrollEffects, 100);
  });

  // Page wipe after preloader
  initPageLoadWipe();
});

// Re-init tilt + effects after dynamic content renders
document.addEventListener('workPanelRendered', () => {
  initCardTilt();
});
