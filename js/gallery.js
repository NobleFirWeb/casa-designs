// Ensure plugins are registered
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Initialize the Pinning for each section
    const gallerySections = document.querySelectorAll('.gallery-section');

    // Only run pinning on desktop (matches our CSS media query logic)
    let mm = gsap.matchMedia();

    mm.add("(min-width: 1025px)", () => {
        gallerySections.forEach((section) => {
            const leftContent = section.querySelector('.pinned-content');
            const rightContent = section.querySelector('.gallery-right');

            ScrollTrigger.create({
                trigger: section,
                start: "top top 2.5%", // Adjust this to sit right below your fixed header
                end: () => `bottom 65%`, // Unpins when the bottom of the section hits the bottom of the viewport
                pin: leftContent,
                pinSpacing: false, // Prevents GSAP from adding extra padding
                invalidateOnRefresh: true, // Recalculates on window resize
            });
        });
    });

    // 2. Optional: Add a subtle entry animation for the images as you scroll
    const images = gsap.utils.toArray('.img-wrapper');
    
    images.forEach((img) => {
        gsap.from(img, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: img,
                start: "top 85%", // Triggers when image enters bottom 15% of screen
                toggleActions: "play none none none"
            }
        });
    });
});