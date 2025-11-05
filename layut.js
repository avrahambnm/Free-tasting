
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

document.addEventListener('DOMContentLoaded', function() {
const track = document.querySelector('.testimonials-track');
const cards = document.querySelectorAll('.testimonial-card');
const leftBtn = document.querySelector('.arrow-btn.left-4');
const rightBtn = document.querySelector('.arrow-btn.right-4');
let index = 0;
let interval;


function updateSlide() {
track.style.transform = `translateX(${-index * 100}%)`;
cards.forEach((card, i) => {
card.classList.toggle('active', i === index);
});
}


function nextSlide() {
index = (index + 1) % cards.length;
updateSlide();
}


function prevSlide() {
index = (index - 1 + cards.length) % cards.length;
updateSlide();
}


function startAutoScroll() {
interval = setInterval(nextSlide, 5000);
}


function stopAutoScroll() {
clearInterval(interval);
}


rightBtn.addEventListener('click', nextSlide);
leftBtn.addEventListener('click', prevSlide);


// עצירה כאשר העכבר נמצא על ה-track או כרטיס
track.addEventListener('mouseenter', stopAutoScroll);
track.addEventListener('mouseleave', startAutoScroll);


startAutoScroll();
updateSlide();
});
