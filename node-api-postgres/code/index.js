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

// local variable for current user's UID
app.locals.currUID = 0;
//Routes
app.get('/books', db.getBooks)
app.get('/book/:isbn', db.getBookInfo)
app.get('/addCart/:isbn', db.addCart)
app.get('/removeFromCart/:isbn', db.removeFromCart)
app.get('/getCart/', db.getCart)
app.get('/createOrder/', db.createOrder)
app.get('/users',db.getUsers)
app.get('/users/changeUser=:n', changeUser)

app.get('/users/addUser',db.addUser)
app.get('/search',search)
app.get('/filter?',db.searchQuery)
app.get('/reports',db.reports)
app.get('/report/1',db.report1)
app.get('/report/2',db.report2)
app.get('/report/3',db.report3)
app.get('/controlPanel',db.controlPanel)
app.get('/removeBook/:isbn',db.removeBook)

//Port
app.listen(port, () => {
console.log(`App running on port localhost:${port}.`)
})


//Changeuser based on url
function changeUser(req, res)
{
  app.locals.currUID = req.url.split('=')[1];
  res.status(200).redirect("http://localhost:3000/users");
  return;
}

//Search
function search(req,res)
{
  res.status(200).send(pug.renderFile("search.pug",{currUID:app.locals.currUID,table:{rows:{}},columns:{}}));
  return;
}
