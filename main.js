const express = require('express')
const path = require('path')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const fs = require('fs')
const app = express()
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");
const wordToGuess = words[Math.floor(Math.random() * words.length)]
const wordLength = wordToGuess.split("")
const letters = []
let letterSlots = []
let count = 8

letterSlots = wordLength.map( x => {
  return (x = '_ ')
  }).join('')

console.log(wordLength);
console.log(wordToGuess);
console.log(letterSlots);

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.engine('mustache', mustacheExpress())

app.set('views', './views')
app.set('view engine', 'mustache')

app.get('/', function(req, res) {
  res.render('index', { letters : letters, letterSlots : letterSlots, wordToGuess : wordToGuess, words : words })
})

app.post('/add', function(req, res) {
  if (letters.indexOf('letters') > -1) {
    console.log(letter);
  } else {
    letters.push({ letter: req.body.letterGuessed })
  }

  // if letter exists, place in that slot
  // if letter does not exist, add to list

  res.redirect('/')
})

app.listen(3000, function() {
  console.log('Successfully started express application!')
})
