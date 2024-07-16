const wikipediaApiUrl = 'https://en.wikipedia.org/w/api.php';

const apiParams = {
    action: 'query',
    format: 'json',
    origin: '*',
    prop: 'extracts', // Get basic article information and an extract of the content.
    exintro: true, // Get only the introduction section of the article.
    explaintext: true, // Return the extract in plain text, not HTML.
};

function wikiSearchQuery(searchTerm) {
    apiParams.titles = searchTerm;
    let url = new URL(wikipediaApiUrl);
    url.search = new URLSearchParams(apiParams).toString();
    console.log(url.search);
    console.log(url);

    fetch(url)
        .then((response) => response.json())
        .then((result) => {
            const longDescript = Object.values(result.query.pages)[0].extract
            const shortDescript = getFirstSentence(longDescript);
            assignToResults(longDescript, shortDescript, elementIndex);
        })
        .catch((error) => console.log("error", error));
}

console.log(wikiSearchQuery("My Chemical Romance"));

function getFirstSentence(inputString) {
    const sentences = inputString.split("."); // Split the string into words
    return `${sentences[0]}...`;

}

function assignToResults(long, short, elementIndex) {
    let resultsObj = JSON.parse(sessionStorage.getItem("results")) || {};
    resultsObj[elementIndex] = {
        long: long,
        short: short
    };
    sessionStorage.setItem("results", resultsObj);
}