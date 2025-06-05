const toggle = document.getElementById("dropdownToggle");
const menu = document.getElementById("dropdownMenu");
const arrow = toggle.querySelector(".arrow");
const navbar = document.querySelector(".navbar");
const aboutSection = document.getElementById("about");
const heroSection = document.getElementById("hero");
const logoImg = document.querySelector(".navbar-logo");
const mobileNavbar = document.querySelector(".mobile-navbar");
const mobileLogo = document.querySelector(".mobile-logo");

// Handle dropdown toggle
toggle.addEventListener("click", (e) => {
    e.preventDefault();
    const isActive = menu.classList.toggle("active");
    arrow.classList.toggle("rotated");

    if (isActive) {
  navbar.classList.add("navbar--active");
  if (logoImg) {
    logoImg.src = logoImg.dataset.light;
  }
} else {
  if (!isScrolledPastAbout()) {
    navbar.classList.remove("navbar--active");
    if (logoImg) {
      logoImg.src = logoImg.dataset.dark;
    }
  }
}
});

// Close dropdown on outside click
document.addEventListener("click", (e) => {
    const clickedInside = menu.contains(e.target) || toggle.contains(e.target);

    if (!clickedInside) {
  menu.classList.remove("active");
  arrow.classList.remove("rotated");
}
});


// Mobile toggle
mobileToggle.addEventListener('click', () => {
  mobileToggle.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

// Handle scroll events
window.addEventListener("scroll", () => {
  const scrolledPastAbout = isScrolledPastAbout();
  const menuIsOpen = menu.classList.contains("active");
  const heroInView = window.scrollY > window.innerHeight * 0.99;

  // --- Sticky Behavior: Activate sticky nav (transparent) when hero is scrolled into view ---
  if (heroInView) {
    navbar.classList.add("sticky");
    mobileNavbar.classList.add("sticky");
  } else {
    navbar.classList.remove("sticky");
    mobileNavbar.classList.remove("sticky");
  }

  // --- Active Theme Switch: Only activate white background + light logo if past About or menu open ---
  if (scrolledPastAbout || menuIsOpen || heroInView) {
    navbar.classList.add("navbar--active");
    mobileNavbar.classList.add("navbar--active");

    if (logoImg) logoImg.src = logoImg.dataset.light;
    if (mobileLogo) mobileLogo.src = mobileLogo.dataset.light;
  } else {
    navbar.classList.remove("navbar--active");
    mobileNavbar.classList.remove("navbar--active");

    if (logoImg) logoImg.src = logoImg.dataset.dark;
    if (mobileLogo) mobileLogo.src = mobileLogo.dataset.dark;
  }
});

// Helper
function isScrolledPastAbout() {
  const aboutTop = aboutSection.getBoundingClientRect().top;
  return aboutTop <= 0;
}


// Close mobile menu on link click
const mobileNavLinks = document.querySelectorAll('.mobile-menu a');
mobileNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    mobileToggle.classList.remove('open');
  });
});

// Mobile Hero Scroll 
document.getElementById("mobileHeroScroll").addEventListener("click", () => {
  document.getElementById("about").scrollIntoView({ behavior: "smooth" });
});


//Mobile Menu Dropdown Toggles
const mobileDropdownToggle = document.querySelector('.mobile-dropdown .dropdown-toggle');
const mobileDropdown = document.querySelector('.mobile-dropdown');

mobileDropdownToggle.addEventListener('click', () => {
  mobileDropdown.classList.toggle('open');

});








