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
    intro: "Explore fresh vegetable examples. These are sample listings and can be replaced with the farm's actual produce and photos.",
    coverClass: "vegetable-cover",
    items: [
      ["🍅", "Tomato", "Fresh vegetables", "https://images.unsplash.com/photo-1524593166156-312f362cada0?auto=format&fit=crop&w=720&q=80"],
      ["🥒", "Cucumber", "Fresh vegetables", "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=720&q=80"],
      ["🥦", "Cauliflower", "Fresh vegetables", "https://images.unsplash.com/photo-1768860400114-35b07b42ef08?auto=format&fit=crop&w=720&q=80"],
      ["🌿", "Coriander", "Fresh herbs", "https://www.fruitlinq.com/cdn/shop/files/C1.jpg?v=1769237489"],
      ["🥬", "Spinach", "Leafy vegetables", "https://cdn.shopify.com/s/files/1/0648/4217/0584/files/richtige-ernaehrung-bei-eisenmangel-frankjuice_1024x1024.jpg?v=1696405149"],
      ["🌱", "Radish", "Root vegetables", "https://www.gartenbau-winklhofer.at/assets/images/galerie-versprechen-hofladen/radieschen-gross.jpg"],
      ["🥔", "Potato", "Root vegetables", "https://images.unsplash.com/photo-1566055803687-0665ef48df90?auto=format&fit=crop&w=720&q=80"]
    ]
  },
  crops: {
    title: "Farm crops",
    intro: "Explore examples of common farm crops. This starter list can be edited to match what Mali Krishi Farm grows.",
    coverClass: "crop-cover",
    items: [
      ["🌾", "Wheat", "Cereal crop", "https://images.unsplash.com/photo-1560437164-31316238e463?auto=format&fit=crop&w=720&q=80"],
      ["🌾", "Barley", "Cereal crop", "https://images.unsplash.com/photo-1694680162578-e347aaf4caf4?auto=format&fit=crop&w=720&q=80"],
      ["🌽", "Maize", "Grain crop", "https://images.unsplash.com/photo-1649251037566-6881b4956615?auto=format&fit=crop&w=720&q=80"],
      ["🌾", "Rice", "Grain crop", "https://images.unsplash.com/photo-1760286834274-4f13c9747f7d?auto=format&fit=crop&w=720&q=80"],
      ["🫘", "Lentil", "Pulse crop", "https://www.world-grain.com/ext/resources/TopicLandingPages/Commodities.webp?t=1533655011"],
      ["🌼", "Mustard", "Oilseed crop", "https://images.unsplash.com/photo-1560437164-31316238e463?auto=format&fit=crop&w=720&q=80"]
    ]
  },
  more: {
    title: "More to discover",
    intro: "This section is ready for any other farm products you decide to add later.",
    coverClass: "more-cover",
    items: [
      ["＋", "Add a product", "Add a short description", "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=720&q=80"],
      ["＋", "Add a product", "Add a short description", "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=720&q=80"],
      ["＋", "Add a product", "Add a short description", "https://www.world-grain.com/ext/resources/TopicLandingPages/Commodities.webp?t=1533655011"]
    ]
  }
};


function populateCategoryPreviews() {
  categoryButtons.forEach((button) => {
    const preview = button.querySelector(".category-preview");
    const content = produceContent[button.dataset.category];
    if (!preview || !content) return;

    preview.replaceChildren();
    content.items.slice(0, 3).forEach(([symbol, name, description, imageUrl]) => {
      const chip = document.createElement("span");
      chip.className = "category-preview-item";
      const image = document.createElement("img");
      image.src = imageUrl;
      image.alt = "";
      image.loading = "lazy";
      image.addEventListener("error", () => image.classList.add("preview-image-unavailable"), { once: true });
      const label = document.createElement("span");
      label.textContent = name;
      chip.append(image, label);
      preview.append(chip);
    });

    if (content.items.length > 3) {
      const more = document.createElement("span");
      more.className = "category-preview-more";
      more.textContent = "+" + (content.items.length - 3) + " more";
      preview.append(more);
    }
  });
}

populateCategoryPreviews();
categoryButtons.forEach((button) => {
  button.addEventListener("pointerenter", () => button.classList.add("is-previewing"));
  button.addEventListener("pointerleave", () => button.classList.remove("is-previewing"));
  button.addEventListener("focus", () => button.classList.add("is-previewing"));
  button.addEventListener("blur", () => button.classList.remove("is-previewing"));
});

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

    content.items.forEach(([symbol, name, description, imageUrl]) => {
      const item = document.createElement("article");
      item.className = "vegetable-item";

      const image = document.createElement("img");
      image.className = "vegetable-photo";
      image.src = imageUrl;
      image.alt = name;
      image.loading = "lazy";
      image.addEventListener("error", () => {
        image.classList.add("image-unavailable");
        image.removeAttribute("src");
        image.alt = name + " image unavailable";
      }, { once: true });

      const heading = document.createElement("h4");
      heading.textContent = name;
      const copy = document.createElement("p");
      copy.textContent = description;
      item.append(image, heading, copy);
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
detailsItems?.addEventListener("wheel", (event) => {
  const hasHorizontalOverflow = detailsItems.scrollWidth > detailsItems.clientWidth + 2;
  if (!hasHorizontalOverflow) return;
  const wheelAmount = Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
  if (wheelAmount !== 0) {
    event.preventDefault();
    detailsItems.scrollLeft += wheelAmount;
  }
}, { passive: false });

window.addEventListener("resize", updateSliderButtons);
