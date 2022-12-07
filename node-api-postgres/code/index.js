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
// local variable for the next UID if a new user is made?:
//local variable for current URL

app.get('/books', db.getBooks)
app.get('/book/:isbn', db.getBookInfo)
app.get('/addCart/:isbn', db.addCart)
app.get('/removeFromCart/:isbn', db.removeFromCart)
app.get('/getCart/', db.getCart)
app.get('/createOrder/', db.createOrder)
app.get('/users',db.getUsers)
app.get('/users/changeUser=:n', changeUser)

app.get('/users/addUser',db.addUser)
//app.get('/users/addUser?shipping=:uShipping&billing=:uBilling',db.addUser)

app.get('/search',search)

app.get('/search?',db.searchQuery)

app.listen(port, () => {
console.log(`App running on port localhost:${port}.`)
})


// change currUID based on url

function changeUser(req, res)
{
  console.log('test');
  console.log(req.url.split('=')[0]);
  console.log(req.url.split('=')[1]);
  app.locals.currUID = req.url.split('=')[1];
  res.status(200).redirect("http://localhost:3000/users");
  return;
}

function search(req,res)
{
  res.status(200).send(pug.renderFile("search.pug",{currUID:app.locals.currUID}));
  return;
}
