gsap.registerPlugin(TextPlugin);

document.addEventListener("DOMContentLoaded", () => {
    const titleElement = document.querySelector(".hero-subtext");
    
    const originalText = titleElement.textContent;
    titleElement.textContent = "";


    const tl = gsap.timeline({ delay: 0.8 });

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