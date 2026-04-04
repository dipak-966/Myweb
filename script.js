// ===== EMAILJS CONFIGURATION =====
// Step 1: Go to https://www.emailjs.com and create a FREE account
// Step 2: Create an Email Service (Gmail recommended) → copy Service ID
// Step 3: Create an Email Template → copy Template ID
// Step 4: Go to Account → copy your Public Key
// Step 5: Replace the values below with your actual IDs

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz2-I3t2aWh5Tkd6cmgPaLG6VFxQJhBGpJA67lFJgnO6aC28EJABWwoNDKOvwMe0PXD/exec";

// ===== SCROLL TO TOP =====
const scrollTopBtn = document.createElement("button");
scrollTopBtn.className = "scroll-top";
scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
document.body.appendChild(scrollTopBtn);
scrollTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 50);
  scrollTopBtn.classList.toggle("show", window.scrollY > 300);
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById("hamburger");
const navLinks  = document.getElementById("navLinks");
hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});
navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

// ===== FADE IN ANIMATION =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
}, { threshold: 0.1 });

document.querySelectorAll(".course-card, .why-card, .about-content, .about-img-wrap, .info-item, .contact-form-wrap, .gallery-item")
  .forEach(el => { el.classList.add("fade-in"); observer.observe(el); });

// ===== CONTACT FORM =====
const form      = document.getElementById("contactForm");
const submitBtn = document.getElementById("submitBtn");
const btnText   = document.getElementById("btnText");
const btnLoad   = document.getElementById("btnLoading");
const formMsg   = document.getElementById("formMsg");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name    = document.getElementById("name").value.trim();
  const phone   = document.getElementById("phone").value.trim();
  const email   = document.getElementById("email").value.trim();
  const course  = document.getElementById("course").value;
  const message = document.getElementById("message").value.trim();

  // Show loading
  btnText.style.display = "none";
  btnLoad.style.display = "inline-flex";
  submitBtn.disabled = true;
  formMsg.className = "form-message";
  formMsg.style.display = "none";

  fetch(SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify({
      type: "Contact Form",
      name, phone, email,
      course: course || "Not specified",
      message: message || "No message provided"
    })
  })
  .then(r => r.json())
  .then(() => {
    formMsg.textContent = "✅ Message sent successfully! We will contact you soon.";
    formMsg.className = "form-message success";
    formMsg.style.display = "block";
    form.reset();
  })
  .catch(() => {
    formMsg.textContent = "❌ Failed to send. Please call us directly.";
    formMsg.className = "form-message error";
    formMsg.style.display = "block";
  })
  .finally(() => {
    btnText.style.display = "inline-flex";
    btnLoad.style.display = "none";
    submitBtn.disabled = false;
  });
});

// ===== DEMO POPUP =====
const demoPopup   = document.getElementById("demoPopup");
const popupClose  = document.getElementById("popupClose");
const demoForm    = document.getElementById("demoForm");
const demoBtnText = document.getElementById("demoBtnText");
const demoBtnLoad = document.getElementById("demoBtnLoad");
const demoBtn     = document.getElementById("demoBtn");
const demoMsg     = document.getElementById("demoMsg");

function openPopup()  { demoPopup.classList.add("active"); }
function closePopup() { demoPopup.classList.remove("active"); }

popupClose.addEventListener("click", closePopup);
demoPopup.addEventListener("click", (e) => { if (e.target === demoPopup) closePopup(); });

// 10 second baad pehli baar
if (!localStorage.getItem("demoDone")) {
  setTimeout(() => {
    openPopup();
    // 30 second baad doosri baar — sirf agar form fill nahi kiya
    setTimeout(() => {
      if (!localStorage.getItem("demoDone")) openPopup();
    }, 30000);
  }, 10000);
}

demoForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const name  = document.getElementById("demoName").value.trim();
  const phone = document.getElementById("demoPhone").value.trim();

  if (!/^[0-9]{10}$/.test(phone)) {
    demoMsg.textContent = "⚠️ Please enter a valid 10-digit mobile number.";
    demoMsg.className = "form-message error";
    demoMsg.style.display = "block";
    return;
  }

  demoBtnText.style.display = "none";
  demoBtnLoad.style.display = "inline-flex";
  demoBtn.disabled = true;

  fetch(SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify({
      type: "Demo Booking",
      name, phone,
      email: "Not provided",
      course: "2-Day Free Demo Request",
      message: "Demo booking request from website popup."
    })
  })
  .then(r => r.json())
  .then(() => {
    demoMsg.textContent = "✅ Done! We'll call you soon.";
    demoMsg.className = "form-message success";
    localStorage.setItem("demoDone", "true");
    setTimeout(closePopup, 2000);
  })
  .catch(() => {
    demoMsg.textContent = "❌ Failed. Please call us directly.";
    demoMsg.className = "form-message error";
  })
  .finally(() => {
    demoBtnText.style.display = "inline-flex";
    demoBtnLoad.style.display = "none";
    demoBtn.disabled = false;
  });
});

// ===== GALLERY SLIDER =====
const track    = document.querySelector(".gallery-track");
const prevBtn  = document.getElementById("galleryPrev");
const nextBtn  = document.getElementById("galleryNext");
const dotsWrap = document.getElementById("galleryDots");
const perPage  = window.innerWidth <= 768 ? 1 : 3;
const total    = document.querySelectorAll(".gallery-item").length;
const pages    = Math.ceil(total / perPage);
let current    = 0;

for (let i = 0; i < pages; i++) {
  const d = document.createElement("span");
  d.className = "gallery-dot" + (i === 0 ? " active" : "");
  d.addEventListener("click", () => goTo(i));
  dotsWrap.appendChild(d);
}

function goTo(page) {
  current = page;
  const sliderWidth = track.parentElement.offsetWidth;
  const gap = 16;
  const itemWidth = (sliderWidth - (perPage - 1) * gap) / perPage;
  const moveBy = current * perPage * (itemWidth + gap);
  track.style.transform = `translateX(-${moveBy}px)`;
  document.querySelectorAll(".gallery-dot").forEach((d, i) =>
    d.classList.toggle("active", i === current)
  );
}

prevBtn.addEventListener("click", () => goTo((current - 1 + pages) % pages));
nextBtn.addEventListener("click", () => goTo((current + 1) % pages));
window.addEventListener("resize", () => goTo(current));

// ===== WHY US SLIDER =====
const whyCards = [
  ...document.querySelectorAll(".why-card")
];
const whyTrack    = document.getElementById("whyTrack");
const whyPrev     = document.getElementById("whyPrev");
const whyNext     = document.getElementById("whyNext");
const whyDotsWrap = document.getElementById("whyDots");
const whyPerPage  = 4;
const whyPages    = Math.ceil(whyCards.length / whyPerPage);
let whyCurrent    = 0;

for (let i = 0; i < whyPages; i++) {
  const d = document.createElement("span");
  d.className = "why-dot" + (i === 0 ? " active" : "");
  d.addEventListener("click", () => whyGoTo(i));
  whyDotsWrap.appendChild(d);
}

function whyGoTo(page, dir) {
  whyCurrent = page;
  const start = page * whyPerPage;
  const visible = whyCards.slice(start, start + whyPerPage);
  whyTrack.innerHTML = "";
  visible.forEach(c => whyTrack.appendChild(c));
  whyTrack.className = dir === "next" ? "why-track slide-next" : dir === "prev" ? "why-track slide-prev" : "why-track";
  document.querySelectorAll(".why-dot").forEach((d, i) => d.classList.toggle("active", i === whyCurrent));
}

whyGoTo(0);
whyPrev.addEventListener("click", () => whyGoTo((whyCurrent - 1 + whyPages) % whyPages, "prev"));
whyNext.addEventListener("click", () => whyGoTo((whyCurrent + 1) % whyPages, "next"));

// ===== LIGHTBOX =====
const lightboxImages = [...document.querySelectorAll(".gallery-item img")].map(img => img.src);
let lightboxIndex = 0;
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");

document.querySelectorAll(".gallery-item").forEach((item, i) => {
  item.addEventListener("click", () => {
    lightboxIndex = i;
    lightboxImg.src = lightboxImages[i];
    lightbox.style.display = "flex";
  });
});

function closeLightbox() { lightbox.style.display = "none"; }
function lightboxNext() { lightboxIndex = (lightboxIndex + 1) % lightboxImages.length; lightboxImg.src = lightboxImages[lightboxIndex]; }
function lightboxPrev() { lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length; lightboxImg.src = lightboxImages[lightboxIndex]; }
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", (e) => {
  if (lightbox.style.display === "flex") {
    if (e.key === "ArrowRight") lightboxNext();
    if (e.key === "ArrowLeft") lightboxPrev();
    if (e.key === "Escape") closeLightbox();
  }
});

// ===== COURSE ENROLL BUTTONS POPUP =====
document.querySelectorAll(".course-btn").forEach(btn => {
  btn.addEventListener("click", function(e) {
    e.preventDefault();
    const course = this.closest(".course-card").querySelector("h3").textContent;
    openPopup(course);
  });
});

// ===== COUNTER ANIMATION =====
const counters = document.querySelectorAll(".counter");
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = +el.getAttribute("data-target");
    const delay  = +el.getAttribute("data-delay") || 0;
    const duration = 4000;
    counterObserver.unobserve(el);
    setTimeout(() => {
      const startTime = performance.now();
      function update(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        el.textContent = Math.floor(progress * target);
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target;
      }
      requestAnimationFrame(update);
    }, delay);
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll("section[id]");
window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) current = sec.getAttribute("id");
  });
  document.querySelectorAll(".nav-links a").forEach(a => {
    a.style.color = "";
    if (a.getAttribute("href") === "#" + current) a.style.color = "var(--accent)";
  });
});

// ===== ANTI INSPECT =====
(function() {
  document.addEventListener("contextmenu", e => e.preventDefault());

  document.addEventListener("keydown", function(e) {
    if (
      e.key === "F12" ||
      (e.ctrlKey && e.shiftKey && ["I","i","J","j","C","c","K","k","E","e","M","m"].includes(e.key)) ||
      (e.ctrlKey && ["U","u","S","s","A","a"].includes(e.key)) ||
      (e.metaKey && e.altKey && ["I","i","J","j","C","c"].includes(e.key))
    ) {
      e.preventDefault();
      return false;
    }
  });

  let devOpen = false;
  setInterval(function() {
    const threshold = 160;
    const widthDiff  = window.outerWidth  - window.innerWidth  > threshold;
    const heightDiff = window.outerHeight - window.innerHeight > threshold;
    if (widthDiff || heightDiff) {
      if (!devOpen) {
        devOpen = true;
        document.body.style.filter = "blur(10px)";
        document.body.style.pointerEvents = "none";
      }
    } else {
      if (devOpen) {
        devOpen = false;
        document.body.style.filter = "";
        document.body.style.pointerEvents = "";
      }
    }
  }, 500);
})();
