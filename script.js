(() => {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#mobile-nav");
  if (toggle && nav) {
    const closeMenu = () => {
      nav.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation");
    };
    toggle.addEventListener("click", () => {
      const willOpen = nav.hidden;
      nav.hidden = !willOpen;
      toggle.setAttribute("aria-expanded", String(willOpen));
      toggle.setAttribute("aria-label", willOpen ? "Close navigation" : "Open navigation");
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        closeMenu();
        toggle.focus();
      }
    });
    document.addEventListener("click", event => {
      if (!nav.hidden && !nav.contains(event.target) && !toggle.contains(event.target)) closeMenu();
    });
  }
  const year = document.querySelector("#year");
  if (year) year.textContent = String(new Date().getFullYear());
})();