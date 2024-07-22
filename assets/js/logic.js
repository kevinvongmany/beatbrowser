let currentOffset = 1; 
const initialLimit = 50; 
const incrementLimit = 4; 
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
        document.getElementById("seeMoreBtn").classList.remove("hidden"); 
    }
});

function clearResults() {
    sessionStorage.removeItem("songResults");
    sessionStorage.removeItem("descriptions");
    const resultsSection = document.getElementById("searchResults");
    const heroSection = document.getElementById("heroResult");
    resultsSection.innerHTML = "";
    heroSection.innerHTML = "";
    currentOffset = 1; 
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

});


document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', function(event) {
    const songCard = event.target.closest('.parent-result');
    if (songCard) {
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
    document.getElementById('modal-title').textContent = song.name;
    document.getElementById('artistName').textContent = `Artist: ${song.artist}`;
    document.getElementById('albumName').textContent = `Album: ${song.album}`;
    document.getElementById('songInfo').textContent = description;
    const volumeEl = document.getElementById('volume');
    if (song.preview) {
        document.getElementById('listenOnSpotify').classList.remove('hidden');
        document.getElementById('volume').classList.remove('hidden');
        document.getElementById('volume-icon').classList.remove('hidden');
        loadSong(song.preview);
        if (songElement) {
            volumeEl.addEventListener("input", () => {
                let volumeValue = volumeEl.value;
                songElement.volume = volumeValue / 100;
            });
            document.getElementById('listenOnSpotify').addEventListener('click', () => {
                toggleSong(songElement);
            });
        }
    } else {
        document.getElementById('listenOnSpotify').classList.add('hidden');
        document.getElementById('volume').classList.add('hidden');
        document.getElementById('volume-icon').classList.add('hidden');
    }
    const modal = document.getElementById('modal');
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
    
    stopSong(songElement);
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
}

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