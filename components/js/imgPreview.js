const STORAGE_KEY_UPLOADS = "spotsAppLS";
const STORAGE_KEY_LIKES = "likedHearts";

function loadLikedHearts() {
  const stored = localStorage.getItem(STORAGE_KEY_LIKES);
  return stored ? JSON.parse(stored) : [];
}
function saveLikedHearts(list) {
  localStorage.setItem(STORAGE_KEY_LIKES, JSON.stringify(list));
}
const likedHearts = loadLikedHearts();

const uploaded = JSON.parse(localStorage.getItem(STORAGE_KEY_UPLOADS)) || [];

const imageData = [
  { src: "./assets/img/Mask group.png", caption: "Val Thorens" },
  { src: "./assets/img/pexels-kassandre-pedro-8639743 1.png", caption: "Restaurant terrace" },
  { src: "./assets/img/Mask group (1).png", caption: "An outdoor cafe" },
  { src: "./assets/img/pexels-kassandre-pedro-8639743 1-3.png", caption: "A very long bridge, over the forest …" },
  { src: "./assets/img/pexels-kassandre-pedro-8639743 1-4.png", caption: "Tunnel with morning light" },
  { src: "./assets/img/pexels-kassandre-pedro-8639743 1-5.png", caption: "Mountain house" }
];

const allImages = [...uploaded, ...imageData];
const gallerySection = document.getElementById("gallerySection");

function createGalleryCard(item) {
  const container = document.createElement("div");
  container.className = "Image-container";

  const figure = document.createElement("figure");

  const img = document.createElement("img");
  img.className = "Images";
  img.src = item.src;
  img.alt = item.caption;
  img.setAttribute("data-name", item.caption);

  const figcaption = document.createElement("figcaption");
  figcaption.className = item.caption.length > 25 ? "desc" : "Name-heart";

  const title = document.createElement("p");
  title.textContent = item.caption;

  const heartIcon = document.createElement("img");
  heartIcon.className = "heart-icon";
  heartIcon.alt = "Heart icon";

  const isLiked = likedHearts.includes(item.caption);
  heartIcon.src = isLiked ? "./assets/heart-solid.svg" : "./assets/img/Union.png";
  if (isLiked) heartIcon.classList.add("liked");

  heartIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    const index = likedHearts.indexOf(item.caption);
    if (index !== -1) {
      likedHearts.splice(index, 1);
      heartIcon.src = "./assets/img/Union.png";
      heartIcon.classList.remove("liked");
    } else {
      likedHearts.push(item.caption);
      heartIcon.src = "./assets/heart-solid.svg";
      heartIcon.classList.add("liked");
    }
    saveLikedHearts(likedHearts);
  });

  img.addEventListener("click", () => {
    const modal = document.getElementById("modal-preview");
    const previewImg = document.getElementById("previewImg");
    const previewTitle = document.getElementById("previewTitle");

    modal.style.display = "flex";
    previewImg.src = item.src;
    previewTitle.textContent = item.caption;
  });

  figcaption.appendChild(title);
  figcaption.appendChild(heartIcon);
  figure.appendChild(img);
  figure.appendChild(figcaption);
  container.appendChild(figure);
  return container;
}

// Initial render
allImages.forEach((item) => {
  const card = createGalleryCard(item);
  gallerySection.appendChild(card);
});

// Live update from new post
window.addEventListener("post-added", (e) => {
  const card = createGalleryCard(e.detail);
  gallerySection.prepend(card);
});

// Image preview modal
const modal = document.createElement("div");
modal.className = "modal";
modal.id = "modal-preview";
modal.innerHTML = `
  <div class="image-modal-content">
    <button class="modal-close" data-close>&times;</button>
    <img id="previewImg" src="" alt="" class="preview-img" />
    <p id="previewTitle" class="preview-title"></p>
  </div>
`;
document.body.appendChild(modal);

modal.addEventListener("click", (e) => {
  if (e.target.id === "modal-preview" || e.target.classList.contains("modal-close")) {
    modal.style.display = "none";
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") modal.style.display = "none";
});