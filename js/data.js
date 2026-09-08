/**
 * data.js — Saurabh Giri Portfolio 2.0
 * Centralized content and configuration source.
 * Edit information here — nowhere else.
 */
const DATA = {

  person: {
    name:      "Saurabh Giri",
    role:      ["Cybersecurity", "Digital Forensics", "Code", "Design"],
    statement: "I study how systems fail, then build the ones that shouldn't.",
    location:  "Kathmandu, Nepal",
    subtitle:  "Security × Forensics × Code × Design"
  },

  education: [
    {
      programme:   "Digital Forensics & Cybersecurity — Undergraduate",
      institution: "The British College",
      note: "Affiliated with the University of the West of England (UWE Bristol)."
    }
  ],

  pillars: [
    { k: "01", title: "Security",     body: "Precision. Assume nothing is safe until it has been tested." },
    { k: "02", title: "Forensics",    body: "Interpretation. Evidence only means something once it is read correctly." },
    { k: "03", title: "Development",  body: "Structure. Code is a system of promises the future has to keep." },
    { k: "04", title: "Design",       body: "Empathy. The best interface is the one nobody notices." }
  ],

  expertise: [
    {
      id:       "security",
      tag:      "Field 01",
      title:    "Security & Forensics",
      tools:    ["Cybersecurity fundamentals", "Digital Forensics", "Evidence handling", "Threat awareness"],
      note:     "The investigative half of the work — tracing how systems are used, misused, and understood after the fact.",
      projects: ["cert-1", "cert-2"]
    },
    {
      id:       "code",
      tag:      "Field 02",
      title:    "Programming",
      tools:    ["C++", "C", "Python", "Terminal / GUI"],
      note:     "Where logic gets tested against reality. The language changes; the discipline of writing correct, readable code does not.",
      projects: ["game-1", "game-2"]
    },
    {
      id:       "design",
      tag:      "Field 03",
      title:    "Design",
      tools:    ["UI/UX", "Adobe Photoshop"],
      note:     "Design is where the technical work becomes usable — reducing a system down to what a person actually needs to see.",
      projects: ["site-1"]
    },
    {
      id:       "web",
      tag:      "Field 04",
      title:    "Web Development",
      tools:    ["HTML/CSS", "JavaScript", "Responsive systems"],
      note:     "Turning static design into something that behaves — sites that respond, adapt, and hold up under real use.",
      projects: ["site-1", "site-2"]
    }
  ],

  projects: [
    {
      id:           "site-1",
      category:     "websites",
      year:         "2024",
      title:        "Full Moon — Academic Counseling Platform",
      desc:         "A professional website for an academic counseling service, helping students navigate admissions, scholarships, and study-abroad opportunities.",
      problem:      "Students in Nepal struggle to find reliable, centralized guidance for international education pathways. The client needed a credible online presence that builds trust quickly.",
      approach:     "Designed a clean, trust-forward layout with a strong hero CTA, service overview cards, and a contact form. Focused on readability and mobile responsiveness.",
      contribution: "End-to-end design and development — wireframes, visual design, HTML/CSS/JS implementation, and deployment.",
      learning:     "Real client work taught me that simplicity and clarity outperform visual complexity when the audience is making high-stakes decisions.",
      tech:         ["HTML", "CSS", "JavaScript"],
      image:        "projects/website 1.png",
      link:         null
    },
    {
      id:           "site-2",
      category:     "websites",
      year:         "2024",
      title:        "HelmetHaven Nepal — E-commerce Site",
      desc:         "An e-commerce storefront for a helmet retailer in Nepal, featuring a product showcase, search functionality, and shop layout.",
      problem:      "A local retailer needed an online presence to expand beyond foot-traffic sales. The site had to feel trustworthy and professional without a large budget.",
      approach:     "Built a dark-themed, product-first layout with a prominent banner, feature-highlight cards, and a clean nav structure. Prioritized product imagery and key USPs.",
      contribution: "Full design and front-end build. Structured the product grid and integrated a basic search experience.",
      learning:     "E-commerce UX is heavily about hierarchy — users scan, not read. Every design decision had to earn its pixel.",
      tech:         ["HTML", "CSS", "JavaScript"],
      image:        "projects/website 3.png",
      link:         null
    },
    {
      id:           "game-1",
      category:     "games",
      year:         "2024",
      title:        "RetroDodge — Python GUI Game",
      desc:         "A retro-styled GUI dodge game built in Python, where the player dodges incoming objects using keyboard controls.",
      problem:      "Wanted to move from terminal-only output to a real graphical window — learning how to manage a game loop, sprites, and collision in a GUI environment.",
      approach:     "Built with Python using a GUI/graphics library. Focused on smooth movement, increasing difficulty, and a readable score display.",
      contribution: "Full design and implementation — game loop, player movement, obstacle spawning, collision detection, and score system.",
      learning:     "GUI game development requires thinking in frames and events, not just sequential logic. A big mental shift from terminal programs.",
      tech:         ["Python", "GUI / Graphical"],
      image:        "projects/pythongame.gif",
      link:         null
    },
    {
      id:           "game-2",
      category:     "games",
      year:         "2024",
      title:        "Snake Game — C++ Terminal with Levels",
      desc:         "A fully playable terminal Snake game written in C++ with three difficulty levels, maze walls, enemy tiles, and WASD controls.",
      problem:      "Classic Snake is trivial to clone. The challenge was adding meaningful difficulty progression — mazes that required spatial reasoning, not just reaction speed.",
      approach:     "Implemented a level-select screen, three distinct maze layouts, and an enemy tile system that adds pressure without making the game feel unfair.",
      contribution: "Entire game design and implementation in C++ — game loop, rendering, input handling, collision detection, and level data.",
      learning:     "Terminal rendering constraints force you to think about state and refresh carefully. Taught me the value of separating game logic from rendering.",
      tech:         ["C++", "Terminal / Console"],
      image:        "projects/c++ game.gif",
      link:         null
    }
  ],

  photos: [
    { id: "p1", src: "projects/photography1.jpg", caption: "Rural life — Women carrying forage, Kathmandu Valley", ar: "3/4" },
    { id: "p2", src: "projects/photography2.jpg", caption: "Portrait — Black & white study of a child", ar: "1/1" },
    { id: "p3", src: "projects/photography3.jpg", caption: "Macro — Pink zinnia close-up against dark field", ar: "1/1" },
    { id: "p4", src: "projects/photography4.jpg", caption: "Selective colour — Green eye, monochrome background", ar: "4/3" }
  ],

  certifications: [
    {
      id:     "cert-1",
      title:  "Digital Forensics Essentials (DFE)",
      issuer: "EC-Council",
      date:   "09 Jul 2024",
      credId: "342677",
      image:  "projects/certificate1.png",
      url:    null
    },
    {
      id:     "cert-2",
      title:  "Ethical Hacking Essentials (EHE)",
      issuer: "EC-Council",
      date:   "04 Apr 2024",
      credId: "313209",
      image:  "projects/certificate2.png",
      url:    null
    }
  ],

  interests: [
    { title: "Futsal",       icon: "⚽", body: "Weekly game, mostly midfield." },
    { title: "Music",        icon: "🎵", body: "Listening across genres — a constant while working." },
    { title: "Swimming",     icon: "🌊", body: "Lap swimming for the reset it gives." },
    { title: "Gaming",       icon: "🎮", body: "Games as both hobby and design reference." },
    { title: "Basketball",   icon: "🏀", body: "Pickup games when there is a court free." },
    { title: "Photography",  icon: "📷", body: "Documenting places and moments outside a screen." }
  ],

  journey: [
    {
      when:  "In progress",
      title: "Digital Forensics & Cybersecurity, The British College",
      body:  "Undergraduate study focused on the investigative and technical side of security."
    },
    {
      when:  "Apr 2024",
      title: "Ethical Hacking Essentials — EC-Council",
      body:  "Certified in EHE (Certificate No. 313209), covering penetration testing concepts and ethical hacking methodology."
    },
    {
      when:  "Jul 2024",
      title: "Digital Forensics Essentials — EC-Council",
      body:  "Certified in DFE (Certificate No. 342677), covering evidence acquisition, analysis, and forensic investigation workflows."
    },
    {
      when:  "Ongoing",
      title: "Programming — C, C++, Python · Web Development · UI/UX",
      body:  "Building software projects, websites, and design systems in parallel with academic study."
    },
    {
      when:  "Next",
      title: "Internship / Advanced Certification",
      body:  "Targeting a security-focused internship or advanced EC-Council certification to deepen field experience."
    }
  ],

  socials: [
    { label: "GitHub",    handle: "@saurabbbb",   url: "https://github.com/saurabbbb",     placeholder: false },
    { label: "Instagram", handle: "@saurabbbb_",  url: "https://instagram.com/saurabbbb_", placeholder: false },
    { label: "LinkedIn",  handle: "Add profile",  url: "#",                                placeholder: true  }
  ],

  email: {
    address:     "grsauravis12@gmail.com",
    placeholder: false
  }
};
