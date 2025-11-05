
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

// === Testimonials ===
document.addEventListener("DOMContentLoaded", function () {
  const testimonials = [
    {
      text: "הגעתי לטיפול עם המון ספקות וחששות, אבל מהר מאוד הרגשתי שאני במקום הנכון. התהליך היה עמוק, מרגש ובעיקר משנה חיים.",
      author: "יעל כהן",
    },
    {
      text: "לא האמנתי שאפשר לעשות שינוי כל כך משמעותי בזמן כל כך קצר. אני מרגיש אדם חדש, עם יותר ביטחון ושמחת חיים.",
      author: "דוד לוי",
    },
    {
      text: "תרפיית המימדים פתחה לי דלת לעולם חדש של אפשרויות. אני מודה על כל רגע בתהליך.",
      author: "שרה ישראלי",
    },
  ];

  const testimonialsContainer = document.querySelector(".testimonials-container");
  const dotsContainer = document.querySelector(".testimonial-dots");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");

  if (testimonials.length > 0) {
    testimonialsContainer.innerHTML = testimonials
      .map(
        (testimonial) => `
      <div class="testimonial-card">
        <p class="testimonial-text">"${testimonial.text}"</p>
        <p class="testimonial-author">- ${testimonial.author}</p>
      </div>
    `
      )
      .join("");

    dotsContainer.innerHTML = testimonials
      .map((_, i) => `<button class="dot ${i === 0 ? "active" : ""}"></button>`)
      .join("");

    const testimonialCards = document.querySelectorAll(".testimonial-card");
    const dots = document.querySelectorAll(".dot");
    let currentTestimonial = 0;
    let autoSlideInterval;

    function showTestimonial(index) {
      testimonialCards.forEach((testimonial, i) => {
        testimonial.classList.remove("active");
      });
      testimonialCards[index].classList.add("active");

      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
      });
      currentTestimonial = index;
    }

    function next() {
      const nextIndex = (currentTestimonial + 1) % testimonialCards.length;
      showTestimonial(nextIndex);
    }

    function prev() {
      const prevIndex = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
      showTestimonial(prevIndex);
    }

    function startAutoSlide() {
      autoSlideInterval = setInterval(next, 5000);
    }

    function stopAutoSlide() {
      clearInterval(autoSlideInterval);
    }

    nextBtn.addEventListener("click", () => {
      stopAutoSlide();
      next();
      startAutoSlide();
    });

    prevBtn.addEventListener("click", () => {
      stopAutoSlide();
      prev();
      startAutoSlide();
    });

    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        stopAutoSlide();
        showTestimonial(i);
        startAutoSlide();
      });
    });

    let touchStartX = 0;
    let touchEndX = 0;

    testimonialsContainer.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoSlide();
    });

    testimonialsContainer.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchEndX < touchStartX) {
        next();
      }
      if (touchEndX > touchStartX) {
        prev();
      }
      startAutoSlide();
    });

    showTestimonial(0);
    startAutoSlide();
  }
});

