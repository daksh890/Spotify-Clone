import { fetchRequest } from "../api";
import { ENDPOINT, logout, SECTIONTYPE } from "../common";

const audio = new Audio();
const volume = document.querySelector("#volume");
const play = document.querySelector("#play");
const totalSongDuration = document.querySelector("#total-song-duration");
const songDurationCompleted = document.querySelector(
  "#song-duration-completed"
);
const songProgress = document.querySelector("#progress");
let progressInterval;
const timeline = document.querySelector("#timeline");

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

const onPlaylistItemClicked = (event, id) => {
  // console.log(event.target);
  const section = { type: SECTIONTYPE.PLAYLIST, playlist: id };
  history.pushState(section, "", `playlist/${id}`);
  loadSections(section);
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
    playlistItem.addEventListener("click", (event) =>
      onPlaylistItemClicked(event, id)
    );

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

const formatTime = (duration) => {
  const min = Math.floor(duration / 60_000);
  const sec = ((duration % 6_000) / 1000).toFixed(0);
  const formattedTime =
    sec == 60 ? min + 1 + ":00" : min + ":" + (sec < 10 ? "0" : "") + sec;
  return formattedTime;
};

const onTrackSelection = (id, event) => {
  document.querySelectorAll("#tracks .track").forEach((trackItem) => {
    if (trackItem.id === id) {
      trackItem.classList.add("bg-gray", "selected");
    } else {
      trackItem.classList.remove("bg-gray", "selected");
    }
  });
};

// const timeline = document.querySelector("#")

const onAudioMetadataLoaded = (id) => {
  totalSongDuration.textContent = `0:${audio.duration.toFixed(0)}`;
  play.querySelector("span").textContent = "pause_circle";
  const playButtonFromTracks = document.querySelector(`#play-track${id}`);
  playButtonFromTracks.textContent = "| |";
  playButtonFromTracks.setAttribute("data-play", "");
  // console.log(playButtonFromTracks);
};

const onNowPlayingPlaybuttonClicked = (id) => {
  if (audio.paused) {
    audio.play();
    play.querySelector("span").textContent = "pause_circle";
    const playButtonFromTracks = document.querySelector(`#play-track${id}`);
    playButtonFromTracks.setAttribute("data-play", "");
    playButtonFromTracks.textContent = "| |";
  } else {
    audio.pause();
    play.querySelector("span").textContent = "play_circle";
    const playButtonFromTracks = document.querySelector(`#play-track${id}`);
    playButtonFromTracks.innerHTML = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="h-6 w-6 justify-center items-center"
    >
      <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
      <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z"
      />
    </svg>
    `;
  }
};

const onPlayTrack = (
  event,
  { image, artistNames, name, duration, previewUrl, id }
) => {
  const button = event.target;
  const buttonwithattr = document.querySelector("[data-play]");
  if (buttonwithattr?.id === `play-track${id}`) {
    if (audio.paused) {
      audio.play();
      play.querySelector("span").textContent = "pause_circle";
      const playButtonFromTracks = document.querySelector(`#play-track${id}`);
      playButtonFromTracks.setAttribute("data-play", "");
      playButtonFromTracks.textContent = "| |";
    } else {
      audio.pause();
      play.querySelector("span").textContent = "play_circle";
      const playButtonFromTracks = document.querySelector(`#play-track${id}`);
      playButtonFromTracks.removeAttribute("data-play");
      playButtonFromTracks.innerHTML = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="h-6 w-6 justify-center items-center"
    >
      <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
      <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z"
      />
    </svg>
    `;
    }
  } else {
    // console.log(image, artistNames, name, duration, previewUrl, id);
    // <img id="now-playing-image" class="h-12 w-12" src="" alt="" srcset="" />
    // <section class="flex flex-col justify-center">
    //   <h2 id="now-playing-song" class="text-sm font-semibold text-primary"> Song title </h2>
    //   <p id="now-playing-artists" class="text-xs">Song Artists</p>
    // </section>
    // buttonwithattr.removeAttribute("[data-play]");
    const nowPlayingImage = document.querySelector("#now-playing-image");
    const songTitle = document.querySelector("#now-playing-song");
    const artists = document.querySelector("#now-playing-artists");
    songTitle.textContent = name;
    artists.textContent = artistNames;
    nowPlayingImage.src = image.url;

    audio.src = previewUrl;

    audio.removeEventListener("loadedmetadata", () =>
      onAudioMetadataLoaded(id)
    );

    audio.addEventListener("loadedmetadata", () => onAudioMetadataLoaded(id));
    play.addEventListener("click", () => onNowPlayingPlaybuttonClicked(id));
    audio.play();
    clearInterval(progressInterval);
    // timeline.addEventListener("click")
    progressInterval = setInterval(() => {
      if (audio.paused) return;
      songDurationCompleted.textContent = `${
        audio.currentTime.toFixed(0) < 10
          ? "0:0" + audio.currentTime.toFixed(0)
          : "0:" + audio.currentTime.toFixed(0)
      }`;
      songProgress.style.width = `${
        (audio.currentTime / audio.duration) * 100
      }%`;
    }, 100);
  }
};

const loadPlaylistTracks = ({ tracks }) => {
  const trackSections = document.querySelector("#tracks");
  let trackNo = 1;
  for (let tarckItem of tracks.items) {
    let {
      id,
      artists,
      name,
      album,
      duration_ms: duration,
      preview_url: previewUrl,
    } = tarckItem.track;
    let track = document.createElement("section");
    track.id = id;
    track.className =
      "track p-1 grid grid-cols-[50px_1fr_1fr_50px] items-center justify-items-start gap-4 rounded-md text-secondary hover:bg-light-dark";
    let image = album.images.find((img) => img.height === 64);
    let artistNames = Array.from(artists, (artist) => artist.name).join(", ");

    track.innerHTML = `
    <p class="relative w-full flex items-center justify-center justify-self-center"><span class="track-no">${trackNo++}</span></p>
    <section class="grid grid-cols-[auto_1fr] place-items-center gap-2">
      <img class="h-10 w-10" src="${image.url}" alt="${name}" />
      <article class="flex flex-col gap-1 justify-center">
        <h2 class="text-base text-primary line-clamp-1">${name}</h2>
        <p class="text-xs line-clamp-1">${artistNames}</p>
      </article>
    </section>
    <p class="text-sm">${album.name}</p>
    <p class="text-sm">${formatTime(duration)}</p>
    `;

    track.addEventListener("click", (event) => onTrackSelection(id, event));
    const playButton = document.createElement("button");
    playButton.id = `play-track${id}`;
    playButton.className = `play w-full absolute text-lg invisible `;
    playButton.innerHTML = `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="h-6 w-6 justify-center items-center"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z"
        />
      </svg>
    `;
    playButton.addEventListener("click", (event) =>
      onPlayTrack(event, { image, artistNames, name, duration, previewUrl, id })
    );
    track.querySelector("p").appendChild(playButton);
    trackSections.appendChild(track);
  }
};

const fillContentforPlaylist = async (playlistId) => {
  const playlist = await fetchRequest(`${ENDPOINT.playlist}/${playlistId}`);
  console.log(playlist);
  const { name, description, images, tracks } = playlist;
  const coverElement = document.querySelector("#cover-content");
  coverElement.innerHTML = `
  <img class="object-contain h-36 w-36" src="${images[0].url}" alt="" />
  <section>
    <h2 id="playlist-name" class="text-4xl">${name}</h2>
    <p id="playlist-details">${tracks.items.length} songs</p>
  </section>
  `;

  const pageContent = document.querySelector("#page-content");
  pageContent.innerHTML = `
    <header id="playlist-header" class="mx-8 py-4 border-secondary border-b-[0.5px] z-10">
    <nav class="py-2">
      <ul
        class="grid grid-cols-[50px_1fr_1fr_50px] gap-4 text-secondary"
      >
        <li class="justify-self-center">#</li>
        <li>Title</li>
        <li>Album</li>
        <li>⏱️</li>
      </ul>
    </nav>
    </header>
    <section class=" text-secondary px-8 mt-4" id="tracks">
    </section>
  `;
  // console.log(playlist);
  loadPlaylistTracks(playlist);
};

const onContentScroll = (event) => {
  const { scrollTop } = event.target;
  const header = document.querySelector(".header");
  if (scrollTop >= header.offsetHeight) {
    header.classList.add("sticky", "top-0", "bg-black");
    header.classList.remove("bg-transparent");
  } else {
    header.classList.remove("sticky", "top-0", "bg-black");
    header.classList.add("bg-transparent");
  }

  if (history.state.type === SECTIONTYPE.PLAYLIST) {
    const coverElement = document.querySelector("#cover-content");
    const playlistHeader = document.querySelector("#playlist-header");
    if (scrollTop >= coverElement.offsetHeight - header.offsetHeight) {
      playlistHeader.classList.add("sticky", "bg-dark-secondary", "px-8");
      playlistHeader.classList.remove("mx-8");
      playlistHeader.style.top = `${header.offsetHeight}px`;
    } else {
      playlistHeader.classList.remove("sticky", "bg-dark-secondary", "px-8");
      playlistHeader.classList.add("mx-8");
      playlistHeader.style.top = `revert`;
    }
  }
};

const loadSections = (section) => {
  if (section.type === SECTIONTYPE.DASHBOARD) {
    fillContentForDashboard();
    loadPlaylists();
  } else if (section.type === SECTIONTYPE.PLAYLIST) {
    // load playlist element
    fillContentforPlaylist(section.playlist);
  }

  document
    .querySelector(".content")
    .removeEventListener("scroll", onContentScroll);
  document
    .querySelector(".content")
    .addEventListener("scroll", onContentScroll);
};

document.addEventListener("DOMContentLoaded", () => {
  loadUserProfile();
  // const section = { type: SECTIONTYPE.DASHBOARD };
  const section = {
    type: SECTIONTYPE.PLAYLIST,
    playlist: "37i9dQZF1DWX3SoTqhs2rq",
  };
  history.pushState(section, "", `/dashboard/playlist/${section.playlist}`);
  // history.pushState(section, "", "");
  loadSections(section);
  document.addEventListener("click", () => {
    const profileMenu = document.querySelector("#profile-menu");
    if (!profileMenu.classList.contains("hidden")) {
      profileMenu.classList.add("hidden");
    }
  });

  volume.addEventListener("change", () => {
    audio.volume = volume.value / 100;
  });

  timeline.addEventListener(
    "click",
    (e) => {
      const lineWidth = window.getComputedStyle(timeline).width;
      const timetoSeek = (e.offsetX / parseInt(lineWidth)) * audio.duration;
      audio.currentTime = timetoSeek;
      songProgress.style.width = `${
        (audio.currentTime / audio.duration) * 100
      }%`;
    },
    false
  );

  window.addEventListener("popstate", (event) => {
    loadSections(event.state);
  });
});
