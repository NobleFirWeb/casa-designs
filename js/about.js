gsap.registerPlugin(TextPlugin);

document.addEventListener("DOMContentLoaded", () => {
    const titleElement = document.querySelector(".hero-subtext");
    
    const originalText = titleElement.textContent;
    titleElement.textContent = "";


    const tl = gsap.timeline({ delay: 0.2 });

    // 1. Typewriter effect
    tl.to(titleElement, {
        duration: 2.2, 
        text: originalText,
        ease: "none", 
    }, 0);
});


function adjustHeroViewBox() {
    const mask = document.querySelector('.mask-overlay');
    if (window.innerWidth < 768) {
        // Change to a taller coordinate system for mobile (1000x1200)
        mask.setAttribute('viewBox', '0 0 1000 1200');
    } else {
        // Back to landscape for desktop
        mask.setAttribute('viewBox', '0 0 1000 700');
    }
}

// Run on load and on resize
window.addEventListener('resize', adjustHeroViewBox);
window.addEventListener('load', adjustHeroViewBox);
