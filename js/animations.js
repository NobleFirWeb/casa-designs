

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

const words = ["Hello!", "Ciao!", "Hola!", "你好", "Bonjour!", "Guten Tag!"];
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


const toggle = document.querySelector('.dwk-burger__patty')
const logoBadge = document.querySelector('.logo-badge');
const darkSections = document.querySelectorAll('.results, .stats');

// 1. Handle the Reveal Animation on Scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 25) {
        logoBadge.classList.add('revealed');
    } else {
        logoBadge.classList.remove('revealed');
    }
});

// 2. Handle Color Switching (Red to White)
const colorObserverOptions = {
    root: null,
    threshold: 0.1, // Trigger when 10% of the section is visible
    rootMargin: "-10% 0px -90% 0px" // Adjusted to trigger when section hits the top
};

const colorObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            logoBadge.classList.add('is-white');
            toggle.classList.add('.is-white');
        } else {
            // Only remove if we aren't currently inside another dark section
            const stillInDark = Array.from(darkSections).some(section => {
                const rect = section.getBoundingClientRect();
                return rect.top <= 100 && rect.bottom >= 0;
            });
            if (!stillInDark) {
                logoBadge.classList.remove('is-white');
            }
        }
    });
}, colorObserverOptions);

darkSections.forEach(section => colorObserver.observe(section));