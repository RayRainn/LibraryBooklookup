const dotenv = require("dotenv");

dotenv.config();

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')

const bodyParser = require('body-parser')

const indexRouter = require('./Routes/index')
const authorRouter = require('./Routes/authors')
const bookRouter = require('./Routes/books')


app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)

app.use(express.static('public'))
const methodOverride = require('method-override')
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false}))





const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {
useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

app.use('/', indexRouter)
app.use('/authors', authorRouter)
app.use('/books', bookRouter)



app.listen(process.env.PORT || 3000)



/*<meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link href="https://unpkg.com/filepond/dist/filepond.css" rel="stylesheet">
    <link href="https://unpkg.com/filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css" rel="stylesheet">
    <script defer src="https://unpkg.com/filepond-plugin-image-preview/dist/filepond-plugin-image-preview.js"></script>
    <script defer src="https://unpkg.com/filepond-plugin-file-encode/dist/filepond-plugin-file-encode.js"></script>
    <script defer src="https://unpkg.com/filepond-plugin-image-resize/dist/filepond-plugin-image-resize.js"></script>
    <script defer src="https://unpkg.com/filepond/dist/filepond.js"></script>
    <script defer src="/javascripts/fileUpload.js"></script>
*/
