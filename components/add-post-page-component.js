import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  let imageUrl = "";

  const render = () => {
    const appHtml = `
      <div class="page-container">
        <div class="header-container"></div>
        <div class="form">
          <h3 class="form-title">Добавить пост</h3>
          <div class="upload-image-container"></div>
          <textarea
            id="description-input"
            class="input"
            placeholder="Описание фото"
            rows="4"
            style="width: 100%; resize: vertical; margin: 10px 0;"
          ></textarea>
          <div class="form-error"></div>
          <button class="button" id="add-button">Опубликовать</button>
        </div>
      </div>
    `;
appEl.innerHTML = appHtml;

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    const uploadImageContainer = appEl.querySelector(".upload-image-container");
    renderUploadImageComponent({
      element: uploadImageContainer,
      onImageUrlChange(newImageUrl) {
        imageUrl = newImageUrl;
      },
    });

    document.getElementById("add-button").addEventListener("click", () => {
      const description = document.getElementById("description-input").value.trim();
      const errorEl = appEl.querySelector(".form-error");
      errorEl.textContent = "";

      if (!imageUrl) {
        errorEl.textContent = "Не выбрана фотография";
        return;
      }

      if (!description) {
        errorEl.textContent = "Введите описание";
        return;
      }

      onAddPostClick({ description, imageUrl });
    });
  };

  render();
}