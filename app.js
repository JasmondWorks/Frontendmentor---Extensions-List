const extensionsList = document.querySelector(".extensions-list");
const tabsContainer = document.querySelector(".tabs");
const modalConfirmBtn = document.querySelector(".js-modal-confirm-btn");
const modalCancelBtn = document.querySelector(".js-modal-cancel-btn");
const modalCloseBtns = document.querySelectorAll(".js-modal-close-btn");
const modal = document.querySelector(".js-modal");
const themeToggler = document.querySelector(".js-theme-toggler");
const root = document.documentElement;
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  root.setAttribute("data-theme", "dark");
}

let list = [];
let filteredList = [];
const tabs = ["all", "active", "inactive"];
let activeTab = tabs[0];
let selectedExtension = null;

async function loadData() {
  const res = await fetch("./data.json");
  if (!res.ok) throw new Error("Failed to load JSON");

  list = await res.json();
  filteredList = list;

  renderList(filteredList);
}

loadData();

function renderList(data) {
  if (data.length === 0) {
    extensionsList.innerHTML = renderNoData();
    return;
  }

  extensionsList.classList.remove("extensions-list--empty");

  const container = document.querySelector(".extensions-list");

  container.innerHTML = "";

  data.forEach((item) => {
    const extensionItem = renderExtensionItem(item);

    container.insertAdjacentHTML("beforeend", extensionItem);
  });
}

function renderNoData() {
  extensionsList.classList.add("extensions-list--empty");

  return `
    <div>No data</div>
      `;
}

function renderExtensionItem(item) {
  const { name, description, logo, isActive } = item;

  return `
    <div class="extension-item">
        <div class="extension-item__info">
            <img
            class="extension-item__icon"
            src="${logo}"
            alt="${name} icon"
            />
            <div class="extension-item__text-content">
            <h2 class="extension-item__name">${name}</h2>
            <p class="extension-item__description">
                ${description}
            </p>
            </div>
        </div>
        <div class="extension-item__actions">
            <button class="button">Remove</button>
            <div class="switch js-switch-toggler" data-active="${isActive}"></div>
        </div>
    </div>
    `;
}

extensionsList.addEventListener("click", (e) => {
  const target = e.target;
  const item = e.target.closest(".extension-item");

  if (target.classList.contains("js-switch-toggler")) {
    const isActive = target.getAttribute("data-active") === "true";

    filteredList.map((extension) => {
      if (
        extension.name ===
        item.querySelector(".extension-item__name").textContent
      ) {
        extension.isActive = !isActive;
      }
    });

    updateFilteredList();
    renderList(filteredList);
  }

  if (target.classList.contains("button") && target.textContent === "Remove") {
    modal.classList.remove("hide");

    selectedExtension = item;
  }
});

tabsContainer.addEventListener("click", (e) => {
  const tab = e.target.closest(".tabs__button");

  const tabButtons = tabsContainer.querySelectorAll(".tabs__button");
  tabButtons.forEach((button) =>
    button.classList.remove("tabs__button--active")
  );
  tab.classList.add("tabs__button--active");
  activeTab = tab.textContent.toLowerCase();

  if (tab) {
    updateFilteredList();

    renderList(filteredList);
  }
}); // TODO: add tab functionality

function updateFilteredList() {
  if (activeTab === "all") {
    filteredList = list;
  } else if (activeTab === "active") {
    filteredList = list.filter((extension) => extension.isActive);
  } else if (activeTab === "inactive") {
    filteredList = list.filter((extension) => !extension.isActive);
  }
}

modalCloseBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    modal.classList.add("hide");
  });
});

// Modal overlay click to close
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hide");
  }
});

modalConfirmBtn.addEventListener("click", () => {
  const extensionName = selectedExtension.querySelector(
    ".extension-item__name"
  ).textContent;
  list = list.filter((extension) => extension.name !== extensionName);

  modal.classList.add("hide");
  updateFilteredList();
  renderList(filteredList);
});

themeToggler.addEventListener("click", toggleTheme);

function toggleTheme() {
  const isDark = root.getAttribute("data-theme") === "dark";

  if (isDark) {
    root.removeAttribute("data-theme");
    localStorage.removeItem("theme");
  } else {
    root.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  }
}
