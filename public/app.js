let otherWords;
let wordsToCheck = [];
let runCount = 0;

let modal = document.getElementById("myModal");
let btn = document.getElementById("myBtn");
let closeBTN = document.getElementsByClassName("close")[0];

let highLightElements = document.getElementsByClassName("highlight");

window.addEventListener('load', () => {
    console.log("loading");

    //Display the descriptions from the database
    fetch('/getDescriptions')
        .then(res => res.json())
        .then(data => {
            console.log("We've got the db.")
            let allDescriptions = data.data;

            for (let i = 0; i < allDescriptions.length; i++) {
                //Also add words to wordsToCheck for BG
                getWordsToCheck(allDescriptions[i].description);

                let newElementDescription = document.createElement('p');
                newElementDescription.innerHTML = allDescriptions[i].description;

                let newElementAttribution = document.createElement('p');
                newElementAttribution.innerHTML = allDescriptions[i].attribution;

                let newElementHasApproval = allDescriptions[i].approved;

                if (newElementHasApproval) {
                    createNewDescription(allDescriptions[i].description, allDescriptions[i].attribution)
                }
            }
        })
        .then(data => {
            //Get synonyms and antonyms
            fetch('/send-syn-ant')
                .then(res => res.json())
                .then(data => {
                    console.log("We have the synonyms.")
                    otherWords = data;;
                })
                .then(findSynonyms)
                .then(makeWordsInteractive)
        })


    //For capturing the new descriptions in the database
    document.getElementById("btn-form").addEventListener("click", () => {
        let newDescription = document.getElementById("description-input").value;

        let newAttribution;
        let radioButtons = document.getElementsByClassName("description-type");

        for (let i = 0; i < radioButtons.length; i++) {
            if (radioButtons[i].checked) {
                newAttribution = radioButtons[i].value;
            }
        }

        if (newAttribution === "from a friend of the program") {
            newAttribution = "friend";
        } else if (newAttribution === "from a professor") {
            newAttribution = "professor";
        } else if (newAttribution === "from a student") {
            newAttribution = "student";
        } else if (newAttribution === "from an alumni") {
            newAttribution = "alumni";
        }
        else {
            newAttribution = document.getElementById("other_reason").value;
        }

        let obj = {
            "description": newDescription,
            "attribution": newAttribution,
            "approved": true,
        }

        if (obj.approved) {
            createNewDescription(obj.description, obj.attribution)
            getWordsToCheck(obj.description)
        }

        let jsonData = JSON.stringify(obj);

        fetch('/captureDescription', {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: jsonData
        })
            .then(response => response.json())
            .then(data => { console.log(data) })

    });

})


//--------------------------------------------------------------
function createNewDescription(description, attribution) {
    let newDiv = document.createElement("div");
    newDiv.className = "description-container"

    let describedByDiv = document.createElement("div");

    //description content
    let newContentDescription = document.createElement("p");
    newContentDescription.innerHTML = description;

    let theNewDescription = document.createElement("div");
    theNewDescription.className = "the-description";
    theNewDescription.prepend(newContentDescription);

    describedByDiv.prepend(theNewDescription);

    let newContentAttribution = document.createElement('p');

    //attribution content
    if (attribution === "student") {
        describedByDiv.className = "described-by-student";
        newContentAttribution.innerHTML = "from a student";

    } else if (attribution === "alumni") {
        describedByDiv.className = "described-by-alumni";
        newContentAttribution.innerHTML = "from an alumni";

    } else if (attribution === "professor") {
        describedByDiv.className = "described-by-professor";
        newContentAttribution.innerHTML = "from a professor";

    } else if (attribution === "friend") {
        describedByDiv.className = "described-by-friend";
        newContentAttribution.innerHTML = "from a friend of the program";
    } else {
        describedByDiv.className = "described-by-common";
        newContentAttribution.innerHTML = attribution;
    }


    let theNewAttribution = document.createElement("div");
    theNewAttribution.className = "the-attribution";
    theNewAttribution.appendChild(newContentAttribution);

    describedByDiv.appendChild(theNewAttribution);

    // add to the newly created div
    newDiv.appendChild(describedByDiv);

    // add the newly created element and its content into the DOM
    let currentDiv = document.getElementById("allDescriptions");
    currentDiv.appendChild(newDiv);
}


//REF: https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement


//--------------------------------------------------------------
//Modal Box: https://www.w3schools.com/howto/howto_css_modals.asp
//--------------------------------------------------------------

btn.onclick = function () {
    modal.style.display = "block";
}

closeBTN.onclick = function () {
    modal.style.display = "none";
}

window.onclick = function () {
    if (Event.target == modal) {
        modal.style.display = "none";
    }
}


function getWordsToCheck(description) {
    description = description.replace(/[^\w\s]|_/g, "")
        .replace(/\s+/g, " "); //https://stackoverflow.com/questions/4328500/how-can-i-strip-all-punctuation-from-a-string-in-javascript-using-regex
    let newWords = description.split(" ")
    for (let i = 0; i < newWords.length; i++) {
        wordsToCheck.push(newWords[i]);
    }

    wordsToCheck = shuffle(wordsToCheck);
}

//https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) { //
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

//--------------------------------------------------------------
//

let wordObjects = [];

function findSynonyms() {
    wordsToCheck.forEach((element => element.toLowerCase()));

    for (let i = 0; i < otherWords.words.length; i++) {
        let thisWord = otherWords.words[i];

        for (let j = 0; j < wordsToCheck.length; j++) {
            let wordToCheck = wordsToCheck[j];

            if (thisWord.KEY == wordToCheck) {
                wordObjects.push(thisWord);
            }
        }
    }

    console.log("myList!", wordObjects);
}

function makeWordsInteractive() {
    let divsToCheck = document.querySelectorAll(".the-description p");
    for (let i = 0; i < divsToCheck.length; i++) {
        let myHTML = divsToCheck[i].innerHTML;
        let newHTML = myHTML;

        let strippedHTML = myHTML.replace(/[^\w\s]|_/g, "")
            .replace(/\s+/g, " "); //https://stackoverflow.com/questions/4328500/how-can-i-strip-all-punctuation-from-a-string-in-javascript-using-regex
        strippedHTML = strippedHTML.split(" ")

        for (let i = 0; i < strippedHTML.length; i++) {
            let divWord = strippedHTML[i].toLowerCase();
            let spanHTML = divWord;
            for (let j = 0; j < wordObjects.length; j++) {
                if (divWord == wordObjects[j].KEY) {
                    spanHTML = '<span class = "highlight">';
                    spanHTML = spanHTML + divWord;
                    spanHTML = spanHTML + '</span>'
                    newHTML = newHTML.replace(divWord, spanHTML);
                }
            }
        }
        divsToCheck[i].innerHTML = newHTML;
        highlightElements = document.getElementsByClassName("highlight");

        Array.from(highlightElements).forEach(function (highlightElements) {
            highlightElements.addEventListener("click", function () {
                showSynonyms(event);
            });
            highlightElements.addEventListener("mouseout", function () {
                resetEvents(event);
            });
        });
    }
}

function showSynonyms(eve) {
    if (runCount > 0){
        
    } else {
        let triggerWord = eve.target.innerText;
        console.log(triggerWord);
        for (let i = 0; i < wordObjects.length; i++) {
            if (triggerWord == wordObjects[i].KEY) {
                eve.srcElement.id = wordObjects[i].KEY;
                let index;
    
                if (wordObjects[i].ANT) {
                    let whichOne = (Math.floor(Math.random() * 2) == 0);
                    if (whichOne) {
                        index = Math.floor(Math.random() * (wordObjects[i].SYN.length - 1));
    
                        eve.srcElement.className = "highlightSyn";
                        eve.srcElement.innerText = wordObjects[i].SYN[index];
                        updateEventListeners();
    
                    } else {
                        index = Math.floor(Math.random() * (wordObjects[i].ANT.length - 1));
    
                        eve.srcElement.className = "highlightAnt";
                        eve.srcElement.innerText = wordObjects[i].ANT[index];
                        updateEventListeners();
                    }
    
                } else {
                    index = Math.floor(Math.random() * (wordObjects[i].SYN.length - 1));
    
                    eve.srcElement.innerText = wordObjects[i].SYN[index];
                    eve.srcElement.className = "highlightSyn";
                    updateEventListeners();
                }
    
    
            } else if (eve.srcElement.id == wordObjects[i].KEY) {
                eve.target.innerText = wordObjects[i].KEY;
                eve.srcElement.className = "highlight"
                updateEventListeners();
            }
        }
    }
    
    runCount++;

}

function resetEvents(){
    runCount = 0;
    updateEventListeners();
}

function updateEventListeners() {
    let elements = document.getElementsByClassName("highlightAnt");
    Array.from(elements).forEach(function (elements) {
        elements.addEventListener("click", function () {
            showSynonyms(event);
        });
        elements.addEventListener("mouseout", function () {
            resetEvents(event);
        });
    });

    elements = document.getElementsByClassName("highlightSyn");
    Array.from(elements).forEach(function (elements) {
        elements.addEventListener("click", function () {
            showSynonyms(event);
        });
        elements.addEventListener("mouseout", function () {
            resetEvents(event);
        });
    });

    elements = document.getElementsByClassName("highlight");
    Array.from(elements).forEach(function (elements) {
        elements.addEventListener("click", function () {
            showSynonyms(event);
        });
        elements.addEventListener("mouseout", function () {
            resetEvents(event);
        });
    });
}