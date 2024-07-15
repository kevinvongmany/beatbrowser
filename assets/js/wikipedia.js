const wikipediaApiUrl = 'https://en.wikipedia.org/w/api.php';

const apiParams = {
    action: 'query',
    format: 'json',
    origin: '*',
    prop: 'extracts', // Get basic article information and an extract of the content.
    inprop: 'url', // Get the full URL of the article.
    exintro: true, // Get only the introduction section of the article.
    explaintext: true, // Return the extract in plain text, not HTML.
};

function searchQuery(searchTerm) {
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
            assignToHTML(longDescript, shortDescript);
        })
        .catch((error) => console.log("error", error));
}

console.log(searchQuery("My Chemical Romance"));

function getFirstSentence(inputString) {
    const sentences = inputString.split("."); // Split the string into words
    return `${sentences[0]}...`;

}

function assignToHTML(long, short) {
    console.log(long);
    console.log(short);
}