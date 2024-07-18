// const songPreviewEl = document.getElementById("song-preview");
// const volumeEl = document.getElementById("volume-slider");
// const searchBoxFormEl = document.getElementById("search-box");
const searchInputEl = document.getElementById("songSearch");
const heroSectionEl = document.getElementById("heroResult");
const resultsSectionEl = document.getElementById("searchResults");
const bodyDiv = document.body;

function getToken(clientId, clientSecret) {
  
  let authUrl = `https://accounts.spotify.com/api/token?grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`;
  return authUrl;
}

function callSpotifyApi(songQuery, limit=5, offset=0) {
  let authHeaders = new Headers();
  authHeaders.append(
    "Cookie",
    "__Host-device_id=AQDQdpaqyLgDRTAl9w0iaxV5KJ5s0CnWtRp684z_RND--jilc5eTMOmnR6bGdjUC55N3FUvHHdWhJk_dGEoZPcXv-3TyC0flyVQ; sp_tr=false"
  );
  authHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  let authRequestOptions = {
    "method": "POST",
    "headers": authHeaders,
    "redirect": "follow"
  }
  let searchUrl = getToken("50dbdfe1c4f54d8ab520c939ff716514", "0e287b337c8744f7920a56c7f48dde43");
  fetch(
    searchUrl, authRequestOptions
  )
    .then((response) => response.json())
    .then((result) => searchQuery(result.access_token, "track", songQuery, limit, offset))
    .catch((error) => console.log("error", error));
}

/* -------------------------------- */


function searchQuery(token, typeQuery, songQuery, limit, offset) {
    let searchHeaders = new Headers();
    searchHeaders.append("Authorization", `Bearer ${token}`);
    
    let searchRequestOptions = {
      method: "GET",
      headers: searchHeaders,
      redirect: "follow",
    };
    
    fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(songQuery)}&type=${typeQuery}&limit=${limit}&offset=${offset}`,
      searchRequestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        items = result.tracks.items;
        for (let i = 0; i < items.length; i++) {
        let song = {
          // add an index to the song object

          id: i,
          spotify_id: items[i].id,
          name: items[i].name,
          artist: items[i].artists[0].name,
          preview: items[i].preview_url,
          album: items[i].album.name,
          image: items[i].album.images[0].url
        }
        wikiSearchQuery(`${song.name} (${song.artist} song)`, song.spotify_id);
        saveResultsToSessionStorage(song);
        
        }
        return JSON.parse(sessionStorage.getItem("songResults"));
        }
       )
    
      .then((results) => {
        results.forEach((result) => renderSongResults(result));
      })
      .catch((error) => console.log("error", error));

}

function renderSongResults(result) {
  const hrElement1 = document.createElement("hr");
  const hrElement2 = document.createElement("hr");
  const resultParentDiv = document.createElement("div");
  resultParentDiv.setAttribute("class", "relative transform overflow-hidden rounded-lg text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg")
  const resultBodyDiv = document.createElement("div");
  resultBodyDiv.setAttribute("class", "flex items-center justify-center px-4 pb-4 pt-5 sm:p-6 sm:pb-4 sm:flex sm:items-start");
  const resultIconDiv = document.createElement("div");
  resultIconDiv.setAttribute("class", "mx-auto flex h-12 w-12 px-3 flex-shr solid-green-100 ink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10");
  const resultIcon = document.createElement("i");
  resultIcon.setAttribute("class", "fa fa-music");
  const resultDiv = document.createElement("div");
  resultDiv.setAttribute("class", "mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left");
  const resultTitle = document.createElement("h3");
  resultTitle.setAttribute("class", "text-base font-semibold leading-6 text-gray-900");
  resultTitle.textContent = result.name;
  resultTitle.id = `modal-title-${result.spotify_id}`;
  const resultsDiv = document.createElement("div");
  resultsDiv.setAttribute("class", "mt-2");
  resultsDiv.id = `${result.spotify_id}`;
  const resultArtist = document.createElement("p");
  resultArtist.id = `artist-name-${result.spotify_id}`;
  resultArtist.setAttribute("class", "text-sm text-gray-500");
  resultArtist.textContent = result.artist;
  const resultAlbum = document.createElement("p");
  resultAlbum.id = `album-name-${result.spotify_id}`;
  resultAlbum.setAttribute("class", "text-sm text-gray-500");
  resultAlbum.textContent = result.album;
  // const resultDescription = document.createElement("p");
  // resultDescription.id = `description-${result.spotify_id}`;
  // resultDescription.setAttribute("class", "text-sm text-gray-500");
  // resultDescription.textContent = descriptions[result.spotify_id].short;

  resultParentDiv.appendChild(resultBodyDiv);
  resultBodyDiv.appendChild(resultIconDiv);
  resultIconDiv.appendChild(resultIcon);
  resultBodyDiv.appendChild(resultDiv);
  resultDiv.appendChild(resultTitle);
  resultDiv.appendChild(resultsDiv);
  resultsDiv.appendChild(resultArtist);
  resultsDiv.appendChild(hrElement1);
  resultsDiv.appendChild(resultAlbum);
  resultsDiv.appendChild(hrElement2);

  if (result.id === 0) {
    heroSectionEl.appendChild(resultParentDiv);
  } else {
    resultsSectionEl.classList.remove("hidden");
    resultsSectionEl.appendChild(resultParentDiv);
  
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

function loadSong(trackUrl){
  return new Audio(trackUrl)
}


  
function toggleSong(e, song) {
  e.preventDefault();
  if (song.paused) {
    song.play();
  } else {
    song.currentTime = 0;
    song.pause()
  }
  console.log(song.paused)

}

// volumeEl.addEventListener("input", (song) => {
//   let volumeValue = volumeEl.value;
//   song.volume = volumeValue / 100;
// });
// songPreviewEl.addEventListener("click", toggleSong(song));

