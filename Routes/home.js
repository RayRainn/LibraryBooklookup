const express = require('express')
const router = express.Router()
const book = require('../models/book')

router.get('/', async (req, res) => {
  let books
  try {
    books = await book.find().sort({ createdAt: 'desc' }).limit(10).exec()
  } catch {
    books = []
  }
  res.render('home.ejs', { books: books })
})

module.exports = router