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
      quote: "אברהם היקר, תודה על מפגש מרפא של ממש. עדיין קשה לי לעכל. מרגיש שהתגברתי על הרגלים או פחדים של שנות חיים. והכל באופן הפשוט ביותר ולכאורה טריויאלי. תודה על לימוד שפה חדשה, שכל אחד חייב להכיר."
    },
    {
      quote: "אתה מהיחידים שהרגשתי בנוח להיפתח ולדבר גלוי ורציני ככה. ושוב תודה לך, כי תשובות כאלה וסבלנות לא מוצא אצל כל אחד"
    },
    {
      quote: "אחרי הטיפול השלישי שלנו, חשבתי על המצב שהגעתי אליך ועל איך שאני עכשיו. אמנם יש עוד עבודה . אבל שהייתי מטופל על ידי פסיכולוג לא ראיתי שינויים בכלל גם אחרי 3 חודשים שהייתי מקפיד ללכת. אז אחי אני ממש מודה לך ושיהיה ראש חודש טוב ומבורך !"
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
  }

  function renderTestimonials() {
    testimonialsContainer.innerHTML = testimonialsData.map((testimonial, index) => {
      return `
        <div class="testimonial-card" data-index="${index}">
          <p class="testimonial-text">"${testimonial.quote}"</p>
        </div>
      `;
    }).join('');
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

  function navigateToTestimonial(index) {
    currentIndex = index;
    updateActiveElements();
    scrollToCurrentCard();
    resetAutoScroll();
  }

  function navigatePrev() {
    currentIndex = (currentIndex - 1 + testimonialsData.length) % testimonialsData.length;
    updateActiveElements();
    scrollToCurrentCard();
    resetAutoScroll();
  }

  function navigateNext() {
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
  }

  init();
});
