const express = require('express')
const router = express.Router()
const Author = require('../models/authors')





//All routes

router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
      searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
      const authors = await Author.find(searchOptions)
      res.render('authors/index', {
        authors: authors,
        searchOptions: req.query
      })
    } catch {
      res.redirect('/')
    }
  })
// New Author Route
router.get('/new', (req, res) => {
    res.render('authors/new', { Author: new Author() })
 
}) 

//create author route

router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name
    })
    try {
        const newAuthor = await author.save()
        //res.redirect('authors/$(newAuthor.id)')
        res.redirect('authors')
    } catch {
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating Author'
        })
    }
})

module.exports = router


/*const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://woofwoofcr12:<randomschool1>@cluster0.0zrt9cv.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});*/
