const express = require('express')
const path = require('path')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const fs = require('fs')
const expressSession = require('express-session')

const app = express()

const words = fs.readFileSync('/usr/share/dict/words', 'utf-8').toLowerCase().split('\n')

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(
  expressSession({
    secret: 'hangman',
    resave: false,
    saveUninitialized: true
  })
)

app.engine('mustache', mustacheExpress())

app.set('views', './views')
app.set('view engine', 'mustache')

app.get('/', function(req, res, next) {
  if (!req.session.splitWord) {
    const wordToGuess = words[Math.floor(Math.random() * words.length)]
    // split the array
    req.session.splitWord = wordToGuess.split('')
    req.session.placeholder = req.session.splitWord.map(x => {
      return '_'
    })
    req.session.guess = []
    req.session.count = 8
  }
  const _data = { guess: req.session.guess, placeholder: req.session.placeholder, count: req.session.count }
  res.render('index', _data)
})

app.get('/win', function(req, res) {
  res.render('win')
})

app.get('/lose', function(req, res) {
  req.session.splitWord = undefined
  res.render('lose')
})

app.post('/add', function(req, res) {
  if (req.session.splitWord.includes(req.body.letterGuessed)) {
    req.session.splitWord.forEach(function(letter, index) {
      // if that letter is the letter the user guessed
      if (letter === req.body.letterGuessed) {
        // Replace that *INDEX* within the placeholder with the letter
        req.session.placeholder[index] = letter
      }
    })
  } else {
    req.session.count -= 1
    if (req.session.placeholder.join(',') != req.session.splitWord.join(',') && req.session.count <= 0) {
      res.redirect('/lose')
    }
  }

  req.session.guess.push({ letter: req.body.letterGuessed })

  if (req.session.placeholder.join(',') === req.session.splitWord.join(',') && req.session.count >= 0) {
    res.redirect('/win')
  }
  res.redirect('/')
})

app.listen(3000, function() {
  console.log('Successfully started express application!')
})
