const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const db = require('./queries')
const pug = require('pug');

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', async(request, response) => {
    response.redirect("/books");
  })


app.get('/books', db.getBooks)

app.get('/book/:isbn', db.getBookInfo)
app.listen(port, () => {
console.log(`App running on port localhost:${port}.`)
})