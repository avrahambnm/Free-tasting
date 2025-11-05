
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              primary: "#4F46E5",
              secondary: "#7C3AED",
            },
            borderRadius: {
              none: "0px",
              sm: "4px",
              DEFAULT: "8px",
              md: "12px",
              lg: "16px",
              xl: "20px",
              "2xl": "24px",
              "3xl": "32px",
              full: "9999px",
              button: "8px",
            },
            fontFamily: {
              hebrew: ["Heebo", "sans-serif"],
            },
          },
        },
      };

// === Scroll Animations ===
document.addEventListener("DOMContentLoaded", function () {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  const fadeElements = document.querySelectorAll(".fade-in");
  fadeElements.forEach((el) => observer.observe(el));
});

// === Form Handling ===
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  if (!form) return; // מונע שגיאות אם אין טופס

  const result = document.getElementById("result");
  const submitButton = form.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.textContent;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const fullname = document.getElementById("fullname").value;
    const phone = document.getElementById("phone").value;

    submitButton.classList.add("loading");
    submitButton.textContent = "";
    submitButton.disabled = true;
    result.innerHTML = "";

    try {
      const response = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullname, email, phone }),
      });

      const data = await response.json();

      setTimeout(() => {
        submitButton.classList.remove("loading");
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;

        if (response.ok) {
          result.innerHTML = `
              <div class="success-message">
                  <div class="flex items-center justify-center mb-2">
                      <i class="ri-check-circle-fill text-2xl ml-2 w-6 h-6 flex items-center justify-center"></i>
                      <span class="font-semibold">נרשמתם בהצלחה!</span>
                  </div>
                  <p>הסרטונים נשלחו למייל שלכם. בדקו גם בתיקיית הספאם.</p>
              </div>
          `;
          form.reset();
        } else {
          result.innerHTML = `
              <div class="error-message">
                  <div class="flex items-center justify-center mb-2">
                      <i class="ri-error-warning-fill text-2xl ml-2 w-6 h-6 flex items-center justify-center"></i>
                      <span class="font-semibold">שגיאה</span>
                  </div>
                  <p>${data.error || "אירעה שגיאה, אנא נסו שוב"}</p>
              </div>
          `;
        }

        setTimeout(() => {
          const messageElement = result.querySelector(".success-message, .error-message");
          if (messageElement) messageElement.classList.add("show");
        }, 100);
      }, 1500);
    } catch (err) {
      setTimeout(() => {
        submitButton.classList.remove("loading");
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;

        result.innerHTML = `
            <div class="error-message">
                <div class="flex items-center justify-center mb-2">
                    <i class="ri-wifi-off-line text-2xl ml-2 w-6 h-6 flex items-center justify-center"></i>
                    <span class="font-semibold">שגיאת רשת</span>
                </div>
                <p>בדקו את החיבור לאינטרנט ונסו שוב</p>
            </div>
        `;

        setTimeout(() => {
          const messageElement = result.querySelector(".error-message");
          if (messageElement) messageElement.classList.add("show");
        }, 100);
      }, 1500);
    }
  });
});

// === Smooth Scroll Effects ===
document.addEventListener("DOMContentLoaded", function () {
  let ticking = false;

  function updateScrollEffects() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    const header = document.querySelector("header");
    if (header) header.style.transform = `translateY(${rate}px)`;
    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateScrollEffects);
      ticking = true;
    }
  }

  window.addEventListener("scroll", requestTick);
});

const testimonials = [
  {
    id: 1,
    quote:
      'The epitome of excellence in service delivery. Their attention to detail and commitment to perfection mirrors our own standards at Rothschild & Co. The strategic insights provided have been invaluable to our private wealth division.',
    name: 'Eleanor Van der Linden',
    title: 'Managing Director, Rothschild & Co',
    avatar:
      'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop&crop=faces',
    rating: 5
  },
  {
    id: 2,
    quote:
      'Working with their team has been nothing short of transformative for our luxury hospitality group. They understand the nuances of serving discerning clientele at the highest level. The results have exceeded our most ambitious projections.',
    name: 'Alexander Laurent',
    title: 'CEO, Auberge Resorts Collection',
    avatar:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=faces',
    rating: 5
  },
  {
    id: 3,
    quote:
      'In the world of haute horlogerie, precision and craftsmanship are paramount. Their approach to digital transformation for our brand maintained these values while bringing us into the modern era without compromising our heritage.',
    name: 'Claire Beaumont',
    title: 'Digital Director, Patek Philippe',
    avatar:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=faces',
    rating: 5
  },
  {
    id: 4,
    quote:
      'The discretion and sophistication of their service matches what we expect from our most exclusive properties. Their team operates with the same level of professionalism we demand from our staff at The Ritz Paris.',
    name: 'Henri Delacroix',
    title: 'General Manager, The Ritz Paris',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces',
    rating: 5
  },
  {
    id: 5,
    quote:
      'As a family office managing ultra-high-net-worth individuals, we require partners who understand the need for absolute confidentiality alongside flawless execution. They have consistently delivered beyond our expectations.',
    name: 'Victoria Kensington',
    title: 'Principal, Windsor Family Office',
    avatar:
      'https://images.unsplash.com/photo-1619895862022-09114b41f16f?w=200&h=200&fit=crop&crop=faces',
    rating: 5
  },
];

// DOM Elements
const testimonialsContainer = document.getElementById('testimonialsContainer');
const navDots = document.getElementById('navDots');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// Configuration
let currentIndex = 0;
let autoScrollInterval;
const scrollSpeed = 400;
const autoScrollDelay = 10000; // 10 seconds

// Initialize
function initTestimonials() {
  renderTestimonials();
  renderNavigationDots();
  setActiveDot();
  startAutoScroll();
  setupEventListeners();
}

// Render Testimonials
function renderTestimonials() {
  testimonialsContainer.innerHTML = '';

  testimonials.forEach((testimonial, index) => {
    const testimonialElement = document.createElement('div');
    testimonialElement.className = `testimonial-card ${
      index === currentIndex ? 'active' : ''
    }`;
    testimonialElement.dataset.index = index;

    // Generate star rating
    const stars = Array(5)
      .fill(0)
      .map(
        (_, i) =>
          `<i class="star ${
            i < testimonial.rating ? 'filled fas fa-star' : 'far fa-star'
          }"></i>`
      )
      .join('');

    testimonialElement.innerHTML = `
    <div class="quote-icon">
    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 12C7 14.7614 9.23858 17 12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7V3C16.4183 3 20 6.58172 20 11C20 15.4183 16.4183 19 12 19C7.58172 19 4 15.4183 4 11H7Z" fill="currentColor"/>
    </svg>
</div>
<p class="testimonial-content">${testimonial.quote}</p>
<div class="client-info">
    <img src="${testimonial.avatar}" alt="${
testimonial.name
}" class="client-avatar">
    <div class="client-details">
        <h4>${testimonial.name}</h4>
        <p>${testimonial.title}</p>
        <div class="rating">${stars}</div>
    </div>
</div>
            `;

    testimonialsContainer.appendChild(testimonialElement);
  });

  // Center the active card
  scrollToCurrentCard();
}

// Render Navigation Dots
function renderNavigationDots() {
  navDots.innerHTML = '';

  testimonials.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.className = `dot ${index === currentIndex ? 'active' : ''}`;
    dot.dataset.index = index;
    dot.addEventListener('click', () => {
      navigateToTestimonial(index);
    });
    navDots.appendChild(dot);
  });
}

// Set Active Dot
function setActiveDot() {
  document.querySelectorAll('.dot').forEach((dot, index) => {
    if (index === currentIndex) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });

  document.querySelectorAll('.testimonial-card').forEach((card, index) => {
    if (index === currentIndex) {
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }
  });
}

// Navigation Functions
function navigateToTestimonial(index) {
  currentIndex = index;
  renderTestimonials();
  setActiveDot();
  resetAutoScroll();
}

function navigatePrev() {
  currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
  renderTestimonials();
  setActiveDot();
  resetAutoScroll();
}

function navigateNext() {
  currentIndex = (currentIndex + 1) % testimonials.length;
  renderTestimonials();
  setActiveDot();
  resetAutoScroll();
}

// Smooth scroll to current card
function scrollToCurrentCard() {
  const cards = document.querySelectorAll('.testimonial-card');
  if (cards[currentIndex]) {
    const card = cards[currentIndex];
    const container = testimonialsContainer;
    const cardWidth = card.offsetWidth;
    const scrollPosition =
      card.offsetLeft - container.offsetWidth / 2 + cardWidth / 2;

    container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth',
    });
  }
}

// Auto-scroll functionality
function startAutoScroll() {
  autoScrollInterval = setInterval(navigateNext, autoScrollDelay);
}

function resetAutoScroll() {
  clearInterval(autoScrollInterval);
  startAutoScroll();
}

// Event Listeners
function setupEventListeners() {
  prevBtn.addEventListener('click', navigatePrev);
  nextBtn.addEventListener('click', navigateNext);

  // Pause auto-scroll on hover
  testimonialsContainer.addEventListener('mouseenter', () => {
    clearInterval(autoScrollInterval);
  });

  testimonialsContainer.addEventListener('mouseleave', () => {
    resetAutoScroll();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      navigatePrev();
    } else if (e.key === 'ArrowRight') {
      navigateNext();
    }
  });

  // Swipe for touch devices
  let touchStartX = 0;
  let touchEndX = 0;

  testimonialsContainer.addEventListener(
    'touchstart',
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );

  testimonialsContainer.addEventListener(
    'touchend',
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    },
    { passive: true }
  );

  function handleSwipe() {
    const threshold = 50;
    if (touchEndX < touchStartX - threshold) {
      navigateNext();
    } else if (touchEndX > touchStartX + threshold) {
      navigatePrev();
    }
  }
}

// Initialize the component
document.addEventListener('DOMContentLoaded', initTestimonials);

