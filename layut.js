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
  const observer = new IntersectionObserver(function (entries, observer) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // Stop observing after it's visible
      }
    });
  }, observerOptions);

  const elementsToAnimate = document.querySelectorAll(".animate-on-scroll");
  elementsToAnimate.forEach((el) => observer.observe(el));
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
          const messageElement = result.querySelector(
            ".success-message, .error-message"
          );
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

// === Testimonials Carousel (User-Provided Logic) ===
document.addEventListener("DOMContentLoaded", function () {
  const testimonialsData = [
    {
      type: 'video',
      src: "media/feedbacks/WhatsApp Video 2025-11-06 at 00.43.30.mp4",
      alt: "Video testimonial"
    },
    {
      type: 'image',
      src: "media/feedbacks/WhatsApp Image 2025-11-05 at 00.18.04.jpeg",
      alt: "A screenshot of a testimonial."
    },
    {
      type: 'image',
      src: "media/feedbacks/WhatsApp Image 2025-11-05 at 00.18.05.jpeg",
      alt: "A screenshot of a testimonial."
    },
    {
      type: 'image',
      src: "media/feedbacks/WhatsApp Image 2025-11-05 at 00.21.10.jpeg",
      alt: "A screenshot of a testimonial."
    },
    {
      type: 'image',
      src: "media/feedbacks/WhatsApp Image 2025-11-10 at 21.50.54.jpeg",
      alt: "A screenshot of a testimonial."
    }
  ];

  // DOM Elements
  const testimonialsContainer = document.getElementById('testimonialsContainer');
  const navDots = document.getElementById('navDots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (!testimonialsContainer) return;

  let currentIndex = 0;
  let autoScrollInterval;
  const autoScrollDelay = 8000; // 8 seconds

  function init() {
    renderTestimonials();
    renderNavigationDots();
    updateActiveElements();
    startAutoScroll();
    setupEventListeners();
    setupLazyLoading(); // Add this call
  }

  function renderTestimonials() {
    testimonialsContainer.innerHTML = testimonialsData.map((testimonial, index) => {
      if (testimonial.type === 'video') {
        return `
          <div class="testimonial-card" data-index="${index}">
            <video controls preload="metadata" class="testimonial-image" title="${testimonial.alt}">
              <source data-src="${testimonial.src}" type="video/mp4">
              Your browser does not support the video tag.
            </video>
          </div>
        `;
      } else {
        // Add a placeholder for lazy loading, e.g., a transparent pixel
        return `
          <div class="testimonial-card" data-index="${index}">
            <img data-src="${testimonial.src}" alt="${testimonial.alt}" class="testimonial-image" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7">
          </div>
        `;
      }
    }).join('');
  }

  function setupLazyLoading() {
    const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const card = entry.target;
          const img = card.querySelector('img[data-src]');
          const video = card.querySelector('video');

          if (img) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          } else if (video) {
            const source = video.querySelector('source[data-src]');
            if (source) {
              source.src = source.dataset.src;
              source.removeAttribute('data-src');
              video.load();
            }
          }
          observer.unobserve(card);
        }
      });
    }, { root: testimonialsContainer, rootMargin: "0px 200px 0px 200px" }); // Pre-load media 200px before they are visible

    document.querySelectorAll('.testimonial-card').forEach(card => {
      lazyLoadObserver.observe(card);
    });
  }

  function renderNavigationDots() {
    navDots.innerHTML = testimonialsData.map((_, index) => {
      return `<div class="dot" data-index="${index}"></div>`;
    }).join('');

    navDots.querySelectorAll('.dot').forEach(dot => {
      dot.addEventListener('click', () => {
        navigateToTestimonial(parseInt(dot.dataset.index));
      });
    });
  }

  function updateActiveElements() {
    // Update active card
    document.querySelectorAll('.testimonial-card').forEach((card, index) => {
      if (index === currentIndex) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    // Update active dot
    document.querySelectorAll('.dot').forEach((dot, index) => {
      if (index === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function scrollToCurrentCard() {
    const cards = document.querySelectorAll('.testimonial-card');
    if (cards[currentIndex]) {
      const card = cards[currentIndex];
      const container = testimonialsContainer;
      // Calculate the scroll position to center the card
      const scrollPosition = card.offsetLeft - (container.offsetWidth / 2) + (card.offsetWidth / 2);

      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth',
      });
    }
  }

  function pauseCurrentVideo() {
    const currentCard = document.querySelector(`.testimonial-card[data-index="${currentIndex}"]`);
    if (currentCard) {
      const video = currentCard.querySelector('video');
      if (video && !video.paused) {
        video.pause();
      }
    }
  }

  function navigateToTestimonial(index) {
    pauseCurrentVideo();
    currentIndex = index;
    updateActiveElements();
    scrollToCurrentCard();
    resetAutoScroll();
  }

  function navigatePrev() {
    pauseCurrentVideo();
    currentIndex = (currentIndex - 1 + testimonialsData.length) % testimonialsData.length;
    updateActiveElements();
    scrollToCurrentCard();
    resetAutoScroll();
  }

  function navigateNext() {
    pauseCurrentVideo();
    currentIndex = (currentIndex + 1) % testimonialsData.length;
    updateActiveElements();
    scrollToCurrentCard();
    resetAutoScroll();
  }

  function startAutoScroll() {
    clearInterval(autoScrollInterval);
    autoScrollInterval = setInterval(navigateNext, autoScrollDelay);
  }

  function resetAutoScroll() {
    clearInterval(autoScrollInterval);
    startAutoScroll();
  }

  function setupEventListeners() {
    prevBtn.addEventListener('click', navigatePrev);
    nextBtn.addEventListener('click', navigateNext);

    testimonialsContainer.addEventListener('mouseenter', () => clearInterval(autoScrollInterval));
    testimonialsContainer.addEventListener('mouseleave', startAutoScroll);

    // Use event delegation for video events since videos are lazy-loaded
    testimonialsContainer.addEventListener('play', (e) => {
        if (e.target.tagName === 'VIDEO') {
            clearInterval(autoScrollInterval);
        }
    }, true);

    testimonialsContainer.addEventListener('pause', (e) => {
        if (e.target.tagName === 'VIDEO') {
            resetAutoScroll();
        }
    }, true);

    testimonialsContainer.addEventListener('ended', (e) => {
        if (e.target.tagName === 'VIDEO') {
            resetAutoScroll();
        }
    }, true);


    setupTouchEvents(); // Add this line
  }

  // New function for touch events
  function setupTouchEvents() {
    let touchStartX = 0;
    let touchEndX = 0;

    testimonialsContainer.addEventListener('touchstart', function(event) {
      touchStartX = event.changedTouches[0].screenX;
    }, { passive: true });

    testimonialsContainer.addEventListener('touchend', function(event) {
      touchEndX = event.changedTouches[0].screenX;
      handleSwipe();
    });

    function handleSwipe() {
      const swipeThreshold = 50; // Minimum distance for a swipe
      if (touchStartX - touchEndX > swipeThreshold) {
        // Swiped left
        navigateNext();
      } else if (touchEndX - touchStartX > swipeThreshold) {
        // Swiped right
        navigatePrev();
      }
    }
  }

  init();
});

// === WhatsApp Button Visibility ===
document.addEventListener("DOMContentLoaded", function () {
  const whatsappButton = document.querySelector('.whatsapp-contact');
  const heroSection = document.querySelector('.hero');

  if (!whatsappButton || !heroSection) {
    return;
  }

  const observerOptions = {
    rootMargin: '0px',
    threshold: 0.1 // A small threshold
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      // If hero is NOT intersecting (is off-screen), show the button.
      if (!entry.isIntersecting) {
        whatsappButton.classList.add('visible');
      } else {
        whatsappButton.classList.remove('visible');
      }
    });
  }, observerOptions);

  // Start observing the hero section
  observer.observe(heroSection);
});
document.addEventListener("DOMContentLoaded", function () {
  const whiteEntryCss = document.getElementById("white-entry-css");
  const whiteSvg = document.getElementById("white-svg");

  if (whiteEntryCss && whiteSvg) {
    // Enable the CSS file
    whiteEntryCss.removeAttribute("disabled");

    // Add the 'active' class to the SVG after a longer delay
    setTimeout(() => {
      whiteSvg.classList.add("active");
    }, 2000);
  }
});
