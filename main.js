const express = require('express')
const path = require('path')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const app = express()

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.engine('mustache', mustacheExpress())

app.set('views', './views')
app.set('view engine', 'mustache')

app.get('/', function(req, res) {
  res.send('testing')
})

app.listen(3000, function() {
  console.log('Successfully started express application!')
})
