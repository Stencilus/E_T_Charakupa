/* global document, window */

function setActiveNavLink(hash) {
  const links = Array.from(document.querySelectorAll(".nav__link"));
  links.forEach((a) => {
    const isActive = a.getAttribute("href") === hash;
    a.classList.toggle("is-active", isActive);
  });
}

function initActiveSectionObserver() {
  const sections = Array.from(document.querySelectorAll("main .section"));
  const observer = new IntersectionObserver(
    (entries) => {
      // choose most visible section
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];

      if (!visible) return;
      const id = visible.target.getAttribute("id");
      if (id) setActiveNavLink(`#${id}`);
    },
    { root: null, rootMargin: "-25% 0px -60% 0px", threshold: [0.1, 0.2, 0.35, 0.5] },
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

  function applyFilter(filter) {
    certs.forEach((c) => {
      const status = c.getAttribute("data-status");
      const show = filter === "all" ? true : status === filter;
      c.style.display = show ? "" : "none";
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
      applyFilter(filter);
    });
  });

  applyFilter("all");
}

function initNavClick() {
  const links = Array.from(document.querySelectorAll(".nav__link"));
  links.forEach((a) => {
    a.addEventListener("click", () => {
      setActiveNavLink(a.getAttribute("href"));
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initYear();
  initNavClick();
  initCertificationFilters();
  initActiveSectionObserver();

  // If the page loads with a hash, sync active state.
  if (window.location.hash) setActiveNavLink(window.location.hash);
});

