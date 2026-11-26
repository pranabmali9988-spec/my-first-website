const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".navigation");

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    menuButton.textContent = isOpen ? "×" : "☰";
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navigation.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
      menuButton.textContent = "☰";
    });
  });
}

const yearElement = document.querySelector("#year");
if (yearElement) yearElement.textContent = new Date().getFullYear();

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navigation?.classList.contains("open")) {
    navigation.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", "Open navigation");
    if (menuButton) menuButton.textContent = "☰";
    menuButton?.focus();
  }
});

// Click a produce category to reveal its editable list of items.
const categoryButtons = document.querySelectorAll(".category-card");
const detailsPanel = document.querySelector("#category-details");
const detailsTitle = document.querySelector("#details-title");
const detailsIntro = document.querySelector("#details-intro");
const detailsItems = document.querySelector("#details-items");
const detailsCover = document.querySelector("#details-cover");
const sliderPrev = document.querySelector("#slider-prev");
const sliderNext = document.querySelector("#slider-next");
const closeDetailsButton = document.querySelector(".close-details");

const produceContent = {
  vegetables: {
    title: "Fresh vegetables",
    intro: "Swipe, scroll or use the arrows to explore these sample vegetables. Replace or add items as your farm's produce list grows.",
    coverClass: "vegetable-cover",
    items: [
      ["🍅", "Tomato", "Fresh vegetables"],
      ["🥒", "Cucumber", "Fresh vegetables"],
      ["🥦", "Cauliflower", "Fresh vegetables"],
      ["🌿", "Coriander", "Fresh herbs"],
      ["🥬", "Spinach", "Leafy vegetables"],
      ["🌱", "Radish", "Root vegetables"]
    ]
  },
  crops: {
    title: "Farm crops",
    intro: "Explore examples of common farm crops. This is a starter list and can be edited to match what Mali Krishi Farm grows.",
    coverClass: "crop-cover",
    items: [
      ["🌾", "Wheat", "Cereal crop"],
      ["🌾", "Barley", "Cereal crop"],
      ["🌽", "Maize", "Grain crop"],
      ["🌾", "Rice", "Grain crop"],
      ["🫘", "Lentil", "Pulse crop"],
      ["🌼", "Mustard", "Oilseed crop"]
    ]
  },
  more: {
    title: "More to discover",
    intro: "This section is ready for any other farm products you decide to add later.",
    items: [
      ["＋", "Add a product", "Add a short description"],
      ["＋", "Add a product", "Add a short description"],
      ["＋", "Add a product", "Add a short description"]
    ]
  }
};

function closeProduceDetails() {
  if (!detailsPanel) return;
  detailsPanel.hidden = true;
  categoryButtons.forEach((button) => button.setAttribute("aria-expanded", "false"));
}

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.category;
    const content = produceContent[category];
    if (!content || !detailsPanel) return;

    const wasOpen = button.getAttribute("aria-expanded") === "true";
    closeProduceDetails();
    if (wasOpen) return;

    detailsTitle.textContent = content.title;
    detailsIntro.textContent = content.intro;
    if (detailsCover) {
      detailsCover.className = "details-cover " + (content.coverClass || "more-cover");
      detailsCover.setAttribute("aria-label", content.title + " category photograph");
    }
    detailsItems.replaceChildren();

    content.items.forEach(([symbol, name, description]) => {
      const item = document.createElement("article");
      item.className = "vegetable-item";
      const icon = document.createElement("span");
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = symbol;
      const heading = document.createElement("h4");
      heading.textContent = name;
      const copy = document.createElement("p");
      copy.textContent = description;
      item.append(icon, heading, copy);
      detailsItems.append(item);
    });

    detailsItems.scrollLeft = 0;
    updateSliderButtons();
    detailsPanel.hidden = false;
    updateSliderButtons();
    button.setAttribute("aria-expanded", "true");
    detailsPanel.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "nearest"
    });
  });
});

closeDetailsButton?.addEventListener("click", closeProduceDetails);

// Show a back-to-top shortcut after the visitor scrolls down the page.
const backToTopButton = document.querySelector(".back-to-top");
if (backToTopButton) {
  const updateBackToTopVisibility = () => {
    backToTopButton.classList.toggle("is-visible", window.scrollY > 400);
  };
  window.addEventListener("scroll", updateBackToTopVisibility, { passive: true });
  updateBackToTopVisibility();
  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
    });
  });
}


// Reveal page sections and paper-style cards as they enter the viewport.
// Visitors who prefer reduced motion see the content immediately.
const revealElements = document.querySelectorAll("[data-reveal]");
const prefersLessMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersLessMotion && "IntersectionObserver" in window) {
  revealElements.forEach((element) => element.classList.add("reveal-pending"));

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });

  revealElements.forEach((element) => revealObserver.observe(element));
}


// Horizontal produce slider controls for mouse, keyboard and touch visitors.
function updateSliderButtons() {
  if (!detailsItems || !sliderPrev || !sliderNext) return;
  const maxScroll = detailsItems.scrollWidth - detailsItems.clientWidth;
  sliderPrev.disabled = detailsItems.scrollLeft <= 4;
  sliderNext.disabled = detailsItems.scrollLeft >= maxScroll - 4;
}
function scrollProduceSlider(direction) {
  if (!detailsItems) return;
  const firstCard = detailsItems.querySelector(".vegetable-item");
  const distance = firstCard ? firstCard.getBoundingClientRect().width + 14 : 220;
  detailsItems.scrollBy({
    left: direction * distance * 2,
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
  });
}
sliderPrev?.addEventListener("click", () => scrollProduceSlider(-1));
sliderNext?.addEventListener("click", () => scrollProduceSlider(1));
detailsItems?.addEventListener("scroll", updateSliderButtons, { passive: true });
window.addEventListener("resize", updateSliderButtons);

// Let touch users tap the hero illustration to toggle the grown tomato plant.
const growthPlant = document.querySelector("#growth-plant");
growthPlant?.addEventListener("click", () => {
  const isGrown = growthPlant.classList.toggle("is-grown");
  growthPlant.setAttribute("aria-pressed", String(isGrown));
  growthPlant.setAttribute("aria-label", isGrown ? "Reset tomato plant to seed" : "Grow a tomato plant");
});
