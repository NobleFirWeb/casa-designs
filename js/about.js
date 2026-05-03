gsap.registerPlugin(TextPlugin);

document.addEventListener("DOMContentLoaded", () => {
    const titleElement = document.querySelector(".hero-subtext");
    
    const originalText = titleElement.textContent;
    titleElement.textContent = "";


    const tl = gsap.timeline({ delay: 1 });

    // 1. Typewriter effect
    tl.to(titleElement, {
        duration: 2.6, 
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


// Function to handle the Timeline Image Reveals
function initTimelineImageReveals() {
    // 1. Select all the images inside the timeline wrappers
    const timelineImages = gsap.utils.toArray('.products-timeline .timeline-image-wrapper img');

    // 2. Loop through each image to apply the animation
    timelineImages.forEach((img) => {
        
        // 3. Set the starting state: zoomed in and clipped to the left edge
        gsap.set(img, {
            clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)", // Hidden on the left
            scale: 1.2
        });

        // 4. Create the scroll-triggered animation
        gsap.to(img, {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", // Wipe to fully visible
            scale: 1, // Zoom out to normal size
            duration: 1.2, // 1.2 seconds feels smooth and premium
            ease: "power3.out", // A nice easing that starts fast and slows down
            scrollTrigger: {
                trigger: img.parentElement, // Trigger when the wrapper enters the screen
                start: "top 65%", // Start when the top of the image hits 60% down the screen
                toggleActions: "restart none none reverse" // Play once and leave it visible
            }
        });
    });
}

// 5. Initialize the animation when the page loads
window.addEventListener('load', () => {
    initTimelineImageReveals();
});


function initOwnerSectionAnimation() {
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".animation-wrapper",
            start: "top 10%", // Triggers just as the section enters full view
            once: true, // CRITICAL: This ensures the trigger fires only once and never reverses
            toggleActions: "play none none none" 
        }
    });

    // Phase 1: Expand the image from the centre to full screen
    tl.to('.image-mask', {
        clipPath: 'inset(0vh 0vw)',
        filter: 'brightness(0.8)',
        ease: "power2.inOut",
        duration: 0.5
    });

    // Color snap (Syncs exactly at the end of the image expansion)
    tl.to('.bg-text', {
        color: "#ffffff",
        ease: "none",
        duration: 0.1
    }, "-=0.1");

    // Phase 2: Slide the products up from below the screen
    // Note the "+=0.5" - This waits half a second before starting, replacing your empty buffer!
    tl.to('.product-item', {
        y: 0,
        stagger: 0.2,
        ease: "power3.out",
        duration: 0.75
    }, "+=0.5"); 

    // Phase 3: Text moving up and subtext fading in
    // Note the "+=0.5" to create a small pause before this final phase
    tl.to('.bg-text', {
        y: 30,
        ease: "power2.inOut",
        duration: 0.5
    }, "+=0.5");

    // Note the "<" - This tells GSAP to play this animation at the exact same time as the previous one
    tl.to('.bg-subtext', {
        y: -100,
        opacity: 1,
        ease: "power2.inOut",
        duration: 0.5
    }, "<"); 
}

window.addEventListener('load', () => {
    initOwnerSectionAnimation();
});

// Initialize the sticky pin for the testimonials section
