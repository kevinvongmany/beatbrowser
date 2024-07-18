const wikipediaApiUrl = 'https://en.wikipedia.org/w/api.php';

const apiParams = {
    action: 'query',
    format: 'json',
    origin: '*',
    prop: 'extracts', // Get basic article information and an extract of the content.
    redirects: true, // Automatically resolve redirects.
    exintro: true, // Get only the introduction section of the article.
    explaintext: true, // Return the extract in plain text, not HTML.
};

function wikiSearchQuery(searchTerm, elementIndex) {
    apiParams.titles = searchTerm;
    let url = new URL(wikipediaApiUrl);
    url.search = new URLSearchParams(apiParams).toString();

    fetch(url)
        .then((response) => response.json())
        .then((result) => {
            if (result.query.pages[-1]) {
                assignToResults("No description available", "", elementIndex);
            } else {
                const longDescript = Object.values(result.query.pages)[0].extract
                const shortDescript = getFirstSentence(longDescript);
                const results = assignToResults(longDescript, shortDescript, elementIndex);
                renderDescription(results);
            }
        })
        .catch((error) => console.log("error", error));
}

function getFirstSentence(inputString) {
    try {
        const sentences = inputString.split("."); // Split the string into words
        return `${sentences[0]}.`;
    } catch (error) {
        return "No description available";
    }

}

function renderDescription(descriptions) {
  songData = JSON.parse(sessionStorage.getItem("songResults"));
//   console.log(songData);
//   console.log(descriptions[songData.spotify_id]);
  songData.forEach((result) => {
    const resultDiv = document.getElementById(`${result.spotify_id}`);
    const resultDescription = document.createElement("p");
    resultDescription.id = `description-${result.spotify_id}`;
    resultDescription.setAttribute("class", "text-sm text-gray-500");
    resultDescription.textContent = descriptions[result.spotify_id].short;
    resultDiv.appendChild(resultDescription);
  });
}

function assignToResults(long, short, elementIndex) {
    let resultsObj = JSON.parse(sessionStorage.getItem("descriptions")) || {};
    resultsObj[elementIndex] = {
        long: long,
        short: short
    };
    sessionStorage.setItem("descriptions", JSON.stringify(resultsObj));
    return resultsObj;
}