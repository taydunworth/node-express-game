const express = require('express')
const path = require('path')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const fs = require('fs')
const app = express()
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n")
const wordToGuess = words[Math.floor(Math.random() * words.length)]
const wordLength = wordToGuess.split("")
const guess = []
let count = 8
let message = ''

let placeholder = wordLength.map(x => {
  return '_'
})

console.log(wordToGuess);

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.engine('mustache', mustacheExpress())

app.set('views', './views')
app.set('view engine', 'mustache')

app.get('/', function(req, res) {
  res.render('index', { guess : guess, placeholder : placeholder, count: count, message: message })
})

app.get('/win', function(req, res) {
  res.render('win')
})

app.get('/lose', function(req, res) {
  res.render('lose')
})

app.post('/add', function(req, res) {

  if (wordLength.includes(req.body.letterGuessed)) {
    wordLength.forEach(function(letter, index) {
      // if that letter is the letter the user guessed
      if (letter === req.body.letterGuessed) {
        // Replace that *INDEX* within the placeholder with the letter
        placeholder[index] = letter
      }
    })
  } else {
    count -= 1
    if (placeholder.join(',') != wordLength.join(',') && count <= 0) {
      message = 'You lose!'
      console.log(message)
      res.redirect('/lose')
    }
  }

  guess.push({ letter: req.body.letterGuessed })


  if (placeholder.join(',') === wordLength.join(',') && count >= 0) {
    message = 'You win!'
    console.log(message)
    res.redirect('/win')
  }
  res.redirect('/')
})


app.listen(3000, function() {
  console.log('Successfully started express application!')
})
