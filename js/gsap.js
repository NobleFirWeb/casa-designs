/**
 * GSAP CONFIGURATION & REGISTRATION
 */
gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * MAIN INITIALIZATION (Runs after page and assets load)
 */
window.addEventListener("load", () => {
    


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
            gsap.to(loop, { timeScale: 0, duration: 0.2, overwrite: true });
        });

        imagesContainer.addEventListener("mouseleave", () => {
            gsap.to(loop, { timeScale: 1, duration: 0.2, overwrite: true });
        });
    }

    // 4. QUOTE ANIMATION
    const quoteEl = document.querySelector("#quote");
    if (quoteEl) {
        gsap.set(quoteEl, { opacity: 1 });
        let mySplitText = new SplitText(quoteEl, { type: "chars, words" });

        gsap.from(mySplitText.chars, {
            duration: 1,
            opacity: 0,
            stagger: { from: "random", each: 0.005 },
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
        // Initialize GSAP matchMedia
        let mm = gsap.matchMedia();

        // Only run the pin on screens larger than 1024px (Desktops)
        mm.add("(min-width: 1025px)", () => {
            ScrollTrigger.create({
                trigger: ownerContainer,
                start: "top 75%",     
                end: "bottom 98%",  
                pin: ".owner-text-col", // Pin the text column
                pinSpacing: false,     
                invalidateOnRefresh: true 
            });
        });
        
        // On screens smaller than 1024px, the pin is automatically killed!
    }


    // 6. TEXT REVEAL (Professional masking logic)
    initScrollTextReveal();

    
});




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
        { opacity: 0, scale: 0.5 }, 
        { opacity: 1, scale: 1, ease: 'none', }
      )
      .to(img, 
        { opacity: 0, scale: 1.05, ease: 'none' }
      );
  });
};

handleImageAnimation();

