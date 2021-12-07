let express = require("express");
let app = express();

let bodyParser = require("body-parser");
app.use(bodyParser.json());

//Load JSON
let synJSON = require('./public/assets/syn-ant-updated.json');
app.get('/send-syn-ant', (req, res) => {
    res.json(synJSON);
})

//DB initial code
let Datastore = require("nedb");
const { response } = require("express");
let db = new Datastore("describeITP.db")
db.loadDatabase();

//Used to retrieve data
app.get('/getDescriptions', (req, res) => {
    db.find({}, (err, docs) => {

        if (err) {
            res.json({ task: "task failed" })
        } else {
            let obj = { data: docs };
            res.json(obj);
        }
    })

})

//Update data
app.post('/captureDescription', (req, res) => {

    let obj = req.body;
    console.log(obj);

    //insert data into database
    db.insert(obj, (err, newDocs) => {
        if (err) {
            res.json({ task: "task failed" });
        } else {
            res.json({ task: "success: description was added to database" }); //ALWAYS have to send back to client
        }
    })

})

app.use ('/', express.static('public'));

//--------------------------------------------------------------


//FOR TESTING IT LOCALLY
app.listen(5000, () => {
    console.log("Listening at localhost:5000");
});

//node index.js
//------

//FOR DEPLOYING TO HEROKU
// app.listen(process.env.PORT, () => {
//     console.log("Listening to");
// });

// git add -A .
// git commit -m "first commit"
// git push heroku main
