


const express = require('express')
const router = express.Router()
const users = require('../models/users')
const book = require('../models/book')

router.get('/home', async (req, res) => {
  let books
  try {
    books = await book.find().sort({ createdAt: 'desc' }).limit(10).exec()
  } catch {
    books = []
  }
  res.render('home.ejs', { books: books })
})



//Login user
router.get('/register', (req, res) => {
  res.render('register')

}) 


router.get('/', async (req, res) => {
  res.render('index')
  
})

router.post('/', async (req, res) => {
  
  
  try{  
    const valid=await users.findOne({name:req.body.name})
    if (valid.password===req.body.password){
      res.render('home/index')
    //<%- include('partials/bookGrid', { books: books, large: true }) %> 
    //move this to  home.ejs when fixed
    }
    else{
    
  
      res.render('index')
    }
  }catch{
   
    res.render('index')
  }
})


//Register and upload to DB 
router.post('/register', async (req, res) => {
  
  const user = ({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    

  })
  await users.insertMany([user])
  
    res.redirect('/')


  
  })


  
  
module.exports = router