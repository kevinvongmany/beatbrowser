

// A function to dynamically add values to localStorage array
function addNewValue(newValue) {
    let options = JSON.parse(localStorage.getItem("songSearchHistory")) || [];

    if (!options.includes(newValue)) { // Check if the value already exists in the array, .includes() returns true or false
        options.push(newValue);
        localStorage.setItem("songSearchHistory", JSON.stringify(options));
        displayPreviousSearches();
    }
}

// A function to display the previous searches
function displayPreviousSearches() {
    clearResults();
    const songResults = document.getElementById("songResults");
    songResults.innerHTML = "";

    const options = JSON.parse(localStorage.getItem("songSearchHistory")) || [];
//     for (let i = 0; i < options.length; i++) {
//         const songElement = document.createElement("option");
//         songElement.textContent = options[i];
//         songElement.className = "song";
//         songResults.appendChild(songElement);
//     }
}
// function clearResults() {
//     sessionStorage.removeItem("songResults");
//     sessionStorage.removeItem("descriptions");
//     const resultsSection = document.getElementById("resultsSection");
//     const heroSection = document.getElementById("heroResult");
//     resultsSection.innerHTML = "";
//     heroSection.innerHTML = "";
//   }

document.addEventListener("DOMContentLoaded", displayPreviousSearches);
// document.getElementById("search-box").addEventListener("submit", (e) => {
//     e.preventDefault();
//     clearResults();
//     const newOptionInput = document.getElementById("songSearch");
//     const newOption = newOptionInput.value.trim();
//     if (newOption) {
//         console.log(newOption);
//         callSpotifyApi(newOption, limit=5, offset=0);
//         addNewValue(newOption);
//         newOptionInput.value = ""; // Clear the input
//     }
// });