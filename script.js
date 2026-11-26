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
const closeDetailsButton = document.querySelector(".close-details");

const produceContent = {
  vegetables: {
    title: "Fresh vegetables",
    intro: "Here are six sample vegetables to get the list started. Replace or add items as your farm's produce changes.",
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
    intro: "Your crop list can go here. Replace these simple placeholders with the crop names and details you want visitors to see.",
    items: [
      ["🌾", "Add crop name", "Add a short description"],
      ["🌱", "Add crop name", "Add a short description"],
      ["🌿", "Add crop name", "Add a short description"]
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

    detailsPanel.hidden = false;
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
