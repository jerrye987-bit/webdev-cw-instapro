import { USER_POSTS_PAGE, AUTH_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, user } from "../index.js";
import { likePost, dislikePost, deletePost } from "../api.js";

function plural(n, one, few, many) {
  if (n % 10 === 1 && n % 100 !== 11) return one;
  if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return few;
  return many;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "только что";
  if (minutes < 60)
    return `${minutes} ${plural(minutes, "минуту", "минуты", "минут")} назад`;
  if (hours < 24)
    return `${hours} ${plural(hours, "час", "часа", "часов")} назад`;
  if (days < 7)
    return `${days} ${plural(days, "день", "дня", "дней")} назад`;
  return date.toLocaleDateString("ru-RU");
}

export function renderPostsPageComponent({ appEl }) {
  const getToken = () => (user ? `Bearer ${user.token}` : undefined);

  const postsHtml = posts
    .map((post) => {
      const isLiked = post.isLiked;
      const likesCount = post.likes ? post.likes.length : 0;
      const likeIcon = isLiked
        ? "./assets/images/like-active.svg"
        : "./assets/images/like-not-active.svg";

            const isOwnPost = user && post.user && user._id === post.user.id;

      return `
        <li class="post" data-post-id="${post.id}">
          <div class="post-header" data-user-id="${post.user.id}" style="cursor: pointer;">
            <img src="${post.user.imageUrl}" class="post-header__user-image">
            <p class="post-header__user-name">${post.user.name}</p>
          </div>
          <div class="post-image-container">
            <img class="post-image" src="${post.imageUrl}">
          </div>
          <div class="post-likes">
            <button data-post-id="${post.id}" class="like-button">
              <img src="${likeIcon}">
            </button>
            <p class="post-likes-text">
              Нравится: <strong>${likesCount}</strong>
            </p>
          </div>
          <p class="post-text">
            <span class="user-name">${post.user.name}</span>
            ${post.description}
          </p>
          <p class="post-date">${formatDate(post.createdAt)}</p>
          ${
            isOwnPost
              ? `<button class="button delete-button" data-post-id="${post.id}" style="margin-top: 10px;">Удалить пост</button>`
              : ""
          }
        </li>
      `;
    })
    .join("");

  const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <ul class="posts">
        ${postsHtml || '<p class="post-text" style="text-align: center; margin-top: 20px;">Постов пока нет</p>'}
      </ul>
    </div>
  `;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  appEl.querySelectorAll(".like-button").forEach((button) => {
    button.addEventListener("click", () => {
      const postId = button.dataset.postId;

      if (!user) {
        alert("Войдите, чтобы ставить лайки");
        goToPage(AUTH_PAGE);
        return;
      }

      const post = posts.find((p) => p.id === postId);
      if (!post) return;

      button.disabled = true;

      const apiCall = post.isLiked
        ? dislikePost({ token: getToken(), postId })
        : likePost({ token: getToken(), postId });

      apiCall
        .then((updatedPost) => {
          const index = posts.findIndex((p) => p.id === postId);
          if (index !== -1) {
            posts[index] = updatedPost;
          }
          renderPostsPageComponent({ appEl });
        })
        .catch((error) => {
          console.error(error);
          alert(error.message);
          button.disabled = false;
        });
    });
  });

  appEl.querySelectorAll(".post-header").forEach((header) => {
    header.addEventListener("click", () => {
      const userId = header.dataset.userId;
      goToPage(USER_POSTS_PAGE, { userId });
    });
  });

  appEl.querySelectorAll(".delete-button").forEach((button) => {
    button.addEventListener("click", () => {
      const postId = button.dataset.postId;

      if (!confirm("Удалить пост?")) return;

      deletePost({ token: getToken(), postId })
        .then(() => {
          const index = posts.findIndex((p) => p.id === postId);
          if (index !== -1) {
            posts.splice(index, 1);
          }
          renderPostsPageComponent({ appEl });
        })
        .catch((error) => {
          console.error(error);
          alert(error.message);
        });
    });
  });
}