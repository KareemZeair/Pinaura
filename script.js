const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = [...document.querySelectorAll("[data-nav-link]")];
const sections = [...document.querySelectorAll("[data-section]")];
const revealItems = [...document.querySelectorAll(".reveal")];
const form = document.querySelector("[data-contact-form]");
const formMessage = document.querySelector("[data-form-message]");
const hero = document.querySelector(".hero");
const heroBg = document.querySelector(".hero-bg");

let parallaxTicking = false;

function setHeaderState() {
  header.classList.toggle("scrolled", window.scrollY > 24);
}

function closeNav() {
  nav.classList.remove("open");
  header.classList.remove("nav-open");
  document.body.classList.remove("nav-open");

  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open navigation");
}

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");

  header.classList.toggle("nav-open", isOpen);
  document.body.classList.toggle("nav-open", isOpen);

  navToggle.setAttribute(
      "aria-expanded",
      String(isOpen)
  );

  navToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation"
  );
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeNav);
});

/* =========================
   SCROLL REVEAL
========================= */

const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("visible");

        revealObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18
    }
);

revealItems.forEach((item) => {
  revealObserver.observe(item);
});

/* =========================
   ACTIVE NAV SECTION
========================= */

const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        navLinks.forEach((link) => {
          link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      });
    },
    {
      rootMargin: "-38% 0px -52% 0px",
      threshold: 0
    }
);

sections.forEach((section) => {
  sectionObserver.observe(section);
});

/* =========================
   CONTACT FORM
========================= */

if (form) {
  form.addEventListener("submit", (event) => {
    const formData = new FormData(form);
    const accessKey = formData.get("access_key");

    if (accessKey === "YOUR_WEB3FORMS_ACCESS_KEY") {
      event.preventDefault();

      formMessage.textContent =
          "Form setup needed: replace YOUR_WEB3FORMS_ACCESS_KEY before launch.";

      formMessage.style.color = "#9b7640";

      return;
    }

    formMessage.textContent = "Sending...";
  });
}

/* =========================
   PARALLAX
========================= */

/*
  This is intentionally subtle.

  As the hero scrolls upward, the background moves
  at roughly 18% of the hero's movement.

  The background is oversized in CSS, so the movement
  never exposes empty edges.
*/

/* =========================
   PARALLAX
========================= */

function updateParallax() {
  if (!hero || !heroBg) {
    parallaxTicking = false;
    return;
  }

  const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    heroBg.style.transform = "scale(1.12)";
    parallaxTicking = false;
    return;
  }

  const rect = hero.getBoundingClientRect();
  const viewportHeight = window.innerHeight;

  // How far the hero has moved through the viewport.
  const progress = -rect.top / viewportHeight;

  // Move background slower than the page.
  const y = progress * -180;

  heroBg.style.transform =
      `translate3d(0, ${y}px, 0) scale(1.12)`;

  parallaxTicking = false;
}

function requestParallaxUpdate() {
  if (parallaxTicking) {
    return;
  }

  parallaxTicking = true;
  requestAnimationFrame(updateParallax);
}

window.addEventListener(
    "scroll",
    () => {
      setHeaderState();
      requestParallaxUpdate();
    },
    {
      passive: true
    }
);

window.addEventListener(
    "resize",
    requestParallaxUpdate
);

setHeaderState();
requestParallaxUpdate();