import { renderHeaderComponent } from "./header-component.js";

// Скелетоны при загрузке ленты
export function renderLoadingPageComponent({ appEl, user, goToPage }) {
  const skeletonsHtml = Array(3)
    .fill("")
    .map(
      () => `
        <li class="post skeleton-post">
          <div class="skeleton skeleton-header">
            <div class="skeleton-avatar"></div>
            <div class="skeleton-name"></div>
          </div>
          <div class="skeleton skeleton-image"></div>
          <div class="skeleton skeleton-line"></div>
          <div class="skeleton skeleton-line short"></div>
        </li>
      `,
    )
    .join("");

  const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <ul class="posts">
        ${skeletonsHtml}
      </ul>
    </div>
  `;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    user,
    element: document.querySelector(".header-container"),
    goToPage,
  });
}