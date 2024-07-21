// const spotifyData = JSON.parse(response); // spotifyData to store sampledata from ./sampledata/spotify.js 
// console.log(spotifyData); // Display the spotifyData in the console
let currentOffset = 1; // store the current offset value
const initialLimit = 50; // store the initial limit value for first 5 songs to display
const incrementLimit = 4; // store the increment limit value for next 5 songs to display
const searchHistory = document.getElementById("dropDownListElements");
const songElement = document.getElementById('audio'); 

document.getElementById("search-box").addEventListener("submit", (e) => {
    e.preventDefault();
    clearResults();
    const songSearchInput = document.getElementById("songSearch");
    const query = songSearchInput.value.trim();
    if (query) {
        const history = JSON.parse(localStorage.getItem("songHistory")) || [];
        if (!history.includes(query)) {
            history.push(query);
        }
        localStorage.setItem("songHistory", JSON.stringify(history));
        renderPreviousSearches();
        callSpotifyApi(query, initialLimit, 0);
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
    currentOffset = 1; // Reset the offset value (this is used to force clear the 10 songs displayed and display 10 new songs)
}

function renderPreviousSearches() {
    const history = JSON.parse(localStorage.getItem("songHistory")) || [];
    searchHistory.innerHTML = "";
    defaultOption = document.createElement("option");
    defaultOption.textContent = "Select to view previous searches";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    searchHistory.appendChild(defaultOption);
    for (let i = 0; i < history.length; i++) {
        const songElement = document.createElement("option");
        songElement.textContent = history[i];
        songElement.className = "song";
        searchHistory.appendChild(songElement);
    }
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
    currentOffset += incrementLimit; // Increment the offset value as the user clicks on the "See More" button to display 5 more results
    for (i = currentOffset; i < currentOffset + incrementLimit; i++) {
        console.log(`song-result-card-${i}`)
        const resultDiv = document.getElementById(`song-result-card-${i}`);
        resultDiv.classList.remove("hidden");
    }
    if (currentOffset + incrementLimit >= 50) {
        document.getElementById("seeMoreBtn").classList.add("hidden");
    }
    // if (currentOffset < 10) {
    //     currentOffset = currentOffset + incrementLimit; // Increment the offset value as the user clicks on the "See More" button to display 5 more results
    // } else {
    //     currentOffset = currentOffset + initialLimit;  // Add 10 more songs if more than 10 songs are displayed
    // }
    // displaySearchResults();
});

function displaySearchResults(isInitial = false) {
    const songResults = document.getElementById("songResults");

    // Clear previous results if it's an initial search or if 10 songs are already displayed
    if (isInitial || currentOffset >= 10) {
        songResults.innerHTML = ''; // Clear previous results for a new search or after displaying 10 songs
    }

    const results = JSON.parse(sessionStorage.getItem('searchResults')) || [];
    
    // Determine the limit of songs to display based on whether it's an initial search or not
    let limit;
    if (isInitial) {
        limit = initialLimit; // Use initial limit of songs
    } else {
        limit = incrementLimit; // Use increment limit to show more songs
    }

    const end = currentOffset + limit; // Calculate the end value to display the songs
    const songsToDisplay = results.slice(currentOffset, end); // Slice the results array to get the songs to display
    // Use a traditional for loop to process and render songs
    for (let i = 0; i < songsToDisplay.length; i++) {
        const song = songsToDisplay[i];
        renderSongResults(song); // Use renderSongResults from spotify.js
    }
     // Check and hide the "See More" button if no more songs to display
    if (currentOffset + limit >= results.length) {
        document.getElementById("seeMoreBtn").classList.add("hidden");
    } else {
        document.getElementById("seeMoreBtn").classList.remove("hidden"); // Show button if there are more songs
    }

    // Update the current offset
    currentOffset += limit;
}

// Event listener for the "See More" button
// document.getElementById("seeMoreBtn").addEventListener("click", () => {
//     displaySearchResults(); // Display more songs when button is clicked
// });

// This function used to create the song element to display in the UI 
// function createSongElement(track){
//     const songElement = document.createElement("div");
//     songElement.className = "track";
//     // Song title
//     const songTitle = document.createElement("h3");
//     songTitle.textContent = track.name; 
//     songElement.appendChild(songTitle);
//     // Artist name
//     const artists = document.createElement("p");
//     artists.textContent = `Artist: ${track.artists[0].name}`;
//     artists.className = "artist";
//     songElement.appendChild(artists);
//     // Album name
//     const album = document.createElement("p");
//     album.textContent = `Album: ${track.album.name}`;
//     album.className = "album";
//     songElement.appendChild(album);
//     // Preview URL
//     const previewUrl = document.createElement("a");
//     previewUrl.textContent = "Preview";
//     previewUrl.href = track.preview_url;
//     previewUrl.target = "_blank";
//     songElement.appendChild(previewUrl);
//     return songElement;
// }

// loop through all of the parent-div classes
// assign an event listener of click to each of the parent-div classes
// grab the data spotify_id from the event
// find the data in sessionStorage.songResults and sessionStorage.descriptions
// Update Modal the modal with that data
// 
document.addEventListener('DOMContentLoaded', () => {
    // Event delegation to make song cards clickable
    document.body.addEventListener('click', function(event) {
    const songCard = event.target.closest('.parent-result');
    if (songCard) {
        console.log('Song card clicked:', songCard); // Debugging line
        const songId = songCard.dataset.spotify_id;
        const songResults = JSON.parse(sessionStorage.getItem('songResults'));
        const songDescriptions = JSON.parse(sessionStorage.getItem('descriptions'));
        const songInfo = songResults.find(song => song.spotify_id === songId);
        console.log(songId);
        const songDescription = songDescriptions[songId] ? songDescriptions[songId].long : 'Description not available';
        console.log(songDescription);
        showModal(songInfo, songDescription);
    }
});
    // console.log(document.getElementById('modal-close'));
    document.getElementById('modal-close').addEventListener('click', closeModal);
});

function showModal(song, description) {
    console.log('Show modal for song:', song); // Debugging line
    document.getElementById('modal-title').textContent = song.name;
    document.getElementById('artistName').textContent = `Artist: ${song.artist}`;
    document.getElementById('albumName').textContent = `Album: ${song.album}`;
    document.getElementById('songInfo').textContent = description;
    const volumeEl = document.getElementById('volume');
    console.log("Song preview: ");
    console.log(song.preview);
    if (song.preview) {
        document.getElementById('listenOnSpotify').classList.remove('hidden');
        document.getElementById('volume').classList.remove('hidden');
        document.getElementById('volume-icon').classList.remove('hidden');
        loadSong(song.preview);
        console.log("Show Modal song element: ");
        console.log(songElement);
        if (songElement) {
            volumeEl.addEventListener("input", () => {
                let volumeValue = volumeEl.value;
                songElement.volume = volumeValue / 100;
            });
            console.log(songElement);
            document.getElementById('listenOnSpotify').addEventListener('click', () => {
                toggleSong(songElement);
            });
        }
    } else {
        document.getElementById('listenOnSpotify').classList.add('hidden');
        document.getElementById('volume').classList.add('hidden');
        document.getElementById('volume-icon').classList.add('hidden');
    }
    console.log("Opening Modal"); 
    const modal = document.getElementById('modal');
    console.log(modal);
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
    
    stopSong(songElement);
    console.log("Closing Modal"); 
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
}

// Hide the see more button on initial load
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("seeMoreBtn").classList.add("hidden");
    renderPreviousSearches();
});

// 
searchHistory.addEventListener("change", (e) => {
    const query = e.target.value;
    clearResults();
    callSpotifyApi(query, initialLimit, 0);
    document.getElementById("seeMoreBtn").classList.remove("hidden");
});