/**
 * GSAP CONFIGURATION & REGISTRATION
 */
gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * MAIN INITIALIZATION (Runs after page and assets load)
 */
window.addEventListener("load", () => {
    
    // 1. PROJECT GRID (SWAPPER) INITIALIZATION
    initProjectSwappers();

    // 2. CLOSING HEADER TEXT FILL
    const el = document.querySelector(".closing-header span");
    if (el) {
        const aboutText = new SplitText(el, { type: "words, chars" });

        gsap.fromTo(
            aboutText.chars,
            { color: "#ccc" }, // Start light gray
            {
                color: "#000", // End black
                stagger: 0.1,
                scrollTrigger: {
                    trigger: ".closing-header",
                    start: "top bottom",
                    end: "top 50%",
                    scrub: 1,
                    invalidateOnRefresh: true,
                },
            }
        );
    }

    // 3. INFINITE MARQUEE CAROUSEL
    const imagesContainer = document.querySelector(".images");
    if (imagesContainer) {
        const imageItems = gsap.utils.toArray(".image");

        const loop = horizontalLoop(imageItems, {
            repeat: -1,
            speed: 1,
            paddingRight: 10,
        });

        imagesContainer.addEventListener("mouseenter", () => {
            gsap.to(loop, { timeScale: 0, duration: 0.3, overwrite: true });
        });

        imagesContainer.addEventListener("mouseleave", () => {
            gsap.to(loop, { timeScale: 1, duration: 0.3, overwrite: true });
        });
    }

    // 4. QUOTE ANIMATION
    const quoteEl = document.querySelector("#quote");
    if (quoteEl) {
        gsap.set(quoteEl, { opacity: 1 });
        let mySplitText = new SplitText(quoteEl, { type: "chars, words" });

        gsap.from(mySplitText.chars, {
            duration: 2,
            opacity: 0,
            stagger: { from: "random", each: 0.01 },
            scrollTrigger: {
                trigger: quoteEl,
                start: "top 80%",
                toggleActions: "play none none none"
            }
        });
    }

    // 5. STATS COUNTER
    const counterTarget = document.getElementById("counter");
    if (counterTarget) {
        gsap.to(counterTarget, {
            innerText: 200,
            duration: 2.5,
            ease: "power2.out",
            snap: { innerText: 1 },
            scrollTrigger: {
                trigger: ".stats-section",
                start: "top 75%",
                toggleActions: "play none none none"
            }
        });
    }


    // 7. MEET THE OWNER PINNING ANIMATION
    const ownerContainer = document.querySelector(".owner-container");
    if (ownerContainer) {
        ScrollTrigger.create({
            trigger: ownerContainer,
            start: "top 75%",      // Pins when the container hits the top of the viewport
            end: "bottom 98%",  // Unpins when the bottom of the container hits the viewport bottom
            pin: ".owner-text-col",
            pinSpacing: false,     // Allows the right column images to scroll past naturally
            invalidateOnRefresh: true // Recalculates positions if the window is resized
        });
    }


    // 6. TEXT REVEAL (Professional masking logic)
    initScrollTextReveal();

    
});


/**
 * PROJECT SWAPPER COMPONENT LOGIC (Polyfill for CSS Scroll Timelines)
 */
function initProjectSwappers() {
    const projectRows = document.querySelectorAll('.project-row');
    if (!projectRows.length) return;

    projectRows.forEach((row) => {
        const swapper = row.querySelector('.swapper');
        const controller = row.querySelector('.controller');
        const imageBox = row.querySelector('.image-box');
        const caption = row.querySelector('.caption');
        const pinImg = row.querySelector('.pin-img');
        
        if (!swapper || !controller) return;

        // Create a Timeline for this specific row
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: pinImg,        // Use the row as the trigger
                start: "top 40%",    // Start when the row hits the top of the viewport
                end: "+=100%",       // Stay pinned for the duration of one viewport height
                scrub: true,         // Link animation to scroll
                pin: true,           // PIN the row so it stays on screen
                invalidateOnRefresh: true
            }
        });

        // 1. Slide the swapper
        tl.to(swapper, {
            y: () => controller.offsetHeight - swapper.offsetHeight,
            ease: "none"
        }, 0);

        // 2. Cross-fade the images
        const imgs = swapper.querySelectorAll('img');
        if (imgs.length >= 2) {
            tl.to(imgs[0], { opacity: 0, ease: "none" }, 0);
            tl.fromTo(imgs[1], { opacity: 0 }, { opacity: 1, ease: "none" }, 0);
        }

        // 3. Update Progress Bars
        const markers = swapper.querySelectorAll('.progress > div div');
        markers.forEach((marker, index) => {
            tl.to(marker, {
                height: '100%',
                ease: "none"
            }, index === 0 ? 0 : 0.5); // Stagger the progress bars
        });
    });
}

/**
 * HELPER FUNCTION: Seamless Horizontal Loop
 */
function horizontalLoop(items, config) {
    items = gsap.utils.toArray(items);
    config = config || {};
    let tl = gsap.timeline({
        repeat: config.repeat,
        paused: config.paused,
        defaults: { ease: "none" },
        onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100),
    }),
    length = items.length,
    startX = items[0].offsetLeft,
    times = [],
    widths = [],
    xPercents = [],
    pixelsPerSecond = (config.speed || 1) * 100,
    snap = config.snap === false ? (v) => v : gsap.utils.snap(config.snap || 1),
    totalWidth, i;

    gsap.set(items, {
        xPercent: (i, el) => {
            let w = (widths[i] = parseFloat(gsap.getProperty(el, "width", "px")));
            xPercents[i] = snap((parseFloat(gsap.getProperty(el, "x", "px")) / w) * 100 + gsap.getProperty(el, "xPercent"));
            return xPercents[i];
        },
    });

    gsap.set(items, { x: 0 });
    totalWidth = items[length - 1].offsetLeft + (xPercents[length - 1] / 100) * widths[length - 1] - startX + items[length - 1].offsetWidth * gsap.getProperty(items[length - 1], "scaleX") + (parseFloat(config.paddingRight) || 0);

    for (i = 0; i < length; i++) {
        let item = items[i];
        let curX = (xPercents[i] / 100) * widths[i];
        let distanceToStart = item.offsetLeft + curX - startX;
        let distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");

        tl.to(item, { xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100), duration: distanceToLoop / pixelsPerSecond }, 0)
          .fromTo(item, { xPercent: snap(((curX - distanceToLoop + totalWidth) / widths[i]) * 100) }, { xPercent: xPercents[i], duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond, immediateRender: false }, distanceToLoop / pixelsPerSecond);
    }
    tl.progress(1, true).progress(0, true);
    return tl;
}

/**
 * TEXT REVEAL SCRIPT
 */
function initScrollTextReveal() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const elements = document.querySelectorAll("[data-anm-scroll-text-reveal]");
    if (!elements.length) return;

    elements.forEach((element) => {
        const type = element.dataset.anmType || "lines";
        const typesToSplit = type === "lines" ? ["lines"] : type === "words" ? ["lines", "words"] : ["lines", "words", "chars"];

        SplitText.create(element, {
            type: typesToSplit.join(","),
            linesClass: "split-line",
            onSplit: function (instance) {
                const targets = instance[type];
                gsap.set(targets, { yPercent: 110, force3D: true });
                gsap.set(element, { autoAlpha: 1 });

                return gsap.to(targets, {
                    yPercent: 0,
                    duration: 0.8,
                    stagger: parseFloat(element.dataset.anmStagger) || 0.08,
                    ease: "expo.out",
                    scrollTrigger: {
                        trigger: element,
                        start: element.dataset.anmStart || "top 80%",
                        once: true,
                        invalidateOnRefresh: true,
                    },
                });
            },
        });
    });
}



const titles = gsap.utils.toArray('.slider .title');
const imgs = gsap.utils.toArray('.slider-img');

const handleImageAnimation = () => {
    
  titles.forEach((title, i) => {
    const img = imgs[i];
    
    const imgTl = gsap.timeline({
      scrollTrigger: {
        trigger: title,
        scrub: true,
        start: 'top 95%',
        end: 'top 5%',
      }
    });

    imgTl
      .fromTo(img, 
        { opacity: 0, scale: 0.7 }, 
        { opacity: 1, scale: 1, ease: 'none' }
      )
      .to(img, 
        { opacity: 0, scale: 1.05, ease: 'none' }
      );
  });
};

handleImageAnimation();

