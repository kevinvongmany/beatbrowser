// const spotifyData = JSON.parse(response); // spotifyData to store sampledata from ./sampledata/spotify.js 
// console.log(spotifyData); // Display the spotifyData in the console
let currentOffset = 0; // store the current offset value
const initiallimit = 5; // store the initial limit value for first 5 songs to display
const incrementlimit = 5; // store the increment limit value for next 5 songs to display
document.getElementById("search-box").addEventListener("submit", (e) => {
    e.preventDefault();
    clearResults();
    const songSearchInput = document.getElementById("songSearch");
    const query = songSearchInput.value.trim();
    if (query) {
        console.log(query);
        callSpotifyApi(query, limit=50, offset=0);
        addNewValue(query);
        songSearchInput.value = ""; // Clear the input
        document.getElementById("seeMoreBtn").classList.remove("hidden"); // Display the "See More" button after search, innitially hidden in searchbutton.html
    }
});

function clearResults() {
    sessionStorage.removeItem("songResults");
    sessionStorage.removeItem("descriptions");
    const resultsSection = document.getElementById("searchResults");
    const heroSection = document.getElementById("heroResult");
    resultsSection.innerHTML = "";
    heroSection.innerHTML = "";
  }

  
// Event listener for the search button
// document.getElementById("spotifySearchBtn").addEventListener("click", () => {
//     currentOffset = 0; // have the first offset value as 0
//     const query = document.getElementById("songSearch").value.trim();
//     if (query) {
//         const results = spotifyData.tracks.items.filter(song => song.name.toLowerCase().includes(query.toLowerCase())); // Filter the songs based on the search query and toLowerCase to handle user input of any case.
//         sessionStorage.setItem('searchResults', JSON.stringify(results));
//         displaySearchResults(true); 
//         document.getElementById("seeMoreBtn").classList.remove("hidden"); // Display the "See More" button after search, innitially hidden in searchbutton.html
//     }
// });

// Event listener for the see more button
document.getElementById("seeMoreBtn").addEventListener("click", () => {
    if (currentOffset < 10) {
        currentOffset = currentOffset + incrementlimit; // Increment the offset value as the user clicks on the "See More" button to display 5 more results
    } else {
        currentOffset = currentOffset + initiallimit;  // Add 10 more songs if more than 10 songs are displayed
    }
    displaySearchResults();
});

function displaySearchResults(isInitial = false) {
    const songResults = document.getElementById("songResults");

    // Clear previous results if it's an initial search or if 10 songs are already displayed
    if (isInitial || currentOffset >= 10) {
        songResults.innerHTML = ''; // Clear previous results for a new search or after 10 songs
    }

    const results = JSON.parse(sessionStorage.getItem('searchResults')) || [];
    
    // Determine the limit of songs to display based on whether it's an initial search or not
    let limit;
    if (isInitial) {
        limit = initiallimit; // Use initial limit of songs
    } else {
        limit = incrementlimit; // Use increment limit to show more songs
    }

    const end = currentOffset + limit; // Calculate the end value to display the songs
    let songsToDisplay = [];

    // Slice the results array to get the songs to display
    for (let i = currentOffset; i < end && i < results.length; i++) {
        songsToDisplay.push(results[i]);
    }

    if (songsToDisplay.length > 0) {
        songsToDisplay.forEach(song => {
            const songElement = createSongElement(song);
            songResults.appendChild(songElement);
        });
    } else {
        document.getElementById("seeMoreBtn").classList.add("hidden");
    }

    // Hide the "See More" button if no more songs to display
    if (currentOffset + limit >= results.length) {
        document.getElementById("seeMoreBtn").classList.add("hidden");
    }
}

// This function used to create the song element to display in the UI 
function createSongElement(track){
    const songElement = document.createElement("div");
    songElement.className = "track";
    // Song title
    const songTitle = document.createElement("h3");
    songTitle.textContent = track.name; 
    songElement.appendChild(songTitle);
    // Artist name
    const artists = document.createElement("p");
    artists.textContent = `Artist: ${track.artists[0].name}`;
    artists.className = "artist";
    songElement.appendChild(artists);
    // Album name
    const album = document.createElement("p");
    album.textContent = `Album: ${track.album.name}`;
    album.className = "album";
    songElement.appendChild(album);
    // Preview URL
    const previewUrl = document.createElement("a");
    previewUrl.textContent = "Preview";
    previewUrl.href = track.preview_url;
    previewUrl.target = "_blank";
    songElement.appendChild(previewUrl);
    return songElement;
}

// Hide the see more button on initial load
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("seeMoreBtn").classList.add("hidden");
});