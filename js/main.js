/**
 * main.js — Saurabh Giri Portfolio 2.0
 * Core: theme, nav, scroll, active section tracking,
 * rendering all dynamic content from DATA.
 */

'use strict';

/* ── HELPERS ─────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* ══════════════════════════════════════════════════════════
   THEME
   ══════════════════════════════════════════════════════════ */
function initTheme() {
  const root = document.documentElement;
  const btn  = $('#themeToggle');

  // Default: auto (follows OS)
  root.classList.add('theme-auto');

  btn.addEventListener('click', () => {
    if (root.classList.contains('theme-light')) {
      root.classList.replace('theme-light', 'theme-auto');
      btn.setAttribute('aria-label', 'Switch to light theme');
      btn.textContent = '◐';
    } else {
      root.classList.replace('theme-auto', 'theme-light');
      btn.setAttribute('aria-label', 'Switch to dark theme');
      btn.textContent = '☀';
    }
  });
}

/* ══════════════════════════════════════════════════════════
   NAVIGATION
   ══════════════════════════════════════════════════════════ */
function initNav() {
  const nav       = $('.site-nav');
  const navLinks  = $('#navLinks');
  const toggle    = $('#navToggle');
  const close     = $('#navClose');
  const progress  = $('#navProgress');

  // Scrolled class for glassmorphic background
  const scrollHandler = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    // Scroll progress bar
    const el  = document.documentElement;
    const pct = el.scrollTop / (el.scrollHeight - el.clientHeight) * 100;
    progress.style.width = pct + '%';
  };
  window.addEventListener('scroll', scrollHandler, { passive: true });

  // Mobile menu open/close
  function openMenu() {
    navLinks.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    if (close) close.style.display = 'flex';
    document.body.classList.add('no-scroll');
  }
  function closeMenu() {
    navLinks.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    if (close) close.style.display = 'none';
    document.body.classList.remove('no-scroll');
  }

  toggle?.addEventListener('click', openMenu);
  close?.addEventListener('click', closeMenu);
  // Close on any nav link click
  $$('#navLinks a').forEach(a => a.addEventListener('click', closeMenu));
  // Close on ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) closeMenu();
  });
}

/* ══════════════════════════════════════════════════════════
   ACTIVE SECTION & SIDE NAV
   ══════════════════════════════════════════════════════════ */
function initActiveSections() {
  const sections = $$('main section[id]');
  const navAs    = $$('#navLinks a');
  const sideItems= $$('.side-nav-item');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const id = en.target.id;
      navAs.forEach(a =>
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`)
      );
      sideItems.forEach(el =>
        el.classList.toggle('active', el.dataset.section === id)
      );
    });
  }, { rootMargin: '-40% 0px -40% 0px' });

  sections.forEach(s => obs.observe(s));
}

/* ══════════════════════════════════════════════════════════
   SCROLL REVEAL
   ══════════════════════════════════════════════════════════ */
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        obs.unobserve(en.target);
      }
    });
  }, { threshold: 0.06 });

  $$('.reveal, .reveal-left, .reveal-scale, .section-head').forEach(el => {
    // If already in viewport (e.g. page loaded scrolled, or small viewport),
    // add .in immediately so content never stays invisible.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('in');
    } else {
      obs.observe(el);
    }
  });
}


/* ══════════════════════════════════════════════════════════
   HERO CONTENT
   ══════════════════════════════════════════════════════════ */
function renderHero() {
  // Case tag
  $('#tagName').textContent = DATA.person.name.toUpperCase();
  $('#tagField').textContent = DATA.person.role.join(' / ').toUpperCase();

  // Hero heading with wrapped words for clip-path animation
  const [first, ...rest] = DATA.person.name.split(' ');
  const wrapWord = word => `<span class="hero-word"><span class="hero-word-inner">${word}</span></span>`;
  $('#heroName').innerHTML =
    `<span class="line">${wrapWord(first.toUpperCase())}</span>` +
    `<span class="line surname">${wrapWord(rest.join(' '))}</span>`;

  // Role row (accessible, screen-reader only)
  $('#heroRole').innerHTML = DATA.person.role.map((r, i) =>
    (i > 0 ? '<span class="x" aria-hidden="true">×</span>' : '') +
    `<span>${r}</span>`
  ).join(' ');

  // Statement
  $('#heroDesc').textContent = DATA.person.statement;
}

/* ── Typing Role Cycling ─────────────────────────────────── */
function initTypingRole() {
  const wordEl = $('#trWord');
  if (!wordEl) return;
  const roles = DATA.person.role;
  let roleIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let pauseTimer = null;

  const TYPE_SPEED   = 80;
  const DELETE_SPEED = 45;
  const PAUSE_AFTER  = 2000;
  const PAUSE_BEFORE = 400;

  function tick() {
    const current = roles[roleIdx];
    if (deleting) {
      charIdx--;
      wordEl.textContent = current.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        roleIdx  = (roleIdx + 1) % roles.length;
        pauseTimer = setTimeout(tick, PAUSE_BEFORE);
        return;
      }
      pauseTimer = setTimeout(tick, DELETE_SPEED);
    } else {
      charIdx++;
      wordEl.textContent = current.slice(0, charIdx);
      if (charIdx === current.length) {
        deleting = true;
        pauseTimer = setTimeout(tick, PAUSE_AFTER);
        return;
      }
      pauseTimer = setTimeout(tick, TYPE_SPEED);
    }
  }

  // Start after preloader hides
  setTimeout(tick, 1800);
}

/* ══════════════════════════════════════════════════════════
   ABOUT
   ══════════════════════════════════════════════════════════ */
function renderAbout() {
  // Pillars
  $('#pillars').innerHTML = DATA.pillars.map(p => `
    <div class="pillar reveal">
      <span class="pk">${p.k}</span>
      <div>
        <h4>${p.title}</h4>
        <p>${p.body}</p>
      </div>
    </div>
  `).join('');

  // Education
  $('#eduCard').innerHTML = DATA.education.map(e => `
    <p class="eyebrow" style="margin-bottom:12px;">Education</p>
    <h4>${e.programme}</h4>
    <p class="edu-institution">${e.institution}</p>
    ${e.note ? `<p class="placeholder-note">⚠ ${e.note}</p>` : ''}
  `).join('');
}

/* ══════════════════════════════════════════════════════════
   EXPERTISE BOARD
   ══════════════════════════════════════════════════════════ */

// Skill proficiency data: maps field id -> array of {name, pct}
const SKILL_LEVELS = {
  security:    [{ name: 'Cybersecurity Fundamentals', pct: 72 }, { name: 'Digital Forensics', pct: 68 }, { name: 'Evidence Analysis', pct: 60 }, { name: 'Threat Awareness', pct: 55 }],
  code:        [{ name: 'C / C++ (Terminal)', pct: 70 }, { name: 'Python (GUI)', pct: 65 }, { name: 'Game Loop Design', pct: 60 }],
  design:      [{ name: 'UI/UX Principles', pct: 75 }, { name: 'Adobe Photoshop', pct: 68 }, { name: 'Visual Systems', pct: 62 }],
  web:         [{ name: 'HTML / CSS', pct: 85 }, { name: 'JavaScript', pct: 72 }, { name: 'Responsive Layout', pct: 80 }]
};

function buildSkillBars(id) {
  const skills = SKILL_LEVELS[id] || [];
  if (!skills.length) return '';
  return `<div class="skill-bars">
    ${skills.map((s, i) => `
      <div class="skill-bar-item">
        <div class="skill-bar-meta">
          <span class="skill-bar-name">${s.name}</span>
          <span class="skill-bar-val">${s.pct}%</span>
        </div>
        <div class="skill-bar-track">
          <div class="skill-bar-fill" style="width:${s.pct}%" data-delay="${i * 120}"></div>
        </div>
      </div>
    `).join('')}
  </div>`;
}

function animateSkillBars(panel) {
  $$('.skill-bar-fill', panel).forEach(bar => {
    const delay = parseInt(bar.dataset.delay || 0, 10);
    setTimeout(() => bar.classList.add('in'), delay);
  });
}

function renderExpertise() {
  const board = $('#board');
  if (!board) return;

  function lookupProjectTitle(id) {
    const p = DATA.projects.find(x => x.id === id);
    if (p) return p.title;
    const c = DATA.certifications.find(x => x.id === id);
    if (c) return c.title;
    return id;
  }

  // Nodes
  const nodesHTML = DATA.expertise.map(f => `
    <button class="node" role="listitem" data-id="${f.id}"
            aria-expanded="false" aria-controls="panel-${f.id}">
      <span class="ntag">${f.tag}</span>
      <h3>${f.title}</h3>
      <span class="nhint">
        <span class="nplus" aria-hidden="true">+</span>
        ${f.tools.length} tools
      </span>
    </button>
  `).join('');

  // Panels (injected below nodes, repositioned by JS on click)
  const panelsHTML = DATA.expertise.map(f => `
    <div class="node-panel" id="panel-${f.id}" data-panel-for="${f.id}" aria-hidden="true">
      <div class="node-panel-inner">
        <div class="np-col">
          <h5>Tools &amp; Areas</h5>
          <div class="tool-chips">
            ${f.tools.map(t => `<span class="chip">${t}</span>`).join('')}
          </div>
          <p class="np-note">${f.note}</p>
          ${buildSkillBars(f.id)}
        </div>
        <div class="np-col">
          <h5>Related Work</h5>
          <div class="np-projects">
            ${f.projects.map(id => `
              <a href="#work" data-jump="${id}" tabindex="0">
                ${lookupProjectTitle(id)}
                <span class="np-arrow">→</span>
              </a>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `).join('');

  board.innerHTML = nodesHTML + panelsHTML;

  // Toggle logic
  $$('.node', board).forEach(node => {
    // Track mouse for radial shimmer
    node.addEventListener('mousemove', e => {
      const rect = node.getBoundingClientRect();
      node.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width * 100) + '%');
      node.style.setProperty('--my', ((e.clientY - rect.top) / rect.height * 100) + '%');
    });

    node.addEventListener('click', () => {
      const id = node.dataset.id;
      const panel = $(`#panel-${id}`);
      const wasOpen = panel.classList.contains('open');

      // Close all
      $$('.node-panel', board).forEach(p => {
        p.classList.remove('open');
        p.setAttribute('aria-hidden', 'true');
      });
      $$('.node', board).forEach(n => n.setAttribute('aria-expanded', 'false'));

      if (!wasOpen) {
        // Move panel right after this node for clean grid flow
        node.insertAdjacentElement('afterend', panel);
        panel.classList.add('open');
        panel.setAttribute('aria-hidden', 'false');
        node.setAttribute('aria-expanded', 'true');
        // Animate skill bars after panel opens
        setTimeout(() => animateSkillBars(panel), 80);
      }
    });
  });

  // Jump from expertise to filtered work section
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-jump]');
    if (!a) return;
    const id  = a.dataset.jump;
    const proj = DATA.projects.find(p => p.id === id);
    const cert = DATA.certifications.find(c => c.id === id);
    const cat  = proj ? proj.category : (cert ? 'certifications' : 'all');
    const btn  = $(`.filter-btn[data-cat="${cat}"]`);
    if (btn) btn.click();
  });
}

/* ══════════════════════════════════════════════════════════
   WORK — Filter + Project List + Photography + Certifications
   ══════════════════════════════════════════════════════════ */
const WORK_CATEGORIES = [
  { id: 'all',            label: 'All' },
  { id: 'websites',       label: 'Websites' },
  { id: 'games',          label: 'Games' },
  { id: 'photography',    label: 'Photography' },
  { id: 'certifications', label: 'Certifications' }
];

function renderWorkFilters() {
  const filters = $('#filters');
  if (!filters) return;
  filters.innerHTML = WORK_CATEGORIES.map((c, i) => `
    <button class="filter-btn" role="tab" aria-pressed="${i === 0}"
            data-cat="${c.id}">${c.label}</button>
  `).join('');

  $$('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.filter-btn').forEach(b => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
      renderWorkPanel(btn.dataset.cat);
    });
  });
}

function projectThumbHTML(p) {
  // GIF image → show directly with animated badge
  if (p.image && p.image.endsWith('.gif')) {
    return `<div class="cs-thumb-wrap">
      <img src="${p.image}" alt="${p.title} gameplay" class="cs-thumb-img cs-gif" loading="lazy">
      <span class="cs-thumb-badge" aria-hidden="true">GIF · Live</span>
    </div>`;
  }
  // Static image only
  if (p.image) {
    return `<div class="cs-thumb-wrap">
      <img src="${p.image}" alt="${p.title} screenshot" class="cs-thumb-img" loading="lazy">
    </div>`;
  }
  // Fallback: no image
  return `<div class="cs-thumb-ph" aria-hidden="true"></div>`;
}


function renderProjectList(list) {
  if (!list.length) {
    return `<p style="color:var(--text-3);font-family:var(--font-mono);font-size:13px;padding:40px 0;">No projects in this category yet.</p>`;
  }
  return `<div class="project-list" role="list">` +
    list.map((p, i) => `
      <div class="project-list-item" role="listitem"
           data-project="${p.id}" tabindex="0"
           aria-label="Open case study: ${p.title}"
           data-cursor-target="project">
        <div class="pli-num">${String(i + 1).padStart(2, '0')}</div>
        <div class="pli-body">
          <p class="pli-cat">${p.category}</p>
          <h3 class="pli-title">${p.title}</h3>
          <p class="pli-desc">${p.desc}</p>
          <div class="pli-tech">${p.tech.map(t => `<span class="chip">${t}</span>`).join('')}</div>
        </div>
        <div class="pli-meta">
          ${p.year ? `<div class="pli-meta-row"><span class="pli-meta-label">Year</span><span class="pli-meta-value">${p.year}</span></div>` : ''}
          <div class="pli-meta-row"><span class="pli-meta-label">Category</span><span class="pli-meta-value" style="text-transform:capitalize;">${p.category}</span></div>
          ${p.link ? `<a href="${p.link}" target="_blank" rel="noopener" class="chip" style="align-self:flex-start;margin-top:4px;">View →</a>` : ''}
        </div>
        ${p.image ? `
        <div class="pli-thumb">
          <img src="${p.image}" alt="${p.title}" class="pli-thumb-img" loading="lazy">
        </div>` : ''}
      </div>
    `).join('') + `</div>`;
}

function renderPhotography() {
  return `<div class="photo-masonry">` +
    DATA.photos.map((ph, i) => `
      <div class="photo-item">
        <button data-photo-index="${i}" aria-label="Open photo ${i + 1}: ${ph.caption}">
          <div class="photo-ph-wrap" style="--ar:${ph.ar.replace('/', ' / ')};">
            <img
              src="${ph.src}"
              alt="${ph.caption}"
              class="photo-real-img"
              loading="lazy"
            >
            <div class="photo-overlay" aria-hidden="true">
              <span class="photo-overlay-icon">+</span>
            </div>
          </div>
          <p class="photo-caption">${ph.caption}</p>
        </button>
      </div>
    `).join('') + `</div>`;
}

function renderCertifications() {
  return `<div class="cred-grid">` +
    DATA.certifications.map(c => `
      <div class="cred-card">
        ${c.image ? `
        <div class="cred-img-wrap">
          <img src="${c.image}" alt="${c.title} certificate" class="cred-img" loading="lazy">
        </div>` : `<span class="cred-mark">SG</span>`}
        <div class="cred-info">
          <h4>${c.title}</h4>
          <p class="cred-issuer">${c.issuer}</p>
          <p class="cred-date">${c.date}${c.credId ? ' · ID ' + c.credId : ''}</p>
          ${c.url
            ? `<a href="${c.url}" target="_blank" rel="noopener" class="chip" style="align-self:flex-start;">Verify →</a>`
            : ''
          }
        </div>
      </div>
    `).join('') + `</div>`;
}

function renderWorkPanel(cat) {
  const panel = $('#workPanels');
  if (!panel) return;

  if (cat === 'photography') {
    panel.innerHTML = renderPhotography();
    bindLightbox();
    return;
  }
  if (cat === 'certifications') {
    panel.innerHTML = renderCertifications();
    return;
  }
  const list = cat === 'all'
    ? DATA.projects
    : DATA.projects.filter(p => p.category === cat);
  panel.innerHTML = renderProjectList(list);
  bindCaseStudy();
}

/* ══════════════════════════════════════════════════════════
   CASE STUDY PANEL
   ══════════════════════════════════════════════════════════ */
function bindCaseStudy() {
  const overlay = $('#caseStudyOverlay');
  const panel   = $('#caseStudyPanel');
  if (!overlay || !panel) return;

  function openCase(id) {
    const p = DATA.projects.find(x => x.id === id);
    if (!p) return;
    const body = $('body');
    overlay.setAttribute('aria-hidden', 'false');

    const inner = `
      <div class="cs-header">
        <div>
          <p class="eyebrow" style="margin-bottom:8px;">${p.category}</p>
          <h3>${p.title}</h3>
        </div>
        <button class="cs-close" id="csClose" aria-label="Close case study">✕</button>
      </div>
      <div class="cs-body">
        <div class="cs-thumb">${projectThumbHTML(p)}</div>
        ${p.problem ? `<div class="cs-section"><h5>The Problem</h5><p>${p.problem}</p></div>` : ''}
        ${p.approach ? `<div class="cs-section"><h5>The Approach</h5><p>${p.approach}</p></div>` : ''}
        ${p.contribution ? `<div class="cs-section"><h5>My Contribution</h5><p>${p.contribution}</p></div>` : ''}
        <div class="cs-section">
          <h5>Technology</h5>
          <div class="tool-chips" style="margin-top:8px;">
            ${p.tech.map(t => `<span class="chip">${t}</span>`).join('')}
          </div>
        </div>
        ${p.learning ? `<div class="cs-section"><h5>What I Learned</h5><p>${p.learning}</p></div>` : ''}
        ${p.category === 'games'
          ? `<div class="cs-section">
               <p class="cs-desktop-note" aria-label="Desktop only application">
                 🖥 <strong>Desktop application</strong> — runs locally on your machine, not in the browser.
               </p>
             </div>`
          : (p.link ? `
          <div class="cs-section">
            <a href="${p.link}" target="_blank" rel="noopener" class="btn btn-primary">
              View Project <span class="btn-arrow">→</span>
            </a>
          </div>
        ` : '')}
      </div>
    `;
    panel.innerHTML = inner;
    overlay.classList.add('open');
    body.classList.add('no-scroll');

    $('#csClose').addEventListener('click', closeCase);
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeCase();
    }, { once: true });
  }

  function closeCase() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeCase();
  });

  // Bind click on project list items
  $$('.project-list-item').forEach(item => {
    item.addEventListener('click', () => openCase(item.dataset.project));
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openCase(item.dataset.project);
      }
    });
  });
}

/* ══════════════════════════════════════════════════════════
   LIGHTBOX
   ══════════════════════════════════════════════════════════ */
let lbIndex = 0;

function openLightbox(i) {
  const lb = $('#lightbox');
  if (!lb) return;
  lbIndex = i;
  const ph = DATA.photos[i];
  $('#lbCap').textContent   = ph.caption;
  $('#lbCount').textContent = `${i + 1} / ${DATA.photos.length}`;

  // Show real image
  let lbImg = lb.querySelector('.lb-img');
  if (!lbImg) {
    lbImg = document.createElement('img');
    lbImg.className = 'lb-img';
    lbImg.alt = ph.caption;
    const lbInner = lb.querySelector('.lb-inner') || lb;
    lbInner.prepend(lbImg);
  }
  lbImg.src = ph.src;
  lbImg.alt = ph.caption;

  lb.classList.add('open');
  lb.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
  const closeBtn = lb.querySelector('#lbClose');
  if (closeBtn) closeBtn.focus();
}

function closeLightbox() {
  const lb = $('#lightbox');
  if (!lb) return;
  lb.classList.remove('open');
  lb.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
}

function bindLightbox() {
  const lb = $('#lightbox');
  if (!lb) return;

  $$('[data-photo-index]').forEach(btn =>
    btn.addEventListener('click', () => openLightbox(Number(btn.dataset.photoIndex)))
  );
  $('#lbClose').addEventListener('click', closeLightbox);
  $('#lbPrev').addEventListener('click', () =>
    openLightbox((lbIndex - 1 + DATA.photos.length) % DATA.photos.length)
  );
  $('#lbNext').addEventListener('click', () =>
    openLightbox((lbIndex + 1) % DATA.photos.length)
  );
  lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  $('#lbPrev').click();
    if (e.key === 'ArrowRight') $('#lbNext').click();
  });
}

/* ══════════════════════════════════════════════════════════
   JOURNEY
   ══════════════════════════════════════════════════════════ */
function renderJourney() {
  const container = $('#timeline');
  if (!container) return;

  container.innerHTML = `
    <div class="tl-items-col">
      ${DATA.journey.map((j, i) => `
        <div class="tl-item reveal reveal-delay-${Math.min(i + 1, 4)}" data-tl="${i}">
          <div class="tl-dot-wrap">
            <div class="tl-dot"></div>
          </div>
          <div class="tl-content">
            <span class="tl-when">${j.when}</span>
            <h4>${j.title}</h4>
            <p>${j.body}</p>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  // Animate dots on scroll
  const items = $$('.tl-item');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      en.target.classList.toggle('active', en.isIntersecting);
    });
  }, { threshold: 0.4 });
  items.forEach(el => obs.observe(el));

  // Animated SVG line that draws as user scrolls
  initTimelineLine(container);
}

function initTimelineLine(container) {
  // Wait for DOM paint
  requestAnimationFrame(() => {
    const col = container.querySelector('.tl-items-col');
    if (!col) return;
    const h = col.offsetHeight;
    if (!h) return;

    // Create SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('id', 'tl-line-svg');
    svg.setAttribute('width', '2');
    svg.setAttribute('height', h);
    svg.setAttribute('viewBox', `0 0 2 ${h}`);
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = `
      <line id="tl-line-track" x1="1" y1="0" x2="1" y2="${h}" />
      <line id="tl-line-progress" x1="1" y1="0" x2="1" y2="${h}"
            stroke-dasharray="${h}" stroke-dashoffset="${h}" />`;
    container.appendChild(svg);

    const progress = svg.querySelector('#tl-line-progress');

    function updateLine() {
      const rect  = container.getBoundingClientRect();
      const total = rect.height;
      const vis   = Math.max(0, Math.min(total, window.innerHeight - rect.top));
      const pct   = Math.min(1, vis / total);
      progress.style.strokeDashoffset = h * (1 - pct);
    }
    window.addEventListener('scroll', updateLine, { passive: true });
    updateLine();
  });
}

/* ══════════════════════════════════════════════════════════
   BEYOND
   ══════════════════════════════════════════════════════════ */
function renderBeyond() {
  const grid = $('#beyondGrid');
  if (!grid) return;
  grid.innerHTML = DATA.interests.map((it, i) => `
    <div class="beyond-card" style="--card-delay:${i * 80}ms">
      <span class="bc-num">${String(i + 1).padStart(2, '0')}</span>
      <div>
        <h4>${it.title}</h4>
        <p class="bc-body">${it.body}</p>
      </div>
      <span class="bc-icon" aria-hidden="true">${it.icon}</span>
    </div>
  `).join('');

  // 3D tilt effect on beyond cards
  initTiltCards();
}


function initTiltCards() {
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  if (isTouch || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  $$('.beyond-card').forEach(card => {
    const MAX_TILT = 8;
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) / (rect.width  / 2);
      const dy   = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `perspective(600px) rotateX(${-dy * MAX_TILT}deg) rotateY(${dx * MAX_TILT}deg) translateZ(8px)`;
      card.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width * 100) + '%');
      card.style.setProperty('--my', ((e.clientY - rect.top) / rect.height * 100) + '%');
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform .6s cubic-bezier(.34,1.56,.64,1), background .3s';
      setTimeout(() => { card.style.transition = ''; }, 600);
    });
  });
}

/* ══════════════════════════════════════════════════════════
   CONTACT LINKS
   ══════════════════════════════════════════════════════════ */
function renderContactLinks() {
  const el = $('#contactLinks');
  if (!el) return;

  const emailRow = DATA.email.placeholder
    ? `<div class="cl-row"><span>Email</span><span class="cl-handle">Add address — placeholder</span></div>`
    : `<a href="mailto:${DATA.email.address}" data-cursor-target="link">Email<span class="cl-handle">${DATA.email.address}</span></a>`;

  const socialRows = DATA.socials.map(s => s.placeholder
    ? `<div class="cl-row"><span>${s.label}</span><span class="cl-handle">${s.handle} — add URL</span></div>`
    : `<a href="${s.url}" target="_blank" rel="noopener" data-cursor-target="link">${s.label}<span class="cl-handle">${s.handle}</span></a>`
  ).join('');

  el.innerHTML = emailRow + socialRows;
}

/* ══════════════════════════════════════════════════════════
   FOOTER
   ══════════════════════════════════════════════════════════ */
function renderFooter() {
  const yr = $('#year');
  if (yr) yr.textContent = new Date().getFullYear();

  const stats = [
    { num: DATA.expertise.length,        suffix: '',  label: 'Disciplines' },
    { num: DATA.projects.length,         suffix: '+', label: 'Projects' },
    { num: DATA.journey.length,          suffix: '',  label: 'Milestones' },
    { num: DATA.interests.length,        suffix: '',  label: 'Interests' },
  ];

  const el = $('#footerStats');
  if (el) {
    el.innerHTML = stats.map(s => `
      <div class="footer-stat">
        <span class="footer-stat-num">${s.num}<span class="accent">${s.suffix}</span></span>
        <span class="footer-stat-label">${s.label}</span>
      </div>
    `).join('');
  }
}

/* ══════════════════════════════════════════════════════════
   HERO MOUSE SPOTLIGHT
   ══════════════════════════════════════════════════════════ */
function initHeroSpot() {
  const spot    = $('#heroSpot');
  const coordX  = $('#coordX');
  const coordY  = $('#coordY');
  if (!spot) return;
  window.addEventListener('pointermove', e => {
    if (e.pointerType === 'touch') return;
    spot.style.setProperty('--mx', e.clientX + 'px');
    spot.style.setProperty('--my', e.clientY + 'px');
    // Update forensic coordinates display
    if (coordX) coordX.textContent = 'X: ' + String(e.clientX.toFixed(0)).padStart(4, '0');
    if (coordY) coordY.textContent = 'Y: ' + String(e.clientY.toFixed(0)).padStart(4, '0');
  }, { passive: true });
}

/* ══════════════════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNav();
  renderHero();
  renderAbout();
  renderExpertise();
  renderWorkFilters();
  renderWorkPanel('all');
  renderJourney();
  renderBeyond();
  renderContactLinks();
  renderFooter();
  initHeroSpot();
  initTypingRole();
  // Reveal is triggered after all DOM is populated
  initReveal();
  initActiveSections();
});
