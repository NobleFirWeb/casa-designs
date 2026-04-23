

// Menu Logic
(function() {
  
  var Menu = (function() {
    var burger = document.querySelector('.dwk-burger');
    var menu = document.querySelector('.dwk-menu');
    var menuList = document.querySelector('.dwk-menu__list');
    var brand = document.querySelector('.dwk-menu__brand');
    var menuItems = document.querySelectorAll('.dwk-menu__item');
    
    var active = false;
    
    var toggleMenu = function() {
      if (!active) {
        menu.classList.add('dwk-menu--active');
        menuList.classList.add('dwk-menu__list--active');
        brand.classList.add('dwk-menu__brand--active');
        burger.classList.add('dwk-burger--close');
        for (var i = 0, ii = menuItems.length; i < ii; i++) {
          menuItems[i].classList.add('dwk-menu__item--active');
        }
        
        active = true;
      } else {
        menu.classList.remove('dwk-menu--active');
        menuList.classList.remove('dwk-menu__list--active');
        brand.classList.remove('dwk-menu__brand--active');
        burger.classList.remove('dwk-burger--close');
        for (var i = 0, ii = menuItems.length; i < ii; i++) {
          menuItems[i].classList.remove('dwk-menu__item--active');
        }
        
        active = false;
      }
    };
    
    var bindActions = function() {
      if(burger) {
          burger.addEventListener('click', toggleMenu, false);
      }
    };
    
    var init = function() {
      bindActions();
    };
    
    return {
      init: init
    };
    
  }());
  
  Menu.init();
  
}());

const words = ["Hello!", "Ciao!", "Hola!", "你好!", "Bonjour!", "Guten Tag!"];
let currentIndex = 0;
const textElement = document.getElementById("flip-text");

function flipText() {
    currentIndex = (currentIndex + 1) % words.length;
    const nextWord = words[currentIndex];

    // Create a timeline for the flip effect
    const tl = gsap.timeline();

    // Slide out the old text upwards and fade out
    tl.to(textElement, {
        y: -50,
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
            // Update text and reset position to bottom
            textElement.textContent = nextWord;
            gsap.set(textElement, { y: 50 });
        }
    });

    // Slide in the new text from bottom to center and fade in
    tl.to(textElement, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out"
    });
}

// Run the flip function every 1 second
setInterval(flipText, 1500);


// Remove your old toggle, logoBadge, and darkSections variables and replace with:
const header = document.querySelector('header');
// Ensure we use .stats-section, which matches your HTML
const darkSections = document.querySelectorAll('.results, .stats-section'); 

// Handle Color Switching (Dark to Light)
const colorObserverOptions = {
    root: null,
    threshold: 0,
    // Triggers when the section hits the top 10% of the viewport
    rootMargin: "-10% 0px -90% 0px" 
};

const colorObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            header.classList.add('theme-light');
        } else {
            // Only remove if we aren't currently inside another dark section
            const stillInDark = Array.from(darkSections).some(section => {
                const rect = section.getBoundingClientRect();
                const triggerLine = window.innerHeight * 0.1; // 10% from the top
                return rect.top <= triggerLine && rect.bottom >= triggerLine;
            });
            if (!stillInDark) {
                header.classList.remove('theme-light');
            }
        }
    });
}, colorObserverOptions);

darkSections.forEach(section => colorObserver.observe(section));

class CardSlider {
    constructor() {
        this.sliderList = document.querySelector('[data-slider="list"]');
        this.slides = document.querySelectorAll('.slider-slide');
        this.totalSlides = this.slides.length;
        this.currentSlide = 0;
        
        this.overlayCountStep = document.querySelector('[data-slide-count="step"]');
        this.overlayCountTotal = document.querySelector('[data-slide-count="total"]');
        this.nextButton = document.querySelector('[data-slider="button-next"]');
        this.prevButton = document.querySelector('[data-slider="button-prev"]');
        
        this.init();
    }

    init() {
        this.updateOverlayCount();
        this.nextButton?.addEventListener('click', () => this.nextSlide());
        this.prevButton?.addEventListener('click', () => this.prevSlide());
        
        // Initial setup
        this.updateActiveSlide();
        // Animate the first caption on page load
        this.animateCaption();
    }

    updateOverlayCount() {
        if (this.overlayCountStep) {
            this.overlayCountStep.textContent = (this.currentSlide + 1).toString().padStart(2, '0');
        }
        if (this.overlayCountTotal) {
            this.overlayCountTotal.textContent = this.totalSlides.toString().padStart(2, '0');
        }
    }

    updateActiveSlide() {
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.slides[this.currentSlide]?.classList.add('active');
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.performTransition();
    }

    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.performTransition();
    }

    performTransition() {
        this.updateOverlayCount();
        this.updateActiveSlide();
        this.animateSlideTransition();
        this.animateCaption(); // Trigger caption animation
    }

    animateCaption() {
        const activeCaption = this.slides[this.currentSlide].querySelector('.slide-caption');
        
        // 1. Immediately reset all captions to hidden/down state
        gsap.set('.slide-caption', { 
            opacity: 0, 
            y: 30 
        });

        // 2. Animate the active caption with a 0.5s delay
        if (activeCaption) {
            gsap.to(activeCaption, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                delay: 0.5, // The half-second wait you requested
                ease: "power2.out"
            });
        }
    }

    animateSlideTransition() {
        const slideWidth = this.slides[0].offsetWidth;
        const moveDistance = -(this.currentSlide * slideWidth);

        // Move the container
        gsap.to(this.sliderList, {
            x: moveDistance,
            duration: 0.8,
            ease: "power2.inOut"
        });

        // Dim non-active slides
        gsap.to(this.slides, {
            duration: 0.8,
            opacity: 0.3,
            ease: 'power2.out'
        });

        // Highlight active slide
        gsap.to(this.slides[this.currentSlide], {
            duration: 0.8,
            opacity: 1,
            ease: 'power2.out'
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CardSlider();
});

// --- Logo Text Scroll Reveal ---
const logoBadge = document.querySelector('.logo-badge');

window.addEventListener('scroll', () => {
    // If the user scrolls down more than 20 pixels, reveal the text
    if (window.scrollY > 20) {
        logoBadge.classList.add('revealed');
    } 
    // If they return to the top, hide it again
    else {
        logoBadge.classList.remove('revealed');
    }
});

// --- Accordion Logic ---
// --- Modern, Simplified Accordion Logic ---
const accordionHeaders = document.querySelectorAll('.accordion-header');

accordionHeaders.forEach(header => {
    header.addEventListener('click', function() {
        // Just toggle the active class. CSS handles the animation!
        this.classList.toggle('active');
    });
});