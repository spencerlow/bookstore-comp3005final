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

app.use(express.static('../code'));

app.get('/', async(request, response) => {
    response.redirect("/books");
  })

app.locals.currUID = 0;

app.get('/books', db.getBooks)
app.get('/book/:isbn', db.getBookInfo)
app.get('/addCart/:isbn', db.addCart)
app.get('/getCart/', db.getCart)

app.get('/users',db.getUsers)
app.get('/users/changeUser=:n', changeUser)

app.listen(port, () => {
console.log(`App running on port localhost:${port}.`)
})

function changeUser(req, res)
{
  console.log('test');
  console.log(req.url.split('=')[0]);
  console.log(req.url.split('=')[1]);
  app.locals.currUID = req.url.split('=')[1];
  res.status(200).redirect("http://localhost:3000/users");
  return;
}