/* ============ Navbar ============ */

const navbar = document.getElementById("navbar");
const navToggle = document.getElementById("nav-toggle");
const navLinks = document.getElementById("nav-links");

function onScroll() {
  navbar.classList.toggle("scrolled", window.scrollY > 20);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

navToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  navToggle.classList.toggle("open", open);
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.classList.remove("open");
  });
});

/* ============ Download links ============ */

async function populateDownloadLinks() {
  const verTag = document.getElementById("version-tag");
  const btns = document.querySelectorAll(".btn[data-file]");
  try {
    const res = await fetch("https://api.github.com/repos/Fluffy-The-Penguin/watchAny-release/releases/latest");
    if (!res.ok) throw new Error("API error");
    const release = await res.json();
    const tag = release.tag_name;
    const ver = tag.slice(1);
    const base = `https://github.com/Fluffy-The-Penguin/watchAny-release/releases/download/${tag}/`;
    btns.forEach((btn) => {
      btn.href = base + btn.dataset.file.replace("{v}", ver);
    });
    if (verTag) verTag.textContent = `Latest: ${tag}`;
  } catch {
    btns.forEach((btn) => {
      if (btn.dataset.fallback) btn.href = btn.dataset.fallback;
      btn.textContent = "Check GitHub Releases";
      btn.classList.add("offline");
    });
    if (verTag) verTag.textContent = "Offline — check GitHub";
  }
}

populateDownloadLinks();

/* ============ Scroll animations ============ */

const animatedSelectors = ".logo, .title, .subtitle, .hero-actions, .hero-mockup, .section-title, .note, .card, .guide-step, .feature, .page-title, .page-subtitle, .req-item, .gallery-card, .gallery-section-title";

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay, 10) || 0;
        setTimeout(() => entry.target.classList.add("visible"), delay);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
);

document.querySelectorAll(animatedSelectors).forEach((el) => {
  if (
    el.classList.contains("section-title") ||
    el.classList.contains("note") ||
    el.classList.contains("page-title") ||
    el.classList.contains("page-subtitle") ||
    el.classList.contains("gallery-section-title")
  ) {
    const delay = parseInt(el.dataset.delay, 10) || 0;
    setTimeout(() => el.classList.add("visible"), delay + 300);
    return;
  }
  observer.observe(el);
});

/* ============ Screenshot carousel ============ */

const carousel = document.getElementById("screenshot-carousel");
if (carousel) {
  const slides = carousel.querySelectorAll(".carousel-slide");
  const dots = document.querySelectorAll(".carousel-dot");
  let current = 0;
  let interval;

  function goTo(index) {
    slides[current].classList.remove("active");
    dots[current].classList.remove("active");
    dots[current].setAttribute("aria-selected", "false");
    current = index;
    slides[current].classList.add("active");
    dots[current].classList.add("active");
    dots[current].setAttribute("aria-selected", "true");
  }

  function startAutoplay() {
    interval = setInterval(() => goTo((current + 1) % slides.length), 4000);
  }
  function stopAutoplay() { clearInterval(interval); }

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => { goTo(i); stopAutoplay(); startAutoplay(); });
  });

  carousel.addEventListener("mouseenter", stopAutoplay);
  carousel.addEventListener("mouseleave", startAutoplay);

  startAutoplay();
}

/* ============ Lightbox ============ */

const lightbox = document.createElement("div");
lightbox.className = "lightbox";
lightbox.setAttribute("role", "dialog");
lightbox.setAttribute("aria-label", "Image zoom");
lightbox.innerHTML = '<button class="lightbox-close" aria-label="Close">&times;</button><img class="lightbox-img" alt="">';
document.body.appendChild(lightbox);
const lightboxImg = lightbox.querySelector(".lightbox-img");

document.querySelectorAll(".gallery-card img").forEach((img) => {
  img.addEventListener("click", () => {
    lightboxImg.src = img.src;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  });
});

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox || e.target === lightboxImg) {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && lightbox.classList.contains("open")) {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  }
});
lightbox.querySelector(".lightbox-close").addEventListener("click", () => {
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
});

/* ============ Theme toggle ============ */

const themeBtn = document.getElementById("theme-toggle");
const themeHint = document.getElementById("theme-hint");

function getPreferredTheme() {
  const saved = localStorage.getItem("theme");
  if (saved) return saved;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  if (themeBtn) themeBtn.textContent = theme === "dark" ? "🌙" : "☀️";
  if (themeHint) themeHint.textContent = theme === "dark" ? "moon" : "sun";

  // Swap all -dark/-light images
  const suffix = theme === "dark" ? "dark" : "light";
  const other = theme === "dark" ? "light" : "dark";
  document.querySelectorAll("img[src$='-" + other + ".png'], img[src$='-" + other + ".jpg']").forEach((img) => {
    img.src = img.src.replace("-" + other + ".", "-" + suffix + ".");
  });
  // Also handle <source> inside <video>
  document.querySelectorAll("video source[src$='-" + other + ".png'], video source[src$='-" + other + ".jpg']").forEach((src) => {
    src.src = src.src.replace("-" + other + ".", "-" + suffix + ".");
  });
  // Update video poster
  document.querySelectorAll("video[poster]").forEach((video) => {
    if (video.poster.includes("-" + other + ".")) {
      video.poster = video.poster.replace("-" + other + ".", "-" + suffix + ".");
    }
  });
}

const currentTheme = getPreferredTheme();
setTheme(currentTheme);

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    setTheme(next);
  });
}

// Listen for system preference changes
window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", (e) => {
  if (!localStorage.getItem("theme")) {
    setTheme(e.matches ? "light" : "dark");
  }
});
