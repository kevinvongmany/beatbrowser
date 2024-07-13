// Create a sample values
const sampleValues = ["1", "2", "3"];

// Save it to localStorage
localStorage.setItem("dropDownListElements", JSON.stringify(sampleValues)); 
// * dropDownListElements is a key
// ** localStorage in web browsers can only store data as strings -> JSON.stringify()

// A function to take (sample values) from localStorage and pass them into a dropdown list
// problaby select any options from dropdown list
function dropDownList() {
    const dropdown = document.getElementById("dropDownListElements");
    dropdown.innerHTML = ""; // Clear out old values before adding new ones
    // Get the array from localStorage and load it
    const options = JSON.parse(localStorage.getItem("dropDownListElements")) || []; // if the array is null or underfined, return an empty array instead.
    for (let i = 0; i <options.length; i++) {
        const option = document.createElement("option"); // create an <option> element 
        // Value and textContent in here is ["1", "2", "3"]
        option.value = options[i];
        option.textContent = options[i]; 
        dropdown.appendChild(option); // append <option> element to <select> element
    }
}

// Call the function to populate the dropdown when the page loads
document.addEventListener("DOMContentLoaded", dropDownList);

// A function to dynamically add values to localStorage array
function addNewValue(newValue) {
    let options = JSON.parse(localStorage.getItem("dropDownListElements")) || [];

    options.push(newValue);
    localStorage.setItem("dropDownListElements", JSON.stringify(options));
    dropDownList();
}

document.getElementById("addSongBtn").addEventListener("click", () => {
    const newOptionInput = document.getElementById("newOptionInput");
    const newOption = newOptionInput.value.trim();
    if (newOption) {
        addNewValue(newOption);
        newOptionInput.value = ""; // Clear the input
    }
});
