function getToken(clientId, clientSecret) {
  
  let authUrl = `https://accounts.spotify.com/api/token?grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`;
  return authUrl;
}

function callSpotifyApi() {
  let authHeaders = new Headers();
  authHeaders.append(
    "Cookie",
    "__Host-device_id=AQDQdpaqyLgDRTAl9w0iaxV5KJ5s0CnWtRp684z_RND--jilc5eTMOmnR6bGdjUC55N3FUvHHdWhJk_dGEoZPcXv-3TyC0flyVQ; sp_tr=false"
  );
  authHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  let searchUrl = getToken("50dbdfe1c4f54d8ab520c939ff716514", "0e287b337c8744f7920a56c7f48dde43");
  console.log(searchUrl);
  fetch(
    searchUrl, authHeaders
  )
    .then((response) => response.json())
    // .then((result) => console.log(result))
    .then((result) => searchQuery(result.access_token, "track"))
    .catch((error) => console.log("error", error));
}

/* -------------------------------- */


function searchQuery(token, typeQuery) {
    let searchHeaders = new Headers();
    searchHeaders.append("Authorization", `Bearer ${token}`);
    
    let searchRequestOptions = {
      method: "GET",
      headers: searchHeaders,
      redirect: "follow",
    };
    
    // typeQuery = "album";
    let name = "Black Parade";
    
    fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(name)}&type=${typeQuery}&limit=5`,
      searchRequestOptions
    )
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));

}

const song = new Audio("https://p.scdn.co/mp3-preview/1434f7350357c1d6a7eb7f5a84dd6d198a252ed1?cid=50dbdfe1c4f54d8ab520c939ff716514")

const volumeEl = document.getElementById("volume-slider");
let volumeValue = volumeEl.value;
volumeEl.addEventListener("input", () => {
  volumeValue = volumeEl.value;
  song.volume = volumeValue / 100;
});

const songPreview = document.getElementById("song-preview");
songPreview.addEventListener("click", toggleSong);

function toggleSong() {
  console.log(song);
    song.volume = 0.2;
    if (song.paused) {
      song.play();
    } else {
      song.currentTime = 0;
      song.pause()
    }
    console.log(song.paused)
  
  }
// callSpotifyApi();