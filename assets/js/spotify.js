let authHeaders = new Headers();
authHeaders.append(
  "Cookie",
  "__Host-device_id=AQDQdpaqyLgDRTAl9w0iaxV5KJ5s0CnWtRp684z_RND--jilc5eTMOmnR6bGdjUC55N3FUvHHdWhJk_dGEoZPcXv-3TyC0flyVQ; sp_tr=false"
);
authHeaders.append("Content-Type", "application/x-www-form-urlencoded");
let token;

let authRequestOptions = {
  method: "POST",
//   GET
//  POST
  headers: authHeaders,
  redirect: "follow",
};


fetch(
  "https://accounts.spotify.com/api/token?grant_type=client_credentials&client_id=REDACTED&client_secret=REDACTED",
  authRequestOptions
)
  .then((response) => response.json())
  // .then((result) => console.log(result))
  .then((result) => searchQuery(result.access_token, "track"))
  .catch((error) => console.log("error", error));

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
