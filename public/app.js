window.addEventListener('load', () => {
    console.log("loading");
    //Display the descriptions from the database
    fetch('/getDescriptions')
        .then(res => res.json())
        .then(data => {

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


    //For capturing the new descriptions in the database
    document.getElementById("btn-form").addEventListener("click", () => {
        let newDescription = document.getElementById("description-input").value;

        let newAttribution;
        let radioButtons = document.getElementsByClassName("description-type");

        for (let i = 0; i < radioButtons.length; i++) {
            console.log(radioButtons[i].checked);
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

let modal = document.getElementById("myModal");
let btn = document.getElementById("myBtn");
let span = document.getElementsByClassName("close")[0];

btn.onclick = function () {
    modal.style.display = "block";
}

span.onclick = function () {
    modal.style.display = "none";
}

window.onclick = function () {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

let wordsToCheck = [];
//Word on timing to make this dynamic!
getWordsToCheck("Three words: Collaboration, Experimentation, and Community A place that embraces 'learning by doing.' Looking at how technology might augment, improve, and bring delight, utility or meaning into people's lives. The place I went to engage with the newest of the new media.")

function getWordsToCheck(description){
    console.log("Check me!", description);
    description = description.replace(/[^\w\s]|_/g, "")
    .replace(/\s+/g, " "); //https://stackoverflow.com/questions/4328500/how-can-i-strip-all-punctuation-from-a-string-in-javascript-using-regex
    let newWords = description.split(" ")
    for (let i = 0; i < newWords.length; i++){
        wordsToCheck.push(newWords[i]);
    }

    wordsToCheck = shuffle(wordsToCheck);
}

//https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) { //
    let currentIndex = array.length,  randomIndex;
  
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
//adding p5 sketch

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    antImg.width = width;
    synImg.width = width;
}

let otherWords;

let synonyms = [];
let antonyms = [];
let backgroundWords = [];
let bgColor = "white";
let fontColor = "light-pink";
let synImg;
let antImg;

function preload() {
    otherWords = loadJSON("assets/syn-ant-updated.json", useJSON);
}

let yPos = document.getElementById("top-banner").clientHeight;
function setup() {
    let cnv = createCanvas(windowWidth + 16, displayHeight + 200);
    cnv.position(0, yPos);
    cnv.parent("container");

    pixelDensity(1);
  
    synImg = getImages(synonyms);
    antImg = getImages(antonyms);
    
    background("white")
}

function draw() {
  
    let radius = 100;
    image(antImg, 0, 0);
    let mouseDraw = get(mouseX - radius/2, mouseY - radius/2, radius, radius)
    image(synImg, 0, 0);
    image(mouseDraw, mouseX - radius/2, mouseY - radius/2, radius, radius);
    
  }

  function mousePressed(){
      console.log("synonyms:", synonyms);
      console.log("antonyms:", antonyms);
  }
  
  function drawMask(){
    fill(255, 255, 255, 50)
    ellipse(mouseX, mouseY, 40, 40);
  }
  
  function useJSON() {

    console.log("checking these for synonyms:", wordsToCheck);
    
    for (let i = 0; i < wordsToCheck.length; i++) {
      wordsToCheck[i] = wordsToCheck[i].toLowerCase();
    }
  
    for (let i = 0; i < otherWords.words.length; i++) {
      let thisWord = otherWords.words[i];
  
      for (let j = 0; j < wordsToCheck.length; j++) {
        let wordToCheck = wordsToCheck[j];
        if (thisWord.KEY == wordToCheck) {
          if (thisWord.SYN) {
            thisWord.SYN.forEach((element) => synonyms.push(element));
          }
  
          if (thisWord.ANT) {
            thisWord.ANT.forEach((element) => antonyms.push(element));
          }
        }
      }
    }
  
  }
  
  function getImages(wordArray) {
    if (wordArray == synonyms) {
      backgroundWords = synonyms;
      bgColor = "white";
      fontColor = "lightpink";
    } else {
      backgroundWords = antonyms;
      bgColor = "lightpink";
      fontColor = "white";
    }
  
    fill(bgColor);
    noStroke();
    rect(0, 0, width, height);
    fill(fontColor);
  
    let lineHeight = 60;
  
    push();
    translate(width / 2, height / 2);
    translate(-width / 2, -height / 2);
  
    let wordLine = "";
    for (let i = 0; i < backgroundWords.length; i++) {
      wordLine = wordLine + backgroundWords[i] + "                ";
    }
  
    for (let i = 0; i < 10; i++) {
      wordLine = wordLine + wordLine;
    }
  
    textWrap(WORD);
    textLeading(lineHeight);
    textSize(14);
    text(wordLine, -10, 0, width + 100, height + lineHeight);
  
    pop();
  
    let img = get();  
    return img;
  }
  
  