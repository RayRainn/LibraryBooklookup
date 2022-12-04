require('dotenv').config()

const express = require('express')
const app = express()
//require basically pulls what we import like dependencies from java
const jwt = require('jsonwebtoken')

const bcrypt = require('bcrypt')

app.use(express.json())

const posts = [{
    username: 'Royce',
    title: 'Welcome R'
},
{
    username: 'Kyle',
    title: 'Welcome T'
}]



app.get('/posts', authenticateToken, (req, res) => {
      res.json(posts.filter(post => post.username === req.user.name))
      //pull from const posts 
})


app.post('/login', (req, res) => {
    //Authenticate User

    const username = req.body.username

    const user = {name: username}

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.json({ accessToken: accessToken})


})


function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]
    if (token == null) return res.sendStatus(401)


    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)

        req.user = user 
        next()
    })

}









// for the site 



if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const methodOverride = require('method-override')
const flash = require('express-flash')
const session = require('express-session')
const passport = require('passport')
const initializePassport = require('./passport-config.js')
const e = require('express')
initializePassport( 
    passport,
     email => users.find(user => user.email === email),
     id => users.find(user => user.id === id)
)
 


app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))


app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', { name: req.user.name})
     
})

app.get('/loginuser', checkNotAuthenticated, (req, res) => {
    res.render('loginuser.ejs')
})


app.post('/loginuser', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/loginuser',
    failureFlash: true,
}))


app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
})
const users = []

app.post('/register', async (req, res ) => {
    try{
        const hashedPassword = await bcrypt.hash(req.body.password,10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        res.redirect('/loginuser')
    } catch{ 
        res.redirect('register')
    }    
})

app.delete('/logout', (req, res, next) => {
    req.logOut()
    res.redirect('/login')
  })
  
  function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/login')
  }
  
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
  }
  

app.listen(3000)