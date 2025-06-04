window.addEventListener("DOMContentLoaded", () => {
    const textEl = document.getElementById("loaderTitle");

    if (
    window.innerWidth < 1024 &&
    textEl &&
    textEl.textContent.includes("Casa Designs")
    ) {
    textEl.innerHTML = `
        <tspan x="50%" dy="-0.6em" dominant-baseline="middle">Casa</tspan>
        <tspan x="50%" dy="1em" dominant-baseline="middle">Designs</tspan>
    `;
    }
});

document.getElementById("scrollCue").addEventListener("click", () => {
    const heroSection = document.querySelector(".hero");
    if (heroSection) {
        heroSection.scrollIntoView({ behavior: "smooth" });
    }
});

const scrollTopBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {
    if (isScrolledPastAbout()) {
        scrollTopBtn.style.display = "flex";
    } else {
        scrollTopBtn.style.display = "none";
    }
});

scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
});
