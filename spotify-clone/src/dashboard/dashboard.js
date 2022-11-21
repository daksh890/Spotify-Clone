import { fetchRequest } from "../api";
import { ENDPOINT, logout } from "../common";

const onProfileClick = (event) => {
  event.stopPropagation();
  const profileMenu = document.querySelector("#profile-menu");
  profileMenu.classList.toggle("hidden");
  if (!profileMenu.classList.contains("hidden")) {
    profileMenu.querySelector("li#logout").addEventListener("click", logout);
  }
};

const loadUserProfile = async () => {
  const defaultImage = document.querySelector("#default-image");
  const profileButton = document.querySelector("#user-profile-btn");
  const displayName = document.querySelector("#display-name");

  const { display_name: displayNaam, images } = await fetchRequest(
    ENDPOINT.userInfo
  );

  displayName.textContent = displayNaam;
  if (images?.length) {
    defaultImage.classList.add("hidden");
  } else {
    defaultImage.classList.remove("hidden");
  }
  profileButton.addEventListener("click", onProfileClick);
};

const onPlaylistItemClicked = (event) => {
  console.log(event.target);
};

const loadPlaylist = async (endpoint, elementId) => {
  const {
    playlists: { items },
  } = await fetchRequest(endpoint);
  const playlistItemsSection = document.querySelector(`#${elementId}`);

  for (let { name, description, images, id } of items) {
    const playlistItem = document.createElement("section");
    playlistItem.className =
      "bg-dark-secondary rounded p-4 hover:cursor-pointer hover:bg-light-dark";
    playlistItem.id = id;
    playlistItem.setAttribute("data-type", "playlist");
    playlistItem.addEventListener("click", onPlaylistItemClicked);

    const [image] = images;
    playlistItem.innerHTML = `<img
        src="${image.url}"
        alt="${name}"
        class="rounded mb-2 object-contain shadow"
      />
      <h2 class="text-base font-semibold mb-4 truncate">${name}</h2>
      <h3 class="text-sm text-secondary line-clamp-2">${description}</h3>`;

    playlistItemsSection.appendChild(playlistItem);
  }
};

const loadPlaylists = () => {
  loadPlaylist(ENDPOINT.featuredPlaylist, "featured-playlist-items");
  loadPlaylist(ENDPOINT.toplists, "top-playlist-items");
};

const fillContentForDashboard = () => {
  const pageContent = document.querySelector("#page-content");

  const playlistMap = new Map([
    ["Featured", "featured-playlist-items"],
    ["Top Playlists", "top-playlist-items"],
  ]);

  let innerHTML = "";
  for (let [type, id] of playlistMap) {
    innerHTML += `
    <article class="p-4">
    <h1 class="mb-4 text-2xl font-bold capitalize">${type}</h1>
    <section
      class="featured-songs grid grid-cols-auto-fill-cards gap-4"
      id=${id}
    ></section>
  </article>`;
  }
  pageContent.innerHTML = innerHTML;
};

const loadSections = (section) => {};

document.addEventListener("DOMContentLoaded", () => {
  loadUserProfile();
  fillContentForDashboard();
  loadPlaylists();
  document.addEventListener("click", () => {
    const profileMenu = document.querySelector("#profile-menu");
    if (!profileMenu.classList.contains("hidden")) {
      profileMenu.classList.add("hidden");
    }
  });

  document.querySelector(".content").addEventListener("scroll", (event) => {
    const { scrollTop } = event.target;
    const header = document.querySelector(".header");
    if (scrollTop >= header.offsetHeight) {
      header.classList.add("sticky", "top-0", "bg-dark-secondary");
      header.classList.remove("bg-transparent");
    } else {
      header.classList.remove("sticky", "top-0", "bg-dark-secondary");
      header.classList.add("bg-transparent");
    }
  });
});
