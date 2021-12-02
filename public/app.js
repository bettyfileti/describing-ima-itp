window.addEventListener('load', () => {

    //Display the descriptions from the database
    fetch('/getDescriptions')
        .then(res => res.json())
        .then(data => {

            let allDescriptions = data.data;

            for (let i = 0; i < allDescriptions.length; i++) {
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
        console.log("CLICK")
        let newDescription = document.getElementById("description-input").value;
        console.log(newDescription);

        let newAttribution = "student"
        // let newAttribution = document.getElementById("description-type").value;
        // console.log(newAttribution);

        let obj = {
            "description": newDescription,
            "attribution": newAttribution,
            "approved": true,
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
    theNewDescription.appendChild(newContentDescription);

    describedByDiv.appendChild(theNewDescription);

    console.log(attribution);
    let newContentAttribution = document.createElement('p');

    //attribution content
    if (attribution === "student") {
        describedByDiv.className = "described-by-student";
        newContentAttribution.innerHTML = "(from a student)";

    } else if (attribution === "common") {
        describedByDiv.className = "described-by-common";
        newContentAttribution.innerHTML = "(commonly used description)";

    } else if (attribution === "alumni") {
        describedByDiv.className = "described-by-alumni";
        newContentAttribution.innerHTML = "(from an alumni)";

    } else if (attribution === "professor") {
        describedByDiv.className = "described-by-professor";
        newContentAttribution.innerHTML = "(from a professor)";

    } else if (attribution === "friend") {
        describedByDiv.className = "described-by-friend";
        newContentAttribution.innerHTML = "(from a friend of the program)";
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
