/* global document, window */

const TRANSITION_MS = 300;

function setActiveNavLink(hash) {
  const links = Array.from(document.querySelectorAll(".nav__link"));
  links.forEach((a) => {
    const isActive = a.getAttribute("href") === hash;
    a.classList.toggle("is-active", isActive);
    a.setAttribute("aria-current", isActive ? "true" : null);
  });
}

function initActiveSectionObserver() {
  const sections = Array.from(document.querySelectorAll("main .section"));
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          if (id) setActiveNavLink(`#${id}`);
        }
      });
    },
    { root: null, rootMargin: "-20% 0px -60% 0px", threshold: 0.1 }
  );

  sections.forEach((s) => observer.observe(s));
}

function initYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = String(new Date().getFullYear());
}

function initCertificationFilters() {
  const chips = Array.from(document.querySelectorAll(".chip"));
  const certs = Array.from(document.querySelectorAll(".cert"));

  function applyFilter(filter, animate = false) {
    certs.forEach((c) => {
      const status = c.getAttribute("data-status");
      const show = filter === "all" ? true : status === filter;

      if (animate) {
        c.style.opacity = "0";
        c.style.transform = "translateY(8px)";
        c.style.transition = `opacity ${TRANSITION_MS}ms ease, transform ${TRANSITION_MS}ms ease`;

        setTimeout(() => {
          c.style.display = show ? "" : "none";
          if (show) {
            requestAnimationFrame(() => {
              c.style.opacity = "1";
              c.style.transform = "translateY(0)";
            });
          }
        }, TRANSITION_MS);
      } else {
        c.style.display = show ? "" : "none";
        c.style.opacity = "1";
        c.style.transform = "none";
      }
    });
  }

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => {
        c.classList.remove("is-active");
        c.setAttribute("aria-selected", "false");
      });
      chip.classList.add("is-active");
      chip.setAttribute("aria-selected", "true");

      const filter = chip.getAttribute("data-filter") || "all";
      applyFilter(filter, true);
    });
  });

  applyFilter("all", false);
}

function initNavClick() {
  const links = Array.from(document.querySelectorAll(".nav__link"));
  links.forEach((a) => {
    a.addEventListener("click", () => {
      const href = a.getAttribute("href");
      if (href && href.startsWith("#")) {
        setActiveNavLink(href);
      }
    });
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#") return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initYear();
  initNavClick();
  initCertificationFilters();
  initActiveSectionObserver();
  initSmoothScroll();

  if (window.location.hash) {
    setActiveNavLink(window.location.hash);
  }
});
