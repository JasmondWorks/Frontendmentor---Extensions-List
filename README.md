# Frontend Mentor - Browser extensions manager UI solution

This is a solution to the [Browser extensions manager UI challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/browser-extension-manager-ui-yNZnOfsMAp). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [Architecture and Methodology](#architecture-and-methodology)
  - [What I learned](#what-i-learned)
- [Author](#author)

## Overview

### The challenge

Users should be able to:

- **Toggle extensions** between active and inactive states directly from the list.
- **Filter extensions** to view "All", "Active", or "Inactive" extensions using tabs.
- **Remove extensions** from the list using a confirmation modal.
- **Select their color theme** (Light/Dark Mode), with the preference saved to `localStorage`.
- View the optimal layout for the interface depending on their device's screen size.
- See hover and focus states for all interactive elements on the page.

### Screenshot

![](./screenshot.jpg)

### Links

- Solution URL: [Add solution URL here](https://your-solution-url.com)
- Live Site URL: [Add live site URL here](https://your-live-site-url.com)

## My process

### Built with

- **Semantic HTML5 markup**
- **Vanilla JavaScript** (following a component-based, "React-like" pattern)
- **CSS Custom Properties** (for theming and design tokens)
- **Flexbox** and **CSS Grid** (for layout)
- **CSS Transitions**
- **CSS Media Queries** (for responsive design)

### Architecture and Methodology

The project was built using a **Vanilla JavaScript approach that mimics React's data flow and rendering lifecycle**.

1.  **Centralized State & Data Loading:**

    - The application data is loaded asynchronously from a local `data.json` file into a main `list` array.
    - A derived state, `filteredList`, is used for rendering to separate display logic from the main data source.
    - A function, `loadData()`, handles the initial fetch and rendering.

2.  **Unidirectional Data Flow (State Management):**

    - The application state (`list`, `filteredList`, `activeTab`) is updated in a few dedicated functions (`updateFilteredList`, event listeners for toggling/removing).
    - The `updateFilteredList()` function ensures that any change in the master `list` or `activeTab` immediately updates the data ready for display.

3.  **Declarative Rendering (`renderList`):**

    - Functions like `renderExtensionItem(item)` and `renderNoData()` act as simple "components," returning raw HTML strings based entirely on the input `item` data.
    - The main `renderList(data)` function clears the list container and regenerates the entire list HTML based on the current `filteredList`. This pattern of "re-render everything" simplifies state synchronization, much like how React re-renders components when state changes.

4.  **Event Delegation:**
    - Instead of attaching individual listeners to every single extension item, a single event listener is attached to the parent `.extensions-list` container. This handles:
      - Toggling the extension status (`.js-switch-toggler`).
      - Opening the confirmation modal for removal (`.button` with "Remove").
    - This is highly performant and easy to manage for dynamic lists.

### What I learned

This project provided excellent practice in structuring a complex UI with Vanilla JS to achieve the maintainability and clarity often associated with modern frameworks.

#### 1. Component-Based Rendering with Vanilla JS

I successfully implemented a pattern where HTML is generated based purely on data, making the UI a direct function of the application state.

```js
// "Component" function generating HTML string based on props (item)
function renderExtensionItem(item) {
  const { name, description, logo, isActive } = item;

  return `
    <div class="extension-item">
      // ... HTML structure
      <div class="switch js-switch-toggler" data-active="${isActive}"></div>
    </div>
  `;
}

// "Container" function managing the list rendering
function renderList(data) {
  // ... clear container
  data.forEach((item) => {
    container.insertAdjacentHTML("beforeend", renderExtensionItem(item));
  });
}
```

#### 2. Theme Management with Local Storage and CSS Variables

Implementing the Dark Mode toggle using CSS variables and localStorage was clean and efficient. The initial theme is loaded, and the toggle function manages both the DOM attribute and persistence.

```js
const root = document.documentElement;
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  root.setAttribute("data-theme", "dark");
}

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
```

#### 3. State-Driven Filtering Logic

The core logic for filtering and toggling was handled by manipulating the main list array and then calling the rendering pipeline, demonstrating an effective separation of concerns.

```js
function updateFilteredList() {
  if (activeTab === "all") {
    filteredList = list;
  } else if (activeTab === "active") {
    filteredList = list.filter((extension) => extension.isActive);
  } else if (activeTab === "inactive") {
    filteredList = list.filter((extension) => !extension.isActive);
  }
}

// After state change (toggle/remove/tab change)
updateFilteredList();
renderList(filteredList);
```

## Author

- Website - Nil

- Frontend Mentor - @JasmondWorks

- Coded by - Obafemi Olorede
