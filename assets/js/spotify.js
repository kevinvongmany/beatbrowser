const searchInputEl = document.getElementById("songSearch");
const heroSectionEl = document.getElementById("heroResult");
const resultsSectionEl = document.getElementById("searchResults");
const bodyDiv = document.body;

function getToken(clientId, clientSecret) {
  let authUrl = `https://accounts.spotify.com/api/token?grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`;
  return authUrl;
}

function callSpotifyApi(songQuery, limit = 5, offset = 0) {
  let authHeaders = new Headers();
  authHeaders.append(
    "Cookie",
    "__Host-device_id=AQDQdpaqyLgDRTAl9w0iaxV5KJ5s0CnWtRp684z_RND--jilc5eTMOmnR6bGdjUC55N3FUvHHdWhJk_dGEoZPcXv-3TyC0flyVQ; sp_tr=false"
  );
  authHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  let authRequestOptions = {
    method: "POST",
    headers: authHeaders,
    redirect: "follow",
  };
  let searchUrl = getToken(
    "50dbdfe1c4f54d8ab520c939ff716514",
    "0e287b337c8744f7920a56c7f48dde43"
  );
  fetch(searchUrl, authRequestOptions)
    .then((response) => response.json())
    .then((result) =>
      searchQuery(result.access_token, "track", songQuery, limit, offset)
    )
    .catch((error) => console.log("error", error));
}

async function searchQuery(token, typeQuery, songQuery, limit, offset) {
  let searchHeaders = new Headers();
  searchHeaders.append("Authorization", `Bearer ${token}`);

  let searchRequestOptions = {
    method: "GET",
    headers: searchHeaders,
    redirect: "follow",
  };

  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      songQuery
    )}&type=${typeQuery}&limit=${limit}&offset=${offset}`,
    searchRequestOptions
  );
  const result = await response.json();
  items = result.tracks.items;
  for (let i = 0; i < items.length; i++) {
    let song = {
      id: i,
      spotify_id: items[i].id,
      name: items[i].name,
      artist: items[i].artists[0].name,
      preview: items[i].preview_url,
      album: items[i].album.name,
      image: items[i].album.images[0].url,
    };
    if (song.id === 0) {
      renderHeroSection(song);
    } else if (song.id >= 5) {
      renderSongResults(song, (hidden = true));
    } else {
      renderSongResults(song);
    }
    wikiSearchQuery(
      `${song.name} (${song.artist} song)`,
      song.spotify_id,
      (lastSearch = true)
    );
    saveResultsToSessionStorage(song);
  }
}

function renderHeroSection(heroObj) {
  const heroSection = document.getElementById("heroResult");
  const heroParentDiv = document.createElement("div");
  const heroBodyDiv = document.createElement("div");
  const heroIconDiv = document.createElement("div");
  const heroIcon = document.createElement("i");
  const heroDiv = document.createElement("div");
  const heroTitle = document.createElement("h3");
  const heroDetailsDiv = document.createElement("div");
  const heroArtist = document.createElement("p");
  const heroAlbum = document.createElement("p");
  const heroDescription = document.createElement("p");
  const hrElement1 = document.createElement("hr");
  const hrElement2 = document.createElement("hr");
  const hrElement3 = document.createElement("hr");
  heroParentDiv.setAttribute(
    "class",
    "parent-result relative w-full transform rounded-lg light-pink-bg text-left shadow-xl min-w-96 min-h-72 sm:my-8 sm:w-full sm:max-w-lg"
  );
  heroParentDiv.dataset.spotify_id = heroObj.spotify_id;
  heroBodyDiv.setAttribute(
    "class",
    "flex w-full items-center justify-center px-4 pb-4 pt-5 sm:p-6 sm:pb-4 sm:flex sm:items-start"
  );
  heroIconDiv.setAttribute(
    "class",
    "mx-auto flex h-12 w-12 flex-shr solid-green-100 ink-0 items-center justify-center rounded-full bg-white sm:mx-0 sm:h-10 sm:w-10"
  );
  heroIcon.setAttribute("class", "fa fa-music");
  heroDiv.setAttribute(
    "class",
    "mt-3 text-center w-full sm:ml-4 sm:mt-0 sm:text-left"
  );
  heroTitle.setAttribute(
    "class",
    "font-semibold text-3xl leading-6 text-gray-900"
  );
  heroTitle.textContent = heroObj.name;
  heroDetailsDiv.setAttribute("class", "mt-2");
  heroDetailsDiv.id = heroObj.spotify_id;
  heroArtist.setAttribute("class", "text-md text-gray-500");
  heroArtist.textContent = `Artist: ${heroObj.artist}`;
  heroAlbum.setAttribute("class", "text-md text-gray-500");
  heroAlbum.textContent = `Album: ${heroObj.album}`;
  heroDescription.setAttribute("class", "text-md text-gray-500");
  heroDescription.id = `description-${heroObj.spotify_id}`;
  heroDescription.textContent = `Loading description...`;
  heroDetailsDiv.appendChild(heroArtist);
  heroDetailsDiv.appendChild(hrElement1);
  heroDetailsDiv.appendChild(heroAlbum);
  heroDetailsDiv.appendChild(hrElement2);
  heroDetailsDiv.appendChild(heroDescription);
  heroDetailsDiv.appendChild(hrElement3);
  heroDiv.appendChild(heroTitle);
  heroDiv.appendChild(heroDetailsDiv);
  heroIconDiv.appendChild(heroIcon);
  heroBodyDiv.appendChild(heroIconDiv);
  heroBodyDiv.appendChild(heroDiv);
  heroParentDiv.appendChild(heroBodyDiv);
  heroSection.appendChild(heroParentDiv);
}

function renderSongResults(resultObj, hidden = false) {
  const resultSection = document.getElementById("searchResults");
  const resultParentCardDiv = document.createElement("div");
  const resultParentDiv = document.createElement("div");
  const resultBodyDiv = document.createElement("div");
  const resultIconDiv = document.createElement("div");
  const resultIcon = document.createElement("i");
  const resultDiv = document.createElement("div");
  const resultTitle = document.createElement("h3");
  const resultDetailsDiv = document.createElement("div");
  const resultArtist = document.createElement("p");
  const resultAlbum = document.createElement("p");
  const resultDescription = document.createElement("p");
  const hrElement1 = document.createElement("hr");
  const hrElement2 = document.createElement("hr");
  const hrElement3 = document.createElement("hr");
  resultParentCardDiv.setAttribute(
    "class",
    "parent-result flex items-center justify-center bg-none p-5 w-full lg:w-1/2 h-full min-h-96 rounded-lg p-3"
  );
  resultParentCardDiv.dataset.spotify_id = resultObj.spotify_id;
  resultParentCardDiv.id = `song-result-card-${resultObj.id}`;
  resultParentDiv.setAttribute(
    "class",
    "flex w-full transform rounded-lg bg-white text-left shadow-xl sm:my-8  min-w-96 min-h-72 sm:w-full sm:max-w-lg"
  );
  resultBodyDiv.setAttribute(
    "class",
    "flex w-full items-center justify-center px-4 pb-4 pt-5 items-start sm:p-6 sm:pb-4 sm:flex sm:items-start"
  );
  resultIconDiv.setAttribute(
    "class",
    "mx-auto flex h-12 w-12 flex-shr solid-green-100 ink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10"
  );
  resultIcon.setAttribute("class", "fa fa-music");
  resultDiv.setAttribute(
    "class",
    "mt-3 text-center w-full sm:ml-4 sm:mt-0 sm:text-left"
  );
  resultTitle.setAttribute(
    "class",
    "font-semibold text-2xl leading-6 text-gray-900"
  );
  resultTitle.textContent = resultObj.name;
  resultDetailsDiv.setAttribute("class", "mt-2");
  resultDetailsDiv.id = resultObj.spotify_id;
  resultArtist.setAttribute("class", "text-sm text-gray-500");
  resultArtist.textContent = `Artist: ${resultObj.artist}`;
  resultAlbum.setAttribute("class", "text-sm text-gray-500");
  resultAlbum.textContent = `Album: ${resultObj.album}`;
  resultDescription.setAttribute("class", "text-sm text-gray-500");
  resultDescription.id = `description-${resultObj.spotify_id}`;
  resultDescription.textContent = `Loading description...`;
  resultDetailsDiv.appendChild(resultArtist);
  resultDetailsDiv.appendChild(hrElement1);
  resultDetailsDiv.appendChild(resultAlbum);
  resultDetailsDiv.appendChild(hrElement2);
  resultDetailsDiv.appendChild(resultDescription);
  resultDetailsDiv.appendChild(hrElement3);
  resultDiv.appendChild(resultTitle);
  resultDiv.appendChild(resultDetailsDiv);
  resultIconDiv.appendChild(resultIcon);
  resultBodyDiv.appendChild(resultIconDiv);
  resultBodyDiv.appendChild(resultDiv);
  resultParentDiv.appendChild(resultBodyDiv);
  resultParentCardDiv.appendChild(resultParentDiv);
  resultSection.appendChild(resultParentCardDiv);
  if (hidden) {
    resultParentCardDiv.classList.add("hidden");
  }
}

function saveResultsToSessionStorage(result) {
  let songResults = JSON.parse(sessionStorage.getItem("songResults")) || [];
  songResults.push(result);

  sessionStorage.setItem("songResults", JSON.stringify(songResults));
}

function songResults() {
  let songResults = JSON.parse(sessionStorage.getItem("songResults")) || [];
  return songResults;
}

function loadSong(trackUrl) {
  console.log("Loading in a song");
  const song = document.getElementById("audio");
  song.id = "audio";
  song.volume = 0.2;
  song.src = trackUrl;
  song.classList.add("hidden");
  console.log(song);
}

function stopSong(song) {
  console.log(song);
  song.pause();
  song.currentTime = 0;
}

function toggleSong(song) {
  console.log(song);
  if (song.paused) {
    song.play();
  } else {
    stopSong(song);
  }
}
