# Saurabh Giri Portfolio 2.0

**Cinematic personal portfolio** — Cybersecurity × Digital Forensics × Code × Design.

---

## Project Structure

```
Saurabh Giri Portfolio/
├── index.html              Main HTML shell
├── README.md               This file
│
├── css/
│   ├── tokens.css          Design tokens (colours, type, easing, spacing)
│   ├── base.css            Reset, utilities, accessibility
│   ├── layout.css          Containers, section shells, side nav
│   ├── components.css      All UI component styles
│   ├── animations.css      Keyframes, preloader, cursor, scroll reveal
│   └── responsive.css      Mobile / tablet breakpoints
│
├── js/
│   ├── data.js             ← YOUR CONTENT IS HERE (edit this file)
│   ├── main.js             Init, rendering, nav, scroll
│   ├── animations.js       Preloader, hero entrance, parallax, GSAP
│   ├── interactions.js     Custom cursor, magnetic buttons
│   └── contact.js          Contact form AJAX + button state machine
│
└── php/
    ├── config.php          ← YOUR EMAIL GOES HERE (fill before deploying)
    └── send_email.php      POST-only email handler
```

---

## Updating Your Content

**All personal information lives in one place: `js/data.js`**

Open that file and fill in:
- Your real project names, descriptions, and links
- Your certifications (title, issuer, date, credential ID, URL)
- Your photography captions
- Your email address (in `php/config.php`, not in data.js)
- Your LinkedIn and Facebook URLs
- Your future journey milestone

Anything labeled `PLACEHOLDER` needs to be replaced before you publish.

---

## Deploying

### Requirements

The site requires a **PHP-capable web server** to process contact form submissions.

Compatible with:
- Any standard shared hosting (cPanel, Namecheap, SiteGround, etc.)
- Apache or Nginx + PHP 7.4+
- Local development: XAMPP, WAMP, Laragon, or `php -S localhost:8000`

> **Note:** Opening `index.html` directly in a browser (via `file://`) works for the visual experience, but the contact form will not send emails without a PHP server.

### Steps

1. **Fill in your email** — open `php/config.php` and replace `YOUR_EMAIL_HERE` with your real email address.

2. **Update your domain** — in `index.html`, replace `REPLACE-WITH-DOMAIN.example` with your actual domain (in the canonical URL, OG tags, and JSON-LD).

3. **Update your content** — open `js/data.js` and replace all `PLACEHOLDER` entries with real information.

4. **Upload all files** to your hosting via FTP or Git deployment. The directory structure must be preserved.

5. **Test the contact form** by submitting a message and checking your inbox. Check your spam folder if it doesn't arrive — some shared hosts have strict spam filters.

---

## PHP Configuration

### Using PHP's native `mail()` (default)

Works out of the box on most shared hosting providers. No extra configuration needed beyond setting your email in `php/config.php`.

### Using SMTP (if `mail()` is blocked)

Some hosts (notably certain VPS or cloud environments) block PHP's `mail()` function. To use SMTP:

1. Install [PHPMailer](https://github.com/PHPMailer/PHPMailer) via Composer:
   ```bash
   composer require phpmailer/phpmailer
   ```

2. In `php/config.php`, set:
   ```php
   $use_smtp  = true;
   $smtp_host = 'smtp.gmail.com';   // or your host's SMTP
   $smtp_port = 587;
   $smtp_user = 'your@email.com';   // PLACEHOLDER
   $smtp_pass = 'your-app-password'; // PLACEHOLDER
   ```

3. In `php/send_email.php`, uncomment the PHPMailer block (clearly marked in the file).

> ⚠️ **Never commit real SMTP credentials to a public repository.**

---

## Security Notes

- `php/config.php` should be added to `.gitignore` before committing to any public repository.
- The contact form includes: honeypot anti-spam, session-based rate limiting, server-side validation, header injection prevention.
- The PHP endpoint returns only generic success/failure messages to the visitor — no server details are exposed.

---

## Customization

### Colours & Typography

All visual tokens are in `css/tokens.css`. Change the accent colour (`--accent`), background (`--bg`), or fonts there.

### Animations

- To disable the preloader: remove `<div id="preloader">` from `index.html`.
- To disable the custom cursor: remove `#cursor-dot` and `#cursor-ring` from `index.html`.
- GSAP is loaded from CDN. If you want to self-host it, download from [gsap.com](https://gsap.com) and update the script paths.

---

## Browser Support

Tested in: Chrome 120+, Edge 120+, Firefox 120+, Safari 17+

Graceful degradation for:
- Reduced motion (`prefers-reduced-motion: reduce`) — all animations suppressed
- Touch devices — custom cursor disabled, magnetic buttons disabled
- No JavaScript — content visible; animations and filter system require JS

---

Built with vanilla HTML, CSS, and JavaScript. No frameworks. No build step required.
