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
  const btns = document.querySelectorAll(".btn[data-file]");
  try {
    const res = await fetch("https://api.github.com/repos/Fluffy-The-Penguin/watchAny-release/releases/latest");
    if (!res.ok) throw new Error("API error");
    const release = await res.json();
    const tag = release.tag_name;
    const base = `https://github.com/Fluffy-The-Penguin/watchAny-release/releases/download/${tag}/`;
    btns.forEach((btn) => {
      btn.href = base + btn.dataset.file + tag.slice(1) + ".exe";
    });
  } catch {
    btns.forEach((btn) => {
      btn.href = "#";
      btn.textContent = "Check GitHub Releases";
      btn.classList.add("offline");
    });
  }
}

populateDownloadLinks();

/* ============ Scroll animations ============ */

const animatedSelectors = ".logo, .title, .subtitle, .hero-actions, .section-title, .note, .card, .guide-step, .feature, .page-title, .page-subtitle, .req-item";

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
    el.classList.contains("page-subtitle")
  ) {
    const delay = parseInt(el.dataset.delay, 10) || 0;
    setTimeout(() => el.classList.add("visible"), delay + 300);
    return;
  }
  observer.observe(el);
});
