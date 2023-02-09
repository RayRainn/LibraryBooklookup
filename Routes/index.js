


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
router.get('/', (req, res) => {
  res.render('index')

}) 


router.get('/login', async (req, res) => {
  res.render('login')
  
})

router.post('/login', async (req, res) => {
  console.log("HI")
  try{  
    const valid=await users.findOne({name:req.body.name})
    if (valid.password===req.body.password){
      res.render('home')
    
    }
    else{
      console.log("HI")
      res.send("Incorrect Password Try again?")
      res.render('home')
    }
  }catch{
    console.log("HI")
    res.render('home')
  }
})


//Register and upload to DB 
router.post('/', async (req, res) => {
  
  const user = ({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    

  })
  await users.insertMany([user])
  
    res.redirect('/')
  })


  
  
module.exports = router