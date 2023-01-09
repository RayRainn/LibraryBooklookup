const express = require('express')
const router = express.Router()
const Author = require('../models/authors')
const Book = require('../models/book')





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


router.get('/:id', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id)
    const books = await Book.find({ author: author.id }).limit(6).exec()
    res.render('authors/show', {
      author: author,
      booksByAuthor: books
    })
  } catch {
    res.redirect('/')
  }
})


//Delete confirmation page
router.get('/:id/delete', async (req, res) => {
    const author = await Author.findById(req.params.id)
    const books = await Book.find({ author: author.id }).limit(6).exec()
    res.render('authors/confirmation', {
      author: author,
      booksByAuthor: books
    })
  
})


router.post('/:id/delete', async (req, res) => {
  
  let author
  try{
 
    author = await Author.findById(req.params.id)
    
    await author.remove()
    res.redirect('/authors')   
 } catch {
    res.render('authors')
 }
})

   
       
  
  
router.get('/:id/edit', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id)
    res.render('authors/edit', { Author: author })  //use the "author name which was added"
  } catch {
    res.redirect('/authors')
  }
})

router.post('/:id/edit', async (req, res) => {
  let author
  
    author = await Author.findById(req.params.id)
    author.name = req.body.name
    await author.save()
    res.redirect(`/authors/${author.id}`)
 


      res.render('authors/edit', {
        author: author,
        errorMessage: 'Error updating Author'
      })
    
  
})


router.post('/:id', async (req, res) => {
  
  let author
 
    author = await Author.findById(req.params.id)
    console.log(author)
    await author.remove()
    res.redirect('/authors')
})
  

module.exports = router









/*
router.get('/:id', (req, res) => {
  res.send('Show Author ' + req.params.id)
})

router.get('/:id/edit', async (req, res) => {
  try{
    const author = await Author.findById(req.params.id)
    res.render('authors/edit', {author: author})


  } catch {
    res.redirect('/authors')

  } 
}) 


router.put('/:id', (req, res)=> {
  res.send('Update Author '+ req.params.id)
})

router.delete('/:id', async (req, res) => {
  let author
  try {
    author = await Author.findById(req.params.id)
    await author.remove()
    res.redirect('/authors')
  } catch {
    if (author == null) {
      res.redirect('/')
    } else {
      res.redirect(`/authors/${author.id}`)
    }
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
