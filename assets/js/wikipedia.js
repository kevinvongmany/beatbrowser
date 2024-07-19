const wikipediaApiUrl = "https://en.wikipedia.org/w/api.php";

const apiParams = {
  action: "query",
  format: "json",
  origin: "*",
  prop: "extracts", // Get basic article information and an extract of the content.
  redirects: true, // Automatically resolve redirects.
  exintro: true, // Get only the introduction section of the article.
  explaintext: true, // Return the extract in plain text, not HTML.
};

async function wikiSearchQuery(searchTerm, elementIndex, lastSearch=false) {
  apiParams.titles = searchTerm;
  let url = new URL(wikipediaApiUrl);
  url.search = new URLSearchParams(apiParams).toString();

  const res = await fetch(url)
  const result = await res.json()
  const descriptions = JSON.parse(sessionStorage.getItem("descriptions")) || {}
  if (!result.query.pages[-1] && !descriptions.hasOwnProperty(elementIndex)) {
    const longDescript = Object.values(result.query.pages)[0].extract;
    const shortDescript = getFirstSentence(longDescript);
    assignToResults(
      longDescript,
      shortDescript,
      elementIndex
    );
  } else if (lastSearch) {
    assignToResults(
        "No description available",
        "No description available",
        elementIndex
      );
  }
  return JSON.parse(sessionStorage.getItem("descriptions"));
    // })
    // .catch((error) => {
    //   console.error("Error:", error);
    //   assignToResults(
    //     "No description available",
    //     "No description available",
    //     elementIndex
    //   );
    // });
}

function getFirstSentence(inputString) {
  try {
    const sentences = inputString.split("."); // Split the string into words
    return `${sentences[0]}...`;
  } catch (error) {
    return "No description available";
  }
}

function renderDescription(descriptions, elementIndex) {
  const descriptionEl = document.getElementById(`description-${elementIndex}`);
  descriptionEl.textContent = descriptions[elementIndex].short;
}

function assignToResults(long, short, elementIndex) {
  let resultsObj = JSON.parse(sessionStorage.getItem("descriptions")) || {};
  resultsObj[elementIndex] = {
    long: long,
    short: short,
  };
  sessionStorage.setItem("descriptions", JSON.stringify(resultsObj));
  renderDescription(resultsObj, elementIndex);
}
