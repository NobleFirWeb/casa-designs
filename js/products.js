gsap.registerPlugin(CustomEase, Flip); // Make sure SplitText is registered here too

document.addEventListener("DOMContentLoaded", () => {
  CustomEase.create(
    "hop",
    "M0,0 C0.355,0.022 0.448,0.079 0.5,0.5 0.542,0.846 0.615,1 1,1 ",
  );

  CustomEase.create(
    "hop2",
    "M0,0 C0.078,0.617 0.114,0.716 0.255,0.828 0.373,0.922 0.561,1 1,1 ",
  );

  const splitH2 = new SplitType(".site-info h2", {
    types: "lines",
  });

  splitH2.lines.forEach((line) => {
    const text = line.textContent;
    const wrapper = document.createElement("div");
    wrapper.className = "line";
    const span = document.createElement("span");
    span.textContent = text;
    wrapper.appendChild(span);
    line.parentNode.replaceChild(wrapper, line);
  });

  gsap.set("header", { y: 40, opacity: 0 });

  const mainTl = gsap.timeline();
  const revealerTl = gsap.timeline();
  const scaleTl = gsap.timeline();

  revealerTl
    .to(".r-1", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      duration: 1.5,
      ease: "hop",
    })
    .to(
      ".r-2",
      {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        duration: 1.5,
        ease: "hop",
      },
      "<",
    );

    

  scaleTl.to(".img:first-child", {
    scale: 1,
    duration: 2,
    ease: "power4.inOut",
  });

  const images = document.querySelectorAll(".img:not(:first-child)");

  images.forEach((img, index) => {
    scaleTl.to(
      img,
      {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "power3.out",
      },
      ">-0.5",
    );
  });

  mainTl
    .add(revealerTl)
    .add(scaleTl, "-=1.25")
    .add(() => {
      document
        .querySelectorAll(".img:not(.main)")
        .forEach((img) => img.remove());

      const state = Flip.getState(".main");

      const imagesContainer = document.querySelector(".images");
      imagesContainer.classList.add("stacked-container");

      document.querySelectorAll(".main").forEach((img, i) => {
        img.classList.add("stacked");
        img.style.order = i;
        gsap.set(".img.stacked", {
          clearProps: "transform, top, left",
        });
      });

      return Flip.from(state, {
        duration: 2,
        ease: "hop",
        absolute: true,
        stagger: {
          amount: -0.3,
        },
      });
    })
    .to(".word h1, .line p, .site-info h2 .line span", {
      y: 0,
      duration: 3,
      ease: "hop2",
      stagger: 0.1,
      delay: 1.25,
    })
    .to("header", { 
        y: 0,
        opacity: 1,
        duration: 3,
        ease: "hop2"
    }, "<")
    .to(".cover-img", {
      clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
      duration: 2,
      ease: "hop",
      delay: -4.75,
    })
    .to(".revealers", { zIndex: "-1",  });
});

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

/**
 * HOMEPAGE HERO MASK ANIMATION
 */
function initHeroMaskAnimation() {
    // 1. Grab the element
    const maskText = document.querySelector(".mask-text");
    
    // 2. SAFEGUARD: If it doesn't exist on this page, stop running the function
    if (!maskText) return; 

    // 3. Break it into characters so we can animate them one by one [cite: 138]
    const splitMask = new SplitText(maskText, { type: "chars" });
    
    // 4. Set the initial state and animate them up [cite: 135]
    gsap.from(splitMask.chars, {
        y: 80, // Pushes them down initially [cite: 140]
        opacity: 0,
        duration: 1,
        stagger: 0.1, // Animates the next letter 0.1s after the previous [cite: 139]
        ease: "power3.out",
        delay: 0.5 // Slight delay to let the page load
    });
}

/**
 * UPDATED SPLIT SLIDER ANIMATION (Multi-Section Support)
 */
function initSplitSlider() {
    // 1. Grab EVERY slider section on the page instead of just the first track
    const sliderSections = document.querySelectorAll('.split-slider-section');
    
    // SAFEGUARD: If no sliders are found, stop [cite: 154]
    if (!sliderSections.length) return; 

    sliderSections.forEach((section) => {
        // 2. Scope all queries to THIS specific section 
        const track = section.querySelector('.slider-track');
        const slides = section.querySelectorAll('.slide');
        const captions = section.querySelectorAll('.slide-caption');
        const prevBtn = section.querySelector('.prev-btn');
        const nextBtn = section.querySelector('.next-btn');
        
        if (!track || !nextBtn || !prevBtn) return;

        const totalSlides = slides.length; 
        let currentSlide = 0;
        let isAnimating = false;

        // Initialize captions for this specific section [cite: 158]
        gsap.set(captions, { y: 110, autoAlpha: 0 });

        function goToSlide(index) {
            if (isAnimating) return;
            isAnimating = true;

            // Reset old caption in this section [cite: 160]
            gsap.to(captions[currentSlide], { 
                y: 110, 
                autoAlpha: 0, 
                duration: 0.3 
            });

            currentSlide = index;

            // Move only the track in this section [cite: 161]
            gsap.to(track, {
                xPercent: -(10 * currentSlide), 
                duration: 0.8,
                ease: "power3.inOut",
                onComplete: () => {
                    isAnimating = false;
                }
            });

            // Reveal the new caption for this section [cite: 162]
            gsap.to(captions[currentSlide], {
                y: 0,
                autoAlpha: 1,
                duration: 0.6,
                delay: 0.4,
                ease: "back.out(1.5)"
            });
        }

        // Event Listeners for this section's buttons [cite: 163, 164]
        nextBtn.addEventListener('click', () => {
            let nextIndex = (currentSlide + 1) % totalSlides; 
            goToSlide(nextIndex);
        });

        prevBtn.addEventListener('click', () => {
            let prevIndex = (currentSlide - 1 + totalSlides) % totalSlides; 
            goToSlide(prevIndex);
        });

        // Fire initial caption animation for this specific section [cite: 165]
        gsap.to(captions[0], {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            delay: 0.2,
            ease: "back.out(1.5)"
        });
    });
}

/** * SMOOTH SCROLL INITIALIZATION (Lenis)
 */
function initSmoothScroll() {
    const lenis = new Lenis({
        duration: 1.2,        // Speed of the scroll (higher = smoother/slower)
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing function
        smoothWheel: true,    // Enable smooth scrolling for mouse wheel
        wheelMultiplier: 1,   // Adjust this to decrease/increase scroll speed
    });

    // Synchronize Lenis with GSAP's ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
}


// Ensure both functions are called when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initScrollTextReveal();
    initHeroMaskAnimation();
    initSplitSlider();
    initSmoothScroll();
});


