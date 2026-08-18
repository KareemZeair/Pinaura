const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = [...document.querySelectorAll("[data-nav-link]")];
const sections = [...document.querySelectorAll("[data-section]")];
const revealItems = [...document.querySelectorAll(".reveal")];
const form = document.querySelector("[data-contact-form]");
const formMessage = document.querySelector("[data-form-message]");

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
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeNav);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-38% 0px -52% 0px", threshold: 0 }
);

sections.forEach((section) => sectionObserver.observe(section));

form.addEventListener("submit", (event) => {
  const formData = new FormData(form);
  const accessKey = formData.get("access_key");

  if (accessKey === "YOUR_WEB3FORMS_ACCESS_KEY") {
    event.preventDefault();
    formMessage.textContent = "Form setup needed: replace YOUR_WEB3FORMS_ACCESS_KEY before launch.";
    formMessage.style.color = "#9b7640";
    return;
  }

  formMessage.textContent = "Sending...";
});

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();
