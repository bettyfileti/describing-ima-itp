let express = require("express");
let app = express();

let bodyParser = require("body-parser");
app.use(bodyParser.json());


//DB initial code
let Datastore = require("nedb");
let db = new Datastore("describeITP.db")
db.loadDatabase();

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


app.use ('/', express.static('public'));

app.listen(5000, () => {
    console.log("Listening at localhost: 5000");
});