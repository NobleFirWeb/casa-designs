gsap.registerPlugin(TextPlugin);

document.addEventListener("DOMContentLoaded", () => {
    const titleElement = document.querySelector(".hero-title");
    const imageWrapper = document.querySelector(".hero-image-wrapper");
    
    const originalText = titleElement.textContent;
    titleElement.textContent = "";

    // Set initial state for the image so it starts invisible and offset
    gsap.set(imageWrapper, { opacity: 0, x: 150 });

    const tl = gsap.timeline({ delay: 0.2 });

    // 1. Typewriter effect
    tl.to(titleElement, {
        duration: 1.2, 
        text: originalText,
        ease: "none", 
    }, 0); // '0' ensures this starts at the beginning of the timeline

    // 2. Image Slide & Fade (Runs simultaneously with the text)
    tl.to(imageWrapper, {
        duration: 1.25,
        opacity: 1,
        delay: 1.1, // Slight delay to sync with the text animation
        x: 0,
        ease: "power2.out"
    }, 0); // '0' matches this to the start of the typewriter effect

    // 3. Cursor Setup
    gsap.set(titleElement, { 
        borderRight: "4px solid #000", 
        paddingRight: "10px" 
    }); 
    
    gsap.to(titleElement, {
        borderRightColor: "transparent",
        duration: 0.8,
        ease: "steps(1)", 
        repeat: -1 
    });
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
