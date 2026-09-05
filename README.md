# Saurabh Giri — Personal Portfolio

[![Live Site](https://img.shields.io/badge/Live-girisaurabh.com.np-d4af37?style=for-the-badge&logo=googlechrome&logoColor=white)](https://girisaurabh.com.np)
[![License](https://img.shields.io/badge/License-MIT-blue.style=for-the-badge)](LICENSE)

A high-performance, cinematic personal portfolio built for **Cybersecurity**, **Digital Forensics**, **Software Engineering**, and **Design**.

---

## ✨ Features

- 🎭 **Cinematic Aesthetics**: Modern dark mode with gold accent tokens, smooth glassmorphism, and custom typography.
- ⚡ **Interactive Motion**: Powered by GSAP & ScrollTrigger for fluid scroll animations, parallax effects, and magnetic buttons.
- 🎯 **Dynamic Content**: Decoupled content architecture — update all projects, skills, and certifications directly inside `js/data.js`.
- 📬 **Formspree Integration**: Contact form powered by Formspree AJAX, complete with live field validation and state handling.
- 📱 **Fully Responsive**: Flawless experience across mobile, tablet, and ultra-wide displays with touch-aware interactions.
- 🚀 **Zero Build Step**: Built with 100% Vanilla HTML5, CSS3 (CSS Variables & Tokens), and ES6+ JavaScript.

---

## 📁 Project Structure

```text
Saurabh Giri Portfolio/
├── index.html              # Main HTML5 document
├── README.md               # Documentation
│
├── css/
│   ├── tokens.css          # Color tokens, typography, easing, & variables
│   ├── base.css            # Reset, global utility classes, & accessibility
│   ├── layout.css          # Grid systems, containers, header, & side nav
│   ├── components.css      # UI components (cards, badges, modals, form)
│   ├── animations.css      # Keyframes, custom cursor, & preloader
│   └── responsive.css      # Mobile, tablet, & high-res breakpoints
│
└── js/
    ├── data.js             # 👈 Edit portfolio content here
    ├── main.js             # Core initialization & component rendering
    ├── animations.js       # Preloader, entrance triggers, & GSAP scroll timelines
    ├── interactions.js     # Custom magnetic cursor & interactive dynamics
    └── contact.js          # Formspree contact form handler & validation
```

---

## 🛠️ Customization

### 1. Update Portfolio Content
All personal bio information, projects, certifications, and links are organized in [`js/data.js`](file:///c:/Users/HP/Documents/Saurabh%20Giri%20Portfolio/js/data.js). Simply modify the fields in `data.js` to update:
- Personal Bio & Skills
- Projects (Titles, descriptions, tech stack tags, demo/repo links)
- Certifications & Education
- Social Media Links (GitHub, LinkedIn, Facebook, etc.)

### 2. Contact Form Setup
The contact form uses [Formspree](https://formspree.io) for backend-less email submission.
- Form endpoint URL: Defined in [`js/contact.js`](file:///c:/Users/HP/Documents/Saurabh%20Giri%20Portfolio/js/contact.js) (`FORMSPREE_URL`).
- Form submission handles validation, loading states, success feedback, and error recovery cleanly.

### 3. Styling & Theme Tokens
Visual design tokens (colors, font families, margins, border radii) are centralized in [`css/tokens.css`](file:///c:/Users/HP/Documents/Saurabh%20Giri%20Portfolio/css/tokens.css).

---

## 🌐 Deployment

This site is deployed to Cloudflare Pages & GitHub Pages pointing to the custom domain **[girisaurabh.com.np](https://girisaurabh.com.np)**.

### Local Development
No build pipeline or node modules needed! To run locally:
1. Clone the repository:
   ```bash
   git clone https://github.com/saurabbbb/Portfolio-Website-main.git
   ```
2. Open `index.html` directly in your browser or run a simple local web server:
   ```bash
   python -m http.server 8000
   ```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Crafted with precision by <strong>Saurabh Giri</strong>
</p>
