//Rise and Slide Animations
const animatedElements = document.querySelectorAll(
'[data-rise="true"], [slide-right="true"], [slide-left="true"]'
);

const observerOptions = {
  threshold: 0.25, // Trigger when 25% is visible
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
    if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // Trigger only once
    }
    });
}, observerOptions);

animatedElements.forEach((el) => observer.observe(el));

