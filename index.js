let express = require("express");
let bodyParser = require("body-parser");
let mongoose = require("mongoose");
let exphbs = require('express-handlebars')
let dotenv = require('dotenv');

let axios = require("axios");
let cheerio = require("cheerio");


// Require all models
let db = require("./models/");

let PORT = 3000;

// Initialize Express
let app = express();
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set('view engine', 'handlebars');
dotenv.config();

// Configure middleware

// Use morgan logger for logging requests

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/week18Populater");

// Routes
app.get('/', (req, res) => {
    res.render('index')
})
app.get('/articles/saved', (req,res)=>{
    db.Article.find({}).populate('note').then(data=>{
        console.log(data);
        res.render('saved-articles', {data})
    })
})

// A GET route for scraping the echoJS website
app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with request
    axios.get("http://www.echojs.com/").then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        let $ = cheerio.load(response.data);

        // Now, we grab every h2 within an article tag, and do the following:
        $("article h2").each(function (i, element) {
            // Save an empty result object
            let result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this)
                .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");

            // Create a new Article using the `result` object built from scraping
            db.Article.findOne({ title: result.title }).then(data => {
                if (data === null) {
                    db.Article.create(result)
                        .then(function (dbArticle) {
                            // View the added result in the console
                            console.log(dbArticle);
                        })
                        .catch(function (err) {
                            // If an error occurred, send it to the client
                            return res.json(err);
                        });
                }
                return;
            }).catch(err => {
                console.log(err);

            })

        });

        // If we were able to successfully scrape and save an Article, send a message to the client
        res.send("Scrape Complete");
    });
});

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {

    // TODO: Finish the route so it grabs all of the articles
    axios.get("http://www.echojs.com/").then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        let $ = cheerio.load(response.data);
        let articles = [];
        // Now, we grab every h2 within an article tag, and do the following:
        $("article h2").each(function (i, element) {
            // Save an empty result object
            let result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this)
                .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");

            // Create a new Article using the `result` object built from scraping
            db.Article.findOne({ title: result.title }, data => {
                if (data === null) {
                    articles.push(result);
                    if (i === $("article h2").length - 1) {
                        res.json(articles);
                    }
                }
            })
        })
        // res.json(articles);

    });
});
app.post('/article/save', (req, res) => {
    db.Article.create(req.body)
        .then(function (dbArticle) {
            // View the added result in the console
            return res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            return res.json(err);
        });
})
app.post('/article/:id/notes/add', (req,res)=>{
    db.Note.create(req.body)
        .then(not =>{
            console.log(not);
            return db.Article.findByIdAndUpdate(req.params.id, { note : not._id}, {new: true}).populate('note')
        }).then(articles=>{
            res.json(articles);
        }).catch(err=>{
            res.json(err);
        })
})
app.delete('/note/:id', (req,res)=>{
    db.Note.remove({_id: req.params.id});
})
app.put('/notes/update/:id', (req,res)=>{
    db.Note.findByIdAndUpdate(req.params.id, req.body).then(data=>{
        console.log(data);
        res.json({body:req.body.body, _id: req.params.id});
    }).catch(err=>{
        res.json(err);
    })
})
// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
    // TODO
    // ====
    // Finish the route so it finds one article using the req.params.id,
    // and run the populate method with "note",
    // then responds with the article with the note included
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
    // TODO
    // ====
    // save the new note that gets posted to the Notes collection
    // then find an article from the req.params.id
    // and update it's "note" property with the _id of the new note
});

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
