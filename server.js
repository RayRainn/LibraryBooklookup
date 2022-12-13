require('dotenv').config()








//ACCESS_TOKEN_SECRET=fc68e0796bbcee42221518ecfd1ea2f5102e422db864067e7d39cb6becfb528bab6d3f6ec9dcce9240f6d3ffe132d65976a64a0386fbf70de7a3cbdadf6ce15b
//REFRESH_TOKEN_SECRET=6ce40ed706a2706e285e2a9bd55094d4ae9172e4e2b84b326cba5e1a6f57b969eeb5cdf6e28e162fdd644735d0b66f4ad163a65ec6410685505bf02219cc3986
//SESSION_SECRET=5a291f9ce34336ed907e0cfe5cff4d7c323c01877866ac3bdf6c34dcfead8cb2728cdcd2f8407029a80f932fa02974c8f515b7cc46ea9397a304d05f23e01298


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
    res.render('test1.ejs', { name: req.user.name})
     
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